"use client";
import DueStatemnetTable from "@/components/incomeStatement/DueStatementTable";
import { useGetDueDetailsQuery } from "@/redux/api/income-statement/Income.api";
import { useState } from "react";
import { Button, DatePicker, Form, Input, InputPicker, Message } from "rsuite";

import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import { formatDate } from "@/components/incomeStatement/incomeStatementUtils";

interface IFormValues {
  startDate: Date | null;
  endDate: Date | null;
  refBy?: string;
  oid?: string;
}

const DueBillspage = () => {
  const { data: doctorData } = useGetDoctorQuery(undefined); // Fetch doctor data
  const [isSearchEnable, setIsSearchEnable] = useState(false); // State for enabling search
  const [formValue, setFormValue] = useState<IFormValues>({
    startDate: null,
    endDate: null,
    refBy: "",
    oid: "",
  });

  // Handle form value change

  // Query object
  const query = {
    ...(formValue.startDate && { startDate: formatDate(formValue.startDate) }),
    ...(formValue.endDate && { endDate: formatDate(formValue.endDate) }),
    ...(formValue.refBy && { refBy: formValue.refBy }),
    ...(formValue.oid && { oid: formValue.oid }),
  };

  const {
    data: dueData,
    isLoading,
    isSuccess,
  } = useGetDueDetailsQuery(query, {
    skip: !isSearchEnable,
  });

  // console.log("due data", dueData);
  // Handle form field changes
  const handleFormChange = (updatedValue: Record<string, any>) => {
    setIsSearchEnable(false); // Disable search while changing form
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  // Handle form submit
  const handleSubmit = () => {
    setIsSearchEnable(true);
  };

  // // Success message after data retrieval
  // if (isSuccess) {
  //   return <Message>Due Bill retrieved successfully</Message>;
  // }

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Due Bills Details
          </h2>
        </div>
        <div className="mx-2">
          {/*  form for input oid */}
          <div className="my-5">
            <Form
              autoCapitalize="true"
              className="grid grid-cols-2  justify-items-center gap-5 justify-center"
              onSubmit={handleSubmit}
              onChange={handleFormChange}
            >
              {/* Start Date */}

              <div>
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
              </div>
              {/* End Date */}
              <div>
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
              </div>
              <div>
                {/* Referred By (Doctor) */}
                <Form.Group controlId="ref_by">
                  <Form.ControlLabel>Referred By</Form.ControlLabel>
                  <Form.Control
                    name="ref_by"
                    accepter={InputPicker}
                    data={doctorData?.data.map((data: IDoctor) => {
                      return { label: data.name, value: data._id };
                    })}
                    onChange={(value: string) =>
                      setFormValue((prev) => ({ ...prev, refBy: value }))
                    }
                    // className="w-28"
                  />
                </Form.Group>
              </div>
              <div>
                {/* Patient OID */}
                <Form.Group controlId="oid">
                  <Form.ControlLabel>Patient OID</Form.ControlLabel>
                  <Form.Control
                    autoCapitalize="true"
                    defaultValue="HMS-"
                    name="oid"
                  />
                </Form.Group>
              </div>

              <Button
                className="max-h-11  w-full col-span-2"
                size="sm"
                appearance="primary"
                type="submit"
              >
                Search
              </Button>
            </Form>
          </div>

          {dueData && dueData?.data?.length > 0 && (
            <DueStatemnetTable data={dueData.data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DueBillspage;
