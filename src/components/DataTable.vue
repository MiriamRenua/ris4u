<template>
  <div class="data-table" :style="{ width: width + 'px' }">
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
              @click="handleRowClick(entry)"
              :class="{ selected: selectedEntry?.vorgangsnummer === entry.vorgangsnummer }"
              class="table-row">
            <td>{{ entry.vorgangsnummer }}</td>
            <td>{{ entry.datum }}</td>
            <td>{{ entry.titel }}</td>
            <td>
              <div class="document-list">
                <span v-for="(dok, index) in entry.dokumente" 
                      :key="index" 
                      class="document-badge"
                      :style="{ backgroundColor: getRandomColor(dok) }">
                  {{ dok }}
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
      >
        Vorherige
      </button>
      <span class="page-info">Seite {{ currentPage }} von {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="pagination-button"
      >
        Nächste
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableEntry, SortDirection, SortKey } from '../types/types'

const props = defineProps<{
  data: TableEntry[]
  ortsteil: string
  selectedEntry: TableEntry | null
  width: number
}>()

const emit = defineEmits<{
  select: [entry: TableEntry | null]
}>()

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
    return aValue < bValue ? 1 : -1
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
const colorCache = new Map()
const getRandomColor = (dokName: string) => {
  if (colorCache.has(dokName)) {
    return colorCache.get(dokName)
  }
  
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
    '#14B8A6', // teal
  ]
  
  const color = colors[Math.floor(Math.random() * colors.length)]
  colorCache.set(dokName, color)
  return color
}

const handleRowClick = (entry: TableEntry) => {
  if (props.selectedEntry?.vorgangsnummer === entry.vorgangsnummer) {
    // Deselect if clicking the same row
    emit('select', null)
  } else {
    // Select new row
    emit('select', entry)
  }
}
</script>

<style scoped>
.data-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 2rem auto;
  padding: 1.5rem;
}

.table-title {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 0.875rem;
}

tr:hover {
  background-color: #f9fafb;
}

.document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.document-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
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
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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
</style>
