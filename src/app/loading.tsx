import { ENUM_BASEPATH } from "@/enum/ENUMBasePath";
import Image from "next/image";
import { Loader } from "rsuite";

const Loading = () => {
  return (
    <div className="h-[100vh] flex items-center justify-center bg-transparent">
      <Image
        src={`${ENUM_BASEPATH.PATH}logo.png`}
        width={500}
        height={500}
        alt="Logo with Loading"
        className="animate-pulse"
      ></Image>
    </div>
  );
};

export default Loading;
