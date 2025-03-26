"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import { generateBreadcrumbs } from "@/utils/path-extractor";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log(isSignedIn);
  }, [isSignedIn]);
  const pathname = usePathname();

  // Generate the breadcrumb data from the pathname
  const breadcrumbs = generateBreadcrumbs(pathname);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem
                      className={
                        index === breadcrumbs.length - 1
                          ? ""
                          : "hidden md:block"
                      }
                    >
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={breadcrumb.path}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <span className="cursor-pointer">{breadcrumb.label}</span>
                      )}
                    </BreadcrumbItem>

                  
                    {index !== breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
