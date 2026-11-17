import Link from "next/link";
import {
  Shell,
  Eyebrow,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  MessageCircle,
  Clock,
} from "../components/site";
import { AnimatedPoolHero } from "../components/animated-pool";
import { sections, lessons } from "../lib/content";
export default function Home() {
  return (
    <Shell>
      <main id="main" className="landing-page">
        <AnimatedPoolHero />
        <div className="subject-strip">
          <span>YOUR NEXT SESSION</span>
          <b>Pool safety</b>
          <i>+</i>
          <b>Rescue skills</b>
          <i>+</i>
          <b>CPR & first aid</b>
        </div>
        <section className="wrap pathways">
          <div className="section-heading">
            <div>
              <Eyebrow>PICK A STARTING POINT</Eyebrow>
              <h2>What are we working on?</h2>
            </div>
            <p>
              A quick refresher or a full practice run.
              <br />
              Choose what you need today.
            </p>
          </div>
          <div className="path-grid">
            <Link href="/learn" className="path-card">
              <div className="path-top">
                <BookOpen />
                <span>01 / LEARN</span>
              </div>
              <h3>The revision library</h3>
              <p>
                A searchable revision library, organised around the three NPLQ
                sections. Pick up exactly where you need to.
              </p>
              <span className="path-bottom">
                Explore the learning library
                <ArrowUpRight />
              </span>
            </Link>
            <Link href="/practice" className="path-card">
              <div className="path-top">
                <ClipboardCheck />
                <span>02 / PRACTISE</span>
              </div>
              <h3>Mock assessments</h3>
              <p>
                Timed practice in the format of your sample paper, with saved
                results and explanations after you submit.
              </p>
              <span className="path-bottom">
                Take a mock test
                <ArrowUpRight />
              </span>
            </Link>
            <Link href="/interview" className="path-card">
              <div className="path-top">
                <MessageCircle />
                <span>03 / PREPARE</span>
              </div>
              <h3>Interview practice</h3>
              <p>
                Talk through realistic situations and build clear answers that
                show how you think as a lifeguard.
              </p>
              <span className="path-bottom">
                Practise your answers
                <ArrowUpRight />
              </span>
            </Link>
          </div>
        </section>
        <section className="revision-banner wrap">
          <div className="revision-icon">
            <Clock size={36} />
          </div>
          <div>
            <Eyebrow>A LITTLE SHORT ON TIME?</Eyebrow>
            <h2>Two days. A focused plan.</h2>
            <p>
              Prioritise the essentials, find your gaps and leave time to
              practise out loud.
            </p>
          </div>
          <Link href="/plan" className="button light">
            My two-day revision plan
            <ArrowRight size={18} />
          </Link>
        </section>
        <section className="wrap curriculum">
          <div className="section-heading">
            <div>
              <Eyebrow>YOUR LEARNING LIBRARY</Eyebrow>
              <h2>All three sections. One place.</h2>
            </div>
            <Link href="/learn" className="text-link">
              Browse all {lessons.length} lessons
              <ArrowRight size={16} />
            </Link>
          </div>
          {sections.map((s, i) => (
            <Link
              key={s.id}
              href={"/learn/" + s.lessons[0]?.id}
              className="curriculum-row"
            >
              <span className="section-number">0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
              <span className="lesson-count">{s.lessons.length} lessons</span>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </section>
        <section className="wrap closing-note">
          <BookOpen size={24} />
          <div>
            <h3>A study companion, wherever you are in your training.</h3>
            <p>
              Use Poolside to revisit what you have learned or get familiar with
              the topics before your course. Your approved manual, trainer
              guidance and employer’s procedures remain your reference for
              practical work.
            </p>
          </div>
        </section>
      </main>
    </Shell>
  );
}
