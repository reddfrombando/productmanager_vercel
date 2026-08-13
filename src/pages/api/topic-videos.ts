import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "./_helpers/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: "Supabase not configured on server" });
  }

  if (req.method === "GET") {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/topic_videos?select=topic_id,url,added_by,created_at`, {
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
      return res.status(500).json({ error: "Failed to fetch from Supabase" });
    }
  }

  if (req.method === "POST") {
    // Admin-only
    if (!checkBasicAuth(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { topicId, url, adminUser } = req.body || {};
    if (!topicId || !url) {
      return res.status(400).json({ error: "topicId and url are required" });
    }

    try {
      const body = { topic_id: topicId, url, added_by: adminUser?.email || null };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/topic_videos`, {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) {
        const txt = await r.text();
        return res.status(r.status).json({ error: txt });
      }
      const data = await r.json();
      // return inserted row
      return res.status(201).json(data[0] || data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to insert into Supabase" });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
