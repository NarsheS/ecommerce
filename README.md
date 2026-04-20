# Projeto de e-commerce

## Como instalar:
 Cada pasta tem uma parte que deve ser instalada com "npm i", então você deve:
 - Abrir acessar a pasta client (Front-end) via terminal e usar o comando "npm i" para instalar
as dependências, após isso, seguir as instruções do arquivo README.md na pasta client.

 - Abrir acessar a pasta server (Back-end) via terminal e usar o comando "npm i" para instalar
as dependências, após isso, seguir as instruções do arquivo README.md na pasta server.

## IMPORTANTE !!!!!!!!!!!!!!!!!!!!!!!!!!!
- A função "Dashboard" só pode ser acessada pelo Admin, logo para acessar o mesmo e suas funções, deve ser criado um usuário com a role de admin no banco de dados, do contrário a opção nem aparece e caso tente acessar diretamente, será redirecionado para a página principal. Recomendo criar um usuário normalmente, acessar o banco de dados e alterar a "ROLE" deste usuário específico para Admin.

- Em app.module.ts (server), usar "synchronize: false", caso esteja em produção e usar migrations.

## Sobre o projeto:
 O objetivo desse projeto era aprender mais sobre Nest e Next, e também sobre ferramentas como shadcn, o aplicativo é funcional e pensado para previnir alguns tipos de ataques, como: roubo de tokens, brute-force, e SQL injection, também contém criptografia de senhas e CORS. Não me recordo de todas as "defesas" ou funcionalidades que eu coloquei, com certeza é um projeto que ainda pode ser otimizado e polido para melhor eficiência, como também pode receber novas funções.
 Eu particularmente usei para este projeto: stripe, resend, supabase e cloudinary.