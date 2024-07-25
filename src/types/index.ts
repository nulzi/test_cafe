export type TTeamType = "cur" | "wait" | "exit";

export interface ITeam {
  teamId: string;
  teamType: TTeamType;
  arriveTime: number;
  exitTime?: number;
  member: string;
  defaultDrink: string;
  orders: string;
  pay: {
    isTransfer: boolean; // 계좌이체 여부
    cash: number;
    card: number;
  };
  point: {
    isTransfer: boolean; // 계좌이체 여부
    use: number;
    cash: number;
    card: number;
  };
}

export interface ITable {
  tableId: string;
  tableName: string;
  teams: ITeam[];
}
