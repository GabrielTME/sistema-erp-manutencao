package com.seuorg.manutencao.itemestoque.service;

import com.seuorg.manutencao.itemestoque.dto.ItemEstoqueDTO;
import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import com.seuorg.manutencao.itemestoque.repository.ItemEstoqueRepository;
import org.springframework.stereotype.Service;

@Service
public class ServicoService {

    private final ItemEstoqueRepository repository;

    public ServicoService(ItemEstoqueRepository repository) {
        this.repository = repository;
    }

    public ItemEstoqueDTO criarServico(String nome) {
        // 1. Gera o código SRV sequencial
        String novoCodigo = gerarProximoCodigoSRV();

        // 2. Cria o item
        ItemEstoque servico = new ItemEstoque();
        servico.setNome(nome);
        servico.setCodigoProduto(novoCodigo);
        servico.setQuantidade(999999); // Estoque infinito fictício
        servico.setQuantidadeEmEstoque(0);
        servico.setValorUnitario(0.0); // Valor base é 0, será definido na hora da OS
        servico.setTipo("SERVICO");    // Marcação para o Front saber que é serviço
        
        // Opcional: Se quiser vincular a um grupo padrão, pode fazer aqui
        // servico.setSubgrupo(...);

        repository.save(servico);
        return mapToDTO(servico);
    }

    private String gerarProximoCodigoSRV() {
        return repository.findTopByCodigoProdutoStartingWithOrderByIdDesc("SRV")
                .map(item -> {
                    String codigoAtual = item.getCodigoProduto(); // Ex: SRV005
                    try {
                        int numero = Integer.parseInt(codigoAtual.substring(3)); // Pega o 005
                        return String.format("SRV%03d", numero + 1); // Retorna SRV006
                    } catch (NumberFormatException e) {
                        return "SRV001"; // Fallback
                    }
                })
                .orElse("SRV001"); // Se não existir nenhum, começa com 001
    }

    private ItemEstoqueDTO mapToDTO(ItemEstoque i) {
        // Reaproveita o DTO existente (simplificado aqui)
        return new ItemEstoqueDTO(
            i.getId(), i.getNome(), i.getCodigoProduto(), 
            i.getQuantidade(), i.getQuantidadeEmEstoque(), 
            i.getValorUnitario(), i.getFoto(), 
            null, null, null, null
        );
    }
}
