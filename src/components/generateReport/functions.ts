import { ENUM_MODE } from "@/enum/Mode";
import {
  IReportGroup,
  IResultField,
  ISpecimen,
} from "@/types/allDepartmentInterfaces";
import { ITEstREsultForMicroBio, ITestsFromOrder } from "./initialDataAndTypes";
import { IOrderData } from "../order/initialDataAndTypes";
import { useLazyGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { useAppSelector } from "@/redux/hook";
import { IPdrv } from "@/app/(withlayout)/pdrv/page";
import { SetStateAction } from "react";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { camelToFlat } from "@/utils/CamelToFlat";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const useCleanedTests = (params: {
  oid: string;
  mode: string;
  reportGroup: IReportGroup;
  order: IOrderData;
  tests: ITestsFromOrder[];
  result?: {
    oid: string;
    reportGroup: IReportGroup;
    testResult: IResultField[];
  };
  setResult?: (params: any) => void;
}) => {
  const [getSpecimen] = useLazyGetSpecimenQuery();
  let { oid, mode, reportGroup, order, tests, result, setResult } = params;
  const unrefundedTest = order.tests.filter(
    (test) =>
      test.status !== ENUM_TEST_STATUS.REFUNDED && test.status !== "tube"
  );
  order.tests = unrefundedTest;

  // This array contains the result fields name which will now be shoun in the result
  const unnecesseryFields = [
    "investigation",
    "_id",
    "defaultValue",
    "unit",
    "description",
    "reportTypeGroup",
    "__t",
    "createdAt",
    "updatedAt",
    "__v",
  ];
  let modifiedTest;
  let specimen: string[] = [];
  let fieldNames: string[] = [];
  let headings: string[] = [];
  let resultFields: IResultField[] = [];
  const user = useAppSelector((state) => state.auth.user);
  let returnResult =
    mode == ENUM_MODE.NEW
      ? {
          oid: oid,
          reportGroup: reportGroup,
          testResult: resultFields,
          comment: "",
          conductedBy: user.uuid,
        }
      : result;

  if (mode == ENUM_MODE.NEW) {
    modifiedTest = tests.map((test: ITestsFromOrder) => {
      if (test.test.resultFields.length > 0) {
        // Checking if the tests contains any result fields
        const cleanedResultFields = test.test.resultFields.map((rfData) => {
          let resultField = { ...rfData };

          // setting the default value to the result
          if (
            reportGroup?.testResultType == "descriptive" &&
            resultField.description != null
          ) {
            resultField.result = resultField.description;
          }
          // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          Object.keys(resultField).forEach((propName) => {
            //   cleaning the unwanted fields
            if (resultField[propName] === "") {
              delete resultField[propName];
            }
            if (
              resultField[propName] === undefined ||
              resultField[propName] === null
            ) {
              delete resultField[propName];
            }
            if (Array.isArray(resultField[propName])) {
              if (resultField[propName].length == 0) {
                delete resultField[propName];
              }
            }
          });
          //   finding unique field name
          Object.keys(resultField).forEach((propName) => {
            if (
              !fieldNames.includes(propName) &&
              !unnecesseryFields.includes(propName)
            ) {
              fieldNames.push(propName);
            }

            if (
              propName == "investigation" &&
              !headings.includes(resultField[propName])
            ) {
              headings.push(resultField[propName]);
            }
          });
          resultFields.push(resultField);
          return resultField;
        });

        // finding unique headings

        const newTest = JSON.parse(JSON.stringify(test));
        newTest.test.resultFields = cleanedResultFields;

        return newTest;
      }
    });

    if (!fieldNames.includes("result")) {
      if (fieldNames.includes("normalValue")) {
        const index = fieldNames.findIndex((v) => v == "normalValue");
        fieldNames[index] = "result";
        fieldNames.push("normalValue");
      } else fieldNames.push("result");
    }
  }

  // For edit
  else {
    modifiedTest = order?.tests;
    if (returnResult?.testResult) {
      returnResult.testResult.forEach((field: IResultField) => {
        Object.keys(field).forEach((propName) => {
          if (
            !fieldNames.includes(propName) &&
            !unnecesseryFields.includes(propName)
          ) {
            fieldNames.push(propName);
          }

          if (
            propName == "investigation" &&
            !headings.includes(field[propName])
          ) {
            headings.push(field[propName]);
          }
        });
        resultFields.push(field);
      });

      if (!fieldNames.includes("result")) {
        if (fieldNames.includes("normalValue")) {
          const index = fieldNames.findIndex((v) => v == "normalValue");
          fieldNames[index] = "result";
          fieldNames.push("normalValue");
        } else fieldNames.push("result");
      }
    }
  }

  //Filtering the fields that does not have any result field value
  if (mode == ENUM_MODE.VIEW) {
    const result = resultFields?.filter(
      (d) => Object?.hasOwn(d, "result") && d?.result !== null
    );
    resultFields = result;
  }
  setResult && setResult(returnResult);
  return { modifiedTest, fieldNames, headings, resultFields, returnResult };
};

export const filterResultFieldsByInvestigation = (
  resultField: IResultField[],
  heading: string
) => {
  if (resultField.length > 0) {
    return resultField.filter(
      (resultField) => resultField.investigation == heading
    );
  } else {
    return [];
  }
};

export const resultSetter = (
  id: string,
  result: {
    oid: string;
    reportGroup: IReportGroup;
    testResult: IResultField[];
  },
  value: string,
  setResult: any
) => {
  let data = result.testResult.find((d) => d._id == id);
  const dataIndex = result.testResult.findIndex((d) => d._id == id);
  data = {
    ...(data as IResultField),
    result: value,
  };

  if (data?.defaultValue && !data?.defaultValue.includes(value)) {
    data.defaultValue = [...data.defaultValue, value];
  }
  const newData = JSON.parse(JSON.stringify(result));

  newData.testResult.splice(dataIndex, 1, data);
  setResult(newData);
};

export const getPageMargins = () => {
  return `@page { margin: ${100} ${20} ${20} ${100} !important; }`;
};

export const resultSetterForMicroBio = (
  key: string,
  value: string | boolean,
  result: ITEstREsultForMicroBio,
  setResult: React.Dispatch<SetStateAction<ITEstREsultForMicroBio>>
) => {
  const data = JSON.parse(JSON.stringify(result));
  data[key] = value;
  setResult(data);
};

export const htmlDocProviderForparameterBased = (
  data: string,
  margin: number[]
) => {
  return `<!DOCTYPE html>
        <head>
        <style>
        .print-btn {
  display: flex;
      align-items: center;
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 5px;
      transition: background-color 0.3s;
      position: absolute;
      top: 2rem;
      right: 2rem;
}


    .print-btn:hover {
      background-color: #45a049;
    }

    .print-btn svg {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
        @page {
          size: A4 portrait;
          margin: ${margin?.map((m) => `${m}px`).join(" ")};
        }
           *{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

      @media print {
  .print-button {
    display: none;
  }

  body{
            margin-left: 1rem !important;
            margin-right: 1rem !important;
            }
}
    
  #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            z-index: 9999;
        }

        #main-content {
            display: none;
        }
    </style>
    
 <script>
     window.addEventListener("beforeprint",function() {
     const height = document.getElementById("seals").offsetHeight
     document.getElementById("seals").style.height = height + "px";
      document.getElementById("seals").style.marginTop = (-30 - height) + "px";
     ;

     window.addEventListener("afterprint", function () {
            const height = document.getElementById("seals").offsetHeight
            document.getElementById("seals").style.height = height + "px";
            document.getElementById("seals").style.marginTop =30 + "px";
           


        })
     

        
     })




     
    
   
   
    
  </script>
        </head>

            
      
        <body id="main-content">
          <div id="loading-screen">
        <p>Loading...</p>
    </div>
        ${data}
         <div class="print-button print-btn">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M19 8h-14c-1.1 0-1.99.9-1.99 2l-.01 6c0 1.1.9 2 2 2h1v4h12v-4h1c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 8h-14v-6h14v6zm-3-15h-8v4h8v-4zm2 4h-12v-5h12v5z" />
    </svg>
    Print
          </button>
        </div>
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" onload="cssLoaded()">

    <script>
        // Function to hide loading screen and show main content once CSS is loaded
        function cssLoaded() {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
             window.print();
        } 
            document.getElementsByClassName("print-button")[0].addEventListener("click", function(){
 
    window.print();
  });
  </script
        
      </html>`;
};

export const htmlDocProviderForMicroBiology = (
  data: string,
  margin: number[]
) => {
  return `<!DOCTYPE html>
        <head>
        <style>
      
        .print-button {
  height: 5rem;
  width: 8rem;
 
  text-align: center;
  
  color: white;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  position: fixed;
  z-index: 1000;
  right: 20px;
  top: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
  padding: 30px 30px

}

.print-button:hover {
 
  transform: scale(1.1);
}

.print-button:active {
  transform: scale(0.95);
}
        @page {
          size: A4 portrait;
          margin: ${margin?.map((m) => `${m}px`).join(" ")};
        }
           *{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

      @media print {
  .print-button {
    display: none;
  }
     body{
            margin-left: 1rem !important;
            margin-right: 1rem !important;
            }
}
    
  #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            z-index: 9999;
        }

        #main-content {
            display: none;
            margin:0rem 1rem;
        }
    </style>
    
 <script>
     window.addEventListener("beforeprint",function() {
     const height = document.getElementById("seals").offsetHeight
     document.getElementById("seals").style.height = height + "px";
      document.getElementById("seals").style.marginTop = (-30 - height) + "px";
     ;

     window.addEventListener("afterprint", function () {
            const height = document.getElementById("seals").offsetHeight
            document.getElementById("seals").style.height = height + "px";
            document.getElementById("seals").style.marginTop =30 + "px";
           


        })
     

        
     })




     
    
   
   
    
  </script>
        </head>

            
      
        <body id="main-content">
          <div id="loading-screen">
        <p>Loading...</p>
    </div>
        ${data}
         <div class="print-button">
          <button >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M19 8h-14c-1.1 0-1.99.9-1.99 2l-.01 6c0 1.1.9 2 2 2h1v4h12v-4h1c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 8h-14v-6h14v6zm-3-15h-8v4h8v-4zm2 4h-12v-5h12v5z" />
    </svg>
    Print
          </button>
        </div>
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" onload="cssLoaded()">

    <script>
        // Function to hide loading screen and show main content once CSS is loaded
        function cssLoaded() {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
             window.print();
        } 
            document.getElementsByClassName("print-button")[0].addEventListener("click", function(){
 
    window.print();
  });
  </script
        
      </html>`;
};

export const parseHTMLSeal = (html: string) => {
  // Basic conversion of HTML to pdfmake-friendly format
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Extract and structure content
  const textLines = Array.from(tempDiv.children).map((child) => ({
    text: child.textContent?.trim(),
    style: "footerText", // Apply custom styles if needed
  }));

  return textLines;
};

export const testReportGeneratePDF = (params) => {
  const {
    order,
    reportGroup,
    testResult,
    consultant,
    resultFields,
    fieldNames,
    headings,
    margin,
  } = params;

  console.log(params, "params");

  const sealContent = parseHTMLSeal(testResult?.seal);
  // Define document content
  const docDefinition = {
    pageSize: "A4",
    pageMargins: margin.length ? margin : [40, 60, 40, 60], // Top, left, right, bottom margins
    content: [
      {
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                stack: [`${reportGroup.label}`],
                style: "title",
                alignment: "center",
                margin: [10, 10], // Add some margin for spacing
                border: [
                  // Define the border
                  "3px solid #000", // Top border
                  "3px solid #000", // Right border
                  "3px solid #000", // Bottom border
                  "3px solid #000", // Left border
                ],
              },
            ],
          ],
          margin: [10, 0, 10, 0],
        },
      },

      testResult?.analyzerMachine && {
        text: testResult.analyzerMachine,
        style: "analyzerMachine",
        alignment: "center",
        margin: [0, 10, 0, 20],
      },
      {
        table: {
          widths: ["50%", "50%"], // Two columns splitting the width evenly
          alignment: "center",
          body: [
            // Row 1: ID and Name (left column), Age and Sex (right column)
            [
              {
                stack: [
                  { text: `ID: ${order.oid}`, margin: [0, 0, 0, 5] },
                  {
                    text: `Age: ${order.patient?.age || "N/A"} Year(s)`,
                    margin: [0, 0, 0, 5],
                  },
                ],
                border: [false, false, false, false],
              },
              {
                stack: [
                  { text: `Name: ${order.patient?.name || "N/A"}` },
                  { text: `Sex: ${order.patient?.gender || "N/A"}` },
                ],
                border: [false, false, false, false],
              },
            ],
            // Row 2: Consultant (left column), Receiving Date (right column)
            [
              {
                stack: [
                  {
                    text:
                      order?.consultant &&
                      typeof order?.consultant === "object" &&
                      order?.consultant?.title &&
                      order?.consultant?.name
                        ? `Consultant: ${order?.consultant?.title} ${order?.consultant?.name}`
                        : "Consultant: N/A",
                  },
                ],
                border: [false, false, false, false],
              },
              {
                stack: [
                  {
                    text: `Receiving Date: ${new Date(
                      order.createdAt
                    ).toDateString()}`,
                  },
                ],
                border: [false, false, false, false],
              },
            ],
            // Row 3: Specimen (left column), Report Date (right column)
            [
              {
                stack: [
                  {
                    text: `Report Date: ${new Date(
                      testResult?.createdAt
                    ).toDateString()}`,
                  },
                ],
                border: [false, false, false, false],
              },
              {
                stack: [
                  {
                    text: testResult?.specimen
                      ? `Specimen: ${Array.from(testResult?.specimen).join(
                          ", "
                        )}`
                      : "N/A",
                  },
                ],
                border: [false, false, false, false],
              },
            ],
          ],
        },

        layout: "noBorders", // No internal borders
        margin: [10, 30, 10, 10], // Outer margin for the table
        // Add a border around the entire table
        border: [true, true, true, true], // Outer margin for the table (left, top, right, bottom)
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          body: [
            [
              { text: "Test", fillColor: "#D3D3D3", fontSize: 16, bold: true },
              {
                text: "Result",
                fillColor: "#D3D3D3",
                fontSize: 16,
                bold: true,
              },
              {
                text: "Normal Value",
                fillColor: "#D3D3D3",
                fontSize: 16,

                bold: true,
              },
            ],
            ...testResult?.testResult?.map((result) => [
              result?.test,
              result?.investigation,
              result?.normalValue,
            ]),
          ],
        },
        // layout: "lightHorizontalLines",
        margin: [0, 10, 0, 20],
      },

      testResult?.comment && {
        text: testResult.comment,
        style: "comment",
        margin: [0, 10, 0, 20],
      },
    ],
    footer: (currentPage: number, pageCount: number) => {
      return {
        columns: [
          {
            stack: sealContent, // Render parsed seal content here
          },
        ],
        margin: [40, 10, 40, 0],
      };
    },
    styles: {
      title: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],

        border: [true, true, true, true],
      },
      analyzerMachine: { fontSize: 14, italics: true },
      subHeader: { fontSize: 14, bold: true, margin: [0, 20, 0, 5] },
      tableContent: {
        fontSize: 10,
        margin: [0, 5], // Add margin between rows
      },

      heading: { fontSize: 12, bold: true, decoration: "underline" },
      tableHeader: { bold: true, fontSize: 12, color: "black" },
      boldText: { bold: true, fontSize: 11 },
      normalText: { fontSize: 11 },
      comment: { fontSize: 11, italics: true },
    },
  };

  // Generate PDF
  pdfMake.createPdf(docDefinition).print();
};
