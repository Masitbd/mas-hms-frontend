import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Loader,
  Message,
  Modal,
  Schema,
  SelectPicker,
  Table,
  TagPicker,
  Toggle,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import { useGetPdrvQuery } from "@/redux/api/pdrv/pdrvSlice";
import AlartDialog from "../ui/AlertModal";
import { IResultField, ITest } from "@/types/allDepartmentInterfaces";
import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import ExistingTest from "./ExistingTest";
type NewITestType = IResultField & { gid: number };
const { Cell, Column, HeaderCell } = Table;
const ForParameterBased = ({
  testFromData,
  setTestFromData,
  defaultMode,
}: {
  testFromData: any;
  setTestFromData: (data: any) => void;
  defaultMode: string;
}) => {
  let resultFieldData = testFromData?.resultFields;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const initialValue = {
    title: "",
    test: "",
    unit: "",
    normalValue: "",
    hasPdrv: false,
    gid: 0,
    defaultValues: [],
  };
  const [fromData, setfromData] = useState<NewITestType & Record<string, any>>(
    initialValue
  );
  const [mode, setMode] = useState("");
  const patchOpenHandler = (data: NewITestType) => {
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
          (data: NewITestType) => data.gid !== fromData.gid
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
  // Fro delete
  const [deleteData, setDeleteData] = useState<NewITestType>();
  const [alertModalOpen, setAlertModal] = useState(false);
  const deleteButtonFunction = (data: NewITestType) => {
    setDeleteData(data);
    setAlertModal(true);
  };
  const deleteHanldler = () => {
    const newData = testFromData.resultFields.filter(
      (data: NewITestType) => data.gid !== deleteData?.gid
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
    test: StringType().isRequired("This field is required."),
    unit: StringType().isRequired("This field is required."),
    normalValue: StringType().isRequired("This field is required."),
  });

  const { data: pdrvData, isLoading: pdrvLoading } = useGetPdrvQuery(undefined);

  // Existing test addition
  const [existingModal, setExistingModal] = useState(false);

  return (
    <div>
      <div className="my-5">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => newOpenHandler()}
          className="mr-2"
        >
          Add New
        </Button>
        <Button
          appearance="primary"
          color="blue"
          onClick={() => setExistingModal(true)}
        >
          Add existing
        </Button>
      </div>
      <div>
        <ExistingTest
          existingModal={existingModal}
          formData={testFromData}
          setExistingModal={setExistingModal}
          setFormData={setTestFromData}
        />
      </div>
      <Table
        height={420}
        data={testFromData?.resultFields as NewITestType[]}
        rowHeight={60}
        bordered
        cellBordered
      >
        <Column flexGrow={3} align="center" fixed>
          <HeaderCell>Investigation</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        <Column flexGrow={4} width={100} fixed>
          <HeaderCell>Test</HeaderCell>
          <Cell dataKey="test" />
        </Column>

        <Column flexGrow={1} width={200}>
          <HeaderCell>Unit</HeaderCell>
          <Cell dataKey="unit" />
        </Column>
        <Column flexGrow={1} width={200}>
          <HeaderCell>Normal Unit</HeaderCell>
          <Cell dataKey="normalValue" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteButtonFunction(rowdate as NewITestType)}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() => patchOpenHandler(rowdate as NewITestType)}
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
            onChange={(formValue: any, event?: React.SyntheticEvent) =>
              setfromData(formValue)
            }
            formDefaultValue={fromData}
            className="grid grid-cols-2 gap-5 "
            fluid
            model={model}
            ref={formRef}
          >
            <Form.Group controlId="title">
              <Form.ControlLabel>Investigation</Form.ControlLabel>
              <Form.Control name="title" />
            </Form.Group>
            <Form.Group controlId="test">
              <Form.ControlLabel>Test</Form.ControlLabel>
              <Form.Control name="test" />
            </Form.Group>
            <Form.Group controlId="unit">
              <Form.ControlLabel>Unit</Form.ControlLabel>
              <Form.Control name="unit" />
            </Form.Group>
            <Form.Group controlId="normalValue">
              <Form.ControlLabel>Normal Unit</Form.ControlLabel>
              <Form.Control name="normalValue" />
            </Form.Group>
            <Form.Group controlId="hasPdrv">
              <Form.ControlLabel>Result Values</Form.ControlLabel>
              <Form.Control name="hasPdrv" accepter={Toggle} />
            </Form.Group>
            <Form.Group controlId="pdrvValues">
              <Form.ControlLabel>Values</Form.ControlLabel>
              {pdrvLoading ? (
                <Loader />
              ) : (
                <Form.Control
                  name="defaultValues"
                  accepter={TagPicker}
                  data={pdrvData?.data.map((data: IPdrv) => {
                    return { label: data.label, value: data._id };
                  })}
                  disabled={!fromData?.hasPdrv}
                />
              )}
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

export default ForParameterBased;
