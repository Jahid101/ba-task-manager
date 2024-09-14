import Image from "next/image";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Error from "../public/images/404.jpg";


export default function Custom404() {
  const { userDetails } = useSelector((state) => state.usersSlice);
  const router = useRouter();

  const handleGoBack = () => {
    if (userDetails?.id) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-dvh px-2">
      <Image
        src={Error}
        alt="Error image"
        className="rounded-lg"
        width={300}
        height={250}
      />

      <p
        className="text-default text-2xl text-center mt-5"
      >
        We can't seem to find the page you're looking for.
      </p>

      <div
        className="flex justify-center items-center mt-5 cursor-pointer"
        onClick={() => handleGoBack()}
      >
        <FaArrowLeftLong className="text-tertiary text-2xl" />
        <p className="ml-3 text-tertiary text-2xl">Back</p>
      </div>

    </div>
  );
}
