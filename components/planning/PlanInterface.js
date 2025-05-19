import { useState } from 'react';

// Sample user data (in a production app, this would come from Supabase)
const sampleUserData = {
  id: 'user-123',
  weight: 70,
  height: 175,
  activityLevel: 'Moderate',
  climate: 'Warm',
  dietaryRestrictions: 'None'
};

// Sample hydration data (would come from tracking feature)
const sampleHydrationData = {
  recentAverage: 2000
};

export default function PlanInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [timeframe, setTimeframe] = useState('day');
  const [error, setError] = useState(null);
  const [step, setStep] = useState('options'); // options, loading, plan, timeline

  // Generate a new hydration plan using the OpenAI Responses API
  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    setStep('loading');
    
    try {
      // Call the API endpoint that uses OpenAI Responses API
      const response = await fetch('/api/hydration-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: sampleUserData,
          hydrationData: sampleHydrationData,
          timeframe: timeframe
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate hydration plan');
      }
      
      const planData = await response.json();
      setPlanData(planData);
      setIsLoading(false);
      setStep('plan');
    } catch (error) {
      console.error('Error generating hydration plan:', error);
      setError(`Failed to generate your hydration plan: ${error.message}`);
      setIsLoading(false);
      setStep('options');
    }
  };

  // Send plan to Shop section
  const sendToShop = () => {
    // In a production app, this would update app state or database
    console.log("Plan sent to Shop section", planData);
    alert("Your plan has been sent to the Shop section! You can now browse recommended products.");
  };

  return (
    <div className="w-full flex flex-col max-h-[calc(100vh-130px)] overflow-hidden">
      {step === 'options' && (
        <div className="flex-1 flex flex-col space-y-6 p-4">
          <h2 className="text-xl font-bold text-lime-300">Create Your Hydration Plan</h2>
          
          <div className="space-y-4">
            <p className="text-white/80">
              Your hydration needs are unique. Let's create a personalized plan based on your profile, activities, and goals.
            </p>
            
            <div className="bg-black/30 rounded-lg p-4 border border-lime-500/30">
              <h3 className="font-medium text-lime-200 mb-2">Select timeframe:</h3>
              <div className="flex space-x-2">
                {['day', 'week', 'event'].map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-2 rounded-md border ${timeframe === option 
                      ? 'bg-lime-900/50 border-lime-500 text-lime-200' 
                      : 'bg-black/20 border-white/10 text-white/70'}`}
                    onClick={() => setTimeframe(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            className="mt-auto bg-lime-600 hover:bg-lime-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
            onClick={generatePlan}
          >
            Generate Hydration Plan
          </button>
        </div>
      )}
      
      {step === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 border-4 border-lime-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lime-200">Creating your personalized hydration plan...</p>
        </div>
      )}
      
      {step === 'plan' && planData && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-lime-300 mb-4">Your Hydration Plan</h2>
          
          <div className="bg-black/30 rounded-lg border border-lime-500/30 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-lime-200">Daily Target</h3>
              <span className="text-2xl font-bold text-white">{planData.timeline?.totalTarget || 3100}ml</span>
            </div>
            
            <div className="w-full bg-black/50 rounded-full h-4 mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-lime-500 h-4 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <button 
              className="text-sm text-lime-300 flex items-center justify-center w-full"
              onClick={() => setStep('timeline')}
            >
              <span>View detailed timeline</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 bg-black/30 rounded-lg border border-lime-500/30 p-4 mb-4 whitespace-pre-line overflow-auto">
            <div className="prose prose-invert prose-sm max-w-none">
              {planData.plan.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h2 key={index} className="text-xl font-bold text-white mt-2 mb-4">{line.replace('# ', '')}</h2>;
                } else if (line.startsWith('## ')) {
                  return <h3 key={index} className="text-lg font-semibold text-lime-200 mt-4 mb-2">{line.replace('## ', '')}</h3>;
                } else if (line.startsWith('- ')) {
                  return <p key={index} className="flex items-start mb-2">
                    <span className="text-lime-400 mr-2">•</span>
                    <span>{line.replace('- ', '')}</span>
                  </p>;
                } else {
                  return <p key={index} className="mb-2">{line}</p>;
                }
              })}
            </div>
          </div>
          
          <button 
            className="bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 px-4 rounded-md transition-colors mt-auto"
            onClick={sendToShop}
          >
            Find Products For This Plan
          </button>
          
          <button 
            className="mt-2 text-white/70 py-2"
            onClick={() => setStep('options')}
          >
            Create Different Plan
          </button>
        </div>
      )}
      
      {step === 'timeline' && planData?.timeline && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex items-center mb-4">
            <button 
              className="text-white mr-2"
              onClick={() => setStep('plan')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-lime-300">Hydration Timeline</h2>
          </div>
          
          <div className="flex-1 bg-black/30 rounded-lg border border-lime-500/30 p-4 overflow-auto">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-white/70 text-sm">Total Daily Target</span>
              <span className="text-xl font-bold text-white">{planData.timeline.totalTarget}{planData.timeline.units}</span>
            </div>
            
            <div className="space-y-6">
              {planData.timeline.timepoints.map((point, index) => (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index < planData.timeline.timepoints.length - 1 && (
                    <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-lime-800/50"></div>
                  )}
                  
                  <div className="flex items-start">
                    {/* Timeline node */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                      ${index % 2 === 0 ? 'bg-lime-900 border-2 border-lime-600' : 'bg-cyan-900 border-2 border-cyan-600'}`}>
                      <span className="text-xs font-medium text-white">{index + 1}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4 bg-black/40 rounded-lg p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{point.title}</h4>
                          <span className="text-xs text-white/60">{point.time}</span>
                        </div>
                        <span className="text-lg font-bold text-lime-300">{point.amount}{planData.timeline.units}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/80">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 px-4 rounded-md transition-colors mt-4"
            onClick={sendToShop}
          >
            Find Products For This Plan
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-md mt-4">
          {error}
        </div>
      )}
    </div>
  );
}
