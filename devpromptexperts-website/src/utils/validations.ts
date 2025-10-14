// Helper function to validate URLs
export const isValidUrl = (string : any) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// LinkedIn URL validation
export const isValidLinkedInUrl = (url : any) => {
  try {
    const urlObj = new URL(url);
    const linkedinRegex = /^(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/;
    return linkedinRegex.test(urlObj.hostname + urlObj.pathname);
  } catch (_) {
    return false;
  }
};