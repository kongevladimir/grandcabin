"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { copy, finnUrl, photos } from "@/content/site";

type Design = 1 | 2 | 3 | 4 | 5 | 6;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function Mountain() {
  return (
    <svg viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <path d="M2 29 18 4l10 15 6-9 12 19H2Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12 14 6 4 5-6M28 19l6 10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<"nb" | "en">("nb");
  const [design, setDesign] = useState<Design>(1);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "nb"
      ? "Grandcabin · Sammen på Turufjell"
      : "Grandcabin · Together on Turufjell";
  }, [language]);

  function openPhoto(index: number) {
    setSelected(index);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function closePhoto() {
    dialog.current?.close();
  }

  function movePhoto(direction: number) {
    setSelected((index) => (index + direction + photos.length) % photos.length);
  }

  return (
    <>
      <div className={`site design-${design}`}>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="header">
        <a className="brand" href="#" aria-label="Grandcabin">
          <Mountain />
          <span>grandcabin<small>TURUFJELL</small></span>
        </a>
        <nav aria-label={language === "nb" ? "Hovedmeny" : "Main navigation"}>
          {t.nav.map((label, index) => (
            <a key={label} href={["#hytta", "#bilder", "#opplevelser"][index]}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="languages" aria-label="Language / Språk">
            <button lang="nb" aria-label="Norsk" aria-pressed={language === "nb"} onClick={() => setLanguage("nb")}>NO</button>
            <span>/</span>
            <button lang="en" aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <a className="button header-cta" href={finnUrl}>{t.cta}<Arrow diagonal /></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-image" src="/images/exterior.avif" alt={t.captions[0]} fill priority sizes="100vw" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow"><span className="location-dot" />{t.location}</p>
            <h1 id="hero-title">{t.headline[0]}<br /><em>{t.headline[1]}</em></h1>
            <p className="hero-description">{t.hero}</p>
            <a className="button button-light" href="#hytta">{t.explore}<Arrow /></a>
          </div>
          <div className="hero-bottom">
            <span>{t.scroll}</span>
            <button onClick={() => openPhoto(0)}><span aria-hidden="true">▦</span> {t.photo}<Arrow diagonal /></button>
          </div>
          <span className="hero-side" aria-hidden="true">59° NORTH · NORWAY</span>
        </section>

        <section className="stats" aria-label={language === "nb" ? "Hytta i tall" : "Cabin at a glance"}>
          {["29", "9", "360", "2"].map((value, index) => (
            <div key={value}>
              <strong>{value}{index === 2 && <sup>m²</sup>}</strong>
              <span>{t.stats[index]}</span>
            </div>
          ))}
        </section>

        <section className="intro section" id="hytta">
          <div className="intro-copy">
            <p className="eyebrow">{t.introLabel}</p>
            <h2>{t.introTitle}</h2>
            <p>{t.intro}</p>
            <p>{t.intro2}</p>
            <div className="detail-line">{t.detail}</div>
          </div>
          <div className="intro-image">
            <Image src="/images/living.avif" alt={t.captions[1]} fill sizes="(max-width: 760px) 100vw, 48vw" />
            <div className="image-label"><span>01 /</span>{t.captions[1]}</div>
          </div>
        </section>

        <section className="gallery-section section" id="bilder">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.galleryLabel}</p>
              <h2>{t.galleryTitle}</h2>
              <p>{t.galleryText}</p>
            </div>
            <a className="text-link" href={finnUrl}>{t.allPhotos}<Arrow diagonal /></a>
          </div>
          <div className="gallery-grid">
            {[2, 6, 5, 4].map((index, position) => (
              <button className={`gallery-photo photo-${position}`} key={index} onClick={() => openPhoto(index)} aria-label={`${t.open}: ${t.captions[index]}`}>
                <Image src={`/images/${photos[index]}.avif`} alt={t.captions[index]} fill sizes={position === 0 ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 50vw, 35vw"} />
                <span className="photo-caption">{t.captions[index]}<span aria-hidden="true">↗</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="comfort-section">
          <div className="section">
            <p className="eyebrow">{t.comfortLabel}</p>
            <h2>{t.comfortTitle}</h2>
            <div className="comfort-grid">
              {t.comforts.map(([title, text], index) => (
                <article key={title}>
                  <span className="feature-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="amenities">
              {t.amenities.map((amenity) => <span key={amenity}><span aria-hidden="true">✓</span>{amenity}</span>)}
            </div>
          </div>
        </section>

        <section className="section seasons" id="opplevelser">
          <p className="eyebrow">{t.seasonsLabel}</p>
          <h2>{t.seasonsTitle}</h2>
          <div className="season-grid">
            <article>
              <div className="season-image"><Image src="/images/ski.avif" alt={t.captions[7]} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <h3>{t.winter}</h3><p>{t.winterText}</p>
            </article>
            <article>
              <div className="season-image"><Image src="/images/cycling.avif" alt={t.captions[8]} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <h3>{t.summer}</h3><p>{t.summerText}</p>
            </article>
          </div>
        </section>

        <section className="location-section section">
          <div className="location-picture">
            <Image src="/images/terrace.avif" alt={t.captions[3]} fill sizes="(max-width: 760px) 100vw, 50vw" />
            <span className="location-stamp"><Mountain />TURUFJELL<br /><small>FLÅ · HALLINGDAL</small></span>
          </div>
          <div>
            <p className="eyebrow">{t.locationLabel}</p>
            <h2>{t.locationTitle}</h2>
            <p>{t.locationText}</p>
            <p>{t.transport}</p>
            <a className="text-link" href={finnUrl}>{t.cta}<Arrow diagonal /></a>
          </div>
        </section>

        <section className="practical section">
          <h2>{t.practical}</h2>
          <div>
            {t.practicalItems.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing">
          <Image src="/images/exterior.avif" alt="" fill sizes="100vw" />
          <div className="closing-shade" />
          <div className="closing-content">
            <p className="eyebrow">{t.endLabel}</p>
            <h2>{t.endTitle}</h2>
            <p>{t.endText}</p>
            <a className="button button-light" href={finnUrl}>{t.endCta}<Arrow diagonal /></a>
          </div>
        </section>
      </main>

      <footer>
        <div><a className="brand" href="#"><Mountain /><span>grandcabin<small>TURUFJELL</small></span></a><p>{t.footer}</p></div>
        <div className="footer-right"><a href={finnUrl}>FINN ↗</a><p>{t.source}</p></div>
      </footer>

      <div className="design-picker" role="group" aria-label={language === "nb" ? "Velg design" : "Choose design"}>
        <span>{language === "nb" ? "Velg design" : "Choose design"}</span>
        {(language === "nb"
          ? ["Fjellro", "Nordisk lys", "Mørk lodge", "Fjordglass", "Tømmer & ild", "Arkitektens hytte"]
          : ["Mountain calm", "Nordic light", "Dark lodge", "Fjord glass", "Timber & fire", "Architect’s cabin"]
        ).map((label, index) => {
          const option = (index + 1) as Design;
          return <button key={label} aria-pressed={design === option} onClick={() => setDesign(option)}><b>0{option}</b>{label}</button>;
        })}
        <Link className="structure-link" href="/concepts/destination">
          {language === "nb" ? "6 nye sidestrukturer →" : "6 new page structures →"}
        </Link>
      </div>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => { document.body.style.overflow = ""; }}
        onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") movePhoto(1);
          if (event.key === "ArrowLeft") movePhoto(-1);
        }}
        aria-label={t.photo}
      >
        <div className="lightbox-top"><span>{selected + 1} / {photos.length}</span><button onClick={closePhoto} autoFocus>{t.close}<span aria-hidden="true">×</span></button></div>
        <div className="lightbox-image"><Image src={`/images/${photos[selected]}.avif`} alt={t.captions[selected]} fill sizes="95vw" /></div>
        <div className="lightbox-bottom"><button onClick={() => movePhoto(-1)} aria-label={t.previous}>←</button><p aria-live="polite">{t.captions[selected]}</p><button onClick={() => movePhoto(1)} aria-label={t.next}>→</button></div>
      </dialog>
    </>
  );
}
