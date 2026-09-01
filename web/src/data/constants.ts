/** Top 10 Zimbabwean seed cities for the location switcher */
export const ZIM_CITIES = [
  { id: 'harare',     name: 'Harare' },
  { id: 'bulawayo',   name: 'Bulawayo' },
  { id: 'mutare',     name: 'Mutare' },
  { id: 'gweru',      name: 'Gweru' },
  { id: 'kwekwe',     name: 'Kwekwe' },
  { id: 'kadoma',     name: 'Kadoma' },
  { id: 'masvingo',   name: 'Masvingo' },
  { id: 'chinhoyi',   name: 'Chinhoyi' },
  { id: 'marondera',  name: 'Marondera' },
  { id: 'victoria-falls', name: 'Victoria Falls' },
] as const

export type CityId = typeof ZIM_CITIES[number]['id']

/** 11 community categories */
export const CATEGORIES = [
  { id: 'all',            label: 'All' },
  { id: 'marketplace',    label: 'Marketplace' },
  { id: 'services',       label: 'Services' },
  { id: 'property',       label: 'Property' },
  { id: 'jobs',           label: 'Jobs' },
  { id: 'vehicles',       label: 'Vehicles' },
  { id: 'agriculture',    label: 'Agriculture' },
  { id: 'electronics',    label: 'Electronics' },
  { id: 'food',           label: 'Food & Beverage' },
  { id: 'education',      label: 'Education' },
  { id: 'health',         label: 'Health' },
  { id: 'community',      label: 'Community' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']
