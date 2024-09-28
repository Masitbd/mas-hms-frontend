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
import "./SIdeNavStyle.css";

interface NavToggleProps {
  expand: boolean;
  onChange: () => void;
}

const NavToggle = ({ expand, onChange }: NavToggleProps) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Nav.Menu
          noCaret
          placement="topStart"
          trigger="click"
          title={<CogIcon style={{ width: 20, height: 20 }} />}
        >
          <Nav.Item>Help</Nav.Item>
          <Nav.Item>Settings</Nav.Item>
          <Nav.Item>Sign out</Nav.Item>
        </Nav.Menu>
      </Nav>

      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: "center" }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
const userMenuItem = [
  {
    key: "1",
    title: "Users",
    href: "/users",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_USER,
      ENUM_USER_PEMISSION.MANAGE_USER,
    ],
  },
  {
    key: "2",
    title: "Profile",
    href: "/profile",
    requiredPermission: [ENUM_USER_PEMISSION.USER],
  },
  {
    key: "3",
    title: "Permissions",
    href: "/permission",
    requiredPermission: [
      ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
      ENUM_USER_PEMISSION.GET_PERMISSIONS,
    ],
  },
];

const testMenuItem = [
  {
    key: "4",
    title: "Department",
    href: "/department",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_DEPARTMENT,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "5",
    title: "Hospital Group",
    href: "/hospitalGroup",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_HOSPITAL_GROUP,
      ENUM_USER_PEMISSION.MANAGE_HOSPITAL_GROUP,
    ],
  },
  {
    key: "6",
    title: "Specimen",
    href: "/specimen",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "7",
    title: "Vacumme Tube",
    href: "/vacuumTube",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "8",
    title: "Test",
    href: "/test",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "9",
    title: "Doctor",
    href: "/doctor",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_DOCTORS,
      ENUM_USER_PEMISSION.MANAGE_DOCTORS,
    ],
  },
  {
    key: "10",
    title: "Order",
    href: "/order",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_ORDER,
      ENUM_USER_PEMISSION.MANAGE_ORDER,
    ],
  },
  {
    key: "11",
    title: "Patient",
    href: "/patient",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_PATIENT,
      ENUM_USER_PEMISSION.MANAGE_PATIENT,
    ],
  },
  {
    key: "12",
    title: "Report Type",
    href: "/reportType",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "13",
    title: "Report Group",
    href: "/reportGroup",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "14",
    title: "Bactrological Info",
    href: "/bactrologicalInfo",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "14",
    title: "Test Reports",
    href: "/testReport",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_LAB_REPORTS,
      ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS,
    ],
  },
  {
    key: "15",
    title: "Comment",
    href: "/comment",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "16",
    title: "Doctor Seal",
    href: "/doctorSeal",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "17",
    title: "Company Info",
    href: "/companyInfo",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_COMPANY_INFO,
      ENUM_USER_PEMISSION.MANAGE_COMPANY_INFO,
    ],
  },
  {
    key: "18",
    title: "Employee",
    href: "/employee",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_EMPLOYEE,
      ENUM_USER_PEMISSION.MANAGE_EMPLOYEE,
    ],
  },
  {
    key: "18",
    title: "Label Print",
    href: "/label-print",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
      ENUM_USER_PEMISSION.GET_ORDER,
    ],
  },
];

const financialReportItem = [
  {
    key: "1",
    title: "Overall Commission",
    href: "/financialReport/commission",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "2",
    title: "Doctor's Performance",
    href: "/financialReport/commission/single",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "3",
    title: "Income Statement- Test Wise",
    href: "/financialReport/incomeStatement/testWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "4",
    title: "Income Statement- Department Wise",
    href: "/financialReport/incomeStatement/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "5",
    title: "Collection Summery- Department Wise",
    href: "/financialReport/collectionSummery/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "6",
    title: "Doctor Performance - Test Wise",
    href: "/financialReport/doctorsPerformance/testWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "6",
    title: "Doctor Performance - Department Wise",
    href: "/financialReport/doctorsPerformance/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "17",
    title: "Income Statement",
    href: "/income-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "18",
    title: " Employee Income Statement",
    href: "/employee-income-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "19",
    title: "Employee Income Statement Summery",
    href: "/emp-income-summery",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "20",
    title: "Due Bills Details",
    href: "/due-bills",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "21",
    title: "Clientwise Inocme Statement",
    href: "/client-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "22",
    title: "Employee Ledger Summery",
    href: "/employee-ledger",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "23",
    title: "Income By Refd Doctor",
    href: "/ref-doctor-income",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "24",
    title: "Doctors",
    href: "/financialReport/doctors",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "25",
    title: "Tests",
    href: "/financialReport/tests",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "26",
    title: "Employee Performance",
    href: "/financialReport/employee-performance",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
];

const Sidebar = () => {
  const [expand, setExpand] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  return (
    <div>
      <ResuiteSidebar
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "88vh",
          justifyContent: "space-between",
          overflowY: "hidden",
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body
            style={{
              maxHeight: "85vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="custom-scroll"
          >
            <Nav>
              <Nav.Menu
                eventKey="3"
                trigger="hover"
                title="Test Params"
                icon={<MagicIcon />}
                placement="rightStart"
              >
                {testMenuItem.map((item, index) => (
                  <AuthCheckerForComponent
                    requiredPermission={item.requiredPermission as number[]}
                    key={index}
                  >
                    <Nav.Item
                      eventKey={`3-${item.key}`}
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
              <Nav.Menu
                eventKey="5"
                trigger="hover"
                title="Manage Users"
                icon={<GearCircleIcon />}
                placement="rightStart"
              >
                {userMenuItem.map((item, index) => (
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
              <AuthCheckerForComponent
                requiredPermission={[
                  ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
                  ENUM_USER_PEMISSION.SUPER_ADMIN,
                ]}
              >
                <Nav.Menu
                  eventKey="7"
                  trigger="hover"
                  title="Financial Reports"
                  icon={<GearCircleIcon />}
                  placement="rightStart"
                >
                  {financialReportItem.map((item, index) => (
                    <AuthCheckerForComponent
                      requiredPermission={item.requiredPermission as number[]}
                      key={index}
                    >
                      <Nav.Item
                        eventKey={`7-${item.key}`}
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
