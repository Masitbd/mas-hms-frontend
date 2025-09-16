import ReactDOMServer from "react-dom/server";
import Loading from "@/app/loading";
import { ENUM_MODE } from "@/enum/Mode";
import {
  useLazyGetSingleReportQuery,
  usePatchReporMutation,
  usePostReportMutation,
} from "@/redux/api/reportTest/reportTestSlice";
import { IResultField } from "@/types/allDepartmentInterfaces";
import { Ref, useEffect, useRef, useState } from "react";
import { Button, Input, InputGroup, InputPicker, Loader, Table } from "rsuite";
import swal from "sweetalert";
import Comment from "./Comment";
import { useCleanedTests } from "./functions";
import {
  IPropsForParameter,
  ITestResultForParameter,
} from "./initialDataAndTypes";
import ReportViewerParameter from "./ReportViewerParameter";
import { useRouter } from "next/navigation";

import { useReactToPrint } from "react-to-print";

import { useGetSingleDoctorQuery } from "@/redux/api/doctor/doctorSlice";

const ForParameterBasedPrint = (props: IPropsForParameter) => {
  const {
    data: doctorInfo,
    isLoading: doctorInfoLoading,
    isFetching: doctorInfoFetching,
  } = useGetSingleDoctorQuery(
    (typeof props.order?.consultant == "object"
      ? props.order?.consultant?._id
      : "id") as string,
    {
      skip: !props.order?.consultant,
    }
  );

  const router = useRouter();

  const [getReport, { isLoading: getLoading }] = useLazyGetSingleReportQuery();
  const [patchReport, { isLoading: patchLoading }] = usePatchReporMutation();
  const [post, { isLoading: postLoading }] = usePostReportMutation();

  const { HeaderCell, Cell, Column } = Table;
  const { oid, tests, mode, order, reportGroup, refeatch } = props;

  const [resultForHook, setResultForHook] = useState<any>();
  const [time, setTime] = useState(0);

  const { fieldNames, headings, resultFields, returnResult } = useCleanedTests({
    mode,
    oid,
    order,
    reportGroup,
    tests,
    result: resultForHook,
  });

  const [result, setResult] = useState<ITestResultForParameter>(
    returnResult as ITestResultForParameter
  );

  const styles = `.ProseMirror {
  position: relative;
}
.ProseMirror {
 font-family: monospace !important;
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0;
}
.ProseMirror [contenteditable="false"] { white-space: normal; }
.ProseMirror [contenteditable="false"] [contenteditable="true"] { white-space: pre-wrap; }
.ProseMirror pre { white-space: pre-wrap; }
img.ProseMirror-separator { display:inline !important; border:none !important; margin:0 !important; width:1px !important; height:1px !important; }
.ProseMirror-gapcursor { display:none; pointer-events:none; position:absolute; margin:0; }
.ProseMirror-gapcursor:after { content:""; display:block; position:absolute; top:-2px; width:20px; border-top:1px solid black; animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite; }
@keyframes ProseMirror-cursor-blink { to { visibility: hidden; } }
.ProseMirror-hideselection *::selection { background: transparent; }
.ProseMirror-hideselection *::-moz-selection { background: transparent; }
.ProseMirror-hideselection * { caret-color: transparent; }
.ProseMirror-focused .ProseMirror-gapcursor { display: block; }
.tippy-box[data-animation=fade][data-state=hidden] { opacity:0 }
.print-btn { display:flex; align-items:center; background-color:#4CAF50; color:white; border:none; padding:10px 20px; cursor:pointer; font-size:16px; border-radius:5px; transition:background-color .3s; }
.print-btn:hover { background-color:#45a049; }
.print-btn svg { width:20px; height:20px; margin-right:8px; }
@page { size: A4 portrait; margin: ${props?.margins
    ?.map((m) => `${m}px`)
    .join(" ")}; }
* { box-sizing:border-box; margin:0; padding:0; }
@media print {
  .print-button, .print-button-div { display:none !important; }
}
#seals { position: fixed !important; }`;

  // 🔗 ref to printable content
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async function () {
      if (props.mode === ENUM_MODE.EDIT || props.mode === ENUM_MODE.VIEW) {
        const reportData = await getReport({
          oid: props.oid,
          params: {
            reportGroup: props.reportGroup.label,
            resultType: props.reportGroup.testResultType,
            testIds: props?.testIds?.join("'") as unknown as string[],
          },
        }).unwrap();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ react-to-print handler (prints only the component)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Report_${props?.oid ?? ""}`,
    pageStyle: styles, // ensures @page margins/styles apply in print window
    onAfterPrint: () => router.push(`/testReport/${props?.oid}`),
    removeAfterPrint: true,
  });

  // 🕒 wait until data + DOM + images + fonts are ready, then print once
  useEffect(() => {
    const ready =
      !postLoading &&
      !getLoading &&
      !patchLoading &&
      !doctorInfoLoading &&
      !doctorInfoFetching &&
      !!result &&
      !!fieldNames &&
      !!resultFields &&
      !!headings &&
      (props.order?.consultant ? doctorInfo !== undefined : true);

    if (!ready) return;

    const waitForAssets = async () => {
      // next paint (DOM flushed)
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      // wait images inside printable node
      const node = componentRef.current ?? document.body;
      const imgs = Array.from(node.querySelectorAll("img"));
      if (imgs.length) {
        await Promise.all(
          imgs.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((res) => {
                  img.onload = () => res();
                  img.onerror = () => res();
                })
          )
        );
      }
      // wait fonts (where supported)
      try {
        // @ts-ignore
        if (document?.fonts?.ready) await (document as any).fonts.ready;
      } catch {}
      // tiny delay to be extra safe for layout
      await new Promise((r) => setTimeout(r, 50));
      handlePrint?.();
    };

    void waitForAssets();
  }, [
    postLoading,
    getLoading,
    patchLoading,
    result,
    fieldNames,
    resultFields,
    headings,
    doctorInfo,
    handlePrint,
    props.order?.consultant,
    doctorInfoFetching,
    doctorInfoLoading,
  ]);

  // Manual fallback button (kept if you want it)
  const handlerPrint = () => {
    handlePrint?.();
  };

  if (
    postLoading ||
    getLoading ||
    patchLoading ||
    doctorInfoLoading ||
    doctorInfoFetching
  ) {
    return <Loading />;
  }

  return (
    <div className="">
      <style>{styles}</style>

      {/* Optional manual print button (hidden in print) */}
      <div className="flex justify-end print-button-div">
        <button className="print-btn print-button m-5" onClick={handlerPrint}>
          Print
        </button>
      </div>

      {/* Printable area */}
      <div ref={componentRef}>
        <ReportViewerParameter
          order={props.order}
          reportGroup={props.reportGroup}
          testResult={result}
          fieldNames={fieldNames}
          resultFields={resultFields}
          headings={headings}
          ref={componentRef as Ref<HTMLDivElement>} // if ReportViewerParameter forwards ref
          consultant={doctorInfo}
          tests={props.tests}
          toggle={true}
        />
      </div>
    </div>
  );
};

export default ForParameterBasedPrint;
