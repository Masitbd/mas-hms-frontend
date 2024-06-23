import { Navbar as ResuiteNavber, Nav, Avatar, Button } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import { SyntheticEvent, useState } from "react";
import { NavLink } from "@/utils/Navlink";
import { useAppDispatch } from "@/redux/hook";
import { setAuthStatus } from "@/redux/features/authentication/authSlice";
import { redirect } from "next/navigation";
import { baseApi } from "@/redux/api/baseApi";

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
    dispatch(baseApi.util.resetApiState());
    redirect("/signin");
  };
  return (
    <ResuiteNavber {...props} appearance="inverse">
      <ResuiteNavber.Brand href="#">HMS</ResuiteNavber.Brand>
      <Nav
        onSelect={
          onSelect as unknown as (
            eventKey: any,
            event: SyntheticEvent<Element, Event>
          ) => void
        }
        activeKey={activeKey}
      >
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
        //   appearance="inverse"
        activeKey={activeKey as unknown as boolean}
        onSelect={setActiveKey as unknown as SyntheticEvent<Element, Event>}
      />
    </>
  );
};
