import { useChangeHeaderVisibilityMutation } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import React, { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import Swal from "sweetalert2";

const VisibilitySelectPicker = ({
  id,
  isHidden,
}: {
  id: string;
  isHidden: boolean;
}) => {
  const [value, setValue] = useState(false);
  const [change, { isLoading: changeLoading }] =
    useChangeHeaderVisibilityMutation();
  const data = [
    { label: "Visible", value: false },
    { label: "Hidden", value: true },
  ];

  const submitHandler = async (v: boolean) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be easily undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",
    });

    if (res.isConfirmed) {
      const result = await change({ data: { isHidden: v }, id }).unwrap();
      if (result?.success) {
        setValue(v);
        Swal.fire({
          icon: "success",
          text: "Updated Successfully",

          timer: 1000,
        });
      }
    }
  };

  useEffect(() => {
    setValue(isHidden ?? false);
  }, [isHidden]);

  return (
    <div>
      <SelectPicker
        data={data}
        block
        value={value}
        cleanable={false}
        onChange={(v) => submitHandler(v as boolean)}
      />
    </div>
  );
};

export default VisibilitySelectPicker;
