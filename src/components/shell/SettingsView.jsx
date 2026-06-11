import { useState } from "react";
import { ViewFrame } from "@/components/shell/ViewFrame";
import { Link, RefreshCw, Users, Trash2, Check, Copy } from "lucide-react";
import "@/styles/settings.css";

export function SettingsView() {
  const [users, setUsers] = useState([
    { email: "admin@efferd.io", role: "admin", access: "Full Access" },
    { email: "developer@efferd.io", role: "write", access: "Telemetry Only" },
    { email: "viewer@efferd.io", role: "read", access: "Read Only" },
  ]);

  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);

  const generateLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://app.efferd.io/join/${randomId}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReanalyze = () => {
    setReanalyzing(true);
    setTimeout(() => {
      setReanalyzing(false);
      alert("Re-analysis request sent successfully!");
    }, 1500);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete Sentry Observability Hub? This action is permanent and cannot be undone.")) {
      alert("Project deleted.");
    }
  };

  return (
    <ViewFrame
      title="Settings"
      description="Manage workspace access permissions, link generation, re-analysis execution, and project removal."
      maxWidthClassName="max-w-4xl"
    >
      <div className="settings-wrapper">
        {/* Section 1: Generate Links */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Link size={16} className="text-accent" />
            <h3 className="settings-card-title">Generate Access Links</h3>
          </div>
          <p className="settings-card-description">
            Generate secure invite links for external team members or automated telemetry hooks to integrate Sentry logs.
          </p>
          <div className="settings-action-row">
            <button onClick={generateLink} className="settings-btn-secondary">
              Generate New Link
            </button>
            {generatedLink && (
              <div className="settings-link-display">
                <span className="settings-link-text">{generatedLink}</span>
                <button onClick={copyLink} className="settings-copy-btn">
                  {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Re-analysis */}
        <div className="settings-card">
          <div className="settings-card-header">
            <RefreshCw size={16} className="text-accent" />
            <h3 className="settings-card-title">Request Re-analysis</h3>
          </div>
          <p className="settings-card-description">
            Force Sentry parser to re-scan all server nodes, log history, and telemetry streams to refresh security findings.
          </p>
          <div>
            <button onClick={handleReanalyze} disabled={reanalyzing} className="settings-btn-secondary">
              <RefreshCw size={14} className={reanalyzing ? "animate-spin" : ""} />
              {reanalyzing ? "Re-analyzing..." : "Run Re-analysis Now"}
            </button>
          </div>
        </div>

        {/* Section 3: Access Control */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Users size={16} className="text-accent" />
            <h3 className="settings-card-title">Access Permissions</h3>
          </div>
          <p className="settings-card-description">
            Configure access controls for active team members. Grant specific view permissions to prevent unauthorized settings modifications.
          </p>
          <div className="settings-users-list">
            {users.map((user, idx) => (
              <div key={user.email} className="settings-user-row">
                <div className="flex flex-col text-left">
                  <span className="settings-user-email">{user.email}</span>
                  <span className="settings-user-role">{user.role}</span>
                </div>
                <div>
                  <select
                    value={user.access}
                    onChange={(e) => {
                      const updated = [...users];
                      updated[idx].access = e.target.value;
                      setUsers(updated);
                    }}
                    className="settings-select"
                  >
                    <option value="Full Access">Full Access</option>
                    <option value="Telemetry Only">Telemetry Only</option>
                    <option value="Read Only">Read Only</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Danger Zone */}
        <div className="settings-danger-card">
          <div className="settings-danger-header">
            <Trash2 size={16} className="text-[#EF4444]" />
            <h3 className="settings-danger-title">Danger Zone</h3>
          </div>
          <p className="settings-card-description">
            Permanently delete Sentry Observability Hub telemetry configurations, database integrations, and logs. This action is irreversible.
          </p>
          <div>
            <button onClick={handleDelete} className="settings-btn-danger">
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </ViewFrame>
  );
}
