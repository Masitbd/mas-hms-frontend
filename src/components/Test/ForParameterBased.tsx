import { IResultField } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import { Button, Form, Schema, Table, TagInput } from "rsuite";
import swal from "sweetalert";
import RModal from "../ui/Modal";
import ExistingTest from "./ExistingTest";
import { ENUM_MODE } from "@/enum/Mode";
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
    investigation: "",
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
  const patchOpenHandler = (data: NewITestType, index: number) => {
    setMode("patch");
    setModalOpen(!modalOpen);
    const modifiedData = Object.assign({}, data);
    modifiedData.gid = index;

    setfromData(modifiedData);
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
        const modifiedData = [...testFromData.resultFields];
        modifiedData[fromData.gid] = fromData;
        testFromData.resultFields = [...modifiedData];
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
  const deleteHanldler = (index: number) => {
    setMode(ENUM_MODE.VIEW);
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const newData = testFromData.resultFields.filter(
          (data: NewITestType, dindex: number) => index !== dindex
        );
        testFromData.resultFields = newData;
        setTestFromData(testFromData);
        setMode("new");
        swal("Deleted!", " deleted!", "success");
      }
    });
  };
  const { StringType, NumberType } = Schema.Types;
  const model = Schema.Model({
    investigation: StringType().isRequired("This field is required."),
    test: StringType().isRequired("This field is required."),
  });

  // Existing test addition
  const [existingModal, setExistingModal] = useState(false);

  return (
    <div>
      <div className="my-5">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => setExistingModal(true)}
        >
          Add Tests
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
      <div className="w-full">
        <Table
          height={420}
          data={testFromData?.resultFields as NewITestType[]}
          rowHeight={60}
          bordered
          cellBordered
          width={830}
        >
          <Column flexGrow={3} align="center" fixed>
            <HeaderCell>Investigation</HeaderCell>
            <Cell dataKey="investigation" />
          </Column>

          <Column flexGrow={4} fixed>
            <HeaderCell>Test</HeaderCell>
            <Cell dataKey="test" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Unit</HeaderCell>
            <Cell dataKey="unit" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Normal Unit</HeaderCell>
            <Cell dataKey="normalValue" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell>Action</HeaderCell>
            <Cell align="center">
              {(rowdate, index) => (
                <>
                  <Button
                    appearance="ghost"
                    color="red"
                    onClick={() => deleteHanldler(index as number)}
                  >
                    Delete
                  </Button>
                  <Button
                    appearance="ghost"
                    color="blue"
                    className="ml-2"
                    onClick={() =>
                      patchOpenHandler(rowdate as NewITestType, index as number)
                    }
                  >
                    Edit
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
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
            className="grid grid-cols-2 gap-2 w-full"
            fluid
            model={model}
            ref={formRef}
          >
            <Form.Group controlId="investigation">
              <Form.ControlLabel>Investigation</Form.ControlLabel>
              <Form.Control name="investigation" />
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

            <Form.Group controlId="pdrvValues">
              <Form.ControlLabel>Default Values</Form.ControlLabel>

              <Form.Control name="defaultValue" accepter={TagInput} block />
            </Form.Group>
          </Form>
        </RModal>
      </div>
    </div>
  );
};

export default ForParameterBased;
