# Archaeo18

## Über das Projekt:

Die Niedersächsische Staats- und Universitätsbibliothek Göttingen (SUB) hat im Rahmen des DFG-Projektes Archaeo18 in Zusammenarbeit mit dem Archäologischen Institut der Universität Göttingen die berühmte Göttinger Archäologie-Vorlesung Christian Gottlob Heynes, die einen entscheidenden Schritt zur akademischen Institutionalisierung der Klassischen Archäologie markierte, erschlossen und erforscht. Nach der Digitalisierung, Transkription und Inhaltserschließung der Vorlesungsmitschriften, wurden diese digital zusammengeführt und sollen als eine wissenschaftlich-kritische Edition Bibliotheksnutzern und interessierten Wissenschaftlerinnen und Wissenschaftlern zur Verfügung gestellt werden.

Die Edition bietet neben dem Zugriff auf die Digitalisate und der Suche in den Volltexten die Möglichkeit, gezielt nach Personen, Orten, Literatur und Kunstwerken zu suchen. Die identifizierten Entitäten sind durch die Verlinkung in externe Datenbanken normiert, die in den Mitschriften genannte Literatur wurde – sofern noch nicht in einem anderen Repositorium vorhanden – digitalisiert und ebenfalls mit der entsprechenden Stelle im Volltext verknüpft.

## Entwicklungsumgebung
### Git
Das Projekt ist in verschiedene Git Module aufgeteilt, diese müssen vor dem ersten Gebrauch initialisiert werden.
>git submodule init

>git submodule update 

Um die submodule auf den atkuellen Stand zu bringen, muss der Pointer auf die jeweils aktuelle Version gesetzt werden.
> git submodule foreach git checkout master
Dann holen. 
> git submodule foreach git pull
Den Pointer committen und pushen.
> git commit -am "Raised submodule pointer"
> git push

### Ant
Archaeo18 benutzt Ant um verschiede Aufgaben zu erledigen, dazu zählt die Bereiststellung einer Entwicklungsumgebung als auch das Erstellen von Installationspaketen. Eine im Browser aufrufbare Umgebung kann mit dem folgenden Kommando bereitgestellt werden.
> ant serve

Dabei wird Jetty (wenn nicht vorhanden wird er heruntergelden) und SASS (wird ebenfalls heruntergeladen wenn notwendig) gestartet. Abfragen an den eXist Server werden dabei entweder von Jetty mit zwischengespeicherten Daten beantwortet oder an die konfigurierte Instanz weitergeleitet. Die Weiterleitung erfolgt dabei durch einen URLRewriteFilter, das entsprechende Servlet findet sich unter ./testdata/proxy
Zusätzlich wird die Konfigurationsdatei so angepasst, das das lokale Backend angesprochen wird.

### Vagrant

Eine Variante Archaeo18 zu installieren ist [Vagrant](http://www.vagrantup.com/).

Dazu müssen auf dem Rechner VirtualBox sowie Vagrant installiert sein. Vagrant Downloads für eine Vielzahl von Systemen sind unter http://www.vagrantup.com/downloads.html zu finden

Anschliessend wird im lokalen Archaeo18 Projektverzeichnis die virtuelle Maschine mit 
>vagrant up 

gestartet und mit den notwendigen Paketen ausgestattet.

Anschliessend ist die Archaeo18 Installation unter [http://192.168.33.18:8080/archaeo18](http://192.168.33.18:8080/archaeo18) erreichbar.
Die Projektdateien werden direkt in die virtuelle Maschine gemountet, so dass sie auf dem lokalen Rechner weiter bearbeitet werden können.

## Installationspaket
Mit dem folgenden Kommando lässt sich eine Installationsvariante bereitstellen.
>ant war.install

Das Paket kann mit dem folgenden Kommando in Jetty gestartet werden, um zu prüfen ob es im Browser vollständig angezeigt wird:
> ant war.run

## Backend
Dieses Git Repository beinhaltet nur das Frontend, bestehend aus der Projektseite und [Ropen](https://github.com/subugoe/ROPEN). Das [Ropen Backend](https://github.com/subugoe/ropen-backend) ist ebenfalls via GitHub erhältlich. Die REST Endpunkte des Frontends werden in der Datei "js/Archaeo18Config.js" konfiguriert.
