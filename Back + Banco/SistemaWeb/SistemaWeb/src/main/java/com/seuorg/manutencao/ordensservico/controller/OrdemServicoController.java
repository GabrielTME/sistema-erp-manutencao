package com.seuorg.manutencao.ordensservico.controller;

import com.seuorg.manutencao.ordensservico.dto.*;
import com.seuorg.manutencao.ordensservico.service.OrdemServicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService service;

    public OrdemServicoController(OrdemServicoService service) { this.service = service; }

    @GetMapping
    public Page<OrdemServicoDTO> listar(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        return service.listar(page, size);
    }

    @GetMapping("/{id_os}")
    public OrdemServicoDTO buscar(@PathVariable("id_os") Long id) { return service.buscar(id); }

    @PostMapping
    public ResponseEntity<OrdemServicoDTO> criar(@Valid @RequestBody OrdemServicoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id_os}")
    public OrdemServicoDTO atualizar(@PathVariable("id_os") Long id, @Valid @RequestBody OrdemServicoUpdateDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id_os}")
    public ResponseEntity<Void> excluir(@PathVariable("id_os") Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // atribuir tecnicos (substitui a lista atual)
    @PostMapping("/{id_os}/tecnicos")
    public List<Long> atribuirTecnicos(@PathVariable("id_os") Long idOs, @RequestBody List<Long> tecnicos) {
        return service.atribuirTecnicos(idOs, tecnicos);
    }

    @GetMapping("/{id_os}/historico")
    public List<OsHistoricoDTO> listarHistorico(@PathVariable("id_os") Long idOs) {
        return service.listarHistorico(idOs);
    }

    @PostMapping("/{id_os}/historico")
    public ResponseEntity<OsHistoricoDTO> adicionarHistorico(@PathVariable("id_os") Long idOs, @RequestBody OsHistoricoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarHistorico(idOs, dto));
    }
}
