import { IResultField, ITest } from "@/types/allDepartmentInterfaces";
import React, { useEffect, useState } from "react";
import RModal from "../ui/Modal";
import { useGetGroupQuery } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import { Button, Dropdown, Table } from "rsuite";
import { useGetReportGroupQuery } from "@/redux/api/reportGroup/reportGroupSlice";
import { useGetReportTypeQuery } from "@/redux/api/reportType/reportType";
import {
  IResultFieldForParameterBasedTest,
  reportType,
} from "../reportGroup/initialDataAndTypes";

const ExistingTest = ({
  formData,
  setFormData,
  existingModal,
  setExistingModal,
}: {
  formData: ITest;
  setFormData: (props: ITest) => void;
  existingModal: boolean;
  setExistingModal: (prpos: boolean) => void;
}) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const { data: reportGroup, isLoading: reportGroupLoading } =
    useGetReportGroupQuery(undefined);

  // Set search data for group
  const [groupFilterOption, setGroupFilterOption] = useState({});
  const { data: groupData, isLoading: groupLoading } =
    useGetGroupQuery(groupFilterOption);

  // set search data for group query
  const [reportTypeFilterOption, setReportTypeFilterOption] = useState({});
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
                title={"Select reportGroup"}
                activeKey={groupFilterOption?.reportGroup}
              >
                {reportGroup?.data.map((data) => {
                  return (
                    <Dropdown.Item
                      key={data._id}
                      value={data._id}
                      onSelect={() =>
                        setGroupFilterOption({ reportGroup: data._id })
                      }
                    >
                      {data.label}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            </div>

            <div>
              <Dropdown loading={groupLoading} title={"Select Group"}>
                {groupData?.data.map((data) => {
                  return (
                    <Dropdown.Item
                      key={data._id}
                      value={data._id}
                      onSelect={() =>
                        setReportTypeFilterOption({ reportTypeGroup: data._id })
                      }
                    >
                      {data.group}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            </div>
          </div>

          <div>
            <Table
              loading={reportTypeDataLoading}
              data={reportTypeData?.data}
              className="w-full"
              autoHeight
              rowHeight={60}
            >
              <Column flexGrow={1}>
                <HeaderCell>Test</HeaderCell>
                <Cell dataKey="test" />
              </Column>
              <Column flexGrow={2}>
                <HeaderCell>Investigation</HeaderCell>
                <Cell dataKey="Investigation" />
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
                <Cell dataKey="fj" />
              </Column>
              <Column>
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowdate) => (
                    <Button
                      className="btn btn-primary"
                      onClick={() => {
                        addTestHandler(rowdate);
                      }}
                      appearance="primary"
                      color="blue"
                      disabled={checker(rowdate)}
                    >
                      Add
                    </Button>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
        </div>
      </RModal>
    </>
  );
};

export default ExistingTest;
