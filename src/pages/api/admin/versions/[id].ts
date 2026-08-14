import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: "Supabase not configured" });
  if (!id || typeof id !== "string") return res.status(400).json({ error: "invalid id" });

  if (req.method === "GET") {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/versions?id=eq.${id}&select=*`, {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Accept: "application/json" }
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      return res.status(200).json(data[0] || null);
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch version" });
    }
  }

  if (!checkBasicAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "PUT") {
    const { label, notes, problems } = req.body || {};
    try {
      const body: any = {};
      if (label !== undefined) body.label = label;
      if (notes !== undefined) body.notes = notes;
      if (problems !== undefined) body.problems = problems;
      body.updated_at = new Date().toISOString();

      const r = await fetch(`${SUPABASE_URL}/rest/v1/versions?id=eq.${id}`, {
        method: "PATCH",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(body)
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      return res.status(200).json(data[0] || data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to update version" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/versions?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: "return=representation" }
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete version" });
    }
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
