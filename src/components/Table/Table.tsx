import React, { ChangeEvent, FC, FocusEvent, useState } from "react";
import Team from "../Team/Team";
import { ITable } from "../../types";
import AddButton from "../AddButton/AddButton";
import { useTypedDispatch } from "../../hooks/redux";
import { changeTableName, deleteTable } from "../../store/slices/tablesSlice";
import { Droppable } from "react-beautiful-dnd";

type TTableProps = {
  table: ITable;
};

const Table: FC<TTableProps> = ({ table }) => {
  const dispatch = useTypedDispatch();
  const { tableId, teams } = table;
  const [isChange, setIsChange] = useState(false);
  const [tableName, setTableName] = useState(table.tableName);
  const defaultTable = [
    "1",
    "2",
    "3",
    "4",
    "4.5",
    "5",
    "6",
    "7",
    "8",
    "파티룸",
    "핑1",
    "핑2",
    "핑3",
  ];

  const appearInput = () => {
    if (!defaultTable.includes(tableName)) setIsChange(true);
  };
  const handleEditInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTableName(e.target.value);
  };
  const updateTableName = (e: FocusEvent<HTMLInputElement>) => {
    if (defaultTable.includes(e.target.value)) {
      alert("기본 테이블과 이름이 동일할 수 없습니다.");
      e.target.value = "";
    } else {
      dispatch(changeTableName({ tableId, tableName }));
      setIsChange(false);
    }
  };
  const handleDeleteTable = () => {
    dispatch(deleteTable({ tableId }));
  };

  return (
    <Droppable droppableId={tableId}>
      {(provided) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 5,
            // border: "solid 1px #0AE93B",
            borderRadius: 7,
            backgroundColor: "#4C4637",
            color: "white",
            padding: "10px 7px",
            width: "23%",
          }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "18px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div onDoubleClick={appearInput}>
              {isChange ? (
                <input
                  type="text"
                  value={tableName}
                  onChange={handleEditInput}
                  autoFocus
                  onBlur={updateTableName}
                />
              ) : (
                tableName
              )}
            </div>
            {defaultTable.includes(tableName) ? null : (
              <button
                style={{
                  position: "absolute",
                  right: 0,
                  background: "none",
                  color: "white",
                }}
                onClick={handleDeleteTable}
              >
                X
              </button>
            )}
          </div>
          {teams.length ? (
            teams.map((team, i) => (
              <Team key={team.teamId} team={team} index={i} />
            ))
          ) : (
            <div style={{ width: 1, height: 30 }} />
          )}
          {provided.placeholder}
          <AddButton type={"team"} teamType="cur" tableName={tableName} />
        </div>
      )}
    </Droppable>
  );
};

export default Table;
