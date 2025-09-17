"use client";

import React, { FormEvent, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { IFormValues } from "../income-statement/page";
import { useGetEmployeeIncomeStatementQuery } from "@/redux/api/income-statement/Income.api";
import EmployeeIncomeShowTable from "@/components/incomeStatement/EmployeeIncomeTable";
import { formatDate } from "@/components/incomeStatement/incomeStatementUtils";
import { currentDefaultDate } from "@/utils/currentDefaultDate";

const EmployeeIncmeStatementPage = () => {
  const query: Record<string, any> = {};

  const [formValue, setFormValue] = useState<IFormValues>(currentDefaultDate);

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  if (formValue.startDate) query.startDate = formatDate(formValue.startDate);
  if (formValue.endDate) query.endDate = formatDate(formValue.endDate);

  const { data: employeeIncome } = useGetEmployeeIncomeStatementQuery(query);

  // console.log(employeeIncome, "income res");

  // Handle form submission

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Employee Income Statement
          </h2>
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

          {employeeIncome && employeeIncome?.data?.length > 0 && (
            <EmployeeIncomeShowTable
              data={employeeIncome.data}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeIncmeStatementPage;
