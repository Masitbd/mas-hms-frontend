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
  const { oid, mode, reportGroup, order, tests, result, setResult } = params;
  // This array contains the result fields name which will now be shoun in the result
  const unnecesseryFields = [
    "investigation",
    "_id",
    "defaultValue",
    "unit",
    "description",
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
      fieldNames.push("result");
    }
  }

  // For edit
  else {
    modifiedTest = order.tests;
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
    }
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
