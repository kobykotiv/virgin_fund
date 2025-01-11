import { z } from "zod";
export declare const AssetSchema: z.ZodObject<{
    symbol: z.ZodString;
    name: z.ZodString;
    market: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    change24h: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    market?: string | undefined;
    price?: number | undefined;
    change24h?: number | undefined;
}, {
    symbol: string;
    name: string;
    market?: string | undefined;
    price?: number | undefined;
    change24h?: number | undefined;
}>;
export declare const TechnicalIndicatorSchema: z.ZodObject<{
    type: z.ZodEnum<["SMA", "EMA", "RSI", "MACD", "BB"]>;
    parameters: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
    parameters: Record<string, number>;
}, {
    type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
    parameters: Record<string, number>;
}>;
export declare const RiskManagementSchema: z.ZodObject<{
    stopLoss: z.ZodNumber;
    takeProfit: z.ZodNumber;
    trailingStop: z.ZodOptional<z.ZodNumber>;
    positionSize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
    trailingStop?: number | undefined;
}, {
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
    trailingStop?: number | undefined;
}>;
export declare const StrategySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    selectedAssets: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        name: z.ZodString;
        market: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        change24h: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        market?: string | undefined;
        price?: number | undefined;
        change24h?: number | undefined;
    }, {
        symbol: string;
        name: string;
        market?: string | undefined;
        price?: number | undefined;
        change24h?: number | undefined;
    }>, "many">;
    strategyType: z.ZodEnum<["DCA", "TRADER", "GRID"]>;
    strategyConfig: z.ZodRecord<z.ZodString, z.ZodAny>;
    technicalIndicators: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["SMA", "EMA", "RSI", "MACD", "BB"]>;
        parameters: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
        parameters: Record<string, number>;
    }, {
        type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
        parameters: Record<string, number>;
    }>, "many">>;
    riskManagement: z.ZodObject<{
        stopLoss: z.ZodNumber;
        takeProfit: z.ZodNumber;
        trailingStop: z.ZodOptional<z.ZodNumber>;
        positionSize: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        stopLoss: number;
        takeProfit: number;
        positionSize: number;
        trailingStop?: number | undefined;
    }, {
        stopLoss: number;
        takeProfit: number;
        positionSize: number;
        trailingStop?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    selectedAssets: {
        symbol: string;
        name: string;
        market?: string | undefined;
        price?: number | undefined;
        change24h?: number | undefined;
    }[];
    strategyType: "DCA" | "TRADER" | "GRID";
    strategyConfig: Record<string, any>;
    riskManagement: {
        stopLoss: number;
        takeProfit: number;
        positionSize: number;
        trailingStop?: number | undefined;
    };
    technicalIndicators?: {
        type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
        parameters: Record<string, number>;
    }[] | undefined;
}, {
    name: string;
    description: string;
    selectedAssets: {
        symbol: string;
        name: string;
        market?: string | undefined;
        price?: number | undefined;
        change24h?: number | undefined;
    }[];
    strategyType: "DCA" | "TRADER" | "GRID";
    strategyConfig: Record<string, any>;
    riskManagement: {
        stopLoss: number;
        takeProfit: number;
        positionSize: number;
        trailingStop?: number | undefined;
    };
    technicalIndicators?: {
        type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
        parameters: Record<string, number>;
    }[] | undefined;
}>;
export type Asset = z.infer<typeof AssetSchema>;
export type TechnicalIndicator = z.infer<typeof TechnicalIndicatorSchema>;
export type RiskManagement = z.infer<typeof RiskManagementSchema>;
export type Strategy = z.infer<typeof StrategySchema>;
//# sourceMappingURL=strategy.d.ts.map