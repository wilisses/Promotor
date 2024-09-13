import React, { useState } from "react";
import "./style.css"; // Importa o arquivo CSS
import ImageModal from "./ImageModal";

const TextEditor = ({ htmlContent, setEditComment, contentEditable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState("");

  const handleImageClick = (event) => {
    if (event.target.tagName === "IMG") {
      setCurrentImageSrc(event.target.src);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentImageSrc("");
  };

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="textDescription"
        onClick={handleImageClick}
        contentEditable={contentEditable}
        onInput={(e) => {
          setEditComment(e.target.innerHTML);
        }}
      />
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageSrc={currentImageSrc}
      />
    </div>
  );
};

export default TextEditor;
