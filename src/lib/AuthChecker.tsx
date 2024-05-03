import { useLazyGetProfileQuery } from "@/redux/api/profile/profileSlice";
import { setAuthStatus } from "@/redux/features/authentication/authSlice";
import loading, { setLoading } from "@/redux/features/loading/loading";
import { useAppDispatch } from "@/redux/hook";
import { Glegoo } from "next/font/google";
import React, { useEffect } from "react";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [getProfile] = useLazyGetProfileQuery(undefined);

  const getdata = async () => {
    const { isSuccess, data, isError } = await getProfile(undefined);
    if (isSuccess) {
      dispatch(setAuthStatus({ loggedIn: true, user: data.data[0] }));
      dispatch(setLoading(false));
    }
    if (isError) {
      dispatch(setAuthStatus({ loggedIn: false }));
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    dispatch(setLoading(true));
    getdata();
  }, []);
  return <CustomProvider>{children}</CustomProvider>;
};

export default AuthChecker;
