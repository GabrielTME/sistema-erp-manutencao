import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewServiceOrder.css';

const NewServiceOrder = () => {
    const [items, setItems] = useState([]);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState({ code: '', description: '', quantity: 1, unitValue: 0 });

    const handleAddItem = () => {
        if (newItem.code && newItem.description) {
            setItems([...items, { ...newItem, id: Date.now() }]);
            setNewItem({ code: '', description: '', quantity: 1, unitValue: 0 });
            setIsAddingItem(false);
        } else {
            alert("Por favor, preencha o Código e a Descrição.");
        }
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container">
            <Link to="/ordens-de-servico" className="btn btn-secondary btn-back">&larr; Voltar</Link>
            <h1 style={{ margin: '1.5rem 0' }}>Cadastro de Ordem de Serviço</h1>
            <div className="form-container">
                <p>Formulário principal (Nº O.S., Técnico, Equipamento, etc)...</p>

                <div className="table-wrapper" style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Peças/Serviços</h3>
                        <div>
                            <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Horas Técnicas</button>
                            <button className="btn btn-primary" onClick={() => setIsAddingItem(true)}>+ Adicionar Item</button>
                        </div>
                    </div>
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
                            {isAddingItem && (
                                <tr>
                                    <td><input type="text" name="code" value={newItem.code} onChange={handleNewItemChange} placeholder="Código" /></td>
                                    <td><input type="text" name="description" value={newItem.description} onChange={handleNewItemChange} placeholder="Descrição" /></td>
                                    <td><input type="number" name="quantity" value={newItem.quantity} onChange={handleNewItemChange} style={{width: '60px'}}/></td>
                                    <td><input type="number" name="unitValue" value={newItem.unitValue} onChange={handleNewItemChange} style={{width: '80px'}}/></td>
                                    <td>R$ {(newItem.quantity * newItem.unitValue).toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={handleAddItem}>Confirmar</button>
                                        <button className="btn btn-secondary" style={{marginLeft: '0.5rem'}} onClick={() => setIsAddingItem(false)}>Cancelar</button>
                                    </td>
                                </tr>
                            )}
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.code}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>R$ {parseFloat(item.unitValue).toFixed(2)}</td>
                                    <td>R$ {(item.quantity * item.unitValue).toFixed(2)}</td>
                                    <td>...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {items.length === 0 && !isAddingItem && (
                        <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma peça ou serviço adicionado</p>
                    )}
                </div>

                <div className="form-actions">
                    <button className="btn btn-primary">Salvar e Finalizar</button>
                    <button className="btn btn-secondary">Salvar Rascunho</button>
                    <button className="btn btn-secondary">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default NewServiceOrder;
