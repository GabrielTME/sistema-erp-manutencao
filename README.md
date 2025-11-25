# 🛠️ Sistema de Manutenção — Backend + Frontend (Spring Boot, SQLite, React)

Este repositório contém o **backend (API REST)** desenvolvido em **Spring Boot + SQLite** e o **frontend** estruturado em **React + Vite**, compondo o Sistema de Manutenção para controle de equipamentos, técnicos, ordens de serviço e estoque.

---

# 📘 BACKEND — Spring Boot + SQLite

O backend implementa uma API RESTful completa, seguindo arquitetura em camadas (Controller, Service, Repository, Entity, DTO), com foco em clareza, extensibilidade e boas práticas.

---

## 🚀 Tecnologias Utilizadas (Backend)

- Java 17+
- Spring Boot
- Spring Data JPA
- SQLite
- Maven
- Arquitetura em camadas (SOLID)

---

## 📌 Funcionalidades do Backend

### 🔧 Equipamentos
- CRUD completo
- Associação com marcas

### 🧑‍🔧 Técnicos
- CRUD completo
- Filtro por especialidade com paginação

### 🛒 Itens de Estoque
- Cadastro, listagem e controle de quantidade/valor

### 🗂️ Ordens de Serviço
- Criação de O.S.
- Atribuição de técnicos
- Associação de equipamentos
- Alteração de status
- Adição de itens/peças
- Registro automático de histórico
- Datas automatizadas (início/fim)

---

## 🗄️ Banco de Dados

Conexão configurada em `application.properties`:

```
spring.datasource.url=jdbc:sqlite:./database.db?foreign_keys=on
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
server.port=8000
```

Arquivos importantes:

- `database.db` → Banco ativo utilizado pela API  
- `db/sqlite_schema_full.sql` → Estrutura completa do schema

---

## ▶️ Como Executar o Backend

Na pasta:

```
Back + Banco/SistemaWeb6/SistemaWeb
```

Execute:

```bash
mvn spring-boot:run
```

O backend sobe em:

👉 **http://localhost:8000**

---

# 📚 Documentação dos Endpoints

Base URL:

```
http://localhost:8000/api
```

---

## 🧩 Equipamentos

### GET /equipamentos  
Lista todos os equipamentos.

### POST /equipamentos
```json
{
  "nome": "Compressor",
  "foto": "img.png",
  "idMarca": 1
}
```

### PUT /equipamentos/{id}

### DELETE /equipamentos/{id}

---

## 🧩 Técnicos

### GET /tecnicos?page=0&size=10  
Paginação.

### GET /tecnicos?especialidade=eletrica  
Filtro por especialidade.

### POST /tecnicos
```json
{
  "nome": "Carlos",
  "especialidade": "Elétrica"
}
```

### PUT /tecnicos/{id}

### DELETE /tecnicos/{id}

---

## 🧩 Itens de Estoque

### GET /estoque

### POST /estoque
```json
{
  "nome": "Parafuso M10",
  "codigoProduto": "PRF10",
  "quantidade": 50,
  "quantidadeEmEstoque": 50,
  "valorUnitario": 0.80
}
```

---

## 🧩 Ordens de Serviço

### GET /ordens  
Lista todas.

### GET /ordens/{id}  
Detalhes completos.

### POST /ordens
```json
{
  "problema": "Falha no motor",
  "setorLocalizacao": "Linha 3",
  "idEquipamento": 1,
  "tecnicosIds": [1, 3]
}
```

### PUT /ordens/{id}/status
```json
{
  "novoStatus": "Concluído"
}
```

### POST /ordens/{id}/itens
```json
{
  "idEstoqueItem": 3,
  "quantidade": 2
}
```

---

# 🎨 FRONTEND — React + Vite

O frontend foi desenvolvido em React + Vite, com estrutura modular e integração via Axios com o backend.

---

## 🚀 Tecnologias Utilizadas (Frontend)

- React 18+
- Vite
- Axios
- React Router

---

## 📁 Estrutura Sugerida do Frontend

```
sistema-manutencao-web/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
```

---

## ▶️ Como Rodar o Frontend

Na pasta:

```bash
npm install
npm run dev
```

Acesse:

👉 http://localhost:5173

---

## 🔗 Integração com Backend

Arquivo sugerido `src/api/api.js`:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});
```

---

# 🧩 Próximas Melhorias

- Autenticação JWT  
- Relatórios  
- Dashboard com gráficos  
- Permissões por nível (admin/técnico)  
- Testes unitários e integração (JUnit + Mockito)

---

# 👤 Autor  
**Gabriel Tomé**
**Lucas Vitali Magenis**  
**Luiz Antônio Coral da Silva**  
**Tiago Fritzen Palácio**
Sistema de Manutenção — Engenharia de Software
