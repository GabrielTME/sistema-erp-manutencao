import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const StockList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados para Selects
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]); // Subgrupos filtrados pelo grupo selecionado

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
    quantidadeEmEstoque: '', // Estoque Mínimo
    valorUnitario: '',
    idGrupo: '', // Apenas visual para filtrar o subgrupo
    idSubgrupo: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // --- CARREGAMENTO INICIAL ---
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carrega Itens
      const resItens = await api.get('/itens-estoque?size=100');
      setItems(resItens.data.content);
      
      // Carrega Grupos (para o filtro do modal)
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

  // --- LÓGICA DE FORMULÁRIO (CASCATA GRUPO -> SUBGRUPO) ---
  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    setFormData(prev => ({ ...prev, idGrupo: groupId, idSubgrupo: '' })); // Limpa subgrupo ao mudar grupo
    
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
    // Precisamos carregar os subgrupos deste grupo para preencher o select corretamente
    if (item.idGrupo) {
        const res = await api.get(`/estoque/subgrupos?idGrupo=${item.idGrupo}`);
        setSubgroups(res.data);
    }

    setFormData({
      nome: item.nome,
      codigoProduto: item.codigoProduto,
      quantidade: item.quantidade,
      quantidadeEmEstoque: item.quantidadeEmEstoque,
      valorUnitario: item.valorUnitario,
      idGrupo: item.idGrupo || '',
      idSubgrupo: item.idSubgrupo || ''
    });
    setPreviewUrl(item.foto);
    setSelectedFile(null);
    setEditModalOpen(true);
  };

  // --- SALVAR (POST/PUT com FormData) ---
  const handleSave = async (isEdit) => {
    if (!formData.nome || !formData.codigoProduto || !formData.valorUnitario || !formData.idSubgrupo) {
      alert("Preencha todos os campos obrigatórios (incluindo Grupo/Subgrupo).");
      return;
    }

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('codigoProduto', formData.codigoProduto);
    data.append('quantidade', formData.quantidade);
    data.append('quantidadeEmEstoque', formData.quantidadeEmEstoque);
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
      alert("Erro ao salvar item. Verifique se o Código do Produto já existe.");
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
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Código</th>
                <th>Nome</th>
                <th>Grupo / Subgrupo</th>
                <th>Qtd. Atual</th>
                <th>Valor Un.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <img 
                      src={item.foto || 'https://via.placeholder.com/40?text=?'} 
                      alt="Foto" 
                      className="table-photo-thumb"
                      onClick={() => { setSelectedPhotoUrl(item.foto); setPhotoModalOpen(true); }}
                    />
                  </td>
                  <td>{item.codigoProduto}</td>
                  <td>{item.nome}</td>
                  <td>
                     <small>{item.nomeGrupo} &gt; {item.nomeSubgrupo}</small>
                  </td>
                  <td style={{ fontWeight: item.quantidade <= item.quantidadeEmEstoque ? 'bold' : 'normal', color: item.quantidade <= item.quantidadeEmEstoque ? 'red' : 'inherit' }}>
                    {item.quantidade} {item.quantidade <= item.quantidadeEmEstoque && '(Baixo)'}
                  </td>
                  <td>R$ {item.valorUnitario.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => openEdit(item)}>Editar</button>
                    <button className="btn btn-danger" style={{marginLeft: 5}} onClick={() => handleDelete(item.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL FORMULÁRIO (Reutilizado para Criar e Editar) */}
      {[isAddModalOpen, isEditModalOpen].map((isOpen, index) => {
        if (!isOpen) return null;
        const isEdit = index === 1;
        return (
          <Modal key={index} isOpen={true} onClose={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)} 
                 title={isEdit ? "Editar Item" : "Novo Item de Estoque"}>
             
             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Código do Produto *</label>
                    <input name="codigoProduto" value={formData.codigoProduto} onChange={handleInputChange} placeholder="Ex: CX-001" />
                 </div>
                 <div className="form-group" style={{flex: 2}}>
                    <label>Nome do Item *</label>
                    <input name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Caixa de Fusíveis" />
                 </div>
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Grupo</label>
                    <select name="idGrupo" value={formData.idGrupo} onChange={handleGroupChange} className="form-select">
                        <option value="">Selecione...</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
                    </select>
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Subgrupo *</label>
                    <select name="idSubgrupo" value={formData.idSubgrupo} onChange={handleInputChange} className="form-select" disabled={!formData.idGrupo}>
                        <option value="">Selecione...</option>
                        {subgroups.map(sub => <option key={sub.id} value={sub.id}>{sub.nome}</option>)}
                    </select>
                 </div>
             </div>

             <div style={{display: 'flex', gap: '1rem'}}>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Qtd. Física *</label>
                    <input type="number" name="quantidade" value={formData.quantidade} onChange={handleInputChange} />
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Estoque Mínimo *</label>
                    <input type="number" name="quantidadeEmEstoque" value={formData.quantidadeEmEstoque} onChange={handleInputChange} />
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label>Valor Unit. (R$) *</label>
                    <input type="number" step="0.01" name="valorUnitario" value={formData.valorUnitario} onChange={handleInputChange} />
                 </div>
             </div>

             <div className="form-group">
                <label>Foto do Item</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && <img src={previewUrl} alt="Preview" style={{marginTop: 10, maxHeight: 80}} />}
             </div>

             <div className="modal-actions">
               <button className="btn btn-secondary" onClick={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)}>Cancelar</button>
               <button className="btn btn-primary" onClick={() => handleSave(isEdit)}>Salvar</button>
             </div>
          </Modal>
        );
      })}
      
      {/* MODAL FOTO GRANDE */}
      <Modal isOpen={isPhotoModalOpen} onClose={() => setPhotoModalOpen(false)} title="Foto do Item">
        <img src={selectedPhotoUrl} alt="Item" className="photo-modal-img" />
      </Modal>

    </div>
  );
};

export default StockList;
