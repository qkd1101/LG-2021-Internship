
const Gpio = require("onoff").Gpio;
const shell = require("shelljs");

const pir = new Gpio(21, "in", "both");

pir.watch(function(err, value) {
  if (err) exit();

  if ( value == 1) {
    console.log("detected");
  
    Goshell();
  }
  

  function Goshell() {
    if( shell.exec('. ~/env/bin/activate; googlesamples-assistant-pushtotalk --project-id mins-3 --device-model-id mins-3-2mins-k4p6n1').code !== 0) {
   
       
       shell.echo('Error');
       shell.exit(1);
   
    }
    //included when we are working with sensors
    pir.unexport();
    //process.exit();
  }
  
});