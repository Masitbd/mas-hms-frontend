"use client";
import { useGetProfileQuery } from "@/redux/api/profile/profileSlice";
import { Avatar, Loader, Panel } from "rsuite";
import React from "react";

const Profile = () => {
  const { data: ProfileData, isLoading } = useGetProfileQuery(undefined);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }
  const { profile, role } = ProfileData?.data[0];
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <Panel bordered className="w-full max-w-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar circle size="lg" />
            <h2 className="text-lg font-semibold mt-4">{profile.name}</h2>
          </div>
          <div className="flex flex-col space-y-4">
            <p>
              <strong>Role:</strong> <span className="capitalize">{role}</span>
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
        </Panel>
      </div>
    </div>
  );
};

export default Profile;
