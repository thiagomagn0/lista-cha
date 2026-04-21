export type GiftItem = {
  id: number;
  name: string;
  image: string;
  store: string;
  color: string;
  note: string;
  total: number;
  reserved: {
    name: string;
    phone: string;
  }[];
};