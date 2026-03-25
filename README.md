# paralica.ai

Aviation weather briefings and more.

## Structure

- `aviation/` — aviation.paralica.ai
  - `briefings/` — generated weather briefings (hashed anonymous links)
  - `index.html` — landing page

## Briefings

Each briefing is published as `aviation/briefings/{hash}.html` — a unique, non-guessable URL.
Briefings include METARs, TAFs, winds aloft, NOTAMs, and route analysis.
