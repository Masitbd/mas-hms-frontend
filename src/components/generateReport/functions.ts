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
import { ENUM_REPORT_TYPE } from "@/enum/ENUMReportType";

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
    "testId",
    "isHidden",
  ];
  let modifiedTest;
  let specimen: string[] = [];
  let fieldNames: string[] = [];
  let headings: string[] = [];
  let resultFields: IResultField[] = [];
  const user = useAppSelector((state) => state.auth.user);
  let returnResult: any =
    mode == ENUM_MODE.NEW
      ? {
          oid: oid,
          reportGroup: reportGroup,
          testResult: resultFields,
          comment: "",
          conductedBy: user.uuid,
        }
      : result;

  // setting the test id for descriptive and bacterial result

  if (
    (reportGroup?.testResultType == ENUM_REPORT_TYPE.DESCRIPTIVE ||
      reportGroup?.testResultType == ENUM_REPORT_TYPE.BACTERIAL) &&
    returnResult &&
    mode == ENUM_MODE.NEW
  ) {
    returnResult.test = tests[0].test?._id;
  }
  if (mode == ENUM_MODE.NEW) {
    modifiedTest = tests.map((test: ITestsFromOrder) => {
      if (test.test.resultFields.length > 0) {
        // Checking if the tests contains any result fields
        const cleanedResultFields = test.test.resultFields.map((rfData) => {
          let resultField = {
            testId: test?.test?._id,
            ...rfData,
          } as IResultField;

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
         <title>Diagnostic Report</title>
        <style>
        .ProseMirror {
  position: relative;
}

.ProseMirror {
 font-family: monospace !important;
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}
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

        
}


  #seals {
            position: fixed !important;}
       
    

    </style>
    
 <script>
    //  window.addEventListener("beforeprint",function() {
    //  const height = document.getElementById("seals").offsetHeight
    //  document.getElementById("seals").style.height = height + "px";
    //   document.getElementById("seals").style.marginTop = (-30 - height) + "px";
    //  ;

    //  window.addEventListener("afterprint", function () {
    //         const height = document.getElementById("seals").offsetHeight
    //         document.getElementById("seals").style.height = height + "px";
    //         document.getElementById("seals").style.marginTop =30 + "px";
           


    //     })
     

        
    //  })




     
    
   
   
    
  </script>
        </head>

            
      
        <body id="main-content">
          
        ${data}
         <div class="print-button print-btn" onclick="window.print()" >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M19 8h-14c-1.1 0-1.99.9-1.99 2l-.01 6c0 1.1.9 2 2 2h1v4h12v-4h1c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 8h-14v-6h14v6zm-3-15h-8v4h8v-4zm2 4h-12v-5h12v5z" />
    </svg>
    Print
          </button>
        </div>
       

    <script>
        // Function to hide loading screen and show main content once CSS is loaded
        // function cssLoaded() {
        //     document.getElementById('loading-screen').style.display = 'none';
        //     document.getElementById('main-content').style.display = 'block';
        //      window.print();
        // } 
  //           document.getElementsByClassName("print-button")[0].addEventListener("click", function(){
 
  //   window.print();
  // });
  </script
        
      </html>`;
};

export const htmlDocProviderForMicroBiology = (
  data: string,
  margin: number[]
) => {
  return `<!DOCTYPE html>
        <head>
         <title>Diagnostic Report</title>
        <style>
         .ProseMirror {
  position: relative;
}

.ProseMirror {
 font-family: monospace !important;
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}
     
      
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
            width:${((1020 - (margin[0] ?? 0) - (margin[2] ?? 0)) / 3.78)
              ?.toFixed(1)
              ?.toString()}mm !important;
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
