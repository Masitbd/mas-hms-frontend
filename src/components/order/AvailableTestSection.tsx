import {
  useGetTestsQuery,
  useLazyGetTestsQuery,
} from "@/redux/api/test/testSlice";
import { ITest, IVacuumTube } from "@/types/allDepartmentInterfaces";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Button,
  InputPicker,
  Message,
  Placeholder,
  SelectPicker,
  Table,
  toaster,
} from "rsuite";
import {
  IParamsForTestInformation,
  ItestInformaiton,
} from "./initialDataAndTypes";
import SearchIcon from "@rsuite/icons/Search";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";
import SelectPickerForOrder from "./SelectPickerForOrder";

const AvailableTestSection = (params: IParamsForTestInformation) => {
  const { Cell, Column, HeaderCell } = Table;
  const ref = useRef();
  const { data: testSetData, isLoading: tableDataLoading } = useGetTestsQuery({
    flag: "o",
  });
  // Handling add test

  const handleAddTest = (rowData: ITest) => {
    // 1.Checking if the test has already been added
    if (
      params.formData?.tests.length &&
      params.formData?.tests
        .map((test: ITestsFromOrder) => test.test._id)
        .includes(rowData?._id)
    ) {
      toaster.push(<Message type="error">Opps! Already exists</Message>);
      return;
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setHours(
      estimatedDeliveryDate.getHours() + Number(rowData.processTime)
    );
    const newObject = {
      ...params.formData,
    };
    const tests = newObject.tests
      ? newObject.tests.filter(
          (test: ItestInformaiton) => test.status !== "tube"
        )
      : [];
    var sl = Number(tests.length) + 1;
    const testDataForOrder = {
      test: rowData,
      deliveryTime: estimatedDeliveryDate,
      status: "pending",
      remark: "",
      discount: 0,
      SL: sl,
    };
    let newTestArray = [...tests, testDataForOrder];

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
      isFetching,
    },
  ] = useLazyGetTestsQuery();
  const handleTestSearch = async (value: string) => {
    const data = await search({ searchTerm: value, flag: "o" });
    if ("data" in data) {
    }
  };

  const Menu = (menu: ReactNode) => {
    if (testSearchLoading || isFetching) {
      return <Placeholder.Grid rows={10} columns={1} active />;
    } else return <div className="grid grid-cols-1">{menu}</div>;
  };

  useEffect(() => {
    if (testSearchData?.data?.data) {
      // Delay the update to ensure smoother re-render

      setTests(testSearchData.data.data);
      // Delay of 100ms
    }
  }, [testSearchData]);

  return (
    <>
      {/* <div className=" p-2 bg-stone-100 rounded-lg">
        <h3 className="text-center font-bold text-2xl">Available Tests</h3>
        <div className="mt-5" key={25}> */}

      <div className="my-2">
        <SelectPickerForOrder
          formData={params.formData}
          mode={params.mode}
          setFormData={params.setFormData}
          setRModalOpen={params.setRModalOpen}
          setRTest={params.setRTest}
          addTestHanlder={handleAddTest}
        />
      </div>
      {/* </div> */}
      {/* <Table
          height={400}
          bordered
          cellBordered
          data={testSetData?.data?.data}
          wordWrap={"break-all"}
          loading={tableDataLoading}
          autoFocus
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
                    disabled={
                      params.formData?.tests.length
                        ? params.formData?.tests
                            .map((test: ITestsFromOrder) => test.test._id)
                            .includes(rowdata?._id)
                        : false
                    }
                    size="sm"
                  >
                    Add
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table> */}
      {/* </div> */}
    </>
  );
};

export default AvailableTestSection;
