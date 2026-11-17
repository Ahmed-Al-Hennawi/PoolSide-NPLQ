"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALLOW_GUEST_MOCK_TESTS } from "../lib/settings";
import {
  Shell,
  Eyebrow,
  Clock,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  HeartPulse,
  Waves,
  useAccount,
  SignIn,
} from "./site";
export const testModes = [
  {
    id: "full",
    title: "The full theory rehearsal",
    description:
      "Work through both written sections in one sitting. Each section is scored separately, just like your sample assessment.",
    count: 48,
    minutes: 72,
    label: "THE COMPLETE PICTURE",
    featured: true,
  },
  {
    id: "safety",
    title: "The lifeguard & the law",
    description:
      "Pool safety, supervision, communication and your responsibilities.",
    count: 24,
    minutes: 36,
    label: "SECTION 1",
    icon: ShieldCheck,
  },
  {
    id: "first-aid",
    title: "CPR & first aid",
    description:
      "Recognition, priorities and the decisions that matter in an emergency.",
    count: 24,
    minutes: 36,
    label: "SECTION 3",
    icon: HeartPulse,
  },
  {
    id: "quick",
    title: "A little daily practice",
    description:
      "Ten mixed questions to find a gap or reinforce what you know.",
    count: 10,
    minutes: 12,
    label: "QUICK CHECK",
    icon: Clock,
  },
  {
    id: "rescue",
    title: "Rescue knowledge check",
    description:
      "Extra theory practice for practical skills. This is not a practical assessment.",
    count: 12,
    minutes: 18,
    label: "SECTION 2 · EXTRA PRACTICE",
    icon: Waves,
  },
];
export function Practice() {
  const { data, error } = useAccount();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function start(mode: string) {
    setBusy(mode);
    setMessage("");
    try {
      const r = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      router.push("/practice/" + d.id);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to start");
      setBusy("");
    }
  }
  return (
    <Shell>
      <main id="main" className="wrap page-main">
        <div className="page-intro">
          <Eyebrow>MAKE YOUR KNOWLEDGE COUNT</Eyebrow>
          <h1>
            A practice run.
            <br />
            <em>A clearer picture.</em>
          </h1>
          <p>
            Test what you remember. See what needs another look. Build
            confidence with each attempt.
          </p>
        </div>
        <div className="assessment-format">
          <ClipboardCheck />
          <div>
            <strong>Familiar format. Original questions.</strong>
            <p>
              Based on your May 2026 sample: four options, one answer. Written
              sections 1 and 3 each have 24 questions, 36 minutes and a 17/24
              benchmark. These are independent practice questions, not official
              assessment items.
            </p>
          </div>
        </div>
        {!data?.user && (
          <div className="signin-strip">
            <div>
              <strong>{ALLOW_GUEST_MOCK_TESTS ? "Jump straight into practice." : "Your revision deserves a record."}</strong>
              <p>
                {ALLOW_GUEST_MOCK_TESTS
                  ? "No sign-in needed. Take a test and reveal answers afterwards. Guest tests stay available in this browser for up to 24 hours; sign in before starting to keep a permanent history."
                  : "Sign in to take tests, save results and review every answer."}
              </p>
            </div>
            <SignIn returnTo="/practice" />
          </div>
        )}
        {(message || error) && (
          <p className="error-box" role="alert">
            {message || error}
          </p>
        )}
        <div className="test-grid">
          {testModes.map((m) => (
            <article
              className={"test-card " + (m.featured ? "featured" : "")}
              key={m.id}
            >
              <div className="eyebrow">{m.label}</div>
              <h2>{m.title}</h2>
              <p>{m.description}</p>
              <div className="test-facts">
                <span>
                  <ClipboardCheck size={16} />
                  {m.count} questions
                </span>
                <span>
                  <Clock size={16} />
                  {m.minutes} minutes
                </span>
              </div>
              <button
                className={"button " + (m.featured ? "light" : "secondary")}
                disabled={(!ALLOW_GUEST_MOCK_TESTS && !data?.user) || !!busy}
                onClick={() => start(m.id)}
              >
                {busy === m.id ? "Preparing your test…" : "Start this test"}
                <ArrowRight size={18} />
              </button>
              {m.featured && (
                <div className="featured-ring" aria-hidden="true">
                  <span />
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="two-column notes-grid">
          <section>
            <h3>Make it feel like the real thing.</h3>
            <p>
              Put your notes away. Choose the single best answer. You can move
              between questions and flag any to revisit before submitting.
              Unanswered questions score zero.
            </p>
          </section>
          <section>
            <h3>Your results are a starting point.</h3>
            <p>
              After submitting, reveal answers and explanations, revisit linked
              lessons and try again. An online score cannot assess your water
              skills or certify readiness.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
