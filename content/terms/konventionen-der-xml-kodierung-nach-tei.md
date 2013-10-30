###Konventionen der XML-Kodierung nach TEI


Das Heyne Digital ODD-Schema ist über **[Github][]** erreichbar.

Überschriften wurden in \<head\> eingeschlossen. Zusätzlich wurde das
gesamte Kapitel, zu dem die Überschrift gehört in ein \<div\>
eingeschlossen.

Ein Seitenumbruch wird vor der Seite mit \<pb/\> gekennzeichnet.

Fortlaufende Seitenzahlen wurden nicht wiedergegeben; andere
Ordnungszahlen, wie beispielsweise die Vorlesungseinheiten, hingegen
schon.

Zeilenumbrüche wurden mit \<lb/\> gekennzeichnet.

Absätze wurden mit dem Element \<p\> für paragraph kodiert.

Zitate wurden in \<q\> eingeschlossen.

Literaturangaben wurden in der Erstaufnahme in \<bibl\>\<ref\>
eingeschlossen.

Personennamen wurden in \<persName\> eingeschlossen.

Ortsnamen wurden in \<placeName\> eingeschlossen.

Kunstwerke wie Laokoon wurden in \<term/\> eingeschlossen.

Datumsangaben wurden in \<date\> eingeschlossen.

Ein Wechsel der Schriftart von z.B. deutscher Kurrentschrift in
lateinische Druckbuchstaben wurde in \<emph\> eingeschlossen. Handelte
es sich nur um einzelne Buchstaben am Anfang oder am Ende Wortes, wurde
die Schriftart gewählt, in der mehr als die Hälfte des Wortes verfasst
ist; eine Auszeichnung erfolgte dementsprechend nur, wenn das Wort
daraufhin nicht mehr als in deutscher Kurrentschrift verfasst gilt.

Der Wechsel von deutscher Sprache in eine andere Sprache wurde mit
\<foreign/\> umschlossen. Fachtermini wurden von der
\<foreign\>-Kennzeichung ausgeschlossen.

Ein erkennbarer Wechsel der Handschrift wurde mit \<handshift/\>
angegeben. Wechselt die Hand wieder zurücke, erfolgte ein weiteres
\<handshift/\>.

Anmerkungen wurden in \<note\> eingeschlossen. Im Attribut place wurde
angegeben, wo sich die Anmerkung befindet, ob beispielsweise am Rand
oder am Fuß der Seite. Textblöcke, deren Zuordnung zum Haupttext nicht
eindeutig erkennbar ist, werden mit \<ab\> ausgezeichnet.

Unterstreichungen wurden mit \<hi rend="underline"\>...\</hi\> oder \<hi
rend="double underline"\>...\</hi\> markiert.

Hochgestellte Zahlen oder Buchstaben wurden mit \<hi
rend="sup"\>...\</hi\> dargestellt.

Unsichere Lesungen und Nichtauflösbare Unklarheiten wurden in
\<unclear\> eingeschlossen.

Fehlender Text: Fehlt Text (durch zu enge Bindung oder weil der Autor
eine offensichtliche Leerstelle gelassen hat), wurde die Stelle mit
\<gap/\> markiert werden.

Streichungen wurden grundsätzlich in \<del\> eingeschlossen. Ist das
Gestrichene lesbar, wurde es wiedergegeben, wenn nicht, blieb das
\<del\> leer.

Einschübe des Autors werden in \<add\> eingeschlossen.

  [Github]: https://github.com/subugoe/ropen-backend/blob/master/src/main/odd/config/ropen.odd
    "Github"
