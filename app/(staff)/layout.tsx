import "@/styles/globals.css";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header userName="Staff User" userRole="STAFF" />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8 flex-grow">
        {children}
      </main>

      <Footer userRole="STAFF" />
    </div>
  );
}
