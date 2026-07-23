-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "companyName" TEXT NOT NULL DEFAULT 'Indian Elixir',
    "companyBlurb" TEXT NOT NULL DEFAULT 'Honoring ancestral Tamil wisdom through pure, farm-rooted ingredients.',
    "aboutStory" TEXT NOT NULL DEFAULT '',
    "supportEmail" TEXT NOT NULL DEFAULT 'hello@indianelixir.com',
    "supportPhone" TEXT NOT NULL DEFAULT '+91 99999 99999',
    "helpQueriesEmail" TEXT NOT NULL DEFAULT 'help@indianelixir.com',
    "orderWhatsApp" TEXT NOT NULL DEFAULT '919999999999',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
