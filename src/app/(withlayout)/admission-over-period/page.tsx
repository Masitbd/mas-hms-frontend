"use client";

import { useGetAdmissionOverPeriodQuery } from "@/redux/api/admission.api";
import { useState } from "react";
import { Button, DatePicker, Form } from "rsuite";
import { IFormValues } from "../income-statement/page";
import AdmitOverPeriodTable from "@/components/Patient-Admission/AdmissionOverPeriodTable";

const overPeriodColumns = [
  { label: "Bill No", field: "regNo" },
  { label: "Bed Name", field: "bedName" },
  { label: "Name", field: "name" },
  {
    label: "Admission Date",
    field: "admissionDate",
    render: (row: any) =>
      row.admissionDate?.substring(2, 10),
  },
  {
    label: "Release Date",
    field: "releaseDate",
    render: (row: any) =>
      row.releaseDate ? row.releaseDate.substring(2, 10) : row.doctName,
  },
  { label: "Present Address", field: "presentAddress" },
];

const AdmissionOverPeriodPage = () => {
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

  const formattedStartDate = formValue.startDate?.toISOString();
  const formattedEndDate = formValue.endDate?.toISOString();

  const queryDate: Record<string, any> = {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };



  if (formValue.startDate) queryDate.startDate = formattedStartDate;
  if (formValue.endDate) queryDate.endDate = formattedEndDate;

  const { data } = useGetAdmissionOverPeriodQuery(queryDate);

 

  return (
    <div>
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Patient Admission Over Period
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
              {/* <DatePicker format="yyyy-MM-dd HH:mm:ss" editable={false} /> */}
              <DatePicker
                // oneTap
                name="startDate"
                format="yyyy-MM-dd HH:mm:ss"
                value={formValue.startDate}
                editable={false}
                onChange={(date: Date | null) =>
                  setFormValue((prev) => ({ ...prev, startDate: date }))
                }
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.ControlLabel>End Date</Form.ControlLabel>
              <DatePicker
                // oneTap
                name="endDate"
                format="yyyy-MM-dd HH:mm:ss"
                value={formValue.endDate}
                editable={false}
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
            <AdmitOverPeriodTable
              title="Patient Admission Over Period"
              data={data.data}
              columns={overPeriodColumns}
              startDate={formValue.startDate}
              endDate={formValue.endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionOverPeriodPage;
