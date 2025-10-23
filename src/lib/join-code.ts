const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateJoinCode(length = 6) {
  let code = "";
  const array = new Uint32Array(length);
  if (typeof window === "undefined") {
    const { randomFillSync } = require("crypto");
    randomFillSync(array);
  } else {
    crypto.getRandomValues(array);
  }
  for (let i = 0; i < length; i++) {
    code += ALPHABET[array[i] % ALPHABET.length];
  }
  return code;
}
