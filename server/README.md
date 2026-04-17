# Server com Nestjs
Instalar dependências:
- npm i

Rodar servidor localmente:
- npm run start:dev

Para verificar se está rodando:
- Método GET para Debug (http://localhost/api/users/debug)
- Lembrete, para tokens funcionarem eles precisam do prefixo: Bearer <token>

# OBS: 
- Algumas funcionalidades podem não funcionar sem o client, já que isso foi pensado como uma parte de um todo.
- Para cálculo real do frete, é necessário a reconfiguração do shipping.service.ts, pois este precisa de uma API de terceiros para tal.
- A configuração do .env se faz necessária para executar o server sem erros


# .ENV
----------------------------------------------------------------------------------------------------------
# Porta
- PORT=3000

# Cookie
- NODE_ENV=production

# Info banco de dados postgres
- DB_HOST=???
- DB_PORT=???
- DB_USER=???
- DB_PASS=???
- DB_NAME=???

# Tokens
- JWT_SECRET=super_hyper_mega_secret_key
- JWT_EXPIRES_IN= Quanto tempo ate o token expirar
- REFRESH_TTL_DAYS= Quantos dias o refresh token dura

# Resend - emails
- RESEND_API_KEY=???
- MAIL_FROM=???
- APP_URL=???

# Stripe - payments
- FRONTEND_URL=???
- STRIPE_SECRET_KEY=???
- STRIPE_WEBHOOK_SECRET=???

# Cloudinary - images
- CLOUDINARY_NAME=???
- CLOUDINARY_KEY=???
- CLOUDINARY_SECRET=???

# BRUTEFORCE PROTECTION CONFIG VALUES
- MAX_ATTEMPTS=5
- WINDOW_MS=15
- LOCK_MS=15

# Endpoints
-------------------------------------------------------------------------------------------
# Auth:
# (identifier, password)

- POST - api/auth/register                          (Cria uma conta)
- POST - api/auth/login                             (Acessa uma conta por identificador - email/username)
- GET - api/auth/verify?token                       (Link para verificar conta)
- GET - api/auth/me                                 (Retorna a Role do usuário)
- POST - api/auth/logout                            (Sair da conta)
- POST - api/auth/refresh                           (Resfresh token)

# Users:
# (username, email, password)

- GET - api/users/debug                             (so pra ver se o server ta on)
- GET - api/users/me                                (perfil do usuario)
- PATCH - api/users/update                          (Atualiza a própria conta)
- DELETE - api/users/remove                         (Deleta a própria conta)    
- DELETE - api/users/remove/:id                     (Deleta uma conta por id, somente admin)

# Address:
# (street, number, city, state, zipcode)

- GET - api/users/address                           (Lista todos os endereços do usuário)
- POST - api/users/address                          (Cria um endereço)
- PATCH - api/users/address/:addressId              (Atualiza um endereço)
- DELETE - api/users/address/:addressId             (Deleta um endereço)

# Category: 
# (name)

- POST - api/categories                             (Cria uma categoria)
- GET - api/categories                              (Lista todas as categorias criadas)
- DELETE - api/categories/:id                        (Deleta uma categoria)


# Products: 
# (name, description, inStock?, price, category?, images?)

- POST - api/products                               (Cria um produto)
- POST - api/products/:productId/images             (Adiciona uma imagem a um produto)
- Delete - api/products/:productId/images/:imageId  (Remove uma imagem de um produto)
- Delete - api/products/:productId/images           (Remove todas as imagens de um produto)
- GET - api/products                                (Lista todos os produtos)
- GET - api/products/:id                            (Lista um produto)
- PUT - api/products/:id                            (Edita um produto)
- DELETE - api/products/:id                         (Deleta um produto)


# Cart:

- GET - api/cart                                    (Lista os itens do carrinho)
- POST - api/cart                                   (Adiciona um produto ao carrinho)
- DELETE - api/cart/:id                             (Remove um produto do carrinho)
- DELETE - api/cart                                 (Remove todos os itens do carrinho)


# Orders:

- POST - api/orders/checkout                        (Cria uma order)
- GET - api/orders                                  (Lista todas as orders do usuário)
- GET - api/orders/admin                            (Lista todas as orders no dashboard)
- Patch - api/orders/admin/:id/status               (Muda o estado do item)
- GET - api/orders/admin/:id                        (Informa os detalhes sobre o pedido)


# Payment:

- POST - api/payments/create/:orderId               (Cria um pagamento a ser feito a partir da order)
- POST - api/payments/webhook                       (Stripe webhook)


# Sales/Discount:
# (name, type, categoryId?, productId?, discountPercentage, startsAt?, endsAt?, priceMin?, active)

- POST - api/discounts                              (Cria uma nova regra de desconto)
- GET - api/discounts                               (Lista todas as regras de desconto criadas)
- PUT - api/discounts/:id                           (Edita uma regra de desconto)
- DELETE - api/discounts/:id                        (Deleta uma regra de desconto)

# banners:

- GET - api/banners                                 (Todos os banners)
- POST - api/banners                                (Adiciona um novo banner ao carrosel)
- PATCH - api/banners/:id                           (Atualiza um banner)
- DELETE - api/banners/:id                          (Deleta um banner)  

# analytics:

- GET - api/analytics/sales                         (Usado para vizualização de um gráfico de vendas)

# reports:

- GET - api/reports/orders/csv                      (cria um .csv com as últimas vendas realizadas) 