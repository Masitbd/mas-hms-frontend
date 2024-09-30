"use client";
import NewReportGroupModal from "@/components/reportGroup/NewReportGroupModel";
import ReportGroupTable from "@/components/reportGroup/ReportGroupTable";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { usePostReportGroupMutation } from "@/redux/api/reportGroup/reportGroupSlice";
import React, { useEffect, useState } from "react";
import { Button } from "rsuite";
import swal from "sweetalert";

const ReportGroup = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [
    postReportGroup,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostReportGroupMutation();
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  useEffect(() => {
    if (isSuccess) {
      swal("Success", "Report Group Added Successfully", "success");
      setPostModalOpen(!postModalOpen);
    }
    if (isError) {
      swal("Error", " Something went wrong please try again letter", "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionLoading, isError, isSuccess]);
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Report Group</h2>
        </div>
        <div className="p-2">
          <AuthCheckerForComponent
            requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
          >
            <div className="my-4">
              <Button
                appearance="primary"
                onClick={() => setPostModalOpen(!postModalOpen)}
              >
                Add New Report Group
              </Button>
            </div>
          </AuthCheckerForComponent>

          <div>
            <NewReportGroupModal
              postReportGroup={postReportGroup}
              open={postModalOpen}
              cancelHandler={cancelHandlerforPost}
            ></NewReportGroupModal>
            <ReportGroupTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGroup;
