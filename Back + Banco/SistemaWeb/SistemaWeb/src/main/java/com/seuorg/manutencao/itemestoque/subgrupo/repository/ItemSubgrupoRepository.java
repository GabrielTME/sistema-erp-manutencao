package com.seuorg.manutencao.itemestoque.subgrupo.repository;

import com.seuorg.manutencao.itemestoque.subgrupo.entity.ItemSubgrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemSubgrupoRepository extends JpaRepository<ItemSubgrupo, Long> {
    List<ItemSubgrupo> findByGrupoId(Long idGrupo);
}
