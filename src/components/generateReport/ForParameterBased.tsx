import ReactDOMServer from "react-dom/server";
import Loading from "@/app/loading";
import { ENUM_MODE } from "@/enum/Mode";
import {
  useLazyGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
} from "@/redux/api/reportTest/reportTestSlice";
import { IResultField } from "@/types/allDepartmentInterfaces";
import { ReactInstance, Ref, useEffect, useRef, useState } from "react";
import { Button, Input, InputGroup, InputPicker, Loader, Table } from "rsuite";
import swal from "sweetalert";
import Comment from "./Comment";
import {
  filterResultFieldsByInvestigation,
  htmlDocProviderForparameterBased,
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
import CountdownModal from "./CountdownModal";
import { ENUM_BASEPATH } from "@/enum/ENUMBasePath";
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";
import { NavLink } from "@/utils/Navlink";
import HeadingOption from "./HeadingOption";

const ForParameterBased = (props: IPropsForParameter) => {
  const { data: doctorInfo } = useGetSingleDoctorQuery(
    props.order?.consultant as string,
    { skip: !props.order?.consultant }
  );
  const [margin, setMargins] = useState([0, 0, 0, 0]);
  const router = useRouter();
  const [getReport, { isLoading: getLoading }] = useLazyGetSingleReportQuery();
  const [patchReport, { isLoading: patchLoading }] = usePatchReporMutation();
  const [post, { isLoading: postLoading }] = usePostReportMutation();
  const { HeaderCell, Cell, Column } = Table;
  const { oid, tests, mode, order, reportGroup, refeatch } = props;
  const [resultForHook, setResultForHook] = useState();
  const [time, setTime] = useState(0);
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
            onClean={() => resultSetter(rowData._id, result, "", setResult)}
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
    swal({
      icon: "success",
      text: text,
      title: "Success",
      timer: 1000,
    });
  };

  const handleSubmit = async () => {
    if (mode == ENUM_MODE.EDIT) {
      const data = await patchReport({
        ...result,
        testIds: props?.testIds as unknown as string,
      });

      if ("data" in data) {
        swalButtonHandler(" Report Updated Successfully.");
        router.push(
          `/report-print/${props.oid}?reportGroup=${
            props.reportGroup?._id
          }&mode=view&reportType=${
            props?.reportGroup?.testResultType
          }&test=${props?.testIds?.join(",")}`
        );
      }
    }
    if (mode == ENUM_MODE.NEW) {
      const data = await post({
        ...result,
        testIds: props?.testIds as unknown as string,
      });
      if ("data" in data) {
        swalButtonHandler(" Report Posted Successfully.");

        router.push(
          `/report-print/${props.oid}?reportGroup=${
            props.reportGroup?._id
          }&mode=view&reportType=${
            props?.reportGroup?.testResultType
          }&test=${props?.testIds?.join(",")}`
        );
      }
    }
  };

  // ------------------------------------For print ----------------
  const componentRef = useRef<ReactInstance | null>();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current as ReactInstance,
  //   print: async (element) => {
  //     const pdf = new jsPDF("p", "pt", "a4");
  //     const dataa = await element.contentDocument;

  //     pdf.html(dataa?.body as HTMLElement, {
  //       callback: function (doc) {
  //         // Convert the PDF document to a Blob

  //         const pdfBlob = doc.output("blob");

  //         // Create a Blob URL
  //         const pdfUrl = URL.createObjectURL(pdfBlob);

  //         // Open the Blob URL in a new window
  //         const newWindow = window.open(pdfUrl);

  //         // Print the PDF in the new window
  //         if (newWindow) {
  //           newWindow.addEventListener("load", () => {
  //             newWindow.document.title = `${
  //               reportGroup.label + "_" + order.oid
  //             }`;
  //             newWindow.print();
  //           });
  //         } else {
  //           doc.save();
  //         }
  //       },

  //       autoPaging: "text",
  //       margin: margin,
  //       windowWidth: 800,
  //       width: 555,
  //       filename: `${reportGroup.label + "_" + order.oid}.pdf`,
  //     });
  //   },
  // });

  const handlePrint = () => {
    // const previousPath =
    //   window?.location?.origin +
    //   ENUM_BASEPATH.PATH +
    //   "/testReport/" +
    //   order?.oid;
    // const pdfData = (
    //   <ReportViewerParameter
    //     order={props.order}
    //     reportGroup={props.reportGroup}
    //     testResult={result}
    //     fieldNames={fieldNames}
    //     resultFields={resultFields}
    //     headings={headings}
    //     ref={componentRef as Ref<HTMLDivElement>}
    //     consultant={doctorInfo}
    //     tests={props.tests}
    //     toggle={toggle}
    //   />
    // );
    // const data = ReactDOMServer.renderToStaticMarkup(pdfData);
    // const dataWithHtml = htmlDocProviderForparameterBased(data, margin);
    // const win = window.open();
    // win?.document.write(dataWithHtml);
    // win?.print();
    // if (previousPath) router.push(previousPath);
    router.push(
      `/report-print/${props.oid}?reportGroup=${
        props.reportGroup?._id
      }&mode=view&reportType=${
        props?.reportGroup?.testResultType
      }&test=${props?.testIds?.join(",")}`
    );
  };

  useEffect(() => {
    (async function () {
      if (props.mode == ENUM_MODE.EDIT || props.mode == ENUM_MODE.VIEW) {
        const reportData = await getReport({
          oid: props.oid,
          params: {
            reportGroup: props.reportGroup.label,
            resultType: props.reportGroup.testResultType,
            testIds: props?.testIds?.join("'") as unknown as string[],
          },
        }).unwrap();

        // Modifying the data

        const modifiedTestData = {
          ...reportData.data[0],
          testResult: [].concat(
            ...reportData?.data?.map((t: any) => t?.testResult)
          ),
        };

        setResultForHook(modifiedTestData);

        setResult(modifiedTestData);
      }
    })();
  }, []);

  // Heading option
  const [toggle, setToggle] = useState(false);

  if (postLoading || getLoading || patchLoading) {
    return <Loading />;
  }

  if (getLoading) {
    return <Loading />;
  }

  if (props.mode == ENUM_MODE.VIEW) {
    return (
      <>
        {/* <div className="">
          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">
                Margin for Report Print
              </h2>
            </div>
            <div className="p-2">
              <div className="shadow-lg rounded-md py-5 my-5 mx-2">
                <div>
                  <div>
                    <Margin
                      margin={margin}
                      marginTitle="p"
                      setMargins={setMargins}
                      key={"p"}
                    />
                  </div>
                  <div>
                    <HeadingOption setToggleP={setToggle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="">
          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">Reports</h2>
            </div>
            <div className="flex justify-end mr-9 mt-4">
              <NavLink href={`/testReport/old?oid=${order.oid}`}>
                <Button
                  className="mb-5 col-span-4 mx-2"
                  appearance="primary"
                  color="red"
                  size="lg"
                >
                  Back
                </Button>
              </NavLink>
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
            <div className="p-2 flex items-center justify-center flex-col">
              <ReportViewerParameter
                order={props.order}
                reportGroup={props.reportGroup}
                testResult={result}
                fieldNames={fieldNames}
                resultFields={resultFields}
                headings={headings}
                ref={componentRef as Ref<HTMLDivElement>}
                consultant={doctorInfo}
                tests={props.tests}
                toggle={true}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="">
        <div className="my-5 border  shadow-lg mx-5">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">Test Report</h2>
          </div>
          <div className="p-2">
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
                      <div className="my-5 border  shadow-lg mx-5" key={index}>
                        <div className="bg-[#3498ff] text-white px-2 py-2">
                          <h2 className="text-center text-xl font-semibold">
                            {heading}
                          </h2>
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
                                    <Cell>
                                      {(rowData) => {
                                        if (fieldName == "normalValue") {
                                          return (
                                            <ol className="list-disc">
                                              {rowData[fieldName]
                                                ?.split(`"/br"`)
                                                ?.map(
                                                  (
                                                    v: string,
                                                    index: number
                                                  ) => (
                                                    <li key={index}>{v}</li>
                                                  )
                                                )}
                                            </ol>
                                          );
                                        } else {
                                          return <>{rowData[fieldName]}</>;
                                        }
                                      }}
                                    </Cell>
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
              <Comment result={result} setResult={setResult} mode={mode} />
            </div>

            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS]}
            >
              <div className="flex flex-row justify-end  my-5 w-3/4">
                <Button
                  appearance="primary"
                  color="red"
                  size="lg"
                  onClick={() =>
                    router.push(`/testReport/old?oid=${order.oid}`)
                  }
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
        </div>

        <CountdownModal
          seconds={time}
          message="Data Posted Successfully. Please wait you will be redirected"
        />
      </div>
    );
  }
};

export default ForParameterBased;
