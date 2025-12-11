# Server com Nestjs

- Registro de usuarios tem id, username, email, password.

- Login pode ser feito com username ou email, nomeei de identifier, então o input do usuário vai ser
um identifier e não email ou username.

- Lembrando que para os tokens funcionarem é necessario o prefixo: Bearer <token>

# Falta fazer
- Trocar para https quando pronto
- Nginx reverse proxy
- CSRF se for usar cookies


# Endpoints
-------------------------------------------------------------------------------------------
# Auth:
- POST - api/auth/register                          (Cria uma conta)
- POST - api/auth/login                             (Acessa uma conta por identificador - email/username)
- GET - api/auth/verify?token                       (Link para verificar conta)
- POST - api/auth/logout                            (Sair da conta)
- POST - api/auth/refresh                           (Resfresh token)

# Users:
- PATCH - api/users/update                          (Atualiza a própria conta)
- DELETE - api/users/remove                         (Deleta a própria conta)    
- DELETE - api/users/remove/:id                     (Deleta uma conta por id, somente admin)

# Address:
- GET - api/users/address                           (Lista todos os endereços do usuário)
- POST - api/users/address                          (Cria um endereço)
- PATCH - api/users/address/:addressId              (Atualiza um endereço)
- DELETE - api/users/address/:addressId             (Deleta um endereço)

# Category:
- POST - api/categories                             (Cria uma categoria)
- GET - api/categories                              (Lista todas as categorias criadas)
- DELETE - api/categories:id                        (Deleta uma categoria)

# Products:
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
- POST - api/discounts                              (Cria uma nova regra de desconto)
- GET - api/discounts                               (Lista todas as regras de desconto criadas)
- PUT - api/discounts/:id                           (Edita uma regra de desconto)
- DELETE - api/discounts/:id                        (Deleta uma regra de desconto)