import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const StockGroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para MODAL DE GRUPO
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');

  // Estados para MODAL DE SUBGRUPO
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Para saber onde adicionar o subgrupo
  
  // Para expandir/visualizar subgrupos na lista (Accordion simples)
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [subgroupsMap, setSubgroupsMap] = useState({}); // Cache de subgrupos carregados { idGrupo: [lista] }

  // --- CARREGAR DADOS ---
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/estoque/grupos');
      setGroups(res.data);
    } catch (error) {
      console.error("Erro ao buscar grupos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubgroups = async (idGrupo) => {
    try {
      const res = await api.get(`/estoque/subgrupos?idGrupo=${idGrupo}`);
      setSubgroupsMap(prev => ({ ...prev, [idGrupo]: res.data }));
    } catch (error) {
      console.error("Erro ao buscar subgrupos", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // --- AÇÕES DE GRUPO ---
  const handleCreateGroup = async () => {
    if (!groupName) return alert('Digite o nome do grupo');
    try {
      await api.post('/estoque/grupos', { nome: groupName });
      alert('Grupo criado!');
      setGroupModalOpen(false);
      setGroupName('');
      fetchGroups();
    } catch (error) {
      alert('Erro ao criar grupo.');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm("Excluir grupo? Isso pode apagar subgrupos vinculados.")) {
      try {
        await api.delete(`/estoque/grupos/${id}`);
        setGroups(prev => prev.filter(g => g.id !== id));
      } catch (error) {
        alert("Erro ao excluir grupo. Verifique se há itens vinculados.");
      }
    }
  };

  // --- AÇÕES DE SUBGRUPO ---
  const openSubModal = (idGrupo) => {
    setSelectedGroupId(idGrupo);
    setSubName('');
    setSubModalOpen(true);
  };

  const handleCreateSubgroup = async () => {
    if (!subName || !selectedGroupId) return alert('Dados incompletos');
    try {
      await api.post('/estoque/subgrupos', { nome: subName, idGrupo: selectedGroupId });
      alert('Subgrupo criado!');
      setSubModalOpen(false);
      setSubName('');
      fetchSubgroups(selectedGroupId); // Recarrega a lista daquele grupo
      // Se o grupo não estava expandido, expande para ver o novo item
      if (expandedGroupId !== selectedGroupId) setExpandedGroupId(selectedGroupId);
    } catch (error) {
      alert('Erro ao criar subgrupo.');
    }
  };

  const handleDeleteSubgroup = async (idSub, idGrupo) => {
    if (window.confirm("Excluir subgrupo?")) {
      try {
        await api.delete(`/estoque/subgrupos/${idSub}`);
        fetchSubgroups(idGrupo);
      } catch (error) {
        alert("Erro ao excluir subgrupo.");
      }
    }
  };

  // --- INTERFACE ---
  const toggleExpand = (idGrupo) => {
    if (expandedGroupId === idGrupo) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(idGrupo);
      fetchSubgroups(idGrupo); // Busca os subgrupos ao abrir
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/estoque" className="btn btn-secondary btn-back">&larr; Voltar para Estoque</Link>
           <h1>Grupos e Subgrupos</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setGroupModalOpen(true)}>+ Novo Grupo</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <React.Fragment key={g.id}>
                  <tr style={{backgroundColor: expandedGroupId === g.id ? '#f8fafc' : 'white'}}>
                    <td onClick={() => toggleExpand(g.id)} style={{cursor: 'pointer', fontWeight: 'bold'}}>
                       {expandedGroupId === g.id ? '▼' : '►'} {g.nome}
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{fontSize: '0.8rem', marginRight: 5}} onClick={() => openSubModal(g.id)}>+ Subgrupo</button>
                      <button className="btn btn-danger" style={{fontSize: '0.8rem'}} onClick={() => handleDeleteGroup(g.id)}>Excluir Grupo</button>
                    </td>
                  </tr>
                  {/* Linha de Subgrupos (Expandida) */}
                  {expandedGroupId === g.id && (
                    <tr>
                      <td colSpan="2" style={{paddingLeft: '2rem', backgroundColor: '#f1f5f9'}}>
                         <p style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b'}}>Subgrupos de {g.nome}:</p>
                         {subgroupsMap[g.id] && subgroupsMap[g.id].length > 0 ? (
                           <ul style={{listStyle: 'none', padding: 0}}>
                             {subgroupsMap[g.id].map(sub => (
                               <li key={sub.id} style={{display: 'flex', alignItems: 'center', marginBottom: 5}}>
                                 <span style={{marginRight: 10}}>• {sub.nome}</span>
                                 <button style={{border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem'}} 
                                         onClick={() => handleDeleteSubgroup(sub.id, g.id)}>(Excluir)</button>
                               </li>
                             ))}
                           </ul>
                         ) : <p style={{fontSize: '0.8rem'}}>Nenhum subgrupo cadastrado.</p>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Grupo */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} title="Novo Grupo">
         <div className="form-group">
            <label>Nome do Grupo</label>
            <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Ex: Elétrica" />
         </div>
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setGroupModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleCreateGroup}>Salvar</button>
         </div>
      </Modal>

      {/* Modal Subgrupo */}
      <Modal isOpen={isSubModalOpen} onClose={() => setSubModalOpen(false)} title="Novo Subgrupo">
         <div className="form-group">
            <label>Nome do Subgrupo</label>
            <input value={subName} onChange={e => setSubName(e.target.value)} placeholder="Ex: Cabos" />
         </div>
         <div className="modal-actions">
           <button className="btn btn-secondary" onClick={() => setSubModalOpen(false)}>Cancelar</button>
           <button className="btn btn-primary" onClick={handleCreateSubgroup}>Salvar</button>
         </div>
      </Modal>
    </div>
  );
};

export default StockGroupList;
