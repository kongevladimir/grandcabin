import { site } from "@/content/site";

export default function Home() {
  return (
    <main className="shell">
      <p className="eyebrow">{site.name}</p>
      <h1>{site.headline}</h1>
      <p className="intro">{site.description}</p>
    </main>
  );
}
