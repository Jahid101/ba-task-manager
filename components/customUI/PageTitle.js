/** @format */

import { cn } from "@/lib/utils";
import React from "react";

export default function PageTitle({ title, className }) {
  return <h1 className={cn("text-[23px] text-primary my-5 break-all font-header break-words", className)}>{title}</h1>;
}
