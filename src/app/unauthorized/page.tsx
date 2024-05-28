import Image from "next/image";
import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Image
        src={"/error_401.jpg"}
        height={1000}
        width={1000}
        alt="Unauthorized page"
      />
    </div>
  );
};

export default Unauthorized;
