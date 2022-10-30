import "./Settings.css";

import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { App } from "@capacitor/app";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonPicker,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";

import {
  changeLanguage,
  LanguageDetails,
  languageList,
} from "../assets/languages";
import { Preferences } from "@capacitor/preferences";
import {
  dateOptions,
  optionsWithDefault,
  separatorOptions,
  separatorsRegex,
} from "../assets/dateFormats";
import { changeTheme } from "../assets/darkTheme";
import { logoGithub } from "ionicons/icons";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  const [version, setVersion] = useState<string>("0.0.0");
  useIonViewWillEnter(async () => {
    const { version } = await App.getInfo();
    setVersion(version);
  });

  const [language, setLanguage] = useState<string>("en");
  const [dateFormat, setDateFormat] = useState<string>("yyyy-MM-dd");
  const [dateFormatReadable, setDateFormatReadable] =
    useState<string>("Year-Month-Day");
  const [darkTheme, setDarkTheme] = useState<string>("dark");
  useEffect(() => {}, [language, dateFormat, darkTheme]);
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

    await Preferences.get({ key: "dateFormatReadable" }).then((res) => {
      if (res.value) {
        setDateFormatReadable(res.value);
      } else {
        setDateFormatReadable("Year-Month-Day");
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

  const [presentDateFormatPicker] = useIonPicker();
  const modifyDateFormat = async (d: string, dReadable: string) => {
    setDateFormat(d);
    setDateFormatReadable(dReadable);
    await Preferences.set({ key: "dateFormat", value: d });
    await Preferences.set({ key: "dateFormatReadable", value: dReadable });
  };

  const modifyTheme = async (t: string) => {
    setDarkTheme(t);
    changeTheme(t);
  };

  return (
    <IonPage>
      <IonHeader translucent>
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
          <IonItem
            onClick={() => {
              presentDateFormatPicker({
                columns: [
                  {
                    name: "first",
                    options: optionsWithDefault(
                      dateOptions,
                      dateFormat.split(separatorsRegex)[0]
                    ),
                  },
                  {
                    name: "firstSeparator",
                    options: optionsWithDefault(
                      separatorOptions,
                      dateFormat.split(/[a-zA-Z]*/)[1]
                    ),
                  },
                  {
                    name: "second",
                    options: optionsWithDefault(
                      dateOptions,
                      dateFormat.split(separatorsRegex)[1]
                    ),
                  },
                  {
                    name: "secondSeparator",
                    options: optionsWithDefault(
                      separatorOptions,
                      dateFormat.split(/[a-zA-Z]*/)[2]
                    ),
                  },
                  {
                    name: "third",
                    options: optionsWithDefault(
                      dateOptions,
                      dateFormat.split(separatorsRegex)[2]
                    ),
                  },
                ],
                buttons: [
                  {
                    text: t("Cancel"),
                    role: "cancel",
                  },
                  {
                    text: t("Confirm"),
                    handler: (value) => {
                      modifyDateFormat(
                        value.first.value +
                          value.firstSeparator.value +
                          value.second.value +
                          value.secondSeparator.value +
                          value.third.value,
                        value.first.text +
                          value.firstSeparator.value +
                          value.second.text +
                          value.secondSeparator.value +
                          value.third.text
                      );
                    },
                  },
                ],
              });
            }}
          >
            <IonLabel>
              <Trans>Date Format</Trans>
            </IonLabel>
            <IonLabel class="ion-text-right">{dateFormatReadable}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Version</Trans>
            </IonLabel>
            <IonLabel class="ion-text-right">{version}</IonLabel>
          </IonItem>
        </IonList>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <IonButton
            fill="clear"
            href="https://github.com/bluelockorg/subscription-manager"
          >
            <IonIcon
              icon={logoGithub}
              style={{ color: "var(--ion-text-color)" }}
            />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
