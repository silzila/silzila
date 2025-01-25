export const DeleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const cookieName = cookie.split("=")[0].trim();

    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    const domainParts = window.location.hostname.split(".");
    
    if (domainParts.length > 1) {
      const parentDomain = domainParts.slice(-2).join(".");
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
    }
  }
  
  console.log("All accessible cookies have been deleted.");
  };