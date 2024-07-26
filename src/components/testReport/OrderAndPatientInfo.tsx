import React from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import { IDoctor } from "@/types/allDepartmentInterfaces";

const OrderAndPatientInfo = (orderData: { data: IOrderData[] }) => {
  const orderCreationDate = new Date(orderData?.data[0].createdAt as Date);
  const deliveryData = new Date(orderData?.data[0].deliveryTime as Date);

  const refByInfromation = () => {
    if (orderData?.data[0]?.refBy) {
      const refBy: IDoctor = orderData?.data[0].refBy as unknown as IDoctor;

      if ("title" in refBy || "name" in refBy) {
        return <>{refBy?.title + " " + refBy?.name}</>;
      } else {
        return "";
      }
    }
  };

  const patientInformation = () => {
    if (orderData?.data[0]?.patient) {
      return (
        <div className="grid grid-cols-4">
          <div className="flex flex-col">
            <h2 className="font-bold">Name</h2>
            {orderData?.data[0]?.patient.name}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Age</h2>
            {orderData?.data[0]?.patient.age}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Gender</h2>
            {orderData?.data[0]?.patient.gender}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Address</h2>
            {orderData?.data[0]?.patient.address}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Ref By</h2>
            {refByInfromation()}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Consultent</h2>
            {orderData?.data[0]?.patient.consultant}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Phone</h2>
            {orderData?.data[0]?.patient.phone}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Email</h2>
            {orderData?.data[0]?.patient.email}
          </div>
        </div>
      );
    } else {
      return <div>No Patient Information available</div>;
    }
  };

  return (
    <>
      <div className="my-10">
        <div className="text-xl font-bold font-serif">Order Information</div>
        <hr />
        <div className="grid grid-cols-4 ">
          <div>
            <div className="font-bold">Order Id</div>
            <div>{orderData?.data[0].oid}</div>
          </div>
          <div>
            <div className="font-bold">Order Posted</div>
            <div>{orderCreationDate.toDateString()}</div>
          </div>
          <div>
            <div className="font-bold">Delivery Date</div>
            <div>{deliveryData.toDateString()}</div>
          </div>
          <div>
            <div className="font-bold">Status</div>
            <div>{orderData?.data[0].status}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xl font-bold font-serif gap-2">
          Patient Information
        </div>
        <hr />
        {patientInformation()}
      </div>
    </>
  );
};

export default OrderAndPatientInfo;
