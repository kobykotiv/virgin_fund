import React from "react";

const DonationLink = () => {
  return (
    <section id="donation-link" className="py-8">
      <h2 className="text-2xl font-bold text-center">Support the Project</h2>
      <p className="mt-4 text-center">
        If you find this platform helpful, consider supporting us with a donation.
      </p>
      <div className="mt-4 text-center">
        <a
          href="https://www.example.com/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Donate Now
        </a>
      </div>
    </section>
  );
};

export default DonationLink;
