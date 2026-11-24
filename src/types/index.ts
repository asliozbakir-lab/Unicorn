export type UserRole = "SYSTEM_ADMIN" | "MANAGER" | "STAFF" | "READONLY";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  title: string | null;
  department: string | null;
  role: UserRole;
  roleLabel: string;
}

export type ProjectCategory = "INTERNATIONAL" | "NATIONAL" | "CORPORATE" | "INTERNAL";

export type ProjectPhase =
  | "IDEA"
  | "PREPARATION"
  | "SUBMITTED"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";

export type ApplicationType =
  | "PROJECT_CALL"
  | "PROGRAM_APPLICATION"
  | "NETWORK_MEMBERSHIP"
  | "AWARD_COMPETITION";

export type ApplicationStatus =
  | "DRAFT"
  | "PREPARING"
  | "REVIEWING"
  | "SUBMITTED"
  | "EVALUATING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ProjectSummary {
  id: string;
  code: string;
  name: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string | null;
  phase: ProjectPhase;
  phaseLabel: string;
  budgetAmount: number | null;
  currency: string;
  fixedExchangeRate: number | null;
  coordinatorOrg: string | null;
  municipalUnit: string | null;
  startDate: string | null;
  endDate: string | null;
  responsibleUser: {
    id: string;
    name: string;
    title: string | null;
  } | null;
  partnersCount: number;
  tasksCount: number;
}
