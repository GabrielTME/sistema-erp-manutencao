-- Auto-generated SQLite schema (best-effort) from JPA entity sources

CREATE TABLE IF NOT EXISTS "equipamentos" (
  "id_equipamento" INTEGER PRIMARY KEY AUTOINCREMENT,
  "nome" TEXT NOT NULL,
  "foto" TEXT,
  "id_marca" TEXT
);

CREATE TABLE IF NOT EXISTS "estoque_itens" (
  "id_item" INTEGER PRIMARY KEY AUTOINCREMENT,
  "nome" TEXT NOT NULL,
  "codigo_produto" TEXT NOT NULL,
  "quantidade" INTEGER NOT NULL,
  "quantidade_em_estoque" INTEGER NOT NULL,
  "valor_unitario" REAL NOT NULL,
  "foto" TEXT,
  "tipo" TEXT
);

CREATE TABLE IF NOT EXISTS "marcas" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "nome" TEXT NOT NULL,
  "especificacoes" TEXT
);

CREATE TABLE IF NOT EXISTS "tecnicos" (
  "id_tecnico" INTEGER PRIMARY KEY AUTOINCREMENT,
  "nome" TEXT NOT NULL,
  "especialidade" TEXT
);

CREATE TABLE IF NOT EXISTS "ordens_servico" (
  "id_os" INTEGER PRIMARY KEY AUTOINCREMENT,
  "numero_os" TEXT NOT NULL,
  "id_equipamento" INTEGER NOT NULL,
  "problema" TEXT,
  "defeito_constatado" TEXT,
  "acoes_a_realizar" TEXT,
  "status" TEXT,
  "setor_localizacao" TEXT,
  "data_emissao" TEXT,
  "data_inicio" TEXT,
  "data_fim" TEXT,
  "observacoes" TEXT
);

CREATE TABLE IF NOT EXISTS "os_historico" (
  "id_historico" INTEGER PRIMARY KEY AUTOINCREMENT,
  "id_os" INTEGER,
  "data_evento" TEXT,
  "status" TEXT,
  "descricao" TEXT
);

CREATE TABLE IF NOT EXISTS "os_tecnicos" (
  "id_os" INTEGER PRIMARY KEY AUTOINCREMENT,
  "id_tecnico" INTEGER PRIMARY KEY AUTOINCREMENT
);


-- Foreign key notes / manual adjustments:
-- NOTE: potential FK column equipamentos.id_marca references entity Marca
-- NOTE: potential FK column equipamentos.id_marca references entity Marca
-- Error executing: table "os_tecnicos" has more than one primary key
-- Statement:
CREATE TABLE IF NOT EXISTS "os_tecnicos" (
  "id_os" INTEGER PRIMARY KEY AUTOINCREMENT,
  "id_tecnico" INTEGER PRIMARY KEY AUTOINCREMENT
);

