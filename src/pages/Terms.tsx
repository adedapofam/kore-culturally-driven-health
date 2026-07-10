import { Link } from "react-router-dom";
import { Logo } from "@/components/kore/Logo";

const EFFECTIVE_DATE = "10 July 2026";
const CONTACT_EMAIL = "adedapofamodun@gmail.com";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-block mb-8"><Logo /></Link>
        <h1 className="font-display text-3xl font-semibold">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mt-2">Effective date: {EFFECTIVE_DATE}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-semibold mb-2">The deal</h2>
            <p>
              By creating a Kōre account you agree to these terms, our{" "}
              <Link to="/privacy" className="text-accent">Privacy Policy</Link> and our{" "}
              <Link to="/disclaimer" className="text-accent">Health Disclaimer</Link>. If you don't
              agree, please don't use Kōre.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Beta service</h2>
            <p>
              Kōre is currently in beta and provided free of charge. That means things may break,
              change or occasionally be unavailable, and features may be added or removed as the
              product evolves. We provide the service "as is", without warranties of any kind. We
              may introduce paid subscription tiers in future — if we do, you will always be told
              clearly before being charged anything.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Your account</h2>
            <p>
              You must be at least 18 years old to use Kōre. You are responsible for keeping your
              password secure and for everything that happens under your account. One account per
              person.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Acceptable use</h2>
            <p>
              Don't attempt to breach the security of the service, access other users' data, misuse
              the AI coach, scrape or copy the food database, or use Kōre for anything unlawful. We
              may suspend or close accounts that do.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Your content</h2>
            <p>
              The data you log belongs to you. You give us permission to store and process it purely
              to provide the service, as described in the Privacy Policy. You can delete it at any
              time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Our content</h2>
            <p>
              The Kōre name, design, food database and everything else that makes up the product
              belong to us. Don't copy or reuse them without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any loss or damage
              arising from your use of Kōre, including decisions you make based on information in the
              app. Nothing in these terms limits liability that cannot legally be limited. See the
              Health Disclaimer — it forms part of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Changes and contact</h2>
            <p>
              We may update these terms as the product evolves; material changes will be flagged in
              the app. Questions to <span className="text-accent">{CONTACT_EMAIL}</span>. These terms
              are governed by the laws of England and Wales.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/disclaimer" className="hover:text-foreground">Health Disclaimer</Link>
          <Link to="/" className="hover:text-foreground">Home</Link>
        </div>
      </div>
    </div>
  );
}
