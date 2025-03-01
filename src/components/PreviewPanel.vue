<template>
  <div class="preview-container" :style="{ width: width + 'px' }">
    <div class="preview-section" :class="{ 'with-document': selectedDocument }">
      <div class="preview-panel">
        <div v-if="selectedEntry" class="preview-content">
          <h3>{{ selectedEntry.titel }}</h3>
          <div class="metadata">
            <p>{{ selectedEntry.vorgangsnummer }} | {{ selectedEntry.datum }}</p>
          </div>
          <div 
            ref="summaryRef"
            class="zusammenfassung"
            :class="{ 'truncated': shouldTruncate }"
          >
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
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{
  selectedEntry: TableEntry | null
  width: number
  selectedDocument: string | null
}>()

defineEmits<{
  (e: 'document-selected', document: string): void
}>()

const summaryRef = ref<HTMLElement | null>(null)
const shouldTruncate = ref(false)

const checkTruncation = async () => {
  await nextTick()
  if (!summaryRef.value) return
  
  const container = summaryRef.value.closest('.preview-panel')
  if (!container) return

  const containerHeight = container.clientHeight
  const docsSection = container.querySelector('.documents')
  const docsSectionHeight = docsSection?.clientHeight || 0
  const metadataSection = container.querySelector('.metadata')
  const metadataHeight = metadataSection?.clientHeight || 0
  const titleSection = container.querySelector('h3')
  const titleHeight = titleSection?.clientHeight || 0
  const padding = 48 // Sum of vertical paddings and margins

  const availableHeight = containerHeight - docsSectionHeight - metadataHeight - titleHeight - padding
  const contentHeight = summaryRef.value.scrollHeight

  shouldTruncate.value = contentHeight > availableHeight
}

// Watch for changes that might affect layout
watch(() => props.selectedDocument, checkTruncation)
watch(() => props.selectedEntry, checkTruncation)
watch(() => props.width, checkTruncation)

onMounted(() => {
  checkTruncation()
  
  // Create ResizeObserver to check truncation on container resize
  const resizeObserver = new ResizeObserver(checkTruncation)
  if (summaryRef.value) {
    resizeObserver.observe(summaryRef.value.closest('.preview-panel') || summaryRef.value)
  }
})
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
  gap: 1rem;
  position: relative;
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
  font-size: 0.875rem;
  margin: 0;
}

.zusammenfassung {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
  font-size: 0.875rem;
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

.zusammenfassung.truncated {
  mask-image: linear-gradient(to bottom, black calc(100% - 2rem), transparent 100%);
  padding-bottom: 1.5rem;
}

.zusammenfassung.truncated::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  color: #374151;
  background: white;
  padding: 0 0.5rem;
  font-weight: bold;
}

.documents {
  margin-top: 0;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
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