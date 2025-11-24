package com.seuorg.manutencao.ordensservico.entity;

import jakarta.persistence.*;

@Entity
@IdClass(OsTecnicoId.class)
@Table(name = "os_tecnicos")
public class OsTecnico {

    @Id
    @Column(name = "id_os")
    private Long idOs;

    @Id
    @Column(name = "id_tecnico")
    private Long idTecnico;

    public OsTecnico() {}
    public OsTecnico(Long idOs, Long idTecnico) { this.idOs = idOs; this.idTecnico = idTecnico; }

    public Long getIdOs() { return idOs; }
    public void setIdOs(Long idOs) { this.idOs = idOs; }
    public Long getIdTecnico() { return idTecnico; }
    public void setIdTecnico(Long idTecnico) { this.idTecnico = idTecnico; }
}
