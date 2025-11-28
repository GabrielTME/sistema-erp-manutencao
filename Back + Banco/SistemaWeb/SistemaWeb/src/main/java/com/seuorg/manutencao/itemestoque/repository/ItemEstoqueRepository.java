package com.seuorg.manutencao.itemestoque.repository;

import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque, Long> {
    // Busca o último item que começa com SRV para gerar o próximo código
    Optional<ItemEstoque> findTopByCodigoProdutoStartingWithOrderByIdDesc(String prefix);
}
