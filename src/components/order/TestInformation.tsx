import { ENUM_MODE } from "@/enum/Mode";
import { useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Message,
  Table,
  Tag,
  toaster,
} from "rsuite";
import { RowDataType } from "rsuite/esm/Table";
import TestReportForm from "../testReport/TestReportForm";
import TestView from "../testReport/TestView/TestView";
import RModal from "../ui/Modal";
import AvailableTestSection from "./AvailableTestSection";
import { IParamsForTestInformation } from "./initialDataAndTypes";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
export type ITestGenerateType = {
  modeSingleType: string;
  modeType: string;
  id: string;
  status: string;
};

import TrashIcon from "@rsuite/icons/Trash";

const TestInformation = (params: IParamsForTestInformation) => {
  const { setRModalOpen, setRTest } = params;

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

  const [reportGenerate, setReportGenerate] = useState<ITestGenerateType>({
    modeSingleType: "",
    modeType: "",
    id: "",
    status: "",
  });

  const [reportGenerate2, setReportGenerate2] = useState<ITestGenerateType>({
    modeSingleType: "",
    modeType: "",
    id: "",
    status: "",
  });

  const [reportGenerateModal, setReportGenerateModal] =
    useState<boolean>(false);

  const reportGenerateHandler = (data: ITestGenerateType) => {
    setReportGenerate({
      modeSingleType: data.modeSingleType,
      modeType: data.modeType,
      id: data.id,
      status: data.status,
    });
    setReportGenerateModal(!reportGenerateModal);
  };
  const [reportGenerateModal2, setReportGenerateModal2] =
    useState<boolean>(false);

  const reportGenerateHandler2 = (data: ITestGenerateType) => {
    setReportGenerate2({
      modeSingleType: data.modeSingleType,
      modeType: data.modeType,
      id: data.id,
      status: data.status,
    });
    setReportGenerateModal2(!reportGenerateModal2);
  };

  const testStatusElement = (status: string) => {
    switch (status) {
      case "pending":
        return <Tag color="red">Pending</Tag>;

      case "completed":
        return <Tag color="green">Completed</Tag>;

      case "delivered":
        return <Tag color="blue">Delivered</Tag>;

      case "refunded":
        return <Tag color="orange">REFUNDED</Tag>;
    }
  };

  if (params.mode == ENUM_MODE.VIEW) {
    return (
      <>
        <div className=" border rounded-md shadow-lg">
          <div className="bg-[#3498ff] text-white">
            <h2 className="text-center text-lg  font-semibold">
              Test Information
            </h2>
          </div>
          <Table
            data={params?.formData?.tests}
            className="w-full"
            bordered
            cellBordered
            wordWrap={"break-word"}
            autoHeight
          >
            <Column align="center" flexGrow={0.5}>
              <HeaderCell>SL.</HeaderCell>
              <Cell dataKey="SL" />
            </Column>
            <Column align="center" flexGrow={1}>
              <HeaderCell>Test ID</HeaderCell>
              <Cell dataKey="test.testCode" />
            </Column>
            <Column align="center" flexGrow={1}>
              <HeaderCell>Title</HeaderCell>
              <Cell dataKey="test.label" />
            </Column>
            <Column align="center" flexGrow={1}>
              <HeaderCell>Original Price</HeaderCell>
              <Cell dataKey="test.price" />
            </Column>
            <Column align="center" flexGrow={0.5}>
              <HeaderCell>Discount %</HeaderCell>
              <Cell dataKey="discount" />
            </Column>
            <Column align="center" flexGrow={1}>
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
            <Column align="center" flexGrow={1}>
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {(rowData) => {
                  return <>{testStatusElement(rowData?.status)}</>;
                }}
              </Cell>
            </Column>
            <Column align="center" flexGrow={1.5}>
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
            <Column align="center" flexGrow={1}>
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => (
                  <>
                    <div
                      className={`${params.mode == ENUM_MODE.VIEW && "hidden"}`}
                    >
                      <Button
                        onClick={() => testRemoveFromListHandler(rowData)}
                        appearance="primary"
                        color="red"
                      >
                        Delete
                      </Button>
                    </div>
                    {rowData.status == "pending" && (
                      <AuthCheckerForComponent
                        requiredPermission={[ENUM_USER_PEMISSION.MANAGE_ORDER]}
                      >
                        <Button
                          className="ml-2 "
                          onClick={() => {
                            setRModalOpen && setRModalOpen(true);
                            setRTest && setRTest(rowData as ITestsFromOrder);
                          }}
                          appearance="primary"
                          color="orange"
                        >
                          Refund
                        </Button>
                      </AuthCheckerForComponent>
                    )}
                  </>
                )}
              </Cell>
            </Column>
          </Table>
          {reportGenerateModal && (
            <RModal
              open={reportGenerateModal}
              size="xxl"
              title={"Test Report Generate"}
            >
              <TestReportForm
                reportGenerate={reportGenerate}
                setReportGenerate={setReportGenerate}
                setReportGenerateModal={setReportGenerateModal}
              />
            </RModal>
          )}
          {reportGenerateModal2 && (
            <RModal
              open={reportGenerateModal2}
              size="xxl"
              title={"Test Report View"}
            >
              <TestView
                reportGenerate={reportGenerate2}
                setReportGenerate={setReportGenerate2}
                setReportGenerateModal={setReportGenerateModal2}
              />
            </RModal>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="mb-5 border rounded-md shadow-lg">
      <div className="bg-[#3498ff] text-white">
        <h2 className="text-center text-lg font-semibold">Test Information</h2>
      </div>

      <div className="col-span-3  border  shadow-lg px-2">
        {/* Available test section */}
        <AvailableTestSection
          formData={params.formData}
          setFormData={params.setFormData}
          mode={params.mode}
        />
        <Table
          data={params?.formData?.tests}
          className="w-full"
          bordered
          cellBordered
          wordWrap={"break-word"}
          height={430}
        >
          <Column align="center" flexGrow={0.5}>
            <HeaderCell>SL.</HeaderCell>
            <Cell dataKey="SL" />
          </Column>
          <Column align="center" flexGrow={1}>
            <HeaderCell>Test ID</HeaderCell>
            <Cell dataKey="test.testCode" />
          </Column>
          <Column align="center" flexGrow={2}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="test.label" />
          </Column>
          <Column align="center" flexGrow={1}>
            <HeaderCell>Original Price</HeaderCell>
            <Cell dataKey="test.price" />
          </Column>

          <Column align="center" flexGrow={1}>
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
                          Number(rowData.test.department.commissionParcentage) <
                          Number(value)
                        ) {
                          toaster.push(
                            <Message type="error">
                              You cannot give discount more Then{" "}
                              {rowData.test.department.commissionParcentage}
                            </Message>
                          );
                        } else {
                          handleCellEdit(rowData, "discount", Number(value));
                        }
                      }}
                    />
                  </>
                );
              }}
            </Cell>
          </Column>

          <Column align="center" flexGrow={1.2}>
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

          <Column align="center" flexGrow={1}>
            <HeaderCell>Remark</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <Input
                      as="textarea"
                      style={{ scrollbarWidth: "none", height: "2rem" }}
                      size="xs"
                      onChange={(value) =>
                        handleCellEdit(rowData, "remark", value)
                      }
                    />
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column align="center" flexGrow={1}>
            <HeaderCell>Discounted Price</HeaderCell>
            <Cell>
              {(rowData) => {
                const priceAfterDiscount =
                  rowData.discount > 0 && rowData.test.price > 0
                    ? (
                        rowData.test.price -
                        (rowData.test.price * rowData.discount) / 100
                      ).toFixed(2)
                    : rowData?.test?.price > 0
                    ? rowData.test.price.toFixed(2)
                    : 0;

                return `${priceAfterDiscount}`;
              }}
            </Cell>
          </Column>
          <Column align="center" flexGrow={0.6}>
            <HeaderCell>...</HeaderCell>
            <Cell>
              {(rowData) => (
                <>
                  <Button
                    onClick={() => testRemoveFromListHandler(rowData)}
                    appearance="primary"
                    color="red"
                    size="sm"
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default TestInformation;
