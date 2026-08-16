import type { NextApiRequest, NextApiResponse } from "next";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers() {
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
  // GET EVENTS
  // ----------------------------------------------------------

  if (req.method === "GET") {
    const userEmail = String(req.query.userEmail || "");

    if (!userEmail) {
      return res.status(400).json({
        error: "userEmail is required."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/study_calendar_events?user_email=eq.${encodeURIComponent(
          userEmail
        )}&select=*&order=scheduled_date.asc`,
        {
          headers: headers()
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
        error: "Failed to load calendar."
      });
    }
  }

  // ----------------------------------------------------------
  // CREATE EVENT
  // ----------------------------------------------------------

  if (req.method === "POST") {
    const {
      userEmail,
      itemType,
      itemId,
      title,
      scheduledDate
    } = req.body || {};

    if (
      !userEmail ||
      !itemType ||
      !itemId ||
      !title ||
      !scheduledDate
    ) {
      return res.status(400).json({
        error: "Missing calendar event fields."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/study_calendar_events`,
        {
          method: "POST",
          headers: {
            ...headers(),
            Prefer: "return=representation"
          },
          body: JSON.stringify({
            user_email: userEmail,
            item_type: itemType,
            item_id: String(itemId),
            title,
            scheduled_date: scheduledDate
          })
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
        error: "Failed to create calendar event."
      });
    }
  }

  // ----------------------------------------------------------
  // MOVE EVENT
  // ----------------------------------------------------------

  if (req.method === "PATCH") {
    const { id, scheduledDate, userEmail } = req.body || {};

    if (!id || !scheduledDate || !userEmail) {
      return res.status(400).json({
        error: "id, scheduledDate and userEmail are required."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/study_calendar_events?id=eq.${encodeURIComponent(
          id
        )}&user_email=eq.${encodeURIComponent(userEmail)}`,
        {
          method: "PATCH",
          headers: {
            ...headers(),
            Prefer: "return=representation"
          },
          body: JSON.stringify({
            scheduled_date: scheduledDate
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
        error: "Failed to move calendar event."
      });
    }
  }

  // ----------------------------------------------------------
  // DELETE EVENT
  // ----------------------------------------------------------

  if (req.method === "DELETE") {
    const { id, userEmail } = req.query;

    if (!id || !userEmail) {
      return res.status(400).json({
        error: "id and userEmail are required."
      });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/study_calendar_events?id=eq.${encodeURIComponent(
          String(id)
        )}&user_email=eq.${encodeURIComponent(String(userEmail))}`,
        {
          method: "DELETE",
          headers: headers()
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: await response.text()
        });
      }

      return res.status(204).end();
    } catch {
      return res.status(500).json({
        error: "Failed to delete calendar event."
      });
    }
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");

  return res.status(405).json({
    error: "Method not allowed."
  });
}
