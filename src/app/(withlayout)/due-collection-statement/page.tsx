"use client";

import React, { useState } from "react";
import { DatePicker, Form } from "rsuite";
import { IFormValues } from "../income-statement/page";

import { useGetEmployeeLedgerQuery } from "@/redux/api/financialReport/financialReportSlice";
import EmployeeLedgerTable from "@/components/incomeStatement/EmployeeLedger";
import { formatDate } from "@/components/incomeStatement/incomeStatementUtils";
import { currentDefaultDate } from "@/utils/currentDefaultDate";
import { useGetOutdoorDueStatementQuery } from "@/redux/api/income-statement/Income.api";
import OutDueStatementTable from "@/components/incomeStatement/OutDoorDueStatement";

const DueCollectionStatementPage = () => {
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
  if (formValue.startDate) query.startDate = formatDate(formValue.startDate);
  if (formValue.endDate) query.endDate = formatDate(formValue.endDate);

  // Call the query when search is enabled
  const { data } = useGetOutdoorDueStatementQuery(query);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Due Collection Statement
          </h2>
        </div>
        <div className="mx-2">
          <Form
            onChange={handleChange}
            // onSubmit={handleSubmit}
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

          {data && data?.data && (
            <OutDueStatementTable
              data={data?.data}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DueCollectionStatementPage;
