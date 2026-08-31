export default function Tip({ active, payload, label, rows }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload
  return (
    <div className="tt">
      <div className="tt-name">{d.name || d.band || d.province || label}</div>
      {rows(d).map((r, i) => (
        <div className="tt-row" key={i}>{r}</div>
      ))}
    </div>
  )
}
