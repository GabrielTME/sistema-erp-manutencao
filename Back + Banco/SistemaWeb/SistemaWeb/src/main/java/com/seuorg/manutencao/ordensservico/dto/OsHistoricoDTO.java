package com.seuorg.manutencao.ordensservico.dto;

import java.util.Date;

public class OsHistoricoDTO {
    private Long id;
    private Long idOs;
    private Date dataEvento;
    private String status;
    private String descricao;

    public OsHistoricoDTO() {}

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
