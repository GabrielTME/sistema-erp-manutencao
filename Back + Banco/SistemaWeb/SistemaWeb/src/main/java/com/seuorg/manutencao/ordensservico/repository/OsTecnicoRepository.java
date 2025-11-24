package com.seuorg.manutencao.ordensservico.repository;

import com.seuorg.manutencao.ordensservico.entity.OsTecnico;
import com.seuorg.manutencao.ordensservico.entity.OsTecnicoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OsTecnicoRepository extends JpaRepository<OsTecnico, OsTecnicoId> {
    List<OsTecnico> findByIdOs(Long idOs);
    void deleteByIdOs(Long idOs);
}
