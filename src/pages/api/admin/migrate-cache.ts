import type {
  NextApiRequest,
  NextApiResponse
} from "next";

import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


/* ============================================================
   SUPABASE HEADERS
============================================================ */

function supabaseHeaders() {
  return {
    apikey: SERVICE_KEY as string,

    Authorization:
      `Bearer ${SERVICE_KEY}`,

    "Content-Type":
      "application/json"
  };
}


/* ============================================================
   CHECK EXISTING VIDEO
============================================================ */

async function videoExists(
  topicId: string,
  url: string
): Promise<boolean> {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/topic_videos` +
      `?topic_id=eq.${encodeURIComponent(topicId)}` +
      `&url=eq.${encodeURIComponent(url)}` +
      `&select=id`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

  if (!response.ok) {
    throw new Error(
      `Could not verify existing video: ${await response.text()}`
    );
  }

  const data =
    await response.json();

  return (
    Array.isArray(data) &&
    data.length > 0
  );
}


/* ============================================================
   MAIN HANDLER
============================================================ */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  /* ----------------------------------------------------------
     METHOD
  ---------------------------------------------------------- */

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
     ADMIN AUTH
  ---------------------------------------------------------- */

  if (!checkBasicAuth(req)) {

    return res.status(401).json({
      success: false,
      error:
        "Admin authentication required."
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
        "Supabase is not configured."
    });
  }


  /* ----------------------------------------------------------
     READ CACHE
  ---------------------------------------------------------- */

  const {
    customTopics = [],
    submissions = [],
    topicVideos = {},
    calendarEvents = []
  } = req.body || {};


  const results = {

    customTopics: {
      attempted: 0,
      synced: 0,
      verified: 0
    },

    submissions: {
      attempted: 0,
      synced: 0,
      verified: 0
    },

    topicVideos: {
      attempted: 0,
      synced: 0,
      verified: 0
    },

    calendarEvents: {
      attempted: 0,
      synced: 0,
      verified: 0
    }

  };


  try {

    /* ========================================================
       CUSTOM TOPICS
    ======================================================== */

    for (
      const topic of customTopics
    ) {

      if (
        !topic?.id ||
        !topic?.moduleId ||
        !topic?.title
      ) {
        continue;
      }

      results.customTopics.attempted++;

      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/topic_content`,
          {
            method: "POST",

            headers: {
              ...supabaseHeaders(),

              Prefer:
                "resolution=merge-duplicates,return=representation"
            },

            body:
              JSON.stringify({

                id:
                  String(topic.id),

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

                updated_by:
                  "cache-migration"

              })
          }
        );


      if (!response.ok) {

        throw new Error(
          `Topic sync failed: ${await response.text()}`
        );
      }


      results.customTopics.synced++;


      /* ------------------------------------------------------
         VERIFY TOPIC
      ------------------------------------------------------ */

      const verify =
        await fetch(
          `${SUPABASE_URL}/rest/v1/topic_content` +
          `?id=eq.${encodeURIComponent(
            String(topic.id)
          )}` +
          `&select=id`,
          {
            headers:
              supabaseHeaders()
          }
        );


      if (!verify.ok) {

        throw new Error(
          `Topic verification failed: ${await verify.text()}`
        );
      }


      const verified =
        await verify.json();


      if (
        Array.isArray(verified) &&
        verified.length > 0
      ) {
        results.customTopics.verified++;
      }

    }


    /* ========================================================
       CONTRIBUTIONS
    ======================================================== */

    for (
      const sub of submissions
    ) {

      if (
        !sub?.id ||
        !sub?.topicId ||
        !sub?.resourceTitle ||
        !sub?.link
      ) {
        continue;
      }

      results.submissions.attempted++;


      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/contributions`,
          {
            method: "POST",

            headers: {
              ...supabaseHeaders(),

              Prefer:
                "resolution=merge-duplicates,return=representation"
            },

            body:
              JSON.stringify({

                id:
                  String(sub.id),

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
          }
        );


      if (!response.ok) {

        throw new Error(
          `Contribution sync failed: ${await response.text()}`
        );
      }


      results.submissions.synced++;


      /* ------------------------------------------------------
         VERIFY CONTRIBUTION
      ------------------------------------------------------ */

      const verify =
        await fetch(
          `${SUPABASE_URL}/rest/v1/contributions` +
          `?id=eq.${encodeURIComponent(
            String(sub.id)
          )}` +
          `&select=id`,
          {
            headers:
              supabaseHeaders()
          }
        );


      if (!verify.ok) {

        throw new Error(
          `Contribution verification failed: ${await verify.text()}`
        );
      }


      const verified =
        await verify.json();


      if (
        Array.isArray(verified) &&
        verified.length > 0
      ) {
        results.submissions.verified++;
      }

    }


    /* ========================================================
       TOPIC VIDEOS
       
       EXISTING VIDEO = SUCCESS
    ======================================================== */

    for (
      const topicId of Object.keys(
        topicVideos
      )
    ) {

      const videos =
        Array.isArray(
          topicVideos[topicId]
        )
          ? topicVideos[topicId]
          : [];


      for (
        const url of videos
      ) {

        if (!url)
          continue;


        results.topicVideos.attempted++;


        const videoUrl =
          String(url);


        /* ----------------------------------------------------
           CHECK EXISTING VIDEO
        ---------------------------------------------------- */

        const exists =
          await videoExists(
            String(topicId),
            videoUrl
          );


        if (exists) {

          /*
           * Already in Supabase.
           * Therefore it is already successfully synced.
           */

          results.topicVideos.synced++;

          results.topicVideos.verified++;

          continue;
        }


        /* ----------------------------------------------------
           INSERT VIDEO
        ---------------------------------------------------- */

        const response =
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
                JSON.stringify({

                  topic_id:
                    String(topicId),

                  url:
                    videoUrl,

                  added_by:
                    "cache-migration"

                })
            }
          );


        if (!response.ok) {

          const errorText =
            await response.text();


          /*
           * A duplicate may have been
           * inserted between our check
           * and this insert.
           */

          if (
            errorText.includes("23505") ||
            errorText.includes(
              "duplicate key"
            )
          ) {

            const existsAfterInsert =
              await videoExists(
                String(topicId),
                videoUrl
              );


            if (
              existsAfterInsert
            ) {

              results.topicVideos.synced++;

              results.topicVideos.verified++;

              continue;
            }
          }


          throw new Error(
            `Topic video sync failed: ${errorText}`
          );
        }


        results.topicVideos.synced++;


        /* ----------------------------------------------------
           VERIFY VIDEO
        ---------------------------------------------------- */

        const verified =
          await videoExists(
            String(topicId),
            videoUrl
          );


        if (verified) {
          results.topicVideos.verified++;
        }

      }

    }


    /* ========================================================
       CALENDAR
       
       Uses study_calendar_events
       because that is what this migration currently uses.
    ======================================================== */

    for (
      const event of calendarEvents
    ) {

      if (
        !event?.userEmail ||
        !event?.itemId ||
        !event?.scheduledDate
      ) {
        continue;
      }


      results.calendarEvents.attempted++;


      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/study_calendar_events`,
          {
            method: "POST",

            headers: {
              ...supabaseHeaders(),

              Prefer:
                "resolution=merge-duplicates,return=representation"
            },

            body:
              JSON.stringify({

                user_email:
                  String(
                    event.userEmail
                  ),

                item_type:
                  String(
                    event.itemType ||
                    "topic"
                  ),

                item_id:
                  String(
                    event.itemId
                  ),

                title:
                  String(
                    event.title ||
                    ""
                  ),

                scheduled_date:
                  String(
                    event.scheduledDate
                  )

              })
          }
        );


      if (!response.ok) {

        throw new Error(
          `Calendar sync failed: ${await response.text()}`
        );
      }


      results.calendarEvents.synced++;


      /* ------------------------------------------------------
         VERIFY CALENDAR
      ------------------------------------------------------ */

      const verify =
        await fetch(
          `${SUPABASE_URL}/rest/v1/study_calendar_events` +
          `?user_email=eq.${encodeURIComponent(
            String(event.userEmail)
          )}` +
          `&item_id=eq.${encodeURIComponent(
            String(event.itemId)
          )}` +
          `&scheduled_date=eq.${encodeURIComponent(
            String(event.scheduledDate)
          )}` +
          `&select=id`,
          {
            headers:
              supabaseHeaders()
          }
        );


      if (!verify.ok) {

        throw new Error(
          `Calendar verification failed: ${await verify.text()}`
        );
      }


      const verified =
        await verify.json();


      if (
        Array.isArray(verified) &&
        verified.length > 0
      ) {
        results.calendarEvents.verified++;
      }

    }


    /* ========================================================
       TOTALS
    ======================================================== */

    const attempted =
      results.customTopics.attempted +
      results.submissions.attempted +
      results.topicVideos.attempted +
      results.calendarEvents.attempted;


    const synced =
      results.customTopics.synced +
      results.submissions.synced +
      results.topicVideos.synced +
      results.calendarEvents.synced;


    const verified =
      results.customTopics.verified +
      results.submissions.verified +
      results.topicVideos.verified +
      results.calendarEvents.verified;


    /* ========================================================
       EMPTY CACHE = FAILURE
    ======================================================== */

    if (
      attempted === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "SYNC FAILED — No admin cache data was found.",

        results,

        totals: {
          attempted,
          synced,
          verified
        }

      });
    }


    /* ========================================================
       FINAL VERIFICATION
    ======================================================== */

    if (
      synced !== attempted ||
      verified !== attempted
    ) {

      return res.status(500).json({

        success: false,

        message:
          "SYNC FAILED — Supabase did not verify every admin cache record.",

        results,

        totals: {
          attempted,
          synced,
          verified
        }

      });
    }


    /* ========================================================
       SUCCESS
    ======================================================== */

    return res.status(200).json({

      success: true,

      message:
        "SYNC SUCCESSFUL — Admin cache data is stored in Supabase and verified.",

      results,

      totals: {
        attempted,
        synced,
        verified
      }

    });

  } catch (
    error: any
  ) {

    console.error(
      "ADMIN CACHE MIGRATION ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "SYNC FAILED",

      error:
        error?.message ||
        "Cache migration failed."

    });

  }

}
