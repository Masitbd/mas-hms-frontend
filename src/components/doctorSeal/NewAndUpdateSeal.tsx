
import { ENUM_MODE } from "@/enum/Mode";
import { usePatchSealMutation, usePostSealMutation } from "@/redux/api/doctorSeal/doctorSealSlice";
import { useEffect, useState } from "react";
import { Form } from "rsuite";
import swal from "sweetalert";
import { IDoctorSeal, InitialDoctorSealData, IPropsForNewAndUpdate } from "../comment/typesAdInitialData";
import Tiptap from "../tiptap/TipTap";
import RModal from "../ui/Modal";

const NewAndUpdateSeal = (props: IPropsForNewAndUpdate<IDoctorSeal>) => {
  const { data, open, setData, setOpen, mode, setMode } = props;
  const [postSeal] = usePostSealMutation();
  const [patchSeal] = usePatchSealMutation();
  const modalCancelHandler = () => {
    setOpen(false);
    setData(InitialDoctorSealData as IDoctorSeal);
    setMode(ENUM_MODE.NEW);
  };
  const modalOkHandler = async () => {
    if (mode == ENUM_MODE.NEW) {
      const result = await postSeal(data);
      if ('data' in result) {
        const message = (result as { data: { message: string } })?.data.message;
        swal(`Success! ${message}!`, {
          icon: "success",
        })
        modalCancelHandler()
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const result = await patchSeal({ data: data, id: data._id });
      if ('data' in result) {
        const message = (result as { data: { message: string } })?.data.message;
        swal(`Success! ${message}!`, {
          icon: "success",
        })
        modalCancelHandler()
      }
    } else {
      modalCancelHandler();
    }
  };
  const [seal, setSeal] = useState("");
  useEffect(() => {
    setData({
      ...data,
      seal: seal,
    });
  }, [seal]);

  return (
    <div>
      <div>
        <RModal
          open={open}
          size="xl"
          title="Add Doctor Seal to Database"
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
                <Tiptap data={data.seal} setData={setSeal} />
              </div>
            </div>
          </div>
        </RModal>
      </div>
    </div>
  );
};

export default NewAndUpdateSeal;