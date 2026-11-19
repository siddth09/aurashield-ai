import { AQIData, HouseholdProfile, RoutineItem } from '../types';

export interface GeminiResponse {
  text: string;
  suggestedActions?: { label: string; payload: string }[];
  isEmergencyAlert?: boolean;
}

export function getActiveApiKey(): string {
  // Check localStorage first (user-entered in settings), then Vite env
  const userKey = localStorage.getItem('aurashield_gemini_api_key');
  if (userKey && userKey.trim().length > 10) return userKey.trim();
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
}

export function hasActiveApiKey(): boolean {
  return getActiveApiKey().length > 10;
}

export async function askAuraCopilot(
  userPrompt: string,
  aqiData: AQIData,
  profile: HouseholdProfile,
  conversationHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<GeminiResponse> {
  const apiKey = getActiveApiKey();

  // If live key is present, attempt Gemini API
  if (apiKey) {
    try {
      const response = await callGeminiAPI(userPrompt, aqiData, profile, conversationHistory, apiKey);
      return response;
    } catch (err) {
      console.warn('Gemini API call encountered error; falling back to intelligent heuristic engine:', err);
    }
  }

  // Fallback to high-intelligence context-aware local engine
  return generateHeuristicResponse(userPrompt, aqiData, profile);
}

async function callGeminiAPI(
  userPrompt: string,
  aqiData: AQIData,
  profile: HouseholdProfile,
  conversationHistory: { role: 'user' | 'model'; text: string }[],
  apiKey: string
): Promise<GeminiResponse> {
  const vulnerableList = Object.entries(profile.vulnerableMembers)
    .filter(([_, val]) => val)
    .map(([key]) => key)
    .join(', ') || 'None';

  const systemInstruction = `You are AuraShield AI, an authoritative, empathetic, and scientifically rigorous Urban Smog & Air Quality Assistant for families and communities.
Your mission is to help households navigate severe winter smog, thermal inversions, and high PM2.5/PM10 spikes.
Context:
- Current City: ${aqiData.location}
- Current AQI: ${aqiData.aqi} (${aqiData.category})
- PM2.5: ${aqiData.pollutants.pm2_5} µg/m³, PM10: ${aqiData.pollutants.pm10} µg/m³
- Diurnal Inversion Risk: ${aqiData.inversionRisk}
- Safe Ventilation Window: ${aqiData.ventilationWindow.startHour}:00 - ${aqiData.ventilationWindow.endHour}:00 (${aqiData.ventilationWindow.note})
- Household Dwelling: ${profile.dwellingType} (Floor ${profile.floorLevel})
- Commute: ${profile.commuteMode} (${profile.dailyCommuteKm} km/day)
- Vulnerable Household Members: ${vulnerableList}
- Active Hacks in use: ${profile.activeHacks.join(', ') || 'None yet'}

Guidelines:
1. Provide actionable, low-cost or zero-cost DIY alternatives (Corsi-Rosenthal boxes, damp mopping, inversion-timed ventilation).
2. Quantify health and emission impacts whenever recommending changes (e.g., "This cuts PM2.5 lung intake by ~60% and saves 3.2 kg CO2").
3. Flag high-risk activities (dry sweeping, morning jogs, tap-water ultrasonic humidifiers, unvented heating).
4. Keep answers structured with bold bullet points, clear headings, and compassionate tone.`;

  const contents = [
    ...conversationHistory.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userPrompt }]
    }
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000,
      }
    })
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errorBody}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

  // Check if query is emergency
  const isEmergency = /emergency|wheez|asthma attack|chest tight|cannot breathe|suffocat/i.test(userPrompt);

  return {
    text,
    isEmergencyAlert: isEmergency,
    suggestedActions: [
      { label: 'Build DIY Filter Box', payload: 'How do I build a Corsi-Rosenthal box step-by-step for my room?' },
      { label: 'Check Ventilation Window', payload: 'When is the safest time today to open my windows without letting in smog?' },
      { label: 'Commute Low-Emission Shift', payload: 'How can I optimize my daily commute to avoid peak inversion smog?' }
    ]
  };
}

export function generateHeuristicResponse(
  userPrompt: string,
  aqiData: AQIData,
  profile: HouseholdProfile
): GeminiResponse {
  const promptLower = userPrompt.toLowerCase();
  const vulnerableKeys = Object.entries(profile.vulnerableMembers)
    .filter(([_, val]) => val)
    .map(([k]) => k);

  // 1. Emergency or Symptom Query
  if (promptLower.includes('cough') || promptLower.includes('wheez') || promptLower.includes('breathe') || promptLower.includes('throat') || promptLower.includes('baby') || promptLower.includes('toddler')) {
    return {
      isEmergencyAlert: true,
      text: `### 🚨 Immediate Smog Exposure Triage (${aqiData.location} AQI: ${aqiData.aqi})

**Immediate Actions for Symptom Relief:**
1. **Move to a Clean Air Sanctuary Room:** Designate the smallest bedroom with the fewest exterior windows as the sealed clean zone.
2. **Seal Ingress Points:** Place a damp rolled towel tightly against the base of the door to stop hallway corridor drafts. Ensure all window latches are locked tight.
3. **Run Air Filtration:** If you have an air purifier or Corsi-Rosenthal DIY box, turn it to **HIGH** immediately. Maintain continuous recirculation.
4. **Hydration & Saline Rinse:** Administer warm fluids or steam inhalation. A sterile saline nasal rinse physically flushes trapped PM2.5 soot before it crosses the nasal mucosa.
5. **Mask Protocol:** If stepping outside is unavoidable, fit a sealed **N95 or FFP2 respirator** (cloth/surgical masks filter less than 15% of sub-micron soot).

${vulnerableKeys.includes('asthmaOrRespiratory') ? '> ⚠️ **Clinical Warning:** Since your household profile has active asthma/respiratory sensitivity, verify reliever inhalers (e.g. Salbutamol) are within reach. If wheezing persists, seek emergency medical care immediately.' : ''}`,
      suggestedActions: [
        { label: 'How to make a Clean Sanctuary Room', payload: 'How do I set up a single clean-air sanctuary room at home?' },
        { label: 'Check Corsi-Rosenthal Guide', payload: 'Show me the DIY air filter steps' }
      ]
    };
  }

  // 2. Window / Ventilation Query
  if (promptLower.includes('window') || promptLower.includes('ventil') || promptLower.includes('fresh air') || promptLower.includes('open')) {
    return {
      text: `### 🪟 Thermal Inversion Ventilation Protocol for ${aqiData.location}

**Current Outdoor AQI:** **${aqiData.aqi} (${aqiData.category})**
**Today's Safe Window:** **${aqiData.ventilationWindow.startHour}:00 PM - ${aqiData.ventilationWindow.endHour}:00 PM**

**The Science of Winter Smog Traps:**
* **Do NOT open windows in early morning (6:00 - 9:30 AM):** Radiative nocturnal cooling creates a dense cold ground pool that traps vehicular exhaust and smoke. Opening windows then floods your home with peak particulate soot (> 350 µg/m³).
* **The Solar Mixing Sweet Spot (1:30 - 3:00 PM):** Peak solar radiation warms the earth surface, causing convective thermal updrafts that temporarily expand the boundary layer and dilute ground-level PM2.5 by up to 55%.
* **Protocol:** Open two opposing windows for **12–15 minutes only** between 1:30 PM and 3:00 PM to flush accumulated indoor CO2, then re-lock completely before 4:30 PM.

${aqiData.aqi > 350 ? '> ⚠️ **Severe Smog Alert:** Outside AQI exceeds 350. We recommend keeping all windows sealed today and using indoor DIY air filtration rather than outdoor airing.' : ''}`,
      suggestedActions: [
        { label: 'Explore DIY Filter Sizing', payload: 'Calculate CADR for my room size' },
        { label: 'See Low-Emission Routine', payload: 'Show my customized daily routine for today' }
      ]
    };
  }

  // 3. DIY Air Purifier / Corsi-Rosenthal Query
  if (promptLower.includes('purifier') || promptLower.includes('corsi') || promptLower.includes('diy') || promptLower.includes('filter')) {
    return {
      text: `### 🛠️ The Corsi-Rosenthal DIY Air Filter Blueprint

A homemade **Corsi-Rosenthal Box** delivers **Clean Air Delivery Rate (CADR) of 350–450 CFM**, matching or exceeding $400 commercial HEPA purifiers for less than $55.

**Parts Needed:**
* **1x 20-inch Box Fan** (~$20)
* **4x MERV 13 Furnace Filters** (20x20x1 or 20x20x2 inch, ~$8 each)
* **1x Cardboard sheet** (bottom base)
* **1x Roll of Duct / Gaffer Tape**
* **1x Cardboard circular shroud** (cut with 15-inch inner circle diameter)

**Why MERV 13 and not HEPA?**
Box fans lack the high static pressure required to force air through dense fiberglass HEPA sheets. 4x MERV 13 filters in parallel create **4x the surface area**, drastically reducing face velocity so the fan flows massive air volumes while capturing over **85% of sub-micron PM2.5** per pass!

**Impact:** Lowers room PM2.5 by **70–85% within 30 minutes**, avoiding the equivalent of 4–6 cigarettes of passive smog inhalation daily.`,
      suggestedActions: [
        { label: 'Open CADR Calculator', payload: 'Calculate CADR for my room size' },
        { label: 'Indoor mopping hacks', payload: 'Why is dry sweeping bad during smog?' }
      ]
    };
  }

  // 4. Commute or Exercise Query
  if (promptLower.includes('commute') || promptLower.includes('travel') || promptLower.includes('exercise') || promptLower.includes('jog') || promptLower.includes('gym')) {
    return {
      text: `### 🚴 Commute & Activity Strategy for ${aqiData.location}

**1. Cancel Outdoor Cardio / Jogging:**
During vigorous running, minute ventilation spikes from 6 L/min to over 60 L/min. Mouth breathing bypasses nasal turbinates, delivering unfiltered toxic particulate soot deep into alveolar tissue.
* **Alternative:** Indoor resistance training or yoga in a room with DIY air filtration.

**2. Optimize Your Commute (${profile.commuteMode}):**
* **Avoid the 7:30 - 9:00 AM Trap:** Departure at 7:00 AM cuts ambient particulate exposure by 35% compared to sitting in gridlock traffic.
* **Public Transit Shield:** Electric Metro/Subway stations and trains have mechanical filtration. Choosing Metro over a motorbike prevents **4.8 kg CO2** and cuts direct roadside PM2.5 inhalation by **65%**.
* **Vehicle Recirculation:** If driving, keep AC set to **Recirculation mode (Cabin Loop)** to prevent drawing exhaust directly from the vehicle in front of you.`,
      suggestedActions: [
        { label: 'Calculate my commute CO2 savings', payload: 'How much emissions do I save by taking Metro or Carpooling?' },
        { label: 'Tell me about morning inversion', payload: 'Why is smog worse in the morning?' }
      ]
    };
  }

  // Default Comprehensive Advice
  return {
    text: `### 🌿 AuraShield Urban Smog Analysis for ${profile.cityName || aqiData.location}

**Current Air Quality Assessment:**
* **AQI:** **${aqiData.aqi} (${aqiData.category})**
* **Dominant Risk:** **${aqiData.dominantPollutant}** (${aqiData.pollutants.pm2_5} µg/m³)
* **Atmospheric Inversion:** **${aqiData.inversionRisk} Level** — Ground air is stagnating, trapping vehicle exhaust and particulate soot.

**Top 3 Immediate Recommendations for Your Household:**
1. **Deploy Low-Cost Filtration:** Run a DIY Corsi-Rosenthal filter in sleeping areas. It cleans room air by 80% without expensive proprietary filters.
2. **Switch from Sweeping to Damp Mopping:** Traditional dry broom sweeping resuspends 80% of settled toxic dust. Use a damp microfiber mop with plain water.
3. **Reschedule Commute & Ventilation:** Shift outdoor tasks to midday (1:30 - 3:00 PM) when solar thermal convective mixing temporarily dilutes ground-level smog.

What specific area of your routine would you like to optimize right now?`,
    suggestedActions: [
      { label: 'Generate Daily Low-Emission Routine', payload: 'Create a tailored routine for my family' },
      { label: 'Calculate DIY Air Filter Specs', payload: 'How big a filter do I need?' },
      { label: 'Protect Children & Elderly', payload: 'How to protect toddlers and elderly from winter smog?' }
    ]
  };
}

export function generateCommunityNoticeText(
  communityName: string,
  cityName: string,
  currentAQI: number,
  topic: 'anti_burning' | 'carpool_initiative' | 'clean_air_space'
): string {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (topic === 'anti_burning') {
    return `**COMMUNITY NOTICE & HEALTH ADVISORY: ZERO WASTE BURNING PROTOCOL**
Date: ${dateStr}
Location: ${communityName}, ${cityName}
Current Ambient AQI: ${currentAQI} (Severe Winter Smog Alert)

Dear Residents and Maintenance Staff,

With our city's ambient air quality reaching hazardous levels (${currentAQI} AQI), our community is under a severe temperature inversion lid. Under these meteorological conditions, smoke does NOT disperse into the upper atmosphere; it settles directly at ground level outside our windows and children's balconies.

**MANDATORY COMMUNITY MEASURES:**
1. **STRICT ZERO-TOLERANCE ON LEAF & WASTE BURNING:**
   Burning dry garden leaves, plastic, or construction debris is strictly prohibited. Composting bins have been placed in designated zones.
2. **SECURITY GUARD HEATING ALTERNATIVES:**
   Open wood/charcoal fires for night guards are replaced with electric radiant heaters provided at all security gates.
3. **REPORTING HOTSPOTS:**
   Any incident of smoke or burning should be reported instantly via the Community Clean Air Board for immediate resolution.

Let us protect our children, elderly, and vulnerable neighbors from preventable toxic exposure.

— Management Committee & Resident Welfare Association`;
  }

  if (topic === 'carpool_initiative') {
    return `**GREEN NEIGHBORHOOD INITIATIVE: WINTER SMOG CARPOOL & TRANSIT CORRIDOR**
Date: ${dateStr}
Location: ${communityName}, ${cityName}

Dear Residents,

Every single solo car trip during peak morning hours contributes to the ground-level NOx and PM2.5 soup our children breathe at the school bus stop.

**Join the Community Clean Commute Circle:**
* **Cluster Carpools:** Register your commute route (Tech Parks / Commercial Districts) to share rides with neighbors.
* **School Bus Collective:** Transition from private pickup queues to the consolidated society school shuttle.
* **Estimated Collective Impact:** Eliminating just 40 solo vehicular trips per residential block prevents over **120 kg of CO2** and **1.8 kg of fine particulate soot** per day!

Sign up at the Community Air Desk or activate your profile on the AuraShield App.`;
  }

  return `**COMMUNITY CLEAN AIR SANCTUARY: OPEN TO ALL RESIDENTS**
Date: ${dateStr}
Location: ${communityName} Clubhouse / Community Center

In response to current emergency air quality index levels (${currentAQI} AQI), our society has converted the central community hall into a designated **Clean Air Sanctuary**:
* Fitted with dual Corsi-Rosenthal DIY air purification systems maintaining indoor AQI < 45.
* Available for elderly residents, young children, and remote workers looking to escape unsealed home apartments.
* Free N95 respirators available at the front desk.`;
}
