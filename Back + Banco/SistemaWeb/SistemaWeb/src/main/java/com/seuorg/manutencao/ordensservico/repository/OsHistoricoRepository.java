package com.seuorg.manutencao.ordensservico.repository;

import com.seuorg.manutencao.ordensservico.entity.OsHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OsHistoricoRepository extends JpaRepository<OsHistorico, Long> {
    List<OsHistorico> findByIdOsOrderByDataEventoDesc(Long idOs);
}
