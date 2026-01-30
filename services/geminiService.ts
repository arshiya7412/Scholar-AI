import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, DailyPlan } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = "gemini-3-flash-preview";
const MODEL_IMAGE = "gemini-2.5-flash-image";

export const generateStudyPlan = async (profile: StudentProfile): Promise<DailyPlan> => {
  const prompt = `
    Create a supportive and balanced daily study plan for a student with the following profile:
    Name: ${profile.name}
    Grade: ${profile.gradeLevel}
    Learning Pace: ${profile.studentType}
    Subjects: ${profile.subjects.join(", ")}
    Strengths: ${profile.strengths.join(", ")}
    Weaknesses: ${profile.weaknesses.join(", ")}
    Daily Goal: ${profile.dailyStudyHours} hours
    Upcoming Exams: ${profile.upcomingExams}

    The plan should be realistic, include breaks, and use a motivating tone adapted to their learning pace (${profile.studentType}).
    - For "Slow Bloomer": Break tasks into smaller, manageable chunks with longer breaks.
    - For "Average": Standard balanced schedule.
    - For "Strong": Include more challenging review sessions or advanced topics.
    
    Provide the response in JSON format strictly adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Today's date formatted appropriately" },
            motivationalQuote: { type: Type.STRING, description: "A short, encouraging quote for the student" },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "e.g., 4:00 PM - 4:45 PM" },
                  subject: { type: Type.STRING },
                  activity: { type: Type.STRING, description: "Specific study task (e.g., Read Chapter 4, Solve 5 problems)" },
                  duration: { type: Type.STRING, description: "Duration in minutes" },
                  tip: { type: Type.STRING, description: "A quick study tip or encouragement specific to this task" },
                },
                required: ["time", "subject", "activity", "duration", "tip"]
              }
            }
          },
          required: ["date", "sessions", "motivationalQuote"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as DailyPlan;

  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

export const updateStudyPlan = async (currentPlan: DailyPlan, feedback: string, profile: StudentProfile): Promise<DailyPlan> => {
  const prompt = `
    The student wants to adjust their current study plan.
    
    Current Plan: ${JSON.stringify(currentPlan)}
    Student Feedback/Constraints: "${feedback}"
    Student Profile: ${JSON.stringify(profile)}

    Please modify the sessions to accommodate the feedback while maintaining the daily study goal if possible.
    Respect their learning pace: ${profile.studentType}.
    
    Provide the response in JSON format strictly adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            motivationalQuote: { type: Type.STRING },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ["time", "subject", "activity", "duration", "tip"]
              }
            }
          },
          required: ["date", "sessions", "motivationalQuote"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as DailyPlan;

  } catch (error) {
    console.error("Error updating study plan:", error);
    throw error;
  }
};

export const generateDiagram = async (description: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_IMAGE,
            contents: {
                parts: [
                    { text: `Create a clear, educational diagram or illustration explaining: ${description}. Use a white background style suitable for a textbook.` }
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: "4:3",
                    imageSize: "1K"
                }
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Error generating diagram:", e);
        return null;
    }
}

export const getTutorResponseStream = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  profile: StudentProfile
) => {
  try {
    const systemInstruction = `
      You are a supportive, patient, and encouraging AI Study Buddy for a student named ${profile.name}.
      Your goal is to explain academic concepts simply, help with planning, and boost confidence.
      
      Student Profile:
      - Grade: ${profile.gradeLevel}
      - Learning Pace: ${profile.studentType}
      - Weaknesses: ${profile.weaknesses.join(", ")}
      
      Guidelines:
      1. Tone: Warm, mentor-like.
      2. Methodology based on "${profile.studentType}":
         - "Slow Bloomer": Be very patient, use simple analogies, break things down into tiny steps.
         - "Average": Standard clear explanations.
         - "Strong": Challenge them, offer deeper insights or "did you know" facts.
      3. If the user asks for a diagram, drawing, or image, acknowledge it and say "I'm generating a diagram for you now..." (The system will handle the actual image generation).
    `;

    const chat = ai.chats.create({
      model: MODEL_FLASH,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error in chat stream:", error);
    throw error;
  }
};

export const analyzeProgress = async (profile: StudentProfile, progressData: any) => {
    const prompt = `
        Analyze the following study progress for ${profile.name} (${profile.studentType} learner):
        ${JSON.stringify(progressData)}
        
        Give 3 short, bulleted positive reinforcements and 1 gentle suggestion for improvement.
        Keep it under 100 words total.
    `;

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt
    });

    return response.text || "Keep up the great work! Consistency is key.";
}