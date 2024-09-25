import {
  Container,
  Header,
  Sidebar as ResuiteSidebar,
  Sidenav,
  Content,
  Navbar,
  Nav,
} from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import DashboardIcon from "@rsuite/icons/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import { useState } from "react";
import { NavLink } from "@/utils/Navlink";
import Link from "next/link";

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#34c3ff",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

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

const Sidebar = () => {
  const [expand, setExpand] = useState(true);
  return (
    <ResuiteSidebar
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      width={expand ? 260 : 56}
      collapsible
      className="bg-slate-200"
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
              <Nav.Item eventKey="3-1" href={"/pdrv"} as={NavLink}>
                Pdrv
              </Nav.Item>
              <Nav.Item eventKey="3-2" href={"/bacteria"} as={NavLink}>
                Bacteria
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/condition"} as={NavLink}>
                Condition
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/department"} as={NavLink}>
                Department
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/hospitalGroup"} as={NavLink}>
                Hospital Group
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/specimen"} as={NavLink}>
                Specimen
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/vacuumTube"} as={NavLink}>
                Vacumme Tube
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/test"} as={NavLink}>
                Test
              </Nav.Item>
              <Nav.Item eventKey="3-3" href={"/doctor"} as={NavLink}>
                Doctor
              </Nav.Item>
            </Nav.Menu>
            <Nav.Menu
              eventKey="4"
              trigger="hover"
              title="Settings"
              icon={<GearCircleIcon />}
              placement="rightStart"
            >
              <Nav.Item eventKey="4-1">Patient Registration</Nav.Item>
              <Nav.Item eventKey="4-2">Doctor Setup</Nav.Item>
              <Nav.Item eventKey="4-3" href="/employeeRegistration">
                Employee Registration
              </Nav.Item>
              <Nav.Item eventKey="4-4">Tags</Nav.Item>
              <Nav.Item eventKey="4-5">Versions</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
      <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
    </ResuiteSidebar>
  );
};

export default Sidebar;
