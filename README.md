# FFF App DE Backend

Dies ist das Backend der FFF App DE.

## Setup

1. [docker installieren](https://docs.docker.com/install/)
2. [docker-compose installieren](https://docs.docker.com/compose/install/)
3. [Node.js und npm installieren](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Dieses Repo lokal clonen
4. Ins Verzeichnis wechseln


## Entwicklung

* `docker-compose up` startet alle docker container

* `docker-compose up ghost` startet nur das CMS + mysql db (evtl relevant für frontend-entwickler)
* `docker-compose up express` startet nur den express server (main module) + mongo db

## Einrichten des CMS

Nach starten des docker containers kann das CMS unter folgender Adresse im Browser angezeigt werden:
[http://localhost:2368/]

Der Admin bereich ist erreichbar unter [http://localhost:2368/ghost]

Beim ersten Öffnen muss der Administrations-Account eingerichtet.
Anschließend können dort redaktionellen Beiträge verfasst und bearbeitet werden.

## Linter ausführen

ESLint ist ein Tool um Code zu analysieren bevor er ausgeführt wird.

`npm run lint`
