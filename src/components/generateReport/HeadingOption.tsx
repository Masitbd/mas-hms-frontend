import { ENUM_LOCAL_STORAGE_KEY } from "@/enum/LocalStorageStoredItem";
import React, { useEffect, useState } from "react";
import { Radio, Toggle } from "rsuite";

const HeadingOption = ({
  setToggleP,
}: {
  setToggleP?: (b: boolean) => void;
}) => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = (d: boolean) => {
    localStorage.setItem(
      ENUM_LOCAL_STORAGE_KEY.HEADING_VISIBILITY,
      JSON.stringify(d)
    );
    setToggle(d);
    setToggleP && setToggleP(d);
  };

  useEffect(() => {
    const checked = JSON.parse(
      localStorage.getItem(ENUM_LOCAL_STORAGE_KEY.HEADING_VISIBILITY) ?? "false"
    );
    setToggle(checked);
    setToggleP && setToggleP(checked);
  }, [Toggle, setToggle, setToggleP]);
  return (
    <div className="px-5 flex gap-5">
      <div>Heading Visibility</div>
      <div>
        <Toggle onChange={(v) => handleToggle(v)} checked={toggle} />
      </div>
    </div>
  );
};

export default HeadingOption;
