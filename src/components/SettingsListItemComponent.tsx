import { IonItem, IonLabel } from '@ionic/react';

interface ContainerProps {
  title: string;
  url: string;
}

const ListItemComponent: React.FC<ContainerProps> = ({ title, url }) => {
  return (
    <IonItem button>
      <IonLabel>{title}</IonLabel>
    </IonItem>
  );
};

export default ListItemComponent;
