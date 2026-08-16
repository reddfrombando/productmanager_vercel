import type {
  NextApiRequest,
  NextApiResponse
} from "next";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


/* ============================================================
   RESPONSE TYPES
============================================================ */

type SuccessResponse = {
  success: true;
  alreadyExists: boolean;
  message: string;
  data?: any;
};

type ErrorResponse = {
  success: false;
  error: string;
};


/* ============================================================
   API HANDLER
============================================================ */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse | ErrorResponse
  >
) {

  /* ==========================================================
     ONLY POST IS ALLOWED
  ========================================================== */

  if (req.method !== "POST") {

    res.setHeader(
      "Allow",
      "POST"
    );

    return res.status(405).json({
      success: false,

      error:
        "Method not allowed."
    });
  }


  /* ==========================================================
     CHECK SUPABASE CONFIGURATION
  ========================================================== */

  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {

    console.error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );

    return res.status(500).json({

      success: false,

      error:
        "Supabase server configuration is missing."
    });
  }


  /* ==========================================================
     CREATE SERVER-SIDE SUPABASE CLIENT
     
     IMPORTANT:
     This key NEVER goes to the browser.
  ========================================================== */

  const supabase =
    createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );


  try {

    /* ========================================================
       READ REQUEST BODY
    ======================================================== */

    const body =
      req.body || {};


    const topicId =
      String(
        body.topicId || ""
      ).trim();


    const url =
      String(
        body.url || ""
      ).trim();


    const adminEmail =
      String(
        body?.adminUser?.email || ""
      ).trim();


    /* ========================================================
       VALIDATE TOPIC ID
    ======================================================== */

    if (!topicId) {

      return res.status(400).json({

        success: false,

        error:
          "Topic ID is required."
      });
    }


    /* ========================================================
       VALIDATE URL
    ======================================================== */

    if (!url) {

      return res.status(400).json({

        success: false,

        error:
          "Video URL is required."
      });
    }


    /* ========================================================
       CHECK URL FORMAT
    ======================================================== */

    try {

      new URL(url);

    } catch {

      return res.status(400).json({

        success: false,

        error:
          "Invalid video URL."
      });
    }


    /* ========================================================
       CHECK WHETHER VIDEO ALREADY EXISTS
       
       Your database has a unique constraint on:
       
       topic_id + url
       
       Therefore an existing video is SUCCESS,
       not an error.
    ======================================================== */

    const {
      data: existingVideo,
      error: lookupError
    } = await supabase

      .from(
        "topic_videos"
      )

      .select(
        "id, topic_id, url"
      )

      .eq(
        "topic_id",
        topicId
      )

      .eq(
        "url",
        url
      )

      .maybeSingle();


    /* ========================================================
       LOOKUP ERROR
    ======================================================== */

    if (lookupError) {

      console.error(
        "TOPIC VIDEO LOOKUP ERROR:",
        lookupError
      );

      return res.status(500).json({

        success: false,

        error:
          lookupError.message
      });
    }


    /* ========================================================
       VIDEO ALREADY EXISTS
       
       IMPORTANT:
       Don't try to insert it again.
    ======================================================== */

    if (existingVideo) {

      return res.status(200).json({

        success: true,

        alreadyExists: true,

        message:
          "Video already exists in Supabase.",

        data:
          existingVideo
      });
    }


    /* ========================================================
       INSERT NEW VIDEO
    ======================================================== */

    const {
      data,
      error
    } = await supabase

      .from(
        "topic_videos"
      )

      .insert({

        topic_id:
          topicId,

        url:
          url,

        added_by:
          adminEmail ||
          "admin"
      })

      .select()

      .single();


    /* ========================================================
       INSERT ERROR
    ======================================================== */

    if (error) {

      console.error(
        "SUPABASE VIDEO INSERT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          error.message
      });
    }


    /* ========================================================
       SUCCESS
    ======================================================== */

    return res.status(200).json({

      success: true,

      alreadyExists: false,

      message:
        "Video successfully saved to Supabase.",

      data
    });


  } catch (error: any) {

    console.error(
      "TOPIC VIDEO API ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "Unable to save video to Supabase."
    });
  }
}
