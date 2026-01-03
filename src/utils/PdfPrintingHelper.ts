import CompanyInfo from "@/app/(withlayout)/companyInfo/page";

import { ToWords } from "to-words";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import LedgerEnum from "@/enum/ENUMAccountHeads";
import { ENUMJournalType } from "@/enum/ENUMJournalTYpe";
import { ENUMBudgetType } from "@/enum/ENUMBudgetType";
import { usePostJournalEntryMutation } from "@/redux/api/journal/journalSlice";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { window as tauriWindow } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export const pdfPrintingHelper = (dd: TDocumentDefinitions) => {
  const mode = process.env.NEXT_PUBLIC_PLATFORM;
  async function printPdfInTauri(pdfBlob: Buffer) {
    // const blobUrl = URL.createObjectURL(pdfBlob);
    const base64Data = pdfBlob.toString("base64");
    const win = new WebviewWindow("invoice-print", {
      // dev:  "http://localhost:3000/print-invoice-tauri"
      url: "/print-invoice-tauri",
    });

    // 2) Wait until the print window says "I'm ready"
    await listen("invoice-print-ready", async () => {
      // 3) Now send the PDF as a GLOBAL event
      await emit("invoice-pdf", { data: base64Data });
    });

    win.once("tauri://error", (e) => {
      console.error("invoice-print error", e);
    });
    // InvoiceWindow.once("tauri://window-created", () => {
    //   console.log("opened");
    // });
  }

  function printPdfBlobSameTab(pdfBlob: Blob) {
    const blobUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    // Keep it invisible but present in the DOM
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = blobUrl;

    const cleanUp = () => {
      URL.revokeObjectURL(blobUrl);
      iframe.remove();
    };

    const triggerPrint = () => {
      const w = iframe.contentWindow as Window | null;
      if (!w) {
        cleanUp();
        return;
      }

      const after = () => setTimeout(cleanUp, 300);

      // Use separate guards (not `else if`) so TS doesn't narrow to `never`
      if ("onafterprint" in w) {
        (w as Window & { onafterprint: (() => void) | null }).onafterprint =
          after;
      }

      if (typeof w.matchMedia === "function") {
        const mql: MediaQueryList = w.matchMedia("print");
        const onChange = (e: MediaQueryListEvent) => {
          if (!e.matches) after();
        };

        if ("addEventListener" in mql) {
          mql.addEventListener("change", onChange);
        } else if ("addListener" in mql) {
          // Older API (cast for TS)
          (
            mql as unknown as {
              addListener: (cb: (e: MediaQueryListEvent) => void) => void;
            }
          ).addListener(onChange);
        }
      }

      // Small delay helps some PDF viewers fully initialize
      setTimeout(() => {
        w.focus();
        w.print();
      }, 100);
    };

    iframe.addEventListener("load", () => setTimeout(triggerPrint, 200));
    document.body.appendChild(iframe);
  }

  if (mode == "online") {
    pdfMake
      .createPdf(dd as unknown as TDocumentDefinitions)
      .getBlob((result) => {
        printPdfBlobSameTab(result);
      });
  } else {
    pdfMake
      .createPdf(dd as unknown as TDocumentDefinitions)
      .getBuffer((result) => {
        printPdfInTauri(result);
      });
  }
};
