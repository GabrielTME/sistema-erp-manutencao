package com.seuorg.manutencao.equipamento.repository;

import com.seuorg.manutencao.equipamento.entity.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> { }
