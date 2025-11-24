package com.seuorg.manutencao.itemestoque.subgrupo.service;

import com.seuorg.manutencao.itemestoque.grupo.entity.ItemGrupo;
import com.seuorg.manutencao.itemestoque.grupo.repository.ItemGrupoRepository;
import com.seuorg.manutencao.itemestoque.subgrupo.dto.ItemSubgrupoDTO;
import com.seuorg.manutencao.itemestoque.subgrupo.entity.ItemSubgrupo;
import com.seuorg.manutencao.itemestoque.subgrupo.repository.ItemSubgrupoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ItemSubgrupoService {
    private final ItemSubgrupoRepository repo;
    private final ItemGrupoRepository grupoRepo;

    public ItemSubgrupoService(ItemSubgrupoRepository repo, ItemGrupoRepository grupoRepo) {
        this.repo = repo; this.grupoRepo = grupoRepo;
    }

    private ItemSubgrupoDTO toDTO(ItemSubgrupo s) {
        return new ItemSubgrupoDTO(s.getId(), s.getNome(), s.getGrupo().getId(), s.getGrupo().getNome());
    }

    public List<ItemSubgrupoDTO> listarPorGrupo(Long idGrupo) {
        if(idGrupo == null) return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
        return repo.findByGrupoId(idGrupo).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ItemSubgrupoDTO criar(String nome, Long idGrupo) {
        ItemGrupo g = grupoRepo.findById(idGrupo).orElseThrow(() -> new NoSuchElementException("Grupo não encontrado"));
        ItemSubgrupo sub = new ItemSubgrupo(null, nome, g);
        repo.save(sub);
        return toDTO(sub);
    }
    
    public void excluir(Long id) { repo.deleteById(id); }
}
