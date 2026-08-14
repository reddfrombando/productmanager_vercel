import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: "Supabase not configured" });
  const { id, sid } = req.query;
  if (!id || typeof id !== "string" || !sid || typeof sid !== "string") return res.status(400).json({ error: "invalid id/sid" });

  if (!checkBasicAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/version_screenshots?id=eq.${sid}`, {
        method: "DELETE",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: "return=representation" }
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete screenshot" });
    }
  }

  res.setHeader("Allow", "DELETE");
  res.status(405).end("Method Not Allowed");
}
