import { format, addDays, subDays } from 'date-fns';
import { PhaseConfig, PhaseData } from '../types/project';

/**
 * Utility for combining class names
 */
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date: Date, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Calculate the number of days between two dates, inclusive
 */
export const getDaysDifference = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Default phases for launch projects
 */
export const defaultPhases: { [key: string]: PhaseConfig } = {
  planning: { name: "Planning", days: 30 },
  acquisition: { name: "Acquisition", days: 21 },
  warmup: { name: "Warm-up", days: 7 },
  event: { name: "Event", days: 3 },
  cart: { name: "Cart Open", days: 7 },
  recovery: { name: "Recovery", days: 14 },
  downsell: { name: "Downsell", days: 7 },
  debriefing: { name: "Debriefing", days: 7 }
};

/**
 * Calculate phases dates based on event date and phase durations
 */
export const calculatePhaseDates = (
  eventDate: Date,
  phases: { [key: string]: PhaseConfig }
): { [key: string]: PhaseData } => {
  const calculatedPhases: { [key: string]: PhaseData } = {};
  let currentDate = new Date(eventDate);

  // Calculate phases retroactively
  const phaseEntries = Object.entries(phases).reverse();
  
  phaseEntries.forEach(([key, phase], index) => {
    if (index === 0) {
      // For the event phase (usually the first in reversed array)
      const endDate = new Date(currentDate);
      const startDate = subDays(endDate, phase.days - 1);
      calculatedPhases[key] = { start: startDate, end: endDate };
      currentDate = subDays(startDate, 1);
    } else {
      const endDate = new Date(currentDate);
      const startDate = subDays(endDate, phase.days - 1);
      calculatedPhases[key] = { start: startDate, end: endDate };
      currentDate = subDays(startDate, 1);
    }
  });

  // Reorder to match original phase order
  const orderedPhases: { [key: string]: PhaseData } = {};
  Object.keys(phases).forEach(key => {
    if (calculatedPhases[key]) {
      orderedPhases[key] = calculatedPhases[key];
    }
  });

  return orderedPhases;
};

/**
 * Get color for a specific phase
 */
export const getPhaseColor = (phaseKey: string): string => {
  const phaseColors: { [key: string]: string } = {
    planning: '#3B82F6',   // Blue
    acquisition: '#10B981', // Green
    warmup: '#F59E0B',     // Amber
    event: '#8B5CF6',      // Purple
    cart: '#EC4899',       // Pink
    recovery: '#F97316',   // Orange
    downsell: '#EF4444',   // Red
    debriefing: '#6B7280'  // Gray
  };

  return phaseColors[phaseKey] || '#6B7280';
};

/**
 * Get the status label and color
 */
export const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string, color: string }> = {
    planning: { label: 'Planning', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
  };

  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
};