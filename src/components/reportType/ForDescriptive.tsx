import { ENUM_MODE } from "@/enum/Mode";
import React, { useState } from "react";
import { Button } from "rsuite";
import RModal from "../ui/Modal";
import Tiptap from "../tiptap/TipTap";

const ForDescriptive = (props: {
  data: { status: string; description: string };
  index: number;
  handleCHange: (SL: number, key: string, value: string) => void;
}) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [data, setdata] = useState();

  const okHandler = () => {
    props.handleCHange(
      props?.index as number,
      "description",
      data as unknown as string
    );
    setOpenEditor(false);
  };
  if (
    props.data?.status == ENUM_MODE.NEW ||
    props.data?.status == ENUM_MODE.EDIT
  ) {
    return (
      <>
        <Button
          appearance="primary"
          color="blue"
          onClick={() => setOpenEditor(true)}
        >
          Open Editor
        </Button>

        <RModal
          title="Result Description Editor"
          open={openEditor}
          size="full"
          okHandler={okHandler}
          cancelHandler={() => setOpenEditor(false)}
        >
          <Tiptap data={props.data?.description} setData={setdata} />
        </RModal>
      </>
    );
  } else {
    return (
      <div>
        <div
          dangerouslySetInnerHTML={{ __html: props.data?.description || "" }}
        ></div>
      </div>
    );
  }
};

export default ForDescriptive;
