export type UserRole = 
  | 'admin'
  | 'gestionnaire'
  | 'verificateur'
  | 'user'
  | 'entreprise'
  | 'dgm'
  | 'igf'
  | 'itravail'
  | 'igeneral'
  | 'cnss';

export interface UserProfile {
  id: string
  email: string
  // first_name: string
  // last_name: string
  role: UserRole
  created_at: string
}

// export type UserRole = 'admin' | 'editor' | 'user' | 'guest'
// types/visa.ts
export type Visa = {
  id: string
  visa_number: string
  visa_type: 'single_entry' | 'multiple_entry' | 'transit' | 'official'
  issuing_country: string
  last_name: string
  first_name: string
  birth_date: string
  birth_place: string
  issuing_place: string
  nationality: string
  passport_number: string
  passport_issue_date: string
  visa_category: 'tourist' | 'work' | 'student' | 'transit'
  expiration_date: string
  duration_of_stay: string
  genre: 'Masculin' | 'Féminin'
  photo_url: string | null
  created_at: string
  created_by?: string
  validate?: boolean // Optionnel si vous utilisez cette propriété
}