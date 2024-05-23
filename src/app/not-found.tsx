import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <Image
        src={"/404.webp"}
        height={1000}
        width={1000}
        alt="Not Found Page"
      ></Image>
    </div>
  );
};

export default NotFoundPage;
