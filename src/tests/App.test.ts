import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';

describe('App', () => {
  it('renders all three DataTables', () => {
    const wrapper = mount(App);
    const dataTables = wrapper.findAllComponents({ name: 'DataTable' });
    expect(dataTables.length).toBe(3);
  });

  it('has correct title', () => {
    const wrapper = mount(App);
    expect(wrapper.find('h1').text()).toBe('Gemeinde Schwalmtal - Dokumente');
  });
});