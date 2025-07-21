import { LoginForm } from "@/components/Connexion/loginForm";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { type ComponentType, useState } from "react";
import MemberAccountPage from "./MemberAccountPage";

function Account() {
  const { isConnected, handleDisconnect } = useUser();
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [ActiveComponent, setActiveComponent] = useState<ComponentType | null>(
    null,
  );

  return (
    <>
      {isConnected ? (
        <section>
          <SidebarProvider>
            <AppSidebar
              onSelect={(title, Component) => {
                setActiveTitle(title);
                setActiveComponent(() => Component);
              }}
            />
            <SidebarInset>
              <header className="bg-primary flex h-16 items-center gap-2 border-b px-4 justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="ml-1" />
                  <Breadcrumb>
                    <BreadcrumbPage>
                      {activeTitle || "Mon compte"}
                    </BreadcrumbPage>
                  </Breadcrumb>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-2 rounded-xl bg-primary hidden md:flex cursor-pointer"
                >
                  Se déconnecter
                </button>
              </header>

              <main className="p-6">
                {ActiveComponent ? <ActiveComponent /> : <MemberAccountPage />}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </section>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export default Account;
