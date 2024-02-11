import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  Loader,
  Modal,
  Schema,
  SelectPicker,
  Table,
  TagPicker,
  Toggle,
} from "rsuite";
import RModal from "../ui/Modal";
import { useGetPdrvQuery } from "@/redux/api/pdrv/pdrvSlice";
import AlartDialog from "../ui/AlertModal";
import { IResultField } from "@/types/allDepartmentInterfaces";

const { Cell, Column, HeaderCell } = Table;
const ForDescriptiveBased = ({
  testFromData,
  setTestFromData,
}: {
  testFromData: any;
  setTestFromData: (data: any) => void;
}) => {
  const initialValue = {
    title: "",
    resultDescripton: "",
  };
  type INewType = IResultField & { gid: number };
  let resultFieldData = testFromData.resultFields;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const [modalOpen, setModalOpen] = useState(false);

  const [fromData, setfromData] = useState<Partial<IResultField>>(initialValue);
  const [mode, setMode] = useState("");
  const patchOpenHandler = (data: Partial<IResultField>) => {
    setMode("patch");
    setModalOpen(!modalOpen);
    setfromData(data);
  };

  //   For new
  const newOpenHandler = () => {
    setMode("new");
    setModalOpen(!modalOpen);
  };
  const singleTestModalHandler = () => {
    if (formRef.current.check()) {
      if (mode === "new") {
        setModalOpen(!modalOpen);
        fromData.gid = resultFieldData?.length ? resultFieldData.length + 1 : 1;
        if (resultFieldData) {
          testFromData.resultFields = [...resultFieldData, fromData];
        } else {
          testFromData.resultFields = [fromData];
        }

        setTestFromData(testFromData);
        setfromData(initialValue);
      } else {
        const newDate = resultFieldData.filter(
          (data: INewType) => data.gid !== fromData.gid
        );
        testFromData.resultFields = [...newDate, fromData];
        setTestFromData(testFromData);
        setModalOpen(!modalOpen);
        setfromData(initialValue);
      }
    }
  };
  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setfromData(initialValue);
  };
  // For delete
  const [deleteData, setDeleteData] = useState<INewType>();
  const [alertModalOpen, setAlertModal] = useState(false);
  const deleteButtonFunction = (data: INewType) => {
    setDeleteData(data);
    setAlertModal(true);
  };
  const deleteHanldler = () => {
    const newData = testFromData.resultFields.filter(
      (data: INewType) => data.gid !== deleteData?.gid
    );
    testFromData.resultFields = newData;

    setTestFromData(testFromData);
    setDeleteData(undefined);
    setAlertModal(false);
  };
  const deleteCancelHandler = () => {
    setDeleteData(undefined);
    setAlertModal(false);
  };
  const { StringType, NumberType } = Schema.Types;
  const model = Schema.Model({
    title: StringType().isRequired("This field is required."),
    resultDescripton: StringType().isRequired("This field is required."),
  });

  const { data: pdrvData, isLoading: pdrvLoading } = useGetPdrvQuery(undefined);

  return (
    <div>
      <div>
        <Button
          appearance="primary"
          color="blue"
          onClick={() => newOpenHandler()}
        >
          Add Test Params
        </Button>
      </div>
      <Table
        height={420}
        data={testFromData?.resultFields}
        cellBordered
        bordered
        rowHeight={55}
      >
        <Column flexGrow={1} align="center">
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="resultDescripton" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteButtonFunction(rowdate as INewType)}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() => patchOpenHandler(rowdate)}
                >
                  Edit
                </Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>

      <div>
        {/* New Modal */}
        <RModal
          title={
            mode === "new"
              ? "Add Test Result Fields"
              : "Edit Test Result Fields"
          }
          okHandler={singleTestModalHandler}
          open={modalOpen}
          size="md"
          cancelHandler={cancelHandler}
        >
          <Form
            onChange={setfromData}
            formDefaultValue={fromData}
            className="grid grid-cols-2 gap-5 "
            fluid
            model={model}
            ref={formRef}
          >
            <Form.Group controlId="title">
              <Form.ControlLabel>Title</Form.ControlLabel>
              <Form.Control name="title" />
            </Form.Group>
            <Form.Group controlId="resultDescripton">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control name="resultDescripton" />
            </Form.Group>
          </Form>
        </RModal>
      </div>

      <div>
        <AlartDialog
          description="Are you sure you want to delete this item ?"
          onCancel={deleteCancelHandler}
          onOk={deleteHanldler}
          open={alertModalOpen}
          title="Delete Test Result Value"
        ></AlartDialog>
      </div>
    </div>
  );
};

export default ForDescriptiveBased;
