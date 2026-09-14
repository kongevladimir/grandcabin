import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <p className="eyebrow">404</p>
      <h1>Page not found.</h1>
      <p className="intro">This page may have moved or does not exist yet.</p>
      <Link href="/">Back to home</Link>
    </main>
  );
}
