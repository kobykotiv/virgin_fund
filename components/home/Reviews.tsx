import React from "react";

const Reviews = () => {
  return (
    <section id="reviews" className="py-8">
      <h2 className="text-2xl font-bold text-center">User Reviews</h2>
      <div className="mt-4 space-y-4">
        {/* Example reviews */}
        <blockquote className="border-l-4 border-primary pl-4">
          <p>"This platform has transformed my trading experience!"</p>
          <cite>- Jane Doe</cite>
        </blockquote>
        <blockquote className="border-l-4 border-primary pl-4">
          <p>"The 1% DCA strategy is a game-changer."</p>
          <cite>- John Smith</cite>
        </blockquote>
      </div>
    </section>
  );
};

export default Reviews;
