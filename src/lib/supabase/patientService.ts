import { supabase } from '@/lib/supabase/client'

export const PatientService = {
  async createPatientInfo(userId: string, infos: any) {
    const { data, error } = await supabase
      .from('patient_infos')
      .insert({
        user_id: userId,
        ...infos
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePatientInfo(userId: string, infos: any) {
    const { data, error } = await supabase
      .from('patient_infos')
      .update(infos)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getPatientInfo(userId: string) {
    const { data, error } = await supabase
      .from('patient_infos')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && !error.message.includes('No rows found')) throw error
    return data
  }
}