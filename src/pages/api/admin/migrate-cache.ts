import type { NextApiRequest, NextApiResponse } from "next";
import { checkBasicAuth } from "@/lib/basicAuth";

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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  if (!checkBasicAuth(req)) {
    return res.status(401).json({
      error: "Admin authentication required."
    });
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({
      error: "Supabase is not configured."
    });
  }

  const {
    customTopics = [],
    submissions = [],
    topicVideos = {},
    calendarEvents = []
  } = req.body || {};

  const results = {
    customTopics: 0,
    submissions: 0,
    topicVideos: 0,
    calendarEvents: 0
  };

  try {
    // --------------------------------------------------------
    // CUSTOM TOPICS
    // --------------------------------------------------------

    for (const topic of customTopics) {
      if (!topic?.id || !topic?.moduleId || !topic?.title) {
        continue;
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/topic_content`,
        {
          method: "POST",
          headers: {
            ...headers(),
            Prefer: "resolution=merge-duplicates,return=minimal"
          },
          body: JSON.stringify({
            id: topic.id,
            module_id: topic.moduleId,
            title: topic.title,
            duration: topic.duration || "15 mins",
            youtube_id: topic.youtubeId || null,
            notes_template: topic.notesTemplate || null,
            exercise: topic.exercise || null,
            updated_by: "cache-migration"
          })
        }
      );

      if (response.ok) {
        results.customTopics++;
      }
    }

    // --------------------------------------------------------
    // CONTRIBUTIONS
    // --------------------------------------------------------

    for (const sub of submissions) {
      if (!sub?.id || !sub?.topicId) {
        continue;
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/contributions`,
        {
          method: "POST",
          headers: {
            ...headers(),
            Prefer: "resolution=merge-duplicates,return=minimal"
          },
          body: JSON.stringify({
            id: sub.id,
            topic_id: sub.topicId,
            resource_title: sub.resourceTitle,
            link: sub.link,
            type: sub.type,
            contributor_name: sub.contributorName,
            contributor_email: sub.contributorEmail,
            status: sub.status || "Pending",
            suggested_topic_title: sub.suggestedTopicTitle || null,
            suggested_topic_duration:
              sub.suggestedTopicDuration || null,
            module_id: sub.moduleId || null,
            submitted_at:
              sub.submittedAt || new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        results.submissions++;
      }
    }

    // --------------------------------------------------------
    // TOPIC VIDEOS
    // --------------------------------------------------------

    for (const topicId of Object.keys(topicVideos)) {
      const videos = Array.isArray(topicVideos[topicId])
        ? topicVideos[topicId]
        : [];

      for (const url of videos) {
        if (!url) continue;

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/topic_videos`,
          {
            method: "POST",
            headers: {
              ...headers(),
              Prefer: "resolution=merge-duplicates,return=minimal"
            },
            body: JSON.stringify({
              topic_id: topicId,
              url,
              added_by: "cache-migration"
            })
          }
        );

        if (response.ok) {
          results.topicVideos++;
        }
      }
    }

    // --------------------------------------------------------
    // CALENDAR
    // --------------------------------------------------------

    for (const event of calendarEvents) {
      if (
        !event?.userEmail ||
        !event?.itemId ||
        !event?.scheduledDate
      ) {
        continue;
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/study_calendar_events`,
        {
          method: "POST",
          headers: {
            ...headers(),
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            user_email: event.userEmail,
            item_type: event.itemType,
            item_id: event.itemId,
            title: event.title,
            scheduled_date: event.scheduledDate
          })
        }
      );

      if (response.ok) {
        results.calendarEvents++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Admin browser cache migration completed.",
      results
    });
  } catch {
    return res.status(500).json({
      error: "Cache migration failed."
    });
  }
}
