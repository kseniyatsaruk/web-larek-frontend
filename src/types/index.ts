export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
  addedToBasket?: boolean;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
payment: string;
address: string;
phone: string;
email: string;
total: string | number;
}

export interface IOrderData extends IOrderForm {
  items: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;