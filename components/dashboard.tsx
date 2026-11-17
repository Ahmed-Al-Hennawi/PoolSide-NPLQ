"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Download,
  Trash2,
  LogOut,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  Shell,
  Eyebrow,
  useAccount,
  SignIn,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
} from "./site";
import { lessons, sections } from "../lib/content";
import { testModes } from "./practice";
export function Dashboard() {
  const { data, error, refresh } = useAccount();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const completed = data?.attempts.filter((a) => a.submittedAt) || [];
  const active = data?.attempts.filter((a) => !a.submittedAt) || [];
  async function remove() {
    setBusy(true);
    try {
      const r = await fetch("/api/account", { method: "DELETE" });
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      await refresh();
      setConfirm(false);
      setMessage("Your saved results and lesson progress have been deleted.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to delete");
    }
    setBusy(false);
  }
  async function download() {
    setBusy(true);
    try {
      const details = await Promise.all(
        data!.attempts.map(async (a) => {
          const r = await fetch("/api/attempts/" + a.id);
          if (!r.ok) throw Error("Unable to export results");
          return r.json();
        }),
      );
      const file = new Blob(
        [
          JSON.stringify(
            {
              exportedAt: new Date().toISOString(),
              ...data,
              attempts: details,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = "poolside-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Your data export is ready.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to export");
    }
    setBusy(false);
  }
  return (
    <Shell>
      <main id="main" className="wrap page-main">
        <Eyebrow>YOUR PERSONAL REVISION SPACE</Eyebrow>
        <h1>
          A little progress.
          <br />
          <em>Every time you return.</em>
        </h1>
        {!data ? (
          <p role="status">{error || "Loading your progress…"}</p>
        ) : !data.user ? (
          <div className="signin-card">
            <div className="icon-box">
              <BookOpen />
            </div>
            <h2>Keep your learning together.</h2>
            <p>
              Sign in securely with ChatGPT to save completed lessons, keep mock
              tests and revisit your results on any device. No separate password
              needed.
            </p>
            <SignIn />
            <small>
              We store your lesson progress and practice results. No marketing
              emails, advertising or payments.{" "}
              <Link href="/policies/privacy">Read the privacy notice.</Link>
            </small>
          </div>
        ) : (
          <>
            <p className="lead">
              Welcome back, {data.user.name}. Your next step starts here.
            </p>
            <div className="dashboard-stats">
              <div>
                <BookOpen />
                <strong>
                  {data.completed.length}
                  <small> / {lessons.length}</small>
                </strong>
                <span>Lessons completed</span>
              </div>
              <div>
                <ClipboardCheck />
                <strong>{completed.length}</strong>
                <span>Practice tests completed</span>
              </div>
              <div>
                <TrendingUp />
                <strong>
                  {completed.length
                    ? Math.round(
                        completed.reduce(
                          (n, a) => n + (a.score / a.total) * 100,
                          0,
                        ) / completed.length,
                      ) + "%"
                    : "—"}
                </strong>
                <span>Average practice score</span>
              </div>
            </div>
            {active.length > 0 && (
              <section className="dashboard-section">
                <h2>Pick up your practice.</h2>
                {active.map((a) => (
                  <Link
                    className="active-attempt"
                    key={a.id}
                    href={"/practice/" + a.id}
                  >
                    <div>
                      <strong>
                        {testModes.find((m) => m.id === a.mode)?.title}
                      </strong>
                      <p>
                        {Date.now() >= a.deadline
                          ? "Time has ended. Open to see your result."
                          : "Your timer is running. Resume your saved answers."}
                      </p>
                    </div>
                    <ArrowRight />
                  </Link>
                ))}
              </section>
            )}
            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Your learning journey</h2>
                <Link className="text-link" href="/learn">
                  Keep learning
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="progress-cards">
                {sections.map((s) => {
                  const count = s.lessons.filter((l) =>
                    data.completed.includes(l.id),
                  ).length;
                  return (
                    <Link
                      key={s.id}
                      href={
                        "/learn/" +
                        (s.lessons.find((l) => !data.completed.includes(l.id))
                          ?.id || s.lessons[0].id)
                      }
                    >
                      <CheckCircle2 size={21} />
                      <h3>{s.title}</h3>
                      <div className="test-progress">
                        <div
                          style={{
                            width: (count / s.lessons.length) * 100 + "%",
                          }}
                        />
                      </div>
                      <p>
                        {count} of {s.lessons.length} lessons completed
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Your test history</h2>
                <Link className="button secondary" href="/practice">
                  New mock test
                  <ArrowRight size={16} />
                </Link>
              </div>
              {!completed.length ? (
                <div className="empty-state">
                  <ClipboardCheck size={30} />
                  <h3>Your first result belongs here.</h3>
                  <p>Try a quick knowledge check to see where to focus.</p>
                  <Link href="/practice" className="text-link">
                    Choose a practice test
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="results-list">
                  {completed.map((a) => (
                    <Link
                      className="result-row"
                      href={"/practice/" + a.id}
                      key={a.id}
                    >
                      <span className="result-percentage">
                        {Math.round((a.score / a.total) * 100)}
                        <small>%</small>
                      </span>
                      <div>
                        <strong>
                          {testModes.find((m) => m.id === a.mode)?.title}
                        </strong>
                        <span>
                          {new Date(a.submittedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {a.score}/{a.total} correct
                        </span>
                      </div>
                      <span className="result-view">
                        Review answers
                        <ArrowRight size={17} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <section className="account-settings">
              <div>
                <h2>Your data, your choice.</h2>
                <p>Signed in as {data.user.email}</p>
                <p>
                  Export your data or permanently delete your saved results and
                  progress. This does not delete your ChatGPT account.
                </p>
              </div>
              <div className="settings-actions">
                <button
                  className="button secondary"
                  disabled={busy}
                  onClick={download}
                >
                  <Download size={16} />
                  Export my data
                </button>
                <button
                  className="button danger"
                  onClick={() => setConfirm(!confirm)}
                >
                  <Trash2 size={16} />
                  Delete my study data
                </button>
                <a
                  className="text-link"
                  href="/signout-with-chatgpt?return_to=%2F"
                  target="_top"
                >
                  <LogOut size={16} />
                  Sign out
                </a>
              </div>
              {confirm && (
                <div className="delete-confirm">
                  <strong>Delete all saved tests and lesson progress?</strong>
                  <p>
                    This cannot be undone. Export your data first if you want a
                    copy.
                  </p>
                  <div className="button-row">
                    <button
                      className="button secondary"
                      onClick={() => setConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="button danger"
                      disabled={busy}
                      onClick={remove}
                    >
                      {busy ? "Deleting…" : "Permanently delete my data"}
                    </button>
                  </div>
                </div>
              )}
              <p role="status">{message}</p>
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}
