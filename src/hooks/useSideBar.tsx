"use client"

import React from 'react'
import {useAtom} from "jotai"
import { activeSideBarItem } from "@/configs/constants"

const useSideBar = (): [string, (value: string) => void] => {
    const [activeSideBar, setActiveSidebar] = useAtom(activeSideBarItem)
    return [activeSideBar, setActiveSidebar]
}

export default useSideBar