import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchMutation,
  usePostMutation,
} from "@/redux/api/comment/commentSlice";
import { useEffect, useState } from "react";
import { Form } from "rsuite";
import swal from "sweetalert";
import Tiptap from "../tiptap/TipTap";
import RModal from "../ui/Modal";
import {
  IComment,
  InitalCommentData,
  IPropsForNewAndUpdate,
} from "./typesAdInitialData";

const NewAndUpdate = (props: IPropsForNewAndUpdate<IComment>) => {
  const { data, open, setData, setOpen, mode, setMode } = props;
  const [post] = usePostMutation();
  const [patch] = usePatchMutation();
  const [comment, setComment] = useState("");
  const modalCancelHandler = () => {
    setOpen(false);
    setData(InitalCommentData as IComment);
    setMode(ENUM_MODE.NEW);
    setComment("");
  };
  const modalOkHandler = async () => {
    if (mode == ENUM_MODE.NEW) {
      const result = await post({ title: data?.title, comment: comment });
      if ("data" in result) {
        swal("Success", "Comment Created Successfully", "success");
        modalCancelHandler();
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const result = await patch({
        data: { title: data?.title, comment: comment },
        id: data._id,
      });
      if ("data" in result) {
        swal("Success", "Comment Updated Successfully", "success");
        modalCancelHandler();
      }
    } else {
      modalCancelHandler();
    }
  };

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
