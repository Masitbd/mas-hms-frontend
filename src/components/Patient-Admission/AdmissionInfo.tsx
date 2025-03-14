"use client";

import { useGetAllBedQuery } from "@/redux/api/bed.api";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useState } from "react";

export interface IAdmissionInitialDataParams {
  worldId?: string;
  admissionDate?: Date;
  admissionTime?: Date;
  releaseDate?: Date;
  disease?: string;
  allocatedBed?: string;
  assignDoct?: string;
  refDoct?: string;
  totalPrice?: number;
  formData: IAdmissionInitialData;
  setFormData: React.Dispatch<
    React.SetStateAction<IAdmissionInitialDataParams>
  >;
  data?: {
    patient?: Record<string, any>;
  };
  forwardedRef?: React.RefObject<any>;
}
import { Checkbox, DatePicker, Form, SelectPicker } from "rsuite";
import { IAdmissionInitialData } from "../order/initialDataAndTypes";

const AdmissionInfo = (param: IAdmissionInitialDataParams) => {
  const [worldId, setWorldId] = useState(param.worldId);
  const query: Record<string, any> = {};

  if (worldId) query.worldId = worldId;

  const { data: worlds, isLoading } = useGetAllWorldsQuery(undefined);
  const { data: doctors, isLoading: docLoading } = useGetDoctorQuery(undefined);
  const { data: beds, isLoading: bedLoading } = useGetAllBedQuery(query, {
    skip: !worldId,
  });

  const selectedBedPrice = worlds?.data?.find(
    (item: { _id: string }) => worldId === item._id
  );

  const handleInputChange = (formValue: Record<string, any>) => {
    const value = formValue as IAdmissionInitialDataParams;
    setWorldId(value.worldId);
    param.setFormData((prevState: IAdmissionInitialDataParams) => ({
      ...prevState,
      admissionDate: value.admissionDate || prevState.admissionDate,
      admissionTime: value.admissionTime || prevState.admissionTime,
      worldId: value.worldId || prevState.worldId,
      releaseDate: value.releaseDate || prevState.releaseDate,
      disease: value.disease || prevState.disease,
      allocatedBed: value.allocatedBed || prevState.allocatedBed,
      assignDoct: value.assignDoct || prevState.assignDoct,
      refDoct: value.refDoct || prevState.refDoct,
      totalPrice: selectedBedPrice?.charge ?? prevState.totalPrice,

      // You can update other fields similarly as required
    }));
  };

  const formFields = [
    {
      label: "Admission Date",
      name: "admissionDate",
      accepter: DatePicker,
      format: "dd MMM yyyy",
    },
    {
      label: "Admission Time",
      name: "admissionTime",
      accepter: DatePicker,
      format: "hh:mm aa",
      showMeridian: true,
    },
    {
      label: "Release Date",
      name: "releaseDate",
      accepter: DatePicker,
      format: "dd MMM yyyy",
    },
    {
      label: "Disease Type",
      name: "disease",
      accepter: SelectPicker,
      data: worlds?.data?.map((world: any) => ({
        label: world.worldName,
        value: world._id,
      })),
      placeholder: "Select Disease",
    },
    {
      label: "Bed Category",
      name: "worldId",
      accepter: SelectPicker,
      data: worlds?.data?.map((world: any) => ({
        label: world.worldName,
        value: world._id,
      })),
      placeholder: "Select Disease",
    },
    {
      label: "Available Beds",
      name: "allocatedBed",
      accepter: SelectPicker,
      data: beds?.data?.map((bed: any) => ({
        label: bed.bedName,
        value: bed._id,
      })),
      placeholder: "Select Bed",
    },
    {
      label: "Assign Doctor",
      name: "assignDoct",
      accepter: SelectPicker,
      data: doctors?.data?.map((item: any) => ({
        label: item.name,
        value: item._id,
      })),
      placeholder: "Select Doctor",
    },
    {
      label: "Refd Doctor",
      name: "refDoct",
      accepter: SelectPicker,
      data: doctors?.data?.map((item: any) => ({
        label: item.name,
        value: item._id,
      })),
      placeholder: "Select Doctor",
    },
  ];

  return (
    <div>
      <div className="bg-[#3498ff] text-white">
        <h2 className="text-center text-lg font-semibold">
          Admission Information
        </h2>
      </div>
      <Form
        className="grid grid-cols-3 gap-5 mt-7"
        onChange={handleInputChange}
        formValue={param?.data?.patient}
        ref={param.forwardedRef}
        fluid
      >
        {formFields.map(
          ({ label, name, accepter, data, format, showMeridian }) => (
            <Form.Group controlId={name} key={name}>
              <Form.ControlLabel>{label}</Form.ControlLabel>
              <Form.Control
                name={name}
                accepter={accepter}
                data={data}
                format={format}
                showMeridian={showMeridian}
                className="w-full"
              />
            </Form.Group>
          )
        )}

        {/* Fixed Bill Checkbox */}
        <Form.Group
          controlId="fixedBill"
          key="fixedBill"
          className="flex items-center gap-2"
        >
          <Form.Control name="fixedBill" accepter={Checkbox}>
            Fixed Bill
          </Form.Control>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AdmissionInfo;
