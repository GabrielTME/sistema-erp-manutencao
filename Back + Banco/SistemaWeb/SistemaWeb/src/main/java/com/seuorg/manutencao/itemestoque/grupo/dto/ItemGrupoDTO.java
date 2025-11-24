package com.seuorg.manutencao.itemestoque.grupo.dto;

public class ItemGrupoDTO {
    private Long id;
    private String nome;

    public ItemGrupoDTO(Long id, String nome) { this.id = id; this.nome = nome; }
    public Long getId() { return id; }
    public String getNome() { return nome; }
}
