package com.seuorg.manutencao.itemestoque.subgrupo.dto;

public class ItemSubgrupoDTO {
    private Long id;
    private String nome;
    private Long idGrupo;
    private String nomeGrupo;

    public ItemSubgrupoDTO(Long id, String nome, Long idGrupo, String nomeGrupo) {
        this.id = id; this.nome = nome; this.idGrupo = idGrupo; this.nomeGrupo = nomeGrupo;
    }
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public Long getIdGrupo() { return idGrupo; }
    public String getNomeGrupo() { return nomeGrupo; }
}
