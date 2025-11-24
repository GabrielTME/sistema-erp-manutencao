package com.seuorg.manutencao.ordensservico.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "os_historico")
public class OsHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Long id;

    @Column(name = "id_os")
    private Long idOs;

    @Column(name = "data_evento")
    private Date dataEvento;

    @Column(name = "status")
    private String status;

    @Column(name = "descricao")
    private String descricao;

    public OsHistorico() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdOs() { return idOs; }
    public void setIdOs(Long idOs) { this.idOs = idOs; }

    public Date getDataEvento() { return dataEvento; }
    public void setDataEvento(Date dataEvento) { this.dataEvento = dataEvento; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
