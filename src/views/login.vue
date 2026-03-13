<template>
    <div class="bg" :style="{ backgroundImage: `url(${bgUrl})` }">
        <div class="min-h-dvh flex items-center justify-center p-[4vw]">
            <div class="bg-white rounded-[1em] shadow-lg w-[90%] max-w-[24em] p-[1.5em] flex flex-col items-center">
                <!-- Logo -->
                <slot name="logo">
                    <div class="w-[3.5em] h-[3.5em] bg-green-500 rounded-[0.6em] flex items-center justify-center text-white mb-[1em]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-[1.8em] h-[1.8em]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                    </div>
                </slot>

                <h1 class="text-[1.5em] font-bold text-green-800">{{ title }}</h1>
                <p class="text-gray-500 text-[0.875em] mt-[0.25em] text-center">{{ subtitle }}</p>

                <!-- Google 登录按钮 -->
                <button
                    class="w-full mt-[1.5em] flex items-center justify-center gap-[0.75em] px-[1em] py-[0.75em] border border-gray-300 rounded-[0.6em] text-gray-700 font-medium hover:border-green-500 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="loading"
                    @click="handleLogin"
                >
                    <svg v-if="loading" class="w-[1.25em] h-[1.25em] animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <svg v-else class="w-[1.25em] h-[1.25em]" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {{ buttonText }}
                </button>

                <p class="text-[0.75em] text-gray-400 mt-[1.5em] text-center">
                    <slot name="footer">{{ footerText }}</slot>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { login, getCurrentUser } from '@/utils/db'
import { useRouter } from 'vue-router'
import bgUrl from '@/assets/loginBg.png'

const router = useRouter();

onMounted(async () => {
    const userData = await getCurrentUser();
    if (userData) {
        router.push('/')
    }
})

const props = defineProps({
    title: {
        type: String,
        default: '欢迎回来'
    },
    subtitle: {
        type: String,
        default: '使用您的 Google 账户安全登录'
    },
    buttonText: {
        type: String,
        default: '使用 Google 登录'
    },
    footerText: {
        type: String,
        default: '点击登录即表示您同意我们的服务条款和隐私政策'
    },
    autoLoading: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['login'])

const loading = ref(false)

const handleLogin = () => {
    if (loading.value) return;
    if (props.autoLoading) {
        loading.value = true
    }
    login();
    onMounted(async () => {
        const userData = await getCurrentUser();
        const {d, e} = await supabase
            .from('users')
            .select('*')
            .eq('uid', userData.id);
        if (!d) {
            await supabase
                .from('users')
                .insert([{
                    uid: userData.id
                }]);
        }
    });
    emit('login');
}

const setLoading = (v) => { loading.value = v }
const reset = () => { loading.value = false }

defineExpose({ loading, setLoading, reset })
</script>
