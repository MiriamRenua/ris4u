<template>
  <div class="preview-panel" :style="{ width: width + 'px' }">
    <div v-if="selectedEntry" class="preview-content">
      <h2>{{ selectedEntry.titel }}</h2>
      <div class="metadata">
        <p>{{ selectedEntry.vorgangsnummer }} | {{ selectedEntry.datum }}</p>
      </div>
      <div class="zusammenfassung">
        {{ selectedEntry.zusammenfassung }}
      </div>
    </div>
    <div v-else class="no-selection">
      <p>Bitte wählen Sie einen Eintrag aus der Tabelle aus</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableEntry } from '../types/types'

defineProps<{
  selectedEntry: TableEntry | null
  width: number
}>()
</script>

<style>
.preview-panel {
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
}

.preview-content {
  max-width: 800px;
  margin: 0 auto;
}

.metadata {
  color: #666;
  margin-bottom: 20px;
}

.zusammenfassung {
  white-space: pre-wrap;
  line-height: 1.6;
}

.no-selection {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #666;
}

h2 {
  color: #1e40af;
  margin-bottom: 10px;
}
</style>