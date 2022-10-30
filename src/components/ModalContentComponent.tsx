import { close, openOutline } from "ionicons/icons";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Browser } from "@capacitor/browser";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";

import * as SubDatabase from "../database/SubDatabase";
import { DocInterface } from "../pages/Main";

interface ModalComponentProps {
  doc: DocInterface | undefined;
  language: string;
  locale: string;
  dateFormat: string;
  dismiss: () => void;
}

const randomId = (length: number = 16) => {
  return Math.random()
    .toString(16)
    .slice(2, length + 2);
};

const ModalContentComponent: React.FC<ModalComponentProps> = ({
  doc,
  language,
  locale,
  dateFormat,
  dismiss,
}) => {
  const { t } = useTranslation();

  const subId = doc?.subId || randomId();
  const [name, setName] = useState<string>(doc?.name || "");
  const [startDate, setStartDate] = useState<string>(
    doc?.startDate || DateTime.now().toFormat("yyyy-MM-dd")
  );
  const [period, setPeriod] = useState<string>(doc?.period || "month");
  const periods = [
    {
      value: "day",
      text: t("Daily"),
      pass: { day: 1, week: 0, month: 0, year: 0 },
    },
    {
      value: "week",
      text: t("Weekly"),
      pass: { day: 0, week: 1, month: 0, year: 0 },
    },
    {
      value: "biweek",
      text: t("Biweekly"),
      pass: { day: 0, week: 2, month: 0, year: 0 },
    },
    {
      value: "month",
      text: t("Monthly"),
      pass: { day: 0, week: 0, month: 1, year: 0 },
    },
    {
      value: "year",
      text: t("Yearly"),
      pass: { day: 0, week: 0, month: 0, year: 1 },
    },
  ];

  const [nextDate, setNextDate] = useState<string>(doc?.nextDate || "");
  const [price, setPrice] = useState<string>(doc?.price || "");
  const [url, setUrl] = useState<string>(doc?.url || "");
  const [note, setNote] = useState<string>(doc?.note || "");
  const createdOn = doc?.createdOn || DateTime.now().toFormat("yyyy-MM-dd");

  const [isEditing, setIsEditing] = useState(name ? false : true);

  const calculateDate = () => {
    if (startDate && period) {
      const date = DateTime.fromFormat(startDate, "yyyy-MM-dd");
      const newDate = date.plus(periods.find((p) => p.value === period)!.pass);
      setNextDate(newDate.toISODate());
    }
  };

  useEffect(() => {
    calculateDate();
  }, [startDate, period]);

  const addNewSubscription = async () => {
    const database = await SubDatabase.get();
    await database.subscriptions.upsert({
      subId,
      name,
      startDate,
      period,
      nextDate,
      price,
      url,
      note,
      createdOn,
    });
    setIsEditing(false);
  };

  const [presentCancelAlert] = useIonAlert();
  const cancelCreation = () => {
    presentCancelAlert({
      header: t("Are you sure you want to cancel?"),
      message: t("New changes will be lost."),
      buttons: [
        {
          text: t("Delete"),
          role: "destructive",
          handler: () => {
            dismiss();
          },
        },
        {
          text: t("Keep Editing"),
          role: "ok",
        },
      ],
    });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{name ? name : <Trans>Add new</Trans>}</IonTitle>
          <IonButtons slot="start">
            {isEditing ? (
              <IonButton onClick={cancelCreation} color="danger">
                <Trans>Cancel</Trans>
              </IonButton>
            ) : (
              <IonButton onClick={dismiss}>
                <IonIcon icon={close} />
              </IonButton>
            )}
          </IonButtons>
          <IonButtons slot="end">
            {isEditing ? (
              <IonButton
                disabled={!(subId && name && startDate && period)}
                onClick={addNewSubscription}
              >
                <Trans>Save</Trans>
              </IonButton>
            ) : (
              <IonButton onClick={() => setIsEditing(true)}>
                <Trans>Edit</Trans>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Name</Trans>
            </strong>
          </IonLabel>
          <IonInput
            value={name}
            placeholder="Name"
            className={"ion-text-right"}
            onIonChange={(e) => setName(e.detail.value!)}
            readonly={!isEditing}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Start Date</Trans>
            </strong>
          </IonLabel>
          <IonDatetimeButton datetime="startdate-datetime" />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              onIonChange={(e: any) => {
                setStartDate(
                  DateTime.fromISO(e.detail.value!).toFormat("yyyy-MM-dd")
                );
                calculateDate();
              }}
              multiple={false}
              id="startdate-datetime"
              presentation="date"
              readonly={!isEditing}
            />
          </IonModal>
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Period</Trans>
            </strong>
          </IonLabel>
          <IonSelect
            value={period}
            multiple={false}
            cancelText={t("Cancel")}
            okText={t("Select")}
            onIonChange={(e) => {
              setPeriod(e.detail.value);
              calculateDate();
            }}
            disabled={!isEditing}
          >
            {periods.map((p) => (
              <IonSelectOption key={p.value} value={p.value}>
                {p.text}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Next Date</Trans>
            </strong>
          </IonLabel>
          <IonLabel slot="end" className={"ion-text-right"}>
            {DateTime.fromFormat(nextDate, "yyyy-MM-dd")
              .setLocale(language)
              .toFormat(dateFormat)}
            <p>
              {DateTime.fromFormat(nextDate, "yyyy-MM-dd")
                .setLocale(language)
                .toRelative()}
            </p>
          </IonLabel>
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              value={nextDate}
              locale={locale}
              id="nextdate-datetime"
              presentation="date"
              readonly={true}
            />
          </IonModal>
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Price</Trans>
            </strong>
          </IonLabel>
          <IonInput
            value={price}
            placeholder={`${t("Price")}&${t("Currency")}`}
            className={"ion-text-right"}
            onIonChange={(e) => setPrice(e.detail.value!)}
            readonly={!isEditing}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>URL</Trans>
            </strong>
          </IonLabel>
          <IonInput
            value={url}
            placeholder={t("URL")}
            className={"ion-text-right"}
            onIonChange={(e) => setUrl(e.detail.value!)}
            readonly={!isEditing}
          />
          {!isEditing ? (
            <IonButton fill={"clear"} onClick={() => Browser.open({ url })}>
              <IonIcon icon={openOutline} />
            </IonButton>
          ) : null}
        </IonItem>
        {/* <IonItem>
          <IonLabel>
            <strong>
              <Trans>Notify</Trans>
            </strong>
          </IonLabel>
          <IonToggle
            checked={notify}
            onIonChange={(e) =>
              !notify ? turnNotificationOn() : setNotify(false)
            }
            disabled={!isEditing}
          />
        </IonItem> */}
        <IonItem>
          <IonLabel>
            <strong>
              <Trans>Note</Trans>
            </strong>
          </IonLabel>
          <IonTextarea
            value={note}
            auto-grow
            readonly={!isEditing}
            placeholder={t("Note")}
            className={"ion-text-right"}
            onIonChange={(e) => setNote(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <strong>Created on</strong>
          </IonLabel>
          <IonLabel slot="end" className={"ion-text-right"}>
            {DateTime.fromFormat(createdOn, "yyyy-MM-dd")
              .setLocale(language)
              .toFormat(dateFormat)}
          </IonLabel>
        </IonItem>
      </IonContent>
    </>
  );
};

export default ModalContentComponent;
