package com.seuorg.manutencao.ordensservico.repository;

import com.seuorg.manutencao.ordensservico.entity.OsImagem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OsImagemRepository extends JpaRepository<OsImagem, Long> {
    List<OsImagem> findByIdOs(Long idOs);
}
