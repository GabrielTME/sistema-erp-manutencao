package com.seuorg.manutencao.marca.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MarcaUpdateDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 120)
    private String name;

    @Size(max = 400)
    private String specifications;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }
}
