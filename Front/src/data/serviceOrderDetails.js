export const serviceOrderDetailsData = {
  "OS-001": {
    id: "OS-001",
    status: "Aguardando Peças",
    technicians: ["João Silva", "Carlos Santos"],
    equipment: "Prensa Hidráulica PH-1000",
    occurrence: "Manutenção preventiva programada",
    problem: "Vazamento de óleo no sistema hidráulico",
    emissionDate: "15/01/2024",
    startDate: "15/01/2024",
    endDate: "",
    location: "Setor A - Bloco C",
    defectFound: "", 
    actionsToTake: "", 
    observations: "", 
    images: [],
    parts: [
      { id: "FLTRO001", description: "Filtro de óleo hidráulico", quantity: 2, unitValue: 45.50 },
      { id: "VEDACA002", description: "Vedação do cilindro", quantity: 1, unitValue: 128.75 },
      { id: "HORAS_TEC", description: "Horas Técnicas", quantity: 2, unitValue: 100.00 },
    ],
    statusHistory: [
      { date: "15/01/2024", time: "08:30", status: "Abertura da O.S.", responsible: "Sistema", observation: "Ordem de serviço criada automaticamente" },
      { date: "15/01/2024", time: "14:20", status: "Enviado para Análise", responsible: "João Silva", observation: "Encaminhado para análise técnica" },
      { date: "16/01/2024", time: "09:15", status: "Em Andamento", responsible: "Carlos Santos", observation: "Iniciado processo de manutenção" },
      { date: "16/01/2024", time: "16:45", status: "Aguardando Peças", responsible: "Carlos Santos", observation: "Aguardando chegada do filtro de óleo" },
    ]
  }
};
