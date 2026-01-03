"use client";

import { useEffect, useState } from "react";
import { emit, listen } from "@tauri-apps/api/event";

export default function TauriInvoicePrinter() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // 1) Tell main window we're ready
    emit("invoice-print-ready");

    // 2) Listen for the PDF
    let unlisten: (() => void) | undefined;

    listen<{ data: string }>("invoice-pdf", (event) => {
      console.log("got pdf event", event);
      setData(event.payload.data);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  if (!data) {
    return <div>Loading PDF…</div>;
  }

  return (
    <iframe
      src={`data:application/pdf;base64,${data}`}
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
}
