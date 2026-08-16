import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function dbHeaders() {
  return {
    apikey: SERVICE_KEY as string,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json"
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({
      error: "Supabase is not configured."
    });
  }

  // ----------------------------------------------------------
  // USER SUBMITS CONTRIBUTION
  // ----------------------------------------------------------

  if (req.method === "POST") {
    const {
      id,
      topicId,
      resourceTitle,
      link,
      type,
      contributorName,
      contributorEmail,
      suggestedTopicTitle,
      suggestedTopicDuration,
      moduleId
    } = req.body || {};

    if (
      !topicId ||
      !resourceTitle ||
      !link ||
      !type ||
      !contributorName ||
      !contributorEmail
    ) {
      return res.status(400).json({
        error: "All contribution fields are required."
      });
    }

    const contribution = {
      id: id || `sub-${Date.now()}`,
      topic_id: String(topicId),
      resource_title: String(resourceTitle),
      link: String(link),
      type: String(type),
      contributor_name: String(contributorName),
      contributor_email: String(contributorEmail),
      status: "Pending",
      suggested_topic_title: suggestedTopicTitle || null,
      suggested_topic_duration: suggestedTopicDuration || null,
      module_id: moduleId ? Number(moduleId) : null,
      submitted_at: new Date().toISOString()
    };

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/contributions`,
        {
          method: "POST",
          headers: {
            ...dbHeaders(),
            Prefer: "return=representation"
          },
          body: JSON.stringify(contribution)
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
        error: "Failed to save contribution."
      });
    }
  }

  // ----------------------------------------------------------
  // ADMIN GETS ALL CONTRIBUTIONS
  // ----------------------------------------------------------

  if (req.method === "GET") {
    if (!checkBasicAuth(req)) {
      return res.status(401).json({
        error: "Admin authentication required."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/contributions?select=*&order=submitted_at.desc`,
        {
          headers: dbHeaders()
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
        error: "Failed to load contributions."
      });
    }
  }

  // ----------------------------------------------------------
  // ADMIN APPROVES / REJECTS CONTRIBUTION
  // ----------------------------------------------------------

  if (req.method === "PATCH") {
    if (!checkBasicAuth(req)) {
      return res.status(401).json({
        error: "Admin authentication required."
      });
    }

    const { id, status, reviewedBy } = req.body || {};

    if (!id || !["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        error: "Valid id and status are required."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/contributions?id=eq.${encodeURIComponent(
          id
        )}`,
        {
          method: "PATCH",
          headers: {
            ...dbHeaders(),
            Prefer: "return=representation"
          },
          body: JSON.stringify({
            status,
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewedBy || null
          })
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: await response.text()
        });
      }

      const data = await response.json();

      return res.status(200).json(data?.[0] || data);
    } catch {
      return res.status(500).json({
        error: "Failed to update contribution."
      });
    }
  }

  res.setHeader("Allow", "GET, POST, PATCH");

  return res.status(405).json({
    error: "Method not allowed."
  });
}
