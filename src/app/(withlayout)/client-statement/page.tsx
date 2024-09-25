"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { formatDate, IFormValues } from "../income-statement/page";

import { useGetClientWiseIncomeStatementQuery } from "@/redux/api/financialReport/financialReportSlice";
import ClientIncomeTable from "@/components/incomeStatement/ClientIncomeTable";

const ClientWiseIncomeStatement = () => {
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
  const query: Record<string, any> = {};
  if (formValue.startDate) query.from = formatDate(formValue.startDate);
  if (formValue.endDate) query.to = formatDate(formValue.endDate);

  // Call the query when search is enabled
  const { data: clientIncomes } = useGetClientWiseIncomeStatementQuery(
    query, // Pass the constructed query object
    {
      skip: !isSearchEnable, // Only run the query when search is enabled
    }
  );

  const [transformedData, setTransformedData] = useState([]);

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
  useEffect(() => {
    if (clientIncomes?.data?.length > 0) {
      const firstItem = clientIncomes.data[0];
      const { mainDocs = [], nameWiseTotalDocs = [] } = firstItem;

      // Create a map from names to an array of mainDocs entries
      const nameToMainDocsMap = new Map();
      mainDocs.forEach((doc: any) => {
        const name = doc.patient.name;
        if (!nameToMainDocsMap.has(name)) {
          nameToMainDocsMap.set(name, []);
        }
        nameToMainDocsMap.get(name).push(doc);
      });

      // Create the new array
      const result = nameWiseTotalDocs.map((nameDoc: any) => ({
        name: nameDoc._id,
        records: nameToMainDocsMap.get(nameDoc._id) || [],
      }));

      // Set the transformed data in the state
      setTransformedData(result);
    }
  }, [clientIncomes]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Client Wise Income Statement
          </h2>
        </div>
        <div className="mx-2">
          <Form
            onChange={handleChange}
            onSubmit={handleSubmit}
            formValue={formValue}
            className="grid grid-cols-3 gap-10 justify-center  w-full"
          >
           

            <Button
              className="max-h-11 mt-5"
              size="sm"
              appearance="primary"
              type="submit"
            >
              Search
            </Button>
          </Form>

          {clientIncomes && clientIncomes?.data?.length > 0 && (
            <ClientIncomeTable
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

export default ClientWiseIncomeStatement;
