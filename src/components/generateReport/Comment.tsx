import React, { useEffect, useState } from "react";
import Tiptap from "../tiptap/TipTap";
import { Accordion, Button, SelectPicker } from "rsuite";
import { ITestResultForParameter } from "./initialDataAndTypes";
import { useGetQuery } from "@/redux/api/comment/commentSlice";
import { IComment } from "../comment/typesAdInitialData";

const Comment = (props: {
  result: ITestResultForParameter;
  setResult: any;
}) => {
  const { data: commentData, isLoading: commentDataLoading } =
    useGetQuery(undefined);
  const [comment, setComment] = useState(props?.result?.comment);

  useEffect(() => {
    const newData = {
      ...props.result,
    };
    newData.comment = comment;
    props.setResult && props.setResult(newData);
  }, [comment]);
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
            <Tiptap data={comment} setData={setComment} />
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
                  onSelect={(p) => setComment(p)}
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
      </Accordion>
    </>
  );
};

export default Comment;
