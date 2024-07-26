import React, { useRef } from "react";
import { Button, Table } from "rsuite";
import { IComment, IPropsForCommentTable } from "./typesAdInitialData";
import { ENUM_MODE } from "@/enum/Mode";
import { useDeleteMutation } from "@/redux/api/comment/commentSlice";

const CommentTable = (props: IPropsForCommentTable) => {
  const { setData, setMode } = props;
  const [remove] = useDeleteMutation();
  const { Column, HeaderCell, Cell } = Table;
  const viewAndEditButtonHandler = (data: IComment, mode: string) => {
    const modifiedData = JSON.parse(JSON.stringify(data));
    setData(modifiedData);
    setMode(mode);
  };

  const DeleteButtonHandler = async (props: IComment) => {
    const confirm = await swal({
      text: "Are you sure you want to delete this comment",
      title: "Warning",
      icon: "error",
      buttons: {
        cancel: {
          closeModal: true,
          text: "Cancel",
          value: true,
          visible: true,
          className: "btn btn-primary",
        },
        confirm: {
          closeModal: true,
          text: "Ok",
          value: true,
          visible: true,
          className: "btn btn-danger",
        },
      },
    });

    if (confirm) {
      const result = await remove(props._id);
      if ("data" in result) {
        swal("success", "Comment Deleted successfully", "success");
      }
    }
  };

  // Testing printing functionality

  return (
    <div>
      <Button onClick={() => print()}>Print</Button>{" "}
      <Table
        height={600}
        bordered
        cellBordered
        rowHeight={65}
        className="text-md"
      >
        <Column flexGrow={2}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Comment</HeaderCell>
          <Cell>
            {(rowdata: IComment) => (
              <>
                {rowdata?.comment ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: rowdata.comment }}
                  ></div>
                ) : (
                  ""
                )}
              </>
            )}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdata: IComment) => (
              <>
                <Button
                  appearance="primary"
                  color="blue"
                  onClick={() =>
                    viewAndEditButtonHandler(rowdata, ENUM_MODE.VIEW)
                  }
                >
                  View
                </Button>
                <Button
                  appearance="primary"
                  color="green"
                  onClick={() =>
                    viewAndEditButtonHandler(rowdata, ENUM_MODE.EDIT)
                  }
                >
                  Edit
                </Button>
                <Button
                  appearance="primary"
                  color="red"
                  onClick={() => DeleteButtonHandler(rowdata)}
                >
                  Delete
                </Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default CommentTable;
