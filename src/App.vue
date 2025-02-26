<template>
  <div class="app">
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
    <div class="content">
      <div class="panels-container" :class="{ 'has-selection': selectedEntry }">
        <div class="panel-left" :style="selectedEntry ? { width: leftPanelWidth + 'px' } : undefined">
          <DataTable
            v-for="ortsteil in ortsteile"
            :key="ortsteil"
            :data="getDataForOrtsteil(ortsteil)"
            :ortsteil="ortsteil"
            :selectedEntry="selectedEntry"
            :width="selectedEntry ? leftPanelWidth : 1200"
            @select="handleSelect"
          />
        </div>

        <Transition name="slide">
          <div v-if="selectedEntry" class="right-section">
            <div class="resizer" @mousedown="startResize"></div>
            <PreviewPanel
              :selectedEntry="selectedEntry"
              :width="rightPanelWidth"
              class="panel-right"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from './components/DataTable.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import { mockData } from './data/mockData'
import { ref, onMounted, onUnmounted } from 'vue'
import type { TableEntry } from './types/types'

const ortsteile = ['Amern', 'Waldniel', 'Schwalmtal']
const imageError = ref(false)
const imgUrl = new URL('./assets/schwalmtal.jpg', import.meta.url).href
const selectedEntry = ref<TableEntry | null>(null)

// Panel width management
const minLeftWidth = 400
const minRightWidth = 250
const defaultLeftWidth = Math.max(window.innerWidth * 0.6, minLeftWidth)
const leftPanelWidth = ref(defaultLeftWidth)
const rightPanelWidth = ref(Math.max(window.innerWidth - defaultLeftWidth - 10, minRightWidth))

// Window resize handler
const handleResize = () => {
  if (!selectedEntry.value) {
    // No need to adjust panels if nothing is selected
    return
  }
  
  const totalWidth = window.innerWidth - 40 // 40px for content padding
  if (totalWidth < minLeftWidth + minRightWidth + 10) {
    // Window too small, adjust both panels
    leftPanelWidth.value = minLeftWidth
    rightPanelWidth.value = minRightWidth
  } else {
    // Keep proportions but ensure minimums
    const currentTotal = leftPanelWidth.value + rightPanelWidth.value + 10
    const ratio = leftPanelWidth.value / currentTotal
    leftPanelWidth.value = Math.max(Math.floor(totalWidth * ratio), minLeftWidth)
    rightPanelWidth.value = Math.max(totalWidth - leftPanelWidth.value - 10, minRightWidth)
  }
}

// Add window resize listener
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const getDataForOrtsteil = (ortsteil: string) => {
  return mockData.filter(entry => entry.ortsteil === ortsteil)
}

const handleImageError = () => {
  imageError.value = true
  console.error('Failed to load banner image')
}

const handleSelect = (entry: TableEntry | null) => {
  selectedEntry.value = entry
  if (entry) {
    // When selecting, set initial panel widths
    leftPanelWidth.value = defaultLeftWidth
    rightPanelWidth.value = Math.max(window.innerWidth - defaultLeftWidth - 10, minRightWidth)
  }
}

// Resizer functionality
const startResize = (e: MouseEvent) => {
  e.preventDefault()
  
  const startX = e.clientX
  const startLeftWidth = leftPanelWidth.value
  const totalWidth = window.innerWidth - 40 // 40px for content padding
  
  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const newLeftWidth = Math.min(
      Math.max(startLeftWidth + deltaX, minLeftWidth),
      totalWidth - minRightWidth - 10
    )
    leftPanelWidth.value = newLeftWidth
    rightPanelWidth.value = Math.max(totalWidth - newLeftWidth - 10, minRightWidth)
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.app {
  margin: 0;
  padding: 0;
}

.content {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px 40px;
  overflow-x: hidden;
}

.banner {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 40px;
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

.panels-container {
  display: flex;
  position: relative;
  gap: 0;
  min-height: calc(100vh - 400px);
  justify-content: center;
  overflow: hidden;
  margin: 0 -20px; /* Compensate for content padding */
  padding: 0 20px;  /* Add padding back */
  transition: justify-content 0.3s ease;
}

.panels-container.has-selection {
  justify-content: flex-start;
  transition: justify-content 0.3s ease;
}

.panel-left {
  max-width: 1200px;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.right-section {
  display: flex;
  position: relative;
  flex-shrink: 0;
}

.panel-right {
  flex-shrink: 0;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.resizer {
  width: 10px;
  cursor: col-resize;
  background-color: #e5e7eb;
  margin: 2rem 0;
  border-radius: 5px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.resizer:hover {
  background-color: #3B82F6;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .banner {
    height: 200px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .content {
    padding: 0 10px 40px;
  }
  
  .panels-container {
    margin: 0 -10px;
    padding: 0 10px;
  }
}

.hidden {
  display: none;
}
</style>
