package com.seuorg.manutencao.ordensservico.repository;

import com.seuorg.manutencao.ordensservico.entity.OsItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OsItemRepository extends JpaRepository<OsItem, Long> {
    List<OsItem> findByIdOs(Long idOs);
}
