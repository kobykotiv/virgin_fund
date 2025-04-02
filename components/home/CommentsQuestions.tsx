import React from "react";

const CommentsQuestions = () => {
  return (
    <section id="comments-questions" className="py-8">
      <h2 className="text-2xl font-bold text-center">Comments & Questions</h2>
      <form className="mt-4 max-w-lg mx-auto">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Leave your comment or question here..."
          rows={4}
        ></textarea>
        <button type="submit" className="mt-2 px-4 py-2 bg-primary text-white rounded-md">
          Submit
        </button>
      </form>
    </section>
  );
};

export default CommentsQuestions;
