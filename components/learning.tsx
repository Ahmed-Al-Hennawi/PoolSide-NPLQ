"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import {
  Header,
  Footer,
  Eyebrow,
  ArrowRight,
  Clock,
  BookOpen,
  useAccount,
  SignIn,
} from "./site";
import { sections, lessons } from "../lib/content";
export function Learning({ slug }: { slug?: string }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { data, refresh } = useAccount();
  const lesson = lessons.find((l) => l.id === slug);
  const index = lessons.findIndex((l) => l.id === slug);
  const visible = sections.map((s) => ({
    ...s,
    lessons: s.lessons.filter((l) =>
      (l.title + " " + l.summary + " " + l.blocks.map((b) => b.body).join(" "))
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  }));
  async function complete() {
    if (!lesson) return;
    setSaving(true);
    try {
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          completed: !data?.completed.includes(lesson.id),
        }),
      });
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      await refresh();
      setMessage("Progress saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save");
    }
    setSaving(false);
  }
  return (
    <>
      <Header />
      <div className="docs-mobile-bar">
        <span>Learning library</span>
        <button onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? <X size={18} /> : <Menu size={18} />} Contents
        </button>
      </div>
      <div className="docs-shell">
        <aside
          className={"docs-sidebar " + (open ? "open" : "")}
          aria-label="Learning sections"
        >
          <Link href="/learn" className="sidebar-title">
            <BookOpen size={18} />
            Learning library
          </Link>
          <label className="search-box">
            <Search size={16} />
            <input
              placeholder="Search lessons…"
              aria-label="Search lessons"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          {visible.map(
            (s, i) =>
              s.lessons.length > 0 && (
                <div className="sidebar-section" key={s.id}>
                  <p>
                    <span>0{i + 1}</span>
                    {s.title}
                  </p>
                  {s.lessons.map((l) => (
                    <Link
                      href={"/learn/" + l.id}
                      onClick={() => setOpen(false)}
                      key={l.id}
                      className={slug === l.id ? "selected" : ""}
                    >
                      <span>{l.title}</span>
                      {data?.completed.includes(l.id) ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <ChevronRight size={13} />
                      )}
                    </Link>
                  ))}
                </div>
              ),
          )}
          {visible.every((s) => s.lessons.length === 0) && (
            <p className="muted">No matching lessons. Try “rescue” or “CPR”.</p>
          )}
          <Link className="sidebar-plan" href="/plan">
            <Clock size={17} />
            <span>
              Test coming up?<strong>Open your two-day plan →</strong>
            </span>
          </Link>
        </aside>
        <main id="main" className="docs-main">
          {lesson ? (
            <>
              <div className="breadcrumbs">
                <Link href="/learn">Learn</Link>
                <ChevronRight size={12} />
                <span>{lesson.sectionTitle}</span>
              </div>
              <Eyebrow>REVISION NOTES</Eyebrow>
              <h1>{lesson.title}</h1>
              <p className="article-summary">{lesson.summary}</p>
              <div className="article-meta">
                <Clock size={15} />
                {lesson.minutes} min read<span>•</span>
                <span>
                  {data?.completed.includes(lesson.id)
                    ? "Completed"
                    : "Read · recall · revisit"}
                </span>
              </div>
              <div className="study-callout">
                <Bookmark size={19} />
                <p>
                  <strong>Make it stick.</strong> Read the section, look away,
                  then explain the key points in your own words.
                </p>
              </div>
              <article className="lesson-body">
                {lesson.blocks.map((b, i) => (
                  <section key={i} id={"part-" + i}>
                    <h2>{b.heading}</h2>
                    {b.body
                      .split("\n")
                      .filter(Boolean)
                      .map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    {b.bullets && (
                      <ul>
                        {b.bullets.map((v, j) => (
                          <li key={j}>{v}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </article>
              <div className="practice-note">
                <strong>Knowledge is one part of readiness.</strong>
                <p>
                  Practise physical techniques with a qualified trainer. Follow
                  the current approved syllabus and your pool’s NOP and EAP.
                  Check{" "}
                  <Link href="/sources">sources and guidance updates</Link>{" "}
                  before practical use.
                </p>
              </div>
              <div className="complete-lesson">
                {data?.user ? (
                  <button
                    className="button primary"
                    disabled={saving}
                    onClick={complete}
                  >
                    <CheckCircle2 size={18} />
                    {data.completed.includes(lesson.id)
                      ? "Mark as incomplete"
                      : "Mark lesson complete"}
                  </button>
                ) : (
                  <SignIn
                    returnTo={"/learn/" + lesson.id}
                    label="Sign in to save progress"
                  />
                )}
                <span role="status">{message}</span>
              </div>
              <div className="lesson-pagination">
                {index > 0 ? (
                  <Link href={"/learn/" + lessons[index - 1].id}>
                    <ArrowLeft size={16} />
                    <div>
                      <small>PREVIOUS LESSON</small>
                      {lessons[index - 1].title}
                    </div>
                  </Link>
                ) : (
                  <span />
                )}
                {index < lessons.length - 1 && (
                  <Link href={"/learn/" + lessons[index + 1].id}>
                    <div>
                      <small>NEXT LESSON</small>
                      {lessons[index + 1].title}
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <Eyebrow>ONE TOPIC AT A TIME</Eyebrow>
              <h1>
                Welcome back
                <br />
                to the essentials.
              </h1>
              <p className="article-summary">
                Your revision library for the pool, the assessment and the
                conversation afterwards. Start from the beginning or jump to the
                part you need.
              </p>
              <div className="study-callout">
                <BookOpen size={22} />
                <p>
                  <strong>New to the NPLQ?</strong> This is a useful
                  introduction to the topics. Qualifying still requires an
                  approved course and assessment.
                </p>
              </div>
              <div className="library-stats">
                <span>
                  <strong>{lessons.length}</strong>focused lessons
                </span>
                <span>
                  <strong>3</strong>core sections
                </span>
                <span>
                  <strong>{data?.completed.length || 0}</strong>completed by you
                </span>
              </div>
              {visible.map((s, i) => (
                <section className="library-section" key={s.id}>
                  <div className="library-section-heading">
                    <span className="section-number">0{i + 1}</span>
                    <div>
                      <h2>{s.title}</h2>
                      <p>{s.description}</p>
                    </div>
                  </div>
                  {s.lessons.map((l) => (
                    <Link
                      key={l.id}
                      className="lesson-row"
                      href={"/learn/" + l.id}
                    >
                      <div>
                        <strong>{l.title}</strong>
                        <p>{l.summary}</p>
                      </div>
                      <span>{l.minutes} min</span>
                      <ChevronRight size={17} />
                    </Link>
                  ))}
                </section>
              ))}
            </>
          )}
        </main>
        {lesson && (
          <aside className="article-toc">
            <p>ON THIS PAGE</p>
            {lesson.blocks.map((b, i) => (
              <a key={i} href={"#part-" + i}>
                {b.heading}
              </a>
            ))}
            <div>
              <ClipboardNote />
            </div>
          </aside>
        )}
      </div>
      <Footer />
    </>
  );
}
function ClipboardNote() {
  return (
    <>
      <strong>Check your recall.</strong>
      <p>Put your revision into practice with a short question set.</p>
      <Link href="/practice">Try a mock test →</Link>
    </>
  );
}
