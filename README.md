# Sistema de Análise de Dados para Indústria 4.0

Este projeto é um **dashboard** desenvolvido para a **Indústria 4.0**, com o objetivo de coletar dados de produção e máquinas de um sistema externo e exibir essas informações em gráficos interativos. Os dados incluem métricas de produção, eficiência das máquinas e **OEE** (Overall Equipment Effectiveness), previamente calculados pelo sistema externo.

## Tecnologias Utilizadas

- **Angular**: Framework utilizado seguindo o **paradigma MVC** para a criação de uma **Single Page Application (SPA)**.
- **Firebase OAuth 2**: Utilizado para autenticação de usuários via **Google**.
- **API RESTful**: Comunicação assíncrona com o backend para coleta de dados de produção e máquinas.
- **Chart.js**: Biblioteca para a construção de gráficos dinâmicos e interativos.
- **Firebase Authentication**: Integração para login e cadastro de usuários utilizando Google OAuth 2.
- **Sistema Web Assíncrono**: As interações com o servidor e a coleta de dados são feitas de forma assíncrona.

## Funcionalidades

- **Coleta de Dados**: Conecta-se a um sistema externo via API RESTful para obter informações sobre máquinas, produção e o cálculo de OEE.
- **Visualização Gráfica**: Exibe os dados em gráficos interativos utilizando **Chart.js**.
- **Autenticação de Usuários**: Permite login e cadastro de usuários utilizando autenticação via **Google OAuth 2** com o Firebase.
- **Sistema Assíncrono**: A aplicação funciona de forma assíncrona, proporcionando uma experiência de usuário mais fluida.

## Requisitos

- **Node.js**: Para rodar o ambiente Angular.
- **Angular CLI**: Para compilar e rodar a aplicação localmente.
- **Conta Firebase**: Para configurar a autenticação via Google.
- **API Externa**: Deve estar disponível para a coleta de dados de máquinas e produção (incluindo o cálculo de OEE).

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/FelipeSantw/Sistema-Analise-Dados-Industria.git
  ```

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.
