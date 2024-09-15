"use client";

import IncomeShowTable from "@/components/incomeStatement/IncomeShowTable";
import { useGetIncomeStatementMutation } from "@/redux/api/income-statement/Income.api";
import React, { FormEvent, useState } from "react";
import { Button, DatePicker, Form, Message, toaster } from "rsuite";

export interface IFormValues {
  startDate: Date | null;
  endDate: Date | null;
}

// function to format date as yyyy-MM-dd
export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const IncomeStatementPage = () => {
  const [getIncome, { data, isLoading }] = useGetIncomeStatementMutation();

  console.log("data", data);

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

  // Handle form submission
  const handleSubmit = async (
    formValue: Record<string, any> | null,
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    if (formValue) {
      // Format the dates
      const formattedStartDate = formatDate(formValue.startDate);
      const formattedEndDate = formatDate(formValue.endDate);

      const queryDate = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const res = await getIncome(queryDate).unwrap();
      if (res.success) {
        toaster.push(
          <Message type="success">Income Ledger Get successfully</Message>
        );
      }
    }
  };

  return (
    <div className="mt-10">
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

      {data && data?.data?.length > 0 && (
        <IncomeShowTable
          data={data.data}
          startDate={formValue.startDate}
          endDate={formValue.endDate}
        />
      )}
    </div>
  );
};

export default IncomeStatementPage;
