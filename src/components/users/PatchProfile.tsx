import React, { useEffect, useRef, useState } from "react";
import UserForm from "./NewUserForm";
import { Button, Message, toaster } from "rsuite";
import {
  IPatchProfileProps,
  IProfile,
  initialFormDataForNewUser,
  patchProfileModel,
} from "./interfacesAndInitalData";
import { usePatchProfileMutation } from "@/redux/api/profile/profileSlice";

const PatchProfile = (props: IPatchProfileProps) => {
  const { mode, setMode, defaultValue } = props;

  const patchFromRef: React.MutableRefObject<any> = useRef();
  const [userData, setUserData] = useState<Partial<IProfile>>(defaultValue);
  const [
    patchUserProfile,
    {
      isLoading: patchUserProfileLoading,
      isSuccess: patchUserProfileSuccess,
      isError: patchUserProfileError,
    },
  ] = usePatchProfileMutation();

  const patchHandler = () => {
    if (patchFromRef.current.check()) {
      patchUserProfile({
        profileData: userData as IProfile,
        uuid: defaultValue.uuid as string,
      });
    } else {
      toaster.push(
        <Message type="error">Do Not leave any Field Empty</Message>
      );
    }
  };

  useEffect(() => {
    if (patchUserProfileSuccess) {
      setUserData(initialFormDataForNewUser);
      toaster.push(<Message type="success">User Updated successfully</Message>);
      setMode("new");
    }
    if (patchUserProfileError) {
    }
  }, [patchUserProfileError, patchUserProfileSuccess]);
  return (
    <div>
      <UserForm
        defaultValue={userData}
        mode={mode}
        setfromData={setUserData}
        model={patchProfileModel}
        forwardedRef={patchFromRef}
      />
      <div className="my-5">
        <Button
          onClick={() => patchHandler()}
          appearance="primary"
          color="blue"
          className="mr-5"
          disabled={patchUserProfileLoading}
        >
          Save
        </Button>
        <Button onClick={() => setMode("new")} appearance="primary" color="red">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PatchProfile;
