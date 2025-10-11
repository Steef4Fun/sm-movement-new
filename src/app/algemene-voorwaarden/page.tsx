import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-8">
              Algemene Voorwaarden
            </h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
              <p>
                Hier komen de algemene voorwaarden van SM Movement.
              </p>
              <h2 className="text-2xl font-semibold text-foreground">Artikel 1: Definities</h2>
              <p>
                In deze algemene voorwaarden worden de hiernavolgende termen in de navolgende betekenis gebruikt, tenzij uitdrukkelijk anders is aangegeven of uit de context anders blijkt...
              </p>
              <h2 className="text-2xl font-semibold text-foreground">Artikel 2: Toepasselijkheid</h2>
              <p>
                Deze algemene voorwaarden zijn van toepassing op iedere aanbieding, offerte en overeenkomst tussen SM Movement en een Wederpartij waarop SM Movement deze voorwaarden van toepassing heeft verklaard...
              </p>
              {/* Add more placeholder content as needed */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}