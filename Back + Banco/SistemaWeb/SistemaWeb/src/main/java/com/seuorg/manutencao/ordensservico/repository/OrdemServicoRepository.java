package com.seuorg.manutencao.ordensservico.repository;

import com.seuorg.manutencao.ordensservico.entity.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    // Conta quantas OS começam com determinado prefixo
    long countByNumeroOsStartingWith(String prefix);
}
