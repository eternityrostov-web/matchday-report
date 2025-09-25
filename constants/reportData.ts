// Функциональные области для отчета
export const FUNCTIONAL_AREAS = [
  { code: 'ACS', name: 'Access Control System' },
  { code: 'BRO', name: 'Broadcast' },
  { code: 'CAT', name: 'Catering' },
  { code: 'CER', name: 'Ceremonies' },
  { code: 'CLW', name: 'Cleaning/Waste' },
  { code: 'CPM', name: 'Competition Management' },
  { code: 'DOP', name: 'Doping Control' },
  { code: 'FTI', name: 'Field Technical Infrastructure' },
  { code: 'GMT', name: 'Ground Maintenance Team' },
  { code: 'HOS', name: 'Hospitality' },
  { code: 'INF', name: 'Information' },
  { code: 'ITT', name: 'IT & Telecommunications' },
  { code: 'LAN', name: 'Language Services' },
  { code: 'LOG', name: 'Logistics' },
  { code: 'MED', name: 'Medical' },
  { code: 'MEO', name: 'Media Operations' },
  { code: 'MRD', name: 'Marketing & Rights Delivery' },
  { code: 'OVL', name: 'Overlay' },
  { code: 'PIT', name: 'Protocol & International Transport' },
  { code: 'PLI', name: 'Players Liaison' },
  { code: 'REF', name: 'Referee Services' },
  { code: 'SEC', name: 'Security' },
  { code: 'SGN', name: 'Signage' },
  { code: 'SPS', name: 'Spectator Services' },
  { code: 'STM', name: 'Stadium Management' },
  { code: 'SUS', name: 'Sustainability' },
  { code: 'TCS', name: 'Team Services' },
  { code: 'TKT', name: 'Ticketing' },
  { code: 'MOB', name: 'Mobility' },
  { code: 'TSV', name: 'Team Services (Visiting)' },
  { code: 'VUM', name: 'Venue Management' },
  { code: 'WKF', name: 'Workforce' },
  { code: 'HSE', name: 'Health, Safety & Environment' },
  { code: 'F&B', name: 'Food & Beverage' },
  { code: 'SFM', name: 'Stadium Facility Management' }
];

// Стадионы
export const STADIUMS = [
  'Стадион "Лужники"',
  'Стадион "Крестовский"',
  'Стадион "Фишт"',
  'Арена ЦСКА',
  'Стадион "Нижний Новгород"',
  'Самара Арена',
  'Мордовия Арена',
  'Стадион "Калининград"',
  'Екатеринбург Арена',
  'Ростов Арена',
  'Казань Арена',
  'Волгоград Арена'
];

// Команды
export const TEAMS = [
  'Россия',
  'Германия', 
  'Бразилия',
  'Аргентина',
  'Франция',
  'Испания',
  'Италия',
  'Англия',
  'Португалия',
  'Нидерланды',
  'Бельгия',
  'Хорватия',
  'Польша',
  'Украина',
  'Швейцария',
  'Австрия',
  'Дания',
  'Швеция',
  'Норвегия',
  'Чехия'
];

// Статусы функциональных областей
export const AREA_STATUS = {
  OK: 'OK',
  PROBLEM: 'PROBLEM'
} as const;

export type AreaStatusType = typeof AREA_STATUS[keyof typeof AREA_STATUS];