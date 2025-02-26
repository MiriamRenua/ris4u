<template>
  <div class="data-table">
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
            <th>Dokumente</th>
            <th>
              <div class="header-content">
                <div>Zusammenfassung Dokumente</div>
                <input 
                  v-model="filters.zusammenfassung"
                  placeholder="Filter..."
                  class="header-filter"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in paginatedData" :key="entry.vorgangsnummer">
            <td>{{ entry.vorgangsnummer }}</td>
            <td>{{ entry.datum }}</td>
            <td>{{ entry.titel }}</td>
            <td>
              <ul>
                <li v-for="(dok, index) in entry.dokumente" :key="index">
                  {{ dok }}
                </li>
              </ul>
            </td>
            <td>{{ entry.zusammenfassung }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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
}>()

console.log('Props data:', props.data)

const itemsPerPage = 10
const currentPage = ref(1)
const sortKey = ref<SortKey>('vorgangsnummer')
const sortDirection = ref<SortDirection>('asc')
const filters = ref({
  vorgangsnummer: '',
  datum: '',
  titel: '',
  zusammenfassung: ''
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
    const matchZusammenfassung = item.zusammenfassung
      .toLowerCase()
      .includes(filters.value.zusammenfassung.toLowerCase())
    return matchVorgangsnummer && matchTitel && matchDatum && matchZusammenfassung
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
</script>

<style scoped>
.data-table {
  margin: 20px;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.table-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  position: sticky;
  top: 0;
  z-index: 10;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background-color: #f8fafc;
  transition: background-color 0.2s ease;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.header-content > div {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.header-content > div:hover {
  color: #2563eb;
}

.header-filter {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: calc(100% - 1rem);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: #475569;
}

.header-filter:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.header-filter::placeholder {
  color: #94a3b8;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.25rem;
  color: #475569;
}

li:last-child {
  margin-bottom: 0;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.pagination-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}

.page-info {
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .data-table {
    margin: 1rem;
    padding: 0;
  }

  th, td {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }

  .pagination-button {
    width: 100%;
  }
}
</style>
