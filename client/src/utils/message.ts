export const mapTextMessageToArray = (text: string) => {
  return text.split("\n").filter(Boolean);
};
