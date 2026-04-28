import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ emailOrUsername, password });
      navigate("/library");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "20px auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div className="logo" />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Welcome back</div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650 }}>
              Sign in to Records
            </div>
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
          <div className="field">
            <label>Email or username</label>
            <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required />
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <a className="btn" href="/signup">
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

