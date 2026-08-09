// Mock data for the HAFI platform.
//
// Rwanda-first, Africa-ready: every club, competition, city, and venue below
// is drawn from (or plausible within) the real Rwandan sports landscape —
// APR FC, Rayon Sports, Amahoro Stadium, BK Arena, the CECAFA Kagame Cup —
// so the product feels authentic rather than generic. Venue names (e.g.
// "Goal Lounge") are original to HAFI, not real businesses.
//
// See lib/types.ts for the full domain model and the reasoning behind it.

import type {
  Sport,
  Team,
  Competition,
  Venue,
  Match,
  Article,
  CommunityActivity,
  UserProfile,
} from './types'

export const SPORTS: Sport[] = [
  { id: 1, slug: 'football', name: 'Football', icon: '⚽' },
  { id: 2, slug: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 3, slug: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 4, slug: 'rugby', name: 'Rugby', icon: '🏉' },
  { id: 5, slug: 'athletics', name: 'Athletics', icon: '🏃' },
  { id: 6, slug: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 7, slug: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 8, slug: 'motorsports', name: 'Motorsports', icon: '🏁' },
  { id: 9, slug: 'esports', name: 'Esports', icon: '🎮' },
]

export const TEAMS: Team[] = [
  { id: 1, name: 'APR FC', slug: 'apr-fc', logo: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=100&h=100&fit=crop', sport: 'Football', city: 'Kigali', followers: 48200 },
  { id: 2, name: 'Rayon Sports', slug: 'rayon-sports', logo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop', sport: 'Football', city: 'Kigali', followers: 52100 },
  { id: 3, name: 'Police FC', slug: 'police-fc', logo: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=100&h=100&fit=crop', sport: 'Football', city: 'Kigali', followers: 19400 },
  { id: 4, name: 'REG FC', slug: 'reg-fc', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop', sport: 'Football', city: 'Rwamagana', followers: 15800 },
  { id: 5, name: 'Patriots BBC', slug: 'patriots-bbc', logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop', sport: 'Basketball', city: 'Kigali', followers: 22300 },
  { id: 6, name: 'APR BBC', slug: 'apr-bbc', logo: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=100&h=100&fit=crop', sport: 'Basketball', city: 'Kigali', followers: 17600 },
  { id: 7, name: 'REG BBC', slug: 'reg-bbc', logo: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=100&h=100&fit=crop', sport: 'Basketball', city: 'Rwamagana', followers: 9800 },
  { id: 8, name: 'Espoir BBC', slug: 'espoir-bbc', logo: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=100&h=100&fit=crop', sport: 'Basketball', city: 'Kigali', followers: 6100 },
  { id: 9, name: 'APR Volleyball Club', slug: 'apr-volleyball-club', logo: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=100&h=100&fit=crop', sport: 'Volleyball', city: 'Kigali', followers: 4200 },
  { id: 10, name: 'REG Volleyball Club', slug: 'reg-volleyball-club', logo: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=100&h=100&fit=crop', sport: 'Volleyball', city: 'Rwamagana', followers: 3100 },
  { id: 11, name: 'Team Rwanda', slug: 'team-rwanda', logo: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=100&h=100&fit=crop', sport: 'Cycling', city: 'Musanze', followers: 31500 },
]

export const COMPETITIONS: Competition[] = [
  {
    id: 1,
    name: 'Rwanda Premier League',
    slug: 'rwanda-premier-league',
    sport: 'Football',
    region: 'Rwanda',
    standings: [
      { rank: 1, team: 'Rayon Sports', played: 18, won: 13, drawn: 3, lost: 2, points: 42 },
      { rank: 2, team: 'APR FC', played: 18, won: 12, drawn: 4, lost: 2, points: 40 },
      { rank: 3, team: 'Police FC', played: 18, won: 9, drawn: 5, lost: 4, points: 32 },
      { rank: 4, team: 'REG FC', played: 18, won: 8, drawn: 4, lost: 6, points: 28 },
    ],
  },
  { id: 2, name: 'Peace Cup', slug: 'peace-cup', sport: 'Football', region: 'Rwanda', standings: [] },
  { id: 3, name: 'CECAFA Kagame Cup', slug: 'cecafa-kagame-cup', sport: 'Football', region: 'East Africa', standings: [] },
  {
    id: 4,
    name: 'Rwanda Basketball League',
    slug: 'rwanda-basketball-league',
    sport: 'Basketball',
    region: 'Rwanda',
    standings: [
      { rank: 1, team: 'Patriots BBC', played: 14, won: 12, drawn: 0, lost: 2, points: 24 },
      { rank: 2, team: 'APR BBC', played: 14, won: 10, drawn: 0, lost: 4, points: 20 },
      { rank: 3, team: 'REG BBC', played: 14, won: 7, drawn: 0, lost: 7, points: 14 },
    ],
  },
  { id: 5, name: 'National Volleyball League', slug: 'national-volleyball-league', sport: 'Volleyball', region: 'Rwanda', standings: [] },
  { id: 6, name: 'Basketball Africa League', slug: 'basketball-africa-league', sport: 'Basketball', region: 'Africa', standings: [] },
]

// ---------------------------------------------------------------------------
// Venues — living community hubs, referenced by id from Match.waysToWatch
// ---------------------------------------------------------------------------

export const VENUES: Venue[] = [
  {
    id: 1,
    name: 'Goal Lounge',
    city: 'Kigali',
    country: 'Rwanda',
    district: 'Kimihurura',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    atmosphere: 'Electric',
    capacity: 400,
    currentFans: 236,
    followers: 5400,
    openingHours: '10:00 - 23:00',
    facilities: ['Big Screens', 'Full Kitchen', 'Rooftop Terrace', 'WiFi'],
    location: { lat: -1.9506, lng: 30.0925 },
    matches: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 2, teams: 'Police FC vs REG FC', time: '20:00', sport: 'Football' },
      { id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' },
      { id: 5, teams: 'REG BBC vs Espoir BBC', time: '19:00', sport: 'Basketball' },
    ],
    upcomingScreenings: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 2, teams: 'Police FC vs REG FC', time: '20:00', sport: 'Football' },
      { id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' },
      { id: 5, teams: 'REG BBC vs Espoir BBC', time: '19:00', sport: 'Basketball' },
    ],
    commonlyShows: [1, 3],
    recentActivity: [],
  },
  {
    id: 2,
    name: 'The Terrace Sports Bar',
    city: 'Kigali',
    country: 'Rwanda',
    district: 'Kacyiru',
    image: 'https://images.unsplash.com/photo-1552672597-fb3a9d7db7ab?w=500&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1552672597-fb3a9d7db7ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1467366896926-1fb25b6d2451?w=800&h=600&fit=crop',
    ],
    rating: 4.6,
    atmosphere: 'Vibrant',
    capacity: 300,
    currentFans: 158,
    followers: 3200,
    openingHours: '09:00 - 00:00',
    facilities: ['Bar', 'Outdoor Seating', 'Multiple Screens', 'Parking'],
    location: { lat: -1.9484, lng: 30.0891 },
    matches: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 2, teams: 'Police FC vs REG FC', time: '20:00', sport: 'Football' },
      { id: 4, teams: 'Patriots BBC vs APR BBC', time: '17:00', sport: 'Basketball' },
      { id: 6, teams: 'APR VC vs REG VC', time: '15:00', sport: 'Volleyball' },
    ],
    upcomingScreenings: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 2, teams: 'Police FC vs REG FC', time: '20:00', sport: 'Football' },
      { id: 4, teams: 'Patriots BBC vs APR BBC', time: '17:00', sport: 'Basketball' },
      { id: 6, teams: 'APR VC vs REG VC', time: '15:00', sport: 'Volleyball' },
    ],
    commonlyShows: [1, 4],
    recentActivity: [],
  },
  {
    id: 3,
    name: 'Amahoro Sports Club',
    city: 'Kigali',
    country: 'Rwanda',
    district: 'Remera',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    atmosphere: 'Premium',
    capacity: 250,
    currentFans: 112,
    followers: 2800,
    openingHours: '11:00 - 22:00',
    facilities: ['Premium Seating', 'Restaurant', 'Lounge', 'Valet Parking'],
    location: { lat: -1.9440, lng: 30.1050 },
    matches: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' },
    ],
    upcomingScreenings: [
      { id: 1, teams: 'APR FC vs Rayon Sports', time: '18:00', sport: 'Football' },
      { id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' },
    ],
    commonlyShows: [1, 3],
    recentActivity: [],
  },
  {
    id: 4,
    name: 'Lake View Lounge',
    city: 'Rubavu',
    country: 'Rwanda',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&h=400&fit=crop',
    photos: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop'],
    rating: 4.5,
    atmosphere: 'Relaxed',
    capacity: 180,
    currentFans: 64,
    followers: 1400,
    openingHours: '10:00 - 22:00',
    facilities: ['Lake View Terrace', 'Bar', 'Screens'],
    matches: [{ id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' }],
    upcomingScreenings: [{ id: 3, teams: 'Rwanda vs Uganda', time: '16:00', sport: 'Football' }],
    commonlyShows: [3],
    recentActivity: [],
  },
  {
    id: 5,
    name: 'Volcana Sports Bar',
    city: 'Musanze',
    country: 'Rwanda',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&h=400&fit=crop',
    photos: ['https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=600&fit=crop'],
    rating: 4.4,
    atmosphere: 'Casual',
    capacity: 150,
    currentFans: 0,
    followers: 900,
    openingHours: '11:00 - 23:00',
    facilities: ['Screens', 'Bar', 'Pool Table'],
    matches: [],
    upcomingScreenings: [],
    commonlyShows: [1],
    recentActivity: [],
  },
]

// ---------------------------------------------------------------------------
// Matches — the experience model: what / where / who / what's next
// ---------------------------------------------------------------------------

export const MATCHES: Match[] = [
  {
    id: 1,
    sport: 'Football',
    competition: 'Rwanda Premier League',
    status: 'live',
    homeTeam: { name: 'APR FC', logo: TEAMS[0].logo },
    awayTeam: { name: 'Rayon Sports', logo: TEAMS[1].logo },
    score: { home: 2, away: 1 },
    time: '72:34',
    venue: 'Amahoro Stadium',
    lineups: {
      home: ['Goalkeeper: E. Ndayishimiye', 'Defender: J. Mugisha', 'Midfielder: O. Karemera', 'Forward: D. Niyonzima'],
      away: ['Goalkeeper: P. Habimana', 'Defender: S. Twagirayezu', 'Midfielder: R. Iradukunda', 'Forward: L. Bizimana'],
    },
    timeline: [
      { time: '12:00', event: 'Goal', team: 'home', player: 'O. Karemera' },
      { time: '34:15', event: 'Yellow Card', team: 'away', player: 'S. Twagirayezu' },
      { time: '56:30', event: 'Goal', team: 'away', player: 'L. Bizimana' },
      { time: '72:34', event: 'Goal', team: 'home', player: 'D. Niyonzima' },
    ],
    waysToWatch: {
      tickets: { available: true, priceFrom: 3000, currency: 'RWF' },
      venues: [1, 2, 3],
      livestream: { provider: 'FRSC YouTube' },
      broadcast: [{ channel: 'Rwanda TV', region: 'Rwanda' }],
    },
    attendance: {
      goingCount: 1834,
      friendsGoing: [
        { id: 1, name: 'Karemera Omar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
        { id: 2, name: 'Uwase Diane', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      ],
    },
  },
  {
    id: 2,
    sport: 'Football',
    competition: 'Rwanda Premier League',
    status: 'scheduled',
    homeTeam: { name: 'Police FC', logo: TEAMS[2].logo },
    awayTeam: { name: 'REG FC', logo: TEAMS[3].logo },
    time: '20:00',
    venue: 'Kigali Pelé Stadium',
    waysToWatch: {
      tickets: { available: true, priceFrom: 2000, currency: 'RWF' },
      venues: [1, 2],
      broadcast: [{ channel: 'Rwanda TV', region: 'Rwanda' }],
    },
    attendance: {
      goingCount: 412,
      friendsGoing: [{ id: 3, name: 'Niyonzima Eric', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }],
    },
  },
  {
    id: 3,
    sport: 'Football',
    competition: 'CECAFA Kagame Cup',
    status: 'scheduled',
    homeTeam: { name: 'Rwanda', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop' },
    awayTeam: { name: 'Uganda', logo: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=100&h=100&fit=crop' },
    time: '16:00',
    venue: 'Huye Stadium',
    waysToWatch: {
      tickets: { available: true, priceFrom: 5000, currency: 'RWF' },
      venues: [1, 3, 4],
      livestream: { provider: 'CECAFA TV' },
      streamingApps: [{ name: 'StarTimes App', logo: '' }],
      broadcast: [{ channel: 'Rwanda TV', region: 'Rwanda' }, { channel: 'SuperSport', region: 'East Africa' }],
    },
    attendance: {
      goingCount: 2760,
      friendsGoing: [
        { id: 4, name: 'Mutesi Grace', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop' },
        { id: 5, name: 'Habimana Jean de Dieu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
      ],
    },
  },
  {
    id: 4,
    sport: 'Basketball',
    competition: 'Rwanda Basketball League',
    status: 'finished',
    homeTeam: { name: 'Patriots BBC', logo: TEAMS[4].logo },
    awayTeam: { name: 'APR BBC', logo: TEAMS[5].logo },
    score: { home: 84, away: 77 },
    time: 'Full Time',
    venue: 'BK Arena',
    waysToWatch: { venues: [2], broadcast: [{ channel: 'Rwanda TV', region: 'Rwanda' }] },
    attendance: { goingCount: 3120, friendsGoing: [] },
  },
  {
    id: 5,
    sport: 'Basketball',
    competition: 'Rwanda Basketball League',
    status: 'live',
    homeTeam: { name: 'REG BBC', logo: TEAMS[6].logo },
    awayTeam: { name: 'Espoir BBC', logo: TEAMS[7].logo },
    score: { home: 41, away: 38 },
    time: 'Q3 04:12',
    venue: 'BK Arena',
    waysToWatch: { tickets: { available: true, priceFrom: 2000, currency: 'RWF' }, venues: [1] },
    attendance: { goingCount: 268, friendsGoing: [] },
  },
  {
    id: 6,
    sport: 'Volleyball',
    competition: 'National Volleyball League',
    status: 'scheduled',
    homeTeam: { name: 'APR Volleyball Club', logo: TEAMS[8].logo },
    awayTeam: { name: 'REG Volleyball Club', logo: TEAMS[9].logo },
    time: '15:00',
    venue: 'Kigali Volleyball Court',
    waysToWatch: { venues: [2] },
    attendance: { goingCount: 94, friendsGoing: [] },
  },
]

// ---------------------------------------------------------------------------
// Community activity — first-class, shared across Home, Venue, and Match
// ---------------------------------------------------------------------------

export const FRIEND_ACTIVITIES: CommunityActivity[] = [
  {
    id: 1,
    user: { id: 1, name: 'Karemera Omar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    type: 'watching',
    target: { type: 'venue', id: 1, name: 'Goal Lounge' },
    action: 'is watching at Goal Lounge',
    venue: 'Goal Lounge',
    time: '12 min ago',
  },
  {
    id: 2,
    user: { id: 2, name: 'Uwase Diane', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    type: 'checked_in',
    target: { type: 'venue', id: 2, name: 'The Terrace Sports Bar' },
    action: 'checked in at The Terrace Sports Bar',
    venue: 'The Terrace Sports Bar',
    time: '38 min ago',
  },
  {
    id: 3,
    user: { id: 3, name: 'Niyonzima Eric', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    type: 'followed_team',
    target: { type: 'team', id: 1, name: 'APR FC' },
    action: 'started following APR FC',
    venue: 'APR FC',
    time: '1 hour ago',
  },
  {
    id: 4,
    user: { id: 4, name: 'Mutesi Grace', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop' },
    type: 'going',
    target: { type: 'match', id: 2, name: 'Police FC vs REG FC' },
    action: 'is going to Police FC vs REG FC',
    venue: 'Kigali Pelé Stadium',
    time: '2 hours ago',
  },
  {
    id: 5,
    user: { id: 5, name: 'Habimana Jean de Dieu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    type: 'followed_venue',
    target: { type: 'venue', id: 1, name: 'Goal Lounge' },
    action: 'started following Goal Lounge',
    venue: 'Goal Lounge',
    time: '4 hours ago',
  },
]

// Backfill each venue's recentActivity from the shared community feed so
// Venue pages surface real, consistent activity rather than an empty state.
VENUES.forEach((venue) => {
  venue.recentActivity = FRIEND_ACTIVITIES.filter(
    (activity) => activity.target.type === 'venue' && activity.target.id === venue.id,
  )
})

// ---------------------------------------------------------------------------
// News — a pillar, not an afterthought
// ---------------------------------------------------------------------------

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'apr-fc-edge-rayon-sports-kigali-derby',
    title: 'APR FC edge Rayon Sports in fiery Kigali derby',
    excerpt: 'A late Niyonzima strike settled a bad-tempered Rwanda Premier League derby at Amahoro Stadium.',
    content: [
      "APR FC edged rivals Rayon Sports 2-1 in a fiery Rwanda Premier League derby at Amahoro Stadium on Saturday, with Dieudonné Niyonzima's 73rd-minute strike settling a contest that swung on two moments either side of half-time.",
      "Olivier Karemera opened the scoring for APR just before the half-hour mark, finishing a swift counter-attack after Rayon lost possession in midfield. Rayon responded early in the second half through Léo Bizimana, whose low finish from the edge of the box drew the visitors level and lifted the away end.",
      'The game turned bad-tempered as the clock wound down, with a second yellow card for Rayon defender Samuel Twagirayezu reducing the visitors to ten men in the 68th minute. APR made the extra man count five minutes later, working the ball wide before Niyonzima arrived at the back post to head home the winner.',
      'The result moves APR to within two points of league leaders Rayon Sports with six games remaining, setting up a tight finish to the Rwanda Premier League season.',
    ],
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
    category: 'Match Report',
    author: 'Eric Munyaneza',
    publishedAt: '2 hours ago',
    sport: 'Football',
    relatedTeamIds: [1, 2],
  },
  {
    id: 2,
    slug: 'patriots-bbc-eye-bal-qualification',
    title: 'Patriots BBC eye BAL qualification after strong league form',
    excerpt: 'An unbeaten run in the Rwanda Basketball League has Patriots BBC positioned for a first Basketball Africa League berth.',
    content: [
      'Patriots BBC have won 12 of their opening 14 Rwanda Basketball League fixtures, a run of form that has the Kigali club firmly in contention for a maiden Basketball Africa League (BAL) qualification spot.',
      "Head coach comments after the weekend's win pointed to squad depth as the difference this season, with the bench unit outscoring opponents in four of the last five games.",
      "Patriots face closest challengers APR BBC in a top-of-the-table clash next month that could go a long way toward deciding the league title — and with it, Rwanda's BAL representative.",
    ],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    category: 'Club News',
    author: 'Diane Uwase',
    publishedAt: '5 hours ago',
    sport: 'Basketball',
    relatedTeamIds: [5],
  },
  {
    id: 3,
    slug: 'amavubi-squad-cecafa-kagame-cup',
    title: 'Amavubi call up new squad ahead of CECAFA Kagame Cup',
    excerpt: 'Three uncapped players join the Rwanda national team as preparations for the regional tournament intensify.',
    content: [
      "Rwanda's national football team, the Amavubi, have named three uncapped players in their squad for the upcoming CECAFA Kagame Cup, signaling a push toward youth ahead of the regional tournament.",
      'The squad will assemble in Kigali for a training camp before the opening fixture, with the technical bench keen to build cohesion after a disrupted qualifying campaign.',
      'Rwanda open their Kagame Cup campaign against Uganda, a fixture with historic weight for both nations and one expected to draw strong crowds across Kigali venues.',
    ],
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
    category: 'Club News',
    author: 'Jean de Dieu Habimana',
    publishedAt: '1 day ago',
    sport: 'Football',
  },
  {
    id: 4,
    slug: 'team-rwanda-tour-du-rwanda',
    title: 'Team Rwanda set sights on another Tour du Rwanda triumph',
    excerpt: "Kigali's cycling scene keeps growing as riders prepare for the continent's premier stage race.",
    content: [
      "Team Rwanda's riders have begun altitude training in the hills around Musanze as preparations intensify for this year's Tour du Rwanda, the continent's most prestigious stage race.",
      "The team's development pipeline — built on grassroots cycling clubs across Kigali and the Northern Province — has produced several riders now competing at UCI Continental level, a sign of how far the domestic scene has come in a decade.",
      'Beyond competitive results, organizers point to the growing crowds lining the route each year as evidence that cycling is becoming a genuine part of Rwandan sports culture, not just an elite pursuit.',
    ],
    image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600&h=400&fit=crop',
    category: 'Community',
    author: 'Grace Mutesi',
    publishedAt: '1 day ago',
    sport: 'Cycling',
    relatedTeamIds: [11],
  },
  {
    id: 5,
    slug: 'inside-bk-arena-kigali-basketball-hub',
    title: 'Inside BK Arena: how Kigali became an East African basketball hub',
    excerpt: 'From AfroBasket to weekly league nights, the arena has reshaped how the city gathers around the sport.',
    content: [
      'When BK Arena opened its doors, few predicted how quickly it would reshape basketball culture in Kigali. Since hosting AfroBasket, the venue has become the anchor for weekly Rwanda Basketball League nights that regularly draw capacity crowds.',
      "\"It changed what fans expected a matchday to feel like,\" one long-time supporter said of the shift from community halls to a purpose-built arena. Concourse food stalls, pre-game DJ sets, and a genuine home-crowd atmosphere have become fixtures of arena nights.",
      'The arena has also made Kigali a more credible host for continental basketball, with organizers citing it as a factor in Rwanda securing future regional fixtures.',
    ],
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=400&fit=crop',
    category: 'Interview',
    author: 'Omar Karemera',
    publishedAt: '2 days ago',
    sport: 'Basketball',
  },
  {
    id: 6,
    slug: 'five-venues-kigali-derby-weekend',
    title: 'Five venues to catch the Kigali derby this weekend',
    excerpt: "Can't make it to Amahoro Stadium? Here's where the atmosphere is almost as good.",
    content: [
      "Amahoro Stadium tickets for this weekend's Kigali derby are close to sold out, but that doesn't mean you'll miss the atmosphere — Kigali's sports bars have built their own derby-day culture over the years.",
      "Goal Lounge in Kimihurura remains the standard-bearer, with a rooftop terrace and a crowd that arrives an hour before kickoff to secure a seat. The Terrace Sports Bar in Kacyiru draws a similarly passionate mix of both sets of fans.",
      "For something more upscale, Amahoro Sports Club's premium seating and restaurant menu make it a strong choice for watching in comfort without sacrificing atmosphere.",
      'Whichever venue you choose, arrive early — Kigali derby crowds fill fast.',
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    category: 'Community',
    author: 'HAFI Editorial',
    publishedAt: '3 days ago',
    sport: 'Football',
  },
]

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export const USER_PROFILE: UserProfile = {
  id: 1,
  name: 'Uwimana Grace',
  handle: '@graceuwi',
  bio: 'Football & basketball fan | APR FC and Patriots BBC | Kigali',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  city: 'Kigali',
  followers: 2345,
  following: 342,
  favoriteTeams: [1, 5],
  favoriteSports: ['Football', 'Basketball'],
  savedVenues: [1, 2],
  followedVenues: [1, 2, 3],
  achievements: [
    { id: 1, name: 'Venue Explorer', description: 'Checked into 10 venues', icon: '🏟️' },
    { id: 2, name: 'Match Tracker', description: 'Watched 25 live matches', icon: '🎯' },
    { id: 3, name: 'Community Star', description: 'Earned 100 community points', icon: '⭐' },
  ],
}
