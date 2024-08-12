import {
  IReportGroup,
  IResultField,
  ITest,
} from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import RModal from "../ui/Modal";
import { useGetGroupQuery } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import { Button, Dropdown, Table } from "rsuite";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { useGetReportTypeQuery } from "@/redux/api/reportType/reportType";
import {
  INewReportGroupProps,
  IReportGroupFormData,
  IResultFieldForParameterBasedTest,
  reportType,
} from "../reportType/initialDataAndTypes";

export type IFilterableField = {
  reportGroup: string;
};

export type IFilterFieldForReportType = {
  reportTypeGroup: string;
};

const ExistingTest = ({
  formData,
  setFormData,
  existingModal,
  setExistingModal,
  reportGroupId,
}: {
  formData: ITest;
  setFormData: (props: ITest) => void;
  existingModal: boolean;
  setExistingModal: (prpos: boolean) => void;
  reportGroupId?: string;
}) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const { data: reportGroup, isLoading: reportGroupLoading } =
    useGetReportGroupQuery(undefined);
  const [reportGroupDropdownTitle, setReportGroupDropdownTitle] =
    useState("Select reportGroup");

  // Set search data for group
  const [groupFilterOption, setGroupFilterOption] = useState<IFilterableField>(
    {} as IFilterableField
  );
  const { data: groupData, isLoading: groupLoading } =
    useGetGroupQuery(groupFilterOption);

  // set search data for group query
  const [reportTypeGrouopDropdownTiltle, setReportTypeGroupDropdownTiltle] =
    useState("Select Group");
  const [reportTypeFilterOption, setReportTypeFilterOption] =
    useState<IFilterFieldForReportType>({} as IFilterFieldForReportType);
  const { data: reportTypeData, isLoading: reportTypeDataLoading } =
    useGetReportTypeQuery(reportTypeFilterOption);

  // For handelling the from data
  const addTestHandler = (params: IResultField) => {
    const nextData = Object.assign({}, formData);
    const nextResultData = Object.assign({}, params);
    nextData?.resultFields?.length ? "" : (nextData.resultFields = []);
    nextResultData.gid = nextData.resultFields?.length + 1;
    nextData.resultFields.push(nextResultData);
    setFormData(nextData);
  };

  // cherker for already added test
  const checker = (params: IResultField) => {
    const nextData = Object.assign({}, formData);
    let added = false;
    nextData?.resultFields?.length > 0 &&
      nextData.resultFields.map((data) => {
        data?._id && (data._id === params._id ? (added = true) : false);
      });
    return added;
  };

  const [selectedReportGroup, setSelectedReportGroup] =
    useState<IReportGroup>();

  return (
    <>
      <RModal
        open={existingModal}
        okHandler={() => setExistingModal(false)}
        cancelHandler={() => setExistingModal(false)}
        title="Add Test"
        size="lg"
      >
        <div>
          <div className="flex gap-5">
            <div>
              <Dropdown
                loading={reportGroupLoading}
                title={reportGroupDropdownTitle}
                activeKey={groupFilterOption?.reportGroup}
              >
                {reportGroup?.data.map((data: IReportGroupFormData) => {
                  return (
                    <Dropdown.Item
                      eventKey={data._id}
                      key={data._id}
                      value={data._id}
                      onSelect={() => {
                        setSelectedReportGroup(data as unknown as IReportGroup);
                        setGroupFilterOption({
                          reportGroup: data._id as string,
                        });
                        setReportGroupDropdownTitle(data.label as string);
                        setReportTypeFilterOption({ reportTypeGroup: "" });
                      }}
                    >
                      {data.label}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            </div>

            <div>
              <Dropdown
                loading={groupLoading}
                title={reportTypeGrouopDropdownTiltle}
                activeKey={reportTypeFilterOption?.reportTypeGroup}
              >
                {groupData?.data.map((data: IReportGroupFormData) => {
                  return (
                    <Dropdown.Item
                      key={data._id}
                      value={data._id}
                      eventKey={data._id}
                      onSelect={() => {
                        setReportTypeFilterOption({
                          reportTypeGroup: data._id as string,
                        });
                        setReportTypeGroupDropdownTiltle(data.group as string);
                      }}
                    >
                      {data.group}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            </div>
          </div>

          <div>
            {selectedReportGroup?._id &&
            reportTypeFilterOption?.reportTypeGroup?.length > 0 ? (
              <Table
                loading={reportTypeDataLoading}
                data={reportTypeData?.data}
                className="w-full"
                autoHeight
                rowHeight={60}
              >
                {" "}
                {selectedReportGroup?.testResultType == "parameter" && (
                  <>
                    <Column flexGrow={2}>
                      <HeaderCell>Investigation</HeaderCell>
                      <Cell dataKey="investigation" />
                    </Column>
                    <Column flexGrow={1}>
                      <HeaderCell>Test</HeaderCell>
                      <Cell dataKey="test" />
                    </Column>
                    <Column>
                      <HeaderCell>Unit</HeaderCell>
                      <Cell dataKey="unit" />
                    </Column>
                    <Column>
                      <HeaderCell>Normal Value</HeaderCell>
                      <Cell dataKey="normalValue" />
                    </Column>
                    <Column>
                      <HeaderCell>Default Value</HeaderCell>
                      <Cell dataKey="defaultValue" />
                    </Column>
                  </>
                )}
                {selectedReportGroup?.testResultType == "descriptive" && (
                  <>
                    <Column flexGrow={2}>
                      <HeaderCell>Title</HeaderCell>
                      <Cell dataKey="label" />
                    </Column>
                    <Column flexGrow={4}>
                      <HeaderCell>Description</HeaderCell>
                      <Cell dataKey="description" />
                    </Column>
                  </>
                )}
                <Column>
                  <HeaderCell>Action</HeaderCell>
                  <Cell>
                    {(rowdate) => (
                      <Button
                        className="btn btn-primary"
                        onClick={() => {
                          addTestHandler(rowdate as any);
                        }}
                        appearance="primary"
                        color="blue"
                        disabled={checker(rowdate as any)}
                      >
                        Add
                      </Button>
                    )}
                  </Cell>
                </Column>
              </Table>
            ) : (
              <div className="flex text-center font-bold py-10 items-center justify-center">
                Please Select a Report group and Group
              </div>
            )}
          </div>
        </div>
      </RModal>
    </>
  );
};

export default ExistingTest;
