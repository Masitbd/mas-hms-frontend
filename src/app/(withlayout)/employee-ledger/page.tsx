"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { formatDate, IFormValues } from "../income-statement/page";

import { useGetEmployeeLedgerQuery } from "@/redux/api/financialReport/financialReportSlice";
import EmployeeLedgerTable from "@/components/incomeStatement/EmployeeLedger";

const EmployeeLedgerPage = () => {
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
  const { data: employeeLdgers } = useGetEmployeeLedgerQuery(
    query, // Pass the constructed query object
    {
      skip: !isSearchEnable, // Only run the query when search is enabled
    }
  );

  // console.log("data", employeeLdgers);

  const [transformedData, setTransformedData] = useState([]);

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
  useEffect(() => {
    if (employeeLdgers?.data) {
      const { dewBills = [], newBills = [] } = employeeLdgers?.data;

      const userMap = new Map();

      dewBills.forEach((dewBill: any) => {
        const user = dewBill.user || "Unknown"; // Handle missing user case
        if (!userMap.has(user)) {
          userMap.set(user, { dewBills: [], newBills: [] });
        }
        userMap.get(user).dewBills.push(dewBill);
      });

      newBills.forEach((newBill: any) => {
        const user = newBill.user || "Unknown"; // Handle missing user case
        if (!userMap.has(user)) {
          userMap.set(user, { dewBills: [], newBills: [] });
        }
        userMap.get(user).newBills.push(newBill);
      });

      const groupedData: any = Array.from(userMap, ([user, bills]) => ({
        user,
        ...bills,
      }));

      setTransformedData(groupedData);
    }
  }, [employeeLdgers]);

  return (
    <div className="mt-10">
      <h1 className="text-center pb-10 text-xl font-bold">
        Employee Ledger Summery
      </h1>
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

      {employeeLdgers && employeeLdgers?.data && (
        <EmployeeLedgerTable
          data={transformedData}
          startDate={formValue.startDate}
          endDate={formValue.endDate}
        />
      )}
    </div>
  );
};

export default EmployeeLedgerPage;
