import { Link } from "react-router-dom";
import { Logo } from "@/components/kore/Logo";

const EFFECTIVE_DATE = "10 July 2026";
const CONTACT_EMAIL = "adedapofamodun@gmail.com";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-block mb-8"><Logo /></Link>
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Effective date: {EFFECTIVE_DATE}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Who we are</h2>
            <p>
              Kōre is a health optimisation app operated by Adedapo Famodun ("Kōre", "we", "us").
              We are based in the United Kingdom. For anything in this policy, contact us at{" "}
              <span className="text-accent">{CONTACT_EMAIL}</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">What we collect</h2>
            <p className="mb-2">When you use Kōre, we collect:</p>
            <p>
              <strong>Account data</strong> — your email address and encrypted password.{" "}
              <strong>Profile data</strong> — your name, age, weight, height, health goal, activity
              level, training schedule and cuisine preferences.{" "}
              <strong>Health tracking data</strong> — the meals, workouts, supplements, water intake
              and daily check-ins (including mood and notes) that you log.{" "}
              <strong>Coach conversations</strong> — messages you send to the AI coach and any meal
              photos you upload for analysis.
            </p>
            <p className="mt-2">
              Some of this is health-related information, which UK data protection law treats as
              special category data. We collect it only because it is the entire purpose of the app,
              and only with your explicit consent, which you give when creating your account. You can
              withdraw that consent at any time by deleting your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Where your data lives</h2>
            <p>
              Your data is stored with Supabase on servers located in London, United Kingdom. Data is
              encrypted in transit. Access is protected by row-level security, meaning your records
              are only readable by your authenticated account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">AI processing</h2>
            <p>
              The AI coach and meal photo analysis are powered by Google's Gemini API. When you send
              a message to the coach or upload a meal photo, that content (plus a summary of your
              daily targets and totals) is sent to Google for processing. During our beta, we use
              Google's free API tier, and under Google's terms content sent on that tier may be used
              by Google to improve its services. Do not share anything with the coach that you would
              not want processed this way. We will move to a paid tier with stricter data handling
              before public launch.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">What we never do</h2>
            <p>
              We do not sell your data. We do not share it with advertisers. We do not use it for any
              purpose other than operating and improving Kōre.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Your rights</h2>
            <p>
              Under UK GDPR you can ask us for a copy of your data, ask us to correct it, or ask us
              to delete it entirely. Email <span className="text-accent">{CONTACT_EMAIL}</span> and
              we will act on your request within 30 days. You also have the right to complain to the
              Information Commissioner's Office (ico.org.uk).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Retention</h2>
            <p>
              We keep your data for as long as you have an account. If you delete your account, your
              data is permanently removed from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Age requirement</h2>
            <p>Kōre is for adults. You must be at least 18 years old to create an account.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Changes</h2>
            <p>
              If we change this policy in a way that matters, we will tell you in the app before the
              change takes effect. This is a beta product and this policy will evolve with it.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex gap-4 text-xs text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground">Terms of Use</Link>
          <Link to="/disclaimer" className="hover:text-foreground">Health Disclaimer</Link>
          <Link to="/" className="hover:text-foreground">Home</Link>
        </div>
      </div>
    </div>
  );
}
