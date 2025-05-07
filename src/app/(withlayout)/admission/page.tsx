"use client";

import AdmitPatientModal from "@/components/Patient-Admission/AdmitPatientModal";
import AdmissionTable from "@/components/Patient-Admission/AdmissionTable";
import { useGetAllAdmissionQuery } from "@/redux/api/admission.api";
import { Form, InputPicker } from "rsuite";
import { useState } from "react";
import { useGetOrderPostedByQuery } from "@/redux/api/order/orderSlice";

const PatientAdmissionPage = () => {
  const queryParams: Record<string, any> = {};

  const [searchData, setSearchData] = useState({
    sort: "-createdAt",
    searchTerm: "",
    status: "admitted",
    receivedBy: "",
  });

  if (searchData?.searchTerm) queryParams.searchTerm = searchData.searchTerm;
  if (searchData?.sort) queryParams.sort = searchData.sort;
  if (searchData?.status) queryParams.status = searchData.status;
  if (searchData?.receivedBy) queryParams.receivedBy = searchData.receivedBy;

  const {
    data: patients,
    isLoading,
    isFetching,
  } = useGetAllAdmissionQuery(queryParams);

  const { isLoading: postedByLoading, data: postedByData } =
    useGetOrderPostedByQuery(undefined);

  return (
    <div>
      <div className="bg-[#3498ff] text-white px-2 py-2 my-10">
        <h2 className="text-center text-xl font-semibold">Patient Admission</h2>
      </div>
      <Form
        onChange={(formValue, event) =>
          setSearchData((preValue) => ({ ...preValue, ...formValue }))
        }
        className="grid grid-cols-4 gap-5 justify-center justify-items-center my-6 w-full"
        fluid
      >
        <Form.Group controlId="searchTerm">
          <Form.ControlLabel>Search</Form.ControlLabel>
          <Form.Control name="searchTerm" />
        </Form.Group>

        <Form.Group controlId="sortBy">
          <Form.ControlLabel>Filter By</Form.ControlLabel>
          <Form.Control
            name="status"
            accepter={InputPicker}
            data={[
              { label: "Admitted", value: "admitted" },
              { label: "Released", value: "released" },
            ]}
            defaultValue={"admitted"}
          />
        </Form.Group>
        <Form.Group controlId="sortOrder">
          <Form.ControlLabel>Sort order</Form.ControlLabel>
          <Form.Control
            name="sort"
            accepter={InputPicker}
            data={[
              { label: "Aescending", value: "createdAt" },
              { label: "Descending", value: "-createdAt" },
            ]}
            defaultValue={"-createdAt"}
          />
        </Form.Group>
        <Form.Group controlId="receivedBy">
          <Form.ControlLabel>Patient Posted BY</Form.ControlLabel>
          <Form.Control
            name="receivedBy"
            accepter={InputPicker}
            loading={postedByLoading}
            data={postedByData?.data?.map(
              (data: { name: string; _id: string }) => ({
                label: data.name,
                value: data._id,
              })
            )}
            cleanable
            onClean={() => {
              const { receivedBy, ...otherData } = searchData;
              //@ts-ignore
              setSearchData(otherData);
            }}
          />
        </Form.Group>
      </Form>
      <div className="px-10">
        <AdmitPatientModal />
      </div>
      <div className="mt-10">
        <AdmissionTable
          data={patients?.data?.result}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
