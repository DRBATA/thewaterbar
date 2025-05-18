import Head from 'next/head';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [hydrationLevel, setHydrationLevel] = useState(52);
  const [drinks, setDrinks] = useState([
    { id: 1, type: 'Water', amount: '250 mL', color: 'bg-neon-blue', icon: '💧' },
    { id: 2, type: 'Sport Drink', amount: '330 mL', color: 'bg-neon-waterblue', icon: '🏃' },
    { id: 3, type: 'Coconut Water', amount: '300 mL', color: 'bg-neon-green', icon: '🥥' },
    { id: 4, type: 'Mineral Water', amount: '250 mL', color: 'bg-neon-pink', icon: '💎' },
  ]);

  const addDrink = (drinkId) => {
    // In a production app, this would update the database
    setHydrationLevel(Math.min(hydrationLevel + 5, 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001529] to-[#003145] text-white px-4 py-8">
      <Head>
        <title>The Water Bar</title>
        <meta name="description" content="Hydration tracking app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md mx-auto">
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full text-neon-blue">
              <motion.path
                d="M50 10 L90 90 L10 90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neon-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
            WATER BAR
          </h1>
        </motion.div>

        {/* Hydration Level Card */}
        <motion.div 
          className="neon-card p-5 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-neon-blue mr-2">💧</span>
            <h2 className="text-neon-blue font-semibold">Hydration Level</h2>
            <span className="ml-auto text-neon-blue font-bold">{hydrationLevel}%</span>
          </div>
          
          <div className="h-8 bg-gray-800/50 rounded-lg overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan relative"
              style={{ width: `${hydrationLevel}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden">
                <div className="water-level w-full h-full" />
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            <span>{Math.round(hydrationLevel * 25)}ml / 2500 ml</span>
            <span className="float-right text-neon-blue">Getting there!</span>
          </div>
        </motion.div>

        {/* Today's Plan */}
        <motion.div 
          className="neon-card p-5 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-3">Today's Plan</h2>
          <p className="text-sm text-gray-300 mb-3">
            Drink 500ml water before noon. Consider an electrolyte beverage after your workout.
          </p>
          
          <h3 className="text-sm font-semibold text-neon-blue mb-2">Recommended Drinks</h3>
          
          <div className="space-y-2">
            {drinks.map((drink, index) => (
              <motion.div 
                key={drink.id}
                className="flex items-center bg-white/5 rounded-lg p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <div className={`w-8 h-8 ${drink.color} bg-opacity-20 rounded-full flex items-center justify-center mr-3`}>
                  <span>{drink.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium">{drink.type}</h4>
                  <p className="text-xs text-gray-400">{drink.amount}</p>
                </div>
                <button 
                  onClick={() => addDrink(drink.id)}
                  className="ml-auto w-8 h-8 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center hover:bg-neon-blue/20 transition-colors"
                >
                  +
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Environmental Impact */}
        <motion.div 
          className="neon-card p-5 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Carbon Savings</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-neon-green text-xl font-bold">5.67 kg</p>
              <p className="text-xs text-gray-400">CO₂ Saved</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-neon-green text-xl font-bold">42</p>
              <p className="text-xs text-gray-400">Bottles Avoided</p>
            </div>
            
            <div className="col-span-2 bg-white/5 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-neon-green">🌱</span>
                <span className="text-neon-green">🌱</span>
                <span className="text-neon-green">🌱</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Equivalent to planting 3 trees</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          className="neon-button w-full font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Log Refill Station Visit
        </motion.button>
      </main>
    </div>
  );
}
