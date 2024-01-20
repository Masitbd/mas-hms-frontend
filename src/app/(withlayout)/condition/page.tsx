"use client";
import CondtionTable from "@/components/condition/CondtionTable";
import NewConditionModal from "@/components/condition/NewConditionModal";
import AlartDialog from "@/components/ui/AlertModal";
import {
  useDeleteConditionMutation,
  useGetConditionQuery,
  usePostConditionMutation,
} from "@/redux/api/condition/conditionSlice";
import { setCondition } from "@/redux/features/condition/conditionSlice";
import { setdel } from "@/redux/features/delpopup/delpopuo";
import { setLoading } from "@/redux/features/loading/loading";
import { useAppDispatch } from "@/redux/hook";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Button,
  Modal,
  Schema,
  Form,
  Loader,
  toaster,
} from "rsuite";

const Condition = () => {
  // For post
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [
    postCondition,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostConditionMutation();
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  //  for Delete

  useEffect(() => {
    if (isSuccess) {
      alert("done");
      setPostModalOpen(!postModalOpen);
      setLoading();
    }
    if (conditionLoading) {
      setLoading();
    }

    if (isError) {
      setLoading();
      alert("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionLoading, isError, isSuccess]);
  return (
    <div className="my-5 px-5">
      <div className="my-2"></div>
      <Button
        appearance="primary"
        onClick={() => setPostModalOpen(!postModalOpen)}
      >
        Add New Conditon
      </Button>
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
