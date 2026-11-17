import Link from "next/link";
import { Shell, Eyebrow, ArrowRight, Clock } from "../../components/site";
const days = [
  {
    title: "Day one",
    subtitle: "Reconnect with the essentials.",
    items: [
      [
        "20 min",
        "Find your starting point",
        "Take a short knowledge check without notes. Use the result to identify what needs attention.",
        "/practice",
      ],
      [
        "45–60 min",
        "Pool safety & the lifeguard’s role",
        "Revisit supervision, vigilance, the NOP, EAP, communication and your responsibilities. Explain each concept out loud.",
        "/learn",
      ],
      [
        "45–60 min",
        "CPR & first aid",
        "Refresh recognition and priorities. Pay attention to the current guidance notes; ask your trainer about any conflict with older materials.",
        "/learn",
      ],
      [
        "20 min",
        "Revisit rescue principles",
        "Review safe choices, equipment, spinal concerns and teamwork. Arrange supervised practical practice if you need it.",
        "/learn",
      ],
    ],
  },
  {
    title: "Day two",
    subtitle: "Recall, rehearse, then rest.",
    items: [
      [
        "72 min",
        "Complete a theory rehearsal",
        "Use the full practice test, without notes. Check the results for each written section separately.",
        "/practice",
      ],
      [
        "30 min",
        "Close the gaps",
        "Review explanations for incorrect and unanswered questions. Revisit the linked lessons and explain why each answer is right.",
        "/dashboard",
      ],
      [
        "30 min",
        "Practise your interview",
        "Answer five questions out loud. Prepare two honest STAR examples and a question about training at the facility.",
        "/interview",
      ],
      [
        "15 min",
        "Get ready for the day",
        "Check travel, timings, certificate, ID and any requested kit. Finish revision early enough to rest.",
        "/interview",
      ],
    ],
  },
];
export default function Plan() {
  return (
    <Shell>
      <main id="main" className="wrap page-main">
        <Eyebrow>SMALL STEPS. A FOCUSED FINISH.</Eyebrow>
        <h1>
          Your two-day
          <br />
          <em>revision reset.</em>
        </h1>
        <p className="lead narrow">
          You have already put in the work to qualify. Use these two days to
          retrieve the knowledge, find the gaps and practise explaining your
          decisions.
        </p>
        <div className="study-callout">
          <Clock size={22} />
          <p>
            These are suggested study blocks, not a readiness guarantee. Take
            breaks, adjust to your weak areas and confirm the employer’s test
            format.
          </p>
        </div>
        <div className="plan-days">
          {days.map((day, i) => (
            <section key={day.title}>
              <div className="plan-day-heading">
                <span>0{i + 1}</span>
                <div>
                  <h2>{day.title}</h2>
                  <p>{day.subtitle}</p>
                </div>
              </div>
              {day.items.map(([time, title, body, link]) => (
                <Link href={link} className="plan-block" key={title}>
                  <span>{time}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  <ArrowRight size={17} />
                </Link>
              ))}
            </section>
          ))}
        </div>
        <div className="closing-note">
          <strong>On the day</strong>
          <p>
            Arrive with time to spare. Listen to the instructions, ask if
            something is unclear, and be honest about what you know. For
            practical tasks, follow your approved training and the assessor’s
            instructions.
          </p>
        </div>
      </main>
    </Shell>
  );
}
