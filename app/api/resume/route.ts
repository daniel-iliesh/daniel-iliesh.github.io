import { NextResponse } from "next/server";
import { RESUME_GIST_URL } from "src/features/resume/constants";

const BACKEND_RESUME_URL = "https://thebackend.rocket-champ.pw/resume";

export async function GET() {
  try {
    const resumeResponse = await fetch(RESUME_GIST_URL, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!resumeResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch resume data (status ${resumeResponse.status})`,
        },
        { status: resumeResponse.status }
      );
    }

    const resumeJson = await resumeResponse.json();

    const backendResponse = await fetch(BACKEND_RESUME_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeJson),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to generate resume (status ${backendResponse.status})`,
        },
        { status: backendResponse.status }
      );
    }

    const backendJson = await backendResponse.json();

    return NextResponse.json(backendJson);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
