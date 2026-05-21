# Blog Mobile - Tech Challenge Fase 4

App mobile de blogging desenvolvido em React Native com Expo, integrado a um ecossistema completo de back-end para gestão de postagens, estudantes e professores.

## Tecnologias

- React Native + Expo SDK 55
- React Navigation (Native Stack)
- Axios
- Context API (Autenticação Global)
- AsyncStorage

## Funcionalidades

- Listagem e busca de posts em tempo real
- Leitura de posts detalhados
- Login de professores com autenticação via JWT
- Painel Administrativo com restrição de rotas para professores autenticados
- CRUD completo de posts (exclusivo para professores)
- CRUD completo de professores e estudantes

---

## 🛠️ Setup do Ecossistema (Passo a Passo)

Para o funcionamento completo do aplicativo, é necessário que o back-end esteja rodando localmente em conjunto com o banco de dados.

### 1. Inicializando o Banco de Dados e o Back-End

O aplicativo consome a API do repositório secundário. Siga os passos abaixo na pasta do seu projeto de back-end (`tech-challenge-blog`):

1. **Iniciar o MongoDB:** Certifique-se de que o Docker Desktop está aberto e rode o comando para subir o contêiner do banco:
   ```bash
   docker compose up -d
   ```
   Instalar dependências do servidor:

```bash
npm install
```

Iniciar a API:

```bash
npm start
```

O servidor estará rodando na porta 3000 com a documentação ativa em http://localhost:3000/api-docs.

2. Inicializando o Front-End Mobile (Este Repositório)
   Após garantir que a API está respondendo com sucesso na porta 3000, inicialize o aplicativo:

Instale as dependências:

Bash
npm install
Inicie o Expo limpando o cache para evitar conflitos de rotas:

Bash
npx expo start -c
Pressione a tecla w no teclado para abrir o aplicativo diretamente no navegador Web (platform=web), ou escaneie o QR Code com o aplicativo Expo Go no celular (neste caso, lembre-se de ajustar a URL base no arquivo src/services/api.js para o IP da sua máquina).

🔐 Como Criar o Primeiro Professor (Para Testes de Login)
O banco de dados inicializa limpo. Para conseguir logar como professor e acessar o painel administrativo para criar ou editar postagens, você pode cadastrar um usuário rapidamente de duas formas:

Opção A: Pela Interface do Swagger (Recomendado 🚀)
A API conta com documentação OpenAPI 3.0 ativa. É a forma mais rápida de injetar um usuário:

Acesse http://localhost:3000/api-docs no seu navegador.

Expanda a aba Professores e clique no endpoint POST /teachers.

Clique em Try it out.

Edite os campos do JSON de exemplo com o e-mail e senha de sua preferência (ex: professor@fiap.com.br e senha123).

Clique em Execute. Se retornar o status 201, o usuário foi criado com sucesso.

Opção B: Via Postman / Insomnia
Caso prefira, faça uma requisição manual para a API:

Método: POST

URL: http://localhost:3000/teachers

Body (JSON):

JSON
{
"nome": "Professor Avaliador",
"email": "professor@fiap.com.br",
"senha": "senha123"
}
Após criar o usuário por qualquer um dos métodos acima, utilize as mesmas credenciais na tela de Acesso de Professor dentro do app mobile para liberar os recursos do painel administrativo.
