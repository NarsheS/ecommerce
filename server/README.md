# Server com Nestjs
- npm run start:dev

- Lembrando que para os tokens funcionarem é necessario o prefixo: Bearer <token>

- Método GET para Debug adicionado em users para teste nginx (http://localhost/api/users/debug)

# Falta fazer
- Talvez adicionar redis para cache


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


# Payment:

- POST - api/payments/create/:orderId               (Cria um pagamento a ser feito a partir da order)
- POST - api/payments/webhook                       (Stripe webhook)


# Sales/Discount:
# (name, type, categoryId?, productId?, discountPercentage, startsAt?, endsAt?, priceMin?, active)

- POST - api/discounts                              (Cria uma nova regra de desconto)
- GET - api/discounts                               (Lista todas as regras de desconto criadas)
- PUT - api/discounts/:id                           (Edita uma regra de desconto)
- DELETE - api/discounts/:id                        (Deleta uma regra de desconto)