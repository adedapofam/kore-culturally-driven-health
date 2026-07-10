import { Link } from "react-router-dom";
import { Logo } from "@/components/kore/Logo";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-block mb-8"><Logo /></Link>
        <h1 className="font-display text-3xl font-semibold">Health Disclaimer</h1>
        <p className="text-sm text-muted-foreground mt-2">Please read this — it matters.</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Kōre is not medical advice</h2>
            <p>
              Kōre is a wellness and lifestyle tool. Nothing in this app — including messages from
              the AI coach, calorie and macro targets, supplement tracking, or any content anywhere
              in the product — is medical advice, diagnosis or treatment. Kōre is not a doctor,
              dietitian, pharmacist or healthcare provider, and using it does not create any
              clinician–patient relationship.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">AI estimates are estimates</h2>
            <p>
              Calorie, macro and nutritional figures produced by the AI — whether from a text
              description or a photo of your meal — are approximations. Portion sizes, cooking
              methods and ingredients vary enormously, and the AI can be wrong. Treat its numbers as
              a helpful guide, never as precise measurements. If you have a medical condition that
              requires accurate nutritional tracking (such as diabetes), do not rely on Kōre's
              estimates.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Talk to your GP</h2>
            <p>
              Always consult a qualified healthcare professional before changing your diet, starting
              a new training programme, or taking any supplement — especially if you are pregnant,
              breastfeeding, taking medication, or managing any health condition. Supplements can
              interact with medicines. Your GP knows your history; Kōre does not.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">If something is wrong, seek real help</h2>
            <p>
              If you experience symptoms that concern you, contact your GP or call NHS 111. In an
              emergency, call 999. Never delay seeking medical help because of something Kōre said —
              and never ignore professional medical advice in favour of the app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2">Your responsibility</h2>
            <p>
              You use Kōre at your own risk. Train sensibly, eat sensibly, and listen to your body
              over any app — this one included.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms of Use</Link>
          <Link to="/" className="hover:text-foreground">Home</Link>
        </div>
      </div>
    </div>
  );
}
