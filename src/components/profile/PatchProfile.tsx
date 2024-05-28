import React, { useEffect, useRef, useState } from "react";
import { IPatchProfileProps } from "./interfacsAndTypes";
import { useAppSelector } from "@/redux/hook";
import { ENUM_MODE } from "@/enum/Mode";
import UserForm from "../users/NewUserForm";
import { Button, Message, toaster } from "rsuite";
import {
  IProfile,
  initialFormDataForNewUser,
  patchProfileModel,
} from "../users/interfacesAndInitalData";
import {
  useGetProfileQuery,
  usePatchProfileMutation,
} from "@/redux/api/profile/profileSlice";

const PatchProfile = (props: IPatchProfileProps) => {
  const { mode, setMode, userData } = props;
  const patchFormRef: React.MutableRefObject<any> = useRef();

  const [
    patchUserProfile,
    {
      isLoading: patchUserProfileLoading,
      isSuccess: patchUserProfileSuccess,
      isError: patchUserProfileError,
    },
  ] = usePatchProfileMutation();
  const [patchProfileData, setPatchProfileData] = useState(
    userData as unknown as IProfile
  );

  const patchHandler = () => {
    if (patchFormRef.current.check()) {
      patchUserProfile({
        profileData: patchProfileData as unknown as IProfile,
        uuid: userData.uuid as string,
      });
    } else {
      toaster.push(
        <Message type="error">Do Not leave any Field Empty</Message>
      );
    }
  };

  const cancelHandler = () => {
    setMode(ENUM_MODE.VIEW);
  };

  useEffect(() => {
    if (patchUserProfileSuccess) {
      toaster.push(<Message type="success">User Updated successfully</Message>);
      setMode(ENUM_MODE.VIEW);
    }
    if (patchUserProfileError) {
    }
  }, [patchUserProfileError, patchUserProfileSuccess]);

  if (mode == ENUM_MODE.EDIT) {
    return (
      <>
        <div className="mb-10">
          <h1 className="text-2xl font-bold font-sans  text-center">
            Update your Info
          </h1>
          <hr />
        </div>
        <UserForm
          mode={ENUM_MODE.EDIT}
          defaultValue={patchProfileData}
          setfromData={setPatchProfileData}
          forwardedRef={patchFormRef}
          model={patchProfileModel}
        />
        <div className="my-5">
          <Button
            appearance="primary"
            color="red"
            className="mr-5"
            onClick={() => cancelHandler()}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            color="blue"
            onClick={() => patchHandler()}
          >
            Save
          </Button>
        </div>
      </>
    );
  }
};

export default PatchProfile;
