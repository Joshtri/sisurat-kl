// app/(rt)/layout.tsx atau app/rt/layout.tsx
import "@/styles/globals.css";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import Sidebar from "@/components/partials/Sidebar";

export default function RTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Sidebar khusus RT */}
      <div className="hidden lg:block">
        <Sidebar userRole="RT" />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        <Header userName="RT User" userRole="RT" />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer userRole="RT" />
      </div>
    </div>
  );
}
