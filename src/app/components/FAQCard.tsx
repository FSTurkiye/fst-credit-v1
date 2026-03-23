"use client";

export default function FAQCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">FAQ</p>

      <h3 className="mt-2 text-xl font-semibold text-gray-900">
        Frequently Asked Questions
      </h3>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            What is FST Credit?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            FST Credit is a credit-based collaboration system for engineering
            teams, communities, and contributors.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            How do credits work?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Credits are used to exchange services, knowledge, and technical
            contributions inside the ecosystem.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            How do I get credits?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Credits are currently distributed manually by the ecosystem team.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Can I offer services?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Yes. You can publish a service, set its credit value, and receive
            credits from other users.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Is this a payment platform?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            No. At this stage, FST Credit is a closed ecosystem for coordinated
            service exchange and credit-based collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}