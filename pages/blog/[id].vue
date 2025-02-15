<template>
  <v-container>
    <v-row>
      <v-col>
        <ContentRenderer v-if="post" :value="post" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const id = useRoute().params.id

console.log(id)

const { data: post } = await useAsyncData(`blog`, () => {
  return queryCollection('blog').path(`/blog/${id}`).first()
})
</script>

<style></style>