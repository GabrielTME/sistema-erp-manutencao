package com.seuorg.manutencao.tecnico.dto;

public class TecnicoDTO {
    private Long id;
    private String nome;
    private String especialidade; // Nome da categoria para exibição
    private Long idCategoria;     // ID pra formulários

    public TecnicoDTO(Long id, String nome, String especialidade, Long idCategoria) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
        this.idCategoria = idCategoria;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEspecialidade() { return especialidade; }
    public Long getIdCategoria() { return idCategoria; }
}
