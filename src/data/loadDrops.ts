import type { Drop } from '../lib/types';
import dropsData from './drops.json';

export async function loadDrops(): Promise<Drop[]> {
  try {
    console.log('Loading drops from imported JSON...');
    const drops: Drop[] = dropsData;
    console.log('Successfully loaded drops:', drops.length);
    return drops;
  } catch (error) {
    console.error('Error loading drops:', error);
    throw error;
  }
}

export function shuffleDrops(drops: Drop[]): Drop[] {
  const shuffled = [...drops];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled; // Return all available drops
}
