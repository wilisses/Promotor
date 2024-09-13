import React from "react";
import "./style.css"; // Importa o arquivo CSS

import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className="modal-overlay_edit" onClick={onClose}>
      <div className="modal-content_edit" onClick={(e) => {onClose(); e.stopPropagation()}} >
        
        <div
          className="modal-image_edit"
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageModal;
