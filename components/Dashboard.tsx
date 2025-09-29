"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const Dashboard: React.FC = () => {
  const [monthlyPrice, setMonthlyPrice] = useState<number>(5);
  const [yearlyPrice, setYearlyPrice] = useState<number>(30);
  const [conversionRate, setConversionRate] = useState<number>(0.0005);
  const [profitMargin, setProfitMargin] = useState<number>(0.7);
  const [retentionMonths, setRetentionMonths] = useState<number>(1);
  const [yearlyRetentionYears, setYearlyRetentionYears] = useState<number>(1);
  const [yearlyRatio, setYearlyRatio] = useState<number>(0.6);
  const [impressions, setImpressions] = useState<number>(1000);
  const [appStoreCut, setAppStoreCut] = useState<number>(0.3);

  const totalSubscribers = useMemo(() => impressions * conversionRate, [impressions, conversionRate]);
  const monthlySubs = useMemo(() => totalSubscribers * (1 - yearlyRatio), [totalSubscribers, yearlyRatio]);
  const yearlySubs = useMemo(() => totalSubscribers * yearlyRatio, [totalSubscribers, yearlyRatio]);
  const revenue = useMemo(() => (monthlySubs * monthlyPrice * retentionMonths + yearlySubs * yearlyPrice * yearlyRetentionYears) * (1 - appStoreCut), [monthlySubs, monthlyPrice, retentionMonths, yearlySubs, yearlyPrice, yearlyRetentionYears, appStoreCut]);
  const clv = useMemo(() => (monthlySubs * monthlyPrice * retentionMonths) + (yearlySubs * yearlyPrice * yearlyRetentionYears), [monthlySubs, monthlyPrice, retentionMonths, yearlySubs, yearlyPrice, yearlyRetentionYears]);
  const profit = useMemo(() => revenue * profitMargin, [revenue, profitMargin]);

  const subscriberData = useMemo(() => [
    { name: 'Monthly', value: monthlySubs, fill: '#3b82f6' },
    { name: 'Yearly', value: yearlySubs, fill: '#10b981' }
  ], [monthlySubs, yearlySubs]);

  const revenueData = useMemo(() => [
    { name: 'Revenue', value: revenue, fill: '#f59e0b' },
    { name: 'CLV', value: clv, fill: '#ef4444' }
  ], [revenue, clv]);

  const profitData = useMemo(() => [
    { name: 'Profit', value: profit, fill: '#10b981' }
  ], [profit]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Influencer Marketing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Monthly Subscription Price ($)</label>
              <Input
                type="number"
                step="1"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Yearly Subscription Price ($)</label>
              <Input
                type="number"
                step="1"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversion & Impressions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion & Impressions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Conversion Rate (%)</label>
              <Slider
                value={[conversionRate]}
                onValueChange={(value) => setConversionRate(value[0])}
                min={0.0001}
                max={0.01}
                step={0.0001}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">{(conversionRate * 100).toFixed(2)}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Yearly to Monthly Ratio (%)</label>
              <p className="text-xs text-muted-foreground mb-2">Percentage of users likely to opt for the yearly subscription</p>
              <Slider
                value={[yearlyRatio * 100]}
                onValueChange={(value) => setYearlyRatio(value[0] / 100)}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">{(yearlyRatio * 100).toFixed(0)}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Impressions</label>
              <Input
                type="number"
                step="1"
                min="1"
                value={impressions}
                onChange={(e) => setImpressions(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profit & Retention Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profit & Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Profit Margin (%)</label>
              <Input
                type="number"
                step="1"
                min="1"
                value={Math.round(profitMargin * 100)}
                onChange={(e) => setProfitMargin(Math.max(0.01, parseInt(e.target.value) / 100 || 0.01))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Retention (months) for Monthly Plan</label>
              <p className="text-xs text-muted-foreground mb-2">Monthly users cancel their sub after {retentionMonths} months</p>
              <Input
                type="number"
                step="1"
                min="1"
                value={retentionMonths}
                onChange={(e) => setRetentionMonths(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Retention (years) for Yearly Plan</label>
              <p className="text-xs text-muted-foreground mb-2">Yearly users cancel their sub after {yearlyRetentionYears} years</p>
              <Input
                type="number"
                step="1"
                min="1"
                value={yearlyRetentionYears}
                onChange={(e) => setYearlyRetentionYears(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">App Store Cut (%)</label>
              <Input
                type="number"
                step="1"
                min="1"
                value={Math.round(appStoreCut * 100)}
                onChange={(e) => setAppStoreCut(Math.max(0.01, parseInt(e.target.value) / 100 || 0.01))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                profit: { label: 'Profit', color: '#10b981' }
              }}
              className="h-[200px] mb-4"
            >
              <PieChart>
                <Pie
                  data={subscriberData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {subscriberData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-3">
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">Total Subscribers</p>
                <p className="text-xs text-muted-foreground mb-1">Total Subscribers = Impressions × Conversion Rate</p>
                <p className="text-sm font-mono">
                  Total Subscribers = {impressions.toLocaleString()} × {(conversionRate * 100).toFixed(2)}% = <strong>{totalSubscribers.toFixed(0)}</strong>
                </p>
              </div>
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">Monthly Subs</p>
                <p className="text-xs text-muted-foreground mb-1">Monthly Subs = Total Subscribers × (1 - Yearly Ratio)</p>
                <p className="text-sm font-mono">
                  Monthly Subs = {totalSubscribers.toFixed(0)} × (1 - {yearlyRatio.toFixed(2)}) = <strong>{monthlySubs.toFixed(0)}</strong>
                </p>
              </div>
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">Yearly Subs</p>
                <p className="text-xs text-muted-foreground mb-1">Yearly Subs = Total Subscribers × Yearly Ratio</p>
                <p className="text-sm font-mono">
                  Yearly Subs = {totalSubscribers.toFixed(0)} × {yearlyRatio.toFixed(2)} = <strong>{yearlySubs.toFixed(0)}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: 'Revenue', color: '#f59e0b' },
                clv: { label: 'CLV', color: '#ef4444' }
              }}
              className="h-[200px] mb-4"
            >
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value">
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="space-y-3">
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">Revenue</p>
                <p className="text-xs text-muted-foreground mb-1">Revenue = (Monthly Subs × Monthly Price × Monthly Retention + Yearly Subs × Yearly Price × Yearly Retention) × (1 - App Store Cut)</p>
                <p className="text-sm font-mono">
                  Revenue = ({monthlySubs.toFixed(0)} × ${monthlyPrice} × {retentionMonths} + {yearlySubs.toFixed(0)} × ${yearlyPrice} × {yearlyRetentionYears}) × (1 - {appStoreCut.toFixed(2)}) = <strong>${revenue.toFixed(2)}</strong>
                </p>
              </div>
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">CLV</p>
                <p className="text-xs text-muted-foreground mb-1">CLV = (Monthly Subs × Monthly Price × Monthly Retention) + (Yearly Subs × Yearly Price × Yearly Retention)</p>
                <p className="text-sm font-mono">
                  CLV = ({monthlySubs.toFixed(0)} × ${monthlyPrice} × {retentionMonths}) + ({yearlySubs.toFixed(0)} × ${yearlyPrice} × {yearlyRetentionYears}) = <strong>${clv.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                monthly: { label: 'Monthly', color: '#3b82f6' },
                yearly: { label: 'Yearly', color: '#10b981' }
              }}
              className="h-[200px] mb-4"
            >
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value">
                  {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="space-y-3">
              <div className="border rounded p-3 bg-muted/50">
                <p className="text-sm font-semibold mb-1">Profit</p>
                <p className="text-xs text-muted-foreground mb-1">Profit = Revenue × Profit Margin</p>
                <p className="text-sm font-mono">
                  Profit = ${revenue.toFixed(2)} × {profitMargin.toFixed(2)} = <strong>${profit.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;