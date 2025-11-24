package com.seuorg.manutencao.ordensservico.dto;

import java.util.Date;
import java.util.List;

public class OrdemServicoDTO {
    private Long id;
    private String numeroOs;
    private Long idEquipamento;
    private String problema;
    private String defeitoConstatado;
    private String acoesARealizar;
    private String status;
    private String setorLocalizacao;
    private Date dataEmissao;
    private Date dataInicio;
    private Date dataFim;
    private String observacoes;
    private List<Long> tecnicos; // IDs dos técnicos alocados

    public OrdemServicoDTO() {}

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroOs() { return numeroOs; }
    public void setNumeroOs(String numeroOs) { this.numeroOs = numeroOs; }
    public Long getIdEquipamento() { return idEquipamento; }
    public void setIdEquipamento(Long idEquipamento) { this.idEquipamento = idEquipamento; }
    public String getProblema() { return problema; }
    public void setProblema(String problema) { this.problema = problema; }
    public String getDefeitoConstatado() { return defeitoConstatado; }
    public void setDefeitoConstatado(String defeitoConstatado) { this.defeitoConstatado = defeitoConstatado; }
    public String getAcoesARealizar() { return acoesARealizar; }
    public void setAcoesARealizar(String acoesARealizar) { this.acoesARealizar = acoesARealizar; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSetorLocalizacao() { return setorLocalizacao; }
    public void setSetorLocalizacao(String setorLocalizacao) { this.setorLocalizacao = setorLocalizacao; }
    public Date getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(Date dataEmissao) { this.dataEmissao = dataEmissao; }
    public Date getDataInicio() { return dataInicio; }
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }
    public Date getDataFim() { return dataFim; }
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public List<Long> getTecnicos() { return tecnicos; }
    public void setTecnicos(List<Long> tecnicos) { this.tecnicos = tecnicos; }
}
