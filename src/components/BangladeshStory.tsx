type SettingsLike = Record<string, any>;

export default function BangladeshStory({ settings: s }: { settings: SettingsLike }) {
  const text = String(s?.bangladeshText || "").trim();
  const imgs = [1, 2, 3]
    .map((n) => ({
      src: String(s?.[`bangladeshImage${n}`] || "").trim(),
      alt: String(s?.[`bangladeshImage${n}Alt`] || "Bangladesh sourcing"),
      height: Number(s?.[`bangladeshImage${n}Height`]) || 280,
    }))
    .filter((i) => i.src);

  const enabled =
    s?.bangladeshImagesEnabled === true ||
    s?.bangladeshImagesEnabled === 1 ||
    s?.bangladeshImagesEnabled === "true" ||
    s?.bangladeshImagesEnabled === "1";

  const showImages = imgs.length > 0 && enabled !== false;
  // If they uploaded photos, show them even if the checkbox did not save cleanly.
  const useImages = imgs.length > 0 && (enabled || imgs.length > 0);

  if (!text && imgs.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white">
      <div className={`mx-auto px-4 sm:px-6 ${useImages ? "max-w-6xl" : "max-w-3xl text-center"}`}>
        <div className={useImages ? "text-center max-w-3xl mx-auto mb-10" : ""}>
          <p className="text-teal-400 font-semibold text-xs tracking-[0.15em] uppercase mb-4">Bangladesh Sourcing</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            The label tells the <em className="text-amber-400 not-italic font-serif">real story.</em>
          </h2>
          {text ? <p className="text-slate-300 leading-relaxed">{text}</p> : null}
        </div>
        {useImages && (
          <div
            className={`grid gap-4 ${
              imgs.length === 1
                ? "max-w-2xl mx-auto grid-cols-1"
                : imgs.length === 2
                ? "sm:grid-cols-2 max-w-4xl mx-auto"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {imgs.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full object-cover" style={{ height: Math.min(img.height, 480) }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
