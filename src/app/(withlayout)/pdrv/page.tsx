"use client";
import NewPdrvModal from "@/components/pdrv/NewPdrvModal";
import PdrvTable from "@/components/pdrv/PdrvTable";
import { usePostConditionMutation } from "@/redux/api/condition/conditionSlice";
import { usePostPdrvMutation } from "@/redux/api/pdrv/pdrvSlice";
import { setLoading } from "@/redux/features/loading/loading";
import React, { use, useEffect, useState } from "react";
import { Button, toaster, Message } from "rsuite";
export type IConditon = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
const Pdrv = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postPdrv, { isError, isLoading: conditionLoading, isSuccess, error }] =
    usePostPdrvMutation();
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

  useEffect(() => {
    if (isSuccess) {
      toaster.push(<Message type="success">Pdrv Added Successfully</Message>, {
        duration: 3000,
      });
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
          Add New P.Result value
        </Button>
      </div>

      <div>
        <NewPdrvModal
          postPdrv={postPdrv}
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
        ></NewPdrvModal>
        <PdrvTable></PdrvTable>
      </div>
    </div>
  );
};

export default Pdrv;
