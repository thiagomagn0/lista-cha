export type GiftItem = {
  id: number;
  name: string;
  image: string;
  store: string;
  color: string;
  material: string; // 🔥 NOVO
  note: string;
  total: number;
  reserved: {
    name: string;
    phone: string;
  }[];
};