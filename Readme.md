## Einführung neuer Bilder

**1. Bild in bonjwa-Ordner hinzufügen mit Dateiname:** 
_beispiel.png_ mit transparentem Hintergrund und keinem leeren Rand.\
Das Bild muss 1:1 das Pixelart sein nur aus den vorgegebenen Farben von Reddit bestehen


**2. In config.toml neuen Block hinzufügen:** 
```toml
[[structure]]
name = "beispiel"
file = "bonjwa/beispiel.png"
startx = 1234 #x-Koordinate
starty = 5678 #y-Koordinate
priority = 2
```
Dabei bezeichnet die Koordinate das oberste linke Pixel der verlinkten png in r/place
und Priority bitte **NICHT** ändern, außer es ist mit dem Rest der Devs abgesprochen.
Die Koordinaten sind **NICHT** die gleichen wie in r/place, diese bitte genau prüfen.

**3. Scripte ausführen und Output prüfen:**
Zwei Skripte in der angegebenen Reihenfolge aus dem Hauptordner des Repos ausführen\
`python .\scripts\generate_json.py`\
Damit sollte eine _pixel.json_ generiert werden\
`python .\scripts\render_json.py`\
Nun wird aus der _pixel.json_ eine _output.png_ und eine _overlay.png_ generiert\

WICHTIG: In der _output.png_ gucken, dass die Bilder richtig platziert wurden und evtl. das eigene Overlay mit der neuen _overlay.png_ testen, ob z. B. bei einer Änderung eines alten Bildes die Koordinaten nicht versetzt zum alten Bild sind.\

Mithilfe der Dockerfile kann ein Image/Container erstellt werden, welcher bereits für die Ausführung der Python Skripts konfiguriert ist.


**4. Pull Request erstellen und von anderem Dev prüfen lassen** 
