"use client";
import CommentTable from "@/components/comment/CommentTable";
import NewAndUpdate from "@/components/comment/NewAndUpdate";
import {
  IComment,
  InitalCommentData,
} from "@/components/comment/typesAdInitialData";
import { ENUM_MODE } from "@/enum/Mode";
import React, { useState } from "react";
import { Button } from "rsuite";

const Comment = () => {
  const [comment, setComment] = useState<IComment | null>(InitalCommentData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(ENUM_MODE.NEW);

  const commentDataHandler = (param: IComment) => {
    setComment(param);
  };
  const commentModalHandler = (param: boolean) => {
    setModalOpen(param);
  };
  const modeHandler = (param: string) => {
    setMode(param as ENUM_MODE);
  };

  return (
    <div>
      <div className="my-3">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => commentModalHandler(true)}
        >
          Add New Comment
        </Button>
      </div>
      <div>
        <NewAndUpdate
          data={comment as IComment}
          open={modalOpen}
          setData={commentDataHandler}
          setOpen={commentModalHandler}
          mode={mode}
          setMode={modeHandler}
        />
      </div>
      <div>
        <CommentTable
          setData={commentDataHandler}
          setMode={modeHandler}
          setModalOpen={commentModalHandler}
        />
      </div>
    </div>
  );
};

export default Comment;
