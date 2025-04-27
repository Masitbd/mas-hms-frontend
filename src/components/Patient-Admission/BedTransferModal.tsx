"use client";
import React, { useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Form, SelectPicker } from "rsuite";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useGetAllBedQuery } from "@/redux/api/bed.api";
import { useTransferAdmissionMutation } from "@/redux/api/admission.api";
import Swal from "sweetalert2";

type TFormValue = {
  worldId: string;
  allocatedBed: string;
};

type TWorld = {
  worldName: any;
  _id: string;
  world: {
    worldName: string;
  };
};

type TBed = {
  _id: string;
  bedName: string;
};

const BedTransferModal = ({
  id,
  dayStayed,
  totalAmount,
  previousBed,
  patientRegNo,
  firstAdmitDate,
  isReleased,
}: {
  id: string;
  dayStayed: number;
  totalAmount: number;
  patientRegNo: string;
  previousBed: string;
  firstAdmitDate: string;
  isReleased: string;
}) => {
  const [open, setOpen] = useState(false);

  console.log(id, "id in ");

  const [formData, setFormData] = useState<TFormValue>({
    worldId: "",
    allocatedBed: "",
  });

  const query: Record<string, any> = {};

  if (formData.worldId) query.worldId = formData.worldId;

  const { data: worlds, isLoading } = useGetAllWorldsQuery(undefined);

  const { data: beds, isLoading: bedLoading } = useGetAllBedQuery(query, {
    skip: !formData.worldId,
  });

  const [transferBed, { isLoading: isTransferring }] =
    useTransferAdmissionMutation();

  const formFields = [
    {
      label: "Bed Category",
      name: "worldId",
      accepter: SelectPicker,
      data: worlds?.data?.map((world: TWorld) => ({
        label: world.worldName,
        value: world._id,
      })),
      placeholder: "Select Disease",
    },
    {
      label: "Available Beds",
      name: "allocatedBed",
      accepter: SelectPicker,
      disabled: !formData.worldId,
      data: beds?.data?.map((bed: TBed) => ({
        label: bed.bedName,
        value: bed._id,
      })),
      placeholder: "Select Bed",
    },
  ];

  const handleInputChange = (value: Record<string, any>) => {
    setFormData({
      worldId: value.worldId || null,
      allocatedBed: value.allocatedBed || null,
    });
  };

  const payLoad = {
    previousBed,
    patientRegNo,
    allocatedBed: formData.allocatedBed,
    firstAdmitDate,
    totalAmount,
  };

  const handleSubmt = async () => {
    try {
      const res = await transferBed(payLoad).unwrap();
      if (res.success) {
        Swal.fire({
          title: "Transferred Successfully",
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          icon: "success",
        });
        setOpen(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <CustomModal
        disabled={isReleased === "released"}
        open={open}
        setOpen={setOpen}
        text="Bed Transfer"
        title="Bed Transfer"
        appearance="ghost"
        color="violet"
      >
        <div>
          <p className="font-bold">Now Total Amount : {totalAmount}</p>
          <div className="my-5">
            <Form
              className="grid grid-cols-2 gap-5 mt-7"
              onChange={handleInputChange}
              onSubmit={handleSubmt}
              formValue={formData}
              fluid
            >
              {formFields.map(({ label, name, accepter, data, disabled }) => (
                <Form.Group controlId={name} key={name}>
                  <Form.ControlLabel>{label}</Form.ControlLabel>
                  <Form.Control
                    name={name}
                    accepter={accepter}
                    data={data}
                    disabled={disabled}
                    className="w-full"
                  />
                </Form.Group>
              ))}

              {isTransferring ? (
                <Button
                  className="max-h-11 mt-5 w-full max-w-sm col-span-2 mx-auto"
                  appearance="primary"
                  loading
                />
              ) : (
                <Button
                  className="max-h-11 mt-5 w-full max-w-sm col-span-2 mx-auto"
                  size="sm"
                  appearance="primary"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </Form>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default BedTransferModal;
