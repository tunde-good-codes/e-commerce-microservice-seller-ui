"use client";

import useSeller from "@/hooks/useSeller";
import useSideBar from "@/hooks/useSideBar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../ui/Box";
import { SideBar } from "./sideBarStyles";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";

const SideBarWrapper = () => {
  const [activeSideBar, setActiveSidebar] = useSideBar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => {
    activeSideBar === route ? "#0085ff" : "#969696";
  };
  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "static",
        padding: "8px",
        top: 0,
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <SideBar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2">
            <Logo />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
            </Box>
          </Link>
        </Box>
      </SideBar.Header>
    </Box>
  );
};

export default SideBarWrapper;
