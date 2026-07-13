import { motion } from 'framer-motion'
import { Bus, Clock, MapPin, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const fromTsuman = [
  {
    from: 'Цумань',
    to: 'Луцьк',
    times: [
      { departure: '7:00', arrival: '8:10' },
      { departure: '7:50', arrival: '8:55' },
      { departure: '10:00', arrival: '11:25' },
      { departure: '10:55', arrival: '12:55' },
      { departure: '14:30', arrival: '15:55' },
      { departure: '17:00', arrival: '18:15' },
      { departure: '18:30', arrival: '19:50' },
    ]
  },
  {
    from: 'Цумань',
    to: 'Ківерці',
    times: [
      { departure: '8:00', arrival: '11:00' },
      { departure: '10:00', arrival: '12:00' },
    ]
  },
  {
    from: 'Липне',
    to: 'Рівне',
    note: 'Цумань - прохідна точка',
    times: [
      { departure: '6:40', arrival: '8:20' },
      { departure: '15:40', arrival: '17:00' },
    ]
  }
]

const toTsuman = [
  {
    from: 'Луцьк',
    to: 'Цумань',
    times: [
      { departure: '07:40', arrival: '08:50' },
      { departure: '08:35', arrival: '09:45' },
      { departure: '10:50', arrival: '12:00' },
      { departure: '12:55', arrival: '14:05' },
      { departure: '13:45', arrival: '15:00' },
      { departure: '15:55', arrival: '17:00' },
      { departure: '18:15', arrival: '19:55' },
      { departure: '19:50', arrival: '20:50' },
    ]
  },
  {
    from: 'Рівне',
    to: 'Липне',
    times: [
      { departure: '13:10', arrival: '15:10' },
      { departure: '18:15', arrival: '19:20' },
    ]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

function App() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Bus className="w-20 h-20 text-purple-400 mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Розклад Маршруток
          </h1>
          <p className="text-xl text-purple-200 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            селище Цумань
          </p>
        </motion.div>

        {/* From Tsuman Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">З Цумані</h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-6 justify-start"
          >
            {fromTsuman.map((route, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="route-card w-full md:w-auto md:min-w-[400px] h-fit"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {route.from}
                    </h3>
                    <div className="flex items-center gap-2 text-purple-300">
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-lg">{route.to}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {route.times.map((time, timeIndex) => (
                    <motion.div
                      key={timeIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: timeIndex * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="time-badge">
                          {time.departure}
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <div className="time-badge bg-gradient-to-r from-green-500 to-teal-600">
                          {time.arrival}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* To Tsuman Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">До Цумані</h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-6 justify-start"
          >
            {toTsuman.map((route, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="route-card w-full md:w-auto md:min-w-[400px] h-fit"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {route.from}
                    </h3>
                    <div className="flex items-center gap-2 text-purple-300">
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-lg">{route.to}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {route.times.map((time, timeIndex) => (
                    <motion.div
                      key={timeIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: timeIndex * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="time-badge">
                          {time.departure}
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <div className="time-badge bg-gradient-to-r from-green-500 to-teal-600">
                          {time.arrival}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-purple-300"
        >
          <p className="text-sm">
            🚌 Зручний та надійний транспорт для вашого комфорту
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
