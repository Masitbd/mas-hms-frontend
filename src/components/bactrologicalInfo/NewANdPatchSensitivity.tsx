import React, { SetStateAction, useState } from "react";
import { Form, Tag } from "rsuite";
import {
  IMiscellaneous,
  initalData,
  initialSensitiviry,
  ISensitivity,
} from "./typesAndInitialData";
import RModal from "../ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchMiscMutation,
  usePostMiscMutation,
} from "@/redux/api/miscellaneous/miscellaneousSlice";
import swal from "sweetalert";
import {
  usePatchSensitivityMutation,
  usePostSensitivityMutation,
} from "@/redux/api/sensitivity/sensitivitySlict";

const NewAndPatchSensitivity = (porps: {
  defaultValue: IMiscellaneous;
  mode: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<IMiscellaneous | ISensitivity>>;
}) => {
  const [post, { isSuccess: postSuccess, isError: postErrror }] =
    usePostSensitivityMutation();
  const [patch, { isSuccess: patchSUccess, isError: patchError }] =
    usePatchSensitivityMutation();

  const { defaultValue, open, setOpen, setData, mode } = porps;
  const [formData, setFormData] = useState<ISensitivity>(
    JSON.parse(JSON.stringify(defaultValue))
  );

  const alertHanlder = (data: any) => {
    if ("data" in data) {
      swal("Success", "Data posted", "success");
      setOpen(false);
      setData(initalData);
      setFormData(initialSensitiviry);
    } else {
      swal("Error", "Data post faild", "error");
    }
  };
  const okHandler = async () => {
    if (mode == ENUM_MODE.EDIT) {
      const result = await patch({ data: formData, id: formData?._id });
      alertHanlder(result);
    }
    if (mode == ENUM_MODE.NEW) {
      const result = await post(formData);
      alertHanlder(result);
    }
  };
  const cancelHandler = () => {
    setOpen(false);
    setData(initialSensitiviry);
    setFormData(initialSensitiviry);
  };

  return (
    <div>
      <RModal
        open={open}
        size="sm"
        title={"Sensitivity"}
        cancelHandler={cancelHandler}
        okHandler={okHandler}
      >
        <Form
          fluid
          onChange={(formValue) =>
            setFormData(formValue as SetStateAction<ISensitivity>)
          }
          formDefaultValue={defaultValue}
        >
          <Form.Group controlId="value">
            <Form.ControlLabel>Antibiotic</Form.ControlLabel>
            <Form.Control name="value" />
          </Form.Group>
          <Form.Group controlId="mic">
            <Form.ControlLabel>MIC</Form.ControlLabel>
            <Form.Control name="mic" />
          </Form.Group>
          <Form.Group controlId="breakPoint">
            <Form.ControlLabel>Break Point</Form.ControlLabel>
            <Form.Control name="breakPoint" />
          </Form.Group>
        </Form>
      </RModal>
    </div>
  );
};

export default NewAndPatchSensitivity;
