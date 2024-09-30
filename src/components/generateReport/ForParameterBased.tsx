import Loading from "@/app/loading";
import { ENUM_MODE } from "@/enum/Mode";
import {
  useLazyGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
} from "@/redux/api/reportTest/reportTestSlice";
import { IResultField } from "@/types/allDepartmentInterfaces";
import { ReactInstance, Ref, useEffect, useRef, useState } from "react";
import { Button, Input, InputGroup, InputPicker, Table } from "rsuite";
import swal from "sweetalert";
import Comment from "./Comment";
import {
  filterResultFieldsByInvestigation,
  resultSetter,
  useCleanedTests,
} from "./functions";
import {
  IPropsForParameter,
  ITestResultForParameter,
} from "./initialDataAndTypes";
import ReportViewerParameter from "./ReportViewerParameter";
// import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import Margin from "./Margin";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { useGetSingleDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import ForDescriptionBased from "./ForDescriptionBased";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import { setTimeout } from "timers";

const ForParameterBased = (props: IPropsForParameter) => {
  const { data: doctorInfo } = useGetSingleDoctorQuery(
    props.order?.consultant as string
  );
  const [margin, setMargins] = useState([0, 0, 0, 0]);
  const router = useRouter();
  const [getReport, { isLoading: getLoading }] = useLazyGetSingleReportQuery();
  const [patchReport, { isLoading: patchLoading }] = usePatchReporMutation();
  const [post, { isLoading: postLoading }] = usePostReportMutation();
  const { HeaderCell, Cell, Column } = Table;
  const { oid, tests, mode, order, reportGroup, refeatch } = props;
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
      (rowData?.defaultValue as string[]) || []
    );
    const keys = Object.keys(rowData);
    if (keys.includes("defaultValue") && defaultValue?.length > 0) {
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
          {reportGroup?.testResultType == "descriptive" ? (
            <ForDescriptionBased
              result={result}
              setResult={setResult}
              rowData={rowData}
            />
          ) : (
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
          )}
        </>
      );
    }
  };

  // Result handler
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
        setTimeout(() => {
          swalButtonHandler(" Report posted Successfully");
          router.push(`/testReport/${order.oid}`);
          refeatch && refeatch();
        }, 5000);
      }
    }

    if (mode == ENUM_MODE.EDIT) {
      const data = await patchReport(result);
      if ("data" in data) {
        swal("success", "", "success");
        swalButtonHandler("Report updated Successfully");
        refeatch && refeatch();
      }
    }
  };

  // ------------------------------------For print ----------------
  const componentRef = useRef<ReactInstance | null>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current as ReactInstance,
    print: async (element) => {
      const pdf = new jsPDF("p", "pt", "a4");
      const dataa = await element.contentDocument;

      pdf.html(dataa?.body as HTMLElement, {
        callback: function (doc) {
          // Convert the PDF document to a Blob

          const pdfBlob = doc.output("blob");

          // Create a Blob URL
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Open the Blob URL in a new window
          const newWindow = window.open(pdfUrl);

          // Print the PDF in the new window
          if (newWindow) {
            newWindow.addEventListener("load", () => {
              newWindow.document.title = `${
                reportGroup.label + "_" + order.oid
              }`;
              newWindow.print();
            });
          } else {
            doc.save();
          }
        },

        autoPaging: "text",
        margin: margin,
        windowWidth: 800,
        width: 555,
        filename: `${reportGroup.label + "_" + order.oid}.pdf`,
      });
    },
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

  if (getLoading) {
    return <Loading />;
  }

  if (props.mode == ENUM_MODE.VIEW) {
    return (
      <>
        <div className="shadow-lg rounded-md py-5 my-5 mx-2">
          <div>
            <Margin
              margin={margin}
              marginTitle="p"
              setMargins={setMargins}
              key={"p"}
            />
          </div>
          <div className="flex justify-end mr-9">
            <Button
              onClick={handlePrint}
              className="mb-5 col-span-4"
              appearance="primary"
              color="blue"
              size="lg"
            >
              Print
            </Button>
          </div>
        </div>

        <ReportViewerParameter
          order={props.order}
          reportGroup={props.reportGroup}
          testResult={result}
          fieldNames={fieldNames}
          resultFields={resultFields}
          headings={headings}
          ref={componentRef as Ref<HTMLDivElement>}
          consultant={doctorInfo}
        />
      </>
    );
  } else {
    return (
      <div>
        <div>
          <div className="mt-5">
            Analyzer Machine Name
            <Input
              onChange={(value) => {
                const data = { ...result };
                (data.analyzerMachine = value), setResult(data);
              }}
              defaultValue={result?.analyzerMachine}
            />
          </div>
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

        <AuthCheckerForComponent
          requiredPermission={[ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS]}
        >
          <div className="flex flex-row justify-end  my-5 w-3/4">
            <Button
              appearance="primary"
              color="red"
              size="lg"
              onClick={() => router.push(`/testReport/${order.oid}`)}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              color="blue"
              className="ml-5"
              size="lg"
              onClick={handleSubmit}
              loading={patchLoading || postLoading}
            >
              Post
            </Button>
          </div>
        </AuthCheckerForComponent>
      </div>
    );
  }
};

export default ForParameterBased;
