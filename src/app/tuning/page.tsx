import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TuningPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Tuning</h1>
          <p className="mt-4 text-muted-foreground">
            Ontdek binnenkort alles over onze performance en esthetische tuning opties.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}