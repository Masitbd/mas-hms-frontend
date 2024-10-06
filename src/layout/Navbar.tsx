import { Navbar as ResuiteNavber, Nav, Avatar, Button } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import { SyntheticEvent, use, useState } from "react";
import { NavLink } from "@/utils/Navlink";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
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

  const user = useAppSelector((state) => state.auth.user);
  return (
    <ResuiteNavber {...props} appearance="inverse">
      <Nav
        onSelect={
          onSelect as unknown as (
            eventKey: any,
            event: SyntheticEvent<Element, Event>
          ) => void
        }
        activeKey={activeKey}
      >
        <Nav.Item eventKey="2" as={NavLink} href="/profile">
          Profile
        </Nav.Item>
        <Nav.Item eventKey="3" as={NavLink} href="/order">
          Dashboard
        </Nav.Item>
      </Nav>
      <Nav pullRight className="mr-5">
        Logged In As <span className="font-bold"> {user?.profile?.name}</span>
        <Nav.Menu
          icon={<Avatar src={user?.profile?.image ?? "/avater.jpg"} circle />}
        ></Nav.Menu>
        <Button appearance="primary" color="red" onClick={handleLogout}>
          Logout
        </Button>
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
