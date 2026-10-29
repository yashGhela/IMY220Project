import { useState } from "react";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function ReportPost({ postId }) {
  const userId = getCookie("userId");

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reason.trim()) return setError("Please give a reason for reporting this post");
    if (reason.trim().length > 300) return setError("Reason must be 300 characters or fewer");

    try {
      const response = await fetch(`${API}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId, reason }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return setError(data.error || "Failed to report post");
      }

      setError("");
      setSubmitted(true);
    } catch {
      setError("Could not connect to the server");
    }
  }

  if (submitted) return <p className="my-3">Thanks, your report has been sent to the admins.</p>;

  if (!open) {
    return (
      <button className="my-3 cursor-pointer" onClick={() => setOpen(true)}>
        Report post
      </button>
    );
  }

  return (
    <form className="border border-gray-400 p-5 my-3" onSubmit={handleSubmit}>
      <p>Why are you reporting this post?</p>
      <textarea
        className="w-80 resize-y text-lg border border-gray-400 bg-gray-300 p-2 my-2"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button className="bg-black cursor-pointer text-white p-2 mr-2" type="submit">
        Submit report
      </button>
      <button className="p-2" type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}