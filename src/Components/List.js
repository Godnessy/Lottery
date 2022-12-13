import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({ playerList, editPlayer, deletePlayer }) => {
  return (
    <div className="list-items">
      <table className="players-list-table">
        <tr>
          <th className="player-list-headers">
            <p className="player-list-name">Navn</p>{" "}
          </th>
          <th className="player-list-headers">Billet Nummere</th>
          <th className="player-list-headers">Options</th>
        </tr>
        {playerList.length > 0 &&
          playerList.map((player) => {
            const { firstTicket, lastTicket, name, id } = player;
            return (
              <>
                {" "}
                <tr key={id}>
                  <td>{name}</td>
                  <td>{`${firstTicket} - ${lastTicket}`}</td>

                  <td>
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
                </tr>
              </>
            );
          })}
      </table>
    </div>
  );
};

export default List;
