Antifraude API

API backend desenvolvida em Node.js para análise antifraude baseada em regras, cálculo de score e classificação de risco.

O sistema recebe uma consulta, executa regras de validação, calcula um score de risco e classifica o resultado.

 -- Visão Geral --

O sistema segue uma arquitetura modular inspirada em Clean Architecture, separando:

Camada HTTP (Controller)

Camada de Aplicação (Service)

Domínio (Regras de negócio)

Infraestrutura (Repositories / Banco)

Utilitários

-- Arquitetura do Projeto --

src/
 ├── controllers/
 ├── services/
 ├── routes/ 
 ├── domain/
 |     ├── analysis
 │     ├── rules/
 │     ├── scoring/
 │     └── classification/
 ├── repositories/
 ├── config/
 ├── utils/
  Camadas da Aplicação
  Controller

Responsável por:

Receber requisições HTTP

Chamar o Service

Retornar resposta

Não contém regra de negócio.

-- Service --

Responsável por:

Orquestrar execução das regras

Calcular score

Classificar risco

Salvar dados no banco

Exemplo:
ConsultaService.criarConsulta()

 Domain (Regras de Negócio)

Contém:

CheckBlacklist

ScoreCalculator

RiskClassifier

Essa camada:

NÃO acessa banco

NÃO conhece HTTP

executa lógica pura

Exemplo de retorno de regra:

{
  regra: "CHECK_BLACKLIST",
  pontuacao: 120,
  mensagem: "Domínio presente na blacklist"
}

 Repository

Responsável por:

Comunicação com PostgreSQL

Execução de SQL

Somente aqui existe acesso ao banco.

-- Fluxo da Consulta -- 

Controller
   ↓
Service
   ↓
Executa Regras
   ↓
Calcula Score
   ↓
Classifica Risco
   ↓
Salva Consulta
   ↓
Salva Detalhes
   ↓
Retorna Resultado

 -- Requisitos --

Node.js 18+

PostgreSQL 14+

Verificar versão:

node -v

-- Instalação --

1. Clonar o projeto

git clone (https://github.com/Rafazxk/anti-fraude)

cd antifraude

2. Instalar dependências

npm install

3. Criar arquivo .env

PORT=3000
DATABASE_URL=

4. Rodar o servidor

node src/server.js


 -- Estrutura do Banco de Dados --

Tabela: users

user_id (UUID)

email (UNIQUE)

senha_hash

plano

data_criacao

Tabela: consultas

consulta_id

user_id (FK)

tipo_consulta

score_risco

resultado

Tabela: consulta_detalhes

id

consulta_id (FK)

regra_ativada

pontuacao

mensagem

risco

data_criacao

 -- Como Adicionar Nova Regra --

1. Criar nova regra em:

src/domain/rules/NovaRegra.js

Estrutura padrão:

class NovaRegra {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(dados) {
    const resultado = await this.repository.buscar(dados);

    if (!resultado) return null;

    return {
      regra: "NOVA_REGRA",
      pontuacao: 50,
      mensagem: "Descrição da regra"
    };
  }
}

export default NovaRegra;

2. Instanciar no ConsultaService:

const novaRegra = new NovaRegra(AlgumRepository);
const resultado = await novaRegra.execute(conteudo);

if (resultado) {
  regrasAtivadas.push(resultado);
}

Nunca altere:

ScoreCalculator

RiskClassifier

Estrutura das camadas

Apenas adicione novas regras.

-- Boas Práticas --

 Não colocar SQL no Domain
 Não colocar regra de negócio no Controller
 Não misturar nome de coluna com nome de regra
 Manter cada camada com responsabilidade única

-- Conceito Arquitetural --

Domain → logica pura

Service → coordenação

Repository → banco

Controller → HTTP

Se algo novo for adicionado, sempre pergunte:

 # Isso é regra de negócio ou infraestrutura?

 -- Possíveis Evoluções Futuras --

Motor automático de regras

Sistema de múltiplas regras dinâmicas

Autenticação JWT

Logs estruturados

Testes automatizados

Swagger para documentação de API

Deploy em ambiente cloud


 --Autor --
 
Desenvolvido por Rafael
Projeto focado em aprendizado avançado de backend e arquitetura de sistemas.








