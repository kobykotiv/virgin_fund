import React from "react";

const FAQ = () => {
  return (
    <section id="faq" className="py-8">
      <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
      <div className="mt-4 space-y-4">
        <details>
          <summary className="font-semibold">What is this platform?</summary>
          <p>This is an open-source trading bot platform with features like DCA, indicators, and signals.</p>
        </details>
        <details>
          <summary className="font-semibold">Is it free to use?</summary>
          <p>Yes, it is licensed under a fair-code license and is completely free to use.</p>
        </details>
      </div>
    </section>
  );
};

export default FAQ;
