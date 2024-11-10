"use client";
import BacteriaTable from "@/components/bacteria/BacteriaTable";
import NewBacteriaModal from "@/components/bacteria/NewBacteria";
import { useState } from "react";
import { Button } from "rsuite";
export type IBacteria = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
const Bacteria = () => {
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
          Add New Bacteria
        </Button>
      </div>

      <div>
        <NewBacteriaModal
          open={postModalOpen}
          cancelHandler={cancelHandlerforPost}
          setModalStatus={setPostModalOpen}
        ></NewBacteriaModal>

        <BacteriaTable></BacteriaTable>
      </div>
    </div>
  );
};

export default Bacteria;
