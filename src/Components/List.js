import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({ testList, editPlayer, deletePlayer }) => {
  return (
    <div className="list-items">
      {testList.length > 0 &&
        testList.map((player) => {
          const { firstTicket, lastTicket, name, id } = player;
          return (
            <div key={id} className="list-item">
              
              <p className="names">{`${name}`}</p>
              <p className="numbers">{`${firstTicket} - ${lastTicket
              }`}</p>
              <div className="icons form-icons">
                <button className="edit-btn">
                  <FaEdit
                    className="edit"
                    onClick={() => {
                      editPlayer(id);
                    }}
                  />
                </button>
                <button className="delete-btn">
                  <FaTrash
                    className="delete"
                    onClick={() => {
                      deletePlayer(id);
                    }}
                  />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default List;
