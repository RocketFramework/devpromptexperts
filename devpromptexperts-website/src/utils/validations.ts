// Helper function to validate URLs
export const isValidUrl = (string : string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidLinkedInUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check if domain is linkedin.com or www.linkedin.com
    if (hostname !== "linkedin.com" && hostname !== "www.linkedin.com") {
      return false;
    }

    // Match /in/username with optional trailing slash or query
    const linkedinPathRegex = /^\/in\/[a-zA-Z0-9-_%]+\/?$/;
    return linkedinPathRegex.test(urlObj.pathname);
  } catch {
    return false;
  }
};
