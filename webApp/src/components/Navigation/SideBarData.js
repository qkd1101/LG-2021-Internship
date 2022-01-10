import React from "react";
import * as BsIcons from "react-icons/bs";
import * as FsIcons from "react-icons/fa";
import { authService } from "../../fbase";

const onLogout = async () => {
  await authService.signOut();
};
export const SideBarData = [
  {
    title: "Profile",
    path: "/profile",
    icon: <BsIcons.BsPersonBoundingBox />,
    cName: "nav-text",
  },
  {
    title: "Home",
    path: "/",
    icon: <BsIcons.BsFillHouseDoorFill />,
    cName: "nav-text",
  },
  {
    title: "Log Out",
    path: "/",
    icon: <FsIcons.FaSignOutAlt />,
    cName: "nav-text",
    onClick: onLogout,
  },
];
