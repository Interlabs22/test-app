export enum EMatchStatus {
    SCHEDULED = 'scheduled',
    LIVE = 'live',
    FINISHED = 'finished',
    POSTPONED = 'postponed',
}

export interface ITeam {
    id: string;
    name: string;
    city: string;
}

export interface IScore {
    home: number;
    away: number;
}

export interface IMatch {
    id: string;
    startsAt: string | null;
    status: EMatchStatus;
    minute?: number;
    home: ITeam;
    away: ITeam;
    score: IScore | null;
}

export interface IRoundData {
    round: number;
    matches: IMatch[];
}
