import { motion, AnimatePresence } from 'framer-motion';
import { SearchHelpPopover } from '../ui/search-help-popover';
import { RawDataPopover } from '../ui/raw-data-popover';
// import { useSearchMetrics } from '@/lib/hooks/useSearchMetrics';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
  onSelect: (symbol: string) => void;
}

export function SearchResults({ results, loading, error, query, onSelect }: SearchResultsProps) {
  // const metrics = useSearchMetrics();

  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-gradient-to-r from-white/5 to-white/10
                     animate-pulse backdrop-blur-lg"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2 && !error) {
    return (
      <div className="mt-4 p-8 text-center rounded-lg
                     bg-white/5 backdrop-blur-lg border border-white/10">
        <p className="text-white/70">No results found</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
            <div className="flex items-center gap-2">
              <RawDataPopover data={results} />
              <SearchHelpPopover />
            </div>
          </div>
          <div className="absolute w-full mt-2 rounded-xl overflow-hidden
                         bg-white/10 backdrop-blur-lg border border-white/20
                         shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          {results.map((result, index) => (
            <motion.button
              key={result.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(result.symbol)}
              className="w-full p-4 text-left hover:bg-white/10
                       border-b border-white/10 last:border-none
                       transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white">
                      {result.symbol}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full
                                   bg-white/20 text-white/70">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{result.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/90">{result.region}</p>
                  <p className="text-xs text-white/50 mt-1">{result.currency}</p>
                </div>

              </div>
              <div className="mt-2 flex justify-between text-xs text-white/50">
                <span>
                  Market: {result.marketOpen} - {result.marketClose} ({result.timezone})
                </span>
                <span>Match: {parseInt(result.matchScore) * 100}%</span>
              </div>
            </motion.button>
          ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
