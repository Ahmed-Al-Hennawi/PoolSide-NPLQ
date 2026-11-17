import Link from "next/link";
import { Shell, Eyebrow } from "../components/site";
export default function NotFound() {
  return (
    <Shell>
      <main id="main" className="wrap page-main">
        <Eyebrow>LET’S GET YOU BACK ON TRACK</Eyebrow>
        <h1>This page is out of the pool.</h1>
        <p className="lead">That lesson or page could not be found.</p>
        <Link href="/learn" className="button primary">
          Back to the learning library →
        </Link>
      </main>
    </Shell>
  );
}
