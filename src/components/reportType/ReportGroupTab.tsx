import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { ENUM_MODE } from "@/enum/Mode";
import { useGetPdrvQuery } from "@/redux/api/pdrv/pdrvSlice";
import "rsuite/dist/rsuite.min.css";
import "./TabsResponsive.css";
import {
  useGetReportGroupQuery,
  useLazyGetReportGroupQuery,
} from "@/redux/api/reportGroup/reportGroupSlice";
import EditIcon from "@rsuite/icons/Edit";
import {
  useGetReportTypeQuery,
  useLazyGetReportTypeQuery,
  usePatchReportTypeMutation,
  usePostReportTypeMutation,
} from "@/redux/api/reportType/reportType";
import {
  useGetGroupQuery,
  useLazyGetGroupQuery,
} from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
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
import NewReportGroupModal from "../reportGroup/NewReportGroupModel";
import Loading from "@/app/loading";
import { IReportGroup } from "@/types/allDepartmentInterfaces";
import ForDescriptive from "./ForDescriptive";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
type searchOption = {
  reportGroup: string;
  department: string;
};
type EmptyTableDataKey = keyof EmptyTableData;

const ReportGroupTab = () => {
  const [getGroupData] = useLazyGetGroupQuery();
  const [getReportGroup] = useLazyGetReportGroupQuery();
  const [getRrportType] = useLazyGetReportTypeQuery();
  const [defaultTabActiveKey, setDefaultTabActiveKey] = useState("");
  const [selectedReportGroup, setSelectedReportGroup] =
    useState<IReportGroup>();

  // For handelling the from
  const [formData, setFormData] =
    useState<SetStateAction<Partial<IReportGroupFormData>>>(initialFormData);

  // Report group api for Dropdown
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
      const result = await postReportType(
        postData as unknown as IReportGroupFormData
      );
      if ("data" in result) {
        handleEditState(SL);
        swel("Success", "Report Type Posted Successfully", "success");
      }
    }

    if (data?.status == ENUM_MODE.EDIT) {
      const result = await patchReportType(data);
      if ("data" in result) {
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

  // For report type group

  const [reportTypeGroupMode, setReportTypeGroupMode] = useState(
    ENUM_MODE.VIEW
  );
  const [reportTypeGroupData, setReportTypeGroupData] = useState();
  const [reportTypeGroupOpen, setReportTypeGroupOpen] = useState(false);
  const reportTypeGroupCancelHandler = () => {
    setReportTypeGroupOpen(false);
    setReportTypeGroupMode(ENUM_MODE.VIEW);
    setReportTypeGroupData(undefined);
  };
  const editIconClickHandler = (data: any) => {
    setReportTypeGroupOpen(true);

    setReportTypeGroupMode(ENUM_MODE.EDIT);
    const modifiedData = Object.assign({}, data);
    // modifiedData.department = modifiedData.department._id;
    modifiedData.reportGroup = modifiedData.reportGroup._id;
    setReportTypeGroupData(modifiedData);
  };

  useEffect(() => {
    if (reportTypeData?.data) {
      setTableData(reportTypeData.data);
    }
    if (groupData?.data.length) {
      setDefaultTabActiveKey(groupData?.data[0]._id);
    }
  }, [reportTypeData, reportGroupData, groupData, reportTypePostSuccess]);

  // for mode
  const [mode, setMode] = useState("");

  // -----------------------setting default data at page rendering --------------------
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async function () {
      const reportGroupDataforInitialSelect = await getReportGroup(undefined);

      if ("data" in reportGroupDataforInitialSelect) {
        if (reportGroupDataforInitialSelect.data.data?.length > 0) {
          const firstReportGroup = reportGroupDataforInitialSelect.data.data[0];
          setSelectedReportGroup(firstReportGroup);
          setGroupSerachOption({
            ...groupSearchOption,
            reportGroup: firstReportGroup._id as string,
          });
          setDropDownTitle(firstReportGroup?.label as string);
        }

        const initialGroupData = await getGroupData(groupSearchOption);
        if ("data" in initialGroupData) {
          if (initialGroupData.data.data.length > 0) {
            setDefaultTabActiveKey(initialGroupData.data.data[0]._id);
            setReportTypeFilterOption({
              reportTypeGroup: initialGroupData.data.data[0]._id,
            });
          }
        }
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }
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
                  setSelectedReportGroup(data as unknown as IReportGroup);
                }}
              >
                {data.label}
              </Dropdown.Item>
            )
          )}
        </Dropdown>
      </div>
      <div className="multi-line-tabs">
        <Tabs
          defaultActiveKey={defaultTabActiveKey}
          onSelect={(eventKey) =>
            setReportTypeFilterOption({ reportTypeGroup: eventKey })
          }
          className=""
        >
          {groupData?.data.length > 0
            ? groupData?.data.map(
                (data: Partial<IReportGroupFormData>, index: number) => (
                  <Tabs.Tab eventKey={data?._id} title={data.group} key={index}>
                    <>
                      <div className="border border-stone-200 py-5 px-3 mr-5 rounded-md relative">
                        {reportTypeGroupMode == ENUM_MODE.EDIT ? (
                          <NewReportGroup
                            formData={
                              reportTypeGroupData as unknown as IReportGroupFormData
                            }
                            mode={reportTypeGroupMode}
                            setFormData={setReportTypeGroupData as any}
                            setMode={setReportTypeGroupMode as any}
                          />
                        ) : (
                          <>
                            {" "}
                            <div className="absolute top-1 right-2 ">
                              <AuthCheckerForComponent
                                requiredPermission={[
                                  ENUM_USER_PEMISSION.MANAGE_TESTS,
                                ]}
                              >
                                <EditIcon
                                  fill="blue"
                                  className="hover:text-2xl cursor-pointer text-lg"
                                  onClick={() => editIconClickHandler(data)}
                                />
                              </AuthCheckerForComponent>
                            </div>
                            <div className="grid grid-cols-3 gap-5">
                              <div className="flex flex-col">
                                <div className="font-bold">Group</div>
                                <div>{data?.group}</div>
                              </div>
                              <div className="flex flex-col">
                                <div className="font-bold">Report Group</div>
                                <div>{data?.reportGroup?.label}</div>
                              </div>
                              {/* <div className="flex flex-col">
                              <div className="font-bold">Department</div>
                              <div>{data?.department?.label}</div>
                            </div> */}
                              <div className="flex flex-col capitalize">
                                <div className="font-bold">Report Type</div>
                                <div>{data?.resultType}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className=" border border-stone-200  py-5 px-3 mr-5 rounded-md my-5">
                        <Table
                          className="w-full"
                          data={tableData}
                          loading={reportTypeLoading}
                          wordWrap="break-word"
                          rowHeight={70}
                          autoHeight
                        >
                          {selectedReportGroup?.testResultType ==
                            "parameter" && (
                            <>
                              <Column flexGrow={1}>
                                <HeaderCell>Investigation</HeaderCell>
                                <EditableCell
                                  dataKey={"investigation"}
                                  onChange={handleChange}
                                />
                              </Column>
                              <Column flexGrow={2}>
                                <HeaderCell>Test</HeaderCell>
                                <EditableCell
                                  dataKey={"test"}
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
                            </>
                          )}
                          {selectedReportGroup?.testResultType ==
                            "descriptive" && (
                            <>
                              <Column flexGrow={1}>
                                <HeaderCell>Investigation</HeaderCell>
                                <EditableCell
                                  dataKey={"investigation"}
                                  onChange={handleChange}
                                />
                              </Column>
                              <Column flexGrow={1}>
                                <HeaderCell>Title</HeaderCell>
                                <EditableCell
                                  dataKey={"label"}
                                  onChange={handleChange}
                                />
                              </Column>
                              <Column flexGrow={3}>
                                <HeaderCell>Description</HeaderCell>
                                <Cell>
                                  {(rowdata, index) => (
                                    <ForDescriptive
                                      data={
                                        rowdata as {
                                          status: string;
                                          description: string;
                                        }
                                      }
                                      index={index as number}
                                      handleCHange={handleChange}
                                    />
                                  )}
                                </Cell>
                              </Column>
                            </>
                          )}
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
                                      <AuthCheckerForComponent
                                        requiredPermission={[
                                          ENUM_USER_PEMISSION.MANAGE_TESTS,
                                        ]}
                                      >
                                        <Button
                                          appearance="primary"
                                          color="blue"
                                          onClick={() => {
                                            handleEditState(rowIndex as number);
                                          }}
                                        >
                                          Edit
                                        </Button>
                                      </AuthCheckerForComponent>
                                    )}
                                  </>
                                );
                              }}
                            </Cell>
                          </Column>
                        </Table>
                        <div className="flex w-full justify-end">
                          <AuthCheckerForComponent
                            requiredPermission={[
                              ENUM_USER_PEMISSION.MANAGE_TESTS,
                            ]}
                          >
                            <Button
                              appearance="primary"
                              color="blue"
                              onClick={() => {
                                emptyTableData.reportTypeGroup =
                                  data._id as string;
                                setTableData((p) => [...p, emptyTableData]);
                              }}
                              disabled={isNewDataOnProgress}
                            >
                              Add New
                            </Button>
                          </AuthCheckerForComponent>
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
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_TESTS]}
            >
              <NewReportGroup
                formData={formData as IReportGroupFormData}
                setFormData={setFormData}
                mode={ENUM_MODE.NEW}
              />
            </AuthCheckerForComponent>
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportGroupTab;
