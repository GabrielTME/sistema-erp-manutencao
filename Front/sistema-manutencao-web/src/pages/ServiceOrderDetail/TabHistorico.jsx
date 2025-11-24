import React from 'react';

const TabHistorico = ({ history }) => {

    const getStatusTag = (status) => {
        switch (status) {
            case 'Abertura da O.S.':
                return <span className="status-tag opening">{status}</span>;
            case 'Enviado para Análise':
                return <span className="status-tag analysis">{status}</span>;
            case 'Em Andamento':
                return <span className="status-tag in-progress">{status}</span>;
            case 'Aguardando Peças':
                return <span className="status-tag pending-parts">{status}</span>;
            default:
                return <span className="status-tag">{status}</span>;
        }
    };

    return (
        <div className="tab-pane">
            <h3>Histórico de Status da Ordem de Serviço</h3>
            <div className="table-wrapper" style={{marginTop: '1rem'}}>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Status</th>
                            <th>Responsável</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.time}</td>
                                <td>{getStatusTag(entry.status)}</td>
                                <td>{entry.responsible}</td>
                                <td>{entry.observation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TabHistorico;
