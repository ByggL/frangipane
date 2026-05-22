export type Card = {
  id: string;
  name: string;
  description: string | null;
  height: number;
  weight: number;
  birthdate: string;
  birthplace: string;
  rarity: string;
  alignment: string;
  promotion: string | null;
};
