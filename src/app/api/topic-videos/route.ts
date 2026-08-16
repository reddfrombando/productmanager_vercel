import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

export async function POST(
  request: Request
) {
  try {
    /* ========================================================
       CHECK SUPABASE CONFIGURATION
    ======================================================== */

    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server configuration is missing."
        },
        { status: 500 }
      );
    }

    /* ========================================================
       CREATE SERVER-SIDE SUPABASE CLIENT
    ======================================================== */

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    /* ========================================================
       READ REQUEST
    ======================================================== */

    const body =
      await request.json();

    const topicId =
      String(
        body?.topicId || ""
      ).trim();

    const url =
      String(
        body?.url || ""
      ).trim();

    const adminEmail =
      String(
        body?.adminUser?.email || ""
      ).trim();

    /* ========================================================
       VALIDATION
    ======================================================== */

    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Topic ID is required."
        },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Video URL is required."
        },
        { status: 400 }
      );
    }

    /* ========================================================
       VALIDATE URL
    ======================================================== */

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid video URL."
        },
        { status: 400 }
      );
    }

    /* ========================================================
       CHECK WHETHER VIDEO ALREADY EXISTS
       
       Your database has a unique constraint on:
       
       topic_id + url
    ======================================================== */

    const {
      data: existingVideo,
      error: lookupError
    } = await supabase
      .from("topic_videos")
      .select("id, topic_id, url")
      .eq(
        "topic_id",
        topicId
      )
      .eq(
        "url",
        url
      )
      .maybeSingle();

    if (lookupError) {
      console.error(
        "VIDEO LOOKUP ERROR:",
        lookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            lookupError.message
        },
        { status: 500 }
      );
    }

    /* ========================================================
       VIDEO ALREADY EXISTS
       
       This is NOT an error.
    ======================================================== */

    if (existingVideo) {
      return NextResponse.json(
        {
          success: true,

          alreadyExists: true,

          message:
            "Video already exists in Supabase.",

          data: existingVideo
        },
        { status: 200 }
      );
    }

    /* ========================================================
       INSERT VIDEO
    ======================================================== */

    const {
      data,
      error
    } = await supabase
      .from("topic_videos")
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
       HANDLE INSERT ERROR
    ======================================================== */

    if (error) {
      console.error(
        "SUPABASE VIDEO INSERT ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
          code:
            error.code || null,
          details:
            error.details || null
        },
        { status: 500 }
      );
    }

    /* ========================================================
       SUCCESS
    ======================================================== */

    return NextResponse.json(
      {
        success: true,

        alreadyExists: false,

        message:
          "Video successfully saved to Supabase.",

        data
      },
      { status: 200 }
    );

  } catch (error: any) {

    console.error(
      "TOPIC VIDEO API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Unable to save video."
      },
      { status: 500 }
    );
  }
}
