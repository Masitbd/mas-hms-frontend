import React from "react";
import { Tag } from "rsuite";

const TestStatusElement = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return <Tag color="red">Pending</Tag>;

    case "completed":
      return <Tag color="green">Completed</Tag>;

    case "delivered":
      return <Tag color="blue">Delivered</Tag>;

    case "refunded":
      return <Tag color="orange">REFUNDED</Tag>;
  }
};

export default TestStatusElement;
