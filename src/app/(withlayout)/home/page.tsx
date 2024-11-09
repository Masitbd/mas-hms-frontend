"use client";
import TrendIcon from "@rsuite/icons/Trend";
import FunnelTrendIcon from "@rsuite/icons/FunnelTrend";
import { useGetLastTEDaysIncomeQuery } from "@/redux/api/income-statement/Income.api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "@/app/loading";

const HomePage = () => {
  const { data: incoms, isLoading } = useGetLastTEDaysIncomeQuery(null);

  if (isLoading) {
    <Loading />;
  }

  return (
    <div className="py-2 px-5 w-full">
      {/* total income */}

      <div className="grid grid-cols-3 gap-5 justify-items-center">
        {/* tota income */}
        <div className="w-full h-36 rounded bg-slate-100 text-center flex flex-col items-center justify-center gap-3">
          <h1 className="text-blue-600 text-xl font-bold">Total Paid Amount</h1>
          <p className="font-semibold text-slate-600 text-xl">
            {incoms?.data?.totalIncome}
          </p>
          <p
            className={`font-semibold ${
              incoms?.data?.trend?.type === "increase"
                ? "text-green-600"
                : "text-red-600"
            } text-sm`}
          >
            {incoms?.data?.trend?.type === "increase" ? (
              <>
                + <TrendIcon /> {incoms?.data?.trend?.percentageChange}%
                <span className="text-xs font-light text-black">
                  {" "}
                  based on last 28 days
                </span>
              </>
            ) : (
              <>
                - <FunnelTrendIcon /> {incoms?.data?.trend?.percentageChange}%
                <span className="text-xs font-light text-black">
                  {" "}
                  based on last 28 days
                </span>
              </>
            )}
          </p>
        </div>
        <div className="w-full h-36 rounded bg-blue-100 text-center flex flex-col items-center justify-center gap-3">
          <h1 className="text-neutral-800 text-xl font-bold">Total Doctors</h1>
          <p className="font-semibold text-slate-600 text-xl">
            {incoms?.data?.totalDoctors}
          </p>
        </div>
        <div className="w-full h-36 rounded bg-green-50 text-center flex flex-col items-center justify-center gap-3">
          <h1 className="text-green-700 text-xl font-bold">Total Tests</h1>
          <p className="font-semibold text-slate-600 text-xl">
            {incoms?.data?.totalTests}
          </p>
        </div>
      </div>

      {/* chart */}

      <div className="w-full h-96 mt-10">
        <p className="py-5 text-center font-bold text-lg">
          Last 28 Days Paid Statistics
        </p>
        {/* Set fixed height for container */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={incoms?.data.dailyBreakdown}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" stackId="a" fill="#3498FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HomePage;
