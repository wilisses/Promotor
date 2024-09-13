import React from "react";
import "./style.css"; // Importa o arquivo CSS

import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close">
          <Button className="modal-close-button" onClick={onClose}>
            <IconButton>
              <ClearIcon />
            </IconButton>
          </Button>
        </div>

        <div
          className="modal-image"
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
