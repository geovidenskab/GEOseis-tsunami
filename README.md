# GEO-tsunami watch

En interaktiv undervisningsapplikation til tsunamivarsling og risikovurdering, der er en del af GEO-suiten.

## Beskrivelse

GEO-tsunami watch er et undervisningsmodul designet til elever, der skal lære om de faglige perspektiver ved beslutninger vedrørende tsunamivarsling. Applikationen guider eleverne gennem en struktureret proces med tre faser:

### Fase 1: Seismisk Dataanalyse
- Indtastning af seismisk data fra fire stationer
- Automatisk beregning af S-P tider, afstande og magnitude
- Brug af formlen: Ms = log₁₀(A) + 1.66 × log₁₀(Δ) + 1.6

### Fase 2: Epicenter Bestemmelse
- Integration med GeoSeis triangulerings-hjemmesiden
- Vurdering af epicenter kvalitet og placering
- Indtastning af ekstra oplysninger (dybde, forkastningstype)

### Fase 3: Tsunamirisiko Vurdering
- Punktbaseret risikovurdering baseret på:
  - Magnitude
  - Dybde
  - Placering
  - Forkastningstype
- Automatisk generering af varselsniveau
- Endelig beslutning om tsunamivarsel

## Funktioner

- **Interaktiv dataanalyse**: Automatiske beregninger baseret på seismisk data
- **Risikovurdering**: Punktbaseret system til objektiv vurdering
- **Print/Download**: Mulighed for at gemme og printe resultater
- **Responsivt design**: Fungerer på alle enheder
- **GEO-suite styling**: Konsistent design med andre GEO applikationer

## Tekniske Specifikationer

- **Framework**: React 18 med Vite
- **Styling**: CSS med GeoSeis21 design system
- **Port**: 3002 (for at undgå konflikter med andre GEO applikationer)
- **Browser support**: Moderne browsere med ES6+ support

## Installation og Kørsel

```bash
# Installer dependencies
npm install

# Start udviklingsserver
npm run dev

# Byg til produktion
npm run build

# Preview produktionsbuild
npm run preview
```

## Struktur

```
Tsunamiwatch/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Header komponent
│   │   └── GeoTsunamiWatch.jsx # Hovedapplikation
│   ├── styles/
│   │   └── index.css          # Styling
│   ├── App.jsx                # App komponent
│   └── main.jsx               # Entry point
├── public/                    # Statiske filer
├── package.json              # Dependencies
├── vite.config.js            # Vite konfiguration
└── index.html                # HTML template
```

## Integration med GEO-suiten

Applikationen følger samme design mønstre som andre GEO applikationer:
- Konsistent header design med gradient baggrund
- Samme farvepalette og typografi
- Responsivt grid system
- Print-venlige styles

## Undervisningsformål

Applikationen hjælper elever med at:
- Forstå seismisk dataanalyse
- Lære om epicenter bestemmelse
- Udvikle evner til risikovurdering
- Træffe informerede beslutninger under pres
- Forstå kompleksiteten i tsunamivarsling

## Version

v1.0 - Første udgivelse med komplet 3-fase workflow
