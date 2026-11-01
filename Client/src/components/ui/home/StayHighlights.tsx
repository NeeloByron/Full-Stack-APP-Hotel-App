const highlights = [
  {
    title: "Space to settle in",
    description: "Rooms designed for comfort, calm and longer stays.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Room to focus",
    description: "Quiet spaces for work, meetings and focused time.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Rest, uninterrupted",
    description: "Comfortable rooms built around a better night's sleep.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  },
]

function StayHighlights() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Stay highlights
          </p>

          <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
            Made for the way you travel.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article key={highlight.title}>
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-base font-medium text-foreground">
                  {highlight.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StayHighlights