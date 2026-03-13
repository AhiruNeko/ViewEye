// src/utils/db.js
import { supabase } from '../lib/supabase.js'

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name,
        avatar: user.user_metadata.avatar_url,
        lastSignIn: user.last_sign_in_at
    }
}

export const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    if (error) {
        console.error('Google error:', error.message);
    }
}