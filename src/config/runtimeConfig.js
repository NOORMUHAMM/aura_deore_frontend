export function getRuntimeConfig() {
  if (typeof window !== "undefined" && window.__AURA_RUNTIME__) {
    return window.__AURA_RUNTIME__;
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env;
  }
  return {};
}

export const RUNTIME = getRuntimeConfig();
