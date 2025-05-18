import {
    Settings as SettingsIcon,
    Lock,
    Bell,
    Mail,
    CreditCard,
  } from 'lucide-react'
  import { SidebarNav } from './_components/SidebarNav'
  import "@/src/app/globals.css"
  import { Header } from '@/src/components/common/Header'
  import AuthProvider from '@/src/components/AuthProvider'
  import { SettingsProvider } from '@/src/context/SettingsContext'
  
  export default function SettingsLayout({ children }) {
    const sidebarNavItems = [
      {
        title: "Account",
        href: "/settings/account",
        icon: <SettingsIcon className="h-4 w-4 mr-2" />,
        description: "Manage your personal information and preferences.",
      },
      {
        title: "Security",
        href: "/settings/security",
        icon: <Lock className="h-4 w-4 mr-2" />,
        description: "Update your password and security settings.",
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
        icon: <Bell className="h-4 w-4 mr-2" />,
        description: "Choose what notifications you want to receive.",
      },
      {
        title: "Emails",
        href: "/settings/emails",
        icon: <Mail className="h-4 w-4 mr-2" />,
        description: "Manage email preferences and communication.",
      },
      {
        title: "Billing",
        href: "/settings/billing",
        icon: <CreditCard className="h-4 w-4 mr-2" />,
        description: "View and update billing information.",
      }
    ]
  
    return (
      <div>
          <AuthProvider>
            <Header />
            <SettingsProvider>
              <div className="max-w-[1350px] mx-auto px-4 py-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <SettingsIcon className="h-6 w-6" />
                    <h1 className="text-2xl font-bold ml-2">Settings</h1>
                  </div>
                  <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="lg:w-1/5">
                      <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-3xl">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </SettingsProvider>
          </AuthProvider>
      </div>
    )
  }
  