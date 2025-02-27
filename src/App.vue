<template>
  <div>
    <div class="banner">
      <img 
        :src="imgUrl" 
        alt="Schwalmtal" 
        class="banner-image"
        @error="handleImageError"
        :class="{ 'hidden': imageError }"
      >
      <div class="banner-overlay">
        <h1>GemeindeKompass – Orientierung für Bürger</h1>
      </div>
    </div>
    <div class="app">
      <DataTable
        v-for="ortsteil in ortsteile"
        :key="ortsteil"
        :data="getDataForOrtsteil(ortsteil)"
        :ortsteil="ortsteil"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'
import { mockData } from './data/mockData'
import { ref } from 'vue'

const ortsteile = ['Amern', 'Waldniel', 'Schwalmtal']
const imageError = ref(false)
const imgUrl = new URL('./assets/schwalmtal.jpg', import.meta.url).href

const getDataForOrtsteil = (ortsteil: string) => {
  return mockData.filter(entry => entry.ortsteil === ortsteil)
}

const handleImageError = () => {
  imageError.value = true
  console.error('Failed to load banner image')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family: 'Inter', sans-serif;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.banner {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.banner-image[data-error="true"],
.banner-image:not([src]) {
  display: none;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: white;
  font-size: 2.5rem;
  text-align: center;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 0 20px;
}

@media (max-width: 768px) {
  .banner {
    height: 200px;
  }

  h1 {
    font-size: 1.8rem;
  }
}

.hidden {
  display: none;
}
</style>
