import Head from 'next/head';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // State for all components
  const [hydrationLevel, setHydrationLevel] = useState(70);
  const [chatOpen, setChatOpen] = useState(false);
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [showAvatar, setShowAvatar] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'You\'re on track with your hydration today!' },
    { sender: 'user', text: 'When should I have my next drink?' },
    { sender: 'ai', text: 'Based on your activity level, I recommend 250ml of water in the next 30 minutes.' },
  ]);
  
  // Reference for the video element
  const videoRef = useRef(null);
  
  // Drinks data
  const drinks = [
    { id: 1, type: 'Water', amount: '250 mL', color: 'bg-neon-blue', icon: '💧' },
    { id: 2, type: 'Sport Drink', amount: '330 mL', color: 'bg-neon-waterblue', icon: '🏃' },
    { id: 3, type: 'Kombucha', amount: '300 mL', color: 'bg-neon-green', icon: '🍹' },
    { id: 4, type: 'Matcha', amount: '250 mL', color: 'bg-neon-pink', icon: '🍵' },
  ];

  // Card data for the center stack
  const cards = [
    { id: 1, title: 'Today\'s Plan', content: 'Drink 500ml water before noon. Consider an electrolyte beverage after your workout.' },
    { id: 2, title: 'Electrolyte Gap', content: 'You\'re slightly low on potassium. Consider adding a banana or coconut water to your intake.' },
    { id: 3, title: 'Partner Offer', content: 'Show this code at GreenFuel Café for a free Recovery Bowl: GF25HYDRATE', hasQR: true },
  ];

  // Function to log drink
  const logDrink = (drinkId) => {
    // In a production app, this would POST to /api/hydration/log
    setHydrationLevel(Math.min(hydrationLevel + 5, 100));
    setLogDrawerOpen(false);
    
    // Trigger AI response after logging
    setTimeout(() => {
      setChatMessages([...chatMessages, 
        { sender: 'ai', text: 'Great job! You\'ve increased your hydration to ' + (hydrationLevel + 5) + '%.' }
      ]);
      setChatOpen(true);
      
      // Play avatar video
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 1000);
  };

  // Function to send chat message
  const sendChatMessage = (message) => {
    if (!message.trim()) return;
    
    setChatMessages([...chatMessages, { sender: 'user', text: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, 
        { sender: 'ai', text: 'I\'ll help you stay on track with your hydration goals!' }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#001020] text-white relative overflow-hidden">
      <Head>
        <title>The Water Bar</title>
        <meta name="description" content="Hydration tracking app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen flex flex-col">
        {/* Top Header with Logo */}
        <div className="border border-neon-blue/30 bg-black/40 backdrop-blur-sm rounded-lg m-3 p-3 shadow-neon-glow">
          <h1 className="text-2xl font-bold text-neon-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] text-center">
            WATER BAR
          </h1>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 m-3 mb-20 overflow-hidden">
          {/* 1. Hydration Dial - Top Left */}
          <div className="border border-neon-blue/30 bg-black/40 backdrop-blur-sm rounded-lg p-4 shadow-neon-glow flex flex-col items-center justify-center">
            <h2 className="text-neon-blue text-lg mb-2 uppercase font-bold tracking-wider">HYDRATION LEVEL</h2>
            
            {/* Circular Progress */}
            <div className="relative w-40 h-40 my-2">
              {/* Background Circle */}
              <div className="absolute inset-0 rounded-full border-4 border-neon-blue/20"></div>
              
              {/* Progress Circle */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  strokeWidth="8"
                  stroke="#00E5FF"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - hydrationLevel / 100)}`}
                  className="drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                />
              </svg>
              
              {/* Checkmark Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-neon-blue text-4xl">
                  ✓
                </div>
              </div>
              
              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center mt-12">
                <div className="text-white text-xl font-bold">
                  {hydrationLevel}%
                </div>
              </div>
            </div>
          </div>

          {/* 5. Live Card Stack - Center Section */}
          <div className="overflow-y-auto max-h-full space-y-3">
            {cards.map(card => (
              <motion.div 
                key={card.id}
                className="border border-neon-blue/30 bg-black/40 backdrop-blur-sm rounded-lg p-4 shadow-neon-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.id * 0.1 }}
              >
                <h3 className="text-neon-blue font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{card.content}</p>
                
                {card.hasQR && (
                  <div className="bg-white w-24 h-24 mx-auto my-2 flex items-center justify-center">
                    <span className="text-black text-xs">QR Code</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* 2 & 4. Chat & Video Avatar - Right Section */}
          <div className="flex flex-col space-y-3">
            {/* Chat/Responses Panel */}
            <div className="border border-neon-blue/30 bg-black/40 backdrop-blur-sm rounded-lg shadow-neon-glow">
              <div className="flex justify-between items-center p-3 border-b border-neon-blue/20">
                <h2 className="text-neon-blue font-bold">CHAT</h2>
                <button 
                  onClick={() => setChatOpen(!chatOpen)}
                  className="text-neon-blue"
                >
                  {chatOpen ? '▼' : '▶'}
                </button>
              </div>
              
              <AnimatePresence>
                {chatOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="h-36 overflow-y-auto p-3 space-y-2">
                      {chatMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-lg text-sm ${msg.sender === 'ai' 
                            ? 'bg-neon-blue/10 mr-8' 
                            : 'bg-white/10 ml-8 text-right'}`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-neon-blue/20 flex">
                      <input 
                        type="text" 
                        placeholder="Ask about your hydration..."
                        className="bg-black/60 rounded-lg px-3 py-2 flex-1 text-sm border border-neon-blue/30"
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(e.target.value)}
                      />
                      <button className="ml-2 bg-neon-blue/20 text-neon-blue px-3 py-2 rounded-lg text-sm">
                        Send
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Video Avatar */}
            <div className="border border-neon-blue/30 bg-black/40 backdrop-blur-sm rounded-lg flex-1 shadow-neon-glow overflow-hidden">
              <div className="p-3 border-b border-neon-blue/20">
                <h2 className="text-neon-blue font-bold">VIDEO AVATAR</h2>
              </div>
              
              <div className="p-4 flex flex-col items-center justify-center h-40">
                {/* This would be a real video in production */}
                <div className="w-20 h-20 rounded-full bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-neon-blue">
                    <circle cx="50" cy="40" r="20" fill="currentColor" opacity="0.7" />
                    <path d="M50 70 Q 30 70 20 85 Q 50 95 80 85 Q 70 70 50 70" fill="currentColor" opacity="0.7" />
                    <circle cx="40" cy="35" r="5" fill="white" />
                    <circle cx="60" cy="35" r="5" fill="white" />
                  </svg>
                </div>
                <p className="text-sm text-center">"Great job on staying hydrated today!"</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. Log Intake Drawer - Left Button */}
        <motion.div 
          className="fixed left-0 top-1/2 transform -translate-y-1/2"
          initial={{ x: -5 }}
          animate={{ x: logDrawerOpen ? 250 : -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <button 
            onClick={() => setLogDrawerOpen(!logDrawerOpen)}
            className="bg-neon-blue text-black font-bold py-3 px-4 rounded-r-lg shadow-neon-glow flex items-center"
          >
            {logDrawerOpen ? '⇦' : '⇨'} LOG INTAKE
          </button>
        </motion.div>
        
        {/* Log Drawer Panel */}
        <motion.div 
          className="fixed left-0 top-0 bottom-0 w-64 bg-black/80 backdrop-blur-md border-r border-neon-blue/30 z-50 flex flex-col"
          initial={{ x: -280 }}
          animate={{ x: logDrawerOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-4 border-b border-neon-blue/20">
            <h2 className="text-xl font-bold text-neon-blue">Quick Log</h2>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-3">
              {drinks.map(drink => (
                <div 
                  key={drink.id}
                  className="flex items-center p-3 bg-neon-blue/10 rounded-lg"
                >
                  <div className={`w-10 h-10 ${drink.color} bg-opacity-20 rounded-full flex items-center justify-center mr-3`}>
                    <span className="text-xl">{drink.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{drink.type}</h4>
                    <p className="text-xs text-gray-400">{drink.amount}</p>
                  </div>
                  <button 
                    onClick={() => logDrink(drink.id)}
                    className="w-8 h-8 rounded-full bg-neon-blue/20 text-neon-blue flex items-center justify-center hover:bg-neon-blue/40 transition-colors"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-neon-blue/10 rounded-lg">
              <h4 className="font-medium text-neon-blue mb-2">Scan Product</h4>
              <button className="w-full py-2 bg-neon-blue/20 text-neon-blue rounded-lg flex items-center justify-center space-x-2">
                <span>📷</span>
                <span>Scan Barcode / QR</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* 6. Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-3">
          <div className="mx-auto max-w-lg bg-black/60 backdrop-blur-md border border-neon-blue/30 rounded-full flex justify-around shadow-neon-glow">
            {['Home', 'Timeline', 'Plans', 'Settings'].map(tab => {
              const lowercaseTab = tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(lowercaseTab)}
                  className={`py-3 px-5 ${currentTab === lowercaseTab ? 'text-neon-blue font-bold' : 'text-gray-400'}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
