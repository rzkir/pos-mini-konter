import { View, Text, ScrollView } from 'react-native';

import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';

import SectionTitle from '@/components/ui/SectionTitle';

const Legend = ({ items }: { items: { label: string; color: string; value: number; total?: number }[] }) => {
    const percentage = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
    return (
        <View className="mt-4 flex-row flex-wrap gap-y-2">
            {items.map((item, idx) => (
                <View key={`${item.label}-${idx}`} className="mr-4 flex-row items-center">
                    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                    <Text className="ml-2 text-xs text-gray-700">
                        {item.label}
                        {typeof item.total === 'number' ? ` (${percentage(item.value, item.total)}%)` : ''}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default function Chart({
    chartWidth,
    statusChartData,
    totalTransactions,
    dailyRevenueData,
    formatIDR,
    paymentChartData,
    paymentBarWidth,
    paymentBarSpacing,
    paymentChartContentWidth,
    paymentCountPie,
    financialBarData,
}: ChartProps) {
    return (
        <View className="px-4 mt-4">
            <SectionTitle title="Grafik Status Transaksi" />
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                {statusChartData.length === 0 ? (
                    <Text className="text-sm text-gray-500">Belum ada data untuk ditampilkan</Text>
                ) : (
                    <>
                        <PieChart
                            data={statusChartData.map(d => ({ value: d.value, text: d.label, color: d.color }))}
                            radius={chartWidth / 2.8}
                            innerRadius={chartWidth / 5.2}
                            showText
                            textColor={'#111827'}
                            textSize={11}
                            donut
                            isAnimated
                            focusOnPress
                            centerLabelComponent={() => (
                                <View>
                                    <Text className="text-[10px] text-gray-500 text-center">Total</Text>
                                    <Text className="text-base font-bold text-gray-900 text-center">{totalTransactions}</Text>
                                </View>
                            )}
                        />
                        <Legend items={statusChartData.map(i => ({ label: i.label, color: i.color, value: i.value, total: totalTransactions }))} />
                    </>
                )}
            </View>

            <SectionTitle title="Pendapatan Harian" />
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                {dailyRevenueData.length === 0 ? (
                    <Text className="text-sm text-gray-500">Belum ada data untuk ditampilkan</Text>
                ) : (
                    <LineChart
                        data={dailyRevenueData}
                        width={chartWidth - 16}
                        thickness={3}
                        color={'#2563eb'}
                        curved
                        areaChart
                        startFillColor={'#60a5fa'}
                        endFillColor={'#60a5fa'}
                        startOpacity={0.25}
                        endOpacity={0.01}
                        hideDataPoints={false}
                        dataPointsColor={'#2563eb'}
                        yAxisTextStyle={{ color: '#6b7280', fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: '#374151', fontSize: 10 }}
                        formatYLabel={(val: string) => formatIDR(Number(val)).replace('Rp', '').trim()}
                        rulesColor={'#f3f4f6'}
                        rulesType={'dashed'}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        isAnimated
                    />
                )}
            </View>

            <SectionTitle title="Grafik Pendapatan per Metode" />
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                {paymentChartData.length === 0 ? (
                    <Text className="text-sm text-gray-500">Belum ada data untuk ditampilkan</Text>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
                        <BarChart
                            data={paymentChartData.map(d => ({ value: d.value, label: d.label, frontColor: '#2563eb', gradientColor: '#60a5fa' }))}
                            width={paymentChartContentWidth}
                            barWidth={paymentBarWidth}
                            spacing={paymentBarSpacing}
                            noOfSections={4}
                            yAxisTextStyle={{ color: '#6b7280', fontSize: 10 }}
                            formatYLabel={(val: string) => formatIDR(Number(val)).replace('Rp', '').trim()}
                            xAxisLabelTextStyle={{ color: '#374151', fontSize: 12 }}
                            showGradient
                            barBorderRadius={6}
                            roundedTop
                            showValuesAsTopLabel
                            topLabelTextStyle={{ color: '#111827', fontSize: 10, fontWeight: '600' }}
                            rulesColor={'#f3f4f6'}
                            rulesType={'dashed'}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            isAnimated
                            renderTooltip={(item: { value?: number; label?: string }) => (
                                <View className="bg-white rounded px-2 py-1 border border-gray-100">
                                    <Text className="text-xs text-gray-800">{item.label}</Text>
                                    <Text className="text-xs font-semibold text-green-600">{formatIDR((item.value ?? 0) as number)}</Text>
                                </View>
                            )}
                        />
                    </ScrollView>
                )}
            </View>

            <SectionTitle title="Jumlah Transaksi per Metode" />
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                {paymentCountPie.length === 0 ? (
                    <Text className="text-sm text-gray-500">Belum ada data untuk ditampilkan</Text>
                ) : (
                    <>
                        <PieChart
                            data={paymentCountPie.map(d => ({ value: d.value, text: d.label, color: d.color }))}
                            radius={chartWidth / 2.8}
                            showText
                            textColor={'#111827'}
                            textSize={11}
                            isAnimated
                            focusOnPress
                        />
                        <Legend items={paymentCountPie.map(i => ({ label: i.label, color: i.color, value: i.value, total: paymentCountPie.reduce((s, p) => s + p.value, 0) }))} />
                    </>
                )}
            </View>

            <SectionTitle title="Rincian Keuangan" />
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                {financialBarData.length === 0 ? (
                    <Text className="text-sm text-gray-500">Belum ada data untuk ditampilkan</Text>
                ) : (
                    <BarChart
                        data={financialBarData.map(d => ({ ...d, gradientColor: d.frontColor, frontColor: d.frontColor }))}
                        width={chartWidth - 16}
                        barWidth={30}
                        noOfSections={4}
                        yAxisTextStyle={{ color: '#6b7280', fontSize: 10 }}
                        formatYLabel={(val: string) => formatIDR(Number(val)).replace('Rp', '').trim()}
                        xAxisLabelTextStyle={{ color: '#374151', fontSize: 12 }}
                        showGradient
                        barBorderRadius={6}
                        roundedTop
                        showValuesAsTopLabel
                        topLabelTextStyle={{ color: '#111827', fontSize: 10, fontWeight: '600' }}
                        rulesColor={'#f3f4f6'}
                        rulesType={'dashed'}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        isAnimated
                    />
                )}
            </View>
        </View>
    );
}