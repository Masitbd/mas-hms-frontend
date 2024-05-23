import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";

import React, { JSX } from "react";
type IAuthState = {
  loggedIn: boolean;
  token: string;
  user: IAUth;
};
export function withAuth(
  Components: JSX.ElementType,
  requiredPermission: number
) {
  return function WithAuth(props: JSX.IntrinsicAttributes) {
    const router = useRouter();

    // Add your authentication logic here
    // For example, check if the user is authenticated
    const authData: IAuthState = useAppSelector(
      (state) => state.auth as IAuthState
    );

    // Check if the user has the required permission

    const hasPermission =
      authData.user.permissions.permissions.includes(
        Number(requiredPermission)
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
