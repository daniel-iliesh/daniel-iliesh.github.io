<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1">Articles</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="article in articles" :key="article.id">
        <v-card class="pa-4" :to="article.path">
          <v-img v-if="article.image" :src="article.image" height="200" cover />
          <v-card-title>
            <div>
              {{ article.title }}
            </div>
            <p class="text-subtitle-2">{{ new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long', day: 'numeric'
            }) }}</p>
          </v-card-title>
          <v-card-text>
            <p>{{ article.description }}</p>
            <v-chip-group v-if="article.tags.length">
              <v-chip v-for="tech in article.tags" :key="tech" :href="`https://www.google.com/search?q=${tech}`"
                target="_blank">
                {{ tech }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { data: articles } = await useAsyncData(() => queryCollection('blog').all())

console.log("articles", articles.value);

// useSeoMeta({
//   title: home.value?.title,
//   description: home.value?.description
// })
</script>

<style></style>