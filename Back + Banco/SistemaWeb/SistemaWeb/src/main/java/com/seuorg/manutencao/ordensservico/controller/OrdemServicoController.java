package com.seuorg.manutencao.ordensservico.controller;

import com.seuorg.manutencao.ordensservico.dto.*;
import com.seuorg.manutencao.ordensservico.entity.OsImagem;
import com.seuorg.manutencao.ordensservico.service.OrdemServicoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService service;

    public OrdemServicoController(OrdemServicoService service) {
        this.service = service;
    }

    // Crud básico da OS

    @GetMapping
    public Page<OrdemServicoDTO> listar(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        return service.listar(page, size);
    }

    @GetMapping("/{id_os}")
    public OrdemServicoDTO buscar(@PathVariable("id_os") Long id) {
        return service.buscar(id);
    }

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

    // Técnicos

    @PostMapping("/{id_os}/tecnicos")
    public List<Long> atribuirTecnicos(@PathVariable("id_os") Long idOs, @RequestBody List<Long> tecnicos) {
        return service.atribuirTecnicos(idOs, tecnicos);
    }

    // Histórico

    @GetMapping("/{id_os}/historico")
    public List<OsHistoricoDTO> listarHistorico(@PathVariable("id_os") Long idOs) {
        return service.listarHistorico(idOs);
    }

    @PostMapping("/{id_os}/historico")
    public ResponseEntity<OsHistoricoDTO> adicionarHistorico(@PathVariable("id_os") Long idOs, @RequestBody OsHistoricoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarHistorico(idOs, dto));
    }

    // Itens

    @GetMapping("/{id_os}/itens")
    public List<OsItemDTO> listarItens(@PathVariable("id_os") Long idOs) {
        return service.listarItens(idOs);
    }

    @PostMapping("/{id_os}/itens")
    public ResponseEntity<OsItemDTO> adicionarItem(@PathVariable("id_os") Long idOs, @RequestBody OsItemCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarItem(idOs, dto));
    }

    @DeleteMapping("/itens/{id_os_item}")
    public ResponseEntity<Void> removerItem(@PathVariable("id_os_item") Long idOsItem) {
        service.removerItem(idOsItem);
        return ResponseEntity.noContent().build();
    }

    // Imagens

    @GetMapping("/{id_os}/imagens")
    public List<OsImagem> listarImagens(@PathVariable("id_os") Long idOs) {
        return service.listarImagens(idOs);
    }

    @PostMapping(value = "/{id_os}/imagens", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OsImagem> adicionarImagem(@PathVariable("id_os") Long idOs, 
                                                    @RequestParam("foto") MultipartFile foto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarImagem(idOs, foto));
    }

    @DeleteMapping("/imagens/{id_imagem}")
    public ResponseEntity<Void> removerImagem(@PathVariable("id_imagem") Long idImagem) {
        service.removerImagem(idImagem);
        return ResponseEntity.noContent().build();
    }
}
