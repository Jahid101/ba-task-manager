import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

const RegistrationForm = dynamic(() => import('@/components/registration/RegistrationForm'), {
  loading: () => <Spinner size="sm" className='mt-1' />,
  ssr: false,
});

export default function RegistrationPage() {
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
        onMouseOver={() => setIsHovering(false)}
        onMouseLeave={() => setIsHovering(true)}
      >
        <div className='pb-5 w-[90%]'>
          <p className="text-[23px] text-primary text-center font-header mt-5">Welcome to Tasks Manager</p>
          <p className="text-[16px] my-3 text-label text-center font-header">Create your account</p>

          {/* Registration form */}
          <RegistrationForm />

          <p
            className="text-sm underline cursor-pointer text-primary text-center mt-3 text-label font-header"
            onClick={() => router.push('/')}
          >Login</p>

        </div>
      </div>
    </div>
  );
}
