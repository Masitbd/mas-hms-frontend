import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { ENUM_MODE } from "@/enum/Mode";
import { useGetPdrvQuery } from "@/redux/api/pdrv/pdrvSlice";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import {
  useGetReportTypeQuery,
  useLazyGetReportTypeQuery,
  usePatchReportTypeMutation,
  usePostReportTypeMutation,
} from "@/redux/api/reportType/reportType";
import { useGetGroupQuery } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import { SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  SelectPicker,
  Table,
  Tabs,
  TagInput,
  TagPicker,
} from "rsuite";
import swel from "sweetalert";
import EditableCell from "./EditableCell";
import NewReportGroup from "./NewReportGroup";
import {
  EmptyTableData,
  IReportGroupFormData,
  initialFormData,
  reportType,
} from "./initialDataAndTypes";
import { useDispatch } from "react-redux";
import { EmptyTableDataObject } from "./Functions";
type searchOption = {
  reportGroup: string;
  department: string;
};
type EmptyTableDataKey = keyof EmptyTableData;

const ReportGroupTab = () => {
  const [defaultTabActiveKey, setDefaultTabActiveKey] = useState("");

  // For handelling the from
  const [formData, setFormData] =
    useState<SetStateAction<Partial<IReportGroupFormData>>>(initialFormData);

  // Report group api
  const { data: reportGroupData, isLoading: reportGroupLoading } =
    useGetReportGroupQuery(undefined);
  const [dropDownTitle, setDropDownTitle] = useState("Select Report Group");

  //For group
  const [groupSearchOption, setGroupSerachOption] = useState<searchOption>(
    {} as searchOption
  );
  const { data: groupData } = useGetGroupQuery(groupSearchOption);

  // fetching report type data
  const [reportTypeFilterOption, setReportTypeFilterOption] = useState({});
  const {
    isLoading: reportTypeLoading,
    isSuccess: reportTypeSuccess,
    data: reportTypeData,
  } = useGetReportTypeQuery(reportTypeFilterOption);

  // for rendering tab Table  data
  const { Cell, HeaderCell, Column } = Table;
  const [tableData, setTableData] = useState<EmptyTableData[]>([]);
  let emptyTableData = EmptyTableDataObject(tableData);

  const isNewDataOnProgress =
    tableData?.length > 0 &&
    tableData[tableData.length - 1].status == ENUM_MODE.NEW;

  const cancelHandler = () => {
    if (isNewDataOnProgress) {
      const data = tableData.filter((data) => data.status !== ENUM_MODE.NEW);
      setTableData(data);
    }
    const isEditMode = tableData.find((data) => data.status == ENUM_MODE.EDIT);
    console.log(isEditMode);
    if (isEditMode) {
      setTableData(reportTypeData?.data);
    }
  };

  // handelling posting to the database
  const [
    postReportType,
    { isSuccess: reportTypePostSuccess, isLoading: postReportTypeLoading },
  ] = usePostReportTypeMutation();
  const [
    patchReportType,
    {
      isSuccess: patchReportTypePostSuccess,
      isLoading: patchReportTypeLoading,
    },
  ] = usePatchReportTypeMutation();

  const saveHandler = async (SL: number) => {
    const data = tableData[SL];
    if (isNewDataOnProgress) {
      const postData = tableData.find((data) => data.status == ENUM_MODE.NEW);
      await postReportType(postData as unknown as IReportGroupFormData);
      if (reportTypePostSuccess) {
        handleEditState(SL);
      }
    }
    if (data?.status == ENUM_MODE.EDIT) {
      await patchReportType(data);
      if (patchReportTypePostSuccess) {
        handleEditState(SL);
        swel("Success", "Updated Successfully", "success");
      }
    }
  };

  // For editable cell
  const handleChange = (SL: number, key: string, value: string) => {
    const nextData = [...tableData];
    const item = nextData[SL];
    if (item) {
      item[key as keyof EmptyTableData] = value as never;
      setTableData(nextData);
    }
  };

  const handleEditState = (SL: number) => {
    const nextData = [...tableData];
    const activeItem = Object.assign({}, nextData[SL]);

    if (activeItem) {
      activeItem.status = activeItem.status ? "" : ENUM_MODE.EDIT;
      nextData[SL] = activeItem;
      setTableData(nextData);
    }
  };

  useEffect(() => {
    if (reportTypeData?.data) {
      setTableData(reportTypeData.data);
    }
    if (groupData?.data.length) {
      setDefaultTabActiveKey(groupData?.data[0]._id);
    }
    if (reportTypePostSuccess) {
      swel("Success", "Report Type Posted Successfully", "success");
    }
  }, [reportTypeData, reportGroupData, groupData, reportTypePostSuccess]);

  return (
    <div>
      <div className="my-5">
        <Dropdown
          title={dropDownTitle}
          activeKey={groupSearchOption?.reportGroup}
          loading={reportGroupLoading}
        >
          {reportGroupData?.data.map(
            (data: Partial<IReportGroupFormData>, index: number) => (
              <Dropdown.Item
                key={index}
                eventKey={data?._id}
                onSelect={() => {
                  setGroupSerachOption({
                    ...groupSearchOption,
                    reportGroup: data._id as string,
                  });
                  setDropDownTitle(data?.label as string);
                }}
              >
                {data.label}
              </Dropdown.Item>
            )
          )}
        </Dropdown>
      </div>

      <Tabs
        defaultActiveKey={defaultTabActiveKey}
        onSelect={(eventKey) =>
          setReportTypeFilterOption({ reportTypeGroup: eventKey })
        }
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
                        loading={reportTypeLoading}
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
                            as={TagInput}
                          />
                        </Column>
                        <Column flexGrow={1}>
                          <HeaderCell>Action</HeaderCell>
                          <Cell>
                            {(rowData, rowIndex) => {
                              return (
                                <>
                                  {rowData?.status === ENUM_MODE.NEW ||
                                  rowData?.status === ENUM_MODE.EDIT ? (
                                    <>
                                      <Button
                                        appearance="ghost"
                                        color="green"
                                        className="mr-2"
                                        onClick={() =>
                                          saveHandler(rowIndex as number)
                                        }
                                        loading={
                                          postReportTypeLoading ||
                                          patchReportTypeLoading
                                        }
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        appearance="ghost"
                                        color="red"
                                        onClick={cancelHandler}
                                        loading={
                                          postReportTypeLoading ||
                                          patchReportTypeLoading
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      appearance="primary"
                                      color="blue"
                                      onClick={() => {
                                        handleEditState(rowIndex as number);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </>
                              );
                            }}
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
            mode={ENUM_MODE.NEW}
          />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default ReportGroupTab;
