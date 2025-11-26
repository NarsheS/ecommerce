Server com Nestjs

- Até o momento estamos usando sqlite e temos uma tabela chamada users.

- Endpoints começam com /api, exemplo: .../api/users/register, .../api/auth/login

- Registro de usuarios tem id, username, email, password.

- Login pode ser feito com username ou email, nomeei de identifier, então o input do usuário vai ser
um identifier e não email ou username.

- Lembrando que para os tokens funcionarem é necessario o prefixo: Bearer <token>

- Realizar testes em TUDO
- Trocar para https quando pronto
- Nginx reverse proxy
- CSRF se for usar cookies

- Em teoria estamos 75% prontos, falta algumas coisas como payment, order status, admin privilege

Em seguida:
- Categorias
- Orders interativos (informar se ja saiu, esta pendente ou foi cancelado etc.)
- Implementar cookies, aparentemente refresh token é salvo nos cookies...