package com.seuorg.manutencao.equipamento.controller;

import com.seuorg.manutencao.equipamento.dto.EquipamentoDTO;
import com.seuorg.manutencao.equipamento.service.EquipamentoService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {

    private final EquipamentoService service;

    public EquipamentoController(EquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public Page<EquipamentoDTO> listar(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return service.listar(page, size);
    }

    @GetMapping("/{id_equipamento}")
    public EquipamentoDTO buscar(@PathVariable("id_equipamento") Long id) {
        return service.buscar(id);
    }

    // POST agora recebe MultipartFile e parametros via form-data
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquipamentoDTO> criar(
            @RequestParam("nome") String nome,
            @RequestParam("idMarca") Long idMarca,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(nome, idMarca, foto));
    }

    @PutMapping(value = "/{id_equipamento}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EquipamentoDTO atualizar(
            @PathVariable("id_equipamento") Long id,
            @RequestParam("nome") String nome,
            @RequestParam(value = "idMarca", required = false) Long idMarca,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
            
        return service.atualizar(id, nome, idMarca, foto);
    }

    @DeleteMapping("/{id_equipamento}")
    public ResponseEntity<Void> excluir(@PathVariable("id_equipamento") Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
