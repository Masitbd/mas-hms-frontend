import React from "react";

const RefByAndConsoultant = ({ data }: { data: any }) => {
  return (
    <>
      {data?.consultant ? (
        <>
          <div className="flex flex-col">
            <div className="text-lg font-bold capitalize">Consultant</div>
            <div>{data?.consultant?.title + " " + data?.consultant?.name}</div>
          </div>
        </>
      ) : (
        <></>
      )}
      {data?.refBy ? (
        <>
          <div className="flex flex-col">
            <div className="text-lg font-bold capitalize">Ref. By</div>
            <div>{data?.refBy?.title + " " + data?.refBy?.name}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RefByAndConsoultant;
