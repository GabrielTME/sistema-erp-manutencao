package com.seuorg.manutencao.tecnico.controller;

import com.seuorg.manutencao.tecnico.dto.TecnicoCategoriaDTO;
import com.seuorg.manutencao.tecnico.service.TecnicoCategoriaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tecnicos/categorias")
public class TecnicoCategoriaController {

    private final TecnicoCategoriaService service;

    public TecnicoCategoriaController(TecnicoCategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<TecnicoCategoriaDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public TecnicoCategoriaDTO criar(@RequestBody TecnicoCategoriaDTO dto) {
        return service.criar(dto.getNome());
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
