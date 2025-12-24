import { AuthProvider } from "@/components/modules/auth/AuthProvider/AuthProvider";
import Sidebar from "@/components/shared/Sidebar";
import AuthWrapper from "@/lib/AuthWrapper";
import LoaderWrapper from "@/lib/LoaderWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <AuthProvider>
      <AuthWrapper>
        <LoaderWrapper>
          <div className="min-h-screen bg-muted/30 dark:bg-background transition-colors duration-300">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Component: Handles its own fixed/sticky positioning */}
              <Sidebar />
              
              {/* Main Content Area */}
              <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Container provides consistent padding across all dashboard pages.
                  The mt-16 on mobile accounts for the floating menu button height.
                */}
                <div className="flex-1 p-4 sm:p-6 lg:p-10 mt-16 md:mt-0 transition-all duration-300 ease-in-out">
                  <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                  </div>
                </div>

                {/* Optional: Dashboard Footer */}
                <footer className="px-8 py-6 border-t border-border/40 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  Tour Hobe! &copy; {new Date().getFullYear()} &bull; Explorer Control Panel
                </footer>
              </main>
            </div>
          </div>
        </LoaderWrapper>
      </AuthWrapper>
    </AuthProvider>
  );
}