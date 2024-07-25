import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITable, ITeam, TTeamType } from "../../types";

type TTable = {
  currentTables: ITable[];
  waitTeams: ITeam[];
  exitTeams: ITeam[];
};

type TChangeTableName = {
  tableId: string;
  tableName: string;
};

type TDeleteTable = {
  tableId: string;
};

type TAddTeam = {
  teamType: TTeamType;
  team: ITeam;
  tableName?: string;
};

type TUpdateTeam = {
  teamType: TTeamType;
  teamId: string;
  team: ITeam;
};

type TDeleteTeam = {
  teamType: TTeamType;
  teamId: string;
};

type TExit = {
  team: ITeam;
};

type TMoveTeam = {
  droppableIdStart: string;
  droppableIdEnd: string;
  droppableIndexStart: number;
  droppableIndexEnd: number;
};

const initialState: TTable = {
  currentTables: [
    {
      tableId: "table-0",
      tableName: "1",
      teams: [],
    },
    {
      tableId: "table-1",
      tableName: "2",
      teams: [],
    },
    {
      tableId: "table-2",
      tableName: "3",
      teams: [],
    },
    {
      tableId: "table-3",
      tableName: "4",
      teams: [],
    },
    {
      tableId: "table-4",
      tableName: "4.5",
      teams: [],
    },
    {
      tableId: "table-5",
      tableName: "5",
      teams: [],
    },
    {
      tableId: "table-6",
      tableName: "6",
      teams: [],
    },
    {
      tableId: "table-7",
      tableName: "7",
      teams: [],
    },
    {
      tableId: "table-8",
      tableName: "8",
      teams: [],
    },
    {
      tableId: "table-9",
      tableName: "파티룸",
      teams: [],
    },
    {
      tableId: "table-10",
      tableName: "핑1",
      teams: [],
    },
    {
      tableId: "table-11",
      tableName: "핑2",
      teams: [],
    },
    {
      tableId: "table-12",
      tableName: "핑3",
      teams: [],
    },
  ],
  waitTeams: [],
  exitTeams: [],
};

const tablesSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    init: (state) => {
      localStorage.setItem("initialState", JSON.stringify(initialState));
    },
    changeTableName: (state, { payload }: PayloadAction<TChangeTableName>) => {
      state.currentTables = state.currentTables.map((table) =>
        table.tableId === payload.tableId
          ? { ...table, tableName: payload.tableName }
          : table
      );
    },
    addTable: (state, { payload }: PayloadAction<ITable>) => {
      state.currentTables.push(payload);
    },
    deleteTable: (state, { payload }: PayloadAction<TDeleteTable>) => {
      state.currentTables = state.currentTables.filter(
        (table) => table.tableId !== payload.tableId
      );
    },
    addTeam: (state, { payload }: PayloadAction<TAddTeam>) => {
      payload.teamType === "cur"
        ? state.currentTables.map((table) =>
            table.tableName === payload.tableName
              ? {
                  ...table,
                  teams: table.teams.push(payload.team),
                }
              : table
          )
        : payload.teamType === "wait"
        ? state.waitTeams.push(payload.team)
        : state.exitTeams.push(payload.team);
    },
    updateTeam: (state, { payload }: PayloadAction<TUpdateTeam>) => {
      payload.teamType === "cur"
        ? (state.currentTables = state.currentTables.map((table) => ({
            ...table,
            teams: table.teams.map((team) =>
              team.teamId === payload.teamId ? payload.team : team
            ),
          })))
        : payload.teamType === "wait"
        ? (state.waitTeams = state.waitTeams.map((team) =>
            team.teamId === payload.teamId ? payload.team : team
          ))
        : (state.exitTeams = state.exitTeams.map((team) =>
            team.teamId === payload.teamId ? payload.team : team
          ));
    },
    deleteTeam: (state, { payload }: PayloadAction<TDeleteTeam>) => {
      payload.teamType === "cur"
        ? (state.currentTables = state.currentTables.map((table) => ({
            ...table,
            teams: table.teams.filter((team) => team.teamId !== payload.teamId),
          })))
        : payload.teamType === "wait"
        ? (state.waitTeams = state.waitTeams.filter(
            (team) => team.teamId !== payload.teamId
          ))
        : (state.exitTeams = state.exitTeams.filter(
            (team) => team.teamId !== payload.teamId
          ));
    },
    exit: (state, { payload }: PayloadAction<TExit>) => {
      payload.team.teamType === "cur"
        ? (state.currentTables = state.currentTables.map((table) => ({
            ...table,
            teams: table.teams.filter(
              (team) => team.teamId !== payload.team.teamId
            ),
          })))
        : (state.waitTeams = state.waitTeams.filter(
            (team) => team.teamId !== payload.team.teamId
          ));
      state.exitTeams.push({
        ...payload.team,
        teamType: "exit",
        exitTime: Date.now(),
      });
      state.exitTeams.sort((a, b) => b.exitTime! - a.exitTime!);
    },
    moveTeam: (state, { payload }: PayloadAction<TMoveTeam>) => {
      if (
        payload.droppableIdStart === "waitTeams" &&
        payload.droppableIdEnd.includes("table")
      ) {
        // wait -> table
        const movedTeam = state.waitTeams.splice(
          payload.droppableIndexStart,
          1
        )[0];
        const addedTable = state.currentTables.find(
          (table) => table.tableId === payload.droppableIdEnd
        );
        addedTable?.teams.splice(payload.droppableIndexEnd, 0, {
          ...movedTeam!,
          teamType: "cur",
        });
      }
      if (
        payload.droppableIdStart.includes("table") &&
        payload.droppableIdEnd.includes("table")
      ) {
        // move team in table
        const movedTable = state.currentTables.find(
          (table) => table.tableId === payload.droppableIdStart
        );
        const movedTeam = movedTable?.teams.splice(
          payload.droppableIndexStart,
          1
        )[0];
        const addedTable = state.currentTables.find(
          (table) => table.tableId === payload.droppableIdEnd
        );
        addedTable?.teams.splice(payload.droppableIndexEnd, 0, movedTeam!);
      }
    },
  },
});

export const {
  init,
  changeTableName,
  addTable,
  deleteTable,
  addTeam,
  updateTeam,
  deleteTeam,
  exit,
  moveTeam,
} = tablesSlice.actions;
export const tablesReducer = tablesSlice.reducer;
