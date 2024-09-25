"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <CustomProvider>{children}</CustomProvider>
    </Provider>
  );
};

export default Providers;
