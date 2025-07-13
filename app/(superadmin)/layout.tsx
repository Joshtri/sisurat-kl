import SuperAdminLayoutClient from "./SuperAdminLayoutClient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}
