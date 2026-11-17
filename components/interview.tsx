"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageSquare, RotateCcw } from "lucide-react";
import { Shell, Eyebrow, ArrowRight } from "./site";
const prompts = [
  {
    category: "Motivation",
    question: "Why do you want to be a lifeguard here?",
    points: [
      "Connect your motivation to keeping people safe and helping them enjoy the pool.",
      "Describe what you know about this facility and its customers.",
      "Give an honest example of responsibility, focus or teamwork. Avoid claiming experience you do not have.",
    ],
    follow: "What have you done since qualifying to keep your skills fresh?",
  },
  {
    category: "Supervision",
    question: "What would you do if your view of your zone was blocked?",
    points: [
      "Explain that reliable observation comes first: reposition or use the agreed procedure to restore visibility immediately.",
      "Communicate with your team and follow the NOP if coverage cannot be maintained.",
      "Do not accept a blind spot or leave a zone unprotected.",
    ],
    follow:
      "How would glare, reflections or a busy session affect your scanning?",
  },
  {
    category: "Communication",
    question: "A swimmer repeatedly ignores a pool rule. How do you handle it?",
    points: [
      "Stay calm, clear and respectful. Explain the rule and the safety reason.",
      "Follow the facility’s procedure for escalating persistent behaviour.",
      "Keep supervision covered while you manage the conversation; involve colleagues or a supervisor when needed.",
    ],
    follow:
      "How would you adapt your communication for a child or someone who cannot hear you?",
  },
  {
    category: "Emergency response",
    question:
      "You see a swimmer in difficulty. Talk us through your priorities.",
    points: [
      "Recognise the signs, raise the alarm and follow your training and the EAP.",
      "Choose an appropriate safe rescue response; consider hazards, available equipment and team support.",
      "Arrange further help and casualty care, while other staff maintain safety for remaining swimmers.",
    ],
    follow:
      "What information would you give to the arriving emergency services?",
  },
  {
    category: "Teamwork",
    question: "Tell us about a time you stayed calm under pressure.",
    points: [
      "Use STAR: describe the situation and task briefly.",
      "Spend most of your answer on your own actions and how you communicated.",
      "Explain the outcome and what you learned. A genuine example outside lifeguarding is fine.",
    ],
    follow: "What would you do differently next time?",
  },
  {
    category: "Professional judgement",
    question: "What would you do if you did not feel fit to supervise safely?",
    points: [
      "Tell your supervisor before taking or continuing the position.",
      "Describe how fatigue, illness or distraction can affect vigilance.",
      "Arrange safe coverage and follow workplace procedures; do not hide a safety concern.",
    ],
    follow: "How would you respond if a colleague seemed distracted on duty?",
  },
  {
    category: "Local procedures",
    question: "What would you want to know before your first shift?",
    points: [
      "Read and understand the NOP and EAP, including zones, staffing, rotations and alarms.",
      "Locate rescue and first-aid equipment, communications, emergency exits and access for responders.",
      "Complete induction and confirm any unclear responsibilities with a supervisor.",
    ],
    follow: "What is the difference between the NOP and the EAP?",
  },
  {
    category: "Reflection",
    question: "How will you keep your skills and knowledge up to date?",
    points: [
      "Discuss ongoing staff training, supervised practical practice and feedback.",
      "Check current approved guidance and maintain the training records your employer requires.",
      "Use revision to identify gaps, then ask a trainer to check practical technique.",
    ],
    follow: "Which part of your NPLQ would you most like to practise again?",
  },
];
export function Interview() {
  const [open, setOpen] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <Shell>
      <main id="main" className="wrap page-main interview-page">
        <div className="page-intro">
          <Eyebrow>FROM KNOWING TO EXPLAINING</Eyebrow>
          <h1>
            Show how you think.
            <br />
            <em>In your own words.</em>
          </h1>
          <p>
            You do not need a script. You need clear priorities, honest examples
            and a little practice saying them out loud.
          </p>
        </div>
        <div className="interview-warmup">
          <MessageSquare size={30} />
          <div>
            <h2>Your 60-second warm-up</h2>
            <p>
              Pick a question. Answer out loud before opening the prompts. Then
              try again with a clearer structure.
            </p>
          </div>
          <button
            className="button primary"
            onClick={() => {
              const n = Math.floor(Math.random() * prompts.length);
              setSelected(n);
              setOpen(null);
              document
                .getElementById("prompt-" + n)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <RotateCcw size={16} />
            Pick a question
          </button>
        </div>
        <div className="interview-layout">
          <div>
            {prompts.map((p, i) => (
              <section
                id={"prompt-" + i}
                className={
                  "interview-prompt " + (selected === i ? "spotlight" : "")
                }
                key={p.question}
              >
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")} / {p.category.toUpperCase()}
                </span>
                <h2>{p.question}</h2>
                <button
                  className="reveal-prompt"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  What a strong answer covers
                  <ChevronDown size={18} />
                </button>
                {open === i && (
                  <div className="prompt-answer">
                    <ul>
                      {p.points.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <div>
                      <strong>A follow-up to practise</strong>
                      <p>{p.follow}</p>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
          <aside className="interview-aside">
            <h3>Give your example a shape.</h3>
            <p>For experience questions, use STAR to stay focused.</p>
            {[
              ["S", "Situation", "Set the scene."],
              ["T", "Task", "What was your responsibility?"],
              ["A", "Action", "What did you actually do?"],
              ["R", "Result", "What happened? What did you learn?"],
            ].map(([l, t, d]) => (
              <div className="star-row" key={l}>
                <span>{l}</span>
                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
            <hr />
            <h3>Before you leave home</h3>
            <ul>
              <li>Confirm the time, location and test format.</li>
              <li>
                Check what ID and qualification evidence the employer needs.
              </li>
              <li>Ask whether swimwear or practical kit is required.</li>
              <li>
                Prepare one thoughtful question about induction or ongoing
                training.
              </li>
            </ul>
            <Link href="/plan" className="text-link">
              See the two-day plan
              <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </main>
    </Shell>
  );
}
