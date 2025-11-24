package com.seuorg.manutencao.ordensservico.dto;

public class OsItemDTO {
    private Long id;
    private Long idOs;
    private Long idItemEstoque;
    private String nomeItem; // Importante para exibir na tela
    private Integer quantidade;
    private Double valorUnitario;
    private Double valorTotal;

    public OsItemDTO() {}
    // Construtor completo
    public OsItemDTO(Long id, Long idOs, Long idItemEstoque, String nomeItem, Integer quantidade, Double valorUnitario, Double valorTotal) {
        this.id = id; this.idOs = idOs; this.idItemEstoque = idItemEstoque; this.nomeItem = nomeItem;
        this.quantidade = quantidade; this.valorUnitario = valorUnitario; this.valorTotal = valorTotal;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getIdOs() { return idOs; }
    public void setIdOs(Long idOs) { this.idOs = idOs; }
    public Long getIdItemEstoque() { return idItemEstoque; }
    public void setIdItemEstoque(Long idItemEstoque) { this.idItemEstoque = idItemEstoque; }
    public String getNomeItem() { return nomeItem; }
    public void setNomeItem(String nomeItem) { this.nomeItem = nomeItem; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public Double getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(Double valorUnitario) { this.valorUnitario = valorUnitario; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}
