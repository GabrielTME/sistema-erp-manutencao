-- Rodar 1x no SQLite (externamente) para adicionar o campo especialidade em tecnicos
PRAGMA foreign_keys = ON;
ALTER TABLE tecnicos ADD COLUMN especialidade TEXT;
