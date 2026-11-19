import { IAQHack } from '../types';

export const IAQ_HACKS: IAQHack[] = [
  {
    id: 'corsi-rosenthal',
    title: 'The Corsi-Rosenthal DIY Air Filter Box',
    shortDesc: 'Affordable open-source air purifier outperforming $400 commercial HEPA units.',
    difficulty: 'Weekend Project',
    costTier: '$',
    estimatedCost: '$35 - $60',
    pm25ReductionPct: 82,
    materialsNeeded: [
      '1x Standard 20-inch Box Fan (approx $20)',
      '4x 20x20x1 or 20x20x2 MERV 13 Furnace Filters ($7-10 each)',
      '1x Cardboard base (bottom of the box)',
      'Duct tape or packing tape',
      'Cardboard shroud (cut with a 15-inch circular opening to prevent airflow backdraft)'
    ],
    steps: [
      'Tape 4 MERV 13 filters together in a cube shape with arrows pointing INWARD toward the center.',
      'Tape the cardboard square to seal the bottom of the cube completely.',
      'Place the 20-inch box fan on top, blowing air UPWARD and OUTWARD.',
      'Cut a cardboard circular shroud matching the fan blade circumference and tape to the fan face to eliminate corner air recirculation.',
      'Seal all edge seams thoroughly with duct tape to ensure negative pressure forces 100% of air through filters.'
    ],
    physicsExplanation: 'By using 4 filters simultaneously instead of 1, surface area increases 4x. This dramatically reduces air resistance (face velocity drops), allowing the fan to move high CFM (up to 450 CFM Clean Air Delivery Rate) with very low motor strain and quiet operation.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'independent_house', 'compact_settlement'],
    badge: 'Gold Standard DIY'
  },
  {
    id: 'inversion-ventilation',
    title: 'Thermal Inversion Solar Ventilation Timing',
    shortDesc: 'Ventilate your home only during the 90-minute solar mixing sweet spot.',
    difficulty: 'Easy (5 min)',
    costTier: 'Free',
    estimatedCost: '$0',
    pm25ReductionPct: 45,
    materialsNeeded: ['Timer or smartphone reminder', 'Window draft handles'],
    steps: [
      'NEVER open windows between 6:00 AM - 9:30 AM or 7:30 PM - 11:00 PM (when boundary layer inversion traps ground emissions).',
      'Identify the daily solar zenith peak between 1:30 PM and 3:00 PM when solar heating expands the atmospheric boundary layer, diluting PM2.5 by up to 60%.',
      'Open cross-windows for a swift 15-minute flush to expel indoor CO2 and moisture.',
      'Immediately reseal windows before 4:30 PM when surface cooling reinstates the inversion lid.'
    ],
    physicsExplanation: 'Radiative cooling of the earth surface overnight creates an atmospheric temperature inversion where cold air stays trapped beneath warmer air above, compressing smog into ground levels. Peak afternoon insolation breaks this lid temporarily.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'independent_house'],
    badge: 'Zero-Cost Science'
  },
  {
    id: 'wet-mopping-physics',
    title: 'Microfiber Damp Mopping vs. Dry Sweeping',
    shortDesc: 'Eliminate secondary PM2.5 resuspension from household dust.',
    difficulty: 'Easy (5 min)',
    costTier: 'Free',
    estimatedCost: '$5 (Microfiber mop)',
    pm25ReductionPct: 65,
    materialsNeeded: ['Damp microfiber flat mop', 'Water spray bottle with drop of mild soap'],
    steps: [
      'Ban traditional dry bristle brooms during high smog alert days.',
      'Lightly mist floors with clean water before mopping to bind micro-particulates.',
      'Use an S-motion microfiber mop to capture settled PM2.5 without aerosolizing it back into breathing height.',
      'Wipe hard surfaces (tables, sills) with damp microfibers rather than feather dusters.'
    ],
    physicsExplanation: 'Dry sweeping creates electrostatic drag that resuspends settled sub-micron dust (PM2.5) into the room air for up to 6 hours. Water surface tension binds particulate matter instantly upon contact.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'independent_house', 'compact_settlement'],
    badge: 'Essential Routine'
  },
  {
    id: 'door-draft-towel',
    title: 'Damp Towel Hallway Seal Hack',
    shortDesc: 'Blocks up to 40% of ambient corridor smog ingress under entrance doors.',
    difficulty: 'Easy (5 min)',
    costTier: 'Free',
    estimatedCost: '$0',
    pm25ReductionPct: 38,
    materialsNeeded: ['Old bath towel', 'Light water spray or rubber door sweep strip'],
    steps: [
      'Roll a bath towel tightly into a snake-like cylinder.',
      'Dampen slightly (not dripping wet) with water.',
      'Firmly wedge against the base gap of exterior-facing entry doors and drafty window sills.',
      'Re-dampen once daily.'
    ],
    physicsExplanation: 'High-rise apartment hallways and outside entryways act as wind tunnels with positive pressure gradients, pushing cold polluted air through 5-15mm door gaps. The dense damp fiber structure acts as a passive particulate barrier.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'compact_settlement'],
    badge: 'Quick Win'
  },
  {
    id: 'cooking-exhaust-protocol',
    title: 'High-Capture Cooking & Negative Pressure Shield',
    shortDesc: 'Prevent indoor ultra-fine particle spikes from deep frying & roasting.',
    difficulty: 'Easy (5 min)',
    costTier: 'Free',
    estimatedCost: '$0',
    pm25ReductionPct: 75,
    materialsNeeded: ['Kitchen door', 'Kitchen exhaust fan', 'Pot lids'],
    steps: [
      'Close kitchen doors leading to bedrooms and living quarters before igniting stoves.',
      'Turn on the exhaust fan 2 minutes BEFORE cooking begins to establish stable outward airflow.',
      'Cook on back burners when possible to maximize hood capture velocity by up to 30%.',
      'Always use snug pot lids when searing or simmering.',
      'Keep exhaust running for 10 minutes AFTER cooking is finished to clear lingering ultra-fine VOCs and particulates.'
    ],
    physicsExplanation: 'Thermal cooking oil decomposition releases up to 1,000 µg/m³ of ultra-fine particles (PM0.1) into room air. Establishing negative room pressure isolates toxic kitchen plumes from living areas.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'independent_house'],
    badge: 'Health Critical'
  },
  {
    id: 'ultrasonic-water-audit',
    title: 'Ultrasonic Humidifier Water Protocol',
    shortDesc: 'Stop accidental creation of dangerous mineral-dust PM2.5 in children rooms.',
    difficulty: 'Easy (5 min)',
    costTier: '$',
    estimatedCost: '$2 - $5 (Distilled water or RO)',
    pm25ReductionPct: 90,
    materialsNeeded: ['Distilled water or RO filtered water (TDS < 20 ppm)', 'Evaporative wick filter (alternative)'],
    steps: [
      'NEVER put municipal tap water or high-TDS water into ultrasonic vibrating humidifiers.',
      'Ultrasonic membranes atomize dissolved minerals (calcium, magnesium, chloride) into breathable 0.5 - 2.5 µm aerosol dust.',
      'Use only steam vaporizers or distilled / reverse-osmosis water.',
      'Clean misting chamber weekly with white vinegar to stop bacterial endotoxin formation.'
    ],
    physicsExplanation: 'Tap water with 300 ppm TDS creates artificial PM2.5 spikes exceeding 400 µg/m³ inside closed rooms, presenting severe respiratory irritation disguised as clean humidity.',
    applicableDwellings: ['high_rise_apartment', 'low_rise_apartment', 'independent_house', 'compact_settlement'],
    badge: 'Child Safety Priority'
  }
];
