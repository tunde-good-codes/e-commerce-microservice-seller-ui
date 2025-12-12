"use client";

import useSeller from "@/hooks/useSeller";
import useSideBar from "@/hooks/useSideBar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../ui/Box";
import { SideBar } from "./sideBarStyles";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import SideBarItem from "./SideBarItem";
import Home from "@/assets/svg/Home";
import SideBarMenu from "./SideBarMenu";
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import Payment from "@/assets/svg/Payment";

const SideBarWrapper = () => {
  const [activeSideBar, setActiveSidebar] = useSideBar();
  const pathName = usePathname();
  const { seller } = useSeller();
  console.log(seller);

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => {
    return activeSideBar === route ? "#0085ff" : "#969696";
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
                {seller?.shop?.name.split(" ")[0]}
              </h3>
              <h5 className="text-xs font-medium text-[#ecedeecf] whitespace-nowrap  overflow-hidden text-ellipsis max-w-[170px] ">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </SideBar.Header>

      <div className="block my-3 h-full ">
        <SideBar.Body className="body sidebar ">
          <SideBarItem
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            href="/dashboard"
            isActive={activeSideBar === "/dashboard"}
          />
          <div className="mt-2 block ">
            <SideBarMenu title="Main Menu">
              <SideBarItem
                title="Orders"
                icon={<ListOrdered size={20} color={getIconColor("/orders")} />}
                href="/dashboard/orders"
                isActive={activeSideBar === "/dashboard/orders"}
              />
              <SideBarItem
                title="payment"
                icon={<Payment fill={getIconColor("/payment")} />}
                href="/dashboard/payment"
                isActive={activeSideBar === "/dashboard/payment"}
              />
            </SideBarMenu>
            <SideBarMenu title="Products">
              <SideBarItem
                title="Create Product"
                icon={
                  <SquarePlus
                    size={20}
                    color={getIconColor("dashboard/create-product")}
                  />
                }
                href="/dashboard/create-product"
                isActive={activeSideBar === "dashboard/create-product"}
              />
              <SideBarItem
                title="All Products"
                icon={
                  <PackageSearch
                    size={20}
                    color={getIconColor("dashboard/all-product")}
                  />
                }
                href="/dashboard/all-product"
                isActive={activeSideBar === "dashboard/all-product"}
              />
            </SideBarMenu>

            <SideBarMenu title="Events">
              <SideBarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={20}
                    color={getIconColor("dashboard/create-event")}
                  />
                }
                href="/dashboard/create-event"
                isActive={activeSideBar === "dashboard/create-event"}
              />
              <SideBarItem
                title="Orders"
                icon={
                  <BellPlus
                    size={20}
                    color={getIconColor("dashboard/all-events")}
                  />
                }
                href="/dashboard/all-events"
                isActive={activeSideBar === "dashboard/all-events"}
              />
            </SideBarMenu>

            <SideBarMenu title="Controllers">
              <SideBarItem
                title="Inbox"
                icon={
                  <Mail size={20} color={getIconColor("dashboard/inbox")} />
                }
                href="/dashboard/inbox"
                isActive={activeSideBar === "dashboard/inbox"}
              />
              <SideBarItem
                title="Settings"
                icon={
                  <Settings
                    size={20}
                    color={getIconColor("dashboard/settings")}
                  />
                }
                href="/dashboard/settings"
                isActive={activeSideBar === "dashboard/settings"}
              />

              <SideBarItem
                title="Notifications"
                icon={
                  <BellRing
                    size={20}
                    color={getIconColor("dashboard/notifications")}
                  />
                }
                href="/dashboard/notifications"
                isActive={activeSideBar === "dashboard/notifications"}
              />
            </SideBarMenu>

            <SideBarMenu title="Extras">
              <SideBarItem
                title="Discount Codes"
                icon={
                  <TicketPercent
                    size={20}
                    color={getIconColor("dashboard/discount-codes")}
                  />
                }
                href="/dashboard/discount-codes"
                isActive={activeSideBar === "dashboard/inbox"}
              />
              <SideBarItem
                title="Logout"
                icon={
                  <LogOut size={20} color={getIconColor("dashboard/logout")} />
                }
                href="/dashboard/logout"
                isActive={activeSideBar === "dashboard/logout"}
              />
            </SideBarMenu>
          </div>
        </SideBar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
