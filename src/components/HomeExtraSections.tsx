import { getSections, getSettings } from "@/lib/data";

const DEFAULT_STEPS = [
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "01", title: "Buyer Brief Received", text: "Tech pack, mood board or sketch reviewed. Feasibility confirmed and timeline mapped.", time: "Day 1\u20132" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "02", title: "Tech Pack Review & Costing", text: "Construction, measurement and trim specs flagged before factory briefing.", time: "Day 2\u20133" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "03", title: "Factory Selection & Audit", text: "Best-fit factory from the vetted network. Compliance and capacity checked first.", time: "Day 3\u20135" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "04", title: "Fabric & Trims Sourcing", text: "Fabrics and trims sourced to spec with lab dips for colour approval.", time: "Day 5\u20137" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "05", title: "Proto Sample Development", text: "First physical sample checked by QC against the spec before it goes to you.", time: "Day 7\u201314" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "06", title: "Buyer Feedback & Fit Rounds", text: "Your comments translated into factory instructions. Change log kept.", time: "Day 14\u201321" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "07", title: "Size Set & PP Sample", text: "Size run graded. PP sample made from bulk fabric and trims.", time: "Day 21\u201326" },
  { phase: "01", phaseTitle: "Pre-Production \u2014 Brief to Buyer Approval", n: "08", title: "Buyer Sign-Off", text: "No bulk starts without written approval. Signed PP sample is the QC benchmark.", time: "Day 26\u201328" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "09", title: "Bulk Production Begins", text: "Production starts against the sealed PP sample.", time: "Week 5\u20136" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "10", title: "Inline QC \u2014 Cutting & Stitching", text: "QC on cutting, stitching and finishing. Defects corrected at source.", time: "Week 5\u20137" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "11", title: "End-Line Inspection \u2014 AQL 2.5", text: "AQL 2.5 audit on packed garments.", time: "Week 7" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "12", title: "Packing & Carton Verification", text: "Size ratios, labels and carton marks checked against the packing list.", time: "Week 7\u20138" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "13", title: "Shipment & Documentation", text: "Freight booked and export documents issued. Tracking shared.", time: "Week 8" },
  { phase: "02", phaseTitle: "Production to Shipment \u2014 Bulk to On-Time Delivery", n: "14", title: "On-Time Delivery Confirmed", text: "Dispatch confirmed. You receive tracking and documents on the agreed date.", time: "Ship date" },
];

const DEFAULT_TERMS = [
  { label: "Minimum order", title: "500 units per style", text: "Trial orders welcome for new buyers. Smaller MOQs considered case by case." },
  { label: "How we charge", title: "Buyer-side fee only", text: "A sourcing fee charged to the buyer. Nothing taken from the factory. No hidden markups." },
  { label: "Payment terms", title: "USD \u00b7 GBP \u00b7 EUR", text: "50% on PP sample approval, 50% on shipment confirmation. TT or LC." },
];

function Roadmap({ roadmap, steps }: { roadmap: any; steps: any[] }) {
  const phases: string[] = Array.from(new Set(steps.map((st) => String(st.phaseTitle || st.phase || ""))));
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-3">{roadmap.eyebrow || "Development process"}</p>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">{roadmap.title || "From tech pack to delivery."}</h2>
        <p className="text-slate-500 mb-10">{roadmap.subtitle || "Fourteen steps. Full visibility at every one."}</p>
        {phases.map((phaseTitle, idx) => {
          const group = steps.filter((st) => String(st.phaseTitle || st.phase) === phaseTitle);
          return (
            <div key={phaseTitle} className="mb-10">
              <div className="flex flex-wrap items-baseline gap-2 mb-4 pb-2 border-b border-slate-200">
                <span className="text-[11px] tracking-[0.16em] uppercase text-slate-400">Phase {String(idx + 1).padStart(2, "0")}</span>
                <span className="text-slate-300">\u00b7</span>
                <h3 className="font-serif text-lg text-slate-800">{phaseTitle}</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.map((st) => (
                  <article key={st.n} className="bg-slate-50 border border-slate-200 p-4 min-h-[180px] flex flex-col">
                    <div className="text-[11px] italic text-slate-400 mb-2">Step {st.n}</div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">{st.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed flex-1">{st.text}</p>
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">{st.time}</div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Terms({ terms, cards }: { terms: any; cards: any[] }) {
  return (
    <section id="terms" className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-3">{terms.eyebrow || "Working with us"}</p>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">{terms.title || "Clear terms, no surprises."}</h2>
        <p className="text-slate-500 mb-8">{terms.subtitle || "How we work \u2014 so you know the fit before sending a tech pack."}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 p-6">
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 mb-3">{c.label}</div>
              <div className="font-serif text-xl text-slate-900 mb-3">{c.title}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomeExtraSections() {
  const sections = await getSections();
  const s = await getSettings();
  const roadmap = sections.processRoadmap || {};
  const terms = sections.commercialTerms || {};
  const steps: any[] = Array.isArray(roadmap.steps) && roadmap.steps.length ? roadmap.steps : DEFAULT_STEPS;
  const cards: any[] = Array.isArray(terms.cards) && terms.cards.length ? terms.cards : DEFAULT_TERMS;
  const wa = String(s.whatsapp || "").replace(/\D/g, "");
  const order = Array.isArray(sections.homeOrder?.items) && sections.homeOrder.items.length
    ? sections.homeOrder.items
    : [
        { id: "roadmap", visible: true },
        { id: "terms", visible: true },
      ];

  return (
    <>
      {order.map((item: any) => {
        if (item.visible === false) return null;
        if (item.id === "roadmap") return <Roadmap key="roadmap" roadmap={roadmap} steps={steps} />;
        if (item.id === "terms") return <Terms key="terms" terms={terms} cards={cards} />;
        return null;
      })}
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
