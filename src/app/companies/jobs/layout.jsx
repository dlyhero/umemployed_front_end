import AuthProvider from "@/src/components/AuthProvider";
import ToastProvider from '@/src/components/common/ToastProvider';

export const metadata = {
  title: "Jobs",
};

export default function CompaniesLayout({ children }) {
  return (
    <AuthProvider>
      <ToastProvider />
      {children}
    </AuthProvider>
  );
}
