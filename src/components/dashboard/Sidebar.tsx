import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { NavLink } from "@/utils/Navlink";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import CogIcon from "@rsuite/icons/legacy/Cog";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import { useState } from "react";
import { Nav, Navbar, Sidebar as ResuiteSidebar, Sidenav } from "rsuite";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import BarLineChartIcon from "@rsuite/icons/BarLineChart";
import "./SIdeNavStyle.css";
import TreemapIcon from "@rsuite/icons/Treemap";
import DocPassIcon from "@rsuite/icons/DocPass";
import {
  financialReportItem,
  generalMenuItems,
  investigationMenuItems,
  labReportMenuItems,
  userMenuItem,
} from "./menuItems";
interface NavToggleProps {
  expand: boolean;
  onChange: () => void;
}

const NavToggle = ({ expand, onChange }: NavToggleProps) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: "center" }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const Sidebar = () => {
  const [expand, setExpand] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  return (
    <div className="shadow-lg">
      <ResuiteSidebar
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "93vh",
          justifyContent: "space-between",
          overflowY: "hidden",
          zIndex: 10884,
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body
            style={{
              maxHeight: "85vh",
              overflowY: "scroll",
            }}
            className="custom-scroll"
          >
            <Nav>
              <AuthCheckerForComponent
                requiredPermission={[
                  ENUM_USER_PEMISSION.GET_DOCTORS,
                  ENUM_USER_PEMISSION.MANAGE_DOCTORS,
                  ENUM_USER_PEMISSION.GET_EMPLOYEE,
                  ENUM_USER_PEMISSION.MANAGE_EMPLOYEE,
                  ENUM_USER_PEMISSION.GET_COMPANY_INFO,
                  ENUM_USER_PEMISSION.MANAGE_COMPANY_INFO,
                  ENUM_USER_PEMISSION.GET_PATIENT,
                  ENUM_USER_PEMISSION.MANAGE_PATIENT,
                  ENUM_USER_PEMISSION.GET_HOSPITAL_GROUP,
                  ENUM_USER_PEMISSION.MANAGE_HOSPITAL_GROUP,
                  ENUM_USER_PEMISSION.GET_COMPANY_INFO,
                  ENUM_USER_PEMISSION.MANAGE_COMPANY_INFO,
                  ENUM_USER_PEMISSION.GET_INVOICE_MARGIN,
                  ENUM_USER_PEMISSION.MANAGE_INVOICE_MARGIN,
                ]}
              >
                <Nav.Menu
                  eventKey="1"
                  trigger="hover"
                  title={<div className="font-bold text-black">General</div>}
                  icon={<GearCircleIcon />}
                  placement="rightStart"
                >
                  {generalMenuItems.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`1-${item.key}`}
                        href={item.href}
                        as={NavLink}
                        key={item.key}
                        onClick={() => setSelectedItem(item.href)}
                        style={
                          selectedItem === item.href
                            ? {
                                backgroundColor: "#3498ff",
                                color: "white",
                                borderRadius: "5px",
                              }
                            : {
                                color: "black",
                              }
                        }
                      >
                        {item.title}
                      </Nav.Item>
                    </AuthCheckerForComponent>
                  ))}
                </Nav.Menu>
              </AuthCheckerForComponent>
              <AuthCheckerForComponent
                requiredPermission={[
                  ENUM_USER_PEMISSION.GET_USER,
                  ENUM_USER_PEMISSION.MANAGE_USER,
                  ENUM_USER_PEMISSION.USER,
                  ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
                  ENUM_USER_PEMISSION.GET_PERMISSIONS,
                ]}
              >
                <Nav.Menu
                  eventKey="2"
                  trigger="hover"
                  title={
                    <div className="font-bold text-black">Manage Users</div>
                  }
                  icon={<UserInfoIcon />}
                  placement="rightStart"
                >
                  {userMenuItem.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`2-${item.key}`}
                        href={item.href}
                        as={NavLink}
                        key={Number(item.key) + 20}
                        onClick={() => setSelectedItem(item.href)}
                        style={
                          selectedItem === item.href
                            ? {
                                backgroundColor: "#3498ff",
                                color: "white",
                                borderRadius: "5px",
                              }
                            : {
                                color: "black",
                              }
                        }
                      >
                        {item.title}
                      </Nav.Item>
                    </AuthCheckerForComponent>
                  ))}
                </Nav.Menu>
              </AuthCheckerForComponent>
              <AuthCheckerForComponent
                requiredPermission={[
                  ENUM_USER_PEMISSION.GET_TESTS,
                  ENUM_USER_PEMISSION.MANAGE_TESTS,
                  ENUM_USER_PEMISSION.GET_ORDER,
                  ENUM_USER_PEMISSION.MANAGE_ORDER,
                  ENUM_USER_PEMISSION.GET_DEPARTMENT,
                  ENUM_USER_PEMISSION.MANAGE_TESTS,
                  ENUM_USER_PEMISSION.GET_TESTS,
                  ENUM_USER_PEMISSION.MANAGE_TESTS,
                  ENUM_USER_PEMISSION.GET_TESTS,
                  ENUM_USER_PEMISSION.MANAGE_TESTS,
                ]}
              >
                <Nav.Menu
                  eventKey="3"
                  trigger="hover"
                  title={
                    <div className="font-bold text-black">Investigation</div>
                  }
                  icon={<TreemapIcon />}
                  placement="rightStart"
                >
                  {investigationMenuItems.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`3-${item.key}`}
                        href={item.href}
                        as={NavLink}
                        key={Number(item.key) + 20}
                        onClick={() => setSelectedItem(item.href)}
                        style={
                          selectedItem === item.href
                            ? {
                                backgroundColor: "#3498ff",
                                color: "white",
                                borderRadius: "5px",
                              }
                            : {
                                color: "black",
                              }
                        }
                      >
                        {item.title}
                      </Nav.Item>
                    </AuthCheckerForComponent>
                  ))}
                </Nav.Menu>
              </AuthCheckerForComponent>
              <AuthCheckerForComponent
                requiredPermission={[
                  ENUM_USER_PEMISSION.GET_REPORT_TYPE,
                  ENUM_USER_PEMISSION.MANAGE_REPORT_TYPE,
                  ENUM_USER_PEMISSION.GET_REPORT_GROUP,
                  ENUM_USER_PEMISSION.MANAGE_REPORT_GROUP,
                  ENUM_USER_PEMISSION.GET_BATCROLOGICAL_INFORMATION,
                  ENUM_USER_PEMISSION.MANAGE_BATCROLOGICAL_INFORMATION,
                  ENUM_USER_PEMISSION.GET_COMMENT,
                  ENUM_USER_PEMISSION.MANAGE_COMMENT,
                  ENUM_USER_PEMISSION.GET_DOCTORS_SEAL,
                  ENUM_USER_PEMISSION.MANAGE_DOCTORS_SEAL,
                  ENUM_USER_PEMISSION.GET_LAB_REPORTS,
                  ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS,
                  ENUM_USER_PEMISSION.GET_TESTS,
                  ENUM_USER_PEMISSION.GET_ORDER,
                ]}
              >
                <Nav.Menu
                  eventKey="4"
                  trigger="hover"
                  title={
                    <div className="font-bold text-black">Lab Reports</div>
                  }
                  icon={<DocPassIcon />}
                  placement="rightStart"
                >
                  {labReportMenuItems.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`4-${item.key}`}
                        href={item.href}
                        as={NavLink}
                        key={Number(item.key) + 20}
                        onClick={() => setSelectedItem(item.href)}
                        style={
                          selectedItem === item.href
                            ? {
                                backgroundColor: "#3498ff",
                                color: "white",
                                borderRadius: "5px",
                              }
                            : {
                                color: "black",
                              }
                        }
                      >
                        {item.title}
                      </Nav.Item>
                    </AuthCheckerForComponent>
                  ))}
                </Nav.Menu>
              </AuthCheckerForComponent>
              <AuthCheckerForComponent
                requiredPermission={[ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT]}
              >
                <Nav.Menu
                  eventKey="5"
                  trigger="hover"
                  title={
                    <div className="font-bold text-black">
                      Financial Reports
                    </div>
                  }
                  icon={<BarLineChartIcon />}
                  placement="rightStart"
                >
                  {financialReportItem.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`5-${item.key}`}
                        href={item.href}
                        as={NavLink}
                        key={Number(item.key) + 20}
                        onClick={() => setSelectedItem(item.href)}
                        style={
                          selectedItem === item.href
                            ? {
                                backgroundColor: "#3498ff",
                                color: "white",
                                borderRadius: "5px",
                              }
                            : {
                                color: "black",
                              }
                        }
                      >
                        {item.title}
                      </Nav.Item>
                    </AuthCheckerForComponent>
                  ))}
                </Nav.Menu>
              </AuthCheckerForComponent>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </ResuiteSidebar>
    </div>
  );
};

export default Sidebar;
