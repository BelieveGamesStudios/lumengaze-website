"use client"

import React from "react"
import { PrivacyPolicyModal } from "@/components/privacy-policy-modal"

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <PrivacyPolicyModal />
    </>
  )
}
