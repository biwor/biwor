import { getSections, getSettings } from "@/lib/data";

const DEFAULT_STEPS = [
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "01", title: "Buyer brief received", text: "Tech pack, mood board or sketch reviewed. Feasibility confirmed and timeline mapped.", time: "Day 1\u20132" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "02", title: "Tech pack review and costing", text: "Construction, measurement and trim specs flagged before factory briefing.", time: "Day 2\u20133" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "03", title: "Factory selection and audit", text: "Best-fit factory from the vetted network. Compliance and capacity checked first.", time: "Day 3\u20135" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "04", title: "Fabric and trims sourcing", text: "Fabrics and trims sourced to spec with lab dips for colour approval.", time: "Day 5\u20137" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "05", title: "Proto sample", text: "First physical sample checked by QC against the spec before it goes to you.", time: "Day 7\u201314" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "06", title: "Fit comments", text: "Your comments translated into factory instructions. Change log kept.", time: "Day 14\u201321" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "07", title: "Size set and PP sample", text: "Size run graded. PP sample made from bulk fabric and trims.", time: "Day 21\u201326" },
  { phase: "01", phaseTitle: "Pre-production \u2014 brief to approval", n: "08", title: "Buyer sign-off", text: "No bulk starts without written approval. Signed PP sample is the QC benchmark.", time: "Day 26\u201328" },
  { phase: "02", phaseTitle: "Production to shipment", n: "09", title: "Bulk production", text: "Production starts against the sealed PP sample.", time: "Week 5\u20136" },
  { phase: "02", phaseTitle: "Production to shipment", n: "10", title: "Inline QC", text: "QC on cutting, stitching and finishing. Defects corrected at source.", time: "Week 5\u20137" },
  { phase: "02", phaseTitle: "Production to shipment", n: "11", title: "Final inspection", text: "AQL 2.5 audit on packed garments.", time: "Week 7" },
  { phase: "02", phaseTitle: "Production to shipment", n: "12", title: "Packing check", text: "Size ratios, labels and carton marks checked against the packing list.", time: "Week 7\u20138" },
  { phase: "02", phaseTitle: "Production to shipment", n: "13", title: "Shipment documents", text: "Freight booked and export documents issued. Tracking shared.", time: "Week 8" },
  { phase: "02", phaseTitle: "Production to shipment", n: "14", title: "On-time delivery", text: "Dispatch confirmed. You receive tracking and documents on the agreed date.", time: "Ship date" },
];

const DEFAULT_TERMS = [
  { label: "Minimum order", title: "500 units per style", text: "Trial orders welcome for new buyers. Smaller MOQs considered case by case." },
  { label: "How we charge", title: "Buyer-side fee only", text: "A sourcing fee charged to the buyer. Nothing taken from the factory. No hidden markups." },
  { label: "Payment terms", title: "USD \u00b7 GBP \u00b7 EUR", text: "50% on PP sample approval, 50% on shipment confirmation. TT or LC." },
];

export default async function HomeExtraSections() {
  const sections = await getSections();
  const s = await getSettings();
  const roadmap = sections.processRoadmap || {};
  const terms = sections.commercialTerms || {};
  const steps: any[] = Array.isArray(roadmap.steps) && roadmap.steps.length ? roadmap.steps : DEFAULT_STEPS;
  const cards: any[] = Array.isArray(terms.cards) && terms.cards.length ? terms.cards : DEFAULT_TERMS;
  const wa = String(s.whatsapp || "").replace(/\D/g, "");

  const phases: string[] = Array.from(
    new Set(steps.map((st) => String(st.phaseTitle || st.phase || "")))
  );

  return (
    <>
      <section id="roadmap" className="py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">{roadmap.eyebrow || "How an order moves"}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {roadmap.title || "From tech pack to delivery"}
          </h2>
          <p className="text-slate-600 mb-12 max-w-2xl">{roadmap.subtitle || "Fourteen steps. You can edit every line in Admin."}</p>
          {phases.map((phaseTitle) => (
            <div key={phaseTitle} className="mb-12">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase text-teal-800 mb-4 border-b border-slate-200 pb-2">
                {phaseTitle}
              </div>
              <ol className="space-y-3">
                {steps.filter((st) => String(st.phaseTitle || st.phase) === phaseTitle).map((st) => (
                  <li key={st.n} className="grid sm:grid-cols-[72px_1fr_auto] gap-3 items-start border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                    <div className="text-xs font-bold text-teal-700 pt-0.5">Step {st.n}</div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{st.title}</div>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{st.text}</p>
                    </div>
                    <div className="text-xs text-slate-500 sm:text-right whitespace-nowrap">{st.time}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section id="terms" className="py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">{terms.eyebrow || "Working with us"}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {terms.title || "Clear terms, no surprises"}
          </h2>
          <p className="text-slate-600 mb-8">{terms.subtitle || "How we work \u2014 so you know the fit before a tech pack."}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white border-l-4 border-teal-700 rounded-r-xl p-5 shadow-sm">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">{c.label}</div>
                <div className="font-semibold text-slate-900 mb-2">{c.title}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {wa && (
        <a
          href={`https://wa.me/${wa}?text=Hi%20BIWORSOURCING%2C%20I%20want%20to%20discuss%20a%20sourcing%20order.`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg"
        >
          WhatsApp
        </a>
      )}
    </>
  );
}
