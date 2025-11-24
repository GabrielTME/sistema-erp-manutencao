package com.seuorg.manutencao.ordensservico.entity;

import java.io.Serializable;
import java.util.Objects;

public class OsTecnicoId implements Serializable {
    private Long idOs;
    private Long idTecnico;

    public OsTecnicoId() {}
    public OsTecnicoId(Long idOs, Long idTecnico) { this.idOs = idOs; this.idTecnico = idTecnico; }

    public Long getIdOs() { return idOs; }
    public void setIdOs(Long idOs) { this.idOs = idOs; }
    public Long getIdTecnico() { return idTecnico; }
    public void setIdTecnico(Long idTecnico) { this.idTecnico = idTecnico; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OsTecnicoId)) return false;
        OsTecnicoId that = (OsTecnicoId) o;
        return Objects.equals(idOs, that.idOs) && Objects.equals(idTecnico, that.idTecnico);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idOs, idTecnico);
    }
}
