import React, { useEffect } from "react";
import "./App.css";
import TablesContainer from "./components/TablesContainer/TablesContainer";
import TeamContainer from "./components/TeamContainer/TeamContainer";
import { useTypedDispatch, useTypedSelector } from "./hooks/redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { init, moveTeam } from "./store/slices/tablesSlice";

function App() {
  const dispatch = useTypedDispatch();
  const { currentTables, waitTeams, exitTeams } = useTypedSelector(
    (state) => state.tables
  );

  useEffect(() => {
    dispatch(init());
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    dispatch(
      moveTeam({
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
      })
    );
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        <TablesContainer tables={currentTables} />
        <TeamContainer wait teams={waitTeams} />
        <TeamContainer teams={exitTeams} />
      </DragDropContext>
    </div>
  );
}

export default App;
