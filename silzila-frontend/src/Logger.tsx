/**
 * 
 * For "dev" mode, all logs are displayed
 * 
 * For "QA" mode, only "warn" and "error" logs are displayed
 * 
 * For "prod" mode, only "error" logs are displayed
 * 
 * 
 * 
 * @param level 
 * 
 * @param note 
 * @param logItem 
 * @returns  a  logger function that logs to the console based on the mode of the application and level
 */

const Logger = (
  level: "info" | "warn" | "error",
  note?: string,
  logItem?: any
) => {
  const mode = process.env.REACT_APP_MODE;

  if (
    !mode ||
    (mode === "prod" && level !== "error") ||
    (mode === "QA" && level === "info")
  ) {
    return;
  }

  const item =
    logItem && typeof logItem === "object"
      ? JSON.stringify(logItem, null, 2)
      : logItem;

  if (level === "info") console.log(note || "", item || "");
  if (level === "warn") console.warn(note || "", item || "");
  if (level === "error") console.error(note || "", item || "");
};

export default Logger;
