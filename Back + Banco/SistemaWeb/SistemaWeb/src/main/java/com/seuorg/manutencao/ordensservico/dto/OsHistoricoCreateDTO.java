package com.seuorg.manutencao.ordensservico.dto;

public class OsHistoricoCreateDTO {
    private String status;
    private String descricao;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
