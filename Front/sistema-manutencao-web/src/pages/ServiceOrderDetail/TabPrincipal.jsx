import React, { useState, useEffect } from 'react';

const AddTechnicianForm = ({ assignedTechs, allTechnicians, onAddTechnician, isEditing }) => {
    const availableTechs = allTechnicians.filter(tech => !assignedTechs.includes(tech.name));

    const handleSelect = (e) => {
        const techName = e.target.value;
        if (techName) {
            onAddTechnician(techName);
        }
    };

    return (
        <div className="form-group" style={{marginTop: '0.5rem'}}>
            <select className="form-select" onChange={handleSelect} value="" disabled={!isEditing}>
                <option value="" disabled>+ Adicionar técnico</option>
                {availableTechs.map(tech => (
                    <option key={tech.id} value={tech.name}>{tech.name}</option>
                ))}
            </select>
        </div>
    );
};

const TabPrincipal = ({ order, allTechnicians = [], isEditing, onInputChange, onAddTechnician, onRemoveTechnician, onAddNewPart, onDeletePart, onUpdatePart }) => {
    const [editingPartId, setEditingPartId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    
    const initialNewPartState = { id: '', description: '', quantity: 1, unitValue: 0 };
    const [isAddingPart, setIsAddingPart] = useState(false);
    const [newPart, setNewPart] = useState(initialNewPartState);

    useEffect(() => {
        if (editingPartId) {
            const partToEdit = order.parts.find(p => p.id === editingPartId);
            setEditFormData(partToEdit);
        }
    }, [editingPartId, order.parts]);

    const handleEditClick = (part) => {
        if (!isEditing) {
            setEditingPartId(part.id);
            setIsAddingPart(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingPartId(null);
    };

    const handleSaveEdit = () => {
        onUpdatePart(editFormData);
        setEditingPartId(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({...prev, [name]: value}));
    };

    const handleNewPartChange = (e) => {
        const { name, value } = e.target;
        setNewPart(prev => ({...prev, [name]: value}));
    };

    const handleConfirmAddPart = () => {
        if (!newPart.id || !newPart.description) {
            alert("Por favor, preencha o código e a descrição.");
            return;
        }
        onAddNewPart(newPart);
        setIsAddingPart(false);
        setNewPart(initialNewPartState);
    };
    
    const totalGeral = order.parts.reduce((acc, part) => acc + (part.quantity * part.unitValue), 0);
    
    const formatCurrency = (value) => {
        return Number(value).toFixed(2).replace('.', ',');
    };

    return (
        <div className="tab-pane-grid">
            <div className="main-content">
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Técnicos</label>
                        <div className="tag-container">
                            {order.technicians.map(tech => (
                                <span key={tech} className="tag">
                                    {tech}
                                    {isEditing && (
                                        <button className="remove-tag" onClick={() => onRemoveTechnician(tech)}>&times;</button>
                                    )}
                                </span>
                            ))}
                        </div>
                        <AddTechnicianForm 
                            assignedTechs={order.technicians} 
                            allTechnicians={allTechnicians} 
                            onAddTechnician={onAddTechnician} 
                            isEditing={isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            className="form-select" 
                            name="status"
                            value={order.status} 
                            onChange={onInputChange}
                            disabled={!isEditing}
                        >
                            <option>Aguardando Peças</option>
                            <option>Em Andamento</option>
                            <option>Concluído</option>
                            <option>Enviado para Análise</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Equipamento</label>
                    {isEditing ? (
                        <input type="text" name="equipment" value={order.equipment} onChange={onInputChange} />
                    ) : (
                        <p>{order.equipment}</p>
                    )}
                </div>
                <div className="form-group">
                     <label>Ocorrência</label>
                    {isEditing ? (
                        <input type="text" name="occurrence" value={order.occurrence} onChange={onInputChange} />
                    ) : (
                        <p>{order.occurrence}</p>
                    )}
                </div>
                 <div className="form-group">
                    <label>Problema</label>
                    {isEditing ? (
                        <textarea name="problem" className="form-control" rows="3" value={order.problem} onChange={onInputChange}></textarea>
                    ) : (
                        <p>{order.problem}</p>
                    )}
                </div>

                <div className="page-header" style={{marginTop: '2rem'}}>
                    <h3>Peças/Serviços</h3>
                    <button className="btn btn-primary" onClick={() => setIsAddingPart(true)} disabled={isEditing}>+ Adicionar Item</button>
                </div>
                <div className="table-wrapper">
                     <table>
                        <thead>
                            <tr>
                                <th>Código Produto</th>
                                <th>Descrição</th>
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                <th>Valor Total</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isAddingPart && (
                                <tr>
                                    <td><input type="text" name="id" value={newPart.id} onChange={handleNewPartChange} placeholder="Código"/></td>
                                    <td><input type="text" name="description" value={newPart.description} onChange={handleNewPartChange} placeholder="Descrição"/></td>
                                    <td><input type="number" name="quantity" value={newPart.quantity} onChange={handleNewPartChange} style={{width: '60px'}}/></td>
                                    <td><input type="number" name="unitValue" value={newPart.unitValue} onChange={handleNewPartChange} style={{width: '80px'}}/></td>
                                    <td>R${formatCurrency(newPart.quantity * newPart.unitValue)}</td>
                                    <td>
                                        <div className="actions-group">
                                            <button className="btn btn-primary btn-sm" onClick={handleConfirmAddPart}>Confirmar</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setIsAddingPart(false)}>Cancelar</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {order.parts.map(part => (
                                <tr key={part.id}>
                                {editingPartId === part.id ? (
                                    <>
                                        <td>{part.id}</td>
                                        <td><input type="text" name="description" value={editFormData.description} onChange={handleEditFormChange} /></td>
                                        <td><input type="number" name="quantity" value={editFormData.quantity} onChange={handleEditFormChange} style={{width: '60px'}}/></td>
                                        <td><input type="number" name="unitValue" value={editFormData.unitValue} onChange={handleEditFormChange} style={{width: '80px'}}/></td>
                                        <td>R${formatCurrency(editFormData.quantity * editFormData.unitValue)}</td>
                                        <td>
                                            <div className="actions-group">
                                                <button className="btn btn-primary btn-sm" onClick={handleSaveEdit}>Salvar</button>
                                                <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancelar</button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            {part.id === 'HORAS_TEC' ? (
                                                <div className="item-with-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                    <span>{part.id}</span>
                                                </div>
                                            ) : (
                                                part.id
                                            )}
                                        </td>
                                        <td>{part.description}</td>
                                        <td>{part.quantity}</td>
                                        <td>R${formatCurrency(part.unitValue)}</td>
                                        <td>R${formatCurrency(part.quantity * part.unitValue)}</td>
                                        <td>
                                            <div className="actions-group">
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(part)} disabled={isEditing}>Editar</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => onDeletePart(part.id)} disabled={isEditing}>Excluir</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{textAlign: 'right', fontWeight: 'bold', marginTop: '1rem'}}>Total Geral: R${formatCurrency(totalGeral)}</p>
                </div>
            </div>
            <aside className="sidebar">
                <div className="info-card">
                    <h4>Informações de Controle</h4>
                    <div className="form-group"><label>Nº O.S.</label><p>{order.id}</p></div>
                    <div className="form-group"><label>Data Emissão</label><p>{order.emissionDate}</p></div>
                    <div className="form-group"><label>Data O.S. (Início)</label><p>{order.startDate}</p></div>
                    <div className="form-group"><label>Setor / Localização da máquina</label><p>{order.location}</p></div>
                </div>
            </aside>
        </div>
    );
};

export default TabPrincipal;
