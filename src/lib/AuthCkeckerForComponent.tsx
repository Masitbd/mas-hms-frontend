import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { useAppSelector } from "@/redux/hook";
import React from "react";

const AuthCheckerForComponent = ({
  children,
  requiredPermission,
}: {
  children: React.ReactElement;
  requiredPermission: number[];
}) => {
  const auth: IAUth = useAppSelector((state) => state.auth.user as IAUth);
  if (
    auth.permissions.permissions.includes(
      Number(ENUM_USER_PEMISSION.SUPER_ADMIN)
    ) ||
    auth.permissions.permissions.some((permission) =>
      requiredPermission.includes(permission)
    ) ||
    auth.permissions.permissions.includes(ENUM_USER_PEMISSION.ADMIN)
  ) {
    return children;
  }
  if (!auth.permissions.permissions.includes(Number(requiredPermission))) {
    return null;
  } else {
    return children;
  }
};

export default AuthCheckerForComponent;
