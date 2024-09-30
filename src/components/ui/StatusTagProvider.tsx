import React from "react";
import { Tag } from "rsuite";

const StatusTagProvider = (status: string) => {
  switch (status) {
    case "pending":
      return <Tag color="red">Pending</Tag>;
    case "completed":
      return <Tag color="green">Completed</Tag>;
    case "failed":
      return <Tag color="blue">Delivered</Tag>;
    case "refunded":
      return <Tag color="orange">Delivered</Tag>;
    default:
      return " ";
  }
};

export default StatusTagProvider;
