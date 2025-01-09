export type Chapter = {
  id: string;
  item_number: number;
  volume: string;
  number: string;
  name: string;
  branches: {
    created_at: Date;
  }[];
};
