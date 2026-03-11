'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Fuel, Gauge, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CarCard from '@/components/cars/CarCard';
import { useSearchParams, useRouter } from 'next/navigation';

const BRANDS = ['Toyota', 'Honda', 'Hyundai', 'Suzuki', 'KIA', 'Mahindra', 'Tata', 'Nissan', 'Ford', 'Mitsubishi'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'km_low', label: 'Lowest KM' },
];

// Placeholder data — replace with API later
const PLACEHOLDER_CARS = [
  { id: '1', title: 'Toyota Fortuner 2022', price: 8500000, km: 45000, fuel: 'Diesel', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80', isFeatured: true, status: 'available', brand: 'Toyota', year: 2022 },
  { id: '2', title: 'Hyundai Creta 2023', price: 5200000, km: 12000, fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80', isFeatured: true, status: 'available', brand: 'Hyundai', year: 2023 },
  { id: '3', title: 'Suzuki Jimny 2023', price: 4800000, km: 8000, fuel: 'Petrol', transmission: 'Manual', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', isFeatured: false, status: 'available', brand: 'Suzuki', year: 2023 },
  { id: '4', title: 'KIA Sportage 2022', price: 6900000, km: 32000, fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', isFeatured: false, status: 'reserved', brand: 'KIA', year: 2022 },
  { id: '5', title: 'Honda Civic 2021', price: 4200000, km: 55000, fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&q=80', isFeatured: false, status: 'available', brand: 'Honda', year: 2021 },
  { id: '6', title: 'Toyota Land Cruiser 2020', price: 15000000, km: 78000, fuel: 'Diesel', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', isFeatured: true, status: 'available', brand: 'Toyota', year: 2020 },
  { id: '7', title: 'Nissan X-Trail 2021', price: 5800000, km: 41000, fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', isFeatured: false, status: 'available', brand: 'Nissan', year: 2021 },
  { id: '8', title: 'Ford Everest 2022', price: 9200000, km: 28000, fuel: 'Diesel', transmission: 'Automatic', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', isFeatured: false, status: 'sold', brand: 'Ford', year: 2022 },
];

interface Filters {
  search: string;
  brand: string;
  fuel: string;
  transmission: string;
  priceRange: [number, number];
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  brand: '',
  fuel: '',
  transmission: '',
  priceRange: [0, 20000000],
  sort: 'newest',
};

function FilterPanel({ filters, setFilters, onReset }: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Brand</p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setFilters({ ...filters, brand: filters.brand === b ? '' : b })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.brand === b
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Fuel Type</p>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              onClick={() => setFilters({ ...filters, fuel: filters.fuel === f ? '' : f })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.fuel === f
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Transmission</p>
        <div className="flex gap-2">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t}
              onClick={() => setFilters({ ...filters, transmission: filters.transmission === t ? '' : t })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.transmission === t
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Price Range</p>
          <span className="text-xs text-red-500 font-medium">
            NPR {(filters.priceRange[0] / 1000000).toFixed(1)}M — {(filters.priceRange[1] / 1000000).toFixed(1)}M
          </span>
        </div>
        <Slider
          min={0}
          max={20000000}
          step={500000}
          value={filters.priceRange}
          onValueChange={(val) => setFilters({ ...filters, priceRange: val as [number, number] })}
          className="mt-2"
        />
      </div>

      {/* Reset */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full border-border text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
}

export default function CarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
  });

  const filtered = PLACEHOLDER_CARS.filter((car) => {
    const matchSearch = car.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchBrand = !filters.brand || car.brand === filters.brand;
    const matchFuel = !filters.fuel || car.fuel === filters.fuel;
    const matchTransmission = !filters.transmission || car.transmission === filters.transmission;
    const matchPrice = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
    return matchSearch && matchBrand && matchFuel && matchTransmission && matchPrice;
  }).sort((a, b) => {
    if (filters.sort === 'price_low') return a.price - b.price;
    if (filters.sort === 'price_high') return b.price - a.price;
    if (filters.sort === 'km_low') return a.km - b.km;
    if (filters.sort === 'oldest') return a.year - b.year;
    return b.year - a.year;
  });

  const activeFilterCount = [
    filters.brand, filters.fuel, filters.transmission,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000 ? 'price' : '',
  ].filter(Boolean).length;

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS, search: filters.search });

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-muted/20 border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-medium mb-2">
              Browse Inventory
            </p>
            <h1 className="text-4xl font-black text-foreground mb-6">All Cars</h1>

            {/* Search bar */}
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search make, model, year..."
                  className="h-11 pl-10 bg-background border-border"
                />
              </div>

              {/* Sort */}
              <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
                <SelectTrigger className="w-48 h-11 bg-background border-border">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 border-border relative lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Active filter badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.brand && (
                  <Badge variant="outline" className="border-red-500/30 text-red-500 gap-1 pr-1">
                    {filters.brand}
                    <button onClick={() => setFilters({ ...filters, brand: '' })} className="hover:bg-red-500/10 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.fuel && (
                  <Badge variant="outline" className="border-red-500/30 text-red-500 gap-1 pr-1">
                    {filters.fuel}
                    <button onClick={() => setFilters({ ...filters, fuel: '' })} className="hover:bg-red-500/10 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.transmission && (
                  <Badge variant="outline" className="border-red-500/30 text-red-500 gap-1 pr-1">
                    {filters.transmission}
                    <button onClick={() => setFilters({ ...filters, transmission: '' })} className="hover:bg-red-500/10 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <Badge className="bg-red-600 text-white text-xs">{activeFilterCount}</Badge>
                )}
              </div>
              <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} />
            </div>
          </aside>

          {/* Car grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-semibold">{filtered.length}</span> cars found
              </p>
            </div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-bold text-foreground mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
                <Button onClick={resetFilters} className="bg-red-600 hover:bg-red-500 text-white">
                  Reset Filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}