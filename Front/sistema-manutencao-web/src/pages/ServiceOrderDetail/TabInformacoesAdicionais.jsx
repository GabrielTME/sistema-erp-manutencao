import React from 'react';

const TabInformacoesAdicionais = ({ order, isEditing, onInfoChange }) => {
  return (
    <div className="tab-pane">
      <div className="form-group">
        <label htmlFor="defectFound">Defeito Constatado</label>
        <textarea
          id="defectFound"
          name="defectFound"
          className="form-control"
          value={order.defectFound}
          onChange={onInfoChange}
          placeholder="Descreva o defeito constatado durante a análise técnica."
          rows="5"
          disabled={!isEditing}
        ></textarea>
      </div>
      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label htmlFor="actionsToTake">Ações a Realizar</label>
        <textarea
          id="actionsToTake"
          name="actionsToTake"
          className="form-control"
          value={order.actionsToTake}
          onChange={onInfoChange}
          placeholder="Descreva as ações que devem ser realizadas para solucionar o problema."
          rows="5"
          disabled={!isEditing}
        ></textarea>
      </div>
    </div>
  );
};

export default TabInformacoesAdicionais;
