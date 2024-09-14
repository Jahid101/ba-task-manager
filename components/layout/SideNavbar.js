/** @format */
"use client";

import { Nav } from '@/components/ui/nav';
import { useEffect, useState } from "react";

import { Button } from '@/components/ui/button';
import { useWindowWidth } from "@react-hook/window-size";
import { FaAngleLeft, FaRegClipboard } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";


export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 901;
  // const mobileWidth = onlyWidth < 768;

  useEffect(() => {
    if (mobileWidth) {
      setIsCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }


  const superAdminNav = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LuLayoutDashboard,
      variant: "ghost", //"default"
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: FaRegClipboard,
      variant: "ghost"
    },
  ]


  return (
    <div className='relative min-h-[92vh] border-e shadow-lg'>
      <div className={`absolute cursor-pointer z-10 ${mobileWidth ? 'top-[-50px] left-2' : 'right-[-20px] top-0'}`}
        onClick={toggleSidebar}
      >
        <Button
          variant="secondary"
          className="rounded-full p-2 w-[40px]"
        >
          {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </Button>
      </div>

      <div className={`relative 
      ${isCollapsed ? mobileWidth ? 'hidden' : 'min-w-[80px]'
          : mobileWidth ? 'min-w-[80px]' : 'min-w-[250px]'
        } px-3 pt-10 transition-all flex flex-col justify-between`}
      >
        <Nav
          isCollapsed={mobileWidth ? true : isCollapsed}
          links={superAdminNav}
        />
      </div>
    </div>
  );
}
