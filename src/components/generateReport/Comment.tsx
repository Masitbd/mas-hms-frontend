import { useGetQuery } from "@/redux/api/comment/commentSlice";
import {
  useGetSealQuery,
  useLazyGetSealQuery,
} from "@/redux/api/doctorSeal/doctorSealSlice";
import "./TextEditor.css";
import { useEffect, useState } from "react";
import { Accordion, Button, SelectPicker } from "rsuite";
import { IComment, IDoctorSeal } from "../comment/typesAdInitialData";
import Tiptap from "../tiptap/TipTap";
import {
  ITestResultForParameter,
  ITEstREsultForMicroBio,
} from "./initialDataAndTypes";
import { ENUM_MODE } from "@/enum/Mode";
import { NavLink } from "@/utils/Navlink";
import { useGetReportMarginQuery } from "@/redux/api/reportMargin/reportMargin.api";

const Comment = (props: {
  result: ITestResultForParameter | ITEstREsultForMicroBio;
  setResult: any;
  mode: string;
}) => {
  //for comment
  const { data: commentData, isLoading: commentDataLoading } =
    useGetQuery(undefined);
  const [comment, setComment] = useState(props?.result?.comment);

  // For doctors seal
  const [margins, setMargins] = useState([0, 0, 0, 0]);
  const [width, setWidth] = useState(210);
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
        const width = 210 - Math.max(left + right - 23, 0);

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

  const [seal, setSeal] = useState(props?.result?.seal);
  const [defaultSeal, setDefaultSeal] = useState<IDoctorSeal>();
  const { data: sealData, isLoading: sealDataLoading } =
    useGetSealQuery(undefined);
  const [
    getDefaultSeal,
    {
      isLoading: defaultSealLoading,
      isFetching: defaultsealFeatching,
      data: defaultSealData,
    },
  ] = useLazyGetSealQuery(undefined);

  useEffect(() => {
    const newData = {
      ...props.result,
    };
    newData.comment = comment;
    newData.seal = seal;
    props.setResult && props.setResult(newData);
  }, [comment, seal]);
  useEffect(() => {
    (async function () {
      if (props.mode == ENUM_MODE.NEW) {
        const seal = await getDefaultSeal({ default: true }).unwrap();

        if (seal?.success && seal?.data?.length) {
          setSeal(seal?.data[0]?.seal);
          setDefaultSeal(seal?.data[0]);
        }
      }
    })();
  }, []);

  const [activeKey, setActiveKey] = useState(0);
  return (
    <>
      <div className="grid grid-cols-6 gap-5">
        <Button
          onClick={() => {
            activeKey == 1 ? setActiveKey(0) : setActiveKey(1);
          }}
          key={1}
          active={activeKey == 1}
          appearance="primary"
          color="blue"
        >
          Comment
        </Button>
        <Button
          onClick={() => {
            activeKey == 2 ? setActiveKey(0) : setActiveKey(2);
          }}
          key={2}
          active={activeKey == 2}
          appearance="primary"
          color="blue"
        >
          Doctor Seal
        </Button>
      </div>
      <Accordion activeKey={activeKey}>
        <Accordion.Panel eventKey={1}>
          <div className="w-full border border-stone-200 rounded-md p-10">
            <div style={{ width: "270mm" }} className="!font-mono">
              <Tiptap data={comment} setData={setComment} />
            </div>
            <div>
              <div className="w-1/5 my-4">
                <h3>Select Saved comment</h3>
                <SelectPicker
                  block
                  loading={commentDataLoading}
                  data={commentData?.data.map((cd: IComment) => ({
                    label: cd?.title,
                    value: cd?.comment,
                  }))}
                  onSelect={(p) => {
                    setComment(p);
                  }}
                />
              </div>
              <div>
                Not in the Saved Comment ? Click{" "}
                <span className="text-blue-500">Here</span> to Add New Comment
                to the database
              </div>
            </div>
          </div>
        </Accordion.Panel>
        <Accordion.Panel eventKey={2}>
          <div className="w-full border border-stone-200 rounded-md p-10">
            <div
              style={{
                width: `${width}mm`,
                fontSize: "12px",
                lineHeight: "5px",
              }}
              className="!font-mono"
            >
              <Tiptap data={seal} setData={setSeal} />
            </div>
            <div>
              <div className="w-1/5 my-4">
                <h3>Select Saved Doctor Seal</h3>
                <SelectPicker
                  block
                  loading={
                    sealDataLoading ||
                    defaultSealLoading ||
                    defaultsealFeatching
                  }
                  data={sealData?.data.map((cd: IDoctorSeal) => ({
                    label: cd?.title,
                    value: cd?.seal,
                  }))}
                  onSelect={(p) => {
                    setSeal(p);
                  }}
                  defaultValue={defaultSeal?.seal}
                />
              </div>
              <div>
                Not in the Saved Doctor Seal ? Click{" "}
                <span className="text-blue-500">
                  <NavLink href={"/doctorSeal"}>Here</NavLink>
                </span>{" "}
                to Add New Doctor Seal to the database
              </div>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </>
  );
};

export default Comment;
