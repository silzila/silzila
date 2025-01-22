// for LOCAL-ONLY TWO TIER - separate front end & backend
// export const serverEndPoint = "http://localhost:8080/api/";

// for SERVER+LOCAL TWO TIER - separate front end & backend
export const serverEndPoint = process.env.REACT_APP_API_ENDPOINT;
export const localEndPoint = "http://localhost:3000/";

// for LOCAL-ONLY SINGLE TIER - single build with react app
// export const serverEndPoint = "http://localhost:8080/";

export const websiteAddress = "https://silzila.org";
export const githubAddress = "https://github.com/silzila/silzila";
export const githubIssueAddress = "https://github.com/silzila/silzila/issues";