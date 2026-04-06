# Install everything:
- npm i

# Run client as dev:
- npm run dev


# Talvez:
- Painel de Controle (REMOVER QUALQUER CONTA - delete("users/remove/:id"))

!! QUALITY OF LIFE CHANGES !!
- criar slide de destaques com dashboard (Falta so o frontend, ja fiz o backend, porem o supabase pode reclamar)
- login com google (talvez)
- painel de controle - grafico de vendas (usando o stripe)
- LoadingSpinner em verify.tsx
- pagina para tratar error 404 (talvez 500 tbm)

# IMPORTANTE !!!!!!!!!!!!!!!!!!!!!!!!!!!
Em app.module.ts (server), tem que colocar synchronize: false, atualmente esta true pois estamos desenvolvendo e perder dados n tem tanta importancia


# Endpoint
- https://ecommerce-cyrl.onrender.com/api