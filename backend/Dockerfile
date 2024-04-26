## this is the stage one , also know as the build step

FROM node:lts-bullseye-slim as build

WORKDIR /usr/src/app

COPY .swcrc ./

RUN npm install @swc/core@1.3.105 @swc/cli@0.1.64

COPY package.json ./

COPY /src ./src

RUN npm run build

## this is stage two , where the app actually runs

FROM node:lts-bullseye-slim as prod

RUN apt-get update || : && apt-get install -y python3 build-essential

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --no-progress --omit=dev --no-audit

COPY /prisma .

RUN npx prisma generate

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8000

CMD npm run startprod
