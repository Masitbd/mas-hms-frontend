import React, { ReactInstance, Ref, useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputPicker,
  Modal,
  SelectPicker,
  Table,
} from "rsuite";
import {
  IPropsForParameter,
  ITestResultForParameter,
} from "./initialDataAndTypes";
import {
  filterResultFieldsByInvestigation,
  resultSetter,
  useCleanedTests,
} from "./functions";
import { IResultField } from "@/types/allDepartmentInterfaces";
import Comment from "./Comment";
import {
  useLazyGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
} from "@/redux/api/reportTest/reportTestSlice";
import swal from "sweetalert";
import Loading from "@/app/loading";
import { ENUM_MODE } from "@/enum/Mode";
import ReportViewerParameter from "./ReportViewerParameter";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

const ForParameterBased = (props: IPropsForParameter) => {
  const router = useRouter();
  const [getReport, { isLoading: getLoading }] = useLazyGetSingleReportQuery();
  const [patchReport, { isLoading: patchLoading }] = usePatchReporMutation();
  const [post, { isLoading: postLoading }] = usePostReportMutation();
  const { HeaderCell, Cell, Column } = Table;
  const { oid, tests, mode, order, reportGroup } = props;
  const [resultForHook, setResultForHook] = useState();
  const { fieldNames, headings, resultFields, returnResult } = useCleanedTests({
    mode,
    oid,
    order,
    reportGroup,
    tests,
    result: resultForHook,
  });

  const useResultField = (
    fieldNames: string[],
    value: string[] | number[],
    rowData: IResultField,
    result: ITestResultForParameter,
    setResult: any
  ) => {
    const [defaultValue, setDefaultValue] = useState(
      rowData?.defaultValue as string[]
    );
    const keys = Object.keys(rowData);
    const dValue = rowData?.defaultValue || [];

    if (keys.includes("defaultValue") && dValue?.length > 0) {
      return (
        <>
          <InputPicker
            data={
              defaultValue?.map((item) => ({ value: item, label: item })) as any
            }
            creatable
            onSelect={(value) => {
              resultSetter(rowData._id, result, value, setResult);
            }}
            defaultValue={rowData?.result}
            onCreate={(value) => {
              setDefaultValue([...defaultValue, value]);
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <InputGroup inside>
            <Input
              onChange={(value, event) => {
                resultSetter(rowData._id, result, value, setResult);
              }}
              defaultValue={rowData?.result}
            />
            {rowData?.unit ? (
              <InputGroup.Addon>{rowData?.unit}</InputGroup.Addon>
            ) : (
              <></>
            )}
          </InputGroup>
        </>
      );
    }
  };

  const [result, setResult] = useState<ITestResultForParameter>(
    returnResult as ITestResultForParameter
  );

  const swalButtonHandler = async (text: string) => {
    const alertButton = await swal({
      icon: "success",
      text: text,
      title: "Success",
      buttons: {
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary",
          closeModal: true,
        },
      },
    });
    if (alertButton) {
      router.push(`/testReport/${order.oid}`);
    }
  };

  const handleSubmit = async () => {
    if (mode == ENUM_MODE.NEW) {
      const data = await post(result);
      if ("data" in data) {
        swalButtonHandler(" Report posted Successfully");
      }
    }

    if (mode == ENUM_MODE.EDIT) {
      const data = await patchReport(result);
      if ("data" in data) {
        swal("success", "", "success");
        swalButtonHandler("Report updated Successfully");
      }
    }
  };

  // ------------------------------------For print ----------------
  const componentRef = useRef<ReactInstance | null>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current as ReactInstance,
  });

  useEffect(() => {
    (async function () {
      if (props.mode == ENUM_MODE.EDIT || props.mode == ENUM_MODE.VIEW) {
        const reportData = await getReport({
          oid: props.oid,
          params: {
            reportGroup: props.reportGroup.label,
            resultType: props.reportGroup.testResultType,
          },
        });

        setResultForHook(reportData.data.data[0]);

        setResult(reportData.data.data[0]);
      }
    })();
  }, []);

  if (postLoading || getLoading) {
    return <Loading />;
  }

  if (props.mode == ENUM_MODE.VIEW) {
    return (
      <>
        <div className="my-5  flex items-end justify-end px-10">
          <Button
            onClick={handlePrint}
            className="mb-5"
            appearance="primary"
            color="blue"
            size="lg"
          >
            Print
          </Button>
        </div>
        <ReportViewerParameter
          order={props.order}
          reportGroup={props.reportGroup}
          testResult={result}
          fieldNames={fieldNames}
          resultFields={resultFields}
          headings={headings}
          ref={componentRef as Ref<HTMLDivElement>}
        />
      </>
    );
  } else {
    return (
      <div>
        <div>
          <div>
            {headings.map((heading, index) => {
              return (
                <>
                  <div className="my-10">
                    <div className="text-lg font-bold font-serif" key={heading}>
                      {heading}
                    </div>
                    <div>
                      <Table
                        data={filterResultFieldsByInvestigation(
                          resultFields,
                          heading
                        )}
                        key={index}
                        wordWrap="break-word"
                        autoHeight
                      >
                        {fieldNames.map((fieldName: string) => (
                          <>
                            {fieldName == "defaultValue" ? (
                              <></>
                            ) : fieldName == "result" ? (
                              <Column key={fieldName} flexGrow={2}>
                                <HeaderCell>
                                  {fieldName.toUpperCase()}
                                </HeaderCell>
                                <Cell>
                                  {(rowData) =>
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    useResultField(
                                      fieldNames,
                                      rowData.defaultValue,
                                      rowData as IResultField,
                                      result,
                                      setResult
                                    )
                                  }
                                </Cell>
                              </Column>
                            ) : (
                              <Column key={fieldName} flexGrow={2}>
                                <HeaderCell>
                                  {fieldName.toUpperCase()}
                                </HeaderCell>
                                <Cell dataKey={fieldName} />
                              </Column>
                            )}
                          </>
                        ))}
                      </Table>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div>
          <Comment result={result} setResult={setResult} />
        </div>

        <div className="flex flex-row justify-end  my-5 w-3/4">
          <Button appearance="primary" color="red" size="lg">
            Cancel
          </Button>
          <Button
            appearance="primary"
            color="blue"
            className="ml-5"
            size="lg"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    );
  }
};

export default ForParameterBased;
