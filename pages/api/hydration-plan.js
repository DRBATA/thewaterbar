/**
 * Production-Grade Hydration Plan API using OpenAI Responses API
 * Designed to work with Vercel Serverless Functions
 */
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userData, hydrationData, timeframe, previousPlanId } = req.body;

  if (!userData || !hydrationData || !timeframe) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Create OpenAI client - works in Vercel Serverless
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare structured context for the API
    const userDataContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      activityLevel: userData.activityLevel || 'Moderate',
      climate: userData.climate || 'Moderate',
      dietaryRestrictions: userData.dietaryRestrictions || 'None',
      recentAverage: hydrationData.recentAverage || 'Unknown',
      timeframe: timeframe
    };

    // Call the OpenAI Responses API with JSON format
    const response = await openai.responses.create({
      model: "gpt-4.1",
      instructions: `You are a professional hydration coach at The Water Bar. Create a personalized hydration plan based on the user's profile, activity level, and recent hydration data. Your response must be a valid JSON object with the following structure:
      {
        "plan": "Markdown formatted hydration plan with recommendations",
        "timeline": {
          "timepoints": [
            {"time": "7:00 AM", "amount": 500, "title": "Morning hydration", "description": "Start your day with 2 glasses of water"}
          ],
          "totalTarget": 3000,
          "units": "ml"
        }
      }
      
      In the plan, include:
      1. Daily water intake targets calculated based on body weight, activity level, and climate
      2. Specific hydration recommendations before, during, and after activities
      3. Suggested water types or hydration products based on user's needs
      4. A timeline with specific hydration milestones throughout the ${timeframe}
      5. If there are any specific events or high activity periods, provide tailored recommendations
      
      The plan should be in Markdown format with proper headings, lists, and emphasis.`,
      input: [
        {
          role: "user",
          content: JSON.stringify(userDataContext)
        }
      ],
      previous_response_id: previousPlanId,
      metadata: {
        user_id: userData.id || 'anonymous',
        plan_type: timeframe,
      },
      response_format: { type: "json_object" },
      store: true
    });

    // Parse and validate the JSON response
    let responseData;
    try {
      if (typeof response.content === 'string') {
        responseData = JSON.parse(response.content);
      } else {
        responseData = response.content;
      }

      // Validate that we have the expected structure
      if (!responseData.plan || !responseData.timeline) {
        throw new Error('Invalid response structure from OpenAI');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      
      // Return error to client
      return res.status(500).json({
        error: 'Error processing hydration plan',
        details: 'The AI response could not be properly processed.',
        responseId: response.id
      });
    }

    // Return the production-grade response
    return res.status(200).json({
      plan: responseData.plan,
      timeline: responseData.timeline,
      planId: response.id,
      responseId: response.id,
      generated: new Date().toISOString(),
      source: 'openai_responses_api'
    });
  } catch (error) {
    // Proper production error handling
    console.error('OpenAI Responses API error:', error);
    
    // Return a helpful error message
    return res.status(500).json({
      error: 'Error generating hydration plan', 
      details: error.message,
      errorType: error.type || error.name,
      suggestion: 'Please verify your OpenAI API key has access to the Responses API with the gpt-4.1 model.'
    });
  }
}
