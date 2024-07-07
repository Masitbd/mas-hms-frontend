import { ENUM_MODE } from "@/enum/Mode";
import { useState } from "react";
import { Button, DatePicker, Input, Message, Table, toaster } from "rsuite";
import { RowDataType } from "rsuite/esm/Table";
import TestReportForm from "../testReport/TestReportForm";
import TestView from "../testReport/TestView/TestView";
import RModal from "../ui/Modal";
import AvailableTestSection from "./AvailableTestSection";
import { IParamsForTestInformation } from "./initialDataAndTypes";
export type ITestGenerateType = {
  modeSingleType: string; modeType: string; id: string, status: string;
}

const TestInformation = (params: IParamsForTestInformation) => {
  const { Cell, Column, HeaderCell } = Table;
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
  const handleCellEdit = (id: RowDataType<any>, key: string, value: any) => {
    const newObject = {
      ...params.formData,
    };
    newObject.tests.find((testInfo: { SL: any }) => testInfo.SL === id.SL)[
      key
    ] = value;
    params.setFormData(newObject);
  };


  const [reportGenerate, setReportGenerate] = useState<ITestGenerateType>({ modeSingleType: "", modeType: "", id: '', status: "" });

  const [reportGenerate2, setReportGenerate2] = useState<ITestGenerateType>({ modeSingleType: "", modeType: "", id: '', status: "" });



  const [reportGenerateModal, setReportGenerateModal] = useState<boolean>(false);

  const reportGenerateHandler = (data: ITestGenerateType) => {
    setReportGenerate({ modeSingleType: data.modeSingleType, modeType: data.modeType, id: data.id, status: data.status })
    setReportGenerateModal(!reportGenerateModal)
  }
  const [reportGenerateModal2, setReportGenerateModal2] = useState<boolean>(false);

  const reportGenerateHandler2 = (data: ITestGenerateType) => {
    setReportGenerate2({ modeSingleType: data.modeSingleType, modeType: data.modeType, id: data.id, status: data.status })
    setReportGenerateModal2(!reportGenerateModal2)
  }

  console.log(params?.formData?.tests)

  if (params.mode == ENUM_MODE.VIEW) {
    return (
      <>
        <h2 className="font-bold text-xl mt-5">Test Information</h2>
        <hr />
        <Table
          data={params?.formData?.tests}
          className="w-full"
          bordered
          cellBordered
          wordWrap={"break-word"}
          autoHeight
        >
          <Column align="center" resizable flexGrow={0.5}>
            <HeaderCell>SL.</HeaderCell>
            <Cell dataKey="SL" />
          </Column>
          <Column align="center" resizable flexGrow={1}>
            <HeaderCell>Test ID</HeaderCell>
            <Cell dataKey="test.testCode" />
          </Column>
          <Column align="center" resizable flexGrow={1}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="test.label" />
          </Column>
          <Column align="center" resizable flexGrow={1}>
            <HeaderCell>Original Price</HeaderCell>
            <Cell dataKey="test.price" />
          </Column>
          <Column align="center" resizable flexGrow={0.5}>
            <HeaderCell>Discount %</HeaderCell>
            <Cell dataKey="test.discount" />
          </Column>
          <Column align="center" resizable flexGrow={0.5}>
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
                    <span>
                      {new Date(rowData.deliveryTime).toLocaleDateString()}
                    </span>
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column align="center" resizable flexGrow={2}>
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
                  <Button
                    className="ml-2"
                    onClick={() => {
                      reportGenerateHandler({ id: rowData.test._id, modeSingleType: rowData.test.testResultType, modeType: rowData.test.type, status: rowData.status })
                    }}
                    appearance="primary"
                    color="orange"
                  >
                    Report
                  </Button>

                  <Button
                    className="ml-2"
                    disabled={rowData.status === 'completed' ? false : true}
                    onClick={() => {
                      reportGenerateHandler2({ id: rowData.test._id, modeSingleType: rowData.test.testResultType, modeType: rowData.test.type, status: rowData.status })
                    }}
                    appearance="primary"
                    color="blue"
                  >
                    Report View
                  </Button>


                </>
              )}
            </Cell>
          </Column>
        </Table>
        {
          reportGenerateModal && (
            <RModal
              open={reportGenerateModal}
              size="xxl"
              title={
                "Test Report Generate"
              }
            >
              <TestReportForm reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} />
            </RModal>
          )
        }
        {
          reportGenerateModal2 && (
            <RModal
              open={reportGenerateModal2}
              size="xxl"
              title={
                "Test Report View"
              }
            >
              <TestView reportGenerate={reportGenerate2} setReportGenerate={setReportGenerate2} setReportGenerateModal={setReportGenerateModal2} />
            </RModal>
          )
        }
      </>
    );
  }





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
                      <Button
                        className="ml-2"
                        onClick={() => {
                          reportGenerateHandler({ id: rowData.test._id, modeSingleType: rowData.test.testResultType, modeType: rowData.test.type, status: rowData.status })
                        }}
                        appearance="primary"
                        color="orange"
                      >
                        Report
                      </Button>

                      <Button
                        className="ml-2"
                        disabled={rowData.status === 'completed' ? true : false}
                        onClick={() => {
                          reportGenerateHandler2({ id: rowData.test._id, modeSingleType: rowData.test.testResultType, modeType: rowData.test.type, status: rowData.status })
                        }}
                        appearance="primary"
                        color="blue"
                      >
                        Report View
                      </Button>


                    </>
                  )}
                </Cell>
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
            </Table>
          </div>

          {/* Available test section */}
          <AvailableTestSection
            formData={params.formData}
            setFormData={params.setFormData}
            mode={params.mode}
          />
        </div>

      </div>
    </div>
  );
};

export default TestInformation;
