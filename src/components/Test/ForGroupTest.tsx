import React, { useState } from "react";
import { Button, Table, toaster } from "rsuite";
import RModal from "../ui/Modal";
import { useGetTestsQuery } from "@/redux/api/test/testSlice";
import AlartDialog from "../ui/AlertModal";
import { IResultField, ITest } from "@/types/allDepartmentInterfaces";
import swal from "sweetalert";
import { ENUM_MODE } from "@/enum/Mode";

const ForGroupTest = ({
  fromData,
  setFormData,
  mode,
}: {
  fromData: ITest;
  setFormData: (data: ITest) => void;
  mode: string;
}) => {
  const [modal, setModal] = useState(false);
  const { data: sData, isLoading } = useGetTestsQuery(undefined);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const addTestHandler = (data: ITest) => {
    if (fromData.groupTests) {
      fromData.groupTests = [...fromData.groupTests, data];
    } else {
      fromData.groupTests = [data];
    }

    setFormData(fromData);
    swal("Added", "Test Added", "success");
  };

  const okHandler = () => {
    setModal(!modal);
  };

  const cancelHandler = () => {
    setModal(!modal);
  };
  // For remove
  const [deleteOpen, setDeleteOpen] = useState(false);
  const removeTestHandler = (porps: ITest) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to remove This",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fromData.groupTests = fromData.groupTests.filter(
          (data) => porps?._id !== data._id
        );
        setFormData(fromData);
        setDeleteOpen(!deleteOpen);
        swal(
          "Deleted!",

          `Deleted Successfully `,
          "success"
        );
      }
    });
  };

  // For fixing infinite loop
  const fix = () => {
    setModal(!modal);
  };
  return (
    <div>
      <div>
        <div>
          <Button appearance="primary" color="blue" onClick={() => fix()}>
            Add Tests
          </Button>
        </div>
        <div>
          <Table
            height={420}
            data={fromData?.groupTests}
            rowHeight={50}
            bordered
            cellBordered
          >
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
                    onClick={() => removeTestHandler(rowdate as ITest)}
                    disabled={mode == ENUM_MODE.VIEW}
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
            <Table height={420} data={sData?.data?.data} rowHeight={60}>
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
                      onClick={() => addTestHandler(rowdate as ITest)}
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
