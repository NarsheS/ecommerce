Server com Nestjs

- Até o momento estamos usando sqlite e temos uma tabela chamada users.

- Endpoints começam com /api, exemplo: .../api/users/register, .../api/auth/login

- Registro de usuarios tem id, username, email, password.

- Login pode ser feito com username ou email, nomeei de identifier, então o input do usuário vai ser
um identifier e não email ou username.

- Lembrando que para os tokens funcionarem é necessario o prefixo: Bearer <token>

- Testar "addresses"
- adicionar updateUser