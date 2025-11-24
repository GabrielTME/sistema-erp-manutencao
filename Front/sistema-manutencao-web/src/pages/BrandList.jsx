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
      // Busca marcas ordenadas pelo nome
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
      fetchBrands(); // Recarrega a lista
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
          <h1>Gestão de Marcas</h1>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Nova Marca</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome da Marca</th>
                <th>Especificações / Detalhes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id}>
                    <td><span className="id-tag">{brand.id}</span></td>
                    <td><strong>{brand.name}</strong></td>
                    <td>{brand.specifications || '-'}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => openEditModal(brand)}>Editar</button>
                      <button className="btn btn-danger" style={{marginLeft: '5px'}} onClick={() => handleDeleteClick(brand.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>Nenhuma marca cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ADICIONAR */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Nova Marca">
         <div className="form-group">
            <label>Nome da Marca *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Ex: Bosch, Makita, Weg..."
            />
         </div>
         <div className="form-group">
            <label>Especificações (Opcional)</label>
            <textarea 
              name="specifications" 
              value={formData.specifications} 
              onChange={handleInputChange} 
              rows="3"
              placeholder="Informações de contato ou detalhes técnicos..."
            />
         </div>
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleAddBrand}>Salvar</button>
         </div>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Marca">
         <div className="form-group">
            <label>Nome da Marca *</label>
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
