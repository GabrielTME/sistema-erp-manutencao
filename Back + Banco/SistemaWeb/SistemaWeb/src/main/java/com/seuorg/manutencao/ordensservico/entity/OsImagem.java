package com.seuorg.manutencao.ordensservico.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "os_imagens")
public class OsImagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_os")
    private Long idOs;

    private String caminho; // URL/path da foto

    public OsImagem() {}
    public OsImagem(Long idOs, String caminho) { this.idOs = idOs; this.caminho = caminho; }

    public Long getId() { return id; }
    public Long getIdOs() { return idOs; }
    public String getCaminho() { return caminho; }
    public void setCaminho(String caminho) { this.caminho = caminho; }
}
