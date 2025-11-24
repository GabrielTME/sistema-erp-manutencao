package com.seuorg.manutencao.ordensservico.service;

import com.seuorg.manutencao.equipamento.dto.EquipamentoDTO;
import com.seuorg.manutencao.equipamento.service.EquipamentoService;
import com.seuorg.manutencao.itemestoque.entity.ItemEstoque;
import com.seuorg.manutencao.itemestoque.repository.ItemEstoqueRepository;
import com.seuorg.manutencao.ordensservico.dto.*;
import com.seuorg.manutencao.ordensservico.entity.*;
import com.seuorg.manutencao.ordensservico.repository.*;
import com.seuorg.manutencao.tecnico.entity.Tecnico;
import com.seuorg.manutencao.tecnico.repository.TecnicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepo;
    private final OsTecnicoRepository osTecnicoRepo;
    private final TecnicoRepository tecnicoRepo;
    private final OsHistoricoRepository historicoRepo;
    private final EquipamentoService equipamentoService; // Para buscar dados do equipamento
    
    // Novos repositórios para itens
    private final OsItemRepository osItemRepo;
    private final ItemEstoqueRepository itemEstoqueRepo;

    public OrdemServicoService(OrdemServicoRepository ordemRepo, OsTecnicoRepository osTecnicoRepo,
                               TecnicoRepository tecnicoRepo, OsHistoricoRepository historicoRepo,
                               EquipamentoService equipamentoService, OsItemRepository osItemRepo,
                               ItemEstoqueRepository itemEstoqueRepo) {
        this.ordemRepo = ordemRepo;
        this.osTecnicoRepo = osTecnicoRepo;
        this.tecnicoRepo = tecnicoRepo;
        this.historicoRepo = historicoRepo;
        this.equipamentoService = equipamentoService;
        this.osItemRepo = osItemRepo;
        this.itemEstoqueRepo = itemEstoqueRepo;
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
        o.setNumeroOs(dto.getNumeroOs());
        o.setIdEquipamento(dto.getIdEquipamento());
        o.setProblema(dto.getProblema());
        o.setDefeitoConstatado(dto.getDefeitoConstatado());
        o.setAcoesARealizar(dto.getAcoesARealizar());
        o.setStatus(dto.getStatus());
        o.setSetorLocalizacao(dto.getSetorLocalizacao());
        o.setDataEmissao(new Date()); // Força data atual se vier nulo
        o.setDataInicio(dto.getDataInicio());
        o.setDataFim(dto.getDataFim());
        o.setObservacoes(dto.getObservacoes());
        ordemRepo.save(o);

        // Cria registro inicial no histórico
        criarHistoricoInterno(o.getId(), "OS Criada", "Ordem de serviço aberta com status " + dto.getStatus());

        return buscar(o.getId());
    }

    @Transactional
    public OrdemServicoDTO atualizar(Long id, OrdemServicoUpdateDTO dto) {
        OrdemServico o = ordemRepo.findById(id).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        
        // Verifica se houve mudança de status para logar no histórico
        if (dto.getStatus() != null && !dto.getStatus().equals(o.getStatus())) {
            criarHistoricoInterno(id, dto.getStatus(), "Status alterado de " + o.getStatus() + " para " + dto.getStatus());
        }

        o.setNumeroOs(dto.getNumeroOs());
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
        // TODO: Idealmente devolver itens ao estoque antes de excluir OS, mas simplificaremos
        ordemRepo.deleteById(id);
    }

    // --- TÉCNICOS ---
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

    // --- ITENS DA OS (PEÇAS) ---
    @Transactional
    public OsItemDTO adicionarItem(Long idOs, OsItemCreateDTO dto) {
        if (!ordemRepo.existsById(idOs)) throw new NoSuchElementException("OS não encontrada");
        
        ItemEstoque estoque = itemEstoqueRepo.findById(dto.getIdItemEstoque())
                .orElseThrow(() -> new NoSuchElementException("Item de estoque não encontrado"));

        // Valida Estoque
        if (estoque.getQuantidade() < dto.getQuantidade()) {
            throw new IllegalArgumentException("Estoque insuficiente. Disponível: " + estoque.getQuantidade());
        }

        // Baixa no Estoque
        estoque.setQuantidade(estoque.getQuantidade() - dto.getQuantidade());
        itemEstoqueRepo.save(estoque);

        // Cria Vínculo
        OsItem item = new OsItem();
        item.setIdOs(idOs);
        item.setItemEstoque(estoque);
        item.setQuantidade(dto.getQuantidade());
        item.setValorUnitario(estoque.getValorUnitario());
        item.setValorTotal(estoque.getValorUnitario() * dto.getQuantidade());
        
        osItemRepo.save(item);
        return mapItemToDto(item);
    }

    @Transactional
    public void removerItem(Long idOsItem) {
        OsItem item = osItemRepo.findById(idOsItem)
                .orElseThrow(() -> new NoSuchElementException("Item da OS não encontrado"));
        
        // Devolve ao Estoque
        ItemEstoque estoque = item.getItemEstoque();
        estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
        itemEstoqueRepo.save(estoque);

        osItemRepo.delete(item);
    }

    public List<OsItemDTO> listarItens(Long idOs) {
        return osItemRepo.findByIdOs(idOs).stream().map(this::mapItemToDto).collect(Collectors.toList());
    }

    // --- HISTÓRICO ---
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
        h.setDataEvento(new Date()); // Correção: Garante data atual
        historicoRepo.save(h);
        
        OsHistoricoDTO out = new OsHistoricoDTO();
        out.setId(h.getId());
        out.setIdOs(h.getIdOs());
        out.setDataEvento(h.getDataEvento());
        out.setStatus(h.getStatus());
        out.setDescricao(h.getDescricao());
        return out;
    }

    // --- MAPPERS ---
    private OrdemServicoDTO mapToDtoCompleto(OrdemServico o) {
        OrdemServicoDTO dto = new OrdemServicoDTO();
        dto.setId(o.getId());
        dto.setNumeroOs(o.getNumeroOs());
        dto.setIdEquipamento(o.getIdEquipamento());
        
        // Busca dados enriquecidos do equipamento
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
        
        // Busca IDs dos técnicos
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
