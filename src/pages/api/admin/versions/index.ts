import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: "Supabase not configured on server" });

  if (req.method === "GET") {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/versions?select=*&order=created_at.desc`, {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          Accept: "application/json"
        }
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch versions from Supabase" });
    }
  }

  if (req.method === "POST") {
    if (!checkBasicAuth(req)) return res.status(401).json({ error: "Unauthorized" });
    const { label, notes, problems, createdBy } = req.body || {};
    if (!label) return res.status(400).json({ error: "label is required" });

    try {
      const body = { label, notes: notes || [], problems: problems || [], created_by: createdBy || null };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/versions`, {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      return res.status(201).json(data[0] || data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to insert version into Supabase" });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
