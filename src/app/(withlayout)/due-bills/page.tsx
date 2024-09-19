"use client";
import DueStatemnetTable from "@/components/incomeStatement/DueStatementTable";
import { useGetDueDetailsQuery } from "@/redux/api/income-statement/Income.api";
import { useState } from "react";
import { Button, Form, Input, Message } from "rsuite";

const DueBillspage = () => {
  const [oid, setOid] = useState<{ oid: string }>({ oid: "" }); // State

  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const query: Record<string, any> = {};

  if (oid.oid) query.oid = oid.oid;
  const {
    data: dueData,
    isLoading,
    isSuccess,
  } = useGetDueDetailsQuery(query, {
    skip: !isSearchEnable,
  });

  const handleFormChange = (formValue: Record<string, any>) => {
    setIsSearchEnable(false);
    if (formValue.oid.length == 11) {
      setOid({ oid: formValue.oid });
    }
  };

  const handleSubmit = () => {
    setIsSearchEnable(true);
  };

  if (isSuccess) {
    <Message> Due Bill retrived successfully </Message>;
  }

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
              className="flex  items-center gap-5 justify-center"
              onSubmit={handleSubmit}
              onChange={handleFormChange}
            >
              <Form.Group controlId="oid">
                <Form.ControlLabel>Patient OID</Form.ControlLabel>
                <Form.Control
                  autoCapitalize="true"
                  defaultValue="HMS-"
                  name="oid"
                />
              </Form.Group>

              <Button
                className="max-h-11 "
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
