package com.seuorg.manutencao.ordensservico.dto;

public class OsItemCreateDTO {
    private Long idItemEstoque;
    private Integer quantidade;
    private Double valorPersonalizado; // Campo Novo

    public Long getIdItemEstoque() { return idItemEstoque; }
    public void setIdItemEstoque(Long idItemEstoque) { this.idItemEstoque = idItemEstoque; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public Double getValorPersonalizado() { return valorPersonalizado; }
    public void setValorPersonalizado(Double valorPersonalizado) { this.valorPersonalizado = valorPersonalizado; }
}
