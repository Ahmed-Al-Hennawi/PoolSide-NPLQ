"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Menu,
  X,
  LifeBuoy,
  UserRound,
  Waves,
  Check,
  Clock,
  ShieldCheck,
  MessageCircle,
  HeartPulse,
} from "lucide-react";
export {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  LifeBuoy,
  Waves,
  Check,
  Clock,
  ShieldCheck,
  MessageCircle,
  HeartPulse,
};
export type Account = {
  user: { name: string; email: string } | null;
  attempts: any[];
  completed: string[];
};
export function useAccount() {
  const [data, setData] = useState<Account | null>(null);
  const [error, setError] = useState("");
  async function refresh() {
    try {
      const r = await fetch("/api/account");
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load account");
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  return { data, error, refresh };
}
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [path]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Poolside home">
          <LifeBuoy />
          <span>
            poolside<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          {[
            ["/learn", "Learn"],
            ["/practice", "Mock tests"],
            ["/interview", "Interview prep"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={path.startsWith(href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="mobile-progress"
            onClick={() => setOpen(false)}
          >
            My progress
          </Link>
        </nav>
        <Link
          className="header-account"
          href="/dashboard"
          aria-label="My progress"
        >
          <UserRound size={16} />
          <span>My progress</span>
          <ArrowUpRight size={15} />
        </Link>
        <button
          className="mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="brand">
          <LifeBuoy />
          <span>poolside.</span>
        </Link>
        <p>Ready for the questions. Focused on the role.</p>
        <small>
          Independent study companion. Not affiliated with or endorsed by RLSS
          UK.
          <br />
          Revision supports, and does not replace, approved training or
          practical assessment.
        </small>
      </div>
      <div className="footer-links">
        <Link href="/sources">Sources & updates</Link>
        <Link href="/policies/privacy">Privacy</Link>
        <Link href="/policies/terms">Terms</Link>
        <Link href="/policies/cookies">Cookies</Link>
        <Link href="/policies/accessibility">Accessibility</Link>
      </div>
      <div className="footer-note">
        Made for your next step.
        <br />
        <span>NPLQ REVISION · 2026</span>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
export function SignIn({
  returnTo = "/dashboard",
  label = "Sign in with ChatGPT",
}: {
  returnTo?: string;
  label?: string;
}) {
  return (
    <a
      className="button primary"
      href={"/signin-with-chatgpt?return_to=" + encodeURIComponent(returnTo)}
      target="_top"
    >
      <UserRound size={17} />
      {label}
      <ArrowUpRight size={17} />
    </a>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
