package com.seuorg.manutencao.tecnico.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tecnicos")
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tecnico")
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private TecnicoCategoria categoria;

    public Tecnico() {}

    public Tecnico(Long id, String nome, TecnicoCategoria categoria) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public TecnicoCategoria getCategoria() { return categoria; }
    public void setCategoria(TecnicoCategoria categoria) { this.categoria = categoria; }
}
