import React, { useEffect, useState } from "react";

async function fetchVersions() {
  const r = await fetch("/api/admin/versions");
  if (!r.ok) throw new Error("Failed to fetch versions");
  return r.json();
}

function getAuthHeader() {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem("pm_admin_basic");
  if (cached) return { Authorization: `Basic ${cached}` };

  const user = window.prompt("Admin username:");
  if (!user) return null;
  const pass = window.prompt("Admin password:");
  if (!pass) return null;
  const encoded = btoa(`${user}:${pass}`);
  sessionStorage.setItem("pm_admin_basic", encoded);
  return { Authorization: `Basic ${encoded}` };
}

export default function VersionHistoryPage() {
  const [versions, setVersions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchVersions()
      .then((data) => setVersions(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchVersions();
      setVersions(data);
      if (selected) {
        const re = data.find((v: any) => v.id === selected.id) || null;
        setSelected(re);
      }
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async () => {
    if (!newLabel.trim()) return alert("Enter label");
    const headers = getAuthHeader();
    if (!headers) return alert("Admin credentials required");
    try {
      const res = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, notes: [], problems: [], createdBy: "admin" })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed");
      }
      setNewLabel("");
      await refresh();
    } catch (e: any) {
      alert("Create failed: " + (e.message || e));
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Version History</h2>
        <div className="flex items-center space-x-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New version label (e.g. v1.0)"
            className="px-3 py-1 rounded border"
          />
          <button onClick={createVersion} className="px-3 py-1 rounded bg-accent-purple text-white">
            Create
          </button>
          <button onClick={refresh} className="px-3 py-1 rounded border">
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white border rounded-xl p-3 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-sm">Loading...</div>
          ) : versions.length ? (
            versions.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className={`p-2 rounded cursor-pointer hover:bg-bg-light ${selected?.id === v.id ? "bg-bg-light" : ""}`}
              >
                <div className="font-bold text-sm truncate">{v.label}</div>
                <div className="text-xs text-primary/50 mt-1">{new Date(v.created_at).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-primary/50">No versions yet.</div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selected ? (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-bold text-base">{selected.label}</h3>
              <div className="text-xs text-primary/60 mt-1">Created: {new Date(selected.created_at).toLocaleString()}</div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm">Main Key Points</h4>
                  <pre className="whitespace-pre-wrap text-sm mt-2 bg-bg-light p-2 rounded">{JSON.stringify(selected.notes || [], null, 2)}</pre>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Problems Solved</h4>
                  <pre className="whitespace-pre-wrap text-sm mt-2 bg-bg-light p-2 rounded">{JSON.stringify(selected.problems || [], null, 2)}</pre>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-sm">Screenshots</h4>
                <div className="mt-2">
                  <a href={`/admin/versions/${selected.id}/screenshots`} className="text-accent-purple underline">
                    Manage screenshots (opens admin API)
                  </a>
                </div>
                <div className="mt-2">
                  <strong className="text-xs">Note</strong>
                  <div className="text-xs text-primary/60">Upload image files to the Supabase Storage bucket (Storage → version-screenshots) then enter the object path below to attach it to this version.</div>
                </div>

                <div className="mt-3">
                  {/* ScreenshotUploader component will be lazy — simple inline form here */}
                  <ScreenshotUploader versionId={selected.id} onUploaded={refresh} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-xl p-6 text-center">
              <div className="text-sm text-primary/50">Select a version to view details and attach screenshots.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function ScreenshotUploader({ versionId, onUploaded }: { versionId: string; onUploaded: () => void }) {
  const [path, setPath] = useState("");
  const [caption, setCaption] = useState("");

  const handleAdd = async () => {
    if (!path.trim()) return alert("Enter object path in bucket (e.g. folder/file.png)");
    const cached = sessionStorage.getItem("pm_admin_basic");
    if (!cached) {
      const user = window.prompt("Admin username:");
      if (!user) return;
      const pass = window.prompt("Admin password:");
      if (!pass) return;
      sessionStorage.setItem("pm_admin_basic", btoa(`${user}:${pass}`));
    }
    const auth = sessionStorage.getItem("pm_admin_basic");
    try {
      const res = await fetch(`/api/admin/versions/${versionId}/screenshots`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({ path, caption })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed");
      }
      alert("Screenshot metadata saved.");
      setPath("");
      setCaption("");
      onUploaded();
    } catch (e: any) {
      alert("Upload failed: " + (e.message || e));
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid sm:grid-cols-2 gap-2">
        <input placeholder="Object path in bucket (e.g. folder/file.png)" value={path} onChange={(e) => setPath(e.target.value)} className="px-3 py-2 border rounded" />
        <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className="px-3 py-2 border rounded" />
      </div>
      <div className="flex space-x-2">
        <button onClick={handleAdd} className="px-3 py-1 rounded bg-accent-purple text-white">Attach screenshot</button>
        <a target="_blank" rel="noreferrer" href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/buckets/${process.env.SUPABASE_BUCKET_NAME}/objects`} className="px-3 py-1 rounded border">Open bucket</a>
      </div>
    </div>
  );
}
