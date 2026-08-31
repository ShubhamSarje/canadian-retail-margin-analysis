import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from 'recharts'
import Tip from './Tip'

const BLUE = '#1E3A5F'
const TERRA = '#B04A3A'
const SAGE = '#4A7C59'
const FAINT = '#C8C2B8'


const SignedLabel = ({ x, y, width, height, value, suffix = '%' }) => {
  const neg = value < 0
  const cx = x + width / 2
  const h = Math.abs(height)
  const cy = neg ? y + h / 2 + 4 : y - 9
  return (
    <text x={cx} y={cy} textAnchor="middle"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        fill: neg ? '#FAF8F5' : '#5C574F',
        fontWeight: neg ? 500 : 400,
      }}>
      {value}{suffix}
    </text>
  )
}

const money = (n) => (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-CA')
const compact = (n) => {
  const a = Math.abs(n)
  const s = n < 0 ? '-$' : '$'
  if (a >= 1e6) return s + (a / 1e6).toFixed(1) + 'M'
  if (a >= 1e3) return s + Math.round(a / 1e3) + 'K'
  return s + a
}

/* ---------- 3. The split ---------- */
export function SplitChart() {
  const data = [
    { name: 'Profitable', profit: 2624271, margin: 24.6, transactions: 4135, sales: 10669516 },
    { name: 'Loss-making', profit: -1102503, margin: -26.0, transactions: 4264, sales: 4246085 },
  ]
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis tickFormatter={compact} axisLine={false} tickLine={false} width={56} />
        <ReferenceLine y={0} stroke="#1A1815" strokeWidth={1} />
        <Tooltip content={<Tip rows={(d) => [
          `${d.transactions.toLocaleString('en-CA')} transactions`,
          `${money(d.sales)} in sales`,
          `${money(d.profit)} profit · ${d.margin}% margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="profit" radius={[2, 2, 0, 0]} animationDuration={1100} animationEasing="ease-out">
          {data.map((d, i) => <Cell key={i} fill={d.profit < 0 ? TERRA : SAGE} />)}
          <LabelList dataKey="margin" content={<SignedLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 4a. Category ---------- */
export function CategoryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 56, left: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={compact} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={110} />
        <Tooltip content={<Tip rows={(d) => [
          `${money(d.sales)} in sales`,
          `${money(d.profit)} profit`,
          `${d.margin}% margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="profit" radius={[0, 2, 2, 0]} animationDuration={1000} animationEasing="ease-out">
          {data.map((d, i) => <Cell key={i} fill={d.margin < 5 ? TERRA : BLUE} />)}
          <LabelList dataKey="margin" position="right"
            formatter={(v) => `${v}%`}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fill: '#5C574F' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 4b. Furniture subcategory ---------- */
export function FurnitureChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 56, left: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={compact} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={140} />
        <ReferenceLine x={0} stroke="#1A1815" strokeWidth={1} />
        <Tooltip content={<Tip rows={(d) => [
          `${money(d.sales)} in sales`,
          `${money(d.profit)} profit`,
          `${d.margin}% margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="profit" radius={2} animationDuration={1000} animationEasing="ease-out">
          {data.map((d, i) => <Cell key={i} fill={d.profit < 0 ? TERRA : BLUE} />)}
          <LabelList dataKey="margin" position="right"
            formatter={(v) => `${v}%`}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fill: '#5C574F' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 5. The suspects ---------- */
export function SuspectsChart({ data, metric }) {
  const isDiscount = metric === 'discount'
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ top: 22, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false}
          tick={{ fontSize: 10 }} interval={0}
          tickFormatter={(v) => (v.length > 12 ? v.split(' ')[0] : v)} />
        <YAxis axisLine={false} tickLine={false} width={44}
          tickFormatter={(v) => (isDiscount ? `${v}%` : `$${v}`)} />
        <Tooltip content={<Tip rows={(d) => [
          isDiscount ? `${d.discount}% average discount` : `$${d.shipping} average shipping`,
          `${d.actualMargin}% actual margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey={isDiscount ? 'discount' : 'shipping'} radius={[2, 2, 0, 0]}
          animationDuration={900} animationEasing="ease-out">
          {data.map((d, i) => (
            <Cell key={i} fill={isDiscount ? FAINT : (d.actualMargin < 0 ? TERRA : BLUE)} />
          ))}
          <LabelList dataKey={isDiscount ? 'discount' : 'shipping'} position="top"
            formatter={(v) => (isDiscount ? `${v}%` : `$${v}`)}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: '#5C574F' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 6. The threshold (centrepiece) ---------- */
export function ThresholdChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 34, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="band" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} width={48} />
        <ReferenceLine y={0} stroke="#1A1815" strokeWidth={1.5} />
        <Tooltip content={<Tip rows={(d) => [
          `${d.transactions.toLocaleString('en-CA')} transactions`,
          `${money(d.profit)} profit`,
          `${d.margin}% margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="margin" radius={[2, 2, 0, 0]}
          animationDuration={1500} animationBegin={200} animationEasing="ease-out">
          {data.map((d, i) => (
            <Cell key={i} fill={d.margin < 0 ? TERRA : (d.margin > 15 ? SAGE : BLUE)} />
          ))}
          <LabelList dataKey="margin" content={<SignedLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 7a. Ship mode target vs actual ---------- */
export function ShipModeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={116}
          tick={{ fontSize: 11 }} />
        <Tooltip content={<Tip rows={(d) => [
          `${d.service} service`,
          `Target ${d.target}% · Actual ${d.actual}%`,
          `${money(d.sales)} in sales`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="target" fill={FAINT} radius={[0, 2, 2, 0]} animationDuration={800} />
        <Bar dataKey="actual" radius={[0, 2, 2, 0]} animationDuration={1000} animationBegin={300}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.target - d.actual > 4 ? TERRA : SAGE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- 7b. Geography proof ---------- */
export function GeographyChart({ regions }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={regions} margin={{ top: 24, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false}
          tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
        <YAxis domain={[0, 65]} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} width={48} />
        <ReferenceLine y={57.29} stroke={TERRA} strokeDasharray="4 4" strokeWidth={1.5}
          label={{ value: 'Tables: $57 avg', position: 'insideTopRight',
            style: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: TERRA } }} />
        <Tooltip content={<Tip rows={(d) => [
          `$${d.shipping} average shipping`,
          `${d.margin}% margin`,
        ]} />} cursor={{ fill: 'rgba(26,24,21,0.03)' }} />
        <Bar dataKey="shipping" fill={BLUE} radius={[2, 2, 0, 0]} animationDuration={1000} />
      </BarChart>
    </ResponsiveContainer>
  )
}
