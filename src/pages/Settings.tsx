import "./Settings.css";

import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { App } from "@capacitor/app";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";

import {
  changeLanguage,
  LanguageDetails,
  languageList,
} from "../assets/languages";
import { Preferences } from "@capacitor/preferences";
import { dateFormats } from "../assets/dateFormats";
import { changeTheme } from "../assets/darkTheme";

const Settings: React.FC = () => {
  const [version, setVersion] = useState<string>("0.0.0");
  useIonViewWillEnter(async () => {
    const { version } = await App.getInfo();
    setVersion(version);
  });

  const [language, setLanguage] = useState<string>("en");
  const [dateFormat, setDateFormat] = useState<string>("yyyy-MM-dd");
  const [darkTheme, setDarkTheme] = useState<string>("dark");
  useEffect(() => {}, [language, darkTheme]);
  useIonViewDidEnter(async () => {
    await Preferences.get({ key: "language" }).then((res) => {
      if (res.value) {
        changeLanguage(JSON.parse(res.value));
        setLanguage(JSON.parse(res.value).lang);
      } else {
        changeLanguage(languageList[0]);
        setLanguage(languageList[0].lang);
      }
    });

    await Preferences.get({ key: "dateFormat" }).then((res) => {
      if (res.value) {
        setDateFormat(res.value);
      } else {
        setDateFormat("yyyy-MM-dd");
      }
    });

    await Preferences.get({ key: "darkTheme" }).then((res) => {
      if (res.value) {
        modifyTheme(res.value);
      } else {
        modifyTheme("dark");
      }
    });
  });

  const modifyLanguage = (l: string) => {
    const lang: LanguageDetails = languageList.find(
      (lang) => lang.lang === l
    ) as LanguageDetails;
    changeLanguage(lang);
    setLanguage(l);
  };

  const modifyDateFormat = async (d: string) => {
    setDateFormat(d);
    await Preferences.set({ key: "dateFormat", value: d });
  };

  const modifyTheme = async (t: string) => {
    setDarkTheme(t);
    changeTheme(t);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Trans>Settings</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <Trans>Settings</Trans>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel>
              <Trans>Language</Trans>
            </IonLabel>
            <IonSelect
              value={language}
              onIonChange={(e) => modifyLanguage(e.detail.value)}
            >
              {languageList.map((item) => (
                <IonSelectOption key={item.lang} value={item.lang}>
                  <Trans>{item.langinlang}</Trans>
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Theme</Trans>
            </IonLabel>
            <IonSelect
              value={darkTheme}
              onIonChange={(e) => modifyTheme(e.detail.value)}
              interface="popover"
            >
              <IonSelectOption value="dark">
                <Trans>Dark</Trans>
              </IonSelectOption>
              <IonSelectOption value="light">
                <Trans>Light</Trans>
              </IonSelectOption>
              <IonSelectOption value="system">
                <Trans>System</Trans>
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Date Format</Trans>
            </IonLabel>
            <IonSelect
              value={dateFormat}
              onIonChange={(e) => modifyDateFormat(e.detail.value)}
              interface="popover"
            >
              {dateFormats.map((item) => (
                <IonSelectOption key={item.value} value={item.value}>
                  {item.text}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Version</Trans>
            </IonLabel>
            <IonLabel class="ion-text-right">{version}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
