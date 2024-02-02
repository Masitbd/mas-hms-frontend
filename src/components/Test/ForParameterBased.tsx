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

const { Cell, Column, HeaderCell } = Table;
const ForParameterBased = ({
  testFromData,
  setTestFromData,
}: {
  testFromData: any;
  setTestFromData: (data: any) => void;
}) => {
  let resultFieldData = testFromData.resultFields;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [fromData, setfromData] = useState();
  const [mode, setMode] = useState("");
  const patchOpenHandler = (data) => {
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
        setfromData(undefined);
      } else {
        const newDate = resultFieldData.filter(
          (data) => data.gid !== fromData.gid
        );
        testFromData.resultFields = [...newDate, fromData];
        setTestFromData(testFromData);
        setModalOpen(!modalOpen);
        setfromData(undefined);
      }
    }
  };
  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setfromData(undefined);
  };
  // Fro delete
  const [deleteData, setDeleteData] = useState();
  const [alertModalOpen, setAlertModal] = useState(false);
  const deleteButtonFunction = (data) => {
    setDeleteData(data);
    setAlertModal(true);
  };
  const deleteHanldler = () => {
    const newData = testFromData.resultFields.filter(
      (data) => data.gid !== deleteData.gid
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
    investigation: StringType().isRequired("This field is required."),
    test: StringType().isRequired("This field is required."),
    unit: StringType().isRequired("This field is required."),
    normalUnit: StringType().isRequired("This field is required."),
  });

  const { data: pdrvData, isLoading: pdrvLoading } = useGetPdrvQuery(undefined);

  return (
    <div>
      <div className="my-5">
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
        rowHeight={60}
        bordered
        cellBordered
      >
        <Column flexGrow={3} align="center" fixed>
          <HeaderCell>Investigation</HeaderCell>
          <Cell dataKey="investigation" />
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
          <Cell dataKey="normalUnit" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => deleteButtonFunction(rowdate)}
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
            <Form.Group controlId="normalUnit">
              <Form.ControlLabel>Normal Unit</Form.ControlLabel>
              <Form.Control name="normalUnit" />
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
                  name="values"
                  accepter={TagPicker}
                  data={pdrvData?.data.map((data) => {
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
