"use client";
import SideBarItems from "@/utils/SideBarItems";
import "./layout";
import React, { ReactNode } from "react";
import { Container, Header, Sidenav, Content, Nav } from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import DashboardIcon from "@rsuite/icons/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Navbar } from "@/layout/Navbar";
interface ILayoutProps {
  children: ReactNode;
  expand: any;
  onChange: any;
}

export default function layout({ children, expand, onChange }: ILayoutProps) {
  return (
    <div className=" sidebar-page min-h-[90vh]">
      <Container>
        <Navbar />
        <Container className="rs-container-has-sidebar">
          <Sidebar />
          <Container>
            <Content className="">{children}</Content>
          </Container>
        </Container>
      </Container>
    </div>
  );
}
