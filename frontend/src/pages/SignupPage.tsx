import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({ username, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "20px auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div className="logo" />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Create your account</div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650 }}>
              Track albums, write reviews, and follow friends.
            </div>
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
          <div className="grid-2">
            <div className="field">
              <label>Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <a className="btn" href="/login">
              Back to sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

