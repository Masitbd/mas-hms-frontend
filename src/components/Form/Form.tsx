"use client";
import { useAppDispatch } from "@/redux/hook";
import React, { useRef } from "react";
import { Table, Pagination, Button, Modal, Form as ResuiteFrom } from "rsuite";

const FormR = ({ model, reducer, submitFunction, children }) => {
  const formRef = useRef();

  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      submitFunction();
    } else {
    }
  };
  const handleButtonClick = () => {
    console.log("object");
    if (children.props.onClick) {
      children.props.onClick();
      handleSubmit();
    }
  };
  const childrenWithProps = React.cloneElement(children, {
    onClick: handleButtonClick,
  });
  return (
    <ResuiteFrom
      onChange={() => dispatch(reducer())}
      ref={formRef}
      model={model}
    >
      {childrenWithProps}
    </ResuiteFrom>
  );
};

export default FormR;
