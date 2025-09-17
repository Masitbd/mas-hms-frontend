import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchSealMutation,
  usePostSealMutation,
} from "@/redux/api/doctorSeal/doctorSealSlice";
import { useEffect, useState } from "react";
import { Checkbox, Form } from "rsuite";
import swal from "sweetalert";
import {
  IDoctorSeal,
  InitialDoctorSealData,
  IPropsForNewAndUpdate,
} from "../comment/typesAdInitialData";
import Tiptap from "../tiptap/TipTap";
import RModal from "../ui/Modal";
import { useGetReportMarginQuery } from "@/redux/api/reportMargin/reportMargin.api";

const NewAndUpdateSeal = (props: IPropsForNewAndUpdate<IDoctorSeal>) => {
  const [margins, setMargins] = useState([0, 0, 0, 0]);
  const [width, setWidth] = useState(270);
  const {
    data: reportMargin,
    isLoading: reportMarginLoading,
    isFetching: reportMarginFetching,
  } = useGetReportMarginQuery(undefined);
  useEffect(() => {
    if (!reportMarginFetching && !reportMarginLoading && reportMargin) {
      if (reportMargin?.data[0]) {
        const left = Number(reportMargin?.data[0]?.left ?? 0) * 25.4;
        const right = Number(reportMargin?.data[0]?.right ?? 0) * 25.4;
        const width = 270 - Math.max(left + right - 23, 0);

        const storedMargins = [
          Number(reportMargin?.data[0]?.top ?? 0) * 96,
          Number(reportMargin?.data[0]?.right ?? 0) * 96,
          Number(reportMargin?.data[0]?.bottom ?? 0) * 96,
          Number(reportMargin?.data[0]?.left ?? 0) * 96,
        ];
        setWidth(width);
        setMargins(storedMargins);
      }
    }
  }, [setMargins, reportMargin, reportMarginFetching, reportMarginFetching]);

  console.log(margins);
  const { data, open, setData, setOpen, mode, setMode } = props;
  const [seal, setSeal] = useState(data?.seal);

  const [postSeal, { isLoading: postLoading }] = usePostSealMutation();
  const [patchSeal, { isLoading: patchLoading }] = usePatchSealMutation();
  const modalCancelHandler = () => {
    setOpen(false);
    setData(InitialDoctorSealData as IDoctorSeal);
    setMode(ENUM_MODE.NEW);
  };

  const modalOkHandler = async () => {
    if (mode == ENUM_MODE.NEW) {
      const result = await postSeal({
        title: data.title,
        seal: seal,
        default: data.default,
      });
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
        data: { title: data.title, seal: seal, default: data.default },
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

  useEffect(() => {
    setSeal(data?.seal);
  }, [data?.seal]);

  return (
    <div>
      <div>
        <RModal
          open={open}
          size="full"
          title="Add Doctor Seal to Database"
          cancelHandler={modalCancelHandler}
          okHandler={modalOkHandler}
          loading={postLoading || patchLoading}
        >
          <div>
            <div>
              <Form onChange={setData} formDefaultValue={data}>
                <Form.Group controlId="title">
                  <Form.ControlLabel>Title</Form.ControlLabel>
                  <Form.Control name="title" />
                </Form.Group>
                <Form.Group controlId="default" className="flex items-center">
                  <Form.ControlLabel>Default</Form.ControlLabel>
                  <Form.Control
                    name="default"
                    accepter={Checkbox}
                    defaultChecked={data?.default}
                    value={!data?.default}
                  />
                </Form.Group>
              </Form>
              <div className="my-5">
                <h3>Seal Information</h3>
                <div
                  style={{ width: `${width}mm`, fontFamily: "!monospace" }}
                  className="!font-mono"
                >
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
