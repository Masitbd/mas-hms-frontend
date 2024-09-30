import React, {
  MutableRefObject,
  ReactInstance,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, SelectPicker, Table } from "rsuite";
import MIcro1stSection from "./MIcro1stSection";
import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import Comment from "./Comment";
import MicroGrowthOption from "./MicroGrowthOption";
import MicroSEnsitivityOp from "./MicroSEnsitivityOp";
import {
  InitialValueForMicro,
  IPropsForMicroBiology,
  IPropsForParameter,
  ITEstREsultForMicroBio,
} from "./initialDataAndTypes";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import {
  useLazyGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
} from "@/redux/api/reportTest/reportTestSlice";
import swal from "sweetalert";
import { ENUM_MODE } from "@/enum/Mode";
import Loading from "@/app/loading";
import ReportViewerParameter from "./ReportViewerParameter";
import ReportViewerMicro from "./ReportViewerMicro";
import Margin from "./Margin";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
const ForMicrobiology = (props: IPropsForMicroBiology) => {
  const [updata, setUpdate] = useState(1);
  const [patchReport, { isLoading: patchLoading }] = usePatchReporMutation();
  const { mode, oid, order, reportGroup } = props;
  const conductedBy = useAppSelector((state) => state.auth.user.uuid);
  const [getReport, { isLoading: getLoading, isFetching }] =
    useLazyGetSingleReportQuery();
  const [post, { isLoading: postLoading }] = usePostReportMutation();

  const router = useRouter();

  const [result, setResult] =
    useState<ITEstREsultForMicroBio>(InitialValueForMicro);

  // ----------------------------------------------------------------

  const hanldePost = async () => {
    const data: ITEstREsultForMicroBio = {
      ...(result as unknown as ITEstREsultForMicroBio),
    };
    data.oid = oid;
    data.reportGroup = reportGroup;
    data.conductedBy = conductedBy;
    if (mode == ENUM_MODE.NEW) {
      const postResult = await post(data);
      if ("data" in postResult) {
        swal(
          "Success",
          "Data Posted. Redirection is in process. You will be redirected to previous Page Please Wait",
          { icon: "success" }
        );
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      const data = await patchReport(result);
      if ("data" in data) {
        swal(
          "Success",
          "Data Posted. Redirection is in process. You will be redirected to previous Page Please Wait",
          { icon: "success" }
        );
        setTimeout(() => {
          router.push(`/testReport/${order.oid}`);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async function () {
      if (
        (props.mode === ENUM_MODE.EDIT || props.mode === ENUM_MODE.VIEW) &&
        isMounted
      ) {
        const reportData = await getReport({
          oid: props.oid,
          params: {
            reportGroup: props.reportGroup.label,
            resultType: props.reportGroup.testResultType,
          },
        });
        if (reportData.data && isMounted) {
          setResult(JSON.parse(JSON.stringify(reportData.data.data[0])));
        }
      }
      setUpdate(updata + 1);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // For Print
  const [margin, setMargins] = useState([0, 0, 0, 0]);
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

  if (postLoading || getLoading || isFetching) {
    return <Loading />;
  }

  if (mode == ENUM_MODE.VIEW) {
    return (
      <>
        <div className="">
          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">Margin</h2>
            </div>
            <div className="p-2">
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
            </div>
          </div>
        </div>

        <div className="">
          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">Report</h2>
            </div>
            <div className="p-2"></div>
            <ReportViewerMicro
              order={props.order}
              reportGroup={reportGroup}
              ref={componentRef as Ref<HTMLDivElement>}
              result={result}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="my-5 mx-5 border rounded-md shadow-lg">
          <div className="bg-[#3498ff] text-white px-2 py-2">
            <h2 className="text-center text-xl font-semibold">
              Microbiology Report
            </h2>
          </div>

          <MIcro1stSection
            result={result}
            setResult={setResult}
            testLoading={getLoading}
          />
        </div>

        {result?.growth && (
          <>
            {" "}
            <MicroGrowthOption result={result} setResult={setResult} />
            <MicroSEnsitivityOp result={result} setResult={setResult} />
          </>
        )}

        <div className="mb-5 mx-5">
          <Comment result={result} setResult={setResult} />
        </div>
        <AuthCheckerForComponent
          requiredPermission={[ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS]}
        >
          <div className="mb-5 mx-5 grid grid-cols-12 gap-5">
            <Button
              className="col-start-11"
              appearance="primary"
              color="red"
              onClick={() => {
                setResult(InitialValueForMicro);
                router.push(`/testReport/${order.oid}`);
              }}
              loading={postLoading || patchLoading}
            >
              Cancel
            </Button>
            <Button
              className="col-start-12"
              appearance="primary"
              color="blue"
              onClick={() => hanldePost()}
              loading={postLoading || patchLoading}
            >
              Post
            </Button>
          </div>
        </AuthCheckerForComponent>
      </>
    );
  }
};

export default ForMicrobiology;
