import { supabase } from '@/lib/supabase/client'

export const MedecinService = {
  async getSpecialites() {
    const { data, error } = await supabase.from('specialites').select('*')
    if (error) throw error
    return data
  },

  async getGradesTitres() {
    const { data, error } = await supabase.from('grades_titres').select('*')
    if (error) throw error
    return data
  },

  async getLangues() {
    const { data, error } = await supabase.from('langues').select('*')
    if (error) throw error
    return data
  },

  async createMedecinInfo(userId: string, infos: any) {
    const { data, error } = await supabase
      .from('medecin_infos')
      .insert({
        user_id: userId,
        ...infos
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMedecinInfo(userId: string, infos: any) {
    const { data, error } = await supabase
      .from('medecin_infos')
      .update(infos)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getMedecinInfo(userId: string) {
    const { data, error } = await supabase
      .from('medecin_infos')
      .select('*, specialite:specialites(*), grade_titre:grades_titres(*)')
      .eq('user_id', userId)
      .single()

    if (error && !error.message.includes('No rows found')) throw error
    return data
  },

  async setMedecinLangues(medecinId: string, langueIds: number[]) {
    // Supprimer d'abord les anciennes associations
    await supabase.from('medecin_langues').delete().eq('medecin_id', medecinId)

    // Ajouter les nouvelles associations
    const { error } = await supabase
      .from('medecin_langues')
      .insert(langueIds.map(langue_id => ({ medecin_id: medecinId, langue_id })))

    if (error) throw error
  },

  async getMedecinLangues(medecinId: string) {
    const { data, error } = await supabase
      .from('medecin_langues')
      .select('langue_id')
      .eq('medecin_id', medecinId)

    if (error) throw error
    return data.map(item => item.langue_id)
  }
}