import { notFound } from "next/navigation";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  const tHero = await getTranslations({ locale, namespace: "hero" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ewastechittagong.com";

  return {
    title: {
      default: `${t("name")} | ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: tHero("subtitle"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        bn: `${baseUrl}/bn`,
        "zh-CN": `${baseUrl}/zh-CN`,
        ja: `${baseUrl}/ja`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: `${t("name")} | ${t("tagline")}`,
      description: tHero("subtitle"),
      url: `${baseUrl}/${locale}`,
      siteName: t("name"),
      images: [
        {
          url: `${baseUrl}/images/concepts/circular-hero.jpg`,
          width: 1200,
          height: 630,
          alt: t("name"),
        },
      ],
      locale:
        locale === "zh-CN"
          ? "zh_CN"
          : locale === "ja"
          ? "ja_JP"
          : locale === "bn"
          ? "bn_BD"
          : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className={`flex min-h-screen flex-col w-full max-w-full overflow-x-hidden ${locale === "bn" ? "font-bengali tracking-normal" : "font-sans"}`}>
          <SiteHeader />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
          <SiteFooter />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
