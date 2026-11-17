import { Shell, Eyebrow, ArrowUpRight } from "../../components/site";
export default function Sources() {
  return (
    <Shell>
      <main id="main" className="wrap page-main policy-main">
        <Eyebrow>KNOW WHERE YOUR NOTES COME FROM</Eyebrow>
        <h1>Sources & updates.</h1>
        <p className="lead">
          Original revision summaries informed by your supplied training
          materials, with current official guidance used to check
          safety-critical topics. Reviewed 15 November 2026.
        </p>
        <div className="study-callout">
          <p>
            <strong>Guidance has changed.</strong> RLSS UK introduced CPR and
            first-aid updates from 1 May 2026 following the Resuscitation
            Council UK 2025 guidelines. Where a previous course or manual
            differs, confirm the approved sequence with your trainer.
          </p>
        </div>
        <section>
          <h2>Your supplied materials</h2>
          <p>
            The source set contains 302 training screenshots and the RLSS UK
            Sample NPLQ Theory Assessment, Edition 2.1, May 2026. All
            screenshots were extracted for review; the library groups related
            topics into focused lessons. The site does not republish the
            original images or sample paper.
          </p>
          <p>
            The sample has two written papers: Section 1 and Section 3. Each
            contains 24 four-option questions with one correct answer, a
            36-minute time allowance and a 17/24 pass mark. Practical skills are
            assessed separately. The full Poolside rehearsal combines the two
            written question sets into a 72-minute practice session and reports
            each section separately.
          </p>
        </section>
        <div className="source-card">
          <h3>RLSS UK · National Pool Lifeguard Qualification</h3>
          <p>
            Qualification overview, course content and assessment context. Refer
            to your approved course materials for the complete syllabus.
          </p>
          <a
            href="https://www.rlss.org.uk/national-pool-lifeguard-qualification"
            target="_blank"
            rel="noreferrer"
          >
            Visit RLSS UK
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="source-card">
          <h3>Resuscitation Council UK · 2025 guidelines</h3>
          <p>
            Current adult basic life support, paediatric life support, drowning
            and first-aid recommendations. General guidance must be applied
            within your specific approved training.
          </p>
          <a
            href="https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines"
            target="_blank"
            rel="noreferrer"
          >
            Read the official guidelines
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="source-card">
          <h3>RLSS UK · May 2026 CPR and first-aid update</h3>
          <p>
            Confirms implementation of revised CPR and first-aid content from 1
            May 2026.
          </p>
          <a
            href="https://www.rlss.org.uk/News/rlss-uk-new-guidelines-cpr-first-aid"
            target="_blank"
            rel="noreferrer"
          >
            Read the update
            <ArrowUpRight size={15} />
          </a>
        </div>
        <section>
          <h2>What the practice results mean</h2>
          <p>
            Safety and first-aid tests use the sample’s 17/24 threshold as a
            practice benchmark. The quick check and rescue knowledge set are
            additional learning exercises and have no official pass status. All
            questions are original, and answer explanations link back to
            relevant revision lessons.
          </p>
          <h2>Practical judgement still matters</h2>
          <p>
            A revision page cannot assess your rescue technique, swimming
            ability, CPR quality or decisions at a real pool. Practise physical
            skills with a qualified trainer and follow your facility’s NOP and
            EAP.
          </p>
        </section>
      </main>
    </Shell>
  );
}
