"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Shell, Clock, ArrowRight, Eyebrow } from "./site";
import { testModes } from "./practice";
export function TestRunner({ id }: { id: string }) {
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answersRef = useRef<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("Answers save automatically");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const expiredSent = useRef(false);
  const pendingSaves = useRef(0);
  async function load() {
    try {
      const r = await fetch("/api/attempts/" + id);
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      setTest(d);
      setAnswers(d.answers);
      answersRef.current = d.answers;
      setRemaining(Math.max(0, Math.ceil((d.deadline - Date.now()) / 1000)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load test");
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  function save(next: Record<string, number>, submit = false) {
    if (submit) setBusy(true);
    pendingSaves.current += 1;
    setSaveState("Saving…");
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          const r = await fetch("/api/attempts/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: next, submit }),
          });
          const d: any = await r.json();
          if (!r.ok) throw Error(d.error);
          if (pendingSaves.current === 1) setSaveState("All answers saved");
          setError("");
          if (d.submittedAt) {
            setTest(d);
            setConfirm(false);
          }
          return d;
        } catch (e) {
          setSaveState("Changes not saved");
          setError(
            e instanceof Error ? e.message : "Unable to save. Try again.",
          );
        } finally {
          pendingSaves.current -= 1;
          if (pendingSaves.current > 0) setSaveState("Saving…");
          if (submit) setBusy(false);
        }
      });
  }
  useEffect(() => {
    if (!test || test.submittedAt) return;
    const timer = setInterval(() => {
      const r = Math.max(0, Math.ceil((test.deadline - Date.now()) / 1000));
      setRemaining(r);
      if (r === 0 && !expiredSent.current) {
        expiredSent.current = true;
        save(answersRef.current, true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [test?.deadline, test?.submittedAt]);
  useEffect(() => {
    if (!test || test.submittedAt) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (pendingSaves.current > 0 || saveState === "Changes not saved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [test?.submittedAt, saveState]);
  useEffect(() => {
    if (!confirm) return;
    const before = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        setConfirm(false);
        return;
      }
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            ".confirm-modal button:not(:disabled)",
          ),
        );
        if (!nodes.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      before?.focus();
    };
  }, [confirm, busy]);
  const mode = testModes.find((m) => m.id === test?.mode);
  const q = test?.questions[current];
  const answered = Object.keys(answers).length;
  if (!test)
    return (
      <Shell>
        <main id="main" className="wrap page-main">
          <p role="status">{error || "Opening your test…"}</p>
          {error && (
            <Link className="button primary" href="/practice">
              Back to mock tests
            </Link>
          )}
        </main>
      </Shell>
    );
  if (test.submittedAt) {
    const result = test.result;
    const percentage = Math.round((result.score / result.total) * 100);
    const formal = ["full", "safety", "first-aid"].includes(test.mode);
    const benchmark =
      formal && result.sections.every((s: any) => s.score >= 17);
    return (
      <Shell>
        <main id="main" className="wrap page-main result-page">
          <Link className="back-link" href={test.guest ? "/practice" : "/dashboard"}>
            {test.guest ? "← Mock tests" : "← My results"}
          </Link>
          <Eyebrow>ANOTHER STEP FORWARD</Eyebrow>
          <h1>Your practice, reviewed.</h1>
          {test.guest && <p className="lead">Guest result · available in this browser for up to 24 hours. It is not added to an account history.</p>}
          <p className="lead">
            {mode?.title} ·{" "}
            {new Date(test.submittedAt).toLocaleDateString("en-GB")}
          </p>
          <div className="result-summary">
            <div
              className="score-ring"
              style={{ "--score": percentage + "%" } as React.CSSProperties}
            >
              <div>
                <strong>{percentage}%</strong>
                <span>
                  {result.score} / {result.total} correct
                </span>
              </div>
            </div>
            <div>
              <span className={"result-badge " + (benchmark ? "good" : "")}>
                {formal
                  ? benchmark
                    ? "Practice benchmark reached"
                    : "Keep building your knowledge"
                  : "Knowledge check complete"}
              </span>
              <h2>
                {percentage >= 70
                  ? "Keep the momentum."
                  : "Every gap is a place to start."}
              </h2>
              <p>
                Use your answers to guide the next revision session. This result
                is for practice and is not an official pass or qualification.
              </p>
              {result.sections.map((s: any) => (
                <div className="section-score" key={s.id}>
                  <span>
                    {s.id === "safety"
                      ? "Pool safety"
                      : s.id === "first-aid"
                        ? "CPR & first aid"
                        : "Rescue knowledge"}
                  </span>
                  <strong>
                    {s.score}/{s.total}
                  </strong>
                  <span>{formal ? "Target: 17/24" : ""}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="button-row">
            <button
              className="button primary"
              onClick={() => setRevealed(!revealed)}
            >
              <Eye size={18} />
              {revealed ? "Hide answers" : "Reveal answers & explanations"}
            </button>
            <Link className="button secondary" href="/practice">
              <RotateCcw size={17} />
              Try another test
            </Link>
          </div>
          {revealed && (
            <section className="answer-review">
              <div className="section-heading">
                <h2>Understand every answer.</h2>
                <label>
                  Show{" "}
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                  >
                    <option value="all">All questions</option>
                    <option value="incorrect">Incorrect & unanswered</option>
                  </select>
                </label>
              </div>
              {test.questions.map((item: any, i: number) => {
                const correct = test.answers[item.id] === item.correct;
                if (reviewFilter === "incorrect" && correct) return null;
                return (
                  <article
                    className={
                      "review-question " + (correct ? "correct" : "incorrect")
                    }
                    key={item.id}
                  >
                    <div className="review-status">
                      {correct ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        <XCircle size={19} />
                      )}
                      Question {i + 1} ·{" "}
                      {correct
                        ? "Correct"
                        : test.answers[item.id] === undefined
                          ? "Unanswered"
                          : "Needs a revisit"}
                    </div>
                    <h3>{item.question}</h3>
                    <p>
                      <strong>Your answer:</strong>{" "}
                      {item.options[test.answers[item.id]] ||
                        "No answer selected"}
                    </p>
                    {!correct && (
                      <p>
                        <strong>Correct answer:</strong>{" "}
                        {item.options[item.correct]}
                      </p>
                    )}
                    <div className="explanation">{item.explanation}</div>
                    <Link href={"/learn/" + item.lessonId}>
                      Revisit this topic <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </section>
          )}
        </main>
      </Shell>
    );
  }
  return (
    <Shell>
      <main id="main" className="wrap page-main test-runner">
        {test.guest && <p className="muted">Guest practice · keep this page or bookmark it to return in this browser within 24 hours. Sign in before starting a future test to save it to your account.</p>}
        <div className="test-runner-heading">
          <div>
            <Eyebrow>YOUR PRACTICE SESSION</Eyebrow>
            <h1>{mode?.title}</h1>
          </div>
          <div
            className={"timer " + (remaining < 120 ? "urgent" : "")}
            aria-label="Time remaining"
          >
            <Clock size={19} />
            {Math.floor(remaining / 60)
              .toString()
              .padStart(2, "0")}
            :{(remaining % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <div className="test-progress">
          <div style={{ width: (answered / test.total) * 100 + "%" }} />
        </div>
        <div className="test-meta">
          <span>
            {answered} of {test.total} answered
          </span>
          <span role="status">{saveState}</span>
        </div>
        {error && (
          <div className="error-box" role="alert">
            {error}
            <button onClick={() => save(answersRef.current, remaining === 0)}>
              Retry saving
            </button>
          </div>
        )}
        <div className="test-layout">
          <section className="question-card">
            <div className="question-overline">
              <span>
                QUESTION {current + 1} OF {test.total}
              </span>
              <button
                className={flags.includes(q.id) ? "flagged" : ""}
                onClick={() =>
                  setFlags(
                    flags.includes(q.id)
                      ? flags.filter((f) => f !== q.id)
                      : [...flags, q.id],
                  )
                }
                aria-pressed={flags.includes(q.id)}
              >
                <Flag size={15} />
                {flags.includes(q.id) ? "Flagged" : "Flag for review"}
              </button>
            </div>
            <fieldset>
              <legend>{q.question}</legend>
              <p className="muted">Select one answer.</p>
              <div className="answers">
                {q.options.map((option: string, i: number) => (
                  <label
                    key={i}
                    className={
                      "answer-option " + (answers[q.id] === i ? "chosen" : "")
                    }
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === i}
                      disabled={busy || remaining === 0}
                      onChange={() => {
                        const next = { ...answersRef.current, [q.id]: i };
                        answersRef.current = next;
                        setAnswers(next);
                        save(next);
                      }}
                    />
                    <span className="answer-letter">{"ABCD"[i]}</span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="question-controls">
              <button
                className="button secondary"
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
              >
                <ChevronLeft size={17} />
                Previous
              </button>
              {current < test.total - 1 ? (
                <button
                  className="button primary"
                  onClick={() => setCurrent(current + 1)}
                >
                  Next question
                  <ChevronRight size={17} />
                </button>
              ) : (
                <button
                  className="button primary"
                  onClick={() => setConfirm(true)}
                >
                  Review & submit
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </section>
          <aside className="question-nav">
            <h3>Your questions</h3>
            <div className="question-grid">
              {test.questions.map((item: any, i: number) => (
                <button
                  key={item.id}
                  aria-label={
                    "Question " +
                    (i + 1) +
                    (answers[item.id] !== undefined ? ", answered" : "") +
                    (flags.includes(item.id) ? ", flagged" : "")
                  }
                  aria-current={current === i ? "step" : undefined}
                  className={
                    (current === i ? "current " : "") +
                    (answers[item.id] !== undefined ? "answered " : "") +
                    (flags.includes(item.id) ? "has-flag" : "")
                  }
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p>
              <span className="legend-dot" /> Answered{" "}
              <span className="legend-dot flag-dot" /> Flagged
            </p>
            <button
              className="button secondary"
              onClick={() => setConfirm(true)}
            >
              Finish test
              <ArrowRight size={16} />
            </button>
            <small>
              The timer continues if you leave. Saved answers are marked when
              time runs out.
            </small>
          </aside>
        </div>
        {confirm && (
          <div className="modal-backdrop">
            <section
              className="confirm-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="submit-title"
            >
              <AlertCircle size={28} />
              <h2 id="submit-title">Ready to see your results?</h2>
              <p>
                You have answered {answered} of {test.total} questions.{" "}
                {test.total - answered > 0
                  ? `${test.total - answered} unanswered questions will score zero.`
                  : "All questions have an answer."}{" "}
                {flags.length > 0
                  ? `${flags.length} questions are flagged for review.`
                  : ""}
              </p>
              <p>You cannot change answers after submitting.</p>
              <div className="button-row">
                <button
                  className="button secondary"
                  autoFocus
                  disabled={busy}
                  onClick={() => setConfirm(false)}
                >
                  Keep reviewing
                </button>
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={() => save(answersRef.current, true)}
                >
                  {busy ? "Submitting…" : "Submit test"}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </Shell>
  );
}
