"use client";
import NewReportGroupModal from "@/components/reportGroup/NewReportGroupModel";
import ReportGroupTable from "@/components/reportGroup/ReportGroupTable";
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
    <div className="my-5 px-5">
      <div className="my-4">
        <Button
          appearance="primary"
          onClick={() => setPostModalOpen(!postModalOpen)}
        >
          Add New Report Group
        </Button>
      </div>

      <div>
        <NewReportGroupModal
          postReportGroup={postReportGroup}
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
        ></NewReportGroupModal>
        <ReportGroupTable />
      </div>
    </div>
  );
};

export default ReportGroup;
