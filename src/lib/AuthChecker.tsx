import { useLazyGetProfileQuery } from "@/redux/api/profile/profileSlice";
import { setAuthStatus } from "@/redux/features/authentication/authSlice";
import { setLoading } from "@/redux/features/loading/loading";
import { useAppDispatch } from "@/redux/hook";
import { getFromLocalStorage } from "@/utils/localStorage";
import React, { useEffect, useCallback } from "react";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const [getProfile] = useLazyGetProfileQuery();
  const dispatch = useAppDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const { isSuccess, data } = await getProfile(undefined);
      if (isSuccess) {
        const token = await getFromLocalStorage("accessToken");
        dispatch(setAuthStatus({ loggedIn: true, user: data?.data[0], token }));
      } else {
        dispatch(setAuthStatus({ loggedIn: false }));
      }
    } catch (error) {
      dispatch(setAuthStatus({ loggedIn: false }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, getProfile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <CustomProvider>{children}</CustomProvider>;
};

export default AuthChecker;
