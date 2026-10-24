/** Builds a wa.me click-to-chat link with a prefilled message. No API/session needed. */
export function buildWhatsAppLink(phoneE164Digits: string, message: string): string {
  const digits = phoneE164Digits.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildBookingInquiryMessage(opts: {
  origin?: string;
  destination?: string;
  pickupDate?: string;
  passengers?: number;
  flightNumber?: string;
  referenceCode?: string;
}): string {
  const lines = ["Hi Sakura Hire Services, I'd like to ask about a transfer."];
  if (opts.origin && opts.destination) lines.push(`Route: ${opts.origin} -> ${opts.destination}`);
  if (opts.pickupDate) lines.push(`Date: ${opts.pickupDate}`);
  if (opts.passengers) lines.push(`Passengers: ${opts.passengers}`);
  if (opts.flightNumber) lines.push(`Flight: ${opts.flightNumber}`);
  if (opts.referenceCode) lines.push(`Booking reference: ${opts.referenceCode}`);
  return lines.join("\n");
}
