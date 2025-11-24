package com.seuorg.manutencao.itemestoque.grupo.controller;

import com.seuorg.manutencao.itemestoque.grupo.dto.ItemGrupoDTO;
import com.seuorg.manutencao.itemestoque.grupo.service.ItemGrupoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estoque/grupos")
public class ItemGrupoController {
    private final ItemGrupoService service;
    public ItemGrupoController(ItemGrupoService service) { this.service = service; }

    @GetMapping
    public List<ItemGrupoDTO> listar() { return service.listar(); }

    @PostMapping
    public ItemGrupoDTO criar(@RequestBody Map<String, String> body) {
        return service.criar(body.get("nome"));
    }
    
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
