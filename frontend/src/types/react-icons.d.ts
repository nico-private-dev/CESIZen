// Ce fichier ajoute des déclarations de type pour les icônes react-icons
import { ComponentType, SVGAttributes } from 'react';

declare module 'react-icons/bs' {
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
  }

  export type IconType = ComponentType<IconBaseProps>;
  
  // Redéclarer toutes les icônes comme des composants React valides
  export const BsPlus: IconType;
  export const BsX: IconType;
  export const BsPencil: IconType;
  export const BsTrash: IconType;
  export const BsBoxArrowRight: IconType;
  export const BsXCircle: IconType;
  export const BsCheckCircle: IconType;
  export const BsLungs: IconType;
  export const BsBook: IconType;
  export const BsPerson: IconType;
  export const BsEmojiSmile: IconType;
  export const BsGraphUp: IconType;
  export const BsArrowLeft: IconType;
  export const BsArrowRight: IconType;
  export const BsPersonCircle: IconType;
  export const BsGear: IconType;
}
