package com.seuorg.manutencao.equipamento.entity;

import com.seuorg.manutencao.marca.entity.Marca;
import jakarta.persistence.*;

@Entity
@Table(name = "equipamentos")
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipamento")
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String foto;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    public Equipamento() {}

    public Equipamento(Long id, String nome, String foto, Marca marca) {
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
    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }
}
