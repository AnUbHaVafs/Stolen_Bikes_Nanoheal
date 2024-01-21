export const isArrayWithLength = (arr: any) =>
  Array.isArray(arr) && arr.length > 0;

export const isDevelopmentMode = () => import.meta.env.NODE_ENV === "development";

export const removeUnderScores = (
  text: string | number,
  textTransform:
    | "default"
    | "uppercase"
    | "lowercase"
    | "capitalize" = "lowercase"
) => {
  if (typeof text === "number") {
    return text;
  }

  const updatedText = text.replaceAll("_", " ");
  if (textTransform === "lowercase") {
    return updatedText.toLowerCase();
  }

  if (textTransform === "uppercase") {
    return updatedText.toUpperCase();
  }

  if (textTransform === "capitalize") {
    return capitalizeWords(updatedText.toLowerCase());
  }

  return updatedText;
};

const capitalizeWords = (sentence: string): string => {
  return sentence
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word?.slice(1))
    .join(" ");
};