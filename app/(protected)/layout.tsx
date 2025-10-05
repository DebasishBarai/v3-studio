import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from '@/lib/utils';
import Providers from '@/app/(protected)/providers';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className={cn('m-4 bg-slate-900')} />
        <div className="min-h-screen w-full p-4 pt-16">
          {children}
        </div>
      </SidebarProvider>
    </Providers>
  )
}
