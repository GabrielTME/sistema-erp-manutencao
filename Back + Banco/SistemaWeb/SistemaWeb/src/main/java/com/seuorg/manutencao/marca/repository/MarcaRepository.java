package com.seuorg.manutencao.marca.repository;

import com.seuorg.manutencao.marca.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
}
