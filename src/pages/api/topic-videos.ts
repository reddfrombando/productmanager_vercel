import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


function supabaseHeaders() {
  return {
    apikey:
      SUPABASE_SERVICE_ROLE_KEY as string,

    Authorization:
      `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

    "Content-Type":
      "application/json",
  };
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        "Method not allowed.",
    });

  }


  /* ==========================================================
     SUPABASE CONFIGURATION
  ========================================================== */

  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {

    console.error(
      "Supabase environment variables are missing."
    );

    return res.status(500).json({
      success: false,
      error:
        "Supabase server configuration is missing.",
    });

  }


  try {

    const body =
      req.body || {};


    /* ========================================================
       READ REQUEST
    ======================================================== */

    const topicId =
      body.topicId ??
      body.topic_id;

    const url =
      body.url;

    const addedBy =
      body.addedBy ??
      body.added_by ??
      "admin";


    /* ========================================================
       VALIDATION
    ======================================================== */

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


    if (
      !url ||
      typeof url !== "string" ||
      !url.trim()
    ) {

      return res.status(400).json({
        success: false,
        error:
          "Video URL is required.",
      });

    }


    /* ========================================================
       NORMALIZE
    ======================================================== */

    const topicIdValue =
      String(topicId).trim();

    const videoUrl =
      url.trim();


    /* ========================================================
       CHECK WHETHER VIDEO ALREADY EXISTS
    ======================================================== */

    const existingResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
          topicIdValue
        )}&url=eq.${encodeURIComponent(
          videoUrl
        )}&select=id`,
        {
          method: "GET",
          headers:
            supabaseHeaders(),
        }
      );


    if (
      !existingResponse.ok
    ) {

      const errorText =
        await existingResponse.text();

      console.error(
        "Existing video check failed:",
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


    /* ========================================================
       ALREADY EXISTS
    ======================================================== */

    if (
      Array.isArray(existing) &&
      existing.length > 0
    ) {

      return res.status(200).json({
        success: true,
        alreadyExists: true,
        message:
          "Video already exists in Supabase.",
        data:
          existing[0],
      });

    }


    /* ========================================================
       INSERT VIDEO
    ======================================================== */

    const insertResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos`,
        {
          method: "POST",

          headers: {
            ...supabaseHeaders(),

            Prefer:
              "return=representation",
          },

          body:
            JSON.stringify({
              topic_id:
                topicIdValue,

              url:
                videoUrl,

              added_by:
                String(
                  addedBy
                ),
            }),
        }
      );


    /* ========================================================
       HANDLE INSERT ERROR
    ======================================================== */

    if (
      !insertResponse.ok
    ) {

      const errorText =
        await insertResponse.text();

      console.error(
        "Supabase topic_videos insert failed:",
        errorText
      );

      return res.status(
        insertResponse.status >= 400 &&
        insertResponse.status < 600
          ? insertResponse.status
          : 500
      ).json({
        success: false,
        error:
          `Supabase rejected the video: ${errorText}`,
      });

    }


    /* ========================================================
       READ INSERTED DATA
    ======================================================== */

    const inserted =
      await insertResponse.json();


    /* ========================================================
       VERIFY
    ======================================================== */

    const verifyResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/topic_videos?topic_id=eq.${encodeURIComponent(
          topicIdValue
        )}&url=eq.${encodeURIComponent(
          videoUrl
        )}&select=id,topic_id,url,added_by`,
        {
          method: "GET",
          headers:
            supabaseHeaders(),
        }
      );


    if (
      !verifyResponse.ok
    ) {

      const errorText =
        await verifyResponse.text();

      console.error(
        "Video verification failed:",
        errorText
      );

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
          "Video insert returned successfully, but the record could not be verified in Supabase.",
      });

    }


    /* ========================================================
       SUCCESS
    ======================================================== */

    return res.status(200).json({
      success: true,

      message:
        "Video successfully saved and verified in Supabase.",

      data:
        verified[0],

      inserted,
    });


  } catch (
    error: any
  ) {

    console.error(
      "TOPIC VIDEO API ERROR:",
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
