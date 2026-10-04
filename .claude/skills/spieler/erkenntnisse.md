# Erkenntnisse (neu oben)

## 2026-10-04 · v17 (Mehrspieler) und 3-gegen-3-Vergleich
**Mehrspieler (zwei Bots):** Verbindung klappt über den Browser-Kanal. Getrennte Welten stimmen (jeder sieht den anderen nur als „in Welt X"). Nach dem Treffen in der Wiese trafen sich beide nach 12 s, schossen sich gegenseitig, ein PvP-Kill, 105 angezeigte Treffer je Seite, Abbilder im Mittel 51 Einheiten neben der echten Position (Maximum 500 beim Dash). **Lehre 1:** `browser.newPage()` erzeugt jedes Mal einen neuen Browser-Kontext — für den gemeinsamen Kanal braucht es *einen* Kontext mit mehreren Seiten. **Lehre 2:** Bots im selben Raum dürfen erst kämpfen, wenn das Szenario es will (`fightPlayers`), sonst ziehen sie sich schon in der Basis in den Kampf.
**Vergleich je 3 Läufe (gleicher Bot):** v15: 187 s · 0,7 Tode · Schaden 5253. v17: 186 s · 0,3 Tode · Schaden 6623. → Zeit unverändert, aber der Bot kassiert 26 % mehr Schaden (Phasen und Bodenschlag zwingen zur Bewegung) und stirbt seltener. Ob das „mehr Spaß" ist, sagt der Bot nicht — das muss ein Mensch am Handy beurteilen (Bodenschlag-Kreis, Orbs, Kompass).
**Bot-Fehler gefunden und behoben:** (1) Nach dem Portal lief der Bot im neuen Raum weiter zu den alten Koordinaten (151 s verloren, Kampf mit Rivalen) → Abbruch bei Weltwechsel. (2) Ein `//`-Kommentar mitten in einer Zeile hatte eine Prüfung auskommentiert → v15-Läufe stürzten ab. **Lehre:** Kommentare nie ans Zeilenende einer Zeile mit Folgecode hängen.
**Heimkehr-Portal (ab v16):** nach dem Boss-Sieg 2 s bis zum Portal und direkt in die Basis statt 40–50 s Rückweg.

## 2026-10-04 · Erste Läufe v15 → v16
**Beobachtung (v15):** Der Bot schafft Wiese, Berg und Eis in ca. 220 s ohne Tod. Ein Boss fällt in 4–8 s Kampf — der Kampf ist der Höhepunkt, aber viel zu kurz. 73–78 % der Zeit ist nur Laufen.
**Beobachtung (v15):** Beim Weg über den Fluss wiederholen sich „FEINDGEBIET"-Banner und „Ein KRAMPUS hat dich entdeckt!" im Sekundentakt (Rand-Flackern). Der schlafende Boss hatte keinen Richtungspfeil.
**Beobachtung (Bot):** Der Bot blieb in der Basis-Wand hängen und starb dort zweimal an Turm-Pfeilen — Tor liegt nur bei +x. (Bot-Fehler, aber ein Mensch kann dort auch hängen.)
**Geändert in v16:** Boss-HP +33 %; Boss-Phasen bei 66/33 % („rastet aus": schneller, stampft öfter); ausweichbarer **Bodenschlag** (roter Kreis, 1,5 s); Beute-Orbs und Abschuss-Serie (Super lädt schneller); Boss-Kompass (gelber Pfeil mit Meter-Angabe); Wege machen 25 % schneller; Meldungs-Spam gedrosselt.
**Wirkung (je 1 Lauf, noch nicht belastbar):** Kampfzeit pro Boss 29–34 s → 36–39 s; Bodenschlag-Ausweichen senkte den Schaden um etwa 10 % (7597 gegen 8462). Weiter beobachten: Laufanteil ≈ 71 % bleibt hoch → nächste Idee: kürzere Wege oder Schnellreise.
**Bot gelernt:** Tor-Wegpunkt, Hänger-Erkennung, Schild nach Treffern, Ausweichen vor Bodenschlag, Protokoll fasst Wiederholungen zusammen.
