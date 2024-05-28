/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import SideBarItems from "@/utils/SideBarItems";
import "./layout";
import React, { ReactNode, useEffect } from "react";
import { Container, Header, Sidenav, Content, Nav, Loader } from "rsuite";
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
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hook";
import { redirect } from "next/navigation";
import Loading from "../loading";
interface ILayoutProps {
  children: ReactNode;
  expand: any;
  onChange: any;
}

export default function layout({ children, expand, onChange }: ILayoutProps) {
  const userLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const loading = useAppSelector((state) => state.loading.loading);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  if (!loading && userLoggedIn) {
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

  if (!loading && !userLoggedIn) {
    redirect("/signin");
  }
}
