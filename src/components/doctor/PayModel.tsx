import { usePostTransactionMutation } from "@/redux/api/transaction/transactionSlice";
import { ITransaction } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import { Button, Col, Form, Grid, InputPicker, Row, Schema } from "rsuite";
import swal from "sweetalert";

const PayModel = ({
  uuid,
  setPayModel,
}: {
  uuid: string;
  setPayModel: (payModel: boolean) => void;
}) => {
  const { StringType, NumberType } = Schema.Types;
  const formRef: React.MutableRefObject<any> = React.useRef();
  const model = Schema.Model({
    amount: NumberType().isRequired("This field is required."),
    description: StringType().isRequired("This field is required."),
    transactionType: StringType().isRequired("This field is required."),
    uuid: StringType().isRequired("This field is required."),
  });

  const [payData, setPayData] = useState<ITransaction>({
    amount: 0,
    description: "",
    transactionType: "",
    uuid: "",
  });
  const [postTransaction] = usePostTransactionMutation();

  const handleSubmit = async () => {
    if (formRef.current.check()) {
      if (payData !== undefined) {
        payData.amount = Number(payData.amount);

        const result = await postTransaction(payData);
        if ("data" in result) {
          const message = (result as { data: { message: string } })?.data
            .message;
          swal(`Done! ${message}!`, {
            icon: "success",
          });
          setPayModel(false);
        }
        if ("error" in result) {
          const errorMessage = (
            result as { error: { data: { message: string } } }
          )?.error.data.message;
          swal(errorMessage, {
            icon: "warning",
          });
        }
      }
    }
  };
  const transactionType = [
    {
      label: "Debit",
      value: "debit",
    },
    {
      label: "Credit",
      value: "credit",
    },
  ];

  return (
    <>
      <Form
        formDefaultValue={{ uuid }}
        onChange={(formValue, event) => {
          setPayData({
            amount: formValue.amount,
            description: formValue.description,
            transactionType: formValue.transactionType,
            uuid: formValue.uuid,
          });
        }}
        ref={formRef}
        model={model}
      >
        <Grid fluid>
          <Row>
            <Col sm={12} className="mt-5">
              <Form.Group controlId="amount">
                <Form.ControlLabel>Amount</Form.ControlLabel>
                <Form.Control type="number" name="amount" />
              </Form.Group>
            </Col>
            <Col sm={12} className="mt-5">
              <Form.Group controlId="description">
                <Form.ControlLabel>Description</Form.ControlLabel>
                <Form.Control name="description" />
              </Form.Group>
            </Col>
            <Col sm={12} className="mt-5">
              <Form.Group controlId="uuid">
                <Form.ControlLabel>Uuid</Form.ControlLabel>
                <Form.Control name="uuid" />
              </Form.Group>
            </Col>
            <Col sm={12} className="mt-5">
              <Form.Group controlId="transactionType">
                <Form.ControlLabel>transactionType</Form.ControlLabel>
                <Form.Control
                  accepter={InputPicker}
                  data={transactionType}
                  name="transactionType"
                />
              </Form.Group>
            </Col>
          </Row>
        </Grid>
        <div className="mt-5 ">
          <Button
            onClick={() => {
              setPayModel(false);
              setPayData({
                amount: 0,
                description: "",
                transactionType: "",
                uuid: "",
                ref: "",
              });
            }}
            appearance="subtle"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} appearance="primary" className="ml-5">
            Pay
          </Button>
        </div>
      </Form>
    </>
  );
};

export default PayModel;
