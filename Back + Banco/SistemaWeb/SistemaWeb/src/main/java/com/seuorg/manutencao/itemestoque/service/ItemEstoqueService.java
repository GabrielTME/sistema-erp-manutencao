package com.seuorg.manutencao.itemestoque.service;

import com.seuorg.manutencao.itemestoque.dto.ItemEstoqueDTO;
import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import com.seuorg.manutencao.itemestoque.repository.ItemEstoqueRepository;
import com.seuorg.manutencao.itemestoque.subgrupo.entity.ItemSubgrupo;
import com.seuorg.manutencao.itemestoque.subgrupo.repository.ItemSubgrupoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class ItemEstoqueService {

    private final ItemEstoqueRepository repository;
    private final ItemSubgrupoRepository subgrupoRepository;
    private final Path rootLocation = Paths.get("imagens");

    public ItemEstoqueService(ItemEstoqueRepository repository, ItemSubgrupoRepository subgrupoRepository) {
        this.repository = repository;
        this.subgrupoRepository = subgrupoRepository;
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o armazenamento de imagens", e);
        }
    }

    private ItemEstoqueDTO toDTO(ItemEstoque i) {
        String fotoUrl = i.getFoto();
        if (fotoUrl != null && !fotoUrl.startsWith("http")) {
            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            fotoUrl = baseUrl + fotoUrl;
        }

        ItemSubgrupo sub = i.getSubgrupo();
        return new ItemEstoqueDTO(
            i.getId(), i.getNome(), i.getCodigoProduto(), i.getQuantidade(),
            i.getQuantidadeEmEstoque(), i.getValorUnitario(), fotoUrl,
            sub != null ? sub.getId() : null,
            sub != null ? sub.getNome() : null,
            (sub != null && sub.getGrupo() != null) ? sub.getGrupo().getId() : null,
            (sub != null && sub.getGrupo() != null) ? sub.getGrupo().getNome() : null
        );
    }

    public Page<ItemEstoqueDTO> listar(int page, int size) {
        return repository.findAll(PageRequest.of(page, size)).map(this::toDTO);
    }

    public ItemEstoqueDTO buscar(Long id) {
        ItemEstoque i = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Item não encontrado"));
        return toDTO(i);
    }

    public ItemEstoqueDTO criar(String nome, String codigo, Integer qtd, Integer qtdMin, Double valor, Long idSubgrupo, MultipartFile arquivo) {
        ItemSubgrupo sub = null;
        if (idSubgrupo != null) {
            sub = subgrupoRepository.findById(idSubgrupo).orElseThrow(() -> new NoSuchElementException("Subgrupo não encontrado"));
        }

        String urlFoto = salvarArquivo(arquivo);

        // CORREÇÃO AQUI: Adicionado "PRODUTO" no construtor
        ItemEstoque item = new ItemEstoque(null, nome, codigo, qtd, qtdMin, valor, urlFoto, "PRODUTO", sub);
        
        repository.save(item);
        return toDTO(item);
    }

    public ItemEstoqueDTO atualizar(Long id, String nome, String codigo, Integer qtd, Integer qtdMin, Double valor, Long idSubgrupo, MultipartFile arquivo) {
        ItemEstoque item = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Item não encontrado"));

        item.setNome(nome);
        item.setCodigoProduto(codigo);
        item.setQuantidade(qtd);
        item.setQuantidadeEmEstoque(qtdMin);
        item.setValorUnitario(valor);

        if (idSubgrupo != null) {
            ItemSubgrupo sub = subgrupoRepository.findById(idSubgrupo)
                    .orElseThrow(() -> new NoSuchElementException("Subgrupo não encontrado"));
            item.setSubgrupo(sub);
        }

        if (arquivo != null && !arquivo.isEmpty()) {
            item.setFoto(salvarArquivo(arquivo));
        }

        repository.save(item);
        return toDTO(item);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) throw new NoSuchElementException("Item não encontrado");
        repository.deleteById(id);
    }

    private String salvarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) return null;
        try {
            String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            Files.copy(arquivo.getInputStream(), this.rootLocation.resolve(nomeArquivo));
            return "/imagens/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar foto", e);
        }
    }
}
