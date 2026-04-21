import Link from "next/link";
import { BarChart3, ExternalLink, HeartHandshake, Layers3, TrendingUp } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";
import { InfaqTarawihChart } from "@/components/charts/InfaqTarawihChart";
import { SantunanYatimChart } from "@/components/charts/SantunanYatimChart";
import { ZisChart } from "@/components/charts/ZisChart";
import { getFooterData } from "@/services/site-data.server";
import { getTransparencyPageData } from "@/services/transparency-data.server";
import type { TransparencyDonor, TransparencyMetric, TransparencyProgram } from "@/data/types";

export const revalidate = 300;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMetric(metric: TransparencyMetric) {
  const base =
    metric.valueType === "currency"
      ? formatCurrency(metric.value)
      : new Intl.NumberFormat("id-ID").format(metric.value);

  return metric.suffix ? `${base} ${metric.suffix}` : base;
}

function formatDonationDate(value: string) {
  if (!value) return "Tanggal belum dicantumkan";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDonorName(donor: TransparencyDonor) {
  return donor.isAnonymous ? "Hamba Allah" : donor.donorName;
}

function calculateProgress(program: TransparencyProgram) {
  if (program.targetAmount <= 0) return 0;
  return Math.min((program.collectedAmount / program.targetAmount) * 100, 100);
}

function ProgramMetricCard({ metric }: { metric: TransparencyMetric }) {
  return (
    <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 shadow-sm shadow-black/5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
        {metric.label}
      </p>
      <p className="mt-3 font-display text-3xl font-bold text-[hsl(var(--foreground))]">
        {formatMetric(metric)}
      </p>
      {metric.note && (
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          {metric.note}
        </p>
      )}
    </div>
  );
}

function ProgramDonorRow({ donor }: { donor: TransparencyDonor }) {
  return (
    <div className="grid gap-3 rounded-[1.4rem] border border-[hsl(var(--border))]/70 bg-white/80 px-4 py-4 sm:grid-cols-[1.5fr_1fr_1.2fr] sm:items-center">
      <div>
        <p className="font-semibold text-[hsl(var(--foreground))]">{formatDonorName(donor)}</p>
        {donor.note && (
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{donor.note}</p>
        )}
      </div>
      <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
        {formatDonationDate(donor.donatedAt)}
      </p>
      <p className="font-display text-2xl font-bold text-[hsl(var(--primary))] sm:text-right">
        {donor.amount > 0 ? formatCurrency(donor.amount) : "-"}
      </p>
    </div>
  );
}

function ProgramSection({ program }: { program: TransparencyProgram }) {
  const progress = calculateProgress(program);

  return (
    <section className="rounded-[2rem] border border-[hsl(var(--border))]/70 bg-[hsl(var(--card))] p-6 shadow-xl shadow-black/5 md:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold))]/25 bg-[hsl(var(--gold))]/10 px-4 py-2 text-sm font-medium text-[hsl(var(--gold))]">
            <HeartHandshake className="h-4 w-4" />
            {program.badge || "Dashboard Transparansi"}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
            <span className="rounded-full bg-[hsl(var(--primary))]/8 px-3 py-1.5 font-medium text-[hsl(var(--primary))]">
              {program.periodLabel}
            </span>
            <span>{program.category}</span>
            <span>{program.year}</span>
          </div>

          <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-[hsl(var(--foreground))]">
            {program.title}
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
            {program.description}
          </p>

          {program.relatedLinkUrl && (
            <a
              href={program.relatedLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary))]/15 bg-[hsl(var(--primary))]/8 px-4 py-2 text-sm font-semibold text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))]/12"
            >
              {program.relatedLinkLabel || "Buka data pendukung"}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="w-full max-w-sm rounded-[1.8rem] bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))] shadow-lg shadow-[hsl(var(--primary))]/10">
          <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--gold-light))]">
            {program.progressLabel}
          </p>
          <p className="mt-4 font-display text-4xl font-bold text-[hsl(var(--gold-light))]">
            {formatCurrency(program.collectedAmount)}
          </p>
          {program.targetAmount > 0 ? (
            <>
              <p className="mt-2 text-sm text-[hsl(var(--primary-foreground))]/75">
                Target {formatCurrency(program.targetAmount)}
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[hsl(var(--gold-light))] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>{progress.toFixed(1)}%</span>
                <span>
                  {program.programType === 'santunan_yatim'
                    ? `${program.santunanEntries?.length ?? 0} donatur tercatat`
                    : program.programType === 'infaq_tarawih'
                    ? `${program.infaqEntries?.length ?? 0} malam tercatat`
                    : program.programType === 'zis'
                    ? `${program.zisEntries?.length ?? 0} muzakki tercatat`
                    : `${program.donors.length} donatur tercatat`}
                </span>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-[hsl(var(--primary-foreground))]/75">
              {program.programType === 'santunan_yatim'
                ? `${program.santunanEntries?.length ?? 0} donatur tercatat`
                : program.programType === 'infaq_tarawih'
                ? `${program.infaqEntries?.length ?? 0} malam tercatat`
                : program.programType === 'zis'
                ? `${program.zisEntries?.length ?? 0} muzakki tercatat`
                : `${program.donors.length} donatur tercatat`}
            </p>
          )}
        </div>
      </div>

      {program.metrics.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {program.metrics.map((metric) => (
            <ProgramMetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      )}

      {program.showDonors && (
        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--gold))]">
                Transparansi Donatur
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                Daftar Donatur Tercatat
              </h3>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Data ini dapat diperbarui sewaktu-waktu oleh tim masjid.
            </p>
          </div>

          {program.donors.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {program.donors.map((donor) => (
                <ProgramDonorRow key={donor.id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.6rem] border border-dashed border-[hsl(var(--border))] bg-white/60 px-5 py-8 text-center text-[hsl(var(--muted-foreground))]">
              Belum ada daftar donatur yang dipublikasikan untuk program ini.
            </div>
          )}
        </div>
      )}

      {program.programType === "infaq_tarawih" && program.infaqEntries && program.infaqEntries.length > 0 && (
        <div className="mt-8">
          <InfaqTarawihChart entries={program.infaqEntries} />
        </div>
      )}

      {program.programType === "santunan_yatim" && program.santunanEntries && program.santunanEntries.length > 0 && (
        <div className="mt-8">
          <SantunanYatimChart entries={program.santunanEntries} />
        </div>
      )}

      {program.programType === "zis" && program.zisEntries && program.zisEntries.length > 0 && (
        <div className="mt-8">
          <ZisChart entries={program.zisEntries} />
        </div>
      )}
    </section>
  );
}

export default async function DashboardPage() {
  const [footer, transparencyData] = await Promise.all([
    getFooterData(),
    getTransparencyPageData(),
  ]);

  const totalPrograms = transparencyData.programs.length;
  const totalCollected = transparencyData.programs.reduce((sum, program) => sum + program.collectedAmount, 0);

  return (
    <Providers initialData={{ footer }}>
      <RealtimeRefresher />
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <main className="pb-20 pt-28 md:pt-32">
          <section className="relative overflow-hidden px-6">
            <div className="absolute inset-0 hero-gradient opacity-80" />
            <div className="relative mx-auto max-w-6xl">
              <div className="rounded-[2rem] border border-[hsl(var(--border))]/70 bg-[hsl(var(--card))]/85 px-6 py-10 shadow-xl shadow-black/5 backdrop-blur md:px-8 md:py-12">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary))]/15 bg-[hsl(var(--primary))]/8 px-4 py-2 text-sm font-medium text-[hsl(var(--primary))]">
                      <BarChart3 className="h-4 w-4" />
                      Dashboard Transparansi Masjid
                    </div>
                    <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-[hsl(var(--foreground))] md:text-6xl">
                      Transparansi Zakat, Infaq, dan Sedekah Masjid Al-Arqom
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] md:text-lg">
                      Halaman ini menjadi pusat publikasi data pengumpulan dana pada momentum hari besar Islam,
                      termasuk program Ramadhan, ZIS, infaq sedekah, serta dashboard lain yang akan terus bertambah
                      pada periode berikutnya.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/#donasi"
                        className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary))]/90"
                      >
                        <HeartHandshake className="h-4 w-4" />
                        Kembali ke Donasi
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white/80 px-5 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-colors hover:bg-white"
                      >
                        Kembali ke Beranda
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-[1.6rem] border border-[hsl(var(--border))]/70 bg-white/80 p-5">
                      <div className="flex items-center gap-3 text-[hsl(var(--gold))]">
                        <Layers3 className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">Program</span>
                      </div>
                      <p className="mt-4 font-display text-4xl font-bold text-[hsl(var(--foreground))]">
                        {totalPrograms}
                      </p>
                    </div>
                    <div className="rounded-[1.6rem] border border-[hsl(var(--border))]/70 bg-white/80 p-5">
                      <div className="flex items-center gap-3 text-[hsl(var(--gold))]">
                        <TrendingUp className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">Terkumpul</span>
                      </div>
                      <p className="mt-4 font-display text-3xl font-bold leading-tight text-[hsl(var(--foreground))]">
                        {formatCurrency(totalCollected)}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                        *Akumulatif pengumpulan dari semua program dan bukan saldo akhir masjid
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 px-6">
            <div className="mx-auto max-w-6xl space-y-8">
              {transparencyData.programs.length > 0 ? (
                transparencyData.programs.map((program) => (
                  <ProgramSection key={program.id} program={program} />
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-14 text-center shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--gold))]">
                    Belum Ada Program Publik
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                    Dashboard transparansi belum dipublikasikan
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
                    Tim masjid belum menayangkan program transparansi pada halaman ini. Setelah data diinput dari
                    CMS admin, program akan muncul otomatis di sini.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
