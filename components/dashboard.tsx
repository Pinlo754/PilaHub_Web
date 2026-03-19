'use client'

import { Card } from '@/components/ui/card'
import { StatsCards } from './stats-cards'
import { RevenueChart } from './revenue-chart'
import { BestSellingProducts } from './best-selling-products'
import { CoachRanking } from './coach-ranking'
import { RatingCards } from './rating-cards'
import { PageViewsChart } from './page-views-chart'
import { DateRangePicker } from './date-range-picker'

export function Dashboard() {
  return (
    <div className="p-6">
      {/* Top Section with Title and Date Picker */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan</h2>
        <DateRangePicker />
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Left Column - Revenue Chart */}
        <div className="col-span-2">
          <RevenueChart />
        </div>

        {/* Right Column - Best Selling Products */}
        <div>
          <BestSellingProducts />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Coach Ranking */}
        <div className="col-span-1">
          <CoachRanking />
        </div>

        {/* Rating Cards */}
        <div className="col-span-1">
          <RatingCards />
        </div>

        {/* Page Views Chart */}
        <div className="col-span-1">
          <PageViewsChart />
        </div>
      </div>
    </div>
  )
}
