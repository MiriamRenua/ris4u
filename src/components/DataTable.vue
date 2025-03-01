<template>
  <div class="table-section" :class="{ 'has-selection': selectedEntry }">
    <div class="data-table" :style="selectedEntry ? { width: tableWidth + 'px' } : undefined">
      <h2 class="table-title">{{ ortsteil }}</h2>
      
      <div class="table-container">
        <table>
          <thead>
            <tr class="header-row">
              <th>
                <div class="header-content">
                  <div @click="sort('vorgangsnummer')">
                    Vorgangsnummer
                    <span v-if="sortKey === 'vorgangsnummer'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </div>
                  <input 
                    v-model="filters.vorgangsnummer"
                    placeholder="Filter..."
                    class="header-filter"
                  />
                </div>
              </th>
              <th>
                <div class="header-content">
                  <div @click="sort('datum')">
                    Datum
                    <span v-if="sortKey === 'datum'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </div>
                  <input 
                    v-model="filters.datum"
                    placeholder="Filter..."
                    class="header-filter"
                  />
                </div>
              </th>
              <th>
                <div class="header-content">
                  <div @click="sort('titel')">
                    Vereinfachter Titel
                    <span v-if="sortKey === 'titel'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </div>
                  <input 
                    v-model="filters.titel"
                    placeholder="Filter..."
                    class="header-filter"
                  />
                </div>
              </th>
              <th>
                <div class="header-content">
                  <div>Dokumente</div>
                  <input 
                    v-model="filters.dokumente"
                    placeholder="Filter..."
                    class="header-filter"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in paginatedData" 
                :key="entry.vorgangsnummer"
                @click="handleRowClick(entry, $event)"
                :class="{ selected: selectedEntry?.vorgangsnummer === entry.vorgangsnummer }"
                class="table-row">
              <td>{{ entry.vorgangsnummer }}</td>
              <td>{{ entry.datum }}</td>
              <td>{{ entry.titel }}</td>
              <td>
                <div class="document-list">
                  <span v-for="(dok, index) in entry.dokumente.slice(0, 2)" 
                        :key="index" 
                        class="document-badge"
                        :style="{ backgroundColor: getRandomColor(dok) }">
                    {{ dok }}
                  </span>
                  <span v-if="entry.dokumente.length > 2"
                        class="document-badge more-badge"
                        :title="`${entry.dokumente.length - 2} weitere Dokumente`">
                    ...
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-button"
          aria-label="Vorherige Seite"
        >
          &lt;
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-button"
          aria-label="Nächste Seite"
        >
          &gt;
        </button>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="selectedEntry" class="right-section">
        <div class="resizer" @mousedown="startResize"></div>
        <PreviewPanel
          :selectedEntry="selectedEntry"
          :width="previewWidth"
          :selectedDocument="selectedDocument"
          class="preview-panel"
          @document-selected="(doc) => selectedDocument = selectedDocument === doc ? null : doc"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { TableEntry, SortDirection, SortKey } from '../types/types'
import PreviewPanel from './PreviewPanel.vue'

const props = defineProps<{
  data: TableEntry[]
  ortsteil: string
}>()

// Local state management
const selectedEntry = ref<TableEntry | null>(null)
const minTableWidth = 400
const minPreviewWidth = 250
const defaultTableWidth = Math.max(window.innerWidth * 0.6, minTableWidth)
const tableWidth = ref(defaultTableWidth)
const previewWidth = ref(Math.max(window.innerWidth - defaultTableWidth - 10, minPreviewWidth))

const itemsPerPage = 10
const currentPage = ref(1)
const sortKey = ref<SortKey>('vorgangsnummer')
const sortDirection = ref<SortDirection>('asc')
const filters = ref({
  vorgangsnummer: '',
  datum: '',
  titel: '',
  dokumente: ''
})

const filteredData = computed(() => {
  return props.data.filter(item => {
    const matchVorgangsnummer = item.vorgangsnummer
      .toLowerCase()
      .includes(filters.value.vorgangsnummer.toLowerCase())
    const matchTitel = item.titel
      .toLowerCase()
      .includes(filters.value.titel.toLowerCase())
    const matchDatum = item.datum
      .toLowerCase()
      .includes(filters.value.datum.toLowerCase())
    const matchDokumente = filters.value.dokumente === '' || 
      item.dokumente.some(dok => 
        dok.toLowerCase().includes(filters.value.dokumente.toLowerCase())
      )
    return matchVorgangsnummer && matchTitel && matchDatum && matchDokumente
  })
})

const sortedData = computed(() => {
  const result = [...filteredData.value].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]
    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? -1 : 1
  })
  console.log('Sorted data:', result)
  return result
})

const totalPages = computed(() => 
  Math.ceil(sortedData.value.length / itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  const result = sortedData.value.slice(start, end)
  console.log('Paginated data:', result)
  return result
})

watch(paginatedData, (newVal) => {
  console.log('Updated paginated data:', newVal)
})

function sort(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// Add this new function for document badge colors
const getRandomColor = (dokName: string) => {
  // Fixed colors for document types
  if (dokName.startsWith('Beschluss_')) {
    return '#F97316' // Orange-500 from Tailwind, good contrast with white
  }
  if (dokName.startsWith('Anlage_')) {
    return '#4B5563' // Gray-600 from Tailwind, good contrast with white
  }
  
  // Fallback color (shouldn't be needed anymore)
  return '#3B82F6'
}

const handleRowClick = (entry: TableEntry, e: MouseEvent) => {
  if (selectedEntry.value?.vorgangsnummer === entry.vorgangsnummer) {
    selectedEntry.value = null
  } else {
    selectedEntry.value = entry
    selectedDocument.value = null // Reset document selection when selecting new entry
    // Reset widths when selecting new entry
    tableWidth.value = defaultTableWidth
    previewWidth.value = Math.max(window.innerWidth - defaultTableWidth - 10, minPreviewWidth)
    
    // Wait for the DOM to update
    nextTick(() => {
      // Get the clicked table section instead of using document.querySelector
      const tableSection = (e.target as HTMLElement).closest('.table-section')
      if (!tableSection) return

      const previewElement = tableSection.querySelector('.right-section')
      if (previewElement) {
        // Scroll the preview into view within its container
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }
}

// Resizer functionality
const startResize = (e: MouseEvent) => {
  e.preventDefault()
  
  const startX = e.clientX
  const startTableWidth = tableWidth.value
  const target = e.currentTarget as HTMLElement
  const containerWidth = target.closest('.table-section')?.clientWidth || window.innerWidth
  
  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const newTableWidth = Math.min(
      Math.max(startTableWidth + deltaX, minTableWidth),
      containerWidth - minPreviewWidth - 10
    )
    tableWidth.value = newTableWidth
    previewWidth.value = Math.max(containerWidth - newTableWidth - 10, minPreviewWidth)
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Add this after the existing refs
const selectedDocument = ref<string | null>(null)
</script>

<style scoped>
.table-section {
  position: relative;
  display: flex;
  gap: 0;
  justify-content: flex-start;
  margin-bottom: 2rem;
  width: 100%;
  min-width: 0; /* Allow table to shrink below min-content */
  overflow: hidden;
}

.data-table {
  width: 100%;
  min-width: 0; /* Allow content to shrink */
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0;
  padding: 1.5rem;
  transition: width 0.3s ease;
  flex-shrink: 1; /* Allow table to shrink */
  height: 700px;
  display: flex;
  flex-direction: column;
}

.table-container {
  border-radius: 12px;
  overflow-x: auto; /* Allow horizontal scroll within table container if needed */
  overflow-y: hidden;
  border: none;
  flex: 1;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
}

table {
  min-width: 800px; /* Minimum width to prevent layout breaking */
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  flex: 1;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.25;
}

.document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 100%;
  line-height: 1.25;
}

td:last-child {
  max-width: 300px;
  min-width: 200px;
  height: auto;
  vertical-align: middle;
  padding: 0.5rem 1rem;
}

.document-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  margin: 0.125rem 0;
}

.more-badge {
  background-color: #9CA3AF; /* Gray-400 from Tailwind */
  cursor: help;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-filter {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
}

.header-filter:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 0;
  position: relative;
  text-align: center;
}

.pagination-button::before {
  content: attr(aria-label);
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.pagination-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.pagination-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.page-info {
  color: #4b5563;
  font-size: 0.875rem;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f3f4f6;
}

.table-row.selected {
  background-color: #e5e7eb;
}

.zusammenfassung-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-section {
  display: flex;
  position: relative;
  flex-shrink: 0;
  height: 700px; /* Match data-table height */
}

.preview-panel {
  flex-shrink: 0;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  height: 100%;
  overflow: auto;
}

.resizer {
  width: 10px;
  cursor: col-resize;
  background-color: #e5e7eb;
  margin: 1.5rem 0;
  border-radius: 5px;
  transition: background-color 0.2s;
  flex-shrink: 0;
  align-self: stretch;
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

.table-title {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .data-table {
    padding: 1rem;
  }

  td, th {
    padding: 0.75rem;
  }

  .document-list {
    gap: 0.25rem;
  }

  .document-badge {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 1024px) {
  .data-table {
    max-width: none;
    width: 100%;
  }
  
  .table-section.has-selection .data-table {
    width: 100%;
  }

  .right-section {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .preview-panel {
    height: 100vh;
  }
}
</style>
