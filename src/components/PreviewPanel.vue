<template>
  <div class="preview-container" :style="{ width: width + 'px' }">
    <div class="preview-section" :class="{ 'with-document': selectedDocument }">
      <div class="preview-panel">
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
                    class="document-badge"
                    :class="{ active: selectedDocument === dok }"
                    @click="$emit('document-selected', dok)">
                {{ dok }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>Bitte wählen Sie einen Eintrag aus der Tabelle aus</p>
        </div>
      </div>

      <Transition name="slide-up">
        <div v-if="selectedDocument" class="document-preview-wrapper">
          <DocumentPreview
            :document="selectedDocument"
            :width="width"
            class="document-preview-panel"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableEntry } from '../types/types'
import DocumentPreview from './DocumentPreview.vue'

defineProps<{
  selectedEntry: TableEntry | null
  width: number
  selectedDocument: string | null
}>()

defineEmits<{
  (e: 'document-selected', document: string): void
}>()
</script>

<style>
.preview-container {
  height: 100%;
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.preview-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-section.with-document {
  height: 200%;
}

.preview-panel {
  padding: 1.5rem;
  min-height: 50%;
  overflow-y: auto;
  background: white;
  flex: 1;
}

.preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
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

.documents {
  margin-top: auto;
  padding-top: 1.5rem;
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
  cursor: pointer;
  transition: background-color 0.2s;
}

.document-badge:hover {
  background-color: #d1d5db;
}

.document-badge.active {
  background-color: #93c5fd;
  color: #1e40af;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-100%);
}

.document-preview-wrapper {
  min-height: 50%;
  background: white;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e5e7eb;
  overflow: hidden;
}

.document-preview-panel {
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .preview-panel {
    padding: 1rem;
  }
}
</style>