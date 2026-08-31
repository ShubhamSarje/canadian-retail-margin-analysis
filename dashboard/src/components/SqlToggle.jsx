import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function SqlToggle({ sql }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="sql-toggle">
      <button className={`sql-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span className="chev">›</span>
        {open ? 'Hide the SQL' : 'View the SQL'}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <pre className="sql">{sql}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
