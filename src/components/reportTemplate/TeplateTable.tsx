import React, { useRef } from "react";
import { Button, Table } from "rsuite";
import { ENUM_MODE } from "@/enum/Mode";
import swal from "sweetalert";
import { IPropsForTemplateTable, ITemplate } from "./typesandInitialData";
import { IPropsForCommentTable } from "../comment/typesAdInitialData";
import {
  useDeleteTemplateMutation,
  useGetTemplateQuery,
} from "@/redux/api/template/templateSlice";

const TemplateTable = (props: IPropsForTemplateTable) => {
  const { data: templateData, isLoading: templateDataLoading } =
    useGetTemplateQuery(undefined);

  const { setData, setMode, setModalOpen } = props;
  const [remove] = useDeleteTemplateMutation();
  const { Column, HeaderCell, Cell } = Table;
  const viewAndEditButtonHandler = (data: ITemplate, mode: string) => {
    const modifiedData = JSON.parse(JSON.stringify(data));
    setData(modifiedData);
    setMode(mode);
    setModalOpen(true);
  };

  const DeleteButtonHandler = async (props: ITemplate) => {
    const confirm = await swal({
      text: "Are you sure you want to delete this Template",
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
        swal("success", "Template Deleted successfully", "success");
      }
    }
  };

  // Testing printing functionality

  return (
    <div>
      <Table
        height={600}
        bordered
        cellBordered
        rowHeight={65}
        loading={templateData}
        data={templateData?.data}
        className="text-md"
      >
        <Column flexGrow={2}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdata: ITemplate) => (
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

export default TemplateTable;
