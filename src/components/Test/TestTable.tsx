import { ENUM_MODE } from "@/enum/Mode";
import {
  useDeleteTestMutation,
  useGetTestsQuery,
} from "@/redux/api/test/testSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import VisibleIcon from "@rsuite/icons/Visible";
import React, { useEffect, useState } from "react";
import { Button, Form, Message, Pagination, Table, toaster } from "rsuite";
import AlartDialog from "../ui/AlertModal";

const { Column, HeaderCell, Cell } = Table;
const TestTable = ({
  patchHandler,
}: {
  patchHandler: (data: { data: ITest; mode: string }) => void;
}) => {
  // For delete
  const [deleteData, setDeleteData] = useState<string>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [
    deleteTest,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteTestMutation();
  const handleDeletOpen = (id: string) => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(id);
  };
  const okHandler = () => {
    deleteTest(deleteData);
    setDeleteOpen(!deleteOpen);
  };
  const cancelHandler = () => {
    setDeleteOpen(!deleteOpen);
    setDeleteData(undefined);
  };

  useEffect(() => {
    if (deleteSuccess) {
      toaster.push(
        <Message type="success">Operation completed Successfully</Message>
      );
    }
    if (deleteError) {
      toaster.push(
        <Message type="error">
          Somethng went wrong. please try again letter
        </Message>
      );
    }
  }, [deleteSuccess, deleteError]);
  // For search
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });
  const {
    data: testData,
    isLoading: testLoading,
    isError: TesError,
    isFetching,
  } = useGetTestsQuery(searchData);

  //pagination
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const handleChangeLimit = (dataKey: React.SetStateAction<number>) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = testData?.data.data.filter((v: any, i: number) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  return (
    <div>
      <div className="my-5">
        <Form
          onChange={(formValue: Record<string, any>) =>
            setSearchData({ ...searchData, searchTerm: formValue.searchTerm })
          }
          className="grid grid-cols-1 gap-5 justify-center w-full"
          fluid
        >
          <Form.Group controlId="searchTerm">
            <Form.ControlLabel>Search</Form.ControlLabel>
            <Form.Control name="searchTerm" htmlSize={100} />
          </Form.Group>
        </Form>
      </div>
      <Table
        height={550}
        data={testData?.data.data as ITest[]}
        loading={testLoading || isFetching}
        className="w-full"
        bordered
        cellBordered
        rowHeight={60}
        loadAnimation={true}
      >
        <Column align="center" resizable flexGrow={1}>
          <HeaderCell>Test Code</HeaderCell>
          <Cell dataKey="testCode" />
        </Column>

        <Column resizable flexGrow={4}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="label" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Department</HeaderCell>
          <Cell dataKey="department.label" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Price</HeaderCell>
          <Cell dataKey="price" />
        </Column>
        <Column resizable flexGrow={1}>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="type" />
        </Column>

        <Column flexGrow={2} resizable>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdate) => (
              <>
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeletOpen(rowdate._id)}
                  loading={deleteLoading}
                >
                  Delete
                </Button>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="ml-2"
                  onClick={() =>
                    patchHandler({ data: rowdate as ITest, mode: "patch" })
                  }
                >
                  Edit
                </Button>
                <Button
                  // appearance="transparent"
                  className="ml-2"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    patchHandler({
                      data: rowdate as ITest,
                      mode: ENUM_MODE.VIEW,
                    });
                  }}
                />
              </>
            )}
          </Cell>
        </Column>
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={testData?.data.data.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      <div>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={10}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={testData?.data?.meta?.total}
          limitOptions={[10, 30, 50]}
          limit={testData?.data?.meta?.limit}
          activePage={testData?.data?.meta?.page}
          onChangePage={(page: number) =>
            setSearchData((prevData) => ({ ...prevData, page: page }))
          }
          onChangeLimit={(limit: number) =>
            setSearchData((prevData) => ({ ...prevData, limit: limit }))
          }
        />
      </div>
      <div>
        <AlartDialog
          description="Are you sure you want to delete this code "
          title="Delete TEst"
          onCancel={cancelHandler}
          onOk={okHandler}
          open={deleteOpen}
        />
      </div>
    </div>
  );
};

export default TestTable;
