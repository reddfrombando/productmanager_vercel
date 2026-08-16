import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({
      error: "Supabase is not configured."
    });
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json"
  };

  // ----------------------------------------------------------
  // GET CUSTOM TOPICS
  // ----------------------------------------------------------

  if (req.method === "GET") {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/topic_content?select=*&order=created_at.asc`,
        {
          headers
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: await response.text()
        });
      }

      return res.status(200).json(await response.json());
    } catch {
      return res.status(500).json({
        error: "Failed to load topics."
      });
    }
  }

  // ----------------------------------------------------------
  // CREATE / UPDATE TOPIC
  // ----------------------------------------------------------

  if (req.method === "POST") {
    if (!checkBasicAuth(req)) {
      return res.status(401).json({
        error: "Admin authentication required."
      });
    }

    const {
      id,
      moduleId,
      title,
      duration,
      youtubeId,
      notesTemplate,
      exercise,
      adminUser
    } = req.body || {};

    if (!id || !moduleId || !title) {
      return res.status(400).json({
        error: "id, moduleId and title are required."
      });
    }

    const topic = {
      id: String(id),
      module_id: Number(moduleId),
      title: String(title),
      duration: duration || "15 mins",
      youtube_id: youtubeId || null,
      notes_template:
        notesTemplate ||
        `## Lecture Notes: ${title}\n\n- Key Concept 1:\n- Key Concept 2:\n- Strategic Takeaway:\n`,
      exercise:
        exercise ||
        "Reflect on how this concept impacts product management.",
      created_by: adminUser?.email || null,
      updated_by: adminUser?.email || null
    };

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/topic_content`,
        {
          method: "POST",
          headers: {
            ...headers,
            Prefer: "resolution=merge-duplicates,return=representation"
          },
          body: JSON.stringify(topic)
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: await response.text()
        });
      }

      const data = await response.json();

      return res.status(201).json(data?.[0] || data);
    } catch {
      return res.status(500).json({
        error: "Failed to save topic."
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({
    error: "Method not allowed."
  });
}
