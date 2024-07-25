import React, { ChangeEvent, FC, useState } from "react";
import { ITeam } from "../../types";
import { useTypedDispatch } from "../../hooks/redux";
import { deleteTeam, exit, updateTeam } from "../../store/slices/tablesSlice";
import { getFormattedTime } from "../../utils/time";
import { Draggable } from "react-beautiful-dnd";
import { HiTrash, HiOutlineLogout, HiCreditCard, HiCash } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "./Team.css";

type TTeamProps = {
  team: ITeam;
  index: number;
};

const Team: FC<TTeamProps> = ({ team, index }) => {
  const [teamData, setTeamData] = useState(team);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useTypedDispatch();

  const handleEditInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Q.현재 하나의 함수로 처리하고 있지만 그냥 각자의 handler가 있는게 더 효율적이라는 생각이 든다.
    const { name, value } = e.target;
    const date = new Date();

    if (name === "arrive" || name === "exit") {
      date.setHours(+value.slice(0, 2));
      date.setMinutes(+value.slice(3));
    }

    const newTeamData = {
      ...teamData,
      arriveTime: name === "arrive" ? date.getTime() : teamData.arriveTime,
      exitTime: name === "exit" ? date.getTime() : teamData.exitTime,
      member: name === "member" ? value : teamData.member,
      defaultDrink: name === "defaultDrink" ? value : teamData.defaultDrink,
      pay: {
        isTransfer:
          name === "isPayTransfer"
            ? !teamData.pay.isTransfer
            : teamData.pay.isTransfer,
        card:
          name === "card"
            ? parseInt(value.replace(",", ""))
            : teamData.pay.card,
        cash:
          name === "cash"
            ? parseInt(value.replace(",", ""))
            : teamData.pay.cash,
      },
      point: {
        isTransfer:
          name === "isPointTransfer"
            ? !teamData.point.isTransfer
            : teamData.point.isTransfer,
        use:
          name === "point"
            ? parseInt(value.replace(",", ""))
            : teamData.point.use,
        cash:
          name === "cashPoint"
            ? parseInt(value.replace(",", ""))
            : teamData.point.cash,
        card:
          name === "cardPoint"
            ? parseInt(value.replace(",", ""))
            : teamData.point.card,
      },
    };
    setTeamData(newTeamData);
  };
  const handleEditTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTeamData({ ...teamData, orders: e.target.value });
  };
  const handleEditCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    handleEditInput(e);
    // Q. 억지 동작 느낌쓰..
    dispatch(
      updateTeam({
        teamId: teamData.teamId,
        teamType: teamData.teamType,
        team: {
          ...teamData,
          pay: {
            ...teamData.pay,
            isTransfer:
              name === "isPayTransfer"
                ? !teamData.pay.isTransfer
                : teamData.pay.isTransfer,
          },
          point: {
            ...teamData.point,
            isTransfer:
              name === "isPointTransfer"
                ? !teamData.point.isTransfer
                : teamData.point.isTransfer,
          },
        },
      })
    );
  };
  const handleUpdateTeam = () => {
    dispatch(
      updateTeam({
        teamId: teamData.teamId,
        teamType: teamData.teamType,
        team: teamData,
      })
    );
  };
  const handleDeleteTeam = () => {
    dispatch(
      deleteTeam({
        teamId: teamData.teamId,
        teamType: teamData.teamType,
      })
    );
  };
  const handleExit = () => {
    dispatch(exit({ team: teamData }));
  };
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Draggable draggableId={team.teamId} index={index}>
      {(provided) => (
        <div
          className={
            teamData.teamType === "cur" ? "TableTeam" : "Team quaterWidth"
          }
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 5,
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              이용 내역
            </div>
            <div className="input">
              <label>입장</label>
              <input
                style={{ minWidth: 100 }}
                type="time"
                name="arrive"
                value={getFormattedTime(teamData.arriveTime)}
                onChange={handleEditInput}
                onBlur={handleUpdateTeam}
              />
              {teamData.teamType === "exit" ? (
                <>
                  <label> ~ 퇴장</label>
                  <input
                    style={{ minWidth: 100 }}
                    type="time"
                    name="exit"
                    value={getFormattedTime(teamData.exitTime!)}
                    onChange={handleEditInput}
                    onBlur={handleUpdateTeam}
                  />
                </>
              ) : null}
            </div>
            <div className="input">
              <label>인원</label>
              <input
                type="text"
                name="member"
                id=""
                value={teamData.member}
                onChange={handleEditInput}
                onBlur={handleUpdateTeam}
              />
            </div>
            <div className="input">
              <label>기본음료</label>
              <input
                type="text"
                name="defaultDrink"
                id=""
                value={teamData.defaultDrink}
                onChange={handleEditInput}
                onBlur={handleUpdateTeam}
              />
            </div>
            <div className="input">
              <label>주문</label>
              <textarea
                name="orders"
                id=""
                spellCheck={false}
                value={teamData.orders}
                onChange={handleEditTextArea}
                onBlur={handleUpdateTeam}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                paddingTop: "10px",
                fontWeight: 600,
                borderTop: "1px dashed black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span onClick={handleOpen}>결제 내역</span>
              {teamData.teamType === "exit" ? null : isOpen ? (
                <IoMdArrowDropdown style={{ width: 25, height: 25 }} />
              ) : (
                <IoMdArrowDropup style={{ width: 25, height: 25 }} />
              )}
            </div>
            {teamData.teamType === "exit" || isOpen ? (
              <>
                <div className="input">
                  <HiCreditCard style={{ width: 20, height: 20 }} />
                  <input
                    type="text"
                    name="card"
                    id=""
                    value={
                      teamData.pay.card ? teamData.pay.card.toLocaleString() : 0
                    }
                    onChange={handleEditInput}
                    onBlur={handleUpdateTeam}
                    style={{ textAlign: "right" }}
                  />
                  원
                </div>
                <div className="input">
                  <HiCash style={{ width: 20, height: 20 }} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      name="cash"
                      id=""
                      value={
                        teamData.pay.cash
                          ? teamData.pay.cash.toLocaleString()
                          : 0
                      }
                      onChange={handleEditInput}
                      onBlur={handleUpdateTeam}
                      style={{ textAlign: "right" }}
                    />
                    원
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="isPayTransfer"
                        id=""
                        checked={teamData.pay.isTransfer}
                        onChange={handleEditCheckbox}
                        style={{ width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: "0.8rem", minWidth: 26 }}>
                        이체
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                  }}
                >
                  <label>포인트 충전</label>
                  <div className="input">
                    <HiCreditCard style={{ width: 20, height: 20 }} />
                    <input
                      type="text"
                      name="cardPoint"
                      id=""
                      value={
                        teamData.point.card
                          ? teamData.point.card.toLocaleString()
                          : 0
                      }
                      onChange={handleEditInput}
                      onBlur={handleUpdateTeam}
                      style={{ textAlign: "right" }}
                    />
                    p
                  </div>
                  <div className="input">
                    <HiCash style={{ width: 20, height: 20 }} />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        name="cashPoint"
                        id=""
                        value={
                          teamData.point.cash
                            ? teamData.point.cash.toLocaleString()
                            : 0
                        }
                        onChange={handleEditInput}
                        onBlur={handleUpdateTeam}
                        style={{ textAlign: "right" }}
                      />
                      p
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="isPointTransfer"
                          id=""
                          checked={teamData.point.isTransfer}
                          onChange={handleEditCheckbox}
                          style={{ width: 18, height: 18 }}
                        />
                        <div style={{ fontSize: "0.8rem", minWidth: 26 }}>
                          이체
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label>사용 포인트</label>
                  <input
                    type="text"
                    name="point"
                    id=""
                    value={
                      teamData.point.use
                        ? teamData.point.use.toLocaleString()
                        : 0
                    }
                    onChange={handleEditInput}
                    onBlur={handleUpdateTeam}
                    style={{ textAlign: "right" }}
                  />
                  p
                </div>
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div className="iconContainer" style={{ marginRight: "10px" }}>
              <HiTrash
                style={{ width: "100%", height: "100%" }}
                onClick={handleDeleteTeam}
              />
            </div>
            {teamData.teamType === "exit" ? null : (
              <div className="iconContainer" style={{ marginLeft: "10px" }}>
                <HiOutlineLogout
                  style={{ width: "100%", height: "100%" }}
                  onClick={handleExit}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Team;
