import SideBarWrapper from "@/shared/components/dashboard/SideBarWrapper";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full min-h-screen flex bg-black">
      <aside className="w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800  text-white p-4 ">
        <div className="sticky top-0">
          <SideBarWrapper />
        </div>
      </aside>
      <main className="flex-1">
        <div className="overflow-auto "> {children}</div>
      </main>
    </div>
  );
};

export default Layout;
