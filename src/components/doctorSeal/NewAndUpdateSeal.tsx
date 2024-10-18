import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchSealMutation,
  usePostSealMutation,
} from "@/redux/api/doctorSeal/doctorSealSlice";
import { useEffect, useState } from "react";
import { Form } from "rsuite";
import swal from "sweetalert";
import {
  IDoctorSeal,
  InitialDoctorSealData,
  IPropsForNewAndUpdate,
} from "../comment/typesAdInitialData";
import Tiptap from "../tiptap/TipTap";
import RModal from "../ui/Modal";

const NewAndUpdateSeal = (props: IPropsForNewAndUpdate<IDoctorSeal>) => {
  const [seal, setSeal] = useState("");
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
      const result = await postSeal({ title: data.title, seal: seal });
      if ("data" in result) {
        const message = (result as { data: { message: string } })?.data.message;
        swal(`Success! ${message}!`, {
          icon: "success",
        });
        modalCancelHandler();
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const result = await patchSeal({
        data: { title: data.title, seal: seal },
        id: data._id,
      });
      if ("data" in result) {
        const message = (result as { data: { message: string } })?.data.message;
        swal(`Success! ${message}!`, {
          icon: "success",
        });
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
          size="full"
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
                <h3>Seal Information</h3>
                <div style={{ width: "270mm" }}>
                  <Tiptap data={data.seal} setData={setSeal} />
                </div>
              </div>
            </div>
          </div>
        </RModal>
      </div>
    </div>
  );
};

export default NewAndUpdateSeal;
