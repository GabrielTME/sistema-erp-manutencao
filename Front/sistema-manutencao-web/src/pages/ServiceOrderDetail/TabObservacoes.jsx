import React from 'react';

const TabObservacoes = ({ order, isEditing, onInfoChange }) => {
  return (
    <div className="tab-pane">
      <div className="form-group">
        <label htmlFor="observations">Observações Gerais</label>
        <textarea
          id="observations"
          name="observations"
          className="form-control"
          value={order.observations}
          onChange={onInfoChange}
          placeholder="Digite observações gerais sobre a ordem de serviço, procedimentos realizados, condições encontradas, etc."
          rows="8"
          disabled={!isEditing}
        ></textarea>
      </div>
    </div>
  );
};

export default TabObservacoes;
