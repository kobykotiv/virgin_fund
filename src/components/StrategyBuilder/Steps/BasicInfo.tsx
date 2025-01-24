import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StockSearch } from "@/components/StockSearch";
import { SearchHelpPopover } from "@/components/ui/search-help-popover";
import { useStrategy } from "@/context/StrategyContext";
import { AssetSchema } from "@/types/strategy";

const BasicInfoSchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string(),
  selectedAssets: z
    .array(AssetSchema)
    .min(1, "Select at least one asset")
    .max(20, "Maximum 20 assets allowed"),
});

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

export default function BasicInfo() {
  const { state, dispatch } = useStrategy();
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      name: state.formData.name || "",
      description: state.formData.description || "",
      selectedAssets: state.formData.selectedAssets || [],
    },
  });

  const onSubmit = (data: BasicInfoFormData) => {
    // Extract tickers from selected assets for easier use in backtest
    const formData = {
      ...data,
      tickers: data.selectedAssets.map(asset => asset.symbol)
    };
    dispatch({ type: "UPDATE_FORM", payload: formData });
    dispatch({ type: "SET_STEP", payload: 2 });
  };

  const handleAssetSelect = (symbol: string) => {
    const currentAssets = form.getValues("selectedAssets") || [];
    const assetExists = currentAssets.some((a) => a.symbol === symbol);

    if (assetExists) {
      form.setValue(
        "selectedAssets",
        currentAssets.filter((a) => a.symbol !== symbol)
      );
    } else {
      form.setValue("selectedAssets", [
        ...currentAssets,
        { symbol, name: symbol },
      ]);
    }
  };

  const renderAssetButton = (symbol: string) => (
    <Button
      onMouseDown={(e) => e.preventDefault()}
      key={symbol}
      variant="outline"
      size="sm"
      className="w-full"
      type="button"
      onClick={() => handleAssetSelect(symbol)}
    >
      {symbol}
    </Button>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Let's start by naming your strategy and selecting the assets you
            want to trade.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="My Investment Strategy"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe your investment strategy..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Assets (Max 20)</Label>
              <SearchHelpPopover className="text-muted-foreground hover:text-primary transition-colors" />
            </div>
            <StockSearch
              onSelect={handleAssetSelect}
              selectedAssets={
                form.watch("selectedAssets")?.map((a) => a.symbol) || []
              }
            />
          </div>

          <div className="space-y-4">
            <Label>Popular Stocks</Label>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
              {["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "NFLX"].map(renderAssetButton)}
            </div>

            <Label>Popular ETFs</Label>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
              {["SPY", "QQQ", "DIA", "IWM", "VTI", "VXUS", "BND"].map(renderAssetButton)}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Consumer Discretionary</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["AMZN", "TSLA", "HD", "NKE", "MCD", "SBUX", "LOW", "BKNG"].map(renderAssetButton)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Energy</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["XOM", "CVX", "COP", "SLB", "EOG", "PSX", "VLO", "MPC"].map(renderAssetButton)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Industrials</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["HON", "UNP", "UPS", "BA", "CAT", "GE", "MMM", "LMT"].map(renderAssetButton)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Technology</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["AAPL", "MSFT", "NVDA", "AMD", "INTC", "TSM", "ASML", "AVGO"].map(renderAssetButton)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Healthcare</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["JNJ", "UNH", "PFE", "ABBV", "MRK", "TMO", "DHR", "BMY"].map(renderAssetButton)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Financial</Label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                  {["JPM", "BAC", "WFC", "GS", "MS", "BLK", "C", "AXP"].map(renderAssetButton)}
                </div>
              </div>
            </div>

            <div>
              <Label>Cryptocurrencies (High Risk)</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Layer 1 Solutions (High-Medium Risk)</Label>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                    {["BTC", "ETH", "SOL", "BNB", "ADA", "TRX", "AVAX", "SUI", "TON", "HBAR", "BCH"].map(renderAssetButton)}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Layer 2 Solutions (High-Medium Risk)</Label>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                    {["MATIC", "ARB", "OP", "IMX", "STRK", "CKB", "LRC", "METIS", "ALT", "PHA", "TAIKO", "CTSI", "BOBA"].map(renderAssetButton)}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">DeFi Tokens (High-Higher Risk)</Label>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                    {["UNI", "AAVE", "LINK", "MKR", "SNX", "STETH", "HYPE", "DAI", "JUP", "ENA", "RAY", "INJ", "BNSOL", "LDO", "MSOL"].map(renderAssetButton)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">NFT & Gaming (High-Extreme Risk)</Label>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                {["APE", "SAND", "MANA", "AXS", "RENDER", "FET", "IMX", "GALA", "ENS", "FLOW"].map(renderAssetButton)}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Meme Coins (High-Extreme Risk)</Label>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 mt-1">
                {["DOGE", "SHIB", "TRUMP", "PEPE", "BONK", "PENGU", "FARTCOIN", "WIF", "FLOKI", "SPX", "AI16Z"].map(renderAssetButton)}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
