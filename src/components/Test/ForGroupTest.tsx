import React, { useState } from "react";
import { Button, Table } from "rsuite";
import RModal from "../ui/Modal";
import { useGetTestsQuery } from "@/redux/api/test/testSlice";
import AlartDialog from "../ui/AlertModal";

const ForGroupTest = ({ fromData, setFormData }) => {
  const [modal, setModal] = useState(false);
  const { data: sData, isLoading } = useGetTestsQuery(undefined);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const addTestHandler = (data) => {
    console.log("1");
    if (fromData.groupTests) {
      fromData.groupTests = [...fromData.groupTests, data];
      console.log("2");
    } else {
      fromData.groupTests = [data];
      console.log("3");
    }

    setFormData(fromData);
  };

  const okHandler = () => {
    console.log("4");
    setModal(!modal);
  };

  const cancelHandler = () => {
    setModal(!modal);
    console.log("5");
  };
  // For remove
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const removeTestHandler = () => {
    fromData.groupTests = fromData.groupTests.filter(
      (data) => deleteData._id !== data._id
    );
    setFormData(fromData);
    setDeleteOpen(!deleteOpen);
  };
  const onCancels = () => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(null);
  };
  const setHandler = (data) => {
    setDeleteData(data);
    setDeleteOpen(!deleteOpen);
  };
  // For fixing infinite loop
  const fix = () => {
    setModal(!modal);
  };
  return (
    <div>
      <div>
        <AlartDialog
          description="Are you sure you want to delete this "
          title="Delete"
          onOk={removeTestHandler}
          onCancel={onCancels}
          open={deleteOpen}
        />
        <div>
          <Button appearance="primary" color="blue" onClick={() => fix()}>
            Add Tests
          </Button>
        </div>
        <div>
          <Table height={420} data={fromData?.groupTests}>
            <Column flexGrow={1} align="center" fixed>
              <HeaderCell>Sl No.</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column flexGrow={2} fixed>
              <HeaderCell>Title</HeaderCell>
              <Cell dataKey="label" />
            </Column>

            <Column flexGrow={2}>
              <HeaderCell>Price</HeaderCell>
              <Cell dataKey="price" />
            </Column>

            <Column flexGrow={3}>
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowdate) => (
                  <Button
                    appearance="ghost"
                    color="red"
                    className="ml-2"
                    onClick={() => setHandler(rowdate)}
                  >
                    Remove
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </div>
        <div>
          <RModal
            title="Add test"
            open={modal}
            size="lg"
            okHandler={okHandler}
            cancelHandler={cancelHandler}
          >
            <Table height={420} data={sData?.data?.data}>
              <Column flexGrow={2} fixed>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="label" />
              </Column>

              <Column flexGrow={1}>
                <HeaderCell>Price</HeaderCell>
                <Cell dataKey="price" />
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Description</HeaderCell>
                <Cell dataKey="description" />
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowdate) => (
                    <Button
                      appearance="ghost"
                      color="blue"
                      className="ml-2"
                      onClick={() => addTestHandler(rowdate)}
                    >
                      Add
                    </Button>
                  )}
                </Cell>
              </Column>
            </Table>
          </RModal>
        </div>
      </div>
    </div>
  );
};

export default ForGroupTest;
