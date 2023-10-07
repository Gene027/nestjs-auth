export interface EmailData {
  name?: string;
  link?: string;
  date?: string;
}

export interface TeamPlayerBadgeEmailData extends EmailData {
  value: string;
}

export interface ScholarBadgeEmailData extends EmailData {
  curriculumName: string;
}

export interface AchieverBadgeEmailData extends EmailData {
  value: string;
}

export interface ProblemSolverBadgeEmailData extends EmailData {
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DabblerBadgeEmailData extends EmailData {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExplorerBadgeEmailData extends EmailData {}

export interface TeamLeaderBadgeEmailData extends EmailData {
  value: string;
}

export interface CompanyInterestEmailData extends EmailData {
  companyName: string;
}

export interface TalentResponseEmailData extends EmailData {
  companyName: string;
  talentName: string;
}

export interface ScheduleInterviewEmailData extends EmailData {
  companyName: string;
}
