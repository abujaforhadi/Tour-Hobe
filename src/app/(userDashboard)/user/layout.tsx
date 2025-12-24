

import { AuthProvider } from "@/components/modules/auth/AuthProvider/AuthProvider";

import UserSidebar from "@/components/shared/UserSidebar";
import LoaderWrapper from "@/lib/LoaderWrapper";
import UserAuthWrapper from "@/lib/UserAuthWrapper";






export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <AuthProvider>
  <UserAuthWrapper>
    <LoaderWrapper>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-[#F8F5FF] to-gray-100 dark:from-gray-950 dark:via-[#1a1033] dark:to-gray-900">
        <div className="flex">
          <UserSidebar/>
          
          <main className="flex-1 min-h-screen md:ml-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
           
            <div className="md:mt-0 mt-16">
              {children}
            </div>
          </main>
        </div>
      </div>
      </LoaderWrapper>
 </UserAuthWrapper>
    </AuthProvider>
  );
}