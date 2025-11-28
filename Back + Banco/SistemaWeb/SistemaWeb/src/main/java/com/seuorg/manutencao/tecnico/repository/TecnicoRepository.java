package com.seuorg.manutencao.tecnico.repository;

import com.seuorg.manutencao.tecnico.entity.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, Long> {
}
