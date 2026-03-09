<script setup>
    import { RainbowButton } from "@/components/ui/rainbow-button";
    const loginBtn = () => {window.location = '/login'};
</script>

<template>
    <div @click="loginBtn" class="flex min-h-64 items-center justify-center">
        <RainbowButton class="glass-card"> Login </RainbowButton>
    </div>
</template>

<style scoped>

</style>