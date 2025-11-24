package com.seuorg.manutencao.itemestoque.subgrupo.controller;

import com.seuorg.manutencao.itemestoque.subgrupo.dto.ItemSubgrupoDTO;
import com.seuorg.manutencao.itemestoque.subgrupo.service.ItemSubgrupoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estoque/subgrupos")
public class ItemSubgrupoController {
    private final ItemSubgrupoService service;
    public ItemSubgrupoController(ItemSubgrupoService service) { this.service = service; }

    @GetMapping
    public List<ItemSubgrupoDTO> listar(@RequestParam(required = false) Long idGrupo) {
        return service.listarPorGrupo(idGrupo);
    }

    @PostMapping
    public ItemSubgrupoDTO criar(@RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        Long idGrupo = Long.valueOf(body.get("idGrupo").toString());
        return service.criar(nome, idGrupo);
    }
    
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
