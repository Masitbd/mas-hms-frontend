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
         <div class="print-button">
          <button >
          <svg version="1.1" width="100%" height="100%" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 114.13" style="enable-background:new 0 0 122.88 114.13" xml:space="preserve"><g><path d="M23.2,29.44V3.35V0.53C23.2,0.24,23.44,0,23.73,0h2.82h54.99c0.09,0,0.17,0.02,0.24,0.06l1.93,0.8l-0.2,0.49l0.2-0.49 c0.08,0.03,0.14,0.08,0.2,0.14l12.93,12.76l0.84,0.83l-0.37,0.38l0.37-0.38c0.1,0.1,0.16,0.24,0.16,0.38v1.18v13.31 c0,0.29-0.24,0.53-0.53,0.53h-5.61c-0.29,0-0.53-0.24-0.53-0.53v-6.88H79.12H76.3c-0.29,0-0.53-0.24-0.53-0.53 c0-0.02,0-0.03,0-0.05v-2.77h0V6.69H29.89v22.75c0,0.29-0.24,0.53-0.53,0.53h-5.64C23.44,29.97,23.2,29.73,23.2,29.44L23.2,29.44z M30.96,67.85h60.97h0c0.04,0,0.08,0,0.12,0.01c0.83,0.02,1.63,0.19,2.36,0.49c0.79,0.33,1.51,0.81,2.11,1.41 c0.59,0.59,1.07,1.31,1.4,2.1c0.3,0.73,0.47,1.52,0.49,2.35c0.01,0.04,0.01,0.08,0.01,0.12v0v9.24h13.16h0c0.04,0,0.07,0,0.11,0.01 c0.57-0.01,1.13-0.14,1.64-0.35c0.57-0.24,1.08-0.59,1.51-1.02c0.43-0.43,0.78-0.94,1.02-1.51c0.21-0.51,0.34-1.07,0.35-1.65 c-0.01-0.03-0.01-0.07-0.01-0.1v0V43.55v0c0-0.04,0-0.07,0.01-0.11c-0.01-0.57-0.14-1.13-0.35-1.64c-0.24-0.56-0.59-1.08-1.02-1.51 c-0.43-0.43-0.94-0.78-1.51-1.02c-0.51-0.22-1.07-0.34-1.65-0.35c-0.03,0.01-0.07,0.01-0.1,0.01h0H11.31h0 c-0.04,0-0.08,0-0.11-0.01c-0.57,0.01-1.13,0.14-1.64,0.35C9,39.51,8.48,39.86,8.05,40.29c-0.43,0.43-0.78,0.94-1.02,1.51 c-0.21,0.51-0.34,1.07-0.35,1.65c0.01,0.03,0.01,0.07,0.01,0.1v0v35.41v0c0,0.04,0,0.08-0.01,0.11c0.01,0.57,0.14,1.13,0.35,1.64 c0.24,0.57,0.59,1.08,1.02,1.51C8.48,82.65,9,83,9.56,83.24c0.51,0.22,1.07,0.34,1.65,0.35c0.03-0.01,0.07-0.01,0.1-0.01h0h13.16 v-9.24v0c0-0.04,0-0.08,0.01-0.12c0.02-0.83,0.19-1.63,0.49-2.35c0.31-0.76,0.77-1.45,1.33-2.03c0.02-0.03,0.04-0.06,0.07-0.08 c0.59-0.59,1.31-1.07,2.1-1.4c0.73-0.3,1.52-0.47,2.36-0.49C30.87,67.85,30.91,67.85,30.96,67.85L30.96,67.85L30.96,67.85z M98.41,90.27v17.37v0c0,0.04,0,0.08-0.01,0.12c-0.02,0.83-0.19,1.63-0.49,2.36c-0.33,0.79-0.81,1.51-1.41,2.11 c-0.59,0.59-1.31,1.07-2.1,1.4c-0.73,0.3-1.52,0.47-2.35,0.49c-0.04,0.01-0.08,0.01-0.12,0.01h0H30.96h0 c-0.04,0-0.08-0.01-0.12-0.01c-0.83-0.02-1.62-0.19-2.35-0.49c-0.79-0.33-1.5-0.81-2.1-1.4c-0.6-0.6-1.08-1.31-1.41-2.11 c-0.3-0.73-0.47-1.52-0.49-2.35c-0.01-0.04-0.01-0.08-0.01-0.12v0V90.27H11.31h0c-0.04,0-0.08,0-0.12-0.01 c-1.49-0.02-2.91-0.32-4.2-0.85c-1.39-0.57-2.63-1.41-3.67-2.45c-1.04-1.04-1.88-2.28-2.45-3.67c-0.54-1.3-0.84-2.71-0.85-4.2 C0,79.04,0,79,0,78.96v0V43.55v0c0-0.04,0-0.08,0.01-0.12c0.02-1.49,0.32-2.9,0.85-4.2c0.57-1.39,1.41-2.63,2.45-3.67 c1.04-1.04,2.28-1.88,3.67-2.45c1.3-0.54,2.71-0.84,4.2-0.85c0.04-0.01,0.08-0.01,0.12-0.01h0h100.25h0c0.04,0,0.08,0,0.12,0.01 c1.49,0.02,2.91,0.32,4.2,0.85c1.39,0.57,2.63,1.41,3.67,2.45c1.04,1.04,1.88,2.28,2.45,3.67c0.54,1.3,0.84,2.71,0.85,4.2 c0.01,0.04,0.01,0.08,0.01,0.12v0v35.41v0c0,0.04,0,0.08-0.01,0.12c-0.02,1.49-0.32,2.9-0.85,4.2c-0.57,1.39-1.41,2.63-2.45,3.67 c-1.04,1.04-2.28,1.88-3.67,2.45c-1.3,0.54-2.71,0.84-4.2,0.85c-0.04,0.01-0.08,0.01-0.12,0.01h0H98.41L98.41,90.27z M89.47,15.86 l-7-6.91v6.91H89.47L89.47,15.86z M91.72,74.54H31.16v32.89h60.56V74.54L91.72,74.54z"/></g></svg>
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
         <div class="print-button">
          <button >
          <svg version="1.1" width="100%" height="100%" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 114.13" style="enable-background:new 0 0 122.88 114.13" xml:space="preserve"><g><path d="M23.2,29.44V3.35V0.53C23.2,0.24,23.44,0,23.73,0h2.82h54.99c0.09,0,0.17,0.02,0.24,0.06l1.93,0.8l-0.2,0.49l0.2-0.49 c0.08,0.03,0.14,0.08,0.2,0.14l12.93,12.76l0.84,0.83l-0.37,0.38l0.37-0.38c0.1,0.1,0.16,0.24,0.16,0.38v1.18v13.31 c0,0.29-0.24,0.53-0.53,0.53h-5.61c-0.29,0-0.53-0.24-0.53-0.53v-6.88H79.12H76.3c-0.29,0-0.53-0.24-0.53-0.53 c0-0.02,0-0.03,0-0.05v-2.77h0V6.69H29.89v22.75c0,0.29-0.24,0.53-0.53,0.53h-5.64C23.44,29.97,23.2,29.73,23.2,29.44L23.2,29.44z M30.96,67.85h60.97h0c0.04,0,0.08,0,0.12,0.01c0.83,0.02,1.63,0.19,2.36,0.49c0.79,0.33,1.51,0.81,2.11,1.41 c0.59,0.59,1.07,1.31,1.4,2.1c0.3,0.73,0.47,1.52,0.49,2.35c0.01,0.04,0.01,0.08,0.01,0.12v0v9.24h13.16h0c0.04,0,0.07,0,0.11,0.01 c0.57-0.01,1.13-0.14,1.64-0.35c0.57-0.24,1.08-0.59,1.51-1.02c0.43-0.43,0.78-0.94,1.02-1.51c0.21-0.51,0.34-1.07,0.35-1.65 c-0.01-0.03-0.01-0.07-0.01-0.1v0V43.55v0c0-0.04,0-0.07,0.01-0.11c-0.01-0.57-0.14-1.13-0.35-1.64c-0.24-0.56-0.59-1.08-1.02-1.51 c-0.43-0.43-0.94-0.78-1.51-1.02c-0.51-0.22-1.07-0.34-1.65-0.35c-0.03,0.01-0.07,0.01-0.1,0.01h0H11.31h0 c-0.04,0-0.08,0-0.11-0.01c-0.57,0.01-1.13,0.14-1.64,0.35C9,39.51,8.48,39.86,8.05,40.29c-0.43,0.43-0.78,0.94-1.02,1.51 c-0.21,0.51-0.34,1.07-0.35,1.65c0.01,0.03,0.01,0.07,0.01,0.1v0v35.41v0c0,0.04,0,0.08-0.01,0.11c0.01,0.57,0.14,1.13,0.35,1.64 c0.24,0.57,0.59,1.08,1.02,1.51C8.48,82.65,9,83,9.56,83.24c0.51,0.22,1.07,0.34,1.65,0.35c0.03-0.01,0.07-0.01,0.1-0.01h0h13.16 v-9.24v0c0-0.04,0-0.08,0.01-0.12c0.02-0.83,0.19-1.63,0.49-2.35c0.31-0.76,0.77-1.45,1.33-2.03c0.02-0.03,0.04-0.06,0.07-0.08 c0.59-0.59,1.31-1.07,2.1-1.4c0.73-0.3,1.52-0.47,2.36-0.49C30.87,67.85,30.91,67.85,30.96,67.85L30.96,67.85L30.96,67.85z M98.41,90.27v17.37v0c0,0.04,0,0.08-0.01,0.12c-0.02,0.83-0.19,1.63-0.49,2.36c-0.33,0.79-0.81,1.51-1.41,2.11 c-0.59,0.59-1.31,1.07-2.1,1.4c-0.73,0.3-1.52,0.47-2.35,0.49c-0.04,0.01-0.08,0.01-0.12,0.01h0H30.96h0 c-0.04,0-0.08-0.01-0.12-0.01c-0.83-0.02-1.62-0.19-2.35-0.49c-0.79-0.33-1.5-0.81-2.1-1.4c-0.6-0.6-1.08-1.31-1.41-2.11 c-0.3-0.73-0.47-1.52-0.49-2.35c-0.01-0.04-0.01-0.08-0.01-0.12v0V90.27H11.31h0c-0.04,0-0.08,0-0.12-0.01 c-1.49-0.02-2.91-0.32-4.2-0.85c-1.39-0.57-2.63-1.41-3.67-2.45c-1.04-1.04-1.88-2.28-2.45-3.67c-0.54-1.3-0.84-2.71-0.85-4.2 C0,79.04,0,79,0,78.96v0V43.55v0c0-0.04,0-0.08,0.01-0.12c0.02-1.49,0.32-2.9,0.85-4.2c0.57-1.39,1.41-2.63,2.45-3.67 c1.04-1.04,2.28-1.88,3.67-2.45c1.3-0.54,2.71-0.84,4.2-0.85c0.04-0.01,0.08-0.01,0.12-0.01h0h100.25h0c0.04,0,0.08,0,0.12,0.01 c1.49,0.02,2.91,0.32,4.2,0.85c1.39,0.57,2.63,1.41,3.67,2.45c1.04,1.04,1.88,2.28,2.45,3.67c0.54,1.3,0.84,2.71,0.85,4.2 c0.01,0.04,0.01,0.08,0.01,0.12v0v35.41v0c0,0.04,0,0.08-0.01,0.12c-0.02,1.49-0.32,2.9-0.85,4.2c-0.57,1.39-1.41,2.63-2.45,3.67 c-1.04,1.04-2.28,1.88-3.67,2.45c-1.3,0.54-2.71,0.84-4.2,0.85c-0.04,0.01-0.08,0.01-0.12,0.01h0H98.41L98.41,90.27z M89.47,15.86 l-7-6.91v6.91H89.47L89.47,15.86z M91.72,74.54H31.16v32.89h60.56V74.54L91.72,74.54z"/></g></svg>
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
