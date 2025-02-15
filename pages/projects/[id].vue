<template>
  <v-container>
    <v-row v-if="project?.image">
      <v-col>
        <v-img height="50vh" :src="project?.image" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ContentRenderer v-if="project" :value="project" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const id = useRoute().params.id

console.log(id)

const { data: project } = await useAsyncData(`projects`, () => {
  return queryCollection('projects').path(`/projects/${id}`).first()
})
</script>

<style></style>