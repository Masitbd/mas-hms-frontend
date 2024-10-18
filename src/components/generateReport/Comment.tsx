import { useGetQuery } from "@/redux/api/comment/commentSlice";
import { useGetSealQuery } from "@/redux/api/doctorSeal/doctorSealSlice";
import { useEffect, useState } from "react";
import { Accordion, Button, SelectPicker } from "rsuite";
import { IComment, IDoctorSeal } from "../comment/typesAdInitialData";
import Tiptap from "../tiptap/TipTap";
import {
  ITestResultForParameter,
  ITEstREsultForMicroBio,
} from "./initialDataAndTypes";

const Comment = (props: {
  result: ITestResultForParameter | ITEstREsultForMicroBio;
  setResult: any;
}) => {
  const { data: commentData, isLoading: commentDataLoading } =
    useGetQuery(undefined);
  const { data: sealData, isLoading: sealDataLoading } =
    useGetSealQuery(undefined);
  const [comment, setComment] = useState(props?.result?.comment);
  const [seal, setSeal] = useState(props?.result?.seal);

  useEffect(() => {
    const newData = {
      ...props.result,
    };
    newData.comment = comment;
    newData.seal = seal;
    props.setResult && props.setResult(newData);
  }, [comment, seal]);
  const [activeKey, setActiveKey] = useState(0);
  return (
    <>
      <div className="grid grid-cols-12 gap-5">
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
            <div style={{ width: "270mm" }}>
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
                    console.log(p);
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
            <div style={{ width: "270mm" }}>
              <Tiptap data={seal} setData={setSeal} />
            </div>
            <div>
              <div className="w-1/5 my-4">
                <h3>Select Saved Doctor Seal</h3>
                <SelectPicker
                  block
                  loading={sealDataLoading}
                  data={sealData?.data.map((cd: IDoctorSeal) => ({
                    label: cd?.title,
                    value: cd?.seal,
                  }))}
                  onSelect={(p) => {
                    setSeal(p);
                  }}
                />
              </div>
              <div>
                Not in the Saved Doctor Seal ? Click{" "}
                <span className="text-blue-500">Here</span> to Add New Doctor
                Seal to the database
              </div>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </>
  );
};

export default Comment;
