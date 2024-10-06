import React from "react";
import { Loader } from "rsuite";

//Note: To use this loader in any component the parent component must have position relative

const GlassMorphismLoader = () => {
  return (
    <div className="absolute w-full h-full  bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 z-50 top-0 left-0 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
};

export default GlassMorphismLoader;
