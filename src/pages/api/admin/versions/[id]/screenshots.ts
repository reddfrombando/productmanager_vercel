import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const BUCKET = process.env.SUPABASE_BUCKET_NAME as string;
const TTL = Number(process.env.SIGNED_URL_TTL_SECONDS || "3600");

// This endpoint expects JSON body { path, caption, order_index }
// and will insert a row in version_screenshots. It will also
// return a signed URL for the given path so admin can preview.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SUPABASE_URL || !SERVICE_KEY || !BUCKET) return res.status(500).json({ error: "Supabase not configured" });
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "invalid id" });

  if (!checkBasicAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    // list screenshots for version
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/version_screenshots?version_id=eq.${id}&select=*&order=order_index.asc`, {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Accept: "application/json" }
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      // for each row, generate a signed url
      const signed = await Promise.all(data.map(async (row: any) => {
        const path = row.path;
        // request signed url
        const signRes = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(BUCKET)}/${encodeURIComponent(path)}`, {
          method: "POST",
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ expires_in: TTL })
        });
        if (!signRes.ok) {
          return { ...row, signedUrl: null };
        }
        const json = await signRes.json();
        return { ...row, signedUrl: json.signedURL || json.signedUrl || json }; // accommodate variations
      }));

      return res.status(200).json(signed);
    } catch (e) {
      return res.status(500).json({ error: "Failed to list screenshots" });
    }
  }

  if (req.method === "POST") {
    // Insert metadata after upload. Admin should upload file to storage (directly or via separate endpoint)
    const { path, caption, order_index } = req.body || {};
    if (!path) return res.status(400).json({ error: "path is required" });

    try {
      const body = { version_id: id, path, caption: caption || null, order_index: order_index || 0 };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/version_screenshots`, {
        method: "POST",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(body)
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      // return inserted row along with signed url to preview
      const row = data[0] || data;
      const signRes = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(BUCKET)}/${encodeURIComponent(path)}`, {
        method: "POST",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ expires_in: TTL })
      });
      let signed = null;
      if (signRes.ok) signed = await signRes.json();
      return res.status(201).json({ row, signed });
    } catch (e) {
      return res.status(500).json({ error: "Failed to create screenshot record" });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
