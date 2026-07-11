import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Star,
  X,
} from "lucide-react";
import { trackPageVisit, trackEnquiry } from "./lib/analytics-store";

const contact = {
  phoneDisplay: "076 980 8265",
  phoneLink: "+27769808265",
  email: "OfficialWebHaven@gmail.com",
  whatsapp: "https://wa.me/27769808265",
};

const services = [
  {
    number: "01",
    title: "Business websites",
    copy: "A clear, credible online home designed to turn visitors into enquiries.",
  },
  {
    number: "02",
    title: "Website redesigns",
    copy: "A sharper look, simpler journey, and better performance for an outdated site.",
  },
  {
    number: "03",
    title: "Online stores",
    copy: "Easy-to-shop storefronts that make your products feel worth choosing.",
  },
  {
    number: "04",
    title: "Care & support",
    copy: "Hosting setup, updates, and practical help long after your website goes live.",
  },
];



const packages = [
  {
    name: "Starter",
    price: "From R1,499",
    description: "For a new business that needs a polished first impression.",
    features: ["1-3 pages", "Mobile responsive", "WhatsApp integration", "Basic SEO setup"],
  },
  {
    name: "Business",
    price: "From R2,999",
    description: "For an established business ready to attract more enquiries.",
    features: ["Up to 6 pages", "Custom contact forms", "Google Maps setup", "Performance optimisation"],
  },
  {
    name: "Online store",
    price: "Custom quote",
    description: "For businesses ready to sell products or services online.",
    features: ["Product catalogue", "Secure checkout", "Payment setup", "Store training"],
  },
];

const faqs = [
  {
    question: "How long does a website take?",
    answer: "Most websites are completed in 3-7 days, depending on the size of the project and how quickly content is supplied.",
  },
  {
    question: "Do you provide hosting and domains?",
    answer: "Yes. We can help set up reliable hosting and register a domain that fits your business.",
  },
  {
    question: "Can I update my website myself?",
    answer: "Yes. We can build your website to be easy to manage, and we will show you how to handle the essentials.",
  },
  {
    question: "Do you work with businesses across South Africa?",
    answer: "Yes. WebHaven works remotely with clients nationwide through WhatsApp, email, and video calls.",
  },
  {
    question: "What is the founding client offer?",
    answer: "The first 5 clients to work with WebHaven get a significantly lower price in exchange for an honest testimonial about the experience. Same quality and attention — just a better rate for helping us build our portfolio.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className={`flex items-center gap-3 font-bold tracking-[-0.03em] ${light ? "text-white" : "text-[#11120f]"}`}>
      <span className={`grid size-9 place-items-center border ${light ? "border-white/40" : "border-black/30"}`}>
        W
      </span>
      <span className="text-lg">WebHaven</span>
    </a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Track page visit on mount
  useEffect(() => {
    trackPageVisit();
    const onHash = () => trackPageVisit();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const modalOpen = testimonialOpen || privacyOpen || menuOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTestimonialOpen(false);
        setPrivacyOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [testimonialOpen, privacyOpen, menuOpen]);

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Track enquiry in analytics store
    trackEnquiry({
      name: (data.get("name") as string) || "",
      business: (data.get("business") as string) || "",
      phone: (data.get("phone") as string) || "",
      email: (data.get("email") as string) || "",
      budget: (data.get("budget") as string) || "",
      message: (data.get("message") as string) || "",
      type: "contact",
    });

    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Business: ${data.get("business")}`,
      `Phone: ${data.get("phone")}`,
      `Budget: ${data.get("budget")}`,
      "",
      `Project details: ${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("New website enquiry")}&body=${encodeURIComponent(body)}`;
    setContactSent(true);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f2f0e8] text-[#11120f] selection:bg-[#c9ff3d] selection:text-black">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-[#0d0e0c]/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <BrandMark light />
          <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="Main navigation">
            {["Services", "Portfolio", "Pricing", "FAQ", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition-colors hover:text-[#c9ff3d]">
                {item}
              </a>
            ))}
          </nav>
          <a
            href={`${contact.whatsapp}?text=${encodeURIComponent("Hi WebHaven, I would like a quote for a website.")}`}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 bg-[#c9ff3d] px-5 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 lg:flex"
          >
            Start a project <ArrowRight size={16} />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid size-11 place-items-center border border-white/25 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-[#c9ff3d] p-6 text-black lg:hidden"
          >
            <div className="flex items-center justify-between">
              <BrandMark />
              <button type="button" onClick={() => setMenuOpen(false)} className="grid size-11 place-items-center border border-black/30" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="mt-20 flex flex-col text-[clamp(2.8rem,12vw,5rem)] font-semibold leading-none tracking-[-0.06em]">
              {["Services", "Portfolio", "Pricing", "FAQ", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="border-b border-black/20 py-4">
                  {item}
                </a>
              ))}
            </nav>
            <a href={`tel:${contact.phoneLink}`} className="mt-auto text-xl font-semibold">{contact.phoneDisplay}</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="home" className="relative h-[100svh] min-h-[780px] overflow-hidden bg-[#11120f] text-white">
          <motion.img
            initial={{ scale: shouldReduceMotion ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            src="/images/webhaven-hero.jpg"
            alt="Modern workspace displaying polished website designs"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,7,.92)_0%,rgba(8,9,7,.7)_42%,rgba(8,9,7,.15)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.2 } } }}
              className="max-w-5xl"
            >
              <motion.p variants={reveal} transition={{ duration: 0.65 }} className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#c9ff3d] sm:text-sm">
                <span className="h-px w-9 bg-[#c9ff3d]" /> New South African web studio
              </motion.p>
              <motion.h1 variants={reveal} transition={{ duration: 0.7 }} className="font-display text-[clamp(4.7rem,13vw,12rem)] leading-[0.7] tracking-[-0.075em]">
                WebHaven
              </motion.h1>
              <motion.div variants={reveal} transition={{ duration: 0.7 }} className="mt-8 flex max-w-3xl flex-col gap-7 border-t border-white/30 pt-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                    Websites built to grow your business.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
                    Fast, modern websites for South African businesses ready to look credible and win more customers.
                  </p>
                </div>
                <a href="#contact" className="group flex shrink-0 items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#c9ff3d]">
                  Get a launch quote
                  <span className="grid size-11 place-items-center rounded-full border border-[#c9ff3d] transition-colors group-hover:bg-[#c9ff3d] group-hover:text-black">
                    <ArrowDown size={18} />
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#c9ff3d] px-5 py-5 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 text-sm font-semibold sm:flex-row sm:items-center">
            <p>New agency. Fresh thinking. Launch pricing.</p>
            <p className="font-normal">First 5 clients get a lower price in exchange for a testimonial — <a href="#founding-offer" className="underline underline-offset-2">see the offer</a></p>
          </div>
        </section>

        <section id="services" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              transition={{ duration: 0.65 }}
              className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
            >
              <p className="section-label">What we do</p>
              <div>
                <h2 className="font-display max-w-4xl text-[clamp(3.3rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em]">
                  Your business deserves more than a template.
                </h2>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-black/60">
                  WebHaven combines thoughtful design and practical technology to create a site that looks sharp, works hard, and feels completely yours.
                </p>
              </div>
            </motion.div>

            <div className="mt-20 border-t border-black/25 lg:ml-[40%]">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.07 }}
                  className="group grid gap-3 border-b border-black/25 py-8 sm:grid-cols-[56px_1fr_1fr] sm:items-start"
                >
                  <span className="text-xs font-bold text-black/45">{service.number}</span>
                  <h3 className="text-2xl font-semibold tracking-[-0.035em] transition-transform group-hover:translate-x-2 sm:text-3xl">{service.title}</h3>
                  <p className="max-w-md leading-7 text-black/60">{service.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="bg-[#11120f] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="border-b border-white/20 pb-10">
              <p className="section-label text-[#c9ff3d]">Portfolio</p>
              <h2 className="font-display mt-7 max-w-4xl text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.06em]">
                Our work.
              </h2>
            </div>

            <div className="mt-20 border border-white/10 bg-white/[0.02] p-12 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#c9ff3d]/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9ff3d" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-white">Real projects coming soon.</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/50">
                WebHaven is a new agency and our first client projects are just getting started.
                Once they launch, they will appear right here — real results from real businesses,
                not concept designs.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 border border-[#c9ff3d] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#c9ff3d] transition-colors hover:bg-[#c9ff3d] hover:text-black"
              >
                Be our first feature →
              </a>
            </div>
          </div>
        </section>

        <section id="pricing" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="section-label">Launch prices</p>
                <h2 className="font-display mt-7 text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em]">Start small. Look established.</h2>
              </div>
              <p className="max-w-xl self-end text-lg leading-8 text-black/60 lg:justify-self-end">
                Straightforward starting points for growing businesses. Your final quote will reflect the features your business actually needs.
              </p>
            </div>

            <div className="mt-16 grid border-y border-black/25 lg:grid-cols-3">
              {packages.map((item, index) => (
                <div key={item.name} className={`flex flex-col py-10 lg:px-10 ${index > 0 ? "border-t border-black/25 lg:border-l lg:border-t-0" : ""}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">0{index + 1} / {item.name}</span>
                  <p className="mt-8 text-4xl font-semibold tracking-[-0.05em]">{item.price}</p>
                  <p className="mt-5 min-h-14 max-w-sm leading-7 text-black/60">{item.description}</p>
                  <ul className="mt-8 space-y-3 border-t border-black/15 pt-7">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm"><Check size={16} /> {feature}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="mt-10 flex items-center justify-between border-b border-black pb-3 text-sm font-bold uppercase tracking-wider">
                    Ask for a quote <ArrowRight size={17} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="founding-offer" className="bg-[#11120f] px-5 py-24 text-white sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              transition={{ duration: 0.65 }}
              className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center"
            >
              <div>
                <div className="mb-6 inline-flex items-center gap-3 bg-[#c9ff3d] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-black">
                  <span className="grid size-6 place-items-center rounded-full bg-black text-[#c9ff3d] text-[10px] font-bold">5</span>
                  Founding client offer
                </div>
                <h2 className="font-display max-w-4xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.88] tracking-[-0.06em]">
                  Be one of the first 5. Pay less.
                </h2>
                <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
                  WebHaven is brand new and we want our first real projects to speak for themselves. So here is the deal: the first 5 clients to work with us get a significantly lower price. All we ask in return is an honest testimonial about the experience.
                </p>
                <div className="mt-10 grid max-w-lg gap-6 sm:grid-cols-2">
                  <div className="border border-white/20 p-6">
                    <p className="font-display text-4xl tracking-[-0.05em] text-[#c9ff3d]">5 spots</p>
                    <p className="mt-2 text-sm leading-6 text-white/50">Available at the founding client rate</p>
                  </div>
                  <div className="border border-white/20 p-6">
                    <p className="font-display text-4xl tracking-[-0.05em] text-[#c9ff3d]">Lower</p>
                    <p className="mt-2 text-sm leading-6 text-white/50">Launch pricing only for these first projects</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-3 bg-[#c9ff3d] px-6 py-4 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:-translate-y-1"
                  >
                    Claim your spot <ArrowRight size={17} />
                  </a>
                  <a
                    href={`${contact.whatsapp}?text=${encodeURIComponent("Hi WebHaven, I am interested in the founding client offer.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-white/30 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#c9ff3d] hover:text-[#c9ff3d]"
                  >
                    <MessageCircle size={16} /> Ask on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-8 border-l border-white/15 pl-0 lg:pl-14">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9ff3d]">How it works</h3>
                  <ol className="mt-5 space-y-5">
                    <li className="flex items-start gap-4 leading-7 text-white/70">
                      <span className="grid size-8 shrink-0 place-items-center border border-white/25 text-sm font-bold">1</span>
                      You get in touch and tell us about your project.
                    </li>
                    <li className="flex items-start gap-4 leading-7 text-white/70">
                      <span className="grid size-8 shrink-0 place-items-center border border-white/25 text-sm font-bold">2</span>
                      We quote you at the founding client rate — noticeably lower than our standard launch prices.
                    </li>
                    <li className="flex items-start gap-4 leading-7 text-white/70">
                      <span className="grid size-8 shrink-0 place-items-center border border-white/25 text-sm font-bold">3</span>
                      We design and build your website with the same care and attention as any full-price project.
                    </li>
                    <li className="flex items-start gap-4 leading-7 text-white/70">
                      <span className="grid size-8 shrink-0 place-items-center border border-white/25 text-sm font-bold">4</span>
                      Once your site is live, you share an honest testimonial about the experience.
                    </li>
                  </ol>
                </div>
                <div className="border-t border-white/15 pt-6">
                  <p className="text-sm leading-6 text-white/40">
                    No fine print. The only condition is a genuine testimonial we can feature on this website after you are happy with the result.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="testimonials" className="bg-[#c9ff3d] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={reveal}
            transition={{ duration: 0.65 }}
            className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.7fr_1.3fr]"
          >
            <div>
              <p className="section-label">Client stories</p>
              <div className="mt-8 flex gap-1" aria-label="Space reserved for future five-star reviews">
                {[...Array(5)].map((_, index) => <Star key={index} size={20} strokeWidth={1.5} />)}
              </div>
            </div>
            <div>
              <h2 className="font-display max-w-5xl text-[clamp(3.6rem,8vw,8rem)] leading-[0.88] tracking-[-0.065em]">
                New agency, building beautiful websites at launch prices.
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-8 text-black/65">
                No made-up reviews here. Our first 5 founding clients will fill this space with genuine experiences — and they get a lower price for helping us get started. <a href="#founding-offer" className="underline underline-offset-2">See the founding offer</a>
              </p>
              <button
                type="button"
                onClick={() => setTestimonialOpen(true)}
                className="mt-9 inline-flex items-center gap-3 bg-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1"
              >
                Add your testimonial <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        </section>

        <section id="faq" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="section-label">Good to know</p>
              <h2 className="font-display mt-7 text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.06em]">Questions, answered.</h2>
              <p className="mt-7 max-w-sm leading-7 text-black/60">Still unsure? Send us a WhatsApp and we will talk it through in plain language.</p>
            </div>
            <div className="border-t border-black/25">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={faq.question} className="border-b border-black/25">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-7 text-left text-xl font-semibold tracking-[-0.03em] sm:text-2xl"
                      aria-expanded={isOpen}
                    >
                      {faq.question}
                      <ChevronDown className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} size={22} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 leading-7 text-black/60">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#11120f] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <p className="section-label text-[#c9ff3d]">Have an idea?</p>
            <h2 className="font-display mt-7 max-w-6xl text-[clamp(4.2rem,10vw,10rem)] leading-[0.82] tracking-[-0.07em]">
              Let's build your website.
            </h2>
            <div className="mt-16 grid gap-16 border-t border-white/20 pt-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="max-w-md text-lg leading-8 text-white/60">
                  Tell us where your business is going. We will reply with a clear recommendation, timeline, and no-pressure quote.
                </p>
                <div className="mt-10 space-y-5">
                  <a href={`${contact.whatsapp}?text=${encodeURIComponent("Hi WebHaven, I would like to discuss a website.")}`} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-lg font-semibold">
                    <span className="grid size-12 place-items-center border border-white/25 transition-colors group-hover:border-[#c9ff3d] group-hover:text-[#c9ff3d]"><MessageCircle size={20} /></span>
                    WhatsApp {contact.phoneDisplay}
                  </a>
                  <a href={`mailto:${contact.email}`} className="group flex items-center gap-4 break-all text-lg font-semibold">
                    <span className="grid size-12 shrink-0 place-items-center border border-white/25 transition-colors group-hover:border-[#c9ff3d] group-hover:text-[#c9ff3d]"><Mail size={20} /></span>
                    {contact.email}
                  </a>
                  <a href={`tel:${contact.phoneLink}`} className="group flex items-center gap-4 text-lg font-semibold">
                    <span className="grid size-12 place-items-center border border-white/25 transition-colors group-hover:border-[#c9ff3d] group-hover:text-[#c9ff3d]"><Phone size={20} /></span>
                    Call {contact.phoneDisplay}
                  </a>
                </div>
                <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
                  <a href="https://www.instagram.com/officialwebhaven" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
                  <a href="https://www.facebook.com/officialwebhaven" target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
                </div>
              </div>

              <form onSubmit={handleContact} className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
                <label className="form-field">
                  <span>Your name *</span>
                  <input name="name" required placeholder="e.g. Thando" />
                </label>
                <label className="form-field">
                  <span>Email address *</span>
                  <input name="email" type="email" required placeholder="Your email" />
                </label>
                <label className="form-field">
                  <span>Business name</span>
                  <input name="business" placeholder="Your business" />
                </label>
                <label className="form-field">
                  <span>Phone number *</span>
                  <input name="phone" type="tel" required placeholder="Your contact number" />
                </label>
                <label className="form-field">
                  <span>Estimated budget</span>
                  <select name="budget" defaultValue="">
                    <option value="" disabled>Select a range</option>
                    <option>R1,500 - R3,000</option>
                    <option>R3,000 - R6,000</option>
                    <option>R6,000+</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label className="form-field sm:col-span-2">
                  <span>What would you like to build? *</span>
                  <textarea name="message" required rows={4} placeholder="Tell us about your business and the website you need." />
                </label>
                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="inline-flex items-center gap-3 bg-[#c9ff3d] px-6 py-4 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:-translate-y-1">
                    Request my free quote <ArrowRight size={17} />
                  </button>
                  {contactSent && <p role="status" className="text-sm text-[#c9ff3d]">Your email app is ready to send the enquiry.</p>}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#11120f] px-5 pb-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px] border-t border-white/20 pt-10">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
            <div>
              <BrandMark light />
              <p className="mt-5 text-sm text-white/50">WebHaven - Building websites that grow businesses.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm" aria-label="Footer navigation">
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
              <button type="button" onClick={() => setPrivacyOpen(true)}>Privacy Policy</button>
            </nav>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
            <p>New web design agency serving businesses across South Africa.</p>
            <p>&copy; {new Date().getFullYear()} WebHaven. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {testimonialOpen && (
          <TestimonialModal onClose={() => setTestimonialOpen(false)} reduceMotion={Boolean(shouldReduceMotion)} />
        )}
        {privacyOpen && (
          <ModalShell onClose={() => setPrivacyOpen(false)} reduceMotion={Boolean(shouldReduceMotion)} label="Privacy policy">
            <p className="section-label">Privacy policy</p>
            <h2 className="font-display mt-5 text-5xl tracking-[-0.05em] sm:text-6xl">Your details stay private.</h2>
            <div className="mt-8 space-y-5 leading-7 text-black/65">
              <p>WebHaven only uses information you send through this website to reply to your enquiry, prepare a quote, or review a testimonial you submit.</p>
              <p>We do not sell your information. Testimonials are never published without your clear permission and approval by WebHaven.</p>
              <p>To request access, correction, or deletion of your information, email {contact.email}.</p>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalShell({ children, onClose, reduceMotion, label }: { children: React.ReactNode; onClose: () => void; reduceMotion: boolean; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        className="relative my-auto w-full max-w-3xl bg-[#f2f0e8] p-6 text-black shadow-2xl sm:p-10"
      >
        <button type="button" onClick={onClose} className="absolute right-5 top-5 grid size-11 place-items-center border border-black/25 hover:bg-black hover:text-white" aria-label="Close dialog">
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TestimonialModal({ onClose, reduceMotion }: { onClose: () => void; reduceMotion: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Client name: ${data.get("clientName")}`,
      `Business: ${data.get("company")}`,
      `Project: ${data.get("project")}`,
      `Rating: ${data.get("rating")}/5`,
      "",
      `Testimonial: ${data.get("testimonial")}`,
      "",
      "Permission to publish: Yes",
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Client testimonial for WebHaven")}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <ModalShell onClose={onClose} reduceMotion={reduceMotion} label="Submit a testimonial">
      {!submitted ? (
        <>
          <p className="section-label">Share your experience</p>
          <h2 className="font-display mt-5 max-w-xl text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">Worked with WebHaven?</h2>
          <p className="mt-5 max-w-xl leading-7 text-black/60">We would love your honest feedback. Your review will only be published after it has been checked and approved.</p>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <label className="modal-field">
              <span>Your name *</span>
              <input name="clientName" required placeholder="Full name" />
            </label>
            <label className="modal-field">
              <span>Business name *</span>
              <input name="company" required placeholder="Company or brand" />
            </label>
            <label className="modal-field">
              <span>Project type *</span>
              <select name="project" required defaultValue="">
                <option value="" disabled>Select one</option>
                <option>New website</option>
                <option>Website redesign</option>
                <option>Online store</option>
                <option>Other support</option>
              </select>
            </label>
            <label className="modal-field">
              <span>Your rating *</span>
              <select name="rating" required defaultValue="5">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </label>
            <label className="modal-field sm:col-span-2">
              <span>Your testimonial *</span>
              <textarea name="testimonial" required minLength={20} rows={4} placeholder="What was it like working with WebHaven?" />
            </label>
            <label className="flex items-start gap-3 text-sm leading-6 text-black/65 sm:col-span-2">
              <input type="checkbox" required className="mt-1 size-4 accent-black" />
              I give WebHaven permission to review, lightly edit for clarity, and publish this testimonial with my name and business.
            </label>
            <button type="submit" className="inline-flex w-fit items-center gap-3 bg-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-white sm:col-span-2">
              Send testimonial <ArrowRight size={17} />
            </button>
          </form>
        </>
      ) : (
        <div className="py-10 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#c9ff3d]"><Check size={28} /></span>
          <h2 className="font-display mt-7 text-5xl tracking-[-0.05em]">Thank you.</h2>
          <p className="mx-auto mt-4 max-w-md leading-7 text-black/60">Your email app is ready with the testimonial. Send that message and WebHaven will review it before publishing.</p>
          <button type="button" onClick={onClose} className="mt-8 border-b border-black pb-1 font-bold">Close window</button>
        </div>
      )}
    </ModalShell>
  );
}

export default App;