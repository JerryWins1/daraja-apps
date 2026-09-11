/* Pit Wall — starting data for the F1 Group, reconstructed from the group text (Dec 2019 – Sep 2026).
   Used only the first time a device opens the app (or to seed an empty mailbox). After that the
   mailbox / device copy is the truth. Picks are keyed by race name (slug), not round number, so a
   canceled race never shifts anyone's picks. Rounds with no entry here are auto-drafted until the
   commissioner backfills them in Setup. */
const PITWALL_SEED = {
  seedVersion: 5, // bump when the starting point below changes; devices not yet on a mailbox adopt the new one automatically
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
        afterKey: 'italian',
        standings: { robbi: 808, mark: 765, steve: 754, jerry: 728, ryan: 469 },
        usage: {
          steve: { max_verstappen: 2, hadjar: 3, perez: 11, hulkenberg: 10, _wild: 0 },
          ryan:  { norris: 6, bottas: 7, stroll: 6, bortoleto: 5, _wild: 1 },
          jerry: { russell: 5, alonso: 12, sainz: 6, lawson: 2, _wild: 1 },
          mark:  { leclerc: 5, hamilton: 5, ocon: 8, albon: 8, _wild: 0 },
          robbi: { piastri: 7, antonelli: 6, gasly: 7, bearman: 6, _wild: 0 }
        },
        note: 'Steve\'s post after the Italian GP (Sept 2026), copied exactly. Moved forward from the Dutch GP because the app\'s own scoring of Italy came out 4 to 19 points light against Steve\'s hand-scoring — Steve scored it, so Steve\'s numbers are the truth. The app scores the Spanish GP onward.'
      },
      note: 'Picks through Monaco are complete from the group text. From Spain on, only the picks that came through are here; Steve has the rest.'
    }
  }
};
