package com.seuorg.manutencao.ordensservico.service;

import com.seuorg.manutencao.ordensservico.dto.*;
import com.seuorg.manutencao.ordensservico.entity.*;
import com.seuorg.manutencao.ordensservico.repository.*;
import com.seuorg.manutencao.tecnico.repository.TecnicoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepo;
    private final OsTecnicoRepository osTecnicoRepo;
    private final TecnicoRepository tecnicoRepo;
    private final OsHistoricoRepository historicoRepo;

    public OrdemServicoService(OrdemServicoRepository ordemRepo, OsTecnicoRepository osTecnicoRepo,
                               TecnicoRepository tecnicoRepo, OsHistoricoRepository historicoRepo) {
        this.ordemRepo = ordemRepo;
        this.osTecnicoRepo = osTecnicoRepo;
        this.tecnicoRepo = tecnicoRepo;
        this.historicoRepo = historicoRepo;
    }

    public Page<OrdemServicoDTO> listar(int page, int size) {
        return ordemRepo.findAll(PageRequest.of(page, size))
                .map(o -> {
                    OrdemServicoDTO dto = mapToDto(o);
                    // load tecnicos ids
                    dto.setTecnicos(osTecnicoRepo.findByIdOs(o.getId()).stream().map(OsTecnico::getIdTecnico).collect(Collectors.toList()));
                    return dto;
                });
    }

    public OrdemServicoDTO buscar(Long id) {
        OrdemServico o = ordemRepo.findById(id).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        OrdemServicoDTO dto = mapToDto(o);
        dto.setTecnicos(osTecnicoRepo.findByIdOs(o.getId()).stream().map(OsTecnico::getIdTecnico).collect(Collectors.toList()));
        return dto;
    }

    public OrdemServicoDTO criar(OrdemServicoCreateDTO dto) {
        OrdemServico o = new OrdemServico();
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

    public OrdemServicoDTO atualizar(Long id, OrdemServicoUpdateDTO dto) {
        OrdemServico o = ordemRepo.findById(id).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
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

    public void excluir(Long id) {
        if (!ordemRepo.existsById(id)) throw new NoSuchElementException("OS não encontrada");
        // delete os_tecnicos entries
        osTecnicoRepo.deleteByIdOs(id);
        ordemRepo.deleteById(id);
    }

    // replace technicians for an OS (idempotent)
    public List<Long> atribuirTecnicos(Long idOs, List<Long> tecnicosIds) {
        OrdemServico o = ordemRepo.findById(idOs).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        // remove existing
        osTecnicoRepo.deleteByIdOs(idOs);
        // validate and insert
        List<Long> inserted = tecnicosIds.stream().map(tid -> {
            if (!tecnicoRepo.existsById(tid)) throw new NoSuchElementException("Técnico não encontrado: " + tid);
            OsTecnico ot = new OsTecnico(idOs, tid);
            osTecnicoRepo.save(ot);
            return tid;
        }).collect(Collectors.toList());
        return inserted;
    }

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
        OrdemServico o = ordemRepo.findById(idOs).orElseThrow(() -> new NoSuchElementException("OS não encontrada"));
        OsHistorico h = new OsHistorico();
        h.setIdOs(idOs);
        h.setStatus(dto.getStatus());
        h.setDescricao(dto.getDescricao());
        historicoRepo.save(h);
        OsHistoricoDTO out = new OsHistoricoDTO();
        out.setId(h.getId());
        out.setIdOs(h.getIdOs());
        out.setDataEvento(h.getDataEvento());
        out.setStatus(h.getStatus());
        out.setDescricao(h.getDescricao());
        return out;
    }

    private OrdemServicoDTO mapToDto(OrdemServico o) {
        OrdemServicoDTO dto = new OrdemServicoDTO();
        dto.setId(o.getId());
        dto.setNumeroOs(o.getNumeroOs());
        dto.setIdEquipamento(o.getIdEquipamento());
        dto.setProblema(o.getProblema());
        dto.setDefeitoConstatado(o.getDefeitoConstatado());
        dto.setAcoesARealizar(o.getAcoesARealizar());
        dto.setStatus(o.getStatus());
        dto.setSetorLocalizacao(o.getSetorLocalizacao());
        dto.setDataEmissao(o.getDataEmissao());
        dto.setDataInicio(o.getDataInicio());
        dto.setDataFim(o.getDataFim());
        dto.setObservacoes(o.getObservacoes());
        return dto;
    }
}
