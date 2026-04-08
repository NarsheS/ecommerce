# Install everything:
- npm i

# Run client as dev:
- npm run dev


# !! QUALITY OF LIFE CHANGES !!
- calcular frete
- painel de controle - grafico de vendas (usando o stripe)
- comentarios e notas em produtos
- LoadingSpinner em verify.tsx
- pagina para tratar error 404 (talvez 500 tbm)

# Talvez:
- Painel de Controle (REMOVER QUALQUER CONTA - delete("users/remove/:id"))
- login com google (talvez)

# IMPORTANTE !!!!!!!!!!!!!!!!!!!!!!!!!!!
Em app.module.ts (server), tem que colocar synchronize: false, atualmente esta true pois estamos desenvolvendo e perder dados n tem tanta importancia


# Endpoint
- https://ecommerce-cyrl.onrender.com/api