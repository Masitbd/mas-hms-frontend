import { Navbar as ResuiteNavber, Nav, Avatar, Button } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import { SyntheticEvent, useState } from "react";
import { NavLink } from "@/utils/Navlink";
import { useAppDispatch } from "@/redux/hook";
import { setAuthStatus } from "@/redux/features/authentication/authSlice";
import { redirect } from "next/navigation";

const CustomNavbar = ({
  onSelect,
  activeKey,
  ...props
}: {
  onSelect: SyntheticEvent<Element, Event>;
  activeKey: boolean;
}) => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(setAuthStatus({ loggedIn: false, user: {} }));
    redirect("/signin");
  };
  return (
    <ResuiteNavber {...props}>
      <ResuiteNavber.Brand href="#">HMS</ResuiteNavber.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon />}>
          Home
        </Nav.Item>
        <Nav.Item eventKey="2" as={NavLink} href="/profile">
          Profile
        </Nav.Item>
        <Nav.Item eventKey="3" as={NavLink} href="/order">
          Dashboard
        </Nav.Item>
      </Nav>
      <Nav pullRight className="mr-5">
        <Button appearance="primary" color="red" onClick={handleLogout}>
          Logout
        </Button>

        <Nav.Menu icon={<Avatar src="/avater.jpg" circle />}></Nav.Menu>
      </Nav>
    </ResuiteNavber>
  );
};

export const Navbar = () => {
  const [activeKey, setActiveKey] = useState(null);

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
