import { useState } from "react";
import axiosInstance from "../app/axios";

function Guest() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can help with Tamil Nadu temples, heritage sites, trip ideas, routes, and cultural history. This guest chat resets on refresh.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendGuestMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userText = message.trim();
    const history = messages.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/guest/chat", {
        message: userText,
        history,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The AI guide is unavailable right now. Please check the backend API key and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="guest-chat-card card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>AI Guide</span>
          <span className="badge bg-success">Guest Mode</span>
        </div>
        <div className="card-body">
          <div className="guest-chat-messages mb-3">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`message ${
                  item.role === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div className="message-content">{item.content}</div>
              </div>
            ))}
            {loading && (
              <div className="message ai-message">
                <div className="message-content">Thinking...</div>
              </div>
            )}
          </div>
          <form onSubmit={sendGuestMessage} className="d-flex gap-2">
            <input
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about a Tamil Nadu heritage site..."
              disabled={loading}
            />
            <button className="btn btn-primary" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="alert alert-secondary mt-3">
        This chat stays in the current browser session. Refreshing the page
        starts fresh.
      </div>
    </div>
  );
}

export default Guest;
