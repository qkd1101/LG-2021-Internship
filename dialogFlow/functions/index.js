// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

var https = require('https');
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ai-speaker-320402-default-rtdb.firebaseio.com',
});

const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

    function userNotification(agent) {
      const name = agent.parameters.person.name;

      console.log('----------------userNotification');
      return getUserName(name)
        .then(selectTask)
        .then(directionAPI)
        .then((result) => agent.add(result));
    }

    const getUserName = (name) =>
      new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const hours = new Date().getHours();
        const date =
          hours >= 15 ? new Date().getDate() + 1 : new Date().getDate();

        const taskRef = db
          .collection('127.0.0.1')
          .doc(name)
          .collection(`${year}`)
          .doc(`${month}`)
          .collection(`${date}`);

        const taskArr = [];

        taskRef.get().then((docs) => {
          docs.forEach((doc) => {
            const taskObj = {
              name: name,
              what: doc.data().what,
              time: doc.data().time,
              item: doc.data().item,
              ori: {
                lat: doc.data().ori.lat,
                lng: doc.data().ori.lng,
                name: doc.data().ori.name,
              },
              dest: {
                lat: doc.data().dest.lat,
                lng: doc.data().dest.lng,
                name: doc.data().dest.name,
              },
            };
            taskArr.push(taskObj);
          });
          // console.log(taskArr);
          resolve(taskArr);
        });
      });

    const selectTask = (taskArr) =>
      new Promise((resolve, reject) => {
        const nowHour = (new Date().getHours() + 9) % 24;
        const nowMinutes = new Date().getMinutes();
        const nowTime = `${nowHour}:${nowMinutes}`;
        let minIdx = -1;
        let minTime = `24:60`;
        for (let i = 0; i < taskArr.length; i++) {
          if (taskArr[i].time < nowTime) {
            continue;
          }
          if (taskArr[i].time <= minTime) {
            minTime = taskArr[i].time;
            minIdx = i;
          }
        }

        if (minIdx === -1) resolve(-1);
        else resolve(taskArr[minIdx]);
      });

    function directionAPI(taskArr) {
      if (taskArr === -1)
        return new Promise((resolve, reject) => {
          resolve('There is no schedule');
        });
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${taskArr.ori.lat},${taskArr.ori.lng}&destination=${taskArr.dest.lat},${taskArr.dest.lng}&mode=transit&departure_time=now&key=AIzaSyC1OwESx5NVjf-N4YzORD27-zWCpijJQAc`;

      return new Promise((resolve, reject) => {
        https.get(url, function (res) {
          console.log('**************************');
          var json = '';
          res.on('data', function (chunk) {
            json += chunk;
          });

          res.on('end', function () {
            let data = JSON.parse(json);
            var path = data.routes[0].legs[0]; //basic path
            var duration_sec = path.duration.value; //걸리는시간
            var departure_time = path.departure_time.value;

            var travle_path = data.routes[0].legs[0].steps; //이동경로 path

            let r = '';

            for (var index = 0; index < travle_path.length; index++) {
              var travle_mode = travle_path[index].travel_mode;
              if (travle_mode == 'TRANSIT') {
                //만약 이동수단이 대중교통인 경우
                var transit_path = travle_path[index].transit_details; //대중교통 정보 path
                var arrival_stop = transit_path.arrival_stop.name; //출발 정류장
                var departure_stop = transit_path.departure_stop.name; //도착 정류장
                var transit_comming_time = transit_path.departure_time.value;
                var transit_infromation = transit_path.line.short_name; //대중교통 정보(버스 번호)

                if (taskArr.time.slice(3, 5) == 0) {
                  r = `${taskArr.name}! Today's task is ${
                    taskArr.what
                  } at ${taskArr.time.slice(0, 2)} o'clock. Don't forget ${
                    taskArr.item
                  }!
                  You have to get the ${transit_infromation} bus ${parseInt(
                    (transit_comming_time - departure_time) / 60
                  )} minutes after at ${arrival_stop} station.`;
                } else {
                  r = `${taskArr.name}! Today's task is ${
                    taskArr.what
                  } at ${taskArr.time.slice(0, 2)} ${taskArr.time.slice(
                    3,
                    5
                  )}. Don't forget ${taskArr.item}!
                You have to get the ${transit_infromation} bus ${parseInt(
                    (transit_comming_time - departure_time) / 60
                  )} minutes after at ${arrival_stop} station.`;
                }
              }
            }

            r +=
              'And the taking time is ' +
              parseInt(duration_sec / 60) +
              ' minutes.';
            // console.log(r);
            resolve(r);
          });
        });
      });
    }

    let intentMap = new Map();
    intentMap.set(`getName`, userNotification);

    agent.handleRequest(intentMap);
  }
);
