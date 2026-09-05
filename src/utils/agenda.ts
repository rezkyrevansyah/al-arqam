import type { AgendaStatus } from '@/data/types';

export interface AgendaStatusInfo {
  status: AgendaStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  iconName: 'calendar' | 'radio' | 'check';
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
];

const MONTH_NAMES_LONG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/**
 * Returns the current date in YYYY-MM-DD string format in local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determines whether an agenda is Akan Datang, Sedang Berlangsung, or Selesai.
 *
 * Logic:
 * - Akan Datang: today < startDate
 * - Sedang Berlangsung: startDate <= today <= (endDate || startDate)
 * - Selesai: today > (endDate || startDate)
 */
export function getAgendaStatus(
  startDateStr: string,
  endDateStr?: string | null
): AgendaStatusInfo {
  const today = getTodayDateString();
  const start = (startDateStr || '').slice(0, 10);
  const end = (endDateStr && endDateStr.trim() ? endDateStr : start).slice(0, 10);

  if (today < start) {
    return {
      status: 'akan_datang',
      label: 'Akan Datang',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dotClass: 'bg-blue-500',
      iconName: 'calendar',
    };
  }

  if (today >= start && today <= end) {
    return {
      status: 'sedang_berlangsung',
      label: 'Sedang Berlangsung',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs shadow-emerald-500/10',
      dotClass: 'bg-emerald-500 animate-pulse',
      iconName: 'radio',
    };
  }

  return {
    status: 'selesai',
    label: 'Selesai',
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200/80',
    dotClass: 'bg-gray-400',
    iconName: 'check',
  };
}

/**
 * Formats single date or date range to readable Indonesian format.
 * Examples:
 * - Single date: "06 Sep 2026"
 * - Same month: "06 - 08 Sep 2026"
 * - Different month, same year: "28 Ags - 02 Sep 2026"
 * - Different year: "30 Des 2025 - 02 Jan 2026"
 */
export function formatAgendaDateRange(
  startDateStr: string,
  endDateStr?: string | null,
  options?: { longMonth?: boolean }
): string {
  if (!startDateStr) return '';
  const monthNames = options?.longMonth ? MONTH_NAMES_LONG : MONTH_NAMES_SHORT;

  const startParts = startDateStr.slice(0, 10).split('-');
  if (startParts.length < 3) return startDateStr;

  const startYear = parseInt(startParts[0], 10);
  const startMonthIdx = parseInt(startParts[1], 10) - 1;
  const startDay = parseInt(startParts[2], 10);

  const end = endDateStr && endDateStr.trim() ? endDateStr.slice(0, 10) : '';

  // Single date event
  if (!end || end === startDateStr.slice(0, 10)) {
    return `${startDay} ${monthNames[startMonthIdx]} ${startYear}`;
  }

  const endParts = end.split('-');
  if (endParts.length < 3) {
    return `${startDay} ${monthNames[startMonthIdx]} ${startYear}`;
  }

  const endYear = parseInt(endParts[0], 10);
  const endMonthIdx = parseInt(endParts[1], 10) - 1;
  const endDay = parseInt(endParts[2], 10);

  // Same month and year: "06 - 08 Sep 2026"
  if (startYear === endYear && startMonthIdx === endMonthIdx) {
    return `${startDay} - ${endDay} ${monthNames[startMonthIdx]} ${startYear}`;
  }

  // Same year, different month: "28 Ags - 02 Sep 2026"
  if (startYear === endYear) {
    return `${startDay} ${monthNames[startMonthIdx]} - ${endDay} ${monthNames[endMonthIdx]} ${startYear}`;
  }

  // Different year: "30 Des 2025 - 02 Jan 2026"
  return `${startDay} ${monthNames[startMonthIdx]} ${startYear} - ${endDay} ${monthNames[endMonthIdx]} ${endYear}`;
}
