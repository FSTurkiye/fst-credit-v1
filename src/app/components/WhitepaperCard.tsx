"use client";

export default function WhitepaperCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">Whitepaper</p>

      <h3 className="mt-2 text-xl font-semibold text-gray-900">
        The Idea Behind FST Credits
      </h3>

      <p className="mt-3 text-sm text-gray-600">
        FST Credits is a collaboration-based credit network designed for
        student engineering teams. Instead of relying solely on traditional
        money transfers, teams can exchange knowledge, services, and technical
        contributions using a shared digital credit.
      </p>

      <p className="mt-3 text-sm text-gray-600">
        The goal is to create a sustainable ecosystem where engineering
        collaboration has measurable value and can circulate across the global
        student motorsport community.
      </p>

      <a
        href="/FST_Credits_Whitepaper_Formatted.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
      >
        Read Whitepaper
      </a>
    </div>
  );
}
