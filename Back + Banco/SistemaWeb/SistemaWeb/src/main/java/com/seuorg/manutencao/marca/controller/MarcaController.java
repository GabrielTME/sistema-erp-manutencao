package com.seuorg.manutencao.marca.controller;

import com.seuorg.manutencao.marca.dto.MarcaCreateDTO;
import com.seuorg.manutencao.marca.dto.MarcaDTO;
import com.seuorg.manutencao.marca.dto.MarcaUpdateDTO;
import com.seuorg.manutencao.marca.service.MarcaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService service;

    public MarcaController(MarcaService service) {
        this.service = service;
    }

    @GetMapping
    public Page<MarcaDTO> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        return service.listar(page, size, sort);
    }

    @GetMapping("/{id_marca}")
    public MarcaDTO buscar(@PathVariable("id_marca") Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<MarcaDTO> criar(@Valid @RequestBody MarcaCreateDTO dto) {
        MarcaDTO criado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id_marca}")
    public MarcaDTO atualizar(@PathVariable("id_marca") Long id, @Valid @RequestBody MarcaUpdateDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id_marca}")
    public ResponseEntity<Void> excluir(@PathVariable("id_marca") Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
