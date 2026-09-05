import "server-only";

import { unstable_cache } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import type {
  AgendaItem,
  AllSiteData,
  Article,
  CountdownEvent,
  DonationConfig,
  FooterData,
  GalleryItem,
  HeroData,
  ManagementMember,
  SocialLink,
} from "@/data/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAgenda(row: any): AgendaItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    endDate: row.end_date ?? null,
    time: row.time,
    location: row.location,
    description: row.description,
    category: row.category,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    image: row.image,
    category: row.category,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toGalleryItem(row: any): GalleryItem {
  return {
    id: row.id,
    image: row.image,
    title: row.title,
    date: row.date,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBoardMember(row: any): ManagementMember {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    image: row.image,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toHero(row: any): HeroData {
  return {
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCountdown(row: any): CountdownEvent {
  return {
    name: row.name,
    date: row.date,
    description: row.description ?? "",
    active: row.active ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDonation(row: any): DonationConfig {
  return {
    bankAccountNumber: row.bank_account_number,
    bankAccountName: row.bank_account_name,
    bankName: row.bank_name,
    donationCollected: Number(row.donation_collected),
    donationTarget: Number(row.donation_target),
    qrisImageUrl: row.qris_image_url,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFooter(row: any, socials: SocialLink[]): FooterData {
  return {
    address: row.address,
    phone: row.phone,
    email: row.email,
    mapsUrl: row.maps_url,
    socials,
  };
}

function throwOnError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error((error as { message: string }).message);
  }
}

async function fetchHomeSiteDataUncached(): Promise<AllSiteData> {
  const supabase = createClient();

  const [hero, countdown, agenda, articles, gallery, board, donation, footer, socials] =
    await Promise.all([
      supabase.from("hero_config").select("title, subtitle, description").single(),
      supabase.from("countdown_config").select("name, date, description, active").single(),
      supabase
        .from("agenda")
        .select("id, title, date, end_date, time, location, description, category")
        .order("date", { ascending: true }),
      supabase
        .from("articles")
        .select("id, title, excerpt, content, author, date, image, category")
        .order("date", { ascending: false }),
      supabase
        .from("gallery")
        .select("id, image, title, date")
        .order("date", { ascending: false }),
      supabase
        .from("board_members")
        .select("id, name, title, image, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("donation_config")
        .select("bank_account_number, bank_account_name, bank_name, donation_collected, donation_target, qris_image_url")
        .single(),
      supabase.from("footer_config").select("address, phone, email, maps_url").single(),
      supabase.from("social_links").select("platform, url"),
    ]);

  [hero, countdown, agenda, articles, gallery, board, donation, footer, socials].forEach((result) =>
    throwOnError(result.error)
  );

  return {
    hero: toHero(hero.data),
    countdown: toCountdown(countdown.data),
    agenda: (agenda.data ?? []).map(toAgenda),
    articles: (articles.data ?? []).map(toArticle),
    gallery: (gallery.data ?? []).map(toGalleryItem),
    board: (board.data ?? []).map(toBoardMember),
    donation: toDonation(donation.data),
    footer: toFooter(footer.data, (socials.data ?? []) as SocialLink[]),
  };
}

async function fetchAgendaUncached(): Promise<AgendaItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agenda")
    .select("id, title, date, end_date, time, location, description, category")
    .order("date", { ascending: true });

  throwOnError(error);
  return (data ?? []).map(toAgenda);
}

async function fetchArticlesUncached(): Promise<Article[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, author, date, image, category")
    .order("date", { ascending: false });

  throwOnError(error);
  return (data ?? []).map(toArticle);
}

async function fetchGalleryUncached(): Promise<GalleryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("id, image, title, date")
    .order("date", { ascending: false });

  throwOnError(error);
  return (data ?? []).map(toGalleryItem);
}

async function fetchFooterUncached(): Promise<FooterData> {
  const supabase = createClient();
  const [footer, socials] = await Promise.all([
    supabase.from("footer_config").select("address, phone, email, maps_url").single(),
    supabase.from("social_links").select("platform, url"),
  ]);

  [footer, socials].forEach((result) => throwOnError(result.error));

  return toFooter(footer.data, (socials.data ?? []) as SocialLink[]);
}

export const getHomeSiteData = unstable_cache(fetchHomeSiteDataUncached, ["home-site-data"], {
  revalidate: 60,
});

export const getAgendaData = unstable_cache(fetchAgendaUncached, ["agenda-site-data"], {
  revalidate: 60,
});

export const getArticlesData = unstable_cache(fetchArticlesUncached, ["articles-site-data"], {
  revalidate: 60,
});

export const getGalleryData = unstable_cache(fetchGalleryUncached, ["gallery-site-data"], {
  revalidate: 60,
});

export const getFooterData = unstable_cache(fetchFooterUncached, ["footer-site-data"], {
  revalidate: 300,
});
