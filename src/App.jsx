import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bus, Clock, MapPin, ArrowRight, ArrowUpRight, ArrowDownRight, ChevronRight, Timer } from 'lucide-react'

const fromTsuman = [
  {
    from: 'Цумань',
    to: 'Луцьк',
    times: ['7:00', '7:50', '10:00', '10:55', '14:30', '17:00', '18:30']
  },
  {
    from: 'Цумань',
    to: 'Ківерці',
    times: ['8:00', '10:00']
  },
  {
    from: 'Цумань',
    to: 'Пролісок',
    note: 'через Грем\'яче',
    times: ['12:25', '12:55', '15:25']
  },
  {
    from: 'Цумань',
    to: 'Башлики',
    note: 'через Карпилівку',
    times: ['09:15', '14:45', '16:45']
  },
  {
    from: 'Цумань',
    to: 'Липне',
    times: ['13:15']
  },
  {
    from: 'Липне',
    to: 'Рівне',
    note: 'Цумань — прохідна',
    times: ['6:40', '15:40']
  }
]

const fromLutsk = [
  {
    from: 'Луцьк',
    to: 'Цумань',
    times: ['07:40', '08:35', '10:50', '12:55', '13:45', '15:55', '18:15', '19:50']
  },
  {
    from: 'Ківерці',
    to: 'Цумань',
    times: ['11:00', '12:20']
  },
  {
    from: 'Пролісок',
    to: 'Цумань',
    note: 'через Грем\'яче',
    times: ['17:55']
  },
  {
    from: 'Башлики',
    to: 'Цумань',
    note: 'через Карпилівку',
    times: ['09:25', '14:25']
  },
  {
    from: 'Липне',
    to: 'Цумань',
    times: ['8:55']
  },
  {
    from: 'Рівне',
    to: 'Липне',
    note: 'Цумань — прохідна',
    times: ['13:10', '18:15']
  }
]

// Parse "HH:MM" to minutes since midnight
function timeToMins(t) {
  const [h, m] = t.replace(/^0/, '').split(':').map(Number)
  return h * 60 + m
}

function getCurrentMins() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function formatTime(date) {
  return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

function minsUntil(t) {
  const diff = timeToMins(t) - getCurrentMins()
  return diff
}

function formatCountdown(mins) {
  if (mins <= 0) return null
  if (mins < 60) return `${mins} хв`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h} год ${m} хв` : `${h} год`
}

// Find the next upcoming time across all routes
function findNextBus(routes) {
  const now = getCurrentMins()
  let best = null
  for (const route of routes) {
    for (const t of route.times) {
      const diff = timeToMins(t) - now
      if (diff > 0 && (best === null || diff < best.diff)) {
        best = { diff, time: t, route }
      }
    }
  }
  return best
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
}

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
}

function RouteCard({ route, nowMins }) {
  return (
    <motion.div variants={itemVariants} className="route-card">
      <div className="route-header">
        <div className="route-icon">
          <Bus className="w-4 h-4 text-white" />
        </div>
        <div className="route-title">
          <div className="route-name">
            <span>{route.from}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-purple-300">{route.to}</span>
          </div>
          {route.note && <p className="route-note">{route.note}</p>}
        </div>
      </div>

      <div className="times-grid">
        {route.times.map((time, i) => {
          const diff = timeToMins(time) - nowMins
          const isPast = diff < 0
          const isNext = !isPast && route.times.slice(0, i).every(t => timeToMins(t) - nowMins < 0)
          const isSoon = !isPast && diff <= 30

          return (
            <div
              key={i}
              className={`time-badge ${isPast ? 'time-past' : isNext ? 'time-next' : isSoon ? 'time-soon' : ''}`}
            >
              <span className="time-text">{time}</span>
              {isNext && !isPast && (
                <span className="time-label">наст.</span>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function NextBusBanner({ nextBus, countdown }) {
  if (!nextBus) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="next-bus-banner"
    >
      <div className="next-bus-icon">
        <Timer className="w-5 h-5 text-white" />
      </div>
      <div className="next-bus-info">
        <div className="next-bus-title">Наступний автобус</div>
        <div className="next-bus-route">
          {nextBus.route.from} → {nextBus.route.to}
        </div>
      </div>
      <div className="next-bus-time">
        <span className="next-bus-clock">{nextBus.time}</span>
        <span className="next-bus-countdown">через {countdown}</span>
      </div>
    </motion.div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('from')
  const [nowMins, setNowMins] = useState(getCurrentMins())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      const mins = now.getHours() * 60 + now.getMinutes()
      setNowMins(mins)

      const routes = activeTab === 'from' ? fromTsuman : fromLutsk
      const next = findNextBus(routes)
      if (next) {
        setCountdown(formatCountdown(next.diff))
      }
    }, 15000)

    // Initial countdown
    const routes = activeTab === 'from' ? fromTsuman : fromLutsk
    const next = findNextBus(routes)
    if (next) setCountdown(formatCountdown(next.diff))

    return () => clearInterval(tick)
  }, [activeTab])

  const routes = activeTab === 'from' ? fromTsuman : fromLutsk
  const nextBus = findNextBus(routes)

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="header-bus-icon"
        >
          <Bus className="w-7 h-7 text-purple-300" />
        </motion.div>
        <div className="header-text">
          <h1 className="header-title">Розклад Маршруток</h1>
          <div className="header-sub">
            <MapPin className="w-3.5 h-3.5" />
            <span>Цумань</span>
            <span className="header-time">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'from' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('from')}
          id="tab-from-tsuman"
        >
          <ArrowUpRight className="w-4 h-4" />
          З Цуманя
        </button>
        <button
          className={`tab-btn ${activeTab === 'to' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('to')}
          id="tab-to-tsuman"
        >
          <ArrowDownRight className="w-4 h-4" />
          До Цуманя
        </button>
      </div>

      {/* Next Bus Banner */}
      <div className="banner-container">
        <AnimatePresence mode="wait">
          <NextBusBanner key={activeTab} nextBus={nextBus} countdown={countdown} />
        </AnimatePresence>
      </div>

      {/* Route Cards */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -8 }}
            className="routes-grid"
          >
            {routes.map((route, index) => (
              <RouteCard key={index} route={route} nowMins={nowMins} />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        🚌 Зручний та надійний транспорт для вашого комфорту
      </footer>
    </div>
  )
}

export default App
