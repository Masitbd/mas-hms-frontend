"use client";
import TestForm from "@/components/Test/TestForm";
import TestTable from "@/components/Test/TestTable";
import RModal from "@/components/ui/Modal";
import {
  useGetTestQuery,
  useGetTestsQuery,
  usePatchTestMutation,
  usePostTestMutation,
} from "@/redux/api/test/testSlice";
import React, { useRef, useState } from "react";
import { Button } from "rsuite";

const Test = () => {
  const [defaultValue, setDefaultValue] = useState();
  const [formData, setfromData] = useState(defaultValue);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [
    postTest,
    { isLoading: testLoading, isSuccess: testSuccess, isError: testErrors },
  ] = usePostTestMutation();
  const { data: testData, isLoading: testDataLoading } =
    useGetTestsQuery(undefined);
  const [patchTest, {}] = usePatchTestMutation();
  const ref = useRef();
  // For new test
  const okHandler = () => {
    setModalOpen(!modalOpen);
    formData.value = formData.label.toLowerCase();
    formData.description = "aomeifjeijiji";
    formData.price = Number(formData.price);
    formData.isGroupTest = false;
    formData.vatRate = Number(formData.vatRate);
    formData.processTime = Number(formData.processTime);
    if (formData.groupTests) {
      formData.groupTests = formData.groupTests.map((data) => data._id);
      formData.resultFields = [];
    }
    if (mode === "new") {
      postTest(formData);
    }
    if (mode === "patch") {
      patchTest({ data: formData, id: formData._id });
    }
  };
  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setfromData(undefined);
    setDefaultValue(undefined);
  };
  const modalHandler = () => {
    setModalOpen(!modalOpen);
    setMode("new");
  };
  // For patch

  const patchHandler = (data) => {
    setModalOpen(!modalOpen);
    setMode("patch");
    setDefaultValue(data);
  };

  return (
    <div>
      <div>
        <RModal
          cancelHandler={cancelHandler}
          okHandler={okHandler}
          open={modalOpen}
          size="lg"
          title={mode === "new" ? "Add New Test" : "Edit Test Fields"}
        >
          <TestForm
            defaultValue={defaultValue}
            formData={formData}
            setfromData={setfromData}
            forwardedRef={ref}
          ></TestForm>
        </RModal>
      </div>
      <div className="my-5">
        <Button
          onClick={() => modalHandler()}
          appearance="primary"
          color="blue"
        >
          Add New Test
        </Button>
      </div>
      <div className="mx-5">
        <TestTable patchHandler={patchHandler} />
      </div>
    </div>
  );
};

export default Test;
