import { createClient } from '@supabase/supabase-js';
import { WorldEntity, FactionType, ContainmentClass, HazardLevel } from '../types';
import { INITIAL_ENTITIES } from '../constants';

// NOTE: In a real environment, these should be process.env.VITE_SUPABASE_URL
// Since we are in a demo environment, we will fallback to mocks if keys are missing.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const fetchEntities = async (): Promise<WorldEntity[]> => {
  if (!supabase) {
    console.warn("Supabase credentials missing. Falling back to local data.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return INITIAL_ENTITIES;
  }

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching entities:', error);
    return INITIAL_ENTITIES;
  }

  // Map DB columns (snake_case) to TS types (camelCase) if needed, 
  // but Supabase JS client often handles this if typed correctly.
  // Here we assume the DB columns match the mapped object manually for safety.
  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type as any,
    faction: row.faction as FactionType,
    containmentClass: row.containment_class as ContainmentClass,
    hazardLevel: row.hazard_level as HazardLevel,
    status: row.status,
    resonance: row.resonance,
    coordinates: row.coordinates, // JSONB comes back as object
    description: row.description,
    secretData: row.secret_data
  }));
};

export const createEntity = async (entity: WorldEntity): Promise<boolean> => {
  if (!supabase) {
    console.warn("Supabase not connected. Data will not persist.");
    return true; // Mock success
  }

  const dbRow = {
    id: entity.id,
    name: entity.name,
    type: entity.type,
    faction: entity.faction,
    containment_class: entity.containmentClass,
    hazard_level: entity.hazardLevel,
    status: entity.status,
    resonance: entity.resonance,
    coordinates: entity.coordinates,
    description: entity.description,
    secret_data: entity.secretData
  };

  const { error } = await supabase
    .from('entities')
    .insert([dbRow]);

  if (error) {
    console.error('Error creating entity:', error);
    return false;
  }

  return true;
};