// src/utils/db.js
import { supabase } from '../lib/supabase.js'

export const runSQL = async (sql) => {
    const { data, error } = await supabase.rpc('exec_sql', {
        query_text: sql
    })

    if (error) {
        console.error('SQL Error:', error.message)
        throw error
    }

    return data
}