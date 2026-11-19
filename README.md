# 🌿 AuraShield AI: Urban Smog & Air Quality Assistant

> **Hackathon Submission for [Challenge 6] Urban Air Quality Assistant**  
> *A GenAI-powered intelligent copilot helping families and communities navigate severe winter smog, thermal inversions, and hazardous urban air pollution with low-emission daily routines, indoor air quality hacks, and quantified direct impact.*

[![Live Tests](https://img.shields.io/badge/Vitest-8%20Passed-emerald.svg)](https://vitest.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AAA-purple.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Bundle Size](https://img.shields.io/badge/Repo%20Size-%3C%20250%20KB-success.svg)](https://github.com/siddth09/aurashield-ai)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsiddth09%2Faurashield-ai)

---

## 📌 1. Chosen Vertical & Problem Alignment

### The Severe Winter Smog Crisis
Across major urban centers worldwide—from New Delhi NCR, Lahore, and Beijing to Salt Lake City, London, and the Po Valley—winter brings severe atmospheric temperature inversions. Radiative cooling of the ground at night creates a dense cold-air pool trapped beneath warmer air aloft. This acts as an impenetrable atmospheric lid, trapping vehicular tailpipe emissions, construction dust, industrial fumes, and heating smoke within the bottom 150 meters of the urban canopy.

Families—particularly those with **infants, asthmatic children, elderly grandparents, or pregnant individuals**—suffer disproportionately. Traditional air quality apps provide passive numbers ("AQI 420: Hazardous") without giving families practical, low-cost actions, scientific ventilation windows, or clear explanations of how their choices directly protect their lungs and prevent community emissions.

### The AuraShield Solution
**AuraShield AI** transforms air quality data into an actionable, empowering daily copilot:
1. **Real-time Diurnal Inversion Tracking:** Pinpoints the exact 90-minute solar convection window (1:30 PM - 3:00 PM) when daytime heating lifts the inversion lid, enabling safe 15-minute CO2 flushes while warning against high-soot morning ventilation.
2. **Personalized Low-Emission Daily Routines:** Dynamically tailors schedules (commute timing, indoor workouts, batching errands, induction cooking) to current hourly smog curves and family vulnerability profiles.
3. **Open-Source Indoor Air Quality (IAQ) Lab:** Engineering-grade **Corsi-Rosenthal DIY Box Sizer** that calculates Clean Air Delivery Rate (CADR in CFM) and Air Changes per Hour (ACH) for any room, outperforming $400 commercial HEPA units for $55.
4. **The Impact Mirror (Quantified Mathematical Engine):** Translates choices into tangible health metrics: toxic PM2.5 micrograms kept out of pulmonary alveoli, **cigarettes avoided equivalent** (via the Berkeley Earth epidemiological model), and kilograms of community CO2e emissions prevented.
5. **Aura Copilot (GenAI Assistant):** Powered by Google Gemini 2.5 Flash (with an offline medical-grade heuristic fallback) for emergency triage, symptom management, and automated community notice drafting.
6. **Community Action Hub:** Collective smog watch to report open leaf/trash burning, coordinate carpooling, and manage shared clean air lending libraries.

---

## 🚀 2. System Architecture & Core Logic

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                            │
│    (React 18 + TypeScript + Vite + Tailwind CSS + WCAG AAA Toolbar)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼──────────────────────────────┐
    ▼                               ▼                              ▼
┌──────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│ Meteorological   │    │  Household Profile   │    │ Accessibility      │
│ & Smog Telemetry │    │  & Lifestyle Context │    │ Engine             │
│ (aqiService.ts)  │    │  (HouseholdContext)  │    │ (A11yContext.tsx)  │
└─────────┬────────┘    └──────────┬───────────┘    └────────────────────┘
          │                        │
          └───────────┬────────────┘
                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          INTELLIGENCE ENGINES                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Diurnal Inversion Layer Analyzer (Boundary layer thermodynamics)     │
│ 2. Corsi-Rosenthal CADR Sizer (ACH = CADR * 60 / Room Volume)          │
│ 3. Impact Engine (Berkeley Earth Cigarette Model: 22 µg/m³-day = 1 cig)│
│ 4. Aura Copilot (Google Gemini 2.5 Flash + Deterministic Heuristics)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         ACTIONABLE OUTCOMES                            │
│  • Exposure Reduction Pct       • Direct CO2e Prevented                │
│  • Personalized Daily Routines  • Community Anti-Burning Circulars     │
│  • DIY Sizing Specifications    • Lung Deposition Prevention           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 3. Scientific Models & Mathematical Formulas

### A. Diurnal Atmospheric Inversion Multiplier
Atmospheric boundary layer height $H_b(t)$ varies diurnally due to solar insolation. Ground-level PM2.5 concentrations $C(t)$ follow an inverse relationship with boundary layer mixing volume:
$$C(t) = C_{\text{baseline}} \times M_{\text{diurnal}}(t)$$
* **Morning Inversion Peak (06:00 - 09:30 AM):** $M = 1.45$ (Maximum ground trapping + peak traffic NOx)
* **Solar Convective Window (01:30 - 03:00 PM):** $M = 0.65$ (Thermal updrafts expand boundary layer, diluting ground smog by ~35-50%)
* **Night Inversion Lid (08:00 - 11:30 PM):** $M = 1.35$ (Surface radiative cooling caps emissions)

### B. Clean Air Delivery Rate (CADR) & Room Sizing
For a room with dimensions $L \times W \times H$ (volume $V = L \cdot W \cdot H \text{ ft}^3$):
$$\text{Required CADR (CFM)} = \frac{V \times \text{Desired ACH}}{60}$$
Where:
* Target Air Changes per Hour ($\text{ACH}$) for winter smog mitigation is $\ge 4.5 \text{ ACH}$.
* A 4-filter Corsi-Rosenthal cube reduces filter face velocity 4x, decreasing static pressure drop and delivering **340–460 CFM** effective CADR on a standard 20-inch box fan with shroud.

### C. The Berkeley Earth Cigarette Equivalence Model
Based on the peer-reviewed epidemiological research of Muller & Berkeley Earth:
$$\text{Cigarettes Avoided Equivalent} = \frac{\Delta \text{PM}_{2.5} \text{ Inhaled Exposure } (\mu g/m^3 \cdot \text{day})}{22}$$
Where an average adult breathes $11 \text{ m}^3$ of air per day ($0.55 \text{ m}^3/\text{hour}$).

### D. Community Carbon & Tailpipe Emission Abatement
Calculates verified CO2e savings based on transit mode shifts:
* Solo Petrol/Diesel Car: $0.192 \text{ kg CO}_2\text{e} / \text{km}$
* Electric Metro/Subway: $0.028 \text{ kg CO}_2\text{e} / \text{km}$
* Carpooling (3-4 passengers): $0.055 \text{ kg CO}_2\text{e} / \text{passenger-km}$
* Net savings: $\Delta \text{CO}_2\text{e} = d_{\text{commute}} \times (0.192 - \text{EF}_{\text{alternative}})$.

---

## 🛠️ 4. Key Features

| Feature | Description | Impact |
|---|---|---|
| **Live Smog Telemetry** | Open-Meteo Air Quality integration with PM2.5, PM10, NO2, SO2, O3, CO, and temperature/humidity. | Zero-API-key needed, works worldwide. |
| **Diurnal Smog Chart** | 24-hour visual bar timeline distinguishing inversion traps from the solar ventilation window. | Prevents toxic morning window airing. |
| **Corsi-Rosenthal Sizer** | Interactive CADR calculator adjusting for room dimensions, filter geometry (1, 2, 4, 5 filters), and fan speed. | Saves 80% vs commercial HEPA ($55 vs $430 5-yr cost). |
| **Daily Routine Planner** | Timeline of low-emission routine shifts (commute shift, induction cooking, damp mopping, indoor cardio). | Direct exposure cut up to 85% and 4.8kg CO2 saved/day. |
| **The Impact Mirror** | Live dashboard quantifying PM2.5 micrograms avoided, cigarettes avoided, and monthly projections. | Closes the feedback loop for user behavior. |
| **Aura Copilot** | Google Gemini 2.5 Flash integration with emergency triage, medical advice disclaimers, and local fallback. | Instant contextual help anytime. |
| **Community Hub** | Crowdsourced local smoke reporting, RWA circular generator, and Clean Air Lending Library. | Drives neighborhood collective action. |
| **Universal Accessibility** | WCAG AAA high-contrast toggle, colorblind-safe shape tokens (Shield, Circle, Triangle, Octagon, Hexagon, Skull), text scaling. | Inclusive for elderly and visually impaired users. |

---

## 🧪 5. Testing & Verification

AuraShield includes an automated test suite verifying environmental physics, CADR algorithms, and impact models:

```bash
# Run the complete test suite
npm test
```

### Test Coverage Summary:
* `src/__tests__/aqiService.test.ts`:
  - Validates US EPA AQI category boundary conditions.
  - Verifies colorblind-safe shape descriptors.
  - Confirms diurnal curve mathematical multipliers and fallback generator.
* `src/__tests__/cadrCalculator.test.ts`:
  - Tests room volume calculation and CADR sizing for 4.5 ACH targets.
  - Verifies single-filter fan choking penalty vs 4-filter Corsi cube surface area.
  - Confirms 5-year cost comparison formula accuracy.
* `src/__tests__/impactEngine.test.ts`:
  - Validates Berkeley Earth cigarette equivalence math.
  - Validates commute mode emission deltas and indoor filtration synergy.
  - Verifies 30-day cumulative projection math.

---

## 🔒 6. Security, Efficiency & Assumptions

### Security & Privacy
* **Zero Hardcoded Secrets:** All API keys are loaded via `VITE_GEMINI_API_KEY` or stored client-side in the user's browser `localStorage`.
* **Zero User Tracking:** No sensitive medical or location coordinates are uploaded to external tracking servers.
* **XSS Sanitization:** Text outputs from AI models are rendered securely without unescaped raw HTML.

### Efficiency & Bundle Size
* **Ultra-Lightweight Repository:** The entire repository code is **under 200 KB** (far below the 10 MB hackathon ceiling).
* **Zero Bloat Dependencies:** Direct fetch integrations for both Open-Meteo and Google Gemini REST endpoints—no bulky SDKs.
* **Sub-Second Render Times:** Built on Vite with tree-shaken Lucide icons and pure CSS utilities.

### Assumptions Made
1. **Respiratory Rate:** Uses standard human physiology values ($11 \text{ m}^3/\text{day}$ resting/light activity; $0.55 \text{ m}^3/\text{hr}$).
2. **Indoor Infiltration Factor:** Unsealed windows assume a 0.85 indoor-to-outdoor ratio; weather-sealed windows assume 0.60.
3. **Cigarette Equivalence:** Adopts the widely cited Berkeley Earth standard ($22 \mu g/m^3 \cdot 24\text{h} \approx 1 \text{ cigarette}$).

---

## 💻 7. Local Setup & Quickstart

### Prerequisites
* Node.js v18+ (tested on Node v25)
* npm v9+

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/siddth09/aurashield-ai.git
cd aurashield-ai

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
# Either create a .env file or add it directly inside the app Settings Modal!
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# 4. Start the local development server
npm run dev

# 5. Run tests
npm test

# 6. Build for production
npm run build
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
