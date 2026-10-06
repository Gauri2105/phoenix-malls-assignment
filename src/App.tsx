import { useEffect, useMemo, useState } from 'react';

import WorldMap from './components/map/WorldMap';
import MallDetailsCard from './components/mall/MallDetailsCard';
import { mallRepository } from './services/mallService';
import { getMallWithStatus } from './utils/mallStatus';
import type { MallWithStatus } from './types/mall';

function App() {
  const [malls, setMalls] = useState<MallWithStatus[]>([]);
  const [selectedMallId, setSelectedMallId] = useState<string | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMalls() {
      try {
        setLoading(true);

        const data = await mallRepository.getMalls();

        if (mounted) {
          setMalls(data.map((mall) => getMallWithStatus(mall)));
        }
      } catch {
        if (mounted) {
          setError('Unable to load Phoenix Malls.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMalls();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMalls((currentMalls) =>
        currentMalls.map((mall) => getMallWithStatus(mall))
      );
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredMalls = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return malls.filter((mall) => {
      const matchesCountry =
        !selectedCountry || mall.country === selectedCountry;

      const matchesSearch =
        !normalizedSearch ||
        mall.name.toLowerCase().includes(normalizedSearch) ||
        mall.city.toLowerCase().includes(normalizedSearch) ||
        mall.country.toLowerCase().includes(normalizedSearch);

      const matchesFilter = filter === 'ALL' || mall.status === filter;

      return matchesCountry && matchesSearch && matchesFilter;
    });
  }, [malls, search, filter, selectedCountry]);

  const selectedMall = malls.find((mall) => mall.id === selectedMallId) ?? null;

  function handleCountrySelect(country: string) {
    setSelectedCountry(country);
    setSelectedMallId(null);
  }

  function handleBackToWorld() {
    setSelectedCountry(null);
    setSelectedMallId(null);
    setSearch('');
    setFilter('ALL');
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand__mark">P</div>

          <div>
            <h1>Phoenix Malls</h1>
            <p>Explore the world of Phoenix</p>
          </div>
        </div>

        <div className="search-box">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search mall or city..."
            aria-label="Search malls"
          />
        </div>
      </header>

      <section className="map-toolbar">
        <div>
          {selectedCountry ? (
            <>
              <button
                type="button"
                className="back-to-world"
                onClick={handleBackToWorld}
              >
                ← World
              </button>

              <span className="map-toolbar__title">{selectedCountry}</span>

              <span className="map-toolbar__count">
                {filteredMalls.length} Phoenix
                {filteredMalls.length === 1 ? ' Mall' : ' Malls'}
              </span>
            </>
          ) : (
            <>
              <span className="map-toolbar__title">Global Mall Network</span>

              <span className="map-toolbar__count">
                Select a highlighted country
              </span>
            </>
          )}
        </div>

        <div className="filters">
          {(['ALL', 'OPEN', 'CLOSED'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={filter === option ? 'active' : ''}
              onClick={() => setFilter(option)}
            >
              {option === 'ALL' ? 'All' : option}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="state-card">
          <div className="loader"></div>
          <span>Loading Phoenix Malls...</span>
        </div>
      )}

      {error && !loading && (
        <div className="state-card state-card--error">{error}</div>
      )}

      {!loading && !error && (
        <WorldMap
          malls={filteredMalls}
          selectedMallId={selectedMallId}
          selectedCountry={selectedCountry}
          onSelectMall={(mall) => setSelectedMallId(mall.id)}
          onSelectCountry={handleCountrySelect}
        />
      )}

      {selectedMall && (
        <MallDetailsCard
          mall={selectedMall}
          onClose={() => setSelectedMallId(null)}
        />
      )}
    </main>
  );
}

export default App;
