import React, { useState } from 'react';

const TabImagem = ({ images, isEditing, onAddImage }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleAddClick = () => {
    if (imageUrl) {
      onAddImage(imageUrl);
      setImageUrl('');
    } else {
        alert("Por favor, insira a URL da imagem.");
    }
  };

  return (
    <div className="tab-pane">
      <h4>Imagens do Equipamento</h4>
      <div className="add-image-form">
        <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
          <input 
            type="text" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Cole a URL da imagem aqui..."
            disabled={!isEditing}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddClick} disabled={!isEditing}>Adicionar Imagem</button>
      </div>

      <div className="image-gallery">
        {images.length === 0 ? (
          <p>Nenhuma imagem adicionada ainda.</p>
        ) : (
          images.map((url, index) => (
            <div key={index} className="gallery-item">
              <img src={url} alt={`Imagem do equipamento ${index + 1}`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TabImagem;
