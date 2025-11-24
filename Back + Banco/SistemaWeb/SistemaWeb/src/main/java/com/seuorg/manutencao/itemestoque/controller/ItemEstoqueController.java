package com.seuorg.manutencao.itemestoque.controller;

import com.seuorg.manutencao.itemestoque.dto.ItemEstoqueDTO;
import com.seuorg.manutencao.itemestoque.service.ItemEstoqueService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/itens-estoque")
public class ItemEstoqueController {

    private final ItemEstoqueService service;

    public ItemEstoqueController(ItemEstoqueService service) {
        this.service = service;
    }

    @GetMapping
    public Page<ItemEstoqueDTO> listar(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return service.listar(page, size);
    }

    @GetMapping("/{id_item}")
    public ItemEstoqueDTO buscar(@PathVariable("id_item") Long id) {
        return service.buscar(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemEstoqueDTO> criar(
            @RequestParam("nome") String nome,
            @RequestParam("codigoProduto") String codigoProduto,
            @RequestParam("quantidade") Integer quantidade,
            @RequestParam("quantidadeEmEstoque") Integer quantidadeEmEstoque,
            @RequestParam("valorUnitario") Double valorUnitario,
            @RequestParam(value = "idSubgrupo", required = false) Long idSubgrupo,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(nome, codigoProduto, quantidade, quantidadeEmEstoque, valorUnitario, idSubgrupo, foto));
    }

    @PutMapping(value = "/{id_item}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ItemEstoqueDTO atualizar(
            @PathVariable("id_item") Long id,
            @RequestParam("nome") String nome,
            @RequestParam("codigoProduto") String codigoProduto,
            @RequestParam("quantidade") Integer quantidade,
            @RequestParam("quantidadeEmEstoque") Integer quantidadeEmEstoque,
            @RequestParam("valorUnitario") Double valorUnitario,
            @RequestParam(value = "idSubgrupo", required = false) Long idSubgrupo,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        return service.atualizar(id, nome, codigoProduto, quantidade, quantidadeEmEstoque, valorUnitario, idSubgrupo, foto);
    }

    @DeleteMapping("/{id_item}")
    public ResponseEntity<Void> excluir(@PathVariable("id_item") Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
