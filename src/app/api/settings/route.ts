export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSiteSettings();
  // Only expose the public-facing fields, never internal metadata.
  return NextResponse.json({
    companyName: settings.companyName,
    companyBlurb: settings.companyBlurb,
    aboutStory: settings.aboutStory,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    helpQueriesEmail: settings.helpQueriesEmail,
  });
}
