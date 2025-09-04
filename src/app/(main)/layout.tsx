import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}