<template>
  <v-container>
    <v-row>
      <v-col>
        <v-timeline align="start" side="end">
          <v-timeline-item v-for="(year, i) in years" :key="i" :dot-color="year.color" size="small" icon="mdi-school"
            fill-dot>
            <template #opposite>
              <div :class="`pt-1 headline font-weight-bold text-${year.color}`" v-text="year.year" />
            </template>
            <div>
              <h2 :class="`mt-n1 headline font-weight-light mb-4 text-${year.color}`">
                Lorem ipsum
              </h2>
              <div>
                Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod
                convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an
                salutandi sententiae.
              </div>
            </div>
            <div class="d-flex ga-2 mt-2">
              <v-chip label color="yellow">
                Javascript
              </v-chip>
              <v-chip label color="blue">
                Python
              </v-chip>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

const years = [
  {
    color: 'green',
    year: '1960',
  },
  {
    color: 'green',
    year: '1970',
  },
  {
    color: 'green',
    year: '1980',
  },
  {
    color: 'green',
    year: '1990',
  },
  {
    color: 'blue',
    year: '2000',
  },
  {
    color: 'blue',
    year: '2000',
  },
  {
    color: 'blue',
    year: '2000',
  },
  {
    color: 'blue',
    year: '2000',
  },
  {
    color: 'blue',
    year: '2000',
  },
]

</script>

<style></style>