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
    <div className="my-5 py-5 px-2">
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
  );
};

export default BactrologicalInfo;
