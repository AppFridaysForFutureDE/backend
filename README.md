# FFF App DE Backend

Dies ist das Backend der FFF App DE.

## Setup

1. [docker installieren](https://docs.docker.com/install/)
2. [docker-compose installieren](https://docs.docker.com/compose/install/)
3. [Node.js und npm installieren](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Dieses Repo lokal clonen
5. Ins Verzeichnis wechseln


## Server starten

* `docker-compose up` startet alle docker container

* `docker-compose up ghost` startet nur das CMS + mysql db (evtl relevant für frontend-entwickler)
* `docker-compose up express` startet nur den express server (main module) + mongo db


## Einrichten des CMS

Nach starten des docker containers kann das CMS unter folgender Adresse im Browser angezeigt werden:
[http://localhost:2368/]

Der Admin bereich ist erreichbar unter [http://localhost:2368/ghost]

Beim ersten Öffnen muss der Administrations-Account eingerichtet.
Anschließend können dort redaktionellen Beiträge verfasst und bearbeitet werden.


## Entwicklung

Das Repository ist folgendermaßen aufgebaut:

* Die verschiedenen Module/Services sind in docker-compose.yml aufgelistet
* Der Typescript Code für das Main Modul wird steckt im Ordner 'src'
  und wird automatisch in Javascript compiliert und im Ordner 'dist' gespeichert.


## Linter ausführen

ESLint ist ein Tool um Code zu analysieren bevor er ausgeführt wird.

`npm run lint`
