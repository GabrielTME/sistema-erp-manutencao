package com.seuorg.manutencao.tecnico.dto;

public class TecnicoCategoriaDTO {
    private Long id;
    private String nome;

    public TecnicoCategoriaDTO(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
}
