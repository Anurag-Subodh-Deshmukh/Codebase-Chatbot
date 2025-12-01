import React, { useState } from "react";

export default function GithubURLInput({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) return alert("Please enter a GitHub URL");

    // Optional: Basic GitHub URL validation
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w-]+\/?[\w-]*?/;

    if (!githubRegex.test(url)) {
      return alert("Invalid GitHub URL! Example: https://github.com/user/repo");
    }

    onSubmit(url);
    setUrl("");
  };

  return (
    <div className="w-full p-4 bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter GitHub repository URL"
          className="flex-1 p-2 rounded border dark:bg-gray-800 dark:text-white"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
