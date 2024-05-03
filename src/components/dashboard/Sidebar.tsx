import { Sidebar as ResuiteSidebar, Sidenav, Navbar, Nav } from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import { useState } from "react";
import { NavLink } from "@/utils/Navlink";

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
  { key: "1", title: "Users", href: "/users" },
  { key: "2", title: "Prifile", href: "/profile" },
  { key: "2", title: "Permissions", href: "/permissions" },
];

const testMenuItem = [
  { key: "1", title: "Pdrv", href: "/pdrv" },
  { key: "2", title: "Bacteria", href: "/bacteria" },
  { key: "3", title: "Condition", href: "/condition" },
  { key: "4", title: "Department", href: "/department" },
  { key: "5", title: "Hospital Group", href: "/hospitalGroup" },
  { key: "6", title: "Specimen", href: "/specimen" },
  { key: "7", title: "Vacumme Tube", href: "/vacuumTube" },
  { key: "8", title: "Test", href: "/test" },
  { key: "9", title: "Doctor", href: "/doctor" },
  {
    key: "10",
    title: "Patient",
    href: "/patient",
  },
  {
    key: "11",
    title: "Generate Bill",
    href: "/order",
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
          minHeight: "90vh",
          justifyContent: "space-between",
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Menu
                eventKey="3"
                trigger="hover"
                title="Test Params"
                icon={<MagicIcon />}
                placement="rightStart"
              >
                <Nav.Menu
                  eventKey="3"
                  trigger="hover"
                  title="Test Params"
                  icon={<MagicIcon />}
                  placement="rightStart"
                >
                  {testMenuItem.map((item) => (
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
                  ))}
                </Nav.Menu>
              </Nav.Menu>
              <Nav.Menu
                eventKey="4"
                trigger="hover"
                title="Settings"
                icon={<GearCircleIcon />}
                placement="rightStart"
              >
                {userMenuItem.map((item) => (
                  <Nav.Item
                    eventKey={`4-${item.key}`}
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
                ))}
              </Nav.Menu>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </ResuiteSidebar>
    </div>
  );
};

export default Sidebar;
