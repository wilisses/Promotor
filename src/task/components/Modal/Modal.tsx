import React, { useState } from "react";
import "./style.css"; 
import { status } from "../../dashboard";
const Modal = ({ taskCorrent, isOpen, onClose, completeTask }) => {
  const [comment, setComment] = useState("");
  const [encerrar, setEncerrar] = useState(false);
  const minLength = 20;
  
  const formatDateTime = (dateString) => {
    // Converte a string para um objeto Date
    console.log(dateString)
    if(dateString === null){
      return ''
    }
    const date = new Date(dateString);
  
    if (!(date instanceof Date)) {
      return ''
    }
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    if( comment.length < minLength ) return;
    completeTask(taskCorrent.id, comment, taskCorrent)
    setComment("");
    setEncerrar(false);
  }

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
            <p>{!encerrar? 'Tem certeza que deseja encerrar?': `Informe uma justificativa com pelo menos ${minLength} caracteres!`}</p>
            
            <div>
              {(!encerrar && (
                <div>
                  <button onClick={() => setEncerrar(true)}>Sim</button>
                  <button onClick={onClose}>Não</button>
                </div>
                
              )) || (
                <div>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={comment}
                      placeholder=""
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <p className="minLength">{comment.length}</p>
                    <button
                      type="submit"
                    >
                      Confirmar
                    </button>
                  </form>
                </div>
              )} 
              
            </div>
          </div>
        )) || (
            <div>
              <p>Titulo: {taskCorrent?.title}</p>
              <p>Início: {formatDateTime(taskCorrent?.timeStart)}</p>
              <p>Termíno: {formatDateTime(taskCorrent?.timeEnd)}</p>
              <button
                onClick={() => completeTask(taskCorrent.id, comment, taskCorrent)}
              >
                {taskCorrent.status === 3 || taskCorrent.status === 4 ?"Fechar":status[taskCorrent.status].name}
              </button>
            </div>
          )}

          
        
      </div>
    </div>
  );
};

export default Modal;
