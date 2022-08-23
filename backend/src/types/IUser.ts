export interface IUser {
  id?: string;
  address: string;
  tgId?: string;
  image?: string;
  balances: IBalance[];
}

export interface IBalance {
  balance: number;
  timestamp: number;
  coin: string;
}
