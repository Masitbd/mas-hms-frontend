import { Navbar as ResuiteNavber, Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import { useState } from "react";

interface CustomNavbarProps
  extends Omit<React.ComponentProps<typeof ResuiteNavber>, "onSelect"> {
  onSelect: (eventKey: string | number) => void;
  activeKey: string | number;
}

const CustomNavbar = ({ onSelect, activeKey, ...props }: CustomNavbarProps) => {
  return (
    <ResuiteNavber {...props}>
      <ResuiteNavber.Brand href="#">HMS</ResuiteNavber.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon />}>
          Home
        </Nav.Item>
        <Nav.Item eventKey="2">News</Nav.Item>
        <Nav.Item eventKey="3">Products</Nav.Item>
        <Nav.Menu title="About">
          <Nav.Item eventKey="4">Company</Nav.Item>
          <Nav.Item eventKey="5">Team</Nav.Item>
          <Nav.Item eventKey="6">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      <Nav pullRight>
        <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
      </Nav>
    </ResuiteNavber>
  );
};

export const Navbar = () => {
  const [activeKey, setActiveKey] = useState<string | number>("");

  return (
    <>
      <CustomNavbar
        appearance="inverse"
        activeKey={activeKey}
        onSelect={setActiveKey}
      />
    </>
  );
};
