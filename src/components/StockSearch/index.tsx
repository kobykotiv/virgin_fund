import { useState, useRef, useCallback, useEffect } from "react";
import { Search, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { ErrorMessage } from "../ui/error-message";
import { RawDataPopover } from "../ui/raw-data-popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { AssetList } from "./AssetList";
import { SearchResults } from "./SearchResults";
import { useToast } from "../ui/use-toast";
import { useSearch } from "@/lib/hooks/useSearch";

// Debug mode check
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true";

interface StockSearchProps {
  onSelect: (symbol: string) => void;
  selectedAssets: string[];
}

const MAX_ASSETS = 20;
const DEBOUNCE_DELAY = 300;

export function StockSearch({ onSelect, selectedAssets }: StockSearchProps) {
  const { toast } = useToast();
  const { results, loading, error, search } = useSearch();
  const [query, setQuery] = useState("");
  const [rawResponse] = useState<any>(null);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const assetListRef = useRef<HTMLDivElement>(null);

  // Debug toast helper
  const debugToast = useCallback(
    (
      title: string,
      description: string,
      type: "default" | "error" = "default",
    ) => {
      if (!DEBUG_MODE) return;

      toast({
        title,
        description,
        variant: type === "error" ? "destructive" : "default",
        className: cn(
          "debug-toast",
          "border-2",
          type === "error" ? "border-red-500" : "border-blue-500",
          "bg-black/80",
        ),
        duration: 5000,
      });
    },
    [toast],
  );

  // Scroll handlers for asset list
  const scrollAssetList = (direction: "left" | "right") => {
    if (assetListRef.current) {
      const scrollAmount = 200;
      const targetScroll =
        assetListRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      assetListRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      search(debouncedQuery);
    } else {
      // Clear results when query is too short
    }
  }, [debouncedQuery, search]);

  const handleSelect = async (symbol: string) => {
    try {
      if (!validateSymbol(symbol)) {
        const errorMessage =
          "Invalid symbol format. Use 1-5 alphanumeric characters.";
        debugToast("Validation Error", errorMessage, "error");
        return;
      }

      if (selectedAssets.includes(symbol)) {
        const errorMessage = "This symbol is already selected.";
        debugToast("Duplicate Symbol", errorMessage, "error");
        return;
      }

      if (selectedAssets.length >= MAX_ASSETS) {
        const errorMessage = `Maximum ${MAX_ASSETS} assets allowed.`;
        debugToast("Asset Limit", errorMessage, "error");
        return;
      }

      debugToast("Symbol Selected", `Adding symbol: ${symbol}`);
      onSelect(symbol);
      // setQuery('');
      // setResults([]); // We need the ability for the user to select multiple assets
      // setActiveIndex(-1); // Do NOT go to the next screen right now
    } catch (error) {
      const errorMessage = "Failed to validate ticker. Please try again.";
      console.error("Selection error:", error);
      debugToast("Selection Error", errorMessage, "error");
    }
  };

  const validateSymbol = (symbol: string): boolean => {
    const symbolRegex = /^[A-Z0-9.]{1,5}$/;
    const isValid = symbolRegex.test(symbol.toUpperCase());

    if (DEBUG_MODE && !isValid) {
      debugToast(
        "Symbol Validation",
        `Invalid symbol: "${symbol}". Must be 1-5 alphanumeric characters.`,
        "error",
      );
    }

    return isValid;
  };

  return (
    <div className="w-full space-y-4">
      {/* Asset List */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={() => scrollAssetList("left")}
            className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg
                     hover:bg-white/20 transition-all duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <AssetList
          ref={assetListRef}
          selectedAssets={selectedAssets}
          onRemove={(symbol) => {
            debugToast("Symbol Removed", `Removing symbol: ${symbol}`);
            onSelect(symbol);
          }}
        />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={() => scrollAssetList("right")}
            className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg
                     hover:bg-white/20 transition-all duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "bg-white/10 backdrop-blur-lg border border-white/20",
            "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
            "focus-within:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
            "transition-all duration-300",
          )}
        >
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value.toUpperCase());
            }}
            placeholder="Search stocks..."
            className={cn(
              "pl-12 pr-12 py-6 text-lg",
              "bg-transparent border-none",
              "placeholder:text-white/50",
              "focus:ring-0 focus:border-none",
              "transition-all duration-300",
            )}
            disabled={selectedAssets.length >= MAX_ASSETS}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white/70" />
            ) : (
              <Search className="w-5 h-5 text-white/70" />
            )}
          </div>
          {query && (
            <button
              onClick={() => {
                setQuery("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white
                       transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Raw Data Tooltip */}
        <div className="absolute right-4 -bottom-12">
          <RawDataPopover
            data={rawResponse}
            title="Raw Search Results"
            className="text-muted-foreground/70 hover:text-muted-foreground"
          />
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            error={error.message || "An error occurred"}
            className="mt-2"
          />
        )}

        {/* Search Results */}
        <SearchResults
          results={results}
          loading={loading}
          error={error ? error.message : null}
          query={query}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
