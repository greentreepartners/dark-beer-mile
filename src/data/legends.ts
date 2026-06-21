/**
 * Dark Beer Mile legends — extracted from Records.xlsx (year row + winner rows).
 * Sorted oldest to newest (top to bottom).
 */
export type LegendEntry = {
	year: number;
	name: string | null;
	href?: string;
};

export const legends: LegendEntry[] = [
	{ year: 2022, name: 'Josh' },
	{ year: 2023, name: 'Troy' },
	{ year: 2024, name: 'Matt E' },
	{ year: 2025, name: 'Troy' },
	{ year: 2026, name: null },
];
