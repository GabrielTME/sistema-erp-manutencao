import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const StockList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados para Selects
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]); 

  // Modais
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  
  // States de Formulário e Seleção
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
  
  // State Unificado do Formulário
  const initialFormState = {
    nome: '',
    codigoProduto: '',
    quantidade: '',
    quantidadeEmEstoque: 0,
    valorUnitario: '',
    idGrupo: '', 
    idSubgrupo: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // --- CARREGAMENTO INICIAL ---
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const resItens = await api.get('/itens-estoque?size=100');
      setItems(resItens.data.content);
      
      const resGroups = await api.get('/estoque/grupos');
      setGroups(resGroups.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // --- LÓGICA DE FORMULÁRIO ---
  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    setFormData(prev => ({ ...prev, idGrupo: groupId, idSubgrupo: '' })); 
    
    if (groupId) {
       const res = await api.get(`/estoque/subgrupos?idGrupo=${groupId}`);
       setSubgroups(res.data);
    } else {
       setSubgroups([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- PREPARAR MODAIS ---
  const openAdd = () => {
    setFormData(initialFormState);
    setSubgroups([]);
    setSelectedFile(null);
    setPreviewUrl('');
    setAddModalOpen(true);
  };

  const openEdit = async (item) => {
    setCurrentItem(item);
    if (item.idGrupo) {
        const res = await api.get(`/estoque/subgrupos?idGrupo=${item.idGrupo}`);
        setSubgroups(res.data);
    }

    setFormData({
      nome: item.nome,
      codigoProduto: item.codigoProduto,
      quantidade: item.quantidade,
      quantidadeEmEstoque: item.quantidadeEmEstoque || 0,
      valorUnitario: item.valorUnitario,
      idGrupo: item.idGrupo || '',
      idSubgrupo: item.idSubgrupo || ''
    });
    setPreviewUrl(item.foto);
    setSelectedFile(null);
    setEditModalOpen(true);
  };

  // --- SALVAR ---
  const handleSave = async (isEdit) => {
    if (!formData.nome || !formData.codigoProduto || !formData.valorUnitario || !formData.idSubgrupo) {
      alert("Preencha todos os campos obrigatórios (incluindo Grupo/Subgrupo).");
      return;
    }

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('codigoProduto', formData.codigoProduto);
    data.append('quantidade', formData.quantidade);
    data.append('quantidadeEmEstoque', formData.quantidadeEmEstoque || 0);
    data.append('valorUnitario', formData.valorUnitario);
    data.append('idSubgrupo', formData.idSubgrupo);
    if (selectedFile) {
      data.append('foto', selectedFile);
    }

    try {
      if (isEdit) {
        await api.put(`/itens-estoque/${currentItem.id}`, data, { headers: {'Content-Type': 'multipart/form-data'} });
        alert("Item atualizado!");
      } else {
        await api.post('/itens-estoque', data, { headers: {'Content-Type': 'multipart/form-data'} });
        alert("Item criado!");
      }
      setAddModalOpen(false);
      setEditModalOpen(false);
      loadInitialData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item. Verifique se o Código do Item já existe.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir item?")) {
      try {
        await api.delete(`/itens-estoque/${id}`);
        setItems(prev => prev.filter(i => i.id !== id));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  // --- HELPERS VISUAIS ---
  const formatCurrency = (value) => {
    return `R$${value.toFixed(2).replace('.', ',')}`;
  };

  const totalInventoryValue = items.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Itens em Estoque</h1>
        </div>
        <div>
           <Link to="/estoque/grupos" className="btn btn-secondary" style={{marginRight: '1rem'}}>Gerenciar Grupos</Link>
           <button className="btn btn-primary" onClick={openAdd}>+ Novo Item</button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome do Item</th>
                  <th>Código do Item</th>
                  <th>Grupo / Subgrupo</th>
                  <th>Quantidade em Estoque</th>
                  <th>Valor Unitário</th>
                  <th>Valor Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const isLowStock = item.quantidade <= 5;
                  const stockColor = isLowStock ? '#ef4444' : '#16a34a';
                  const stockBg = isLowStock ? '#fee2e2' : '#dcfce7';
                  const stockLabel = isLowStock ? 'Estoque Baixo' : 'Em Estoque';

                  return (
                    <tr key={item.id}>
                      <td>
                        <img 
                          src={item.foto || 'https://via.placeholder.com/40?text=?'} 
                          alt="Foto" 
                          className="table-photo-thumb"
                          onClick={() => { setSelectedPhotoUrl(item.foto); setPhotoModalOpen(true); }}
                        />
                      </td>
                      <td>{item.nome}</td>
                      <td>
                        <span style={{
                            backgroundColor: '#e2e8f0', 
                            color: '#475569',           
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',    
                            display: 'inline-block'
                        }}>
                            {item.codigoProduto}
                        </span>
                      </td>
                      <td>
                        <small>{item.nomeGrupo} &gt; {item.nomeSubgrupo}</small>
                      </td>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>{item.quantidade}</span>
                            <span style={{
                                backgroundColor: stockBg,
                                color: stockColor,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                            }}>
                                {stockLabel}
                            </span>
                        </div>
                      </td>
                      <td>{formatCurrency(item.valorUnitario)}</td>
                      <td>{formatCurrency(item.quantidade * item.valorUnitario)}</td>
                      <td>
                        <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                            <button className="btn btn-secondary" onClick={() => openEdit(item)}>Editar</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* RODAPÉ */}
            <div style={{
                padding: '1.5rem', 
                borderTop: '1px solid #e2e8f0', 
                textAlign: 'right', 
                backgroundColor: '#f8fafc',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px'
            }}>
                <span style={{color: '#64748b', marginRight: '10px'}}>Valor Total do Estoque:</span>
                <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b'}}>
                    {formatCurrency(totalInventoryValue)}
                </span>
            </div>
          </>
        )}
      </div>

      {/* MODAL FORMULÁRIO */}
      {[isAddModalOpen, isEditModalOpen].map((isOpen, index) => {
        if (!isOpen) return null;
        const isEdit = index === 1;
        const modalTitle = isEdit ? "Editar Item" : "Adicionar Item ao Estoque";
        
        return (
          <Modal key={index} isOpen={true} onClose={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)} 
                 title={modalTitle}>
             
             {/* TEXTO ALTERADO AQUI */}
             <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
                {isEdit ? "Modifique as informações do item em estoque." : "Preencha as informações do novo item para o estoque."}
             </p>

             <div className="form-group">
                <label>Nome do Item</label>
                <input name="nome" value={formData.nome} onChange={handleInputChange} />
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Código do Item</label>
                    <input name="codigoProduto" value={formData.codigoProduto} onChange={handleInputChange} placeholder="Ex.: FILTRO001" />
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Grupo</label>
                    <select name="idGrupo" value={formData.idGrupo} onChange={handleGroupChange} className="form-select">
                        <option value="">Selecione</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
                    </select>
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Subgrupo</label>
                    <select name="idSubgrupo" value={formData.idSubgrupo} onChange={handleInputChange} className="form-select" disabled={!formData.idGrupo}>
                        <option value="">Selecione</option>
                        {subgroups.map(sub => <option key={sub.id} value={sub.id}>{sub.nome}</option>)}
                    </select>
                 </div>
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Quantidade</label>
                    <input type="number" name="quantidade" value={formData.quantidade} onChange={handleInputChange} />
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Valor Unitário (R$)</label>
                    <input type="number" step="0.01" name="valorUnitario" value={formData.valorUnitario} onChange={handleInputChange} />
                 </div>
             </div>

             <div className="form-group">
                <label>Foto</label>
                <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <label htmlFor={`file-upload-${isEdit ? 'edit' : 'add'}`} style={{
                        backgroundColor: '#e2e8f0',
                        border: '1px solid #cbd5e1',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#334155',
                        fontWeight: '500'
                    }}>
                        Escolher arquivo
                    </label>
                    <span style={{color: '#64748b', fontSize: '0.9rem'}}>
                        {selectedFile ? selectedFile.name : "Faça upload de um arquivo"}
                    </span>
                    <input 
                        id={`file-upload-${isEdit ? 'edit' : 'add'}`}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                    />
                </div>
                {previewUrl && <img src={previewUrl} alt="Preview" style={{marginTop: 10, maxHeight: 80}} />}
             </div>

             <div className="modal-actions">
               <button className="btn btn-secondary" onClick={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)}>Cancelar</button>
               <button className="btn btn-primary" onClick={() => handleSave(isEdit)}>
                   {isEdit ? 'Salvar' : 'Adicionar'}
               </button>
             </div>
          </Modal>
        );
      })}
      
      <Modal isOpen={isPhotoModalOpen} onClose={() => setPhotoModalOpen(false)} title="Foto do Item">
        <img src={selectedPhotoUrl} alt="Item" className="photo-modal-img" />
      </Modal>

    </div>
  );
};

export default StockList;
