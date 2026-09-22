export function mintPairingCode() {
  const n = (Math.floor(Math.random() * 900) + 100).toString();
  return `${n}-WILK`;
}

export function normalizePairingCode(code: string) {
  return code.trim().toUpperCase();
}
