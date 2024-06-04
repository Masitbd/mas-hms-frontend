"use client";
import CondtionTable from "@/components/condition/CondtionTable";
import NewConditionModal from "@/components/condition/NewConditionModal";
import { usePostConditionMutation } from "@/redux/api/condition/conditionSlice";
import { setLoading } from "@/redux/features/loading/loading";
import { useEffect, useState } from "react";
import { Button, Message, toaster } from "rsuite";
import swal from "sweetalert";

const Condition = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [
    postCondition,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostConditionMutation();
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  useEffect(() => {
    if (isSuccess) {
      swal("Success", "Condition Added Successfully", "success");
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
          Add New Condition
        </Button>
      </div>

      <div>
        <NewConditionModal
          postCondition={postCondition}
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
        ></NewConditionModal>
        <CondtionTable></CondtionTable>
      </div>
    </div>
  );
};

export default Condition;
