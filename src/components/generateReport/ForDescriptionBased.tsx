import React, { useState } from "react";
import { Button } from "rsuite";
import RModal from "../ui/Modal";
import Tiptap from "../tiptap/TipTap";
import { resultSetter } from "./functions";

const ForDescriptionBased = (params: {
  result: any;
  setResult: any;
  rowData: any;
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const okHandler = () => {
    setOpen(false);
    resultSetter(params.rowData?._id, params.result, data, params.setResult);
  };
  return (
    <div>
      <Button appearance="primary" color="blue" onClick={() => setOpen(true)}>
        Open
      </Button>

      <div>
        <RModal
          cancelHandler={() => setOpen(false)}
          okHandler={okHandler}
          open={open}
          size="full"
          title="Result"
        >
          <Tiptap
            data={params.rowData?.result || params.rowData?.description}
            setData={setData}
          />
        </RModal>
      </div>
    </div>
  );
};

export default ForDescriptionBased;
