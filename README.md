# CodeClash 🚀

**CodeClash** é mais do que uma plataforma para praticar programação — é um **estudo prático de arquitetura de software**.  
Construído com **.NET 9** e **React**, o projeto combina resolução de problemas algorítmicos com feedback instantâneo e uma biblioteca de **códigos-modelo clássicos**, como estruturas de dados, ordenação e outros algoritmos fundamentais.  

---

### ✨ Funcionalidades Principais

- **Submissão de Código**: resolva problemas em C#, Python, Java ou C++ com validação automática contra múltiplos casos de teste. O feedback inclui erros de compilação, tempo de execução e corretude da saída.  
- **Arena de Problemas**: explore desafios de diferentes dificuldades e categorias, e acompanhe suas soluções submetidas.  
- **Biblioteca de Códigos**: navegue por uma árvore hierárquica de algoritmos e estruturas de dados, organizada por linguagem e categoria.  
- **Recomendações Inteligentes**: receba sugestões de algoritmos relacionados ao código que você envia.  
- **Autenticação e Perfil**: crie sua conta, faça login e acompanhe seu progresso e pontuação total.  

---

### 🏛️ Arquitetura e Padrões de Projeto

O backend foi desenvolvido com foco em **código limpo** e aplicação de **padrões clássicos de projeto**:

- **Strategy**: alterna dinamicamente o comportamento da submissão (execução simples x múltiplos testes).  
- **Observer**: notifica automaticamente ranking, perfil e frontend após uma submissão.  
- **Builder + Director**: constrói `SubmissionRequest` passo a passo, facilitando requisições comuns.  
- **Chain of Responsibility**: trata cada status da Judge0 em uma cadeia limpa e extensível.  
- **Composite**: organiza a biblioteca de códigos como uma árvore (categorias e algoritmos).  
- **Facade**: simplifica o fluxo de submissão escondendo a complexidade interna.  

---

### 🛠️ Tecnologias Utilizadas

| Categoria            | Tecnologia                                |
| -------------------- | ----------------------------------------- |
| **Backend**          | C# com ASP.NET Core (.NET 9)              |
| **Frontend**         | React, TypeScript, Vite                   |
| **Banco de Dados**   | PostgreSQL com Entity Framework Core       |
| **Execução de Código**| API Externa Judge0                        |
| **Estilização**      | Tailwind CSS                              |
| **Editor de Código** | Monaco Editor                             |
| **Autenticação**     | JWT (JSON Web Tokens)                      |

---

### 📌 Status do Projeto

Este projeto foi desenvolvido como um **estudo acadêmico** e um **exercício prático de arquitetura de software**.  
O foco principal está na **estrutura e aplicação de conceitos de engenharia de software**, e não em oferecer suporte oficial ou documentação completa de instalação.  

Ainda assim, o código-fonte está disponível para exploração, aprendizado e como referência para outros projetos.  

---
