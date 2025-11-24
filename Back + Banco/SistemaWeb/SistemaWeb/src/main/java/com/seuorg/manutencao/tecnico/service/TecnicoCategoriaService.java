package com.seuorg.manutencao.tecnico.service;

import com.seuorg.manutencao.tecnico.dto.TecnicoCategoriaDTO;
import com.seuorg.manutencao.tecnico.entity.TecnicoCategoria;
import com.seuorg.manutencao.tecnico.repository.TecnicoCategoriaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TecnicoCategoriaService {
    private final TecnicoCategoriaRepository repository;

    public TecnicoCategoriaService(TecnicoCategoriaRepository repository) {
        this.repository = repository;
    }

    public List<TecnicoCategoriaDTO> listar() {
        return repository.findAll(Sort.by("nome")).stream()
                .map(c -> new TecnicoCategoriaDTO(c.getId(), c.getNome()))
                .collect(Collectors.toList());
    }

    public TecnicoCategoriaDTO criar(String nome) {
        TecnicoCategoria c = new TecnicoCategoria(null, nome);
        repository.save(c);
        return new TecnicoCategoriaDTO(c.getId(), c.getNome());
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
