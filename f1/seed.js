/* Pit Wall — starting data for the F1 Group, reconstructed from the group text (Dec 2019 – Sep 2026).
   Used only the first time a device opens the app (or to seed an empty mailbox). After that the
   mailbox / device copy is the truth. Picks are keyed by race name (slug), not round number, so a
   canceled race never shifts anyone's picks. Rounds with no entry here are auto-drafted until the
   commissioner backfills them in Setup. */
const PITWALL_SEED = {
  seedVersion: 6, // bump when the starting point below changes; devices not yet on a mailbox adopt the new one automatically
  league: { name: 'F1 Group', key: 'f1', commissioner: 'steve', deadlineRule: 'friday', tz: 'America/Chicago', currentSeason: 2026, mailboxUrl: '' },
  players: [
    { id: 'steve', name: 'Steve', active: true },
    { id: 'ryan',  name: 'Ryan',  active: true },
    { id: 'jerry', name: 'Jerry', active: true },
    { id: 'mark',  name: 'Mark',  active: true },
    { id: 'robbi', name: 'Robbi', active: true },
    { id: 'red',   name: 'Red',   active: false }
  ],
  history: [
    { year: 2018, champion: 'Red',   note: '"won it all in 18"' },
    { year: 2020, champion: 'Steve', note: 'COVID short season, 3 drivers' },
    { year: 2022, champion: 'Jerry', note: 'first of back-to-back' },
    { year: 2023, champion: 'Jerry', note: '863 to Ryan\'s 853' },
    { year: 2024, champion: 'Steve', note: '863 to Robbi\'s 837' },
    { year: 2025, champion: 'Jerry', note: 'clinched with races to spare' }
  ],
  paddock: [],
  seasons: {
    2026: {
      year: 2026, driversPer: 4, drivesPer: 12, wildcardsPer: 2, perRace: 2,
      scoring: { racePlace: [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], rowPoints: [10,9,8,7,6,5,4,3,2,1], sprintUsesRows: true, fastestLapBonus: 5, sprintFastestLapBonus: 0, unclassifiedScoresZero: true, perRace: 2 },
      canceled: ['bahrain', 'saudi-arabian'],
      // The 2026 draft was run by text on Feb 21, 2026 (Steve's post). Rosters below are the result; the app keeps the order for the record.
      draft: { status: 'done', players: ['steve', 'ryan', 'jerry', 'mark', 'robbi'], note: 'Run by group text, Feb 2026',
        order: [['steve', 'ryan', 'jerry', 'mark', 'robbi'], ['robbi', 'mark', 'jerry', 'ryan', 'steve'], ['steve', 'ryan', 'jerry', 'mark', 'robbi'], ['robbi', 'mark', 'jerry', 'ryan', 'steve']], picks: [] },
      roster: {
        steve: ['max_verstappen', 'hadjar', 'perez', 'hulkenberg'],
        ryan:  ['norris', 'bottas', 'stroll', 'bortoleto'],
        jerry: ['russell', 'alonso', 'sainz', 'lawson'],
        mark:  ['leclerc', 'hamilton', 'ocon', 'albon'],
        robbi: ['piastri', 'antonelli', 'gasly', 'bearman']
      },
      picks: {
        australian: { steve: { drivers: ['max_verstappen', 'hadjar'] }, ryan: { wildcard: true }, robbi: { drivers: ['piastri', 'antonelli'] }, mark: { wildcard: true }, jerry: { drivers: ['lawson', 'russell'] } },
        chinese:    { steve: { drivers: ['perez', 'hulkenberg'] }, ryan: { drivers: ['norris', 'bortoleto'] }, mark: { drivers: ['hamilton', 'ocon'] }, robbi: { drivers: ['piastri', 'antonelli'] }, jerry: { drivers: ['lawson', 'russell'] } },
        japanese:   { steve: { drivers: ['max_verstappen', 'hadjar'] }, mark: { drivers: ['leclerc', 'albon'] }, ryan: { drivers: ['bottas', 'stroll'] }, robbi: { drivers: ['bearman', 'antonelli'] }, jerry: { drivers: ['lawson', 'russell'] } },
        miami:      { steve: { drivers: ['max_verstappen', 'hulkenberg'] }, jerry: { drivers: ['lawson', 'sainz'] }, ryan: { drivers: ['norris', 'bortoleto'] }, mark: { drivers: ['leclerc', 'ocon'] }, robbi: { wildcard: true } },
        canadian:   { steve: { wildcard: true }, mark: { wildcard: true }, robbi: { wildcard: true }, ryan: { drivers: ['bottas', 'stroll'] }, jerry: { drivers: ['sainz', 'russell'] } },
        monaco:     { steve: { drivers: ['max_verstappen', 'hadjar'] }, ryan: { drivers: ['norris', 'bottas'] }, mark: { drivers: ['leclerc', 'hamilton'] }, robbi: { drivers: ['gasly', 'bearman'] }, jerry: { drivers: ['lawson', 'sainz'] } },
        spanish:    { steve: { drivers: ['max_verstappen', 'hadjar'] } },
        austrian:   { robbi: { drivers: ['gasly', 'bearman'] } },
        british:    { jerry: { drivers: ['lawson', 'sainz'] }, robbi: { drivers: ['gasly', 'bearman'] } },
        belgian:    { robbi: { drivers: ['piastri', 'antonelli'] }, jerry: { drivers: ['sainz', 'lawson'] } },
        hungarian:  { robbi: { drivers: ['bearman', 'gasly'] }, jerry: { drivers: ['sainz', 'lawson'] } },
        dutch:      { jerry: { wildcard: true }, robbi: { drivers: ['bearman', 'gasly'] } },
        italian:    { robbi: { drivers: ['piastri', 'antonelli'] }, ryan: { drivers: ['bottas', 'bortoleto'] }, jerry: { drivers: ['russell', 'lawson'] }, steve: { drivers: ['max_verstappen', 'hadjar'] }, mark: { drivers: ['leclerc', 'hamilton'], auto: true } }
      },
      overrides: {},
      // Starting point: Steve's post after the ITALIAN GP (standings + driver usage list), copied exactly.
      // The app scores every race from the Spanish GP on; the commissioner can move or overwrite this in Setup.
      start: {
        afterKey: 'singapore',
        standings: { robbi: 1039, jerry: 975, steve: 931, mark: 928, ryan: 603 },
        usage: {
          steve: { max_verstappen: 0, hadjar: 0, perez: 9, hulkenberg: 9, _wild: 0 },
          ryan:  { norris: 4, bottas: 5, stroll: 4, bortoleto: 3, _wild: 1 },
          jerry: { russell: 3, alonso: 11, sainz: 3, lawson: 2, _wild: 0 },
          mark:  { leclerc: 3, hamilton: 2, ocon: 7, albon: 6, _wild: 0 },
          robbi: { piastri: 4, antonelli: 3, gasly: 7, bearman: 6, _wild: 0 }
        },
        note: 'Steve\'s driver-usage and standings post after the Singapore GP (Oct 2026), copied exactly. It replaces the Italian GP starting point and covers the four races the app never got picks for: Spain, Azerbaijan, Bahrain-in-Malaysia and Singapore. The app scores the United States GP onward. Steve hand-scores, and where his numbers and the app\'s have differed his have been right, so his are entered as the truth. ONE THING TO CHECK WITH STEVE: four of the five players reconcile exactly against the previous post — eight drives used over four races, or six plus a wild card. Robbi comes out at six drives and no wild card, which is one race short; Gasly and Bearman are unchanged at 7 and 6. Most likely one of Robbi\'s four numbers is a slip. His numbers are entered exactly as posted; correct them in Setup → Usage if Steve confirms.'
      },
      note: 'Picks through Monaco are complete from the group text. From Spain on, only the picks that came through are here; Steve has the rest. Races before the starting point above no longer affect the standings, so the auto-drafted lineups still shown for Spain through Singapore are a record of what the app guessed, not something that is being scored.'
    }
  }
};
