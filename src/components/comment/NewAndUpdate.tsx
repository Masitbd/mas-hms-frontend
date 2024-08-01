import React, { useEffect, useState } from "react";
import {
  IComment,
  InitalCommentData,
  IPropsForNewAndUpdate,
} from "./typesAdInitialData";
import RModal from "../ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import { Form, Input } from "rsuite";
import Tiptap from "../tiptap/TipTap";
import {
  usePatchMutation,
  usePostMutation,
} from "@/redux/api/comment/commentSlice";
import swal from "sweetalert";

const NewAndUpdate = (props: IPropsForNewAndUpdate) => {
  const { data, open, setData, setOpen, mode, setMode } = props;
  const [post] = usePostMutation();
  const [patch] = usePatchMutation();
  const modalCancelHandler = () => {
    setOpen(false);
    setData(InitalCommentData as IComment);
    setMode(ENUM_MODE.NEW);
  };
  const modalOkHandler = async () => {
    if (mode == ENUM_MODE.NEW) {
      const result = await post(data);
      if ("data" in result) {
        swal("Success", "Comment Created Successfully", "success");
        modalCancelHandler();
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const result = await patch({ data: data, id: data._id });
      if ("data" in result) {
        swal("Success", "Comment Updated Successfully", "success");
        modalCancelHandler();
      }
    } else {
      modalCancelHandler();
    }
  };
  const [comment, setComment] = useState("");
  useEffect(() => {
    setData({
      ...data,
      comment: comment,
    });
  }, [comment]);

  return (
    <div>
      <div>
        <RModal
          open={open}
          size="lg"
          title="Add Comment to Database"
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
                <Tiptap data={data.comment} setData={setComment} />
              </div>
            </div>
          </div>
        </RModal>
      </div>
    </div>
  );
};

export default NewAndUpdate;
