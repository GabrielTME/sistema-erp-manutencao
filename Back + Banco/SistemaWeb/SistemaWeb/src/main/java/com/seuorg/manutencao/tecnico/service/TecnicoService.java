package com.seuorg.manutencao.tecnico.service;

import com.seuorg.manutencao.tecnico.dto.*;
import com.seuorg.manutencao.tecnico.entity.Tecnico;
import com.seuorg.manutencao.tecnico.entity.TecnicoCategoria;
import com.seuorg.manutencao.tecnico.repository.TecnicoRepository;
import com.seuorg.manutencao.tecnico.repository.TecnicoCategoriaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

@Service
public class TecnicoService {
    private final TecnicoRepository repository;
    private final TecnicoCategoriaRepository categoriaRepository;

    public TecnicoService(TecnicoRepository repository, TecnicoCategoriaRepository categoriaRepository) { 
        this.repository = repository; 
        this.categoriaRepository = categoriaRepository;
    }

    private TecnicoDTO toDTO(Tecnico t) {
        return new TecnicoDTO(
            t.getId(), 
            t.getNome(), 
            t.getCategoria() != null ? t.getCategoria().getNome() : "Sem Categoria",
            t.getCategoria() != null ? t.getCategoria().getId() : null
        );
    }

    public Page<TecnicoDTO> listar(int page, int size) {
        return repository.findAll(PageRequest.of(page, size)).map(this::toDTO);
    }

    public TecnicoDTO buscar(Long id) {
        Tecnico t = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Técnico não encontrado"));
        return toDTO(t);
    }

    // Recebe ID da categoria em vez de string
    public TecnicoDTO criar(TecnicoCreateDTO dto) {
        TecnicoCategoria cat = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new NoSuchElementException("Categoria não encontrada"));
        
        Tecnico t = new Tecnico(null, dto.getNome(), cat);
        repository.save(t);
        return toDTO(t);
    }

    public TecnicoDTO atualizar(Long id, TecnicoUpdateDTO dto) {
        Tecnico t = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Técnico não encontrado"));
        TecnicoCategoria cat = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new NoSuchElementException("Categoria não encontrada"));

        t.setNome(dto.getNome());
        t.setCategoria(cat);
        repository.save(t);
        return toDTO(t);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) throw new NoSuchElementException("Técnico não encontrado");
        repository.deleteById(id);
    }
}
