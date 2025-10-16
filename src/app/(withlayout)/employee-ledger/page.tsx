"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { IFormValues } from "../income-statement/page";

import { useGetEmployeeLedgerQuery } from "@/redux/api/financialReport/financialReportSlice";
import EmployeeLedgerTable from "@/components/incomeStatement/EmployeeLedger";
import { formatDate } from "@/components/incomeStatement/incomeStatementUtils";
import { currentDefaultDate } from "@/utils/currentDefaultDate";

const EmployeeLedgerPage = () => {
  const [formValue, setFormValue] = useState<IFormValues>(currentDefaultDate);

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
  const { data: employeeLdgers } = useGetEmployeeLedgerQuery(
    query // Pass the constructed query object
  );

  // console.log("data", employeeLdgers);

  const [transformedData, setTransformedData] = useState([]);

  // Handle form submission

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
      })).sort();

      setTransformedData(groupedData);
    }
  }, [employeeLdgers]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Employee ledger</h2>
        </div>
        <div className="mx-2">
          <Form
            onChange={handleChange}
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
          </Form>

          {employeeLdgers && employeeLdgers?.data && (
            <EmployeeLedgerTable
              data={transformedData}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
              rawData={employeeLdgers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLedgerPage;
