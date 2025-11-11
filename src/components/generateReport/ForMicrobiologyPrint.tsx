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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import ReactDOMServer from "react-dom/server";
import { htmlDocProviderForparameterBased } from "./functions";
import CountdownModal from "./CountdownModal";
import { useGetSingleDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { ENUM_BASEPATH } from "@/enum/ENUMBasePath";
import { NavLink } from "@/utils/Navlink";
const ForMicrobiologyPrint = (props: IPropsForMicroBiology) => {
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
  const [time, setTime] = useState(0);
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
            test: props.test,
          },
        });
        if (reportData.data && isMounted) {
          setResult(JSON.parse(JSON.stringify(reportData.data.data[0])));
        }
      } else if (isMounted) {
        setResult((prevValue) => ({
          ...prevValue,
          specimen: props.tests[0]?.test?.specimen[0]?.label as string,
        }));
      }
      setUpdate(updata + 1);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ react-to-print handler (prints only the component)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Report_${props?.oid ?? ""}`,
    pageStyle: styles, // ensures @page margins/styles apply in print window
    onAfterPrint: () => router.push(`/testReport/old?oid=${props?.oid}`),
    removeAfterPrint: true,
  });

  // 🕒 wait until data + DOM + images + fonts are ready, then print once
  useEffect(() => {
    const ready =
      !postLoading &&
      !getLoading &&
      !patchLoading &&
      !doctorInfoFetching &&
      !doctorInfoLoading;
    !!result && (props.order?.consultant ? doctorInfo !== undefined : true);

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
    doctorInfoFetching,
    doctorInfoLoading,

    doctorInfo,
    handlePrint,
    props.order?.consultant,
  ]);

  // Manual fallback button (kept if you want it)
  const handlerPrint = () => {
    handlePrint?.();
  };
  const { data: discRiptionData } = useGetMiscQuery({
    title: result.specimen,
  });

  if (
    postLoading ||
    getLoading ||
    patchLoading ||
    doctorInfoLoading ||
    doctorInfoFetching
  ) {
    return <Loading />;
  } else {
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
          <ReportViewerMicro
            order={props.order}
            reportGroup={reportGroup}
            ref={componentRef as Ref<HTMLDivElement>}
            result={result}
            specimenWiseDescription={discRiptionData?.data[0]}
            consultant={doctorInfo}
            tests={props.tests}
          />
        </div>
      </div>
    );
  }
};

export default ForMicrobiologyPrint;
