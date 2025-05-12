"use client";

import { useGetAllBedQuery } from "@/redux/api/bed.api";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useEffect, useState } from "react";

export interface IAdmissionInitialDataParams {
  worldId?: string;
  admissionDate?: Date;
  admissionTime?: Date;
  releaseDate?: Date;
  disease?: string;
  allocatedBed?: string;
  assignDoct?: string;
  refDoct?: string;
  totalAmount?: number;
  isFixed?: boolean;
  fixedBill?: undefined;
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
import { useGetAllPackageQuery } from "@/redux/api/package.api";
import { useGetAllDeseaseQuery } from "@/redux/api/desease.api";

const AdmissionInfo = (param: IAdmissionInitialDataParams) => {
  const [worldId, setWorldId] = useState(param.worldId);
  const query: Record<string, any> = {};

  if (worldId) query.worldId = worldId;

  const { data: worlds, isLoading } = useGetAllWorldsQuery(undefined);
  const { data: doctors, isLoading: docLoading } = useGetDoctorQuery(undefined);
  const { data: beds, isLoading: bedLoading } = useGetAllBedQuery(query, {
    skip: !worldId,
  });
  const { data: deseases, isLoading: deseasLoading } =
    useGetAllDeseaseQuery(undefined);

  const { data: packageItems, isLoading: pakcageLoading } =
    useGetAllPackageQuery(undefined);

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
      totalAmount: selectedBedPrice?.charge ?? prevState.totalAmount,
      isFixed: value.isFixed || prevState.isFixed,
      fixedBill: value.fixedBill || prevState.fixedBill,

      // You can update other fields similarly as required
    }));
  };

  useEffect(() => {
    // Create today's date for admission date
    const today = new Date();

    // Create today's date with time set to 12:00 PM for admission time
    const noonTime = new Date();
    noonTime.setHours(12, 0, 0, 0);

    param.setFormData((prev) => ({
      ...prev,
      admissionDate: prev.admissionDate || today,
      admissionTime: prev.admissionTime || noonTime,
    }));
  }, []);

  const formFields = [
    {
      label: "Disease Type",
      name: "disease",
      accepter: SelectPicker,
      data: deseases?.data?.map((world: any) => ({
        label: world.name,
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
        formValue={param?.formData}
        ref={param.forwardedRef}
        fluid
      >
        <Form.Group controlId="admissionDate">
          <Form.ControlLabel>Admission Date </Form.ControlLabel>
          <Form.Control
            name="admissionDate"
            accepter={DatePicker}
            placement="top"
            format="dd MMM yyyy"
            value={param.formData.admissionDate}
            data-show-meridian
            cleanable
            oneTap
            {...({} as any)}
          />
        </Form.Group>
        <Form.Group controlId="admissionTime">
          <Form.ControlLabel>Admission Time </Form.ControlLabel>
          <Form.Control
            name="admissionTime"
            accepter={DatePicker}
            placement="top"
            format="hh:mm aa"
            value={param.formData.admissionDate}
            showMeridian
            cleanable
            oneTap
            {...({} as any)}
          />
        </Form.Group>

        {formFields.map(({ label, name, accepter, data }) => (
          <Form.Group controlId={name} key={name}>
            <Form.ControlLabel>{label}</Form.ControlLabel>
            <Form.Control
              name={name}
              accepter={accepter}
              data={data}
              className="w-full"
            />
          </Form.Group>
        ))}

        {/* Fixed Bill Checkbox */}
        <Form.Group
          controlId="isFixed"
          key="isFixed"
          className="flex items-center gap-2"
        >
          <Checkbox
            checked={param.formData.isFixed}
            onChange={(value, checked) => {
              param.setFormData((prev) => ({
                ...prev,
                isFixed: checked,
              }));
            }}
          >
            Fixed Bill
          </Checkbox>
        </Form.Group>

        {param?.formData?.isFixed && (
          <Form.Group controlId="fixedBill">
            <Form.ControlLabel>Select Fixed Package</Form.ControlLabel>
            <Form.Control
              disabled={pakcageLoading}
              name="fixedBill"
              accepter={SelectPicker}
              data={packageItems?.data?.map(
                (item: { name: string; _id: string }) => ({
                  label: item.name,
                  value: item?._id,
                })
              )}
              className="w-full"
            />
          </Form.Group>
        )}
      </Form>
    </div>
  );
};

export default AdmissionInfo;
