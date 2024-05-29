"use client";
import { useAppSelector } from "@/redux/hook";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  return redirect("/profile");
}
