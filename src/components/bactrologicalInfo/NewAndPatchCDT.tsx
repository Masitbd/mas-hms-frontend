import React, { SetStateAction, useState } from "react";
import { Form, Tag } from "rsuite";
import {
  IMiscellaneous,
  initalData,
  ISensitivity,
} from "./typesAndInitialData";
import RModal from "../ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchMiscMutation,
  usePostMiscMutation,
} from "@/redux/api/miscellaneous/miscellaneousSlice";
import swal from "sweetalert";

const NewAndPatchCDT = (porps: {
  defaultValue: IMiscellaneous;
  mode: string;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<IMiscellaneous>>;
}) => {
  const [post, { isSuccess: postSuccess, isError: postErrror }] =
    usePostMiscMutation();
  const [patch, { isSuccess: patchSUccess, isError: patchError }] =
    usePatchMiscMutation();

  const { defaultValue, title, open, setOpen, setData, mode } = porps;
  const [formData, setFormData] = useState<IMiscellaneous>(
    JSON.parse(JSON.stringify(defaultValue || initalData))
  );

  const alertHanlder = (data: any) => {
    if ("data" in data) {
      swal("Success", "Data posted", "success");
      setOpen(false);
      setData(initalData);
      setFormData(initalData);
    } else {
      swal("Error", "Data post faild", "error");
    }
  };
  const okHandler = async () => {
    if (mode == ENUM_MODE.EDIT) {
      const modifiedData = {
        title: title,
        value: formData.value,
      };
      const result = await patch({ data: modifiedData, id: formData._id });
      alertHanlder(result);
    }
    if (mode == ENUM_MODE.NEW) {
      const result = await post({ title: title, value: formData.value });
      alertHanlder(result);
    }
  };
  const cancelHandler = () => {
    setOpen(false);
    setData(initalData);
    setFormData(initalData);
  };

  return (
    <div>
      <RModal
        open={open}
        size="sm"
        title={title}
        cancelHandler={cancelHandler}
        okHandler={okHandler}
      >
        <Form
          fluid
          onChange={(formValue) =>
            setFormData(formValue as SetStateAction<IMiscellaneous>)
          }
          formDefaultValue={defaultValue}
        >
          <Form.Group controlId="value">
            <Form.ControlLabel>Value</Form.ControlLabel>
            <Form.HelpText>
              To use the dynamic value please use {"${ }"}. Inside the curly
              brackets {"{ }"} use{" "}
              <Tag color="green" size="sm">
                cond
              </Tag>{" "}
              for condition, use
              <Tag color="green" size="sm">
                temp
              </Tag>{" "}
              form temperature, use{" "}
              <Tag color="green" size="sm">
                bact
              </Tag>{" "}
              for bacteria and use{" "}
              <Tag color="green" size="sm">
                dur
              </Tag>{" "}
              for duration. Ex: This Was tasted under{" "}
              <Tag color="yellow" size="sm">
                {"${temp}"}
              </Tag>{" "}
              degree celcious
            </Form.HelpText>
            <Form.Control name="value" />
          </Form.Group>
        </Form>
      </RModal>
    </div>
  );
};

export default NewAndPatchCDT;
