// Non-sequential booking reference, e.g. "SH-7K2Q9F". Not a counter, so it
// can't be guessed or enumerated from an earlier booking's reference.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

export function generateBookingReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SH-${code}`;
}
