package com.seuorg.manutencao.marca.service;

import com.seuorg.manutencao.marca.dto.MarcaCreateDTO;
import com.seuorg.manutencao.marca.dto.MarcaDTO;
import com.seuorg.manutencao.marca.dto.MarcaUpdateDTO;
import com.seuorg.manutencao.marca.entity.Marca;
import com.seuorg.manutencao.marca.repository.MarcaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class MarcaService {

    private final MarcaRepository repo;

    public MarcaService(MarcaRepository repo) {
        this.repo = repo;
    }

    private MarcaDTO toDTO(Marca m) {
        return new MarcaDTO(m.getId(), m.getNome(), m.getEspecificacoes());
    }

    private Marca fromCreateDTO(MarcaCreateDTO dto) {
        Marca m = new Marca();
        m.setNome(dto.getName());
        m.setEspecificacoes(dto.getSpecifications());
        return m;
    }

    public Page<MarcaDTO> listar(int page, int size, String sort) {
        Sort s = (sort == null || sort.isBlank()) ? Sort.by("id").ascending() : Sort.by(sort).ascending();
        return repo.findAll(PageRequest.of(page, size, s)).map(this::toDTO);
    }

    public MarcaDTO buscar(Long id) {
        Marca m = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Marca não encontrada"));
        return toDTO(m);
    }

    public MarcaDTO criar(MarcaCreateDTO dto) {
        Marca salvo = repo.save(fromCreateDTO(dto));
        return toDTO(salvo);
    }

    public MarcaDTO atualizar(Long id, MarcaUpdateDTO dto) {
        Marca m = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Marca não encontrada"));
        m.setNome(dto.getName());
        m.setEspecificacoes(dto.getSpecifications());
        return toDTO(repo.save(m));
    }

    public void excluir(Long id) {
        if (!repo.existsById(id)) throw new EntityNotFoundException("Marca não encontrada");
        repo.deleteById(id);
    }
}
