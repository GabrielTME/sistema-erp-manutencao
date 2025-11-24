package com.seuorg.manutencao.equipamento.service;

import com.seuorg.manutencao.equipamento.dto.*;
import com.seuorg.manutencao.equipamento.entity.Equipamento;
import com.seuorg.manutencao.equipamento.repository.EquipamentoRepository;
import com.seuorg.manutencao.marca.dto.MarcaDTO;
import com.seuorg.manutencao.marca.entity.Marca;
import com.seuorg.manutencao.marca.repository.MarcaRepository;
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
public class EquipamentoService {

    private final EquipamentoRepository repository;
    private final MarcaRepository marcaRepository;
    // Caminho da pasta onde as imagens serão salvas
    private final Path rootLocation = Paths.get("imagens");

    public EquipamentoService(EquipamentoRepository repository, MarcaRepository marcaRepository) {
        this.repository = repository;
        this.marcaRepository = marcaRepository;
        try {
            Files.createDirectories(rootLocation); // Cria a pasta se não existir
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o armazenamento de imagens", e);
        }
    }

    public Page<EquipamentoDTO> listar(int page, int size) {
        return repository.findAll(PageRequest.of(page, size))
                .map(this::converterParaDTO);
    }

    public EquipamentoDTO buscar(Long id) {
        Equipamento e = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Equipamento não encontrado"));
        return converterParaDTO(e);
    }

    // Método modificado para receber o arquivo MultipartFile
    public EquipamentoDTO criar(String nome, Long idMarca, MultipartFile arquivoFoto) {
        Marca marca = marcaRepository.findById(idMarca)
                .orElseThrow(() -> new NoSuchElementException("Marca não encontrada"));

        String urlFoto = salvarArquivo(arquivoFoto);

        Equipamento e = new Equipamento(null, nome, urlFoto, marca);
        repository.save(e);
        return converterParaDTO(e);
    }

    // Método modificado para atualização
    public EquipamentoDTO atualizar(Long id, String nome, Long idMarca, MultipartFile arquivoFoto) {
        Equipamento e = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Equipamento não encontrado"));
        
        e.setNome(nome);
        
        if (idMarca != null) {
            Marca marca = marcaRepository.findById(idMarca)
                    .orElseThrow(() -> new NoSuchElementException("Marca não encontrada"));
            e.setMarca(marca);
        }

        // Se enviou uma nova foto, substitui a url. Se não enviou, mantém a antiga.
        if (arquivoFoto != null && !arquivoFoto.isEmpty()) {
            String urlFoto = salvarArquivo(arquivoFoto);
            e.setFoto(urlFoto);
        }

        repository.save(e);
        return converterParaDTO(e);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id))
            throw new NoSuchElementException("Equipamento não encontrado");
        repository.deleteById(id);
    }

    // --- Métodos Auxiliares ---

    private EquipamentoDTO converterParaDTO(Equipamento e) {
        Marca m = e.getMarca();
        MarcaDTO marcaDTO = (m != null) 
            ? new MarcaDTO(m.getId(), m.getNome(), m.getEspecificacoes())
            : null;
            
        // Se a foto for um caminho local (/imagens/...), adiciona o domínio na frente para o Front
        String fotoUrl = e.getFoto();
        if (fotoUrl != null && !fotoUrl.startsWith("http")) {
            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            fotoUrl = baseUrl + fotoUrl;
        }

        return new EquipamentoDTO(e.getId(), e.getNome(), fotoUrl, marcaDTO);
    }

    private String salvarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) return null;

        try {
            // Gera nome único: "uuid_nomedoarquivo.jpg"
            String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            Files.copy(arquivo.getInputStream(), this.rootLocation.resolve(nomeArquivo));
            return "/imagens/" + nomeArquivo; // Salva o caminho relativo no banco
        } catch (IOException e) {
            throw new RuntimeException("Falha ao armazenar arquivo", e);
        }
    }
}
