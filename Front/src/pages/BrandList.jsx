import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Estados dos Formulários
  const [currentBrand, setCurrentBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', specifications: '' });

  // --- BUSCAR DADOS ---
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/marcas?size=100&sort=nome');
      setBrands(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
      alert("Erro ao carregar lista de marcas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ name: '', specifications: '' });
    setAddModalOpen(true);
  };

  const openEditModal = (brand) => {
    setCurrentBrand(brand);
    setFormData({ 
      name: brand.name, 
      specifications: brand.specifications || '' 
    });
    setEditModalOpen(true);
  };

  // --- AÇÕES DE API ---

  const handleAddBrand = async () => {
    if (!formData.name) {
      alert('O nome da marca é obrigatório.');
      return;
    }

    try {
      await api.post('/marcas', formData);
      alert('Marca cadastrada com sucesso!');
      setAddModalOpen(false);
      fetchBrands(); 
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar marca.");
    }
  };

  const handleUpdateBrand = async () => {
    if (!currentBrand) return;

    try {
      await api.put(`/marcas/${currentBrand.id}`, formData);
      alert('Marca atualizada com sucesso!');
      setEditModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar marca.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta marca?")) {
      try {
        await api.delete(`/marcas/${id}`);
        setBrands(brands.filter(b => b.id !== id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Não é possível excluir esta marca pois ela pode estar vinculada a um equipamento.");
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
          <h1>Cadastro de Marcas</h1>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Adicionar Marca</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <thead>
              <tr>
                <th style={{width: '10%', textAlign: 'left', paddingLeft: '2rem'}}>ID</th>
                <th style={{width: '30%', textAlign: 'left'}}>Nome da Marca</th>
                <th style={{width: '40%', textAlign: 'left'}}>Especificações</th>
                {/* CABEÇALHO ALINHADO À ESQUERDA */}
                <th style={{width: '20%', textAlign: 'left'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id}>
                    <td style={{textAlign: 'left', paddingLeft: '2rem'}}>
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
                            {brand.id}
                        </span>
                    </td>
                    <td style={{textAlign: 'left'}}><strong>{brand.name}</strong></td>
                    <td style={{textAlign: 'left'}}>{brand.specifications || '-'}</td>
                    
                    {/* BOTÕES ALINHADOS À ESQUERDA */}
                    <td style={{textAlign: 'left'}}>
                      <button className="btn btn-secondary" onClick={() => openEditModal(brand)}>Editar</button>
                      <button className="btn btn-danger" style={{marginLeft: '5px'}} onClick={() => handleDeleteClick(brand.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Nenhuma marca cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ADICIONAR */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Adicionar Marca">
         <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
            Preencha as informações da nova marca.
         </p>

         <div className="form-group">
            <label>Nome da Marca</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
            />
         </div>
         <div className="form-group">
            <label>Especificações (Opcional)</label>
            <textarea 
              name="specifications" 
              value={formData.specifications} 
              onChange={handleInputChange} 
              rows="3"
              placeholder="Ex.: Equipamentos hidráulicos de alta pressão"
              style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
              }}
            />
         </div>
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleAddBrand}>Adicionar</button>
         </div>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Marca">
         <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
            Modifique as informações da marca.
         </p>
         <div className="form-group">
            <label>Nome da Marca</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
            />
         </div>
         <div className="form-group">
            <label>Especificações</label>
            <textarea 
              name="specifications" 
              value={formData.specifications} 
              onChange={handleInputChange} 
              rows="3"
              style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
              }}
            />
         </div>
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleUpdateBrand}>Salvar</button>
         </div>
      </Modal>

    </div>
  );
};

export default BrandList;
