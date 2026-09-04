/* Pit Wall — starting data for the F1 Group, reconstructed from the group text (Dec 2019 – Sep 2026).
   Used only the first time a device opens the app (or to seed an empty mailbox). After that the
   mailbox / device copy is the truth. Picks are keyed by race name (slug), not round number, so a
   canceled race never shifts anyone's picks. Rounds with no entry here are auto-drafted until the
   commissioner backfills them in Setup. */
const PITWALL_SEED = {
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
        italian:    { robbi: { drivers: ['piastri', 'antonelli'] }, ryan: { drivers: ['bottas', 'bortoleto'] } }
      },
      overrides: {},
      note: 'Picks through Monaco are complete from the group text. From Spain on, only the picks that came through are here; Steve has the rest.'
    }
  }
};
