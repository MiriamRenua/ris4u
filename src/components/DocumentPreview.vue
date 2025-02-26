<template>
  <div class="document-preview" :style="{ width: width + 'px' }">
    <div v-if="document" class="document-content">
      <h3>{{ document }}</h3>
      <div class="document-text">
        Dies ist ein Beispielinhalt für das ausgewählte Dokument. In einer echten Implementierung würde hier der tatsächliche Inhalt des Dokuments angezeigt werden.
      </div>
    </div>
    <div v-else class="no-selection">
      <p>Bitte wählen Sie ein Dokument aus</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  document: string | null
  width: number
}>()
</script>

<style>
.document-preview {
  padding: 1.5rem;
  height: calc(100% - 3rem);
  overflow-y: auto;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.document-content {
  height: 100%;
}

.document-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>