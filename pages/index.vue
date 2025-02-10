<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h1">Daniel Ilies</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex flex-row align-center">
            <div class="text-h4">Table</div>
            <v-spacer />
            <v-text-field hide-details variant="outlined" prepend-inner-icon="mdi-magnify" placeholder="Search" />
          </v-card-title>
          <v-data-table :headers="headers" :items="items" hide-default-footer>
            <template #item.cuteness="{ item }">
              <ClientOnly>
                <v-rating v-model="item.cuteness" />
              </ClientOnly>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

interface Item {
  name: string;
  breed: string;
  cuteness: number;
}

const headers = ref<{ title: string; value: keyof Item }[]>([
  { title: "Name", value: "name" },
  { title: "Breed", value: "breed" },
  { title: "Cuteness", value: "cuteness" },
]);

const items = ref<Item[]>([
  { name: "Alina", breed: "Human", cuteness: 4 },
  {
    name: "Smoky",
    breed: "Scottish Fold",
    cuteness: 5,
  },
]);
</script>

<style></style>