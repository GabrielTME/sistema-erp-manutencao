import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const StockList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]); 

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
  
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

  // Garantir horas técnicas
  const handleCreateService = async () => {
      const SERVICE_NAME = "Horas Técnicas de Manutenção";

      // 1. Verifica se já existe na lista atual
      const exists = items.some(i => i.nome === SERVICE_NAME);

      if (exists) {
          alert("O item 'Horas Técnicas de Manutenção' já está cadastrado na lista!");
          return;
      }

      // 2. Se não existe cria automaticamente
      try {
          await api.post('/servicos', { nome: SERVICE_NAME });
          alert('Item "Horas Técnicas" criado com sucesso!');
          loadInitialData(); // Recarrega a lista para aparecer
      } catch (error) {
          console.error(error);
          alert('Erro ao cadastrar serviço.');
      }
  };

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

  const handlePriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    const numericValue = value ? parseFloat(value) / 100 : '';
    setFormData(prev => ({ ...prev, valorUnitario: numericValue }));
  };

  const getFormattedPriceForInput = (value) => {
      if (!value) return '';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '').replace(/\u00A0/g, '');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
    
    const isService = (item.codigoProduto && item.codigoProduto.startsWith('SRV')) || item.quantidade >= 99999;
    
    if (isService && !item.foto) {
        setPreviewUrl('https://img.icons8.com/color/48/clock--v1.png');
    } else {
        setPreviewUrl(item.foto);
    }
    
    setSelectedFile(null);
    setEditModalOpen(true);
  };

  const handleSave = async (isEdit) => {
    if (!formData.nome || !formData.codigoProduto || !formData.valorUnitario) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('codigoProduto', formData.codigoProduto);
    data.append('quantidade', formData.quantidade);
    data.append('quantidadeEmEstoque', formData.quantidadeEmEstoque || 0);
    data.append('valorUnitario', formData.valorUnitario);
    if (formData.idSubgrupo) data.append('idSubgrupo', formData.idSubgrupo);
    
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
      alert("Erro ao salvar item.");
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

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'R$0,00';
    return `R$${value.toFixed(2).replace('.', ',')}`;
  };

  const totalInventoryValue = items.reduce((acc, item) => {
      const isService = (item.codigoProduto && item.codigoProduto.startsWith('SRV')) || item.quantidade >= 99999;
      if (isService) return acc;
      return acc + (item.quantidade * item.valorUnitario);
  }, 0);

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Itens em Estoque</h1>
        </div>
        <div>
           <Link to="/estoque/grupos" className="btn btn-secondary" style={{marginRight: '1rem'}}>Gerenciar Grupos</Link>
           <button className="btn btn-secondary" onClick={handleCreateService} style={{marginRight: '1rem'}}>Horas Técnicas</button>
           <button className="btn btn-primary" onClick={openAdd}>+ Adicionar Item</button>
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
                  const isService = (item.codigoProduto && item.codigoProduto.startsWith('SRV')) || item.quantidade >= 99999;
                  const isLowStock = !isService && item.quantidade <= 5;
                  
                  let stockLabel = 'Em Estoque';
                  let stockBg = '#dcfce7'; 
                  let stockColor = '#16a34a';

                  if (isService) {
                      stockLabel = 'Serviço';
                      stockBg = '#e0e7ff'; 
                      stockColor = '#3730a3';
                  } else if (isLowStock) {
                      stockLabel = 'Estoque Baixo';
                      stockBg = '#fee2e2'; 
                      stockColor = '#ef4444';
                  }

                  const itemImage = isService 
                    ? 'https://img.icons8.com/color/48/clock--v1.png' 
                    : (item.foto || 'https://via.placeholder.com/40?text=?');

                  return (
                    <tr key={item.id}>
                      <td>
                        <img 
                          src={itemImage} 
                          alt="Foto" 
                          className="table-photo-thumb"
                          style={{objectFit: 'contain'}}
                          onClick={() => { setSelectedPhotoUrl(itemImage); setPhotoModalOpen(true); }}
                        />
                      </td>
                      <td>{item.nome}</td>
                      <td>
                        <span style={{
                            backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 8px',
                            borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem',
                            fontFamily: 'monospace', display: 'inline-block'
                        }}>
                            {item.codigoProduto}
                        </span>
                      </td>
                      <td>
                        {item.nomeGrupo ? <small>{item.nomeGrupo} &gt; {item.nomeSubgrupo}</small> : <small>-</small>}
                      </td>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>
                                {isService ? '∞' : item.quantidade}
                            </span>
                            <span style={{backgroundColor: stockBg, color: stockColor, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}>
                                {stockLabel}
                            </span>
                        </div>
                      </td>
                      <td>{formatCurrency(item.valorUnitario)}</td>
                      <td>
                          {isService ? '-' : formatCurrency(item.quantidade * item.valorUnitario)}
                      </td>
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
            
            <div style={{padding: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'right', backgroundColor: '#f8fafc'}}>
                <span style={{color: '#64748b', marginRight: '10px'}}>Valor Total do Estoque:</span>
                <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b'}}>
                    {formatCurrency(totalInventoryValue)}
                </span>
            </div>
          </>
        )}
      </div>

      {/* Modal formulário */}
      {[isAddModalOpen, isEditModalOpen].map((isOpen, index) => {
        if (!isOpen) return null;
        const isEdit = index === 1;
        
        const isServiceItem = (formData.codigoProduto && formData.codigoProduto.startsWith('SRV')) || formData.quantidade >= 99999;
        const disableFields = isEdit && isServiceItem;

        return (
          <Modal key={index} isOpen={true} onClose={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)} 
                 title={isEdit ? "Editar Item" : "Adicionar Item ao Estoque"}>
             
             <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
                {isEdit ? "Modifique as informações do item em estoque." : "Preencha as informações do novo item para o estoque."}
             </p>

             <div className="form-group">
                <label>Nome do Item</label>
                <input name="nome" value={formData.nome} onChange={handleInputChange} disabled={disableFields} />
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Código do Item</label>
                    <input name="codigoProduto" value={formData.codigoProduto} onChange={handleInputChange} placeholder="Ex.: FILTRO001" disabled={disableFields} />
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Grupo</label>
                    <select name="idGrupo" value={formData.idGrupo} onChange={handleGroupChange} className="form-select" disabled={disableFields}>
                        <option value="">Selecione</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
                    </select>
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Subgrupo</label>
                    <select name="idSubgrupo" value={formData.idSubgrupo} onChange={handleInputChange} className="form-select" disabled={disableFields || !formData.idGrupo}>
                        <option value="">Selecione</option>
                        {subgroups.map(sub => <option key={sub.id} value={sub.id}>{sub.nome}</option>)}
                    </select>
                 </div>
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Quantidade</label>
                    
                    {disableFields && formData.quantidade >= 99999 ? (
                       <input 
                          type="text" 
                          value="∞" 
                          disabled 
                          style={{
                              backgroundColor: '#f1f5f9', 
                              color: '#64748b',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              fontSize: '1.2rem'
                          }} 
                       />
                    ) : (
                       <input type="number" name="quantidade" value={formData.quantidade} onChange={handleInputChange} disabled={disableFields} />
                    )}

                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Valor Unitário (R$)</label>
                    <input 
                        type="text" 
                        name="valorUnitario" 
                        value={getFormattedPriceForInput(formData.valorUnitario)} 
                        onChange={handlePriceChange}
                        placeholder="R$0,00"
                    />
                 </div>
             </div>

             <div className="form-group">
                <label>Foto</label>
                {disableFields ? (
                    <div style={{padding: '10px', background: '#f1f5f9', borderRadius: '4px', color: '#64748b', fontSize: '0.9rem'}}>
                        Foto bloqueada.
                    </div>
                ) : (
                    <div style={{border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <label htmlFor={`file-upload-${isEdit ? 'edit' : 'add'}`} style={{backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', fontWeight: '500'}}>
                            Escolher arquivo
                        </label>
                        <span style={{color: '#64748b', fontSize: '0.9rem'}}>{selectedFile ? selectedFile.name : "Faça upload de um arquivo"}</span>
                        <input id={`file-upload-${isEdit ? 'edit' : 'add'}`} type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                    </div>
                )}
                {previewUrl && <img src={previewUrl} alt="Preview" style={{marginTop: 10, maxHeight: 80, objectFit: 'contain'}} />}
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
        <img src={selectedPhotoUrl} alt="Item" className="photo-modal-img" style={{objectFit: 'contain'}} />
      </Modal>

    </div>
  );
};

export default StockList;
