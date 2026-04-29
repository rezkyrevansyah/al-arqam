export const QURBAN_YEAR = "1447H / 2026M";

export const QURBAN_PRICING = [
  {
    id: "patungan-sapi",
    label: "Patungan Sapi",
    price: 3700000,
    note: "Sudah termasuk biaya operasional",
    highlight: true,
  },
  {
    id: "operasional-sapi",
    label: "Operasional Sapi",
    price: 250000,
    note: "Jika beli pribadi, hanya biaya operasional",
    highlight: false,
  },
  {
    id: "operasional-kambing",
    label: "Operasional Kambing/Domba",
    price: 150000,
    note: null,
    highlight: false,
  },
];

export const QURBAN_CONTACTS = [
  { name: "Bapak H. Andre", phone: "081285275450" },
  { name: "Bapak Andi Afwaldi", phone: "081310907141" },
  { name: "Bapak Tomy Herdianto", phone: "08125519175" },
  { name: "Bapak Anton", phone: "081818885540" },
];

export const QURBAN_BANK = {
  bank: "Bank Mandiri",
  accountNumber: "1480007496527",
  accountName: "TOMY HERDIANTO",
};

export function toWhatsAppLink(phone: string, message?: string): string {
  const normalized = phone.replace(/^0/, "62");
  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
