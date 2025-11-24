package com.seuorg.manutencao.equipamento.dto;

import com.seuorg.manutencao.marca.dto.MarcaDTO;

public class EquipamentoDTO {
    private Long id;
    private String nome;
    private String foto;
    private MarcaDTO marca;

    public EquipamentoDTO() {}

    public EquipamentoDTO(Long id, String nome, String foto, MarcaDTO marca) {
        this.id = id;
        this.nome = nome;
        this.foto = foto;
        this.marca = marca;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public MarcaDTO getMarca() { return marca; }
    public void setMarca(MarcaDTO marca) { this.marca = marca; }
}
