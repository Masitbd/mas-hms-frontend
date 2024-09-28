import React from "react";
import { IOrderData } from "../order/initialDataAndTypes";

const PatientInformation = (params: { order: IOrderData }) => {
  const { order } = params;
  const billDate = new Date(order?.createdAt as string).toLocaleDateString();
  return (
    <div className="grid grid-cols-4 gap-5 ">
      <div className="flex flex-col ">
        <h3 className="font-bold">Order Id</h3>
        <div className="font-sans">{order?.oid}</div>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold">Name</h3>
        <div className="font-sans">{order?.patient?.name}</div>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold">Bill Date</h3>
        <div className="font-sans">
          {order?.createdAt ? billDate : "No Date"}
        </div>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold">Age</h3>
        <div className="font-sans">{order?.patient?.age ?? "Not Provided"}</div>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold">Gender</h3>
        <div className="font-sans">
          {order?.patient?.gender ?? "Not Provided"}
        </div>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold">Refd. By</h3>
        <div className="font-sans">
          {order?.refBy &&
          typeof order?.refBy === "object" &&
          order?.refBy?.title &&
          order?.refBy?.name
            ? order?.refBy?.title + " " + order?.refBy?.name
            : "Not Provided"}
        </div>
      </div>
    </div>
  );
};

export default PatientInformation;
