"use client";
import React, { useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Form } from "rsuite";
import { useUpdateDuePaymentMutation } from "@/redux/api/payment.api";
import Swal from "sweetalert2";
import { useAppSelector } from "@/redux/hook";
type TDueCollection = {
  data: {
    dueAmount?: number;
    regNo: string;
    totalAmount: number;
    paymentInfo?: {
      totalPaid: number;
    };
  };
};

const DueCollectionModal: React.FC<TDueCollection> = ({ data }) => {
  const [updatePayment, { isLoading }] = useUpdateDuePaymentMutation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const dueAmount =
    data?.dueAmount ??
    (data?.totalAmount ?? 0) - (data?.paymentInfo?.totalPaid ?? 0);
  const [formValue, setFormValue] = useState({ amount: dueAmount });
  const handleFormChange = (updatedValue: Record<string, any>) => {
    setFormValue((prev) => ({ ...prev, ...updatedValue }));
  };

  const handleSubmit = async () => {
    const { amount } = formValue;

    try {
      const payload = {
        regno: data?.regNo,
        data: {
          amount: Number(amount),
          purpose: "due-collection",
          receivedBy: currentUser?._id,
        },
      };

      const res = await updatePayment(payload).unwrap();

      if (res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Added successfully",
          icon: "success",
        });
        setOpen(false);
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <CustomModal
        disabled={dueAmount == 0}
        open={open}
        setOpen={setOpen}
        text="Collect Due"
        title="Due Collection"
      >
        <div className="grid grid-cols-2 gap-5 border rounded p-5">
          <p>
            <span className="font-bold me-2">RegNo:</span>
            {data?.regNo}
          </p>
          <p>
            <span className="font-bold me-2">Total Amount:</span>
            {data?.totalAmount}
          </p>
          <p>
            <span className="font-bold me-2">Due Amount:</span>
            <span className="text-red-500">{dueAmount}</span>
          </p>

          <Form
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            formValue={formValue}
            className=" w-full  grid-cols-3"
          >
            <Form.Group controlId="bedName">
              <Form.ControlLabel>Pay Now</Form.ControlLabel>
              <Form.Control type="number" name="amount" />
            </Form.Group>
            <Button
              className="max-h-11 mt-5 w-full"
              size="sm"
              appearance="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </div>
      </CustomModal>
    </div>
  );
};

export default DueCollectionModal;
