# Registro de Alterações - 23/02/2026

Este documento detalha as atualizações realizadas na API do projeto **afiliado-ml** para otimização do motor de scraping e estabilização da infraestrutura.

## 🚀 Novas Funcionalidades e Melhorias

### 1. Motor de Scraping Inteligente (`api/services/scraping.js`)

- **Resolução de Redirecionamentos:** Adicionada lógica para resolver URLs encurtadas e links do tipo `/social/`. Agora o scraper segue o redirecionamento automaticamente para encontrar a URL final do produto antes de extrair o ID.
- **Regex Universal:** Atualização da captura de ID para suportar diferentes formatos de países (não apenas `MLB`).
- **Headers de Navegação:** Refinamento dos `browserHeaders` para reduzir bloqueios por parte do Mercado Livre.

### 2. Arquitetura do Controller (`api/controllers/scrapingController.js`)

- **Normalização de Dados:** Implementação de uma camada de tratamento que unifica os retornos polimórficos do serviço (JSON String, Array ou Object) em um formato padrão.
- **Cálculo de Metadados:** Adição de lógica para calcular automaticamente a porcentagem de desconto (`discount`) com base no preço atual e original.
- **Estrutura de Resposta Rica:** O JSON de retorno agora entrega:
  - Preços estruturados (Atual, Original, Desconto).
  - Descrição técnica formatada.
  - Lista de reviews (prova social) filtradas.
  - Status de rating e contagem de avaliações.

### 3. Estabilização da Infraestrutura (`api/models/index.js`)

- **Compatibilidade ESM:** Correção da instância do Sequelize para o padrão ECMAScript Modules (removido `.default`).
- **Dynamic Imports no Windows:** Ajuste no carregamento de modelos utilizando o protocolo `file://`, resolvendo erros de importação em ambiente Windows.
- **Segurança de Inicialização:** Adicionada verificação no controller para garantir que o sistema de banco de dados (se ativo) não cause falhas críticas se estiver offline.

## 🔧 Correções de Bugs (Bugfixes)

- **Erro "Product is not defined":** Resolvido através da correção da exportação do objeto `db` e desestruturação segura no controller.
- **Erro de ID não encontrado:** Corrigido para links que continham parâmetros complexos de rastreamento (escapamento de caracteres especiais).
- **Tratamento de Strings JSON:** Corrigido o erro onde o `JSON.parse` falhava quando o serviço retornava dados já parseados.

## 📋 Status Atual da API

- **Scraping Direto:** 100% Funcional para links de produtos diretos.
- **Banco de Dados:** Estrutura preparada para persistência (atualmente desativada conforme solicitado, mas configurada).
- **Conexão:** Testada e validada com sucesso via `curl` para produtos reais (Ex: Monitor AOC).

---

_Relatório gerado automaticamente por Gemini CLI._
