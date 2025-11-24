package com.seuorg.manutencao.ordensservico.entity;

import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import jakarta.persistence.*;

@Entity
@Table(name = "os_itens")
public class OsItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_os_item")
    private Long id;

    @Column(name = "id_os")
    private Long idOs;

    @ManyToOne
    @JoinColumn(name = "id_estoque_item")
    private ItemEstoque itemEstoque;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "valor_unitario", nullable = false)
    private Double valorUnitario;

    @Column(name = "valor_total", nullable = false)
    private Double valorTotal;

    public OsItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getIdOs() { return idOs; }
    public void setIdOs(Long idOs) { this.idOs = idOs; }
    public ItemEstoque getItemEstoque() { return itemEstoque; }
    public void setItemEstoque(ItemEstoque itemEstoque) { this.itemEstoque = itemEstoque; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public Double getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(Double valorUnitario) { this.valorUnitario = valorUnitario; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}
