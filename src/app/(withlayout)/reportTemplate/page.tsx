"use client";

import NewAndUpdate from "@/components/reportTemplate/NewAndUpdate";
import TemplateTable from "@/components/reportTemplate/TeplateTable";
import {
  InitalTemplateData,
  ITemplate,
} from "@/components/reportTemplate/typesandInitialData";
import { ENUM_MODE } from "@/enum/Mode";
import React, { useState } from "react";
import { Button } from "rsuite";

const Template = () => {
  const [template, setTemplate] = useState<ITemplate | null>(
    InitalTemplateData
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(ENUM_MODE.NEW);

  const templateDataHandler = (param: ITemplate) => {
    setTemplate(param);
  };
  const templateModalHandler = (param: boolean) => {
    setModalOpen(param);
  };
  const modeHandler = (param: string) => {
    setMode(param as ENUM_MODE);
  };

  return (
    <div>
      <div className="my-3">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => templateModalHandler(true)}
        >
          Add New Template
        </Button>
      </div>
      <div>
        <NewAndUpdate
          data={template as ITemplate}
          open={modalOpen}
          setData={templateDataHandler}
          setOpen={templateModalHandler}
          mode={mode}
          setMode={modeHandler}
        />
      </div>
      <div>
        <TemplateTable
          setData={templateDataHandler}
          setMode={modeHandler}
          setModalOpen={templateModalHandler}
        />
      </div>
    </div>
  );
};

export default Template;
