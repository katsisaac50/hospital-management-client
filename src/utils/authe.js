export const getAuthToken = () => {
    const cookies = cookie.parse(document.cookie || "");
    return cookies?.authToken || null;
  };
  