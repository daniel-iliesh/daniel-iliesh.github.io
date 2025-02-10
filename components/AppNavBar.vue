<template>
    <v-app-bar class="px-3" density="compact" flat>
        <!-- <v-app-bar-nav-icon /> -->
        <!-- <v-avatar class="hidden-md-and-up" color="grey-darken-1" size="32" /> -->

        <v-spacer />

        <ClientOnly>
            <v-tabs align-tabs="center" color="grey-darken-2">
                <v-tab v-for="link in links" :to="link.to" :key="link.to" :text="link.text" />
            </v-tabs>
        </ClientOnly>
        <v-spacer />

        <AppMenu :items="locales">
            <template #activator="{ props }">
                <AppBtn v-bind="props" icon="mdi-translate" />
            </template>
        </AppMenu>

        <ThemeSwitch />

        <!-- <v-avatar class="hidden-sm-and-down" color="grey-darken-1" size="32" /> -->
    </v-app-bar>
</template>

<script lang="ts" setup>

const { t, locales } = useI18n();
const localePath = useLocalePath();

const links = computed(() => [
    {
        text: t('myJourney'),
        to: localePath('/'),
    },
    {
        text: t('projects'),
        to: localePath('/projects'),
    },
    {
        text: t('blog'),
        to: localePath('/blog'),
    },
    {
        text: t('contact'),
        to: localePath('/contact'),
    },
])

</script>

<style></style>
