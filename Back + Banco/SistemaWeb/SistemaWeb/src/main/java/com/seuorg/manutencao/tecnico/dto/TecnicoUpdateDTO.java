package com.seuorg.manutencao.tecnico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TecnicoUpdateDTO {
    @NotBlank
    private String nome;
    
    @NotNull
    private Long idCategoria;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }
}
