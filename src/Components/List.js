import { React, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({
  playerList,
  editPlayer = undefined,
  deletePlayer = undefined,
  isPlaying = true,
}) => {
  return (
    <div className="list-items">
      <table className="players-list-table">
        <thead>
          <tr>
            <th className="player-list-headers">
              <p className="player-list-name">Navn</p>{" "}
            </th>
            <th className="player-list-headers">Billet Nummere</th>
            {isPlaying && (
              <th className="player-list-headers">Rediger/Slett</th>
            )}
          </tr>
        </thead>
        <tbody>
          {playerList.length > 0 &&
            playerList.map((player) => {
              const { firstTicket, lastTicket, name, id } = player;
              return (
                <>
                  {" "}
                  <tr key={id}>
                    <td className={isPlaying && "play-list-td"}>{name}</td>
                    <td
                      className={isPlaying && "play-list-td"}
                    >{`${firstTicket} - ${lastTicket}`}</td>

                    {isPlaying && (
                      <td className="options">
                        <FaEdit
                          className="edit"
                          onClick={() => {
                            editPlayer(id);
                          }}
                        />
                        <FaTrash
                          className="delete"
                          onClick={() => {
                            deletePlayer(id);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default List;
