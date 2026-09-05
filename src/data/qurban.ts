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
