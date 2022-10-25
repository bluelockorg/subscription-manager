import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ListItemComponent from "../components/ListItemComponent";
import ModalContentComponent from "../components/ModalContentComponent";
import "./Main.css";

import * as SubDatabase from "../database/SubDatabase";
import { DateTime } from "luxon";
import { Preferences } from "@capacitor/preferences";
import { changeLanguage, languageList } from "../assets/languages";
import { changeTheme } from "../assets/darkTheme";

export interface DocInterface {
  subId: string;
  name: string;
  startDate: string;
  period: string;
  nextDate: string;
  price: string;
  url: string;
  note: string;
  createdOn: string;
}

const Main: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<string>("en");
  const [locale, setLocale] = useState<string>("en-US");
  const [dateFormat, setDateFormat] = useState<string>("yyyy-MM-dd");
  useEffect(() => {}, [locale, dateFormat]);
  useIonViewWillEnter(async () => {
    await Preferences.get({ key: "language" }).then((res) => {
      if (res.value) {
        changeLanguage(JSON.parse(res.value));
        setLanguage(JSON.parse(res.value).lang);
      } else {
        changeLanguage(languageList[0]);
        setLanguage(languageList[0].lang);
      }
    });

    await Preferences.get({ key: "locale" }).then((res) => {
      if (res.value) {
        setLocale(res.value);
      } else {
        setLocale("en-US");
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
        changeTheme(res.value);
      } else {
        changeTheme("dark");
      }
    });
  });

  const [docToPass, setDocToPass] = useState<DocInterface>();
  useEffect(() => {}, [docToPass]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DocInterface[]>([]);
  useEffect(() => {}, [searchQuery, searchResults]);

  // Modal properties
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  const dismiss = () => {
    setDocToPass(undefined);
    modal.current?.dismiss();
  };

  const onListItemClick = (doc: DocInterface) => {
    setDocToPass(doc);
    modal.current?.present();
  };

  const [docs, setDocs] = useState<any[]>([]);
  useIonViewDidEnter(async () => {
    const database = await SubDatabase.get();
    let docs = await database.subscriptions.find().exec();
    docs.sort((a: any, b: any) => {
      return (
        DateTime.fromFormat(a.nextDate, "yyyy-MM-dd").toMillis() -
        DateTime.fromFormat(b.nextDate, "yyyy-MM-dd").toMillis()
      );
    });
    setDocs(docs);
    database.subscriptions.$.subscribe(async (results: any) => {
      docs = await database.subscriptions.find().exec();
      docs.sort((a: any, b: any) => {
        return (
          DateTime.fromFormat(a.nextDate, "yyyy-MM-dd").toMillis() -
          DateTime.fromFormat(b.nextDate, "yyyy-MM-dd").toMillis()
        );
      });
      setDocs(docs);
    });
  });

  const deleteItem = async (id: string) => {
    const database = await SubDatabase.get();
    database.subscriptions
      .find({
        selector: {
          subId: {
            $eq: id,
          },
        },
      })
      .remove(id);
  };

  const search = async (q: string) => {
    setSearchQuery(q);
    if (q === "") {
      return setSearchResults([]);
    }
    const regexp = new RegExp(`^.*${q}.*$`, "i");
    setSearchResults(
      docs.filter((doc) => {
        return (
          regexp.test(doc.name) || regexp.test(doc.note) || regexp.test(doc.url)
        );
      })
    );
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Trans>Subscriptions</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <Trans>Subscriptions</Trans>
            </IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              showClearButton={searchQuery ? "always" : "focus"}
              value={searchQuery}
              placeholder={t("Search")}
              onIonChange={(e) => search(e.detail.value!)}
            />
          </IonToolbar>
        </IonHeader>
        <IonList>
          {(searchResults.length > 0 ? searchResults : docs).map((doc) => (
            <ListItemComponent
              key={doc.subId}
              subId={doc.subId}
              title={doc.name}
              nextDate={doc.nextDate}
              language={language}
              dateFormat={dateFormat}
              onClick={() => onListItemClick(doc)}
              deleteItem={deleteItem}
            />
          ))}
        </IonList>
      </IonContent>
      <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonFabButton id="open-modal" onClick={() => setDocToPass(undefined)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <IonModal
        ref={modal}
        trigger="open-modal"
        presentingElement={presentingElement!}
      >
        <ModalContentComponent
          doc={docToPass}
          language={language}
          locale={locale}
          dateFormat={dateFormat}
          dismiss={dismiss}
        />
      </IonModal>
    </IonPage>
  );
};

export default Main;
