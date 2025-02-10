<template>
  <AppBtn :icon="theme.global.name.value === 'dark' ? 'mdi-lightbulb' : 'mdi-lightbulb-off'" @click="toggleTheme" />
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify';

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

</script>

<style></style>