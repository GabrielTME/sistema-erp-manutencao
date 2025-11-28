package com.seuorg.manutencao.ordensservico.service;

import com.seuorg.manutencao.equipamento.dto.EquipamentoDTO;
import com.seuorg.manutencao.equipamento.service.EquipamentoService;
import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import com.seuorg.manutencao.itemestoque.repository.ItemEstoqueRepository;
import com.seuorg.manutencao.ordensservico.dto.*;
import com.seuorg.manutencao.ordensservico.entity.*;
import com.seuorg.manutencao.ordensservico.repository.*;
import com.seuorg.manutencao.tecnico.repository.TecnicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepo;
    private final OsTecnicoRepository osTecnicoRepo;
    private final TecnicoRepository tecnicoRepo;
    private final OsHistoricoRepository historicoRepo;
    private final EquipamentoService equipamentoService;
    private final OsItemRepository osItemRepo;
    private final ItemEstoqueRepository itemEstoqueRepo;
    private final OsImagemRepository imagemRepo;
    
    private final Path rootLocation = Paths.get("imagens");

    public OrdemServicoService(OrdemServicoRepository ordemRepo, OsTecnicoRepository osTecnicoRepo,
                               TecnicoRepository tecnicoRepo, OsHistoricoRepository historicoRepo,
                               EquipamentoService equipamentoService, OsItemRepository osItemRepo,
                               ItemEstoqueRepository itemEstoqueRepo, OsImagemRepository imagemRepo) {
        this.ordemRepo = ordemRepo;
        this.osTecnicoRepo = osTecnicoRepo;
        this.tecnicoRepo = tecnicoRepo;
        this.historicoRepo = historicoRepo;
        this.equipamentoService = equipamentoService;
        this.osItemRepo = osItemRepo;
        this.itemEstoqueRepo = itemEstoqueRepo;
        this.imagemRepo = imagemRepo;
        
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o armazenamento de imagens", e);
        }
    }

    public Page<OrdemServicoDTO> listar(int page, int size) {
        return ordemRepo.findAll(PageRequest.of(page, size))
                .map(this::mapToDtoCompleto);
    }

    public OrdemServicoDTO buscar(Long id) {
        OrdemServico o = ordemRepo.findById(id).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        return mapToDtoCompleto(o);
    }

    @Transactional
    public OrdemServicoDTO criar(OrdemServicoCreateDTO dto) {
        OrdemServico o = new OrdemServico();
        
        // Geração automática de número
        SimpleDateFormat sdf = new SimpleDateFormat("ddMMyy");
        String prefixoData = "OS" + sdf.format(new Date());
        long countHoje = ordemRepo.countByNumeroOsStartingWith(prefixoData);
        String sequencial = String.format("%03d", countHoje + 1);
        o.setNumeroOs(prefixoData + sequencial);
        // ---

        o.setIdEquipamento(dto.getIdEquipamento());
        o.setProblema(dto.getProblema());
        o.setDefeitoConstatado(dto.getDefeitoConstatado());
        o.setAcoesARealizar(dto.getAcoesARealizar());
        o.setStatus(dto.getStatus());
        o.setSetorLocalizacao(dto.getSetorLocalizacao());
        o.setDataEmissao(new Date());
        o.setDataInicio(dto.getDataInicio());
        o.setDataFim(dto.getDataFim());
        o.setObservacoes(dto.getObservacoes());
        ordemRepo.save(o);

        criarHistoricoInterno(o.getId(), "O. S. criada", "Ordem de serviço aberta com status " + dto.getStatus());

        return buscar(o.getId());
    }

    @Transactional
    public OrdemServicoDTO atualizar(Long id, OrdemServicoUpdateDTO dto) {
        OrdemServico o = ordemRepo.findById(id).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        
        if (dto.getStatus() != null && !dto.getStatus().equals(o.getStatus())) {
            criarHistoricoInterno(id, dto.getStatus(), "Status alterado de " + o.getStatus() + " para " + dto.getStatus());
        }

        o.setIdEquipamento(dto.getIdEquipamento());
        o.setProblema(dto.getProblema());
        o.setDefeitoConstatado(dto.getDefeitoConstatado());
        o.setAcoesARealizar(dto.getAcoesARealizar());
        o.setStatus(dto.getStatus());
        o.setSetorLocalizacao(dto.getSetorLocalizacao());
        o.setDataEmissao(dto.getDataEmissao());
        o.setDataInicio(dto.getDataInicio());
        o.setDataFim(dto.getDataFim());
        o.setObservacoes(dto.getObservacoes());
        ordemRepo.save(o);
        return buscar(o.getId());
    }

    @Transactional
    public void excluir(Long id) {
        if (!ordemRepo.existsById(id)) throw new NoSuchElementException("OS não encontrada");
        osTecnicoRepo.deleteByIdOs(id);
        ordemRepo.deleteById(id);
    }

    // Técnicos
    @Transactional
    public List<Long> atribuirTecnicos(Long idOs, List<Long> tecnicosIds) {
        if (!ordemRepo.existsById(idOs)) throw new NoSuchElementException("OS não encontrada");
        osTecnicoRepo.deleteByIdOs(idOs);
        List<Long> inserted = tecnicosIds.stream().map(tid -> {
            if (!tecnicoRepo.existsById(tid)) throw new NoSuchElementException("Técnico não encontrado: " + tid);
            OsTecnico ot = new OsTecnico(idOs, tid);
            osTecnicoRepo.save(ot);
            return tid;
        }).collect(Collectors.toList());
        return inserted;
    }

    // Itens da O. S. (peças e serviços)
    @Transactional
    public OsItemDTO adicionarItem(Long idOs, OsItemCreateDTO dto) {
        if (!ordemRepo.existsById(idOs)) throw new NoSuchElementException("OS não encontrada");
        
        ItemEstoque estoque = itemEstoqueRepo.findById(dto.getIdItemEstoque())
                .orElseThrow(() -> new NoSuchElementException("Item de estoque não encontrado"));

        boolean isServico = "SERVICO".equals(estoque.getTipo());

        if (!isServico) {
            if (estoque.getQuantidade() < dto.getQuantidade()) {
                throw new IllegalArgumentException("Estoque insuficiente. Disponível: " + estoque.getQuantidade());
            }
            estoque.setQuantidade(estoque.getQuantidade() - dto.getQuantidade());
            itemEstoqueRepo.save(estoque);
        }

        Double precoFinal = (dto.getValorPersonalizado() != null) 
                            ? dto.getValorPersonalizado() 
                            : estoque.getValorUnitario();

        OsItem item = new OsItem();
        item.setIdOs(idOs);
        item.setItemEstoque(estoque);
        item.setQuantidade(dto.getQuantidade());
        item.setValorUnitario(precoFinal);
        item.setValorTotal(precoFinal * dto.getQuantidade());
        
        osItemRepo.save(item);
        return mapItemToDto(item);
    }

    @Transactional
    public void removerItem(Long idOsItem) {
        OsItem item = osItemRepo.findById(idOsItem)
                .orElseThrow(() -> new NoSuchElementException("Item da OS não encontrado"));
        
        ItemEstoque estoque = item.getItemEstoque();
        
        if (!"SERVICO".equals(estoque.getTipo())) {
            estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
            itemEstoqueRepo.save(estoque);
        }

        osItemRepo.delete(item);
    }

    public List<OsItemDTO> listarItens(Long idOs) {
        return osItemRepo.findByIdOs(idOs).stream().map(this::mapItemToDto).collect(Collectors.toList());
    }

    // Imagens
    public List<OsImagem> listarImagens(Long idOs) {
        return imagemRepo.findByIdOs(idOs).stream().map(img -> {
            if (img.getCaminho() != null && !img.getCaminho().startsWith("http")) {
                String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
                img.setCaminho(baseUrl + img.getCaminho());
            }
            return img;
        }).collect(Collectors.toList());
    }

    @Transactional
    public OsImagem adicionarImagem(Long idOs, MultipartFile arquivo) {
        if (!ordemRepo.existsById(idOs)) throw new NoSuchElementException("OS não encontrada");
        String urlFoto = salvarArquivo(arquivo);
        OsImagem img = new OsImagem(idOs, urlFoto);
        return imagemRepo.save(img);
    }

    @Transactional
    public void removerImagem(Long idImagem) {
        imagemRepo.deleteById(idImagem);
    }

    // Histórico
    public List<OsHistoricoDTO> listarHistorico(Long idOs) {
        return historicoRepo.findByIdOsOrderByDataEventoDesc(idOs).stream().map(h -> {
            OsHistoricoDTO dto = new OsHistoricoDTO();
            dto.setId(h.getId());
            dto.setIdOs(h.getIdOs());
            dto.setDataEvento(h.getDataEvento());
            dto.setStatus(h.getStatus());
            dto.setDescricao(h.getDescricao());
            return dto;
        }).collect(Collectors.toList());
    }

    public OsHistoricoDTO adicionarHistorico(Long idOs, OsHistoricoCreateDTO dto) {
        return criarHistoricoInterno(idOs, dto.getStatus(), dto.getDescricao());
    }

    private OsHistoricoDTO criarHistoricoInterno(Long idOs, String status, String descricao) {
        OsHistorico h = new OsHistorico();
        h.setIdOs(idOs);
        h.setStatus(status);
        h.setDescricao(descricao);
        h.setDataEvento(new Date());
        historicoRepo.save(h);
        
        OsHistoricoDTO out = new OsHistoricoDTO();
        out.setId(h.getId());
        out.setIdOs(h.getIdOs());
        out.setDataEvento(h.getDataEvento());
        out.setStatus(h.getStatus());
        out.setDescricao(h.getDescricao());
        return out;
    }

    // Mappers
    private String salvarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) return null;
        try {
            String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            Files.copy(arquivo.getInputStream(), this.rootLocation.resolve(nomeArquivo));
            return "/imagens/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }

    private OrdemServicoDTO mapToDtoCompleto(OrdemServico o) {
        OrdemServicoDTO dto = new OrdemServicoDTO();
        dto.setId(o.getId());
        dto.setNumeroOs(o.getNumeroOs());
        dto.setIdEquipamento(o.getIdEquipamento());
        
        try {
            EquipamentoDTO eq = equipamentoService.buscar(o.getIdEquipamento());
            dto.setNomeEquipamento(eq.getNome());
            dto.setFotoEquipamento(eq.getFoto());
        } catch (Exception e) {
            dto.setNomeEquipamento("Equipamento não encontrado");
        }

        dto.setProblema(o.getProblema());
        dto.setDefeitoConstatado(o.getDefeitoConstatado());
        dto.setAcoesARealizar(o.getAcoesARealizar());
        dto.setStatus(o.getStatus());
        dto.setSetorLocalizacao(o.getSetorLocalizacao());
        dto.setDataEmissao(o.getDataEmissao());
        dto.setDataInicio(o.getDataInicio());
        dto.setDataFim(o.getDataFim());
        dto.setObservacoes(o.getObservacoes());
        
        dto.setTecnicos(osTecnicoRepo.findByIdOs(o.getId()).stream().map(OsTecnico::getIdTecnico).collect(Collectors.toList()));
        
        return dto;
    }

    private OsItemDTO mapItemToDto(OsItem i) {
        return new OsItemDTO(
            i.getId(), i.getIdOs(), i.getItemEstoque().getId(), 
            i.getItemEstoque().getNome(), i.getQuantidade(), 
            i.getValorUnitario(), i.getValorTotal()
        );
    }
}
