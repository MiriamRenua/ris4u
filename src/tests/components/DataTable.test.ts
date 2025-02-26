import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataTable from '../../components/DataTable.vue';
import type { TableEntry } from '../../types/types';

const mockEntries: TableEntry[] = [
  {
    vorgangsnummer: 'AM-2023-001',
    datum: '01.01.2023',
    titel: 'Test Titel 1',
    dokumente: ['dok1.pdf'],
    zusammenfassung: 'Test Zusammenfassung 1',
    ortsteil: 'Amern'
  },
  {
    vorgangsnummer: 'AM-2023-002',
    datum: '02.01.2023',
    titel: 'Test Titel 2',
    dokumente: ['dok2.pdf'],
    zusammenfassung: 'Test Zusammenfassung 2',
    ortsteil: 'Amern'
  }
];

describe('DataTable', () => {
  it('renders properly', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockEntries,
        ortsteil: 'Amern'
      }
    });
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Amern');
  });

  it('filters data correctly', async () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockEntries,
        ortsteil: 'Amern'
      }
    });

    const input = wrapper.find('input[placeholder="Vorgangsnummer Filter"]');
    await input.setValue('001');

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].text()).toContain('AM-2023-001');
  });

  it('sorts data correctly', async () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockEntries,
        ortsteil: 'Amern'
      }
    });

    await wrapper.find('th:first-child').trigger('click');
    const rows = wrapper.findAll('tbody tr');
    expect(rows[0].text()).toContain('AM-2023-001');
  });
});
