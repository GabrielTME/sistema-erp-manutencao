package com.seuorg.manutencao.itemestoque.grupo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "item_grupos")
public class ItemGrupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    public ItemGrupo() {}
    public ItemGrupo(Long id, String nome) { this.id = id; this.nome = nome; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
