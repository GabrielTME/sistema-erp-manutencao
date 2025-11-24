package com.seuorg.manutencao.marca.dto;

public class MarcaDTO {
    private Long id;
    private String name;
    private String specifications;

    public MarcaDTO() {}

    public MarcaDTO(Long id, String name, String specifications) {
        this.id = id;
        this.name = name;
        this.specifications = specifications;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }
}
