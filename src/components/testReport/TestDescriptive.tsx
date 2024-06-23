"use client";

import { useGetSingleTestQuery } from "@/redux/api/test/testSlice";
import { usePostTestReportMutation } from "@/redux/api/testReport/testReportSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { ITest } from "@/types/allDepartmentInterfaces";

import { setDocxContent } from "@/redux/features/discriptiveTem/docxTemSlice";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import mammoth from "mammoth";
import { FormEvent, useRef, useState } from "react";
import { Button, Input, Loader, Message, Table } from "rsuite";
import FileUpload from "./FileUpload";
import { ITestReportForm } from "./TestReportForm";
import MenuBar from "./TestView/MenuBar";
import "./TestView/TestViewD.css";

const { Column, HeaderCell, Cell } = Table;
const TestDescriptive = ({
  reportGenerate,
  setReportGenerate,
  setReportGenerateModal,
}: ITestReportForm) => {
  const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);
  const id = useAppSelector((state: { id: { id: string } }) => state.id.id);
  const docxContent = useAppSelector((state) => state.docxContent.docxContent);
  const dispatch = useAppDispatch();

  const [docxContents, setDocxContents] = useState<string>("");

  const formRef: React.MutableRefObject<any> = useRef();
  const [postTestReport] = usePostTestReportMutation(); // post create a reportTest
  // const [formData, setFromData] = useState<>();
  // console.log(testQueryData.data.resultFields, 'testData')

  const handleSubmit = async (e: FormEvent<HTMLInputElement>, data: ITest) => {
    const testId = reportGenerate.id;
    const type = reportGenerate.modeSingleType;
    const orderId = id;
    const resultDescripton = e.currentTarget.value;
    const finalDataForSendBakcend = {
      testId,
      orderId,
      resultDescripton,
      type,
      data,
    };
    console.log(finalDataForSendBakcend);
    const results = await postTestReport(finalDataForSendBakcend);
    console.log(results);
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await mammoth.convertToHtml({
        arrayBuffer: reader.result as ArrayBuffer,
      });
      setDocxContents(result.value);
      dispatch(setDocxContent(result.value));
    };
    reader.readAsArrayBuffer(file);
  };
  console.log("docx", docxContent);

  const content = `${docxContents}`;
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];

  console.log(docxContents);

  const { editor } = useCurrentEditor();
  const handleSave = async () => {
    const testId = reportGenerate.id;
    const type = reportGenerate.modeSingleType;
    const orderId = id;

    const docsData = docxContent;
    const finalDataForSendBakcend = {
      testId,
      orderId,
      type,
      docsData,
    };
    console.log("113", finalDataForSendBakcend);
    const results = await postTestReport(finalDataForSendBakcend);
    console.log(results);
    setDocxContents("");
    editor?.on("destroy", () => {
      // The editor is being destroyed.
    });
  };
  const handlePrint = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/testReport/print/${id}`
      );
      console.log(response.data);

      // const dataUrl = URL.createObjectURL(response.data.data)
      // console.log(dataUrl)
      // const base64String = response.data.data.data!.toString('base64');

      const buffer = Buffer.from(response.data.data.data);
      const pdfBlob = new Blob([buffer], { type: "application/pdf" });

      if (!pdfBlob) {
        <Loader inverse center content="loading..." />
      }
      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);

      // printJS({ printable: base64String, type: 'pdf', base64: true })
      // printJS({
      //   printable: pdfUrl,
      //   type: 'pdf',
      //   header: 'Print PDF',
      //   documentTitle: 'Print Example',
      //   base64: false
      // });
    } catch (error) { }
  };

  return (
    <div>
      <Table
        height={420}
        data={testQueryData?.data?.resultFields}
        rowHeight={60}
        bordered
        cellBordered
      >
        <Column flexGrow={3} align="center" fixed>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={3} width={200}>
          <HeaderCell>Result</HeaderCell>
          <Cell>
            {(rowData) => (
              <Input
                type="text"
                name="resultresultDescripton"
                defaultValue={rowData.resultDescripton}
                onBlur={(e) => handleSubmit(e, rowData as ITest)}
              />
            )}
          </Cell>
        </Column>
      </Table>

      <Message
        closable
        showIcon
        type="warning"
        header="Do you want edit first?"
      >
        <p>So please Input field complete then edit docs </p>
      </Message>
      <Message
        closable
        showIcon
        type="warning"
        header="Attention!!"
      >
        <p>{`It's only work for normal docx not for highly docs likes charAt and table docx etc`} </p>
      </Message>

      <h1>File Upload</h1>
      <FileUpload onFileUpload={handleFileUpload} />

      {docxContents && (
        <div className="bg-gray-100 rounded p-4 editor">
          <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={content}
          >
            <></>
          </EditorProvider>
        </div>
      )}

      <Button appearance="default" className="ml-5 mt-10" onClick={handleSave}>
        Save
      </Button>
      <Button
        appearance="default"
        disabled={false}
        className="ml-5 mt-10"
        onClick={() => {
          handlePrint(testQueryData.data._id);
        }}
      >
        preview
      </Button>

      <Button
        appearance="default"
        className="ml-5 mt-10"
        onClick={() => {
          setReportGenerateModal(false);
        }}
      >
        ok
      </Button>
    </div>
  );
};

export default TestDescriptive;
