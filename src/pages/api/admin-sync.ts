import type {
  NextApiRequest,
  NextApiResponse
} from "next";

import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL =
  process.env.SUPABASE_URL as string;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY as string;


/* ============================================================
   TYPES
============================================================ */

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


/* ============================================================
   SUPABASE HEADERS
============================================================ */

function supabaseHeaders() {
  return {
    apikey: SERVICE_KEY,

    Authorization:
      `Bearer ${SERVICE_KEY}`,

    "Content-Type":
      "application/json"
  };
}


/* ============================================================
   EMPTY RESULT
============================================================ */

function emptyResult(): SyncResult {
  return {
    attempted: 0,
    synced: 0,
    verified: 0
  };
}


/* ============================================================
   GENERIC SUPABASE UPSERT
============================================================ */

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


  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/${table}`,
      {
        method: "POST",

        headers: {
          ...supabaseHeaders(),

          Prefer:
            "resolution=merge-duplicates,return=representation"
        },

        body:
          JSON.stringify(rows)
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `${table} insert failed: ${errorText}`
    );
  }


  const data =
    await response.json();


  return {
    attempted:
      rows.length,

    synced:
      Array.isArray(data)
        ? data.length
        : rows.length
  };
}


/* ============================================================
   SPECIAL TOPIC VIDEO SYNC

   IMPORTANT:

   topic_videos has a unique constraint:

   (topic_id, url)

   If the video already exists, that is NOT a failure.

   We count it as successfully synced.

============================================================ */

async function upsertTopicVideos(
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


  let synced = 0;


  for (
    const row of rows
  ) {

    const topicId =
      String(
        row.topic_id
      );

    const url =
      String(
        row.url
      );


    /* --------------------------------------------------------
       CHECK WHETHER VIDEO ALREADY EXISTS
    -------------------------------------------------------- */

    const checkResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
          topicId
        )}&url=eq.${encodeURIComponent(
          url
        )}&select=id`,
        {
          method: "GET",

          headers:
            supabaseHeaders()
        }
      );


    if (!checkResponse.ok) {

      const errorText =
        await checkResponse.text();

      throw new Error(
        `Could not check existing topic video: ${errorText}`
      );
    }


    const existing =
      await checkResponse.json();


    /* --------------------------------------------------------
       VIDEO ALREADY EXISTS

       This is SUCCESSFUL.

       We do NOT insert it again.
    -------------------------------------------------------- */

    if (
      Array.isArray(
        existing
      ) &&
      existing.length > 0
    ) {

      synced++;

      continue;
    }


    /* --------------------------------------------------------
       VIDEO DOES NOT EXIST
       
       INSERT IT.
    -------------------------------------------------------- */

    const insertResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos`,
        {
          method: "POST",

          headers: {
            ...supabaseHeaders(),

            Prefer:
              "return=representation"
          },

          body:
            JSON.stringify(
              row
            )
        }
      );


    /* --------------------------------------------------------
       INSERT FAILED
    -------------------------------------------------------- */

    if (
      !insertResponse.ok
    ) {

      const errorText =
        await insertResponse.text();


      /* ------------------------------------------------------
         HANDLE DUPLICATE RACE CONDITION

         It is possible another request inserted
         the video between our check and insert.

         If that happens, check again.
      ------------------------------------------------------ */

      if (
        errorText.includes(
          "23505"
        ) ||
        errorText.includes(
          "duplicate key"
        )
      ) {

        const verifyExisting =
          await fetch(
            `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
              topicId
            )}&url=eq.${encodeURIComponent(
              url
            )}&select=id`,
            {
              method: "GET",

              headers:
                supabaseHeaders()
            }
          );


        if (
          verifyExisting.ok
        ) {

          const verified =
            await verifyExisting.json();


          if (
            Array.isArray(
              verified
            ) &&
            verified.length > 0
          ) {

            synced++;

            continue;
          }
        }
      }


      throw new Error(
        `topic_videos insert failed: ${errorText}`
      );
    }


    /* --------------------------------------------------------
       NEW VIDEO INSERTED SUCCESSFULLY
    -------------------------------------------------------- */

    synced++;
  }


  return {
    attempted:
      rows.length,

    synced
  };
}


/* ============================================================
   VERIFY TOPICS
============================================================ */

async function verifyTopics(
  rows: any[]
) {

  if (!rows.length) {
    return 0;
  }


  let verified = 0;


  for (
    const row of rows
  ) {

    const id =
      encodeURIComponent(
        String(
          row.id
        )
      );


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_content?id=eq.${id}&select=id`,
        {
          headers:
            supabaseHeaders()
        }
      );


    if (!response.ok) {

      throw new Error(
        `Topic verification failed: ${await response.text()}`
      );
    }


    const data =
      await response.json();


    if (
      Array.isArray(
        data
      ) &&
      data.length > 0
    ) {

      verified++;
    }
  }


  return verified;
}


/* ============================================================
   VERIFY CONTRIBUTIONS
============================================================ */

async function verifyContributions(
  rows: any[]
) {

  if (!rows.length) {
    return 0;
  }


  let verified = 0;


  for (
    const row of rows
  ) {

    const id =
      encodeURIComponent(
        String(
          row.id
        )
      );


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/contributions?id=eq.${id}&select=id`,
        {
          headers:
            supabaseHeaders()
        }
      );


    if (!response.ok) {

      throw new Error(
        `Contribution verification failed: ${await response.text()}`
      );
    }


    const data =
      await response.json();


    if (
      Array.isArray(
        data
      ) &&
      data.length > 0
    ) {

      verified++;
    }
  }


  return verified;
}


/* ============================================================
   VERIFY VIDEOS
============================================================ */

async function verifyVideos(
  rows: any[]
) {

  if (!rows.length) {
    return 0;
  }


  let verified = 0;


  for (
    const row of rows
  ) {

    const topicId =
      encodeURIComponent(
        String(
          row.topic_id
        )
      );


    const url =
      encodeURIComponent(
        String(
          row.url
        )
      );


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${topicId}&url=eq.${url}&select=id`,
        {
          headers:
            supabaseHeaders()
        }
      );


    if (!response.ok) {

      throw new Error(
        `Video verification failed: ${await response.text()}`
      );
    }


    const data =
      await response.json();


    if (
      Array.isArray(
        data
      ) &&
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
) {

  if (!rows.length) {
    return 0;
  }


  let verified = 0;


  for (
    const row of rows
  ) {

    const userId =
      encodeURIComponent(
        String(
          row.user_id
        )
      );


    const title =
      encodeURIComponent(
        String(
          row.title
        )
      );


    const startDate =
      encodeURIComponent(
        String(
          row.start_date
        )
      );


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/calendar_events?user_id=eq.${userId}&title=eq.${title}&start_date=eq.${startDate}&select=id`,
        {
          headers:
            supabaseHeaders()
        }
      );


    if (!response.ok) {

      throw new Error(
        `Calendar verification failed: ${await response.text()}`
      );
    }


    const data =
      await response.json();


    if (
      Array.isArray(
        data
      ) &&
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

  /* ==========================================================
     METHOD
  ========================================================== */

  if (
    req.method !== "POST"
  ) {

    res.setHeader(
      "Allow",
      "POST"
    );


    return res.status(
      405
    ).json({

      success: false,

      error:
        "Method not allowed."
    });
  }


  /* ==========================================================
     ADMIN AUTHENTICATION
  ========================================================== */

  if (
    !checkBasicAuth(
      req
    )
  ) {

    return res.status(
      401
    ).json({

      success: false,

      error:
        "Admin authentication failed."
    });
  }


  /* ==========================================================
     SUPABASE CONFIGURATION
  ========================================================== */

  if (
    !SUPABASE_URL ||
    !SERVICE_KEY
  ) {

    return res.status(
      500
    ).json({

      success: false,

      error:
        "Supabase server configuration is missing."
    });
  }


  /* ==========================================================
     READ REQUEST BODY
  ========================================================== */

  const body =
    req.body || {};


  /* ==========================================================
     READ ADMIN CACHE
  ========================================================== */

  const customTopics =
    Array.isArray(
      body.customTopics
    )
      ? body.customTopics
      : [];


  const submissions =
    Array.isArray(
      body.submissions
    )
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

    /* ========================================================
       INITIAL RESULTS
    ======================================================== */

    const results:
      SyncResults = {

      topics:
        emptyResult(),

      contributions:
        emptyResult(),

      videos:
        emptyResult(),

      calendar:
        emptyResult()
    };


    /* ========================================================
       TOPICS
    ======================================================== */

    const topicRows =
      customTopics

        .filter(
          (topic: any) =>
            topic?.id &&
            topic?.title
        )

        .map(
          (topic: any) => ({

            id:
              String(
                topic.id
              ),

            module_id:
              topic.moduleId
                ? Number(
                    topic.moduleId
                  )
                : null,

            title:
              String(
                topic.title
              ),

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
          })
        );


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

        .map(
          (sub: any) => ({

            id:
              String(
                sub.id
              ),

            topic_id:
              String(
                sub.topicId
              ),

            resource_title:
              String(
                sub.resourceTitle
              ),

            link:
              String(
                sub.link
              ),

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
              ].includes(
                sub.status
              )
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
                ? Number(
                    sub.moduleId
                  )
                : null,

            submitted_at:
              sub.submittedAt ||
              new Date().toISOString()
          })
        );


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
       VIDEOS
    ======================================================== */

    const videoRows:
      any[] = [];


    Object.entries(
      topicVideos
    ).forEach(
      (
        [
          topicId,
          videos
        ]
      ) => {

        if (
          !Array.isArray(
            videos
          )
        ) {
          return;
        }


        videos.forEach(
          (
            url
          ) => {

            if (!url) {
              return;
            }


            videoRows.push({

              topic_id:
                String(
                  topicId
                ),

              url:
                String(
                  url
                ),

              added_by:
                "admin-cache-sync"
            });
          }
        );
      }
    );


    /* --------------------------------------------------------
       REMOVE DUPLICATES FROM BROWSER CACHE
    -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       SYNC VIDEOS

       IMPORTANT:
       Existing videos count as synced.
    -------------------------------------------------------- */

    const videoWrite =
      await upsertTopicVideos(
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
            event?.userId &&
            event?.title &&
            event?.startDate
        )

        .map(
          (event: any) => ({

            user_id:
              String(
                event.userId
              ),

            type:
              String(
                event.type ||
                "topic"
              ),

            title:
              String(
                event.title
              ),

            start_date:
              String(
                event.startDate
              ),

            end_date:
              String(
                event.endDate ||
                event.startDate
              ),

            color:
              event.color ||
              null
          })
        );


    const calendarWrite =
      await upsertRows(
        "calendar_events",
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
       TOTALS
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


    /* ========================================================
       NO DATA = FAILURE
       
       This prevents an empty browser cache from
       being incorrectly reported as successful.
    ======================================================== */

    if (
      totalAttempted === 0
    ) {

      return res.status(
        400
      ).json({

        success: false,

        error:
          "No admin cache data was found. Nothing was added to Supabase.",

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


    /* ========================================================
       FINAL SUCCESS CHECK
       
       SUCCESS requires:

       attempted = synced
       attempted = verified
    ======================================================== */

    const success =
      totalSynced ===
        totalAttempted &&
      totalVerified ===
        totalAttempted;


    if (!success) {

      return res.status(
        500
      ).json({

        success: false,

        error:
          "Sync failed. Supabase did not verify every admin cache record.",

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


    /* ========================================================
       TRUE SUCCESS
    ======================================================== */

    return res.status(
      200
    ).json({

      success: true,

      message:
        "SYNC SUCCESSFUL — Admin cache data is stored in Supabase and every record was verified.",

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


  } catch (
    error: any
  ) {

    console.error(
      "ADMIN CACHE SYNC ERROR:",
      error
    );


    return res.status(
      500
    ).json({

      success: false,

      error:
        error?.message ||
        "Admin cache synchronization failed."
    });
  }
}
