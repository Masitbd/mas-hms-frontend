"use client";

import React, { FormEvent, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";
import { formatDate, IFormValues } from "../income-statement/page";

import EmployeeIncomeShowTable from "@/components/incomeStatement/EmployeeIncomeTable";
import { useGetEmployeeIncomeStatementSummeryQuery } from "@/redux/api/income-statement/Income.api";
import EmployeeIncomeSummeryTable from "@/components/incomeStatement/EmployeeIncomeSummeryTable";

const EmpIncomeSummeryPage = () => {
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const query: Record<string, any> = {};

  const [formValue, setFormValue] = useState<IFormValues>({
    startDate: null,
    endDate: null,
  });

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  if (formValue.startDate) query.startDate = formValue.startDate;
  if (formValue.endDate) query.endDate = formValue.endDate;

  const { data: employeeIncome } = useGetEmployeeIncomeStatementSummeryQuery(
    query,
    {
      skip: !isSearchEnable,
    }
  );

  // console.log(employeeIncome, "income res");

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

  return (
    <div className="mt-10">
      <h1 className="text-center pb-10 text-xl font-bold">
        Employee Income Statement Summery
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

      {employeeIncome && employeeIncome?.data?.length > 0 && (
        <EmployeeIncomeSummeryTable
          data={employeeIncome.data}
          startDate={formValue.startDate}
          endDate={formValue.endDate}
        />
      )}
    </div>
  );
};

export default EmpIncomeSummeryPage;
