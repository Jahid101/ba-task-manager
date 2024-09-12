import LoginForm from "@/components/login/LoginForm";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className={isHovering ?
        "flex justify-center items-center h-dvh bg-gradient-to-r from-pink-500 to-orange-500" :
        "flex justify-center items-center h-dvh bg-gradient-to-r from-teal-400 to-blue-500"
      }
    >
      <div
        className='w-[90%] md:w-[60%] lg:w-[40%] 2xl:w-[30%] px-5s py-7 flex justify-center items-center border rounded-lg shadow-lg bg-white'
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className='pb-5 w-[90%]'>
          <p className="text-[23px] text-primary text-center font-header mt-5">Welcome to Tasks Manager</p>
          <p className="text-[16px] my-3 text-label text-center font-header">Sign in to your account</p>

          {/* Login form */}
          <LoginForm />

          <p
            className="text-sm underline cursor-pointer text-center my-3 text-label font-header"
            onClick={() => router.push('/registration')}
          >Create account</p>

        </div>
      </div>
    </div>
  );
}
