# Product Microservice


## Dev

1. Clonar repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `.env.template`
4. Ejecutar migración de prisma `npx prisma migrate dev`
5. Levantar el servidor de NATS
```bash
docker run -d --name nats-server -p 4222:4222 -p 8223:8222 nats
```
6. Ejecutar `npm run start:dev`