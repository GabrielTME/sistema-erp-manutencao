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
    private Integer quantidade; // Quantidade atual física

    @Column(name = "quantidade_em_estoque", nullable = false)
    private Integer quantidadeEmEstoque; // Quantidade mínima ou ideal (depende da sua regra, mas mantive o nome do banco)

    @Column(name = "valor_unitario", nullable = false)
    private Double valorUnitario;

    private String foto; // Caminho da foto (/imagens/...)

    @ManyToOne
    @JoinColumn(name = "id_subgrupo")
    private ItemSubgrupo subgrupo;

    public ItemEstoque() {}

    public ItemEstoque(Long id, String nome, String codigoProduto, Integer quantidade, Integer quantidadeEmEstoque, Double valorUnitario, String foto, ItemSubgrupo subgrupo) {
        this.id = id;
        this.nome = nome;
        this.codigoProduto = codigoProduto;
        this.quantidade = quantidade;
        this.quantidadeEmEstoque = quantidadeEmEstoque;
        this.valorUnitario = valorUnitario;
        this.foto = foto;
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
    public ItemSubgrupo getSubgrupo() { return subgrupo; }
    public void setSubgrupo(ItemSubgrupo subgrupo) { this.subgrupo = subgrupo; }
}
