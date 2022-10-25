import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from "@ionic/react";
import { DateTime } from "luxon";

interface ContainerProps {
  subId: string;
  title: string;
  nextDate: string;
  language: string;
  dateFormat: string;
  onClick: () => void;
  deleteItem: (id: string) => void;
}

const ListItemComponent: React.FC<ContainerProps> = ({
  subId,
  title,
  nextDate,
  language,
  dateFormat,
  onClick,
  deleteItem,
}) => {
  return (
    <IonItemSliding>
      <IonItem button detail={false} onClick={onClick}>
        <IonLabel>
          <h2>{title}</h2>
        </IonLabel>
        <IonLabel slot="end" className={"ion-text-right"}>
          <h2>
            {DateTime.fromFormat(nextDate, "yyyy-MM-dd")
              .setLocale(language)
              .toRelative()}
          </h2>
          <p>
            {DateTime.fromFormat(nextDate, "yyyy-MM-dd")
              .setLocale(language)
              .toFormat(dateFormat)}
          </p>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={() => deleteItem(subId)} color="danger">
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ListItemComponent;
