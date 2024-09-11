import * as React from "react"
import { useState } from "react";
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = React.forwardRef(({ suffix, className, type, ...props }, ref) => {
  return (
    <div className="flex gap-2 items-center relative">
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white ps-3 pe-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0082C8]focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
        className
      )}
      ref={ref}
      {...props}
      />
      {suffix}
    </div>
  );
})


const PasswordInput = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    (
    <Input
      type={showPassword ? 'text' : 'password'}
      className={className}
      ref={ref}
      suffix={
        showPassword ? 
        (<EyeOffIcon onClick={()=> setShowPassword(false)} className="cursor-pointer absolute right-3 text-slate-400" />)
        :
        (<EyeIcon onClick={()=> setShowPassword(true)} className="cursor-pointer absolute right-3 text-slate-400" />)
      }
      {...props} 
      />
    )
  );
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
