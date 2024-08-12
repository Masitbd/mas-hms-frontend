import React, { useEffect, useState } from "react";
import RModal from "../ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import { Form, Input } from "rsuite";
import Tiptap from "../tiptap/TipTap";
import {
  usePatchMutation,
  usePostMutation,
} from "@/redux/api/comment/commentSlice";
import swal from "sweetalert";
import {
  InitalTemplateData,
  IPropsForNewAndUpdate,
  ITemplate,
} from "./typesandInitialData";
import {
  usePatchTemplateMutation,
  usePostTemplateMutation,
} from "@/redux/api/template/templateSlice";

const NewAndUpdate = (props: IPropsForNewAndUpdate) => {
  const { data, open, setData, setOpen, mode, setMode } = props;
  const [post] = usePostTemplateMutation();
  const [patch] = usePatchTemplateMutation();
  const modalCancelHandler = () => {
    setOpen(false);
    setData(InitalTemplateData as ITemplate);
    setMode(ENUM_MODE.NEW);
  };
  const modalOkHandler = async () => {
    if (mode == ENUM_MODE.NEW) {
      const result = await post(data);
      if ("data" in result) {
        swal("Success", "Template Created Successfully", "success");
        modalCancelHandler();
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const result = await patch({ data: data, id: data._id });
      if ("data" in result) {
        swal("Success", "Template Updated Successfully", "success");
        modalCancelHandler();
      }
    } else {
      modalCancelHandler();
    }
  };
  const [templateData, setTemplateData] = useState("");
  useEffect(() => {
    setData({
      ...data,
      comment: templateData,
    });
  }, [templateData]);

  return (
    <div>
      <div>
        <RModal
          open={open}
          size="full"
          title="Add Template to Database"
          cancelHandler={modalCancelHandler}
          okHandler={modalOkHandler}
        >
          <div>
            <div>
              <Form onChange={setData} formDefaultValue={data}>
                <Form.Group controlId="title">
                  <Form.ControlLabel>Title</Form.ControlLabel>
                  <Form.Control name="title" />
                </Form.Group>
              </Form>
              <div className="my-5">
                <h3>Comment</h3>
                <Tiptap data={data.template} setData={setTemplateData} />
              </div>
            </div>
          </div>
        </RModal>
      </div>
    </div>
  );
};

export default NewAndUpdate;
