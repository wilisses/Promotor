import React, { useState } from "react";
import "./Modal.css"; // Importando o CSS para estilização

const Modal = ({ taskCorrent, isOpen, onClose, completeTask }) => {
  const [comment, setComment] = useState("");
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        {(taskCorrent.status === 1 && (
          <div>
            <h2>Encerrar Tarefa</h2>
            <p>Tem certeza que deseja encerrar?</p>
            <input
              type="text"
              value={comment}
              placeholder="Comentário"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )) || (
          <div>
            <p>taskCorrent ID: {taskCorrent?.id}</p>
            <p>taskCorrent Text: {taskCorrent?.text}</p>
            <p>taskCorrent Category: {taskCorrent?.category}</p>
            <p>
              taskCorrent Completed: {taskCorrent?.isCompleted ? "Yes" : "No"}
            </p>
          </div>
        )}

        <button
          onClick={() => completeTask(taskCorrent.id, comment, taskCorrent)}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Modal;
