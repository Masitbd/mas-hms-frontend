import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hospital Management Service",
    short_name: "HMS",
    description:
      "This application is for managing all the digital services of a hospital",
    start_url: "https://mas-hms-frontend.vercel.app/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
