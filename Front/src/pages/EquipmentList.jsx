import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [brands, setBrands] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  
  // Estados de seleção
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

  // Estados dos formulários
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Buscar dados
  const fetchBrands = async () => {
    try {
      const response = await api.get('/marcas?size=100&sort=nome'); 
      setBrands(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
    }
  };

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/equipamentos?size=1000');
      
      const adaptedData = response.data.content.map(item => ({
        id: item.id,
        name: item.nome, 
        brand: item.marca ? item.marca.name : '...',
        brandId: item.marca ? item.marca.id : '',
        photoUrl: item.foto
      }));

      setEquipments(adaptedData);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();     
    fetchEquipments(); 
  }, []);

  // Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName('');
    setBrandId('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (eq) => {
    setCurrentEquipment(eq);
    setName(eq.name);
    setBrandId(eq.brandId); 
    setPreviewUrl(eq.photoUrl); 
    setSelectedFile(null); 
    setEditModalOpen(true);
  };

  // Ações de API
  const handleAddEquipment = async () => {
    if (!name || !brandId) {
      alert('Nome e Marca são obrigatórios.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', name);
    formData.append('idMarca', brandId); 
    if (selectedFile) {
      formData.append('foto', selectedFile);
    }

    try {
      await api.post('/equipamentos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Equipamento criado com sucesso!');
      setAddModalOpen(false);
      fetchEquipments();
    } catch (error) {
      console.error("Erro ao criar:", error);
      alert("Erro ao criar equipamento.");
    }
  };

  const handleUpdateEquipment = async () => {
    if (!currentEquipment) return;

    const formData = new FormData();
    formData.append('nome', name);
    if (brandId) formData.append('idMarca', brandId);
    if (selectedFile) {
      formData.append('foto', selectedFile);
    }

    try {
      await api.put(`/equipamentos/${currentEquipment.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Equipamento atualizado!');
      setEditModalOpen(false);
      fetchEquipments();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Excluir equipamento?")) {
      try {
        await api.delete(`/equipamentos/${id}`);
        setEquipments(prev => prev.filter(e => e.id !== id));
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
          <h1>Cadastro de Equipamentos</h1>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Adicionar Equipamento</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : (
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <thead>
              <tr>
                <th style={{width: '10%', textAlign: 'left', paddingLeft: '2rem'}}>Foto</th>
                <th style={{width: '30%', textAlign: 'left'}}>Nome do Equipamento</th>
                <th style={{width: '20%', textAlign: 'left'}}>Marca</th>
                <th style={{width: '15%', textAlign: 'left'}}>ID do Equipamento</th> 
                <th style={{width: '25%', textAlign: 'left'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipments.length > 0 ? (
                equipments.map((eq) => (
                  <tr key={eq.id}>
                    <td style={{textAlign: 'left', verticalAlign: 'middle', paddingLeft: '2rem'}}>
                      <img 
                        src={eq.photoUrl || 'https://via.placeholder.com/40?text=?'} 
                        alt="Foto" 
                        className="table-photo-thumb"
                        onClick={() => { setSelectedPhotoUrl(eq.photoUrl); setPhotoModalOpen(true); }}
                        style={{display: 'block', margin: 0}} 
                      />
                    </td>
                    
                    <td style={{textAlign: 'left', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {eq.name}
                    </td>
                    
                    <td style={{textAlign: 'left', verticalAlign: 'middle'}}>
                        {eq.brand}
                    </td>
                    
                    <td style={{textAlign: 'left', verticalAlign: 'middle'}}>
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
                            EQ{String(eq.id).padStart(3, '0')}
                        </span>
                    </td>
                    
                    <td style={{textAlign: 'left', verticalAlign: 'middle'}}>
                      <button className="btn btn-secondary" onClick={() => openEditModal(eq)}>Editar</button>
                      <button className="btn btn-danger" style={{marginLeft: '8px'}} onClick={() => handleDeleteClick(eq.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                    Nenhum equipamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal adicionar */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Adicionar Equipamento">
         <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
            Preencha as informações do novo equipamento.
         </p>

         <div className="form-group">
            <label>Nome do Equipamento</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
         </div>
         <div className="form-group">
            <label>Marca</label>
            <select value={brandId} onChange={e => setBrandId(e.target.value)} className="form-select">
              <option value="">Selecione uma marca</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {brands.length === 0 && <small style={{color: 'red'}}>Nenhuma marca cadastrada no sistema.</small>}
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
                <label htmlFor="add-file-upload" style={{
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
                    id="add-file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
            </div>
            {previewUrl && <img src={previewUrl} alt="Preview" style={{marginTop: 10, maxHeight: 100}} />}
         </div>
         
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleAddEquipment}>Adicionar</button>
         </div>
      </Modal>

      {/* Modal editar */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Equipamento">
         <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
            Modifique as informações do equipamento.
         </p>

         <div className="form-group">
            <label>Nome do Equipamento</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
         </div>
         <div className="form-group">
            <label>Marca</label>
            <select value={brandId} onChange={e => setBrandId(e.target.value)} className="form-select">
              <option value="">Selecione uma marca</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
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
                <label htmlFor="edit-file-upload" style={{
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
                    id="edit-file-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
            </div>
            {previewUrl && <p style={{fontSize: '12px', marginTop: '0.5rem', color: '#64748b'}}>Foto atual/selecionada:</p>}
            {previewUrl && <img src={previewUrl} alt="Preview" style={{maxHeight: 100}} />}
         </div>
         
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleUpdateEquipment}>Salvar</button>
         </div>
      </Modal>

      {/* Modal foto grande */}
      <Modal isOpen={isPhotoModalOpen} onClose={() => setPhotoModalOpen(false)} title="Visualizar Foto">
        <img src={selectedPhotoUrl} alt="Grande" className="photo-modal-img" />
      </Modal>
    </div>
  );
};

export default EquipmentList;
