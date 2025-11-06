import { NextResponse } from "next/server";
import { RESUME_BACKEND_THEMES_URL } from "src/features/resume/constants";

export async function GET() {
  try {
    const response = await fetch(RESUME_BACKEND_THEMES_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch resume themes (status ${response.status})`,
        },
        { status: response.status }
      );
    }

    const themes = await response.json();

    if (!Array.isArray(themes)) {
      return NextResponse.json(
        { error: "Unexpected themes response format." },
        { status: 500 }
      );
    }

    return NextResponse.json(themes);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
