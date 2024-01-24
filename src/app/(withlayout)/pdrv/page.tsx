"use client";
import NewPdrv from "@/components/pdrv/NewPdrv";
import PdrvTable from "@/components/pdrv/PdrvTable";
import React, { useState } from "react";
import { Button } from "rsuite";
export type IPdrv = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
const Pdrv = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const cancelHandlerforPost = () => {
    setPostModalOpen(!postModalOpen);
  };

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
        <NewPdrv
          modalStatusHandler={setPostModalOpen}
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
        ></NewPdrv>
      </div>
      <div>
        <PdrvTable></PdrvTable>
      </div>
    </div>
  );
};

export default Pdrv;
