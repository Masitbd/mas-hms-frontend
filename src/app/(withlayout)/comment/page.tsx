"use client";
import CommentTable from "@/components/comment/CommentTable";
import NewAndUpdate from "@/components/comment/NewAndUpdate";
import {
  IComment,
  InitalCommentData,
} from "@/components/comment/typesAdInitialData";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { ENUM_MODE } from "@/enum/Mode";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Comment</h2>
        </div>
        <div className="p-2">
          <div className="my-3">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
            >
              <Button
                appearance="primary"
                color="blue"
                onClick={() => commentModalHandler(true)}
              >
                Add New Comment
              </Button>
            </AuthCheckerForComponent>
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
      </div>
    </div>
  );
};

export default Comment;
