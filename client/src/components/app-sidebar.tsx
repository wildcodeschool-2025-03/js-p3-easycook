import MemberManage from "@/components/Admin/Member.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext.tsx";
import EditMemberForm from "@/pages/Account/EditMemberForm.tsx";
import MemberAccountPage from "@/pages/Account/MemberAccountPage.tsx";
import MemberCommentedList from "@/pages/Account/MemberCommentedList.tsx";
import MemberFavoriteList from "@/pages/Account/MemberFavoriteList.tsx";
import MemberRegisteredList from "@/pages/Account/MemberRegisteredList.tsx";
import { ChevronRight } from "lucide-react";
import type { ComponentType } from "react";
import { FaPowerOff } from "react-icons/fa6";
import { Link } from "react-router";
import CreateRecipe from "./Admin/Add_Recipe.tsx";

interface SectionType {
  title: string;
  isAdmin: boolean;
  items: {
    title: string;
    Component: ComponentType;
  }[];
}

// This is sample data.
const Data: SectionType[] = [
  {
    title: "Membre",
    isAdmin: false,
    items: [
      { title: "Mon compte", Component: MemberAccountPage },

      { title: "Favoris", Component: MemberFavoriteList },

      { title: "Mes commentaires", Component: MemberCommentedList },

      { title: "Mes Listes", Component: MemberRegisteredList },

      { title: "Paramètres", Component: EditMemberForm },
    ],
  },
  {
    title: "Admin",
    isAdmin: true,
    items: [
      { title: "Gestion Recettes", Component: CreateRecipe },

      { title: "Gestion Comptes", Component: MemberManage },

      // { title: "Gestion des Commentaires",
      //   Component:AdminCommentaryManagement},

      // { title: "Gestion des Catégories",
      //   Component: AdminCategoriesManagement},

      // { title: "Gestion des régimes",
      //   Component: AdminDietManagement},

      // { title: "Statistiques",
      //   Component: Stats},
    ],
  },
];

export interface AppSidebarProps {
  onSelect: (title: string, Component: ComponentType) => void;
}

export function AppSidebar({ onSelect, ...props }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const { isAdmin, isConnected, handleDisconnect } = useUser();
  // apparition de membre ou Admin tout depends du role du user (db)
  const sections = Data.filter(
    (section) =>
      isConnected &&
      (section.title === "Membre" || (section.title === "Admin" && isAdmin)),
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-primary flex flex-row justify-between">
        Gestion{" "}
        <Link
          to="/"
          className="absolute top-3 right-3 text-secondary text-center cursor-pointer md:hidden"
          onClick={() => {
            handleDisconnect();
          }}
        >
          <FaPowerOff />
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-primary text-white gap-0">
        {sections.map((section) => (
          <Collapsible key={section.title} className="group/collapsible ">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="my-6 bg-secondary group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {section.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => {
                            onSelect(item.title, item.Component);
                            setOpenMobile(false);
                          }}
                        >
                          <p className="cursor-pointer">{item.title}</p>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
