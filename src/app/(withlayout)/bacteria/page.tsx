"use client";
import BacteriaTable from "@/components/bacteria/BacteriaTable";
import NewBacteriaModal from "@/components/bacteria/NewBacteriaModal";
import CondtionTable from "@/components/condition/CondtionTable";
import NewConditionModal from "@/components/condition/NewConditionModal";
import AlartDialog from "@/components/ui/AlertModal";
import { usePostBacteriaMutation } from "@/redux/api/bacteria/bacteriaSlice";
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
  Message,
} from "rsuite";
export type IConditon = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
const Bacteria = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [
    postBacteria,
    { isError, isLoading: conditionLoading, isSuccess, error },
  ] = usePostBacteriaMutation();
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  useEffect(() => {
    if (isSuccess) {
      toaster.push(
        <Message type="success">Condition Added Successfully</Message>,
        {
          duration: 3000,
        }
      );
      setPostModalOpen(!postModalOpen);
      setLoading();
    }
    if (conditionLoading) {
      setLoading();
    }

    if (isError) {
      setLoading();
      toaster.push(
        <Message type="error">
          Something went wrong please try again letter
        </Message>,
        {
          duration: 3000,
        }
      );
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
          Add New Conditon
        </Button>
      </div>

      <div>
        <NewBacteriaModal
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
          postBacteria={postBacteria}
        ></NewBacteriaModal>

        <BacteriaTable></BacteriaTable>
      </div>
    </div>
  );
};

export default Bacteria;
