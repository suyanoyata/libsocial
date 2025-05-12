import * as Deepl from "deepl-node";

export const translate = async (text: string) => {
  const translator = new Deepl.Translator(process.env.DEEPL_API_KEY!);

  const { text: response } = await translator.translateText(text, null, "en-US");

  return response;
};
