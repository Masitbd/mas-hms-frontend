"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { formatDate, IFormValues } from "../income-statement/page";
import { useGetRefByWiseIncomeStatementQuery } from "@/redux/api/financialReport/financialReportSlice";
import RefDoctorTable, {
  TGroup,
} from "@/components/incomeStatement/RefDoctorTable";

const RefDoctorIncomePage = () => {
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [formValue, setFormValue] = useState<IFormValues>({
    startDate: null,
    endDate: null,
  });

  // Handle form value change
  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      startDate: value.startDate,
      endDate: value.endDate || null,
    });
  };

  // Query object
  const query: { from?: Date; to?: Date } = {};
  if (formValue.startDate) query.from = formValue.startDate;
  if (formValue.endDate) query.to = formValue.endDate;

  // Call the query when search is enabled
  const { data: refIncomes } = useGetRefByWiseIncomeStatementQuery(
    query, // Pass the constructed query object
    {
      skip: !isSearchEnable, // Only run the query when search is enabled
    }
  );

  const [transformedData, setTransformedData] = useState<TGroup | null>(null);

  console.log("result", transformedData);

  // Handle form submission
  const handleSubmit = async (
    formValue: Record<string, any> | null,
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    if (formValue) {
      // Format the dates
      const formattedStartDate = formatDate(formValue.startDate);
      const formattedEndDate = formatDate(formValue.endDate);

      setIsSearchEnable(true);
    }
  };

  // Create a map from names to mainDocs
  // useEffect(() => {
  //   if (refIncomes?.data?.length > 0) {
  //     const firstItem = refIncomes.data[0];
  //     const { mainDocs = [], nameWiseTotalDocs = [] } = firstItem;

  //     // Create a map from refBy (title + name) to an array of mainDocs entries
  //     const refByToMainDocsMap = new Map();
  //     mainDocs.forEach((doc: any) => {
  //       const { title, name } = doc.refBy;
  //       const refByKey = `${title} ${name}`; // Combine title and name as the key

  //       if (!refByToMainDocsMap.has(refByKey)) {
  //         refByToMainDocsMap.set(refByKey, []);
  //       }

  //       refByToMainDocsMap.get(refByKey).push(doc); // Add document to the correct refBy
  //     });

  //     // Create the new array
  //     const result: any = Array.from(
  //       refByToMainDocsMap,
  //       ([refBy, records]) => ({
  //         refBy, // e.g., "Dr. Mohammad Abul Hossain"
  //         records, // All documents associated with this refBy
  //       })
  //     );

  //     // Set the transformed data in the state
  //     setTransformedData(result);
  //   }
  // }, [refIncomes]);

  useEffect(() => {
    if (refIncomes?.data?.length > 0) {
      const firstItem = refIncomes.data[0];
      const {
        mainDocs = [],
        refByWiseTotalDocs = [],
        grandTotalDocs = [],
      } = firstItem;

      // Create a map from refBy (title + name) to an array of mainDocs entries
      const refByToMainDocsMap = new Map();
      mainDocs.forEach((doc: any) => {
        const { title, name } = doc.refBy;
        const refByKey = `${title} ${name}`; // Combine title and name as the key

        if (!refByToMainDocsMap.has(refByKey)) {
          refByToMainDocsMap.set(refByKey, []);
        }

        refByToMainDocsMap.get(refByKey).push(doc); // Add document to the correct refBy
      });

      // Create the new array for refByWiseTotalDocs
      const refByWiseDocs = refByWiseTotalDocs.map((item: any) => ({
        refBy: `${item.refBy.title} ${item.refBy.name}`,
        totalPrice: item.totalPrice,
        totalDiscount: item.totalDiscount,
        quantity: item.quantity,
        records:
          refByToMainDocsMap.get(`${item.refBy.title} ${item.refBy.name}`) ||
          [],
      }));

      // Merge refByWiseTotalDocs with grandTotalDocs
      const transformedData = {
        refByWiseDocs, // Grouped docs by refBy
        grandTotalDocs: grandTotalDocs.length ? grandTotalDocs[0] : {}, // Grand total summary
      };

      // Set the transformed data in the state
      setTransformedData(transformedData);
    }
  }, [refIncomes]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Ref Doctor Wise Income Statement
          </h2>
        </div>
        <div className="mx-2">
          <Form
            onChange={handleChange}
            onSubmit={handleSubmit}
            formValue={formValue}
            className="grid grid-cols-3 gap-10 justify-center  w-full"
          >
            <Form.Group controlId="startDate">
              <Form.ControlLabel>Start Date</Form.ControlLabel>
              <DatePicker
                oneTap
                name="startDate"
                format="yyyy-MM-dd"
                value={formValue.startDate}
                onChange={(date: Date | null) =>
                  setFormValue((prev) => ({ ...prev, startDate: date }))
                }
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.ControlLabel>End Date</Form.ControlLabel>
              <DatePicker
                oneTap
                name="endDate"
                format="yyyy-MM-dd"
                value={formValue.endDate}
                onChange={(date: Date | null) =>
                  setFormValue((prev) => ({ ...prev, endDate: date }))
                }
              />
            </Form.Group>

            <Button
              className="max-h-11 mt-5"
              size="sm"
              appearance="primary"
              type="submit"
            >
              Search
            </Button>
          </Form>

          {transformedData && (
            <RefDoctorTable
              data={transformedData}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RefDoctorIncomePage;
