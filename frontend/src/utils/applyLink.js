export const normalizeApplyLink = (value) => {
  if (value == null) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  try {
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
};

export const hasExternalApplyLink = (post) => Boolean(post?.applyLink?.trim());

export const openExternalApplyLink = (applyLink) => {
  const url = normalizeApplyLink(applyLink);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};
