# FFF App DE Backend

Dies ist das Backend der FFF App DE.

## Setup

1. [docker installieren](https://docs.docker.com/install/)
2. [docker-compose installieren](https://docs.docker.com/compose/install/)
3. [Node.js und npm installieren](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Dieses Repo lokal clonen
5. Ins Verzeichnis wechseln
6. Die Datei `.env.example` kopieren und umbenennen in `.env` und einen anderen Entwickler nach den Werten fragen (Alternativ: vom Server herunterladen)


## Entwicklungsserver starten

* `docker-compose up` startet alle docker container

* `docker-compose up ghost` startet nur das CMS + mysql db (evtl relevant für frontend-entwickler)
* `docker-compose up express` startet nur den express server (main module) + mongo db


## Einrichten des CMS

Nach Starten des docker containers kann das CMS unter folgender Adresse im Browser angezeigt werden:
[http://localhost:2368/]

Der Adminbereich ist erreichbar unter [http://localhost:2368/ghost]

Beim ersten Öffnen muss der Administrations-Account eingerichtet.
Anschließend können dort redaktionellen Beiträge verfasst und bearbeitet werden.


## Entwicklung

Das Repository ist folgendermaßen aufgebaut:

* Die verschiedenen Module/Services sind in docker-compose.yml aufgelistet
* Der Typescript Code steckt im Ordner 'src' und wird automatisch in Javascript compiliert und im Ordner 'dist' gespeichert.


## Linter ausführen

ESLint ist ein Tool um Statische Code Analysen durchzuführen.

`npm run lint`


Mit diesem Befehl wird die automatische Code Korrektur gestartet:

`npm run lint-fix`

## Automatische Tests

`npm run test`

## Manuelles Testen

Nach Starten des docker containers kann die API mit Hilfe eines REST-Clients getestet werden (z.B. mit Insomnia)

Die Erreichbarkeit des Servers bzw. die Funktionalität der API kann beispielsweise durch eine GET Request an die Adresse `http://localhost:3000/api/v1/ogs` getestet werden.


## Produktivumgebung

In der Produktivumgebung soll unser Server möglichst klein (ohne dev-Abhängigkeiten) und stabil sein (kein automatischer Restart bei code änderungen)

Aus diesem Grund verwenden wir:
* ein anderes Dockerfile
* eine zusätzliche Konfiguration für docker-compose

Um unsere Services auf dem Produktions-Server zu starten, sollten folgende Befehle verwendet werden:

```
// Das Docker Image muss bei Code-Änderungen neu gebaut werden
docker-compose -f docker-compose.yml -f docker-compose-prod.yml build --no-cache

// Mit diesem Setup wird der express server ohne nodemon und dev-dependencies gestartet (und auch die anderen services)
docker-compose -f docker-compose.yml -f docker-compose-prod.yml up -d
```

Troubleshooting:

Eventuell hilft es bei Problemen einmal `npm install` auf dem Server auszuführen.
Falls nichts hilft, geht auch ein einfaches `docker-compose up -d`


## NGINX-Setup in der Produktivumgebung

* Die Pfadwurzel verweist auf eine statische HTML-Seite
* Die Pfade /socket.io und /internal/status sind passwortgeschützt und leiten zum Express-Container weiter
* Der Pfad /api wird 30 Minuten lang gecachet und leitet zum Express-Container weiter
* Der Pfad /ghost leitet zum Ghost-Container weiter
* Bei einem 404 Error wird eine statische HTML-Seite zurückgegeben
