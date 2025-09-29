import React, { useMemo, useState, useEffect } from "react";

import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useLanguage } from "../context/LanguageContext";
import { EmptyState } from "./EmptyState";
import { ThemedText } from "./ThemedText";

interface Transaction {
  _id: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  category?: string;
  createdAt?: string;
}

interface AnalyticsChartProps {
  transactions?: Transaction[];
}

interface ChartData {
  month: string;
  income: number;
  expenses: number;
  total: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  transactions = [],
}) => {
  const { t } = useLanguage();
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  // Process transaction data for analytics
  const chartData: ChartData[] = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    // Group transactions by month
    const monthlyData: Record<string, ChartData> = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        key: `${date.getFullYear()}-${date
          .getMonth()
          .toString()
          .padStart(2, "0")}`,
        month: date.toLocaleDateString("en", { month: "short" }),
      };
    }).reverse();

    // Initialize months with zero values
    last6Months.forEach(({ key, month }) => {
      monthlyData[key] = { month, income: 0, expenses: 0, total: 0 };
    });

    // Process transactions
    transactions.forEach((transaction) => {
      if (!transaction.createdAt || !transaction.amount) return;
      const date = new Date(transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${date
        .getMonth()
        .toString()
        .padStart(2, "0")}`;
      if (monthlyData[monthKey]) {
        const amount = Math.abs(transaction.amount);
        if (
          transaction.type === "deposit" ||
          transaction.type === "credit" ||
          transaction.amount > 0
        ) {
          monthlyData[monthKey].income += amount;
          monthlyData[monthKey].total += amount;
        } else {
          monthlyData[monthKey].expenses += amount;
          monthlyData[monthKey].total -= amount;
        }
      }
    });
    return Object.values(monthlyData);
  }, [transactions]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    return chartData.reduce(
      (acc, data) => ({
        income: acc.income + data.income,
        expenses: acc.expenses + data.expenses,
        net: acc.net + data.total,
      }),
      { income: 0, expenses: 0, net: 0 }
    );
  }, [chartData]);

  // Responsive calculations
  const responsiveStyles = useMemo(() => {
    const { width, height } = screenData;
    const isTablet = width > 768;
    const isLandscape = width > height;

    // Dynamic padding based on screen size
    const horizontalPadding = isTablet ? 32 : 16;
    const cardPadding = isTablet ? 28 : 18;

    // Set chart width to a fixed value for compact chart
    const chartWidth = 260;

    // Dynamic chart height
    const baseHeight = isTablet ? 280 : 220;
    const chartHeight =
      isLandscape && !isTablet ? baseHeight * 0.8 : baseHeight;

    // Font sizes
    const legendFontSize = isTablet ? 18 : 14;
    const avgTextFontSize = isTablet ? 18 : 16;
    const chartLabelFontSize = isTablet ? 14 : 11;

    return {
      horizontalPadding,
      cardPadding,
      chartWidth,
      chartHeight,
      legendFontSize,
      avgTextFontSize,
      chartLabelFontSize,
      isTablet,
      isLandscape,
    };
  }, [screenData]);

  if (!transactions || transactions.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { paddingHorizontal: responsiveStyles.horizontalPadding },
        ]}
      >
        <EmptyState
          message={t("home.noTransactions")}
          containerStyle={styles.emptyState}
        />
      </View>
    );
  }

  // Prepare chart-kit data for two lines (USDC, USDT)
  const labels = chartData.map((d) => d.month);
  const usdcValues = chartData.map((d) => d.income);
  const usdtValues = chartData.map((d) => d.expenses);

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: responsiveStyles.horizontalPadding },
      ]}
    >
      <View
        style={[
          styles.cardContainer,
          {
            padding: responsiveStyles.cardPadding,
            marginBottom: responsiveStyles.isLandscape ? 12 : 16,
          },
        ]}
      >
        {/* Custom Legend */}
        <View
          style={[
            styles.legendRow,
            responsiveStyles.isTablet && styles.legendRowTablet,
          ]}
        >
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: "#60A5FA" },
                responsiveStyles.isTablet && styles.legendDotTablet,
              ]}
            />
            <ThemedText
              style={[
                styles.legendLabel,
                { fontSize: responsiveStyles.legendFontSize },
              ]}
            >
              USDC
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: "#2563EB" },
                responsiveStyles.isTablet && styles.legendDotTablet,
              ]}
            />
            <ThemedText
              style={[
                styles.legendLabel,
                { fontSize: responsiveStyles.legendFontSize },
              ]}
            >
              USDT
            </ThemedText>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: usdcValues,
                  color: () => "#60A5FA", // light blue
                  strokeWidth: responsiveStyles.isTablet ? 4 : 3,
                },
                {
                  data: usdtValues,
                  color: () => "#2563EB", // medium blue
                  strokeWidth: responsiveStyles.isTablet ? 4 : 3,
                },
              ],
            }}
            width={260}
            height={responsiveStyles.chartHeight}
            chartConfig={{
              backgroundGradientFrom: "rgba(30,41,59,0.95)",
              backgroundGradientTo: "rgba(30,41,59,0.95)",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200, 210, 230, ${opacity})`,
              style: { borderRadius: 32 },
              propsForDots: {
                r: responsiveStyles.isTablet ? "8" : "6",
                strokeWidth: "3",
                stroke: "#fff",
              },
              propsForBackgroundLines: {
                stroke: "rgba(255,255,255,0.08)",
                strokeWidth: responsiveStyles.isTablet ? "1.5" : "1",
              },
              propsForLabels: {
                fontWeight: "600",
                fontSize: responsiveStyles.chartLabelFontSize,
              },
            }}
            bezier
            style={{
              ...styles.chart,
              borderRadius: 32,
            }}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
          />
        </View>

        {/* Average Monthly Expenditure */}
        <ThemedText
          style={[
            styles.avgText,
            {
              fontSize: responsiveStyles.avgTextFontSize,
              marginTop: responsiveStyles.isTablet ? 16 : 12,
            },
          ]}
        >
          Average Monthly Expenditure :{" "}
          {chartData.length > 0
            ? (totalStats.expenses / chartData.length).toFixed(2)
            : "0.00"}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    position: "relative",
  },
  cardContainer: {
    backgroundColor: "rgba(30,41,59,0.85)",
    borderRadius: 42,
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: "rgba(96,165,250,0.08)",
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: "center",
        width: "auto",
      },
    }),
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 42,
    gap: 10,
    flexWrap: "wrap",
  },
  legendRowTablet: {
    gap: 14,
    marginBottom: 36,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  legendDotTablet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendLabel: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    paddingBottom: 8,
    overflow: "hidden",
  },
  chart: {
    marginVertical: 4,
    backgroundColor: "transparent",
  },
  avgText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    marginBottom: 40,
  },
});
