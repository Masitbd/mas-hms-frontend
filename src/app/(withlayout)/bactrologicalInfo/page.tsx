"use client";
import SensitivityTable from "@/components/bactrologicalInfo/SensitivityTable";
import SWD from "@/components/bactrologicalInfo/SWD";
import TableForCDTS from "@/components/bactrologicalInfo/TableForCDTS";
import { tabTitle } from "@/components/bactrologicalInfo/typesAndInitialData";
import React, { useState } from "react";
import { Tabs } from "rsuite";
import Tab from "rsuite/esm/Tabs/Tab";

const BactrologicalInfo = () => {
  const [activeKey, setActiveKey] = useState(tabTitle[0]);
  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Bacteriological Information
          </h2>
        </div>
        <div className="p-2">
          <Tabs
            activeKey={activeKey}
            onSelect={(eventKey) => setActiveKey(eventKey as string)}
            appearance="tabs"
          >
            {tabTitle.map((title: string) => (
              <>
                <Tabs.Tab eventKey={title} title={title} key={title}>
                  <div>
                    <TableForCDTS title={activeKey} />
                  </div>
                </Tabs.Tab>
              </>
            ))}
            <Tabs.Tab
              title={"Specimen Wise Description"}
              eventKey="Specimen Wise Description"
            >
              <SWD />
            </Tabs.Tab>
            <Tabs.Tab title={"Sensitivity"} eventKey="sensivity">
              <SensitivityTable />
            </Tabs.Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BactrologicalInfo;
