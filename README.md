<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## CFC Draw App (Server ) - Descripción


## Instalación

```bash
$ npm install
```

## Ejecución de la aplicación

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Comandos comunes de Prisma CLI
1. Create & Apply all migrations `npx prisma migrate dev`
2. Apply all migrations and create a new migration  
`npx prisma migrate dev --create-only`
3. Apply all migrations and create a new migration with custom name `npx prisma migrate dev --create-only --name "test"`

4. Apply all pending migrations, and creates the database if it does not exist. Primarily used in non-development environments. `npx prisma migrate deploy`
5. More info at [Prisma Migrate DOCS](https://www.prisma.io/docs/orm/prisma-migrate)
