"use client";

import { useState } from "react";
import { IFormValues } from "../../income-statement/page";
import { formatDate } from "@/components/incomeStatement/incomeStatementUtils";
import { useGetIndoorIncomeLedgerQuery } from "@/redux/api/income-statement/Income.api";
import { Button, DatePicker, Form } from "rsuite";
import IndIncTable from "@/components/indoorFinancial/IndoorIncomeLedgerTable";
import { currentDefaultDate } from "@/utils/currentDefaultDate";

const IndoorIncomeLedgerPage = () => {
  const [formValue, setFormValue] = useState<IFormValues>(currentDefaultDate);

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  const formattedStartDate = formatDate(formValue.startDate);
  const formattedEndDate = formatDate(formValue.endDate);

  const queryDate: Record<string, any> = {
    // startDate: formattedStartDate,
    // endDate: formattedEndDate,
  };

  if (formValue.startDate) queryDate.startDate = formattedStartDate;
  if (formValue.endDate) queryDate.endDate = formattedEndDate;

  const { data, isLoading } = useGetIndoorIncomeLedgerQuery(queryDate);

  return (
    <div>
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Indoor Income Statement
          </h2>
        </div>
        <div className="px-2">
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
            <IndIncTable
              data={data.data}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndoorIncomeLedgerPage;
