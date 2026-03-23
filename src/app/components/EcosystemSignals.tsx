"use client";

const signals = [
  {
    title: "Student EV battery projects accelerating globally",
    tag: "Energy",
    date: "This week",
  },
  {
    title: "Several Formula Student teams investing in composite manufacturing",
    tag: "Manufacturing",
    date: "Recent",
  },
  {
    title: "New CFD tools increasingly adopted by student racing teams",
    tag: "Software",
    date: "Recent",
  },
  {
    title: "International Formula Student events expanding EV categories",
    tag: "Competition",
    date: "Latest",
  },
];

export default function EcosystemSignals() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">Ecosystem Signals</p>

      <h3 className="mt-2 text-xl font-semibold text-gray-900">
        What Moves the Network
      </h3>

      <div className="mt-6 space-y-4">
        {signals.map((s, i) => (
          <div
            key={i}
            className="border-b border-gray-100 pb-3 last:border-none"
          >
            <p className="text-sm font-medium text-gray-900">{s.title}</p>

            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="rounded bg-gray-100 px-2 py-1">{s.tag}</span>
              <span>{s.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}