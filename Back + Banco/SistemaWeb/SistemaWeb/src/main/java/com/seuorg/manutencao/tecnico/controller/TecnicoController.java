package com.seuorg.manutencao.tecnico.controller;

import com.seuorg.manutencao.tecnico.dto.*;
import com.seuorg.manutencao.tecnico.service.TecnicoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tecnicos")
public class TecnicoController {

    private final TecnicoService service;

    public TecnicoController(TecnicoService service) {
        this.service = service;
    }

    @GetMapping
    public Page<TecnicoDTO> listar(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        // Agora chama apenas o listar simples, sem filtro de string
        return service.listar(page, size);
    }

    @GetMapping("/{id_tecnico}")
    public TecnicoDTO buscar(@PathVariable("id_tecnico") Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<TecnicoDTO> criar(@Valid @RequestBody TecnicoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id_tecnico}")
    public TecnicoDTO atualizar(@PathVariable("id_tecnico") Long id,
                                @Valid @RequestBody TecnicoUpdateDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id_tecnico}")
    public ResponseEntity<Void> excluir(@PathVariable("id_tecnico") Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
