package com.seuorg.manutencao.marca.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marcas")
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 120)
    private String nome;

    @Column(name = "especificacoes", length = 400)
    private String especificacoes;

    public Marca() {}

    public Marca(Long id, String nome, String especificacoes) {
        this.id = id;
        this.nome = nome;
        this.especificacoes = especificacoes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEspecificacoes() { return especificacoes; }
    public void setEspecificacoes(String especificacoes) { this.especificacoes = especificacoes; }

@OneToMany(mappedBy = "marca", cascade = CascadeType.ALL, orphanRemoval = true)
private java.util.List<com.seuorg.manutencao.equipamento.entity.Equipamento> equipamentos = new java.util.ArrayList<>();

public java.util.List<com.seuorg.manutencao.equipamento.entity.Equipamento> getEquipamentos() { return equipamentos; }
public void setEquipamentos(java.util.List<com.seuorg.manutencao.equipamento.entity.Equipamento> equipamentos) { this.equipamentos = equipamentos; }
}
