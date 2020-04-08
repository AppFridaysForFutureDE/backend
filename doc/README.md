## [swagger.yaml](swagger.yaml)

Hier wird unsere API nach dem OpenAPI 3.0 Standard dokumentiert.


## [default](default)

Das ist die nginx-Config-Datei, die wir im Produktivsystem verwenden. Wir verwenden die Reverse-Proxy-Funktion von nginx zum Routing. Ausserdem schützen wir damit manche Pfade mit einem Passwort.

* Die Pfadwurzel verweist auf eine statische HTML-Seite
* Die Pfade /socket.io und /internal/status sind passwortgeschützt und leiten zum Express-Container weiter
* Der Pfad /api wird 30 Minuten lang gecachet und leitet zum Express-Container weiter
* Der Pfad /ghost leitet zum Ghost-Container weiter
* Bei einem 404 Error wird eine statische HTML-Seite zurückgegeben
