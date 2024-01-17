"use client";
import SideBarItems from "@/utils/SideBarItems";
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
    <div className="show-fake-browser sidebar-page">
      <Navbar></Navbar>
      <Container>
        <Sidebar />
        <Container>
          <Content className="min-h-[100vh]">{children}</Content>
        </Container>
      </Container>
    </div>
  );
}
