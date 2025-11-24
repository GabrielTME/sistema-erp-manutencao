package com.seuorg.manutencao.tecnico.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tecnico_categorias")
public class TecnicoCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    public TecnicoCategoria() {}

    public TecnicoCategoria(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
