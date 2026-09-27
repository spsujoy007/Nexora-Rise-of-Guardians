import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function AQITrendChart({ data }: { data: Array<{ day: string; aqi: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F6FF0" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#2F6FF0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3F" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#8792A8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8792A8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0B1120', border: '1px solid #1E2A3F', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#EAF2FF' }}
        />
        <Area type="monotone" dataKey="aqi" stroke="#2F6FF0" strokeWidth={2} fill="url(#aqiFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
