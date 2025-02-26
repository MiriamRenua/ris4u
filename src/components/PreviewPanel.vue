<template>
  <div class="preview-panel" :style="{ width: width + 'px' }">
    <div v-if="selectedEntry" class="preview-content">
      <h3>{{ selectedEntry.titel }}</h3>
      <div class="metadata">
        <p>{{ selectedEntry.vorgangsnummer }} | {{ selectedEntry.datum }}</p>
      </div>
      <div class="zusammenfassung">
        {{ selectedEntry.zusammenfassung }}
      </div>
      <div class="documents">
        <h4>Dokumente</h4>
        <div class="document-list">
          <span v-for="(dok, index) in selectedEntry.dokumente" 
                :key="index" 
                class="document-badge">
            {{ dok }}
          </span>
        </div>
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
  padding: 1.5rem;
  height: calc(100% - 3rem); /* Account for padding */
  overflow-y: auto;
}

.preview-content {
  height: 100%;
}

h3 {
  color: #1e40af;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

h4 {
  color: #4b5563;
  font-size: 1rem;
  margin: 1.5rem 0 0.5rem;
  font-weight: 500;
}

.metadata {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.zusammenfassung {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
  font-size: 0.875rem;
}

.document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.document-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #4b5563;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .preview-panel {
    padding: 1rem;
  }
}
</style>