Bora, Vinicios! Aqui vai um resumão **completo, organizado e direto** de tudo que fizemos até agora nessa jornada épica de montar seu backend base 🔥

---

## 🧱 **1. Estrutura inicial do projeto**

* Escolhemos o **Fastify** como framework base (mais performático que Express)
* Usamos **TypeScript** desde o início
* Definimos uma estrutura de pastas organizada:

  ```
  src/
  ├─ routes/
  ├─ services/
  ├─ controllers/
  ├─ middlewares/
  ├─ plugins/
  ├─ utils/
  ├─ types/
  └─ config/
  ```

---

## 🛠️ **2. Setup das ferramentas principais**

* Instalamos e configuramos o **Fastify**
* Instalamos e configuramos o **Prisma** com PostgreSQL
* Criamos o `prismaClient` e modelos iniciais (`User`, depois `Account`)
* Aprendemos a usar o Prisma para criar usuários e consultar dados

---

## 🔐 **3. Autenticação com JWT**

* Criamos o fluxo de **registro** (`/register`)
* Criamos o fluxo de **login** (`/login`)
* Geramos **access token** com `jsonwebtoken`
* Criamos o **middleware `verifyJWT`** para proteger rotas privadas
* Tipamos corretamente o `request.user` com `fastify.d.ts`

---

## 🔁 **4. Refresh Token (modelo stateful)**

* Criamos o model `Account` para guardar **refresh tokens** no banco
* No login:

  * Geramos `accessToken` e `refreshToken` (UUID + DB)
* Criamos a rota `/refresh` que:

  * Recebe o refreshToken
  * Valida no banco
  * Retorna novo `accessToken`
* Criamos a rota `/logout` que:

  * Deleta o refresh token da tabela `Account`
* Entendemos como **revogar sessões** deletando tokens do banco
* Permitimos múltiplas sessões por usuário, com controle via DB

---

## 🧠 **5. Lógica de sessão no Frontend**

* O frontend guarda o `accessToken` e o `refreshToken`
* Quando uma requisição falha com 401:

  * Tenta `/refresh`
  * Se der certo, refaz a requisição original
  * Se falhar, força logout
* Criamos uma função `fetchWithAuth()` no frontend pra automatizar isso

---

## 🔐 **6. Controle de permissões**

* Criamos middleware `verifyRole` com array de roles permitidas
* Combinamos:

  * `app.addHook('preHandler', verifyJWT)` (protege grupo de rotas)
  * `preHandler: [verifyRole([role.admin])]` (protege rota específica)
* Permitimos aplicar segurança tanto global quanto granular

---

## 📚 **7. Swagger (documentação visual das rotas)**

* Instalamos `@fastify/swagger` e `@fastify/swagger-ui`
* Criamos um plugin `swaggerPlugin` para registrar Swagger
* Acessamos a doc em `http://localhost:3333/docs`
* Aprendemos a documentar rotas com:

  * `schema.body`, `schema.response`, `tags`, `summary`, etc

---

## 🧪 **8. Extras importantes**

* Configuramos **CORS** com `@fastify/cors` para aceitar requisições do front:

  ```ts
  await app.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true
  })
  ```


 

---

Next Missions ☑️

* [ ] Deploy (Railway, Render, VPS ou Docker)
* [ ] Rate limiting (anti-abuso)
* [ ] Upload de arquivos (se precisar)
* [ ] WebSockets / notificação (futuro)
* [ ] Testes automatizados

