import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@rsuite/icons/Search";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Message,
  Modal,
  Schema,
  Table,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import {
  useGetTestsQuery,
  useLazyGetTestQuery,
  useLazyGetTestsQuery,
} from "@/redux/api/test/testSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import { RowDataType } from "rsuite/esm/Table";

const { Cell, Column, HeaderCell } = Table;

type IParams = {
  formData: any;
  setFormData: (params: any) => void;
};

const TestInformation = (params: IParams) => {
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

  // Test removal handler
  const testRemoveFromListHandler = (data: RowDataType<any>) => {
    const newObject = {
      ...params.formData,
    };
    const newTestsData = newObject.tests.filter(
      (test: { SL: any }) => test.SL !== data.SL
    );
    if (newTestsData.length > 0) {
      newTestsData.map(
        (test: { SL: number }, index: number) => (test.SL = index + 1)
      );
    }

    newObject.tests = newTestsData;
    params.setFormData(newObject);
  };

  // For handeling searching the single tests
  const [tests, setTests] = useState([]);
  const [search, { isLoading: testSearchLoading, isError: testSearchError }] =
    useLazyGetTestsQuery();
  const handleTestSearch = async (value: string) => {
    const data = await search({ searchTerm: value });
    setTests(data.data.data.data);
  };

  const handleCellEdit = (id: RowDataType<any>, key: string, value: any) => {
    const newObject = {
      ...params.formData,
    };
    newObject.tests.find((testInfo: { SL: any }) => testInfo.SL === id.SL)[
      key
    ] = value;
    params.setFormData(newObject);
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Test Information</h2>
      <div>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <Table
              data={params?.formData?.tests}
              className="w-full"
              bordered
              cellBordered
              rowHeight={100}
              wordWrap={"break-word"}
              height={500}
            >
              <Column align="center" resizable flexGrow={0.5}>
                <HeaderCell>SL.</HeaderCell>
                <Cell dataKey="SL" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Test ID</HeaderCell>
                <Cell dataKey="test.testCode" />
              </Column>
              <Column align="center" resizable flexGrow={2}>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="test.label" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Original Price</HeaderCell>
                <Cell dataKey="test.price" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Discount %</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        <Input
                          type="number"
                          value={rowData.discount}
                          onChange={(value) => {
                            if (
                              Number(
                                rowData.test.department.commissionParcentage
                              ) < Number(value)
                            ) {
                              toaster.push(
                                <Message type="error">
                                  You cannot give discount more Then{" "}
                                  {rowData.test.department.commissionParcentage}
                                </Message>
                              );
                            } else {
                              handleCellEdit(
                                rowData,
                                "discount",
                                Number(value)
                              );
                            }
                          }}
                        />
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Discounted Price</HeaderCell>
                <Cell>
                  {(rowData) => {
                    const priceAfterDiscount = (
                      rowData.discount > 0
                        ? rowData.test.price -
                          (rowData.test.price * rowData.discount) / 100
                        : rowData.test.price
                    ).toFixed(2);

                    return `${priceAfterDiscount}`;
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1.5}>
                <HeaderCell>Delivery Date</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        <DatePicker
                          value={new Date(rowData.deliveryTime)}
                          onChange={(event, value) =>
                            handleCellEdit(rowData, "deliveryTime", event)
                          }
                        />
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Remark</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        <Input
                          as="textarea"
                          style={{ scrollbarWidth: "none" }}
                          onChange={(value) =>
                            handleCellEdit(rowData, "remark", value)
                          }
                        />
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <>
                      <Button
                        onClick={() => testRemoveFromListHandler(rowData)}
                        appearance="primary"
                        color="red"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>

          {/* Available test section */}
          <div className=" p-2 bg-stone-100 rounded-lg">
            <h3 className="text-center font-bold text-2xl">Available Tests</h3>
            <div className="mt-5">
              <InputPicker
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
        </div>
      </div>
    </div>
  );
};

export default TestInformation;
