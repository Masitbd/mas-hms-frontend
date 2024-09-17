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
    <div>
      <h1 className="text-2xl font-bold text-center my-10">
        Investigation Due Bills
      </h1>
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
  );
};

export default DueBillspage;
