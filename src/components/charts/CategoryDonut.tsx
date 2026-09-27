import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#2F6FF0', '#39FF9E', '#FFB020', '#FF4557', '#8792A8']

export function CategoryDonut({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#05070D" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid #1E2A3F', borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#8792A8' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
