// src/lib/utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const calculateAge = (dob?: string): number | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date); // e.g., "24 December 2024"
};
