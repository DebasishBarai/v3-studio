'use client'

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

export default function BillingPage() {
  const [url, setUrl] = useState('');
  const customerPortalUrl = useAction(api.polar.getCustomerPortalUrl)

  useEffect(() => {
    setUrl(customerPortalUrl())
  }, [user, addUser])
  useEffect(() => {
    if (!user) {
      addUser()
    }
  }, [user, addUser])
