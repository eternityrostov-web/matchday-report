export interface MatchInfo {
  matchNumber: string;
  date: string;
  time: string;
  tournament: string;
  stage: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: string;
  venueManagerName: string;
}

export interface ClientGroups {
  spectators: number;
  vipGuests: number;
  vvipGuests: number;
  mediaRepresentatives: number;
  photographers: number;
}

export interface FunctionalArea {
  code: string;
  name: string;
  status: 'OK' | 'ISSUE';
  comment: string;
}

export interface ReportPhoto {
  id: string;
  uri: string;
  filename: string;
}

export interface MatchReport {
  id: string;
  matchInfo: MatchInfo;
  clientGroups: ClientGroups;
  generalIssues: string;
  functionalAreas: FunctionalArea[];
  drsCompliance: {
    isCompliant: boolean;
    comment: string;
  };
  additionalComments: string;
  photos: ReportPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  matchInfo: MatchInfo;
  clientGroups: ClientGroups;
  generalIssues: string;
  functionalAreas: FunctionalArea[];
  drsCompliance: {
    isCompliant: boolean;
    comment: string;
  };
  additionalComments: string;
  photos: ReportPhoto[];
}