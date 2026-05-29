import { createFileRoute } from "@tanstack/react-router";
import { ScrollLensHero } from "@/components/ScrollLensHero";
import weddingArch from "@/assets/wedding-arch.jpg";
import weddingTable from "@/assets/wedding-table.jpg";
import weddingBouquet from "@/assets/wedding-bouquet.jpg";
import weddingAisle from "@/assets/wedding-aisle.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const services = [
  {
    n: "01",
    title: "Full Planning",
    body: "From the first sketch to the last dance — venue, design, vendors, and a calm wedding day led entirely by us.",
  },
  {
    n: "02",
    title: "Design & Styling",
    body: "Art direction for couples who want a wedding that looks unmistakably theirs. Mood, palette, florals, paper, lighting.",
  },
  {
    n: "03",
    title: "Month-of Coordination",
    body: "You planned it. We make sure it runs flawlessly — timelines, vendor management, and a producer on the ground.",
  },
  {
    n: "04",
    title: "Destination Weddings",
    body: "From Lake Como to coastal Maine. We travel with you and build the local team that brings the vision to life.",
  },
];

const gallery = [
  { src: weddingArch, alt: "Couple beneath floral arch at sunset", span: "row-span-2" },
  { src: weddingTable, alt: "Tablescape with candles and roses", span: "" },
  { src: weddingBouquet, alt: "Bride holding bouquet", span: "" },
  { src: weddingAisle, alt: "Outdoor aisle lined with candles", span: "col-span-2" },
];

const testimonials = [
  {
    quote:
      "They translated a year of Pinterest boards into the most us day imaginable. Every guest told us it felt like a film.",
    name: "Maya & Idris",
    place: "Amalfi Coast",
  },
  {
    quote:
      "Calm, decisive, and impossibly organized. We didn't make a single phone call on our wedding day.",
    name: "Hannah & Jack",
    place: "Hudson Valley",
  },
];

function Index() {
  return (
    <main className="bg-background text-foreground">
      <ScrollLensHero />

      {/* Intro */}
      <section id="story" className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-32 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">The studio</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl leading-[1.1] md:text-6xl text-balance">
              We plan weddings the way a photographer composes a frame —
              <em className="italic text-primary"> with intention.</em>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Aperture &amp; Vow is a small studio of planners, designers, and producers based
              between New York and Lisbon. We take on a limited number of weddings each year so
              every couple gets our undivided attention — and a celebration that feels like
              theirs from the very first frame.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Services</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Four ways to work with us
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Every engagement begins with a complimentary discovery call. From there we tailor a
              proposal to your day, your guest count, and the vision you've been holding onto.
            </p>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
            {services.map((s) => (
              <li
                key={s.n}
                className="group bg-card p-10 transition-colors hover:bg-secondary md:p-14"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-2xl text-accent">{s.n}</span>
                  <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                </div>
                <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">In frame</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Recent celebrations</h2>
            </div>
            <a href="#contact" className="story-link text-sm uppercase tracking-[0.3em]">
              Begin yours →
            </a>
          </div>

          <div className="grid auto-rows-[16rem] grid-cols-2 gap-3 md:grid-cols-3 md:auto-rows-[18rem]">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className={`group relative overflow-hidden rounded-sm bg-muted ${g.span}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Kind words</p>
          <div className="mt-12 grid gap-16 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="font-display">
                <p className="text-2xl leading-snug md:text-3xl text-balance">
                  <span className="text-accent">“</span>
                  {t.quote}
                  <span className="text-accent">”</span>
                </p>
                <footer className="mt-8 font-body text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {t.name} — {t.place}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="border-t border-border bg-[oklch(0.18_0.02_40)] text-[oklch(0.98_0.01_80)]">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.4em] opacity-70">Inquire</p>
          <h2 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl text-balance">
            Let's design the day you'll <em className="italic">never forget.</em>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg opacity-80">
            We take on a limited number of weddings each year. Tell us about yours and we'll be in
            touch within 48 hours.
          </p>

          <form
            className="mx-auto mt-12 grid max-w-2xl gap-4 text-left sm:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              required
              placeholder="Your name"
              className="col-span-1 rounded-sm border border-[oklch(0.98_0.01_80/0.2)] bg-transparent px-4 py-3 text-sm placeholder:text-[oklch(0.98_0.01_80/0.5)] focus:border-accent focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="col-span-1 rounded-sm border border-[oklch(0.98_0.01_80/0.2)] bg-transparent px-4 py-3 text-sm placeholder:text-[oklch(0.98_0.01_80/0.5)] focus:border-accent focus:outline-none"
            />
            <input
              placeholder="Wedding date (or season)"
              className="col-span-2 rounded-sm border border-[oklch(0.98_0.01_80/0.2)] bg-transparent px-4 py-3 text-sm placeholder:text-[oklch(0.98_0.01_80/0.5)] focus:border-accent focus:outline-none"
            />
            <textarea
              rows={4}
              placeholder="Tell us a little about your vision…"
              className="col-span-2 rounded-sm border border-[oklch(0.98_0.01_80/0.2)] bg-transparent px-4 py-3 text-sm placeholder:text-[oklch(0.98_0.01_80/0.5)] focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="col-span-2 mt-2 rounded-sm bg-accent px-6 py-4 text-xs uppercase tracking-[0.3em] text-[oklch(0.18_0.02_40)] transition-transform hover:scale-[1.01]"
            >
              Send inquiry
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[oklch(0.98_0.01_80/0.1)] bg-[oklch(0.18_0.02_40)] text-[oklch(0.98_0.01_80)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-[0.3em] opacity-70">
          <span>Aperture &amp; Vow</span>
          <span>New York · Lisbon</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
