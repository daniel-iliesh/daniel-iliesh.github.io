<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1">Projects</h1>
      </v-col>
    </v-row>
    <div class="masonry">
      <div class="masonry-item" v-for="project in projects" :key="project.id">
        <v-card class="pa-4" :to="project.path" >
          <v-img v-if="project.image" :src="project.image" height="200" cover />
          <v-card-title>
            <div>
              {{ project.title }}
            </div>
            <p class="text-subtitle-2">
              {{ new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', day: 'numeric'
              }) }}
            </p>
          </v-card-title>
          <v-card-text>
            <p>{{ project.description }}</p>
            <div class="d-flex flex-wrap ga-1 mt-2" v-if="project.technologies.length">
              <v-chip v-for="tech in project.technologies" :key="tech" :href="`https://www.google.com/search?q=${tech}`"
                :color="getColor(tech)" @click.stop target="_blank">
                {{ tech }}
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions v-if="project?.links && (project.links.demo || project.links.repo || project.links.blog)">
            <v-btn v-if="project.links.demo" :href="project.links.demo" prepend-icon="mdi-eye"
              target="_blank">Demo</v-btn>
            <v-btn v-if="project.links.repo" :href="project.links.repo" prepend-icon="mdi-github"
              target="_blank">Repository</v-btn>
            <NuxtLink v-if="project.links.blog" :to="project.links.blog">
              <v-btn prepend-icon="mdi-post">Blog</v-btn>
            </NuxtLink>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
const { data: projects } = await useAsyncData(() => queryCollection('projects').all())

const getColor = (seed?: string, hue = 360, saturation = 70, lightness = 80): string => {
  let h: number;

  if (!seed) {
    h = Math.random() * hue;
  } else {
    const hash = seed.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    h = Math.abs(hash) % hue;
  }

  const s = saturation / 100;
  const l = lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r: number, g: number, b: number;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

console.log("projects", projects.value);
</script>

<style scoped>
.masonry {
  /* column-count: 3; */
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}
</style>