"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import AuthChecker from "./AuthChecker";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthChecker>{children}</AuthChecker>
    </Provider>
  );
};

export default Providers;
