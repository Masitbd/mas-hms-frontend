import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";

import React, { ComponentType, JSX } from "react";
type IAuthState = {
  loggedIn: boolean;
  token: string;
  user: IAUth;
};
export function withAuth<T>(Components: any, ...requiredPermission: number[]) {
  return function WithAuth(props: any) {
    const router = useRouter();

    const authData: IAuthState = useAppSelector(
      (state) => state.auth as IAuthState
    );

    // Check if the user has the required permission

    const hasPermission =
      authData.user.permissions.permissions.some(
        (value: number, index: number, array: number[]) =>
          requiredPermission.includes(value)
      ) ||
      authData.user.permissions.permissions.includes(
        ENUM_USER_PEMISSION.SUPER_ADMIN
      ) ||
      authData.user.permissions.permissions.includes(
        ENUM_USER_PEMISSION.SUPER_ADMIN
      );
    // Redirect to login page if not authenticated
    if (!authData.loggedIn) {
      router.push("/signin");
      return null;
    }

    // Redirect to unauthorized page if user lacks required permission
    if (!hasPermission) {
      router.push("/unauthorized");
      return null;
    }

    return <Components {...props} />;
  };
}
