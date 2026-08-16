import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import { checkBasicAuth } from "@/lib/basicAuth";

const SUPABASE_URL =
  process.env.SUPABASE_URL as string;

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY as string;

function supabaseHeaders() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* ==========================================================
     SUPABASE CONFIG
  ========================================================== */

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({
      success: false,
      error:
        "Supabase server configuration is missing.",
    });
  }

  /* ==========================================================
     GET
     
     Used by PlatformContext to load all videos.
     
     Browser:
       GET /api/topic-videos
     
     Server:
       Supabase → topic_videos
  ========================================================== */

  if (req.method === "GET") {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos?select=id,topic_id,url,added_by&order=id.asc`,
        {
          method: "GET",
          headers: supabaseHeaders(),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "TOPIC VIDEOS GET ERROR:",
          errorText
        );

        return res.status(500).json({
          success: false,
          error:
            `Could not load videos from Supabase: ${errorText}`,
        });
      }

      const data =
        await response.json();

      return res.status(200).json(data);

    } catch (error: any) {
      console.error(
        "TOPIC VIDEOS GET ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Could not load videos from Supabase.",
      });
    }
  }

  /* ==========================================================
     POST
     
     Used by Admin when adding a video.
     
     Browser:
       POST /api/topic-videos
     
     Server:
       Admin authentication
              ↓
       Supabase service role
              ↓
       topic_videos
  ========================================================== */

  if (req.method === "POST") {

    /* --------------------------------------------------------
       ADMIN AUTHENTICATION
    -------------------------------------------------------- */

    if (!checkBasicAuth(req)) {
      return res.status(401).json({
        success: false,
        error:
          "Admin authentication failed.",
      });
    }

    try {

      const body =
        req.body || {};

      const topicId =
        body.topicId ??
        body.topic_id;

      const url =
        typeof body.url === "string"
          ? body.url.trim()
          : "";

      const adminUser =
        body.adminUser;

      /* ------------------------------------------------------
         VALIDATE TOPIC
      ------------------------------------------------------ */

      if (
        topicId === undefined ||
        topicId === null ||
        String(topicId).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          error:
            "topicId is required.",
        });
      }

      /* ------------------------------------------------------
         VALIDATE URL
      ------------------------------------------------------ */

      if (!url) {
        return res.status(400).json({
          success: false,
          error:
            "Video URL is required.",
        });
      }

      const topicIdValue =
        String(topicId).trim();

      /* ------------------------------------------------------
         CHECK EXISTING VIDEO
      ------------------------------------------------------ */

      const existingResponse =
        await fetch(
          `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
            topicIdValue
          )}&url=eq.${encodeURIComponent(
            url
          )}&select=id,topic_id,url`,
          {
            method: "GET",
            headers:
              supabaseHeaders(),
          }
        );

      if (!existingResponse.ok) {
        const errorText =
          await existingResponse.text();

        console.error(
          "VIDEO EXISTENCE CHECK FAILED:",
          errorText
        );

        return res.status(500).json({
          success: false,
          error:
            `Could not check existing video: ${errorText}`,
        });
      }

      const existing =
        await existingResponse.json();

      /* ------------------------------------------------------
         VIDEO ALREADY EXISTS
      ------------------------------------------------------ */

      if (
        Array.isArray(existing) &&
        existing.length > 0
      ) {
        return res.status(200).json({
          success: true,
          alreadyExists: true,
          message:
            "Video already exists in Supabase.",
          data: existing[0],
        });
      }

      /* ------------------------------------------------------
         INSERT VIDEO
      ------------------------------------------------------ */

      const insertedResponse =
        await fetch(
          `${SUPABASE_URL}/rest/v1/topic_videos`,
          {
            method: "POST",

            headers: {
              ...supabaseHeaders(),

              Prefer:
                "return=representation",
            },

            body: JSON.stringify({
              topic_id:
                topicIdValue,

              url,

              added_by:
                adminUser?.email ||
                "admin",
            }),
          }
        );

      if (!insertedResponse.ok) {

        const errorText =
          await insertedResponse.text();

        console.error(
          "SUPABASE VIDEO INSERT ERROR:",
          errorText
        );

        return res.status(500).json({
          success: false,
          error:
            `Supabase rejected the video: ${errorText}`,
        });
      }

      const inserted =
        await insertedResponse.json();

      /* ------------------------------------------------------
         VERIFY INSERT
      ------------------------------------------------------ */

      const verifyResponse =
        await fetch(
          `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
            topicIdValue
          )}&url=eq.${encodeURIComponent(
            url
          )}&select=id,topic_id,url,added_by`,
          {
            method: "GET",
            headers:
              supabaseHeaders(),
          }
        );

      if (!verifyResponse.ok) {

        const errorText =
          await verifyResponse.text();

        return res.status(500).json({
          success: false,
          error:
            `Video was inserted but verification failed: ${errorText}`,
        });
      }

      const verified =
        await verifyResponse.json();

      if (
        !Array.isArray(verified) ||
        verified.length === 0
      ) {
        return res.status(500).json({
          success: false,
          error:
            "Video could not be verified after insertion.",
        });
      }

      /* ------------------------------------------------------
         SUCCESS
      ------------------------------------------------------ */

      return res.status(200).json({
        success: true,

        message:
          "Video successfully saved and verified in Supabase.",

        data:
          verified[0],

        inserted,
      });

    } catch (error: any) {

      console.error(
        "TOPIC VIDEO POST ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Could not save video to Supabase.",
      });
    }
  }

  /* ==========================================================
     OTHER METHODS
  ========================================================== */

  res.setHeader(
    "Allow",
    "GET, POST"
  );

  return res.status(405).json({
    success: false,
    error:
      "Method not allowed.",
  });
}
