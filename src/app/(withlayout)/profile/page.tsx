"use client";
import { useGetProfileQuery } from "@/redux/api/profile/profileSlice";
import { Avatar, Button, Loader, Panel } from "rsuite";
import React, { useState } from "react";
import { ENUM_MODE } from "@/enum/Mode";
import PatchProfile from "@/components/profile/PatchProfile";
import ChangePassword from "@/components/profile/ChangePassword";
import EditIcon from "@rsuite/icons/Edit";

const Profile = () => {
  const { data: ProfileData, isLoading } = useGetProfileQuery(undefined);
  const [mode, setMode] = useState(ENUM_MODE.VIEW);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }
  const { profile, role } = ProfileData?.data[0];
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
      {mode == ENUM_MODE.VIEW && (
        <>
          <div className="w-full h-full flex items-center justify-center flex-col">
            <Panel bordered className="w-full max-w-3xl p-8">
              <div className="flex flex-col items-center mb-8">
                <Avatar circle size="lg" />
                <h2 className="text-lg font-semibold mt-4">{profile.name}</h2>
              </div>
              <div className="flex flex-col space-y-4">
                <p>
                  <strong>Role:</strong>{" "}
                  <span className="capitalize">{role}</span>
                </p>

                <p>
                  <strong>Father Name:</strong> {profile.fatherName}
                </p>
                <p>
                  <strong>Mother Name:</strong> {profile.motherName}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
              </div>
              <div className="w-full flex flex-row justify-end mt-10">
                <Button
                  onClick={() => setMode(ENUM_MODE.EDIT)}
                  appearance="ghost"
                  color="green"
                  className="mr-5"
                  startIcon={<EditIcon style={{ fontSize: "20px" }} />}
                />

                {/* </Button> */}

                <Button
                  onClick={() => setMode(ENUM_MODE.CHANGE_PASSWROD)}
                  appearance="ghost"
                  color="blue"
                >
                  Change Password
                </Button>
              </div>
            </Panel>
          </div>
        </>
      )}
      <div>
        <PatchProfile mode={mode} setMode={setMode} userData={profile} />
      </div>
      <div>
        <ChangePassword mode={mode} setMode={setMode} userData={profile} />
      </div>
    </div>
  );
};

export default Profile;
