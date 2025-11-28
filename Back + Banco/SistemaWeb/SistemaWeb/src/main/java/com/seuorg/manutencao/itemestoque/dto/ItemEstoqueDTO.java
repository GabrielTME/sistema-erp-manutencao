package com.seuorg.manutencao.itemestoque.dto;

public class ItemEstoqueDTO {
    private Long id;
    private String nome;
    private String codigoProduto;
    private Integer quantidade;
    private Integer quantidadeEmEstoque;
    private Double valorUnitario;
    private String foto;
    
    // Dados de classificação
    private Long idSubgrupo;
    private String nomeSubgrupo;
    private Long idGrupo;
    private String nomeGrupo;

    public ItemEstoqueDTO(Long id, String nome, String codigoProduto, Integer quantidade, Integer quantidadeEmEstoque, Double valorUnitario, String foto, Long idSubgrupo, String nomeSubgrupo, Long idGrupo, String nomeGrupo) {
        this.id = id;
        this.nome = nome;
        this.codigoProduto = codigoProduto;
        this.quantidade = quantidade;
        this.quantidadeEmEstoque = quantidadeEmEstoque;
        this.valorUnitario = valorUnitario;
        this.foto = foto;
        this.idSubgrupo = idSubgrupo;
        this.nomeSubgrupo = nomeSubgrupo;
        this.idGrupo = idGrupo;
        this.nomeGrupo = nomeGrupo;
    }

    // Getters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCodigoProduto() { return codigoProduto; }
    public Integer getQuantidade() { return quantidade; }
    public Integer getQuantidadeEmEstoque() { return quantidadeEmEstoque; }
    public Double getValorUnitario() { return valorUnitario; }
    public String getFoto() { return foto; }
    public Long getIdSubgrupo() { return idSubgrupo; }
    public String getNomeSubgrupo() { return nomeSubgrupo; }
    public Long getIdGrupo() { return idGrupo; }
    public String getNomeGrupo() { return nomeGrupo; }
}
