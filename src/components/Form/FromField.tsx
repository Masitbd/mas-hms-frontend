"use client";
import React from "react";
import { Form as ResuiteFrom } from "rsuite";

const FormField = ({
  name,
  placeholder,
  type,
  label,
}: {
  name: string;
  placeholder: string;
  type: string;
  label: string;
}) => {
  return (
    <ResuiteFrom.Group controlId={name}>
      <ResuiteFrom.ControlLabel>{label}</ResuiteFrom.ControlLabel>
      <ResuiteFrom.Control name={name} placeholder={placeholder} type={type} />
    </ResuiteFrom.Group>
  );
};

export default FormField;
