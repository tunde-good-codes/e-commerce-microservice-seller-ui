"use client"

import {atom} from "jotai"

export const activeSideBarItem = atom<string>("/dashboard")


export const navItems: NavItemsTypes[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Shop",
    href: "/shop",
  },
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Offers",
    href: "/offers",
  },
  {
    title: "Become A Seller",
    href: "/become-a-Seller",
  },
];
