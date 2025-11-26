package com.seuorg.manutencao.itemestoque.entity;

import com.seuorg.manutencao.itemestoque.subgrupo.entity.ItemSubgrupo;
import jakarta.persistence.*;

@Entity
@Table(name = "estoque_itens")
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "codigo_produto", nullable = false, unique = true)
    private String codigoProduto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "quantidade_em_estoque", nullable = false)
    private Integer quantidadeEmEstoque;

    @Column(name = "valor_unitario", nullable = false)
    private Double valorUnitario;

    private String foto;

    // CAMPO ADICIONADO DE VOLTA PARA O SISTEMA FUNCIONAR
    @Column(name = "tipo")
    private String tipo; // Pode ser "PRODUTO" ou "SERVICO"

    @ManyToOne
    @JoinColumn(name = "id_subgrupo")
    private ItemSubgrupo subgrupo;

    public ItemEstoque() {}

    public ItemEstoque(Long id, String nome, String codigoProduto, Integer quantidade, Integer quantidadeEmEstoque, Double valorUnitario, String foto, String tipo, ItemSubgrupo subgrupo) {
        this.id = id;
        this.nome = nome;
        this.codigoProduto = codigoProduto;
        this.quantidade = quantidade;
        this.quantidadeEmEstoque = quantidadeEmEstoque;
        this.valorUnitario = valorUnitario;
        this.foto = foto;
        this.tipo = tipo;
        this.subgrupo = subgrupo;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getCodigoProduto() { return codigoProduto; }
    public void setCodigoProduto(String codigoProduto) { this.codigoProduto = codigoProduto; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public Integer getQuantidadeEmEstoque() { return quantidadeEmEstoque; }
    public void setQuantidadeEmEstoque(Integer quantidadeEmEstoque) { this.quantidadeEmEstoque = quantidadeEmEstoque; }
    
    public Double getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(Double valorUnitario) { this.valorUnitario = valorUnitario; }
    
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    
    // Getter e Setter do TIPO (que corrigem o erro)
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public ItemSubgrupo getSubgrupo() { return subgrupo; }
    public void setSubgrupo(ItemSubgrupo subgrupo) { this.subgrupo = subgrupo; }
}
