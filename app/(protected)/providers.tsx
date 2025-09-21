'use client'

import { ReactNode } from 'react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { RedirectToSignIn } from '@clerk/nextjs'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Authenticated>
        {children}
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  )
}
