import {
  useGetTestsQuery,
  useLazyGetTestsQuery,
} from "@/redux/api/test/testSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import { Button, InputPicker, Table } from "rsuite";
import { IParamsForTestInformation } from "./initialDataAndTypes";
import SearchIcon from "@rsuite/icons/Search";

const AvailableTestSection = (params: IParamsForTestInformation) => {
  const { Cell, Column, HeaderCell } = Table;
  const { data: testSetData } = useGetTestsQuery(undefined);
  // Handling add test
  const handleAddTest = (rowData: ITest) => {
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setHours(
      estimatedDeliveryDate.getHours() + Number(rowData.processTime)
    );
    const newObject = {
      ...params.formData,
    };
    const tests = newObject.tests ? newObject.tests : [];
    var sl = Number(tests.length) + 1;
    const testDataForOrder = {
      test: rowData,
      deliveryTime: estimatedDeliveryDate,
      status: "pending",
      remark: "",
      discount: 0,
      SL: sl,
    };
    const newTestArray = [...tests, testDataForOrder];
    newObject.tests = newTestArray;
    params.setFormData(newObject);
  };

  // For handeling searching the single tests
  const [tests, setTests] = useState([]);
  const [
    search,
    {
      isLoading: testSearchLoading,
      isError: testSearchError,
      data: testSearchData,
    },
  ] = useLazyGetTestsQuery();
  const handleTestSearch = async (value: string) => {
    const data = await search({ searchTerm: value });
  };

  useEffect(() => {
    if (!testSearchLoading && testSearchData?.data?.data) {
      setTests(testSearchData?.data?.data);
    }
  }, [testSearchLoading, testSearchData?.data]);
  return (
    <>
      <div className=" p-2 bg-stone-100 rounded-lg">
        <h3 className="text-center font-bold text-2xl">Available Tests</h3>
        <div className="mt-5">
          <InputPicker
            key={1500}
            onSearch={(value, event) => {
              handleTestSearch(value);
            }}
            data={tests?.map(
              (test: ITest): { label: string; value: string } => ({
                label: test.label,
                value: test as unknown as string,
              })
            )}
            onSelect={(value, event) => {
              handleAddTest(value);
            }}
            placeholder={"Search"}
            className="w-full z-50"
            caretAs={SearchIcon}
            loading={testSearchLoading}
          />
        </div>
        <Table
          height={500}
          rowHeight={60}
          bordered
          cellBordered
          data={testSetData?.data?.data}
          wordWrap={"break-all"}
        >
          <Column align="center" resizable flexGrow={2}>
            <HeaderCell>Test ID</HeaderCell>
            <Cell dataKey="testCode" />
          </Column>
          <Column align="center" resizable flexGrow={2}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="label" />
          </Column>
          <Column align="center" resizable flexGrow={2}>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price" />
          </Column>

          <Column align="center" resizable flexGrow={2}>
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(rowdata) => (
                <>
                  <Button
                    onClick={() => handleAddTest(rowdata as ITest)}
                    color="green"
                    appearance="primary"
                  >
                    Add
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </>
  );
};

export default AvailableTestSection;
