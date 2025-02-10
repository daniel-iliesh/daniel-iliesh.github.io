<template>
    <v-menu close-delay="100" location="bottom end" open-delay="60" open-on-hover>
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }" />
        </template>

        <AppSheet>
            <slot v-if="$slots.default" />

            <v-list :lines="false" density="compact" nav>
                <v-list-item v-for="(item, i) in items" :key="i" :value="item.code" color="primary"
                    @click="setLocale(item.code)">
                    <template #prepend>
                        <span v-html="item.icon" class="mr-2" />
                        
                    </template>

                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </AppSheet>
    </v-menu>
</template>

<script setup lang="ts">
// Components
import type { LocaleObject } from '@nuxtjs/i18n';
import type { PropType } from 'vue';

const { setLocale } = useI18n();

defineProps({
    items: {
        type: Array as PropType<LocaleObject[]>,
        default: () => ([]),
    },
})
</script>