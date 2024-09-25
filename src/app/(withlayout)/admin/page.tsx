import Link from "next/link";
import React from "react";

export default function AdminHomePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mt-10">
        Welcome to Admin Dashboard page
      </h2>
      <div className="text-center mt-8">
        <Link href="/">
          <button className="btn btn-secondary">Go To Home</button>
        </Link>
      </div>
    </div>
  );
}
