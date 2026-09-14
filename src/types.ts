export interface Report {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  status: 'brouillon' | 'final' | 'archivé';
}

export type ReportStatus = Report['status'];

export const CATEGORIES = [
  'Travail',
  'Personnel',
  'Finances',
  'Projet',
  'Réunion',
  'Autre',
] as const;
