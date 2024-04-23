"use client"
import React from "react"
export const BuildContext = React.createContext<
    Readonly<[number, React.Dispatch<React.SetStateAction<number>>]> | undefined
>(undefined)
