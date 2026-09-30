import { create } from 'zustand';
import { AttractionCategory } from '../types';

interface FilterState {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  selectedCategory: AttractionCategory | 'All';
  maxBudget: number;
  selectedInterests: string[];
  onlyOpenNow: boolean;
  sortBy: 'popularity' | 'cheapest' | 'duration';

  setSearchQuery: (query: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedCategory: (cat: AttractionCategory | 'All') => void;
  setMaxBudget: (budget: number) => void;
  toggleInterest: (interest: string) => void;
  setOnlyOpenNow: (open: boolean) => void;
  setSortBy: (sort: 'popularity' | 'cheapest' | 'duration') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedState: 'All',
  selectedCity: 'All',
  selectedCategory: 'All',
  maxBudget: 1500,
  selectedInterests: [],
  onlyOpenNow: false,
  sortBy: 'popularity',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedState: (state) => set({ selectedState: state, selectedCity: 'All' }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setMaxBudget: (budget) => set({ maxBudget: budget }),
  toggleInterest: (interest) =>
    set((state) => ({
      selectedInterests: state.selectedInterests.includes(interest)
        ? state.selectedInterests.filter((i) => i !== interest)
        : [...state.selectedInterests, interest],
    })),
  setOnlyOpenNow: (open) => set({ onlyOpenNow: open }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedState: 'All',
      selectedCity: 'All',
      selectedCategory: 'All',
      maxBudget: 1500,
      selectedInterests: [],
      onlyOpenNow: false,
      sortBy: 'popularity',
    }),
}));
