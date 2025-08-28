"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Dynamically import Quill to avoid SSR issues with Next.js
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const MyReportEditor = () => {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    // Here you would send `value` to your server via an API call
    console.log("Submitting content:", value);
    // Example: await fetch('/api/generate-pdf', { method: 'POST', body: JSON.stringify({ content: value }) });
  };

  return (
    <div>
      <h1>Create Your Report</h1>
      <QuillEditor theme="snow" value={value} onChange={setValue} />
      <button onClick={handleSubmit}>Generate PDF</button>
    </div>
  );
};

export default MyReportEditor;
