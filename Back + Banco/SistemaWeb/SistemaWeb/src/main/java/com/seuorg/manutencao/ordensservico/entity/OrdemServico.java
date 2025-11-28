package com.seuorg.manutencao.ordensservico.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "ordens_servico")
public class OrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_os")
    private Long id;

    @Column(name = "numero_os", unique = true, nullable = false)
    private String numeroOs;

    @Column(name = "id_equipamento", nullable = false)
    private Long idEquipamento;

    @Column(name = "problema")
    private String problema;

    @Column(name = "defeito_constatado")
    private String defeitoConstatado;

    @Column(name = "acoes_a_realizar")
    private String acoesARealizar;

    @Column(name = "status")
    private String status;

    @Column(name = "setor_localizacao")
    private String setorLocalizacao;

    @Column(name = "data_emissao")
    private Date dataEmissao;

    @Column(name = "data_inicio")
    private Date dataInicio;

    @Column(name = "data_fim")
    private Date dataFim;

    @Column(name = "observacoes")
    private String observacoes;

    public OrdemServico() {}

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
}
