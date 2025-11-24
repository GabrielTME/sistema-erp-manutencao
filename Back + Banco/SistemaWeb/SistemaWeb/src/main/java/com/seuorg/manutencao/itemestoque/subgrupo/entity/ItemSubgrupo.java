package com.seuorg.manutencao.itemestoque.subgrupo.entity;

import com.seuorg.manutencao.itemestoque.grupo.entity.ItemGrupo;
import jakarta.persistence.*;

@Entity
@Table(name = "item_subgrupos")
public class ItemSubgrupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_subgrupo")
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_grupo", nullable = false)
    private ItemGrupo grupo;

    public ItemSubgrupo() {}
    public ItemSubgrupo(Long id, String nome, ItemGrupo grupo) {
        this.id = id; this.nome = nome; this.grupo = grupo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public ItemGrupo getGrupo() { return grupo; }
    public void setGrupo(ItemGrupo grupo) { this.grupo = grupo; }
}
