package com.seuorg.manutencao.itemestoque.grupo.service;

import com.seuorg.manutencao.itemestoque.grupo.dto.ItemGrupoDTO;
import com.seuorg.manutencao.itemestoque.grupo.entity.ItemGrupo;
import com.seuorg.manutencao.itemestoque.grupo.repository.ItemGrupoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemGrupoService {
    private final ItemGrupoRepository repo;

    public ItemGrupoService(ItemGrupoRepository repo) { this.repo = repo; }

    public List<ItemGrupoDTO> listar() {
        return repo.findAll(Sort.by("nome")).stream()
                .map(g -> new ItemGrupoDTO(g.getId(), g.getNome()))
                .collect(Collectors.toList());
    }

    public ItemGrupoDTO criar(String nome) {
        ItemGrupo g = new ItemGrupo(null, nome);
        repo.save(g);
        return new ItemGrupoDTO(g.getId(), g.getNome());
    }
    
    public void excluir(Long id) { repo.deleteById(id); }
}
