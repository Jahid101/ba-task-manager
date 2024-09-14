import { useRouter } from 'next/router';
import { FaChevronRight } from "react-icons/fa6";
import { FiArrowLeftCircle } from "react-icons/fi";
import { Button } from './button';


const Breadcrumb = ({
  backLink = "/",
  items,
}) => {
  const router = useRouter();

  return (
    <div className='flex flex-wrap items-center my-3'>
      <Button
        variants="primary"
        className="mr-2"
        onClick={() => router.push(backLink)}
      >
        <FiArrowLeftCircle className='text-3xl' />
      </Button>

      {items &&
        items.map((item, index) => (
          <p
            key={index}
            className='hidden sm:flex items-center cursor-pointer text-xl text-primary my-1 md:my-5 break-all font-header'
            onClick={() => item?.link && router.push(item?.link)}
          >
            {item?.title}
            {index != (items?.length - 1) && <FaChevronRight className='text-xl text-primary mx-2' />}
          </p>
        ))
      }
    </div>
  );
};

export default Breadcrumb;
