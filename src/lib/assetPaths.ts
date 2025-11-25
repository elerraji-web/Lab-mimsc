// Utility to turn stored file paths into URLs the browser can consume.
// Handles Windows backslashes, absolute file-system paths, and accidental `public/` prefixes.
export const normalizeAssetPath = (p?: string) => {
  if (!p) return "";

  // Standardize separators first
  const normalized = p.replace(/\\/g, "/");

  // Already a remote URL
  if (/^https?:\/\//i.test(normalized)) return normalized;

  // Strip everything up to and including `/public/` if present
  const publicIndex = normalized.lastIndexOf("/public/");
  let trimmed =
    publicIndex !== -1
      ? normalized.slice(publicIndex + "/public".length)
      : normalized.replace(/^\/?public\//, "/");

  // Ensure we serve from site root
  if (!trimmed.startsWith("/")) trimmed = `/${trimmed}`;

  // Collapse any duplicate slashes introduced by replacements
  return trimmed.replace(/\/{2,}/g, "/");
};

