export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      companyName: settings.companyName,
      companyBlurb: settings.companyBlurb,
      aboutStory: settings.aboutStory,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      helpQueriesEmail: settings.helpQueriesEmail,
    });
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({
      companyName: "Indian Elixir",
      companyBlurb: "Honoring ancestral Tamil wisdom through pure, farm-rooted ingredients.",
      aboutStory: "",
      supportEmail: "hello@indianelixir.com",
      supportPhone: "+91 99999 99999",
      helpQueriesEmail: "help@indianelixir.com",
    });
  }
}
