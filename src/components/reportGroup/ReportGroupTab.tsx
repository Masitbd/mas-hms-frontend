import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { ENUM_MODE } from "@/enum/Mode";
import { useGetPdrvQuery } from "@/redux/api/pdrv/pdrvSlice";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import {
  useLazyGetReportTypeQuery,
  usePostReportTypeMutation,
} from "@/redux/api/reportType/reportType";
import { useGetGroupQuery } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import { SetStateAction, SyntheticEvent, useState } from "react";
import { Button, Dropdown, SelectPicker, Table, Tabs } from "rsuite";
import swel from "sweetalert";
import EditableCell from "./EditableCell";
import NewReportGroup from "./NewReportGroup";
import { IReportGroupFormData, initialFormData } from "./initialDataAndTypes";
type searchOption = {
  reportGroup: string;
  department: string;
};

type EmptyTableData = {
  test: string;
  investigation: string;
  normalValue: string;
  unit: string;
  remark: string;
  status: string;
  SL: number;
  reportTypeGroup: string;
};
type EmptyTableDataKey = keyof EmptyTableData;

const ReportGroupTab = () => {
  const [searchOption, setSerachOption] = useState<searchOption>(
    {} as searchOption
  );
  const [reportData, setReportData] = useState([]);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  console.log(searchOption);

  // Report group api
  const { data: reportGroupData, isLoading: reportGroupLoading } =
    useGetReportGroupQuery(undefined);

  //For group
  const { data: groupData } = useGetGroupQuery(searchOption);

  // For handelling the from
  const [formData, setFormData] =
    useState<SetStateAction<Partial<IReportGroupFormData>>>(initialFormData);

  // for rendering tab Table  data
  const { Cell, HeaderCell, Column } = Table;
  const [tableData, setTableData] = useState<EmptyTableData[]>([]);
  const [dropdownTitle, setDropdownTitle] = useState("Select Report Group");
  const emptyTableData = {
    test: "",
    investigation: "",
    normalValue: "",
    unit: "",
    remark: "",
    status: ENUM_MODE.NEW,
    SL: tableData?.length ? tableData.length + 1 : 1,
    reportTypeGroup: "",
  };

  const isNewDataOnProgress =
    tableData?.length > 0 &&
    tableData[tableData.length - 1].status == ENUM_MODE.NEW;

  const cancelHandler = () => {
    if (isNewDataOnProgress) {
      const data = tableData.filter((data) => data.status !== ENUM_MODE.NEW);
      setTableData(data);
    }
  };

  // handelling posting to the database
  const [postReportType, { isSuccess: reportTypePostSuccess }] =
    usePostReportTypeMutation();
  const saveHandler = async (SL: number) => {
    if (isNewDataOnProgress) {
      const postData = tableData.find((data) => data.status == ENUM_MODE.NEW);
      await postReportType(postData as unknown as IReportGroupFormData);
      if (reportTypePostSuccess) {
        swel("Success", "Posted successfully");
        handleEditState(SL);
      }
    }
  };

  const handleChange = (SL: number, key: string, value: string) => {
    const nextData = [...tableData];
    const item = nextData.find((item) => item.SL === SL);
    if (item) {
      item[key as keyof EmptyTableData] = value as never;
      setTableData(nextData);
    }
  };

  const handleEditState = (SL: number) => {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find((item: any) => item.SL === SL);
    if (activeItem) {
      (activeItem as EmptyTableData).status = (activeItem as EmptyTableData)
        .status
        ? ""
        : "EDIT";
      setTableData(nextData);
    }
  };

  const { data: pdrvData } = useGetPdrvQuery(undefined);

  // fetching all the data
  const [
    fetchReportType,
    {
      isLoading: reportTypeLoading,
      isSuccess: reportTypeSuccess,
      data: reportTypeData,
    },
  ] = useLazyGetReportTypeQuery();
  const handleTabChange = async (eventKey: string) => {
    const data = await fetchReportType({ reportTypeGroup: eventKey });
    if (!reportTypeLoading && reportTypeSuccess) setTableData(data?.data?.data);
  };
  return (
    <div>
      <div className="my-5">
        <Dropdown
          title={`${
            searchOption.reportGroup
              ? searchOption.reportGroup
              : "Select Report group "
          }`}
          onSelect={(
            eventKey: string,
            event: SyntheticEvent<Element, Event>
          ) => {
            setSerachOption({ ...searchOption, reportGroup: eventKey });
            setDropdownTitle(event.target?.innerText);
          }}
          activeKey={searchOption?.reportGroup}
          loading={reportGroupLoading}
        >
          {reportGroupData?.data.map(
            (data: Partial<IReportGroupFormData>, index: number) => (
              <Dropdown.Item key={index} eventKey={data?._id}>
                {data.label}
              </Dropdown.Item>
            )
          )}
        </Dropdown>
      </div>

      <Tabs
        defaultActiveKey="1"
        onSelect={(eventKey) => handleTabChange(eventKey as string)}
      >
        {groupData?.data.length > 0
          ? groupData?.data.map(
              (data: Partial<IReportGroupFormData>, index: number) => (
                <Tabs.Tab eventKey={data?._id} title={data.group} key={index}>
                  <>
                    <div className="border border-stone-200 py-5 px-3 mr-5 rounded-md">
                      <div className="grid grid-cols-3 gap-5">
                        <div className="flex flex-col">
                          <div className="font-bold">Group</div>
                          <div>{data?.group}</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold">Report Group</div>
                          <div>{data?.reportGroup?.label}</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold">Department</div>
                          <div>{data?.department?.label}</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold">Report Type</div>
                          <div>{data?.resultType}</div>
                        </div>
                      </div>
                    </div>

                    <div className=" border border-stone-200  py-5 px-3 mr-5 rounded-md my-5">
                      <Table
                        className="w-full"
                        data={tableData}
                        rowHeight={65}
                        autoHeight
                      >
                        <Column flexGrow={1}>
                          <HeaderCell>Test</HeaderCell>
                          <EditableCell
                            dataKey={"test"}
                            onChange={handleChange}
                          />
                        </Column>
                        <Column flexGrow={2}>
                          <HeaderCell>Investigation</HeaderCell>
                          <EditableCell
                            dataKey={"investigation"}
                            onChange={handleChange}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Normal Value</HeaderCell>
                          <EditableCell
                            dataKey={"normalValue"}
                            onChange={handleChange}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Unit</HeaderCell>
                          <EditableCell
                            dataKey={"unit"}
                            onChange={handleChange}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Remark</HeaderCell>
                          <EditableCell
                            dataKey={"remark"}
                            onChange={handleChange}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Default Values</HeaderCell>
                          <EditableCell
                            dataKey={"defaultValue"}
                            onChange={handleChange}
                            as={SelectPicker}
                            value={pdrvData?.data.map((data: IPdrv) => {
                              return { label: data.label, value: data.value };
                            })}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Action</HeaderCell>
                          <Cell>
                            {(rowData) => (
                              <>
                                {rowData?.status == ENUM_MODE.NEW ? (
                                  <>
                                    <Button
                                      appearance="ghost"
                                      color="green"
                                      className="mr-2"
                                      onClick={() => saveHandler(rowData.SL)}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      appearance="ghost"
                                      color="red"
                                      onClick={cancelHandler}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button appearance="primary" color="blue">
                                    Edit
                                  </Button>
                                )}
                              </>
                            )}
                          </Cell>
                        </Column>
                      </Table>
                      <div className="flex w-full justify-end">
                        <Button
                          appearance="primary"
                          color="blue"
                          onClick={() => {
                            emptyTableData.reportTypeGroup = data._id as string;
                            setTableData((p) => [...p, emptyTableData]);
                          }}
                          disabled={isNewDataOnProgress}
                        >
                          Add New
                        </Button>
                      </div>
                    </div>
                  </>
                </Tabs.Tab>
              )
            )
          : ""}
        <Tabs.Tab
          eventKey="150"
          icon={<AddOutlineIcon className="text-2xl" />}
          title={"Add New"}
        >
          {" "}
          <NewReportGroup
            formData={formData as IReportGroupFormData}
            setFormData={setFormData}
            mode={mode}
          />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default ReportGroupTab;
