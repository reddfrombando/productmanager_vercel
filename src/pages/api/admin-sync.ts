import type {
  NextApiRequest,
  NextApiResponse
} from "next";

import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL =
  process.env.SUPABASE_URL as string;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY as string;

type SyncResult = {
  attempted: number;
  synced: number;
  verified: number;
};

type SyncResults = {
  topics: SyncResult;
  contributions: SyncResult;
  videos: SyncResult;
  calendar: SyncResult;
};

function supabaseHeaders() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json"
  };
}

function emptyResult(): SyncResult {
  return {
    attempted: 0,
    synced: 0,
    verified: 0
  };
}

async function upsertRows(
  table: string,
  rows: any[]
): Promise<{
  attempted: number;
  synced: number;
}> {
  if (!rows.length) {
    return {
      attempted: 0,
      synced: 0
    };
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}`,
    {
      method: "POST",

      headers: {
        ...supabaseHeaders(),

        Prefer:
          "resolution=merge-duplicates,return=representation"
      },

      body: JSON.stringify(rows)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `${table} insert failed: ${errorText}`
    );
  }

  const data = await response.json();

  return {
    attempted: rows.length,
    synced: Array.isArray(data)
      ? data.length
      : rows.length
  };
}


/* ============================================================
   VERIFY TOPICS
============================================================ */

async function verifyTopics(
  rows: any[]
): Promise<number> {
  if (!rows.length) return 0;

  const ids = rows
    .map((row) => row.id)
    .filter(Boolean);

  const filter = ids
    .map(
      (id) =>
        `"${String(id).replace(/"/g, '\\"')}"`
    )
    .join(",");

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/topic_content?id=in.(${encodeURIComponent(
      filter
    )})&select=id`,
    {
      headers: supabaseHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      `Topic verification failed: ${await response.text()}`
    );
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data.length
    : 0;
}


/* ============================================================
   VERIFY CONTRIBUTIONS
============================================================ */

async function verifyContributions(
  rows: any[]
): Promise<number> {
  if (!rows.length) return 0;

  const ids = rows
    .map((row) => row.id)
    .filter(Boolean);

  const filter = ids
    .map(
      (id) =>
        `"${String(id).replace(/"/g, '\\"')}"`
    )
    .join(",");

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/contributions?id=in.(${encodeURIComponent(
      filter
    )})&select=id`,
    {
      headers: supabaseHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      `Contribution verification failed: ${await response.text()}`
    );
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data.length
    : 0;
}


/* ============================================================
   VERIFY VIDEOS
============================================================ */

async function verifyVideos(
  rows: any[]
): Promise<number> {
  if (!rows.length) return 0;

  let verified = 0;

  for (const row of rows) {
    const topicId =
      encodeURIComponent(
        String(row.topic_id)
      );

    const url =
      encodeURIComponent(
        String(row.url)
      );

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${topicId}&url=eq.${url}&select=id`,
      {
        headers: supabaseHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(
        `Video verification failed: ${await response.text()}`
      );
    }

    const data = await response.json();

    if (
      Array.isArray(data) &&
      data.length > 0
    ) {
      verified++;
    }
  }

  return verified;
}


/* ============================================================
   VERIFY CALENDAR
============================================================ */

async function verifyCalendar(
  rows: any[]
): Promise<number> {
  if (!rows.length) return 0;

  let verified = 0;

  for (const row of rows) {
    const userEmail =
      encodeURIComponent(
        String(row.user_email)
      );

    const itemType =
      encodeURIComponent(
        String(row.item_type)
      );

    const itemId =
      encodeURIComponent(
        String(row.item_id)
      );

    const scheduledDate =
      encodeURIComponent(
        String(row.scheduled_date)
      );

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/study_calendar_events?user_email=eq.${userEmail}&item_type=eq.${itemType}&item_id=eq.${itemId}&scheduled_date=eq.${scheduledDate}&select=id`,
      {
        headers: supabaseHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(
        `Calendar verification failed: ${await response.text()}`
      );
    }

    const data = await response.json();

    if (
      Array.isArray(data) &&
      data.length > 0
    ) {
      verified++;
    }
  }

  return verified;
}


/* ============================================================
   MAIN API
============================================================ */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader(
      "Allow",
      "POST"
    );

    return res.status(405).json({
      success: false,
      error: "Method not allowed."
    });
  }


  /* ----------------------------------------------------------
     ADMIN AUTHENTICATION
  ---------------------------------------------------------- */

  if (!checkBasicAuth(req)) {
    return res.status(401).json({
      success: false,
      error:
        "Admin authentication failed."
    });
  }


  /* ----------------------------------------------------------
     SUPABASE CONFIG
  ---------------------------------------------------------- */

  if (
    !SUPABASE_URL ||
    !SERVICE_KEY
  ) {
    return res.status(500).json({
      success: false,
      error:
        "Supabase server configuration is missing."
    });
  }


  const body =
    req.body || {};


  /* ----------------------------------------------------------
     READ ONLY THE ADMIN CACHE
  ---------------------------------------------------------- */

  const customTopics =
    Array.isArray(body.customTopics)
      ? body.customTopics
      : [];

  const submissions =
    Array.isArray(body.submissions)
      ? body.submissions
      : [];

  const topicVideos =
    body.topicVideos &&
    typeof body.topicVideos ===
      "object"
      ? body.topicVideos
      : {};

  const calendarEvents =
    Array.isArray(
      body.calendarEvents
    )
      ? body.calendarEvents
      : [];


  try {
    const results: SyncResults = {
      topics: emptyResult(),
      contributions: emptyResult(),
      videos: emptyResult(),
      calendar: emptyResult()
    };


    /* ========================================================
       TOPICS
    ======================================================== */

    const topicRows =
      customTopics
        .filter(
          (topic: any) =>
            topic?.id &&
            topic?.moduleId &&
            topic?.title
        )
        .map((topic: any) => ({
          id: String(topic.id),

          module_id:
            Number(topic.moduleId),

          title:
            String(topic.title),

          duration:
            topic.duration ||
            "15 mins",

          youtube_id:
            topic.youtubeId ||
            null,

          notes_template:
            topic.notesTemplate ||
            null,

          exercise:
            topic.exercise ||
            null,

          created_by:
            "admin-cache-sync",

          updated_by:
            "admin-cache-sync"
        }));


    const topicWrite =
      await upsertRows(
        "topic_content",
        topicRows
      );

    results.topics.attempted =
      topicWrite.attempted;

    results.topics.synced =
      topicWrite.synced;

    results.topics.verified =
      await verifyTopics(
        topicRows
      );


    /* ========================================================
       CONTRIBUTIONS
    ======================================================== */

    const contributionRows =
      submissions
        .filter(
          (sub: any) =>
            sub?.id &&
            sub?.topicId &&
            sub?.resourceTitle &&
            sub?.link
        )
        .map((sub: any) => ({
          id: String(sub.id),

          topic_id:
            String(sub.topicId),

          resource_title:
            String(
              sub.resourceTitle
            ),

          link:
            String(sub.link),

          type:
            String(
              sub.type ||
                "Article"
            ),

          contributor_name:
            String(
              sub.contributorName ||
                "Unknown"
            ),

          contributor_email:
            String(
              sub.contributorEmail ||
                ""
            ),

          status:
            [
              "Pending",
              "Approved",
              "Rejected"
            ].includes(sub.status)
              ? sub.status
              : "Pending",

          suggested_topic_title:
            sub.suggestedTopicTitle ||
            null,

          suggested_topic_duration:
            sub.suggestedTopicDuration ||
            null,

          module_id:
            sub.moduleId
              ? Number(sub.moduleId)
              : null,

          submitted_at:
            sub.submittedAt ||
            new Date().toISOString()
        }));


    const contributionWrite =
      await upsertRows(
        "contributions",
        contributionRows
      );

    results.contributions.attempted =
      contributionWrite.attempted;

    results.contributions.synced =
      contributionWrite.synced;

    results.contributions.verified =
      await verifyContributions(
        contributionRows
      );


    /* ========================================================
       TOPIC VIDEOS
    ======================================================== */

    const videoRows: any[] = [];

    Object.entries(
      topicVideos
    ).forEach(
      ([topicId, videos]) => {
        if (!Array.isArray(videos))
          return;

        videos.forEach(
          (url) => {
            if (!url) return;

            videoRows.push({
              topic_id:
                String(topicId),

              url:
                String(url),

              added_by:
                "admin-cache-sync"
            });
          }
        );
      }
    );


    const uniqueVideoRows =
      Array.from(
        new Map(
          videoRows.map(
            (row) => [
              `${row.topic_id}::${row.url}`,
              row
            ]
          )
        ).values()
      );


    const videoWrite =
      await upsertRows(
        "topic_videos",
        uniqueVideoRows
      );

    results.videos.attempted =
      videoWrite.attempted;

    results.videos.synced =
      videoWrite.synced;

    results.videos.verified =
      await verifyVideos(
        uniqueVideoRows
      );


    /* ========================================================
       CALENDAR
    ======================================================== */

    const calendarRows =
      calendarEvents
        .filter(
          (event: any) =>
            event?.userEmail &&
            event?.itemType &&
            event?.itemId &&
            event?.title &&
            event?.scheduledDate
        )
        .map((event: any) => ({
          user_email:
            String(event.userEmail),

          item_type:
            String(event.itemType),

          item_id:
            String(event.itemId),

          title:
            String(event.title),

          scheduled_date:
            String(event.scheduledDate)
        }));


    const calendarWrite =
      await upsertRows(
        "study_calendar_events",
        calendarRows
      );

    results.calendar.attempted =
      calendarWrite.attempted;

    results.calendar.synced =
      calendarWrite.synced;

    results.calendar.verified =
      await verifyCalendar(
        calendarRows
      );


    /* ========================================================
       FINAL VERIFICATION
    ======================================================== */

    const totalAttempted =
      results.topics.attempted +
      results.contributions.attempted +
      results.videos.attempted +
      results.calendar.attempted;

    const totalSynced =
      results.topics.synced +
      results.contributions.synced +
      results.videos.synced +
      results.calendar.synced;

    const totalVerified =
      results.topics.verified +
      results.contributions.verified +
      results.videos.verified +
      results.calendar.verified;


    const success =
      totalVerified ===
      totalAttempted;


    if (!success) {
      return res.status(500).json({
        success: false,

        error:
          "Sync completed partially, but Supabase verification did not confirm every record.",

        results,

        totals: {
          attempted:
            totalAttempted,

          synced:
            totalSynced,

          verified:
            totalVerified
        }
      });
    }


    return res.status(200).json({
      success: true,

      message:
        "Admin cache successfully synced and verified in Supabase.",

      results,

      totals: {
        attempted:
          totalAttempted,

        synced:
          totalSynced,

        verified:
          totalVerified
      }
    });


  } catch (error: any) {
    console.error(
      "ADMIN CACHE SYNC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      error:
        error?.message ||
        "Admin cache synchronization failed."
    });
  }
}
