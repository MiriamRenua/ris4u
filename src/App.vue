<template>
  <div class="app">
    <h1>Gemeinde Schwalmtal - Dokumente</h1>
    <DataTable
      v-for="ortsteil in ortsteile"
      :key="ortsteil"
      :data="getDataForOrtsteil(ortsteil)"
      :ortsteil="ortsteil"
    />
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'
import { mockData } from './data/mockData'

const ortsteile = ['Amern', 'Waldniel', 'Schwalmtal']

const getDataForOrtsteil = (ortsteil: string) => {
  return mockData.filter(entry => entry.ortsteil === ortsteil)
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}
</style>
