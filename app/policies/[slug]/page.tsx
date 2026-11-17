import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, Eyebrow } from "../../../components/site";
const policies: Record<
  string,
  {
    title: string;
    intro: string;
    sections: { heading: string; body: string[] }[];
  }
> = {
  privacy: {
    title: "Your learning. Your data.",
    intro:
      "Privacy notice · updated 17 November 2026. Poolside is a private, independent study site maintained by its site owner. It is not an RLSS UK service.",
    sections: [
      {
        heading: "What the site uses",
        body: [
          "ChatGPT sign-in supplies a site-specific user identifier, your email address and, when available, your name. The application uses the identifier to keep your records separate from other users. Your name and email are displayed in your signed-in account; the study database does not store them.",
          "The study database stores the lessons you mark complete and your practice tests: question snapshots, answers, start and submission times, time limits and scores. These records provide the progress, resume and answer-review features you request.",
          "When guest mock tests are enabled, a random essential cookie keeps your anonymous tests separate. Guest attempts contain no name or email, are accessible for up to 24 hours, and are removed from the database when a new test is started after they expire. Clearing the cookie removes your ability to reopen those guest results. Signing in does not transfer guest results into an account.",
        ],
      },
      {
        heading: "Where it is handled",
        body: [
          "Sites provides hosting and authentication. Study records are held in the hosted Cloudflare D1 database. These platform services process requests to run the site. Their own privacy notices apply to their services, including authentication and operational logging.",
          "Poolside has no advertising, marketing mailing list, third-party analytics or payments. It does not request health details, certificates, your date of birth or employer information.",
        ],
      },
      {
        heading: "Retention and control",
        body: [
          "Saved study records remain until you delete them or the site is removed. In My progress you can export your records and permanently delete your study data. Deleting study data does not delete your ChatGPT account or platform security logs.",
          "Account records are returned only to their signed-in owner. Guest tests require the browser's private guest cookie. The site owner and hosting administrators may have administrative access to the service.",
        ],
      },
      {
        heading: "Before wider use",
        body: [
          "This version is private for the site owner’s study. Before inviting other users or making it public, the operator must provide their real identity and contact details, confirm applicable privacy obligations and review the hosting providers’ terms. No invented business or contact details are supplied.",
        ],
      },
    ],
  },
  terms: {
    title: "A companion to your training.",
    intro:
      "Terms of use · updated 15 November 2026. Poolside provides independent revision materials and practice questions for personal study.",
    sections: [
      {
        heading: "What Poolside does",
        body: [
          "The site organises revision topics, offers original mock questions and lets you save learning progress and practice results. Access is currently private and free. There are no subscriptions, purchases or refunds to administer.",
          "The mock format is informed by the supplied RLSS UK sample theory assessment. The questions are independently written. Practice scores are not official assessment results, a qualification or a guarantee of passing an interview.",
        ],
      },
      {
        heading: "Use current approved training",
        body: [
          "Revision cannot replace an approved course, supervised practical training, assessment, ongoing staff training or your employer’s operating procedures. For operational decisions, follow current approved training and your facility’s NOP and EAP.",
          "Guidance can change. The sources page identifies the basis and review date for this version. If something conflicts with your current approved materials, check with your trainer before using it in practice.",
        ],
      },
      {
        heading: "Names and source material",
        body: [
          "NPLQ and RLSS UK are referenced to identify the qualification and source guidance. Poolside is not affiliated with, approved by or endorsed by RLSS UK. The site uses its own branding, illustration, summaries and practice questions.",
          "The original supplied slides and sample assessment remain the property of their respective rights holders. They are not included as downloadable assets in this site.",
        ],
      },
      {
        heading: "Fair use of the service",
        body: [
          "Use your own sign-in. Do not try to access someone else’s results, interfere with the service or misrepresent a practice score as an official qualification. The site does not offer certificates.",
        ],
      },
    ],
  },
  cookies: {
    title: "Only what the service needs.",
    intro: "Cookies and storage · updated 17 November 2026.",
    sections: [
      {
        heading: "Authentication and essential operation",
        body: [
          "The hosting and sign-in platform may use cookies needed to establish and maintain your secure session and enforce access permissions. Poolside does not set its own analytics, advertising or marketing cookies.",
          "When guest tests are enabled, Poolside sets an essential poolside_guest cookie for up to 24 hours. It contains a random private access token, uses HttpOnly and SameSite protections, and is Secure on HTTPS. It lets this browser save and review its own anonymous test answers without an account.",
          "Answers and completed lessons are stored in the study database, not in browser local storage. Temporary interface state, such as a search query or flagged question, is held in the current page’s memory.",
        ],
      },
      {
        heading: "No optional tracking",
        body: [
          "There is no optional tracking to enable in this version, so the application does not display an accept-all cookie banner. If optional tracking is introduced, the notice and controls must be reviewed before it is enabled.",
          "Use the Sign out control in My progress to end your sign-in session. Browser controls can remove cookies; doing so may sign you out.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Built to be easy to use.",
    intro:
      "Accessibility information · updated 15 November 2026. Accessibility is part of the design; this is not a claim of independently certified conformance.",
    sections: [
      {
        heading: "Navigation and reading",
        body: [
          "The site uses semantic headings, a skip-to-content link, labelled controls and visible keyboard focus. Learning topics appear in a left-hand menu on wider screens and an expandable contents menu on mobile.",
          "Pages adapt to smaller screens and browser zoom. Colour is accompanied by text or icons for question and result states. Animation is reduced when your device requests reduced motion.",
        ],
      },
      {
        heading: "Practice tests",
        body: [
          "Answer options use native radio controls and can be selected by keyboard. You can jump between numbered questions, flag questions to revisit and review unanswered items before submitting.",
          "Timed mock tests follow the sample assessment timings. The learning library and interview prompts have no time limit. If you need adjustments for an actual assessment, discuss them with your approved training provider before the assessment.",
        ],
      },
      {
        heading: "Known limits",
        body: [
          "This site has not had a full independent assistive-technology audit. The current version is a private study tool. The site owner should provide a support contact and arrange a fuller accessibility review before offering it to a wider audience.",
        ],
      },
    ],
  },
};
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = policies[slug];
  if (!p) notFound();
  return (
    <Shell>
      <main id="main" className="wrap page-main policy-main">
        <Eyebrow>THE DETAILS, IN PLAIN LANGUAGE</Eyebrow>
        <h1>{p.title}</h1>
        <p className="lead">{p.intro}</p>
        {p.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </section>
        ))}
        <p>
          <Link href="/dashboard">Manage your study data</Link> ·{" "}
          <Link href="/sources">View sources and updates</Link>
        </p>
      </main>
    </Shell>
  );
}
