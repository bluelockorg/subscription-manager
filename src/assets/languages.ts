import { Preferences } from "@capacitor/preferences";

import i18n from "../i18n";

export interface LanguageDetails {
  lang: string;
  langinlang: string;
  langinenglish: string;
  locale: string;
}

export const languageList: LanguageDetails[] = [
  {
    lang: "en",
    langinlang: "English",
    langinenglish: "English",
    locale: "en-US",
  },
  {
    lang: "ja",
    langinlang: "日本語",
    langinenglish: "Japanese",
    locale: "ja-JP",
  },
  {
    lang: "es",
    langinlang: "Español",
    langinenglish: "Spanish",
    locale: "es-ES",
  },
  {
    lang: "fr",
    langinlang: "Français",
    langinenglish: "French",
    locale: "fr-FR",
  },
];

export const changeLanguage = async (lng: LanguageDetails) => {
  i18n.changeLanguage(lng.lang);
  await Preferences.set({ key: "language", value: JSON.stringify(lng) });
  await Preferences.set({ key: "locale", value: lng.locale });
};
