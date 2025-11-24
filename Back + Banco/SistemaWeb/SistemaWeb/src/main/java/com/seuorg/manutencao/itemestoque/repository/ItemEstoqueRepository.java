package com.seuorg.manutencao.itemestoque.repository;

import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque, Long> { }
