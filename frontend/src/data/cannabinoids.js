export const CANNABINOIDS = [
  { id: 'thc', name: 'THC', fullName: 'Delta-9-Tetrahydrocannabinol', color: '#ff8c32', description: 'The primary psychoactive compound. Responsible for euphoria, relaxation, pain relief, and appetite stimulation.' },
  { id: 'cbd', name: 'CBD', fullName: 'Cannabidiol', color: '#9775fa', description: 'Non-psychoactive compound known for anti-anxiety, anti-inflammatory, and neuroprotective properties. Modulates THC effects.' },
  { id: 'cbn', name: 'CBN', fullName: 'Cannabinol', color: '#ffd43b', description: 'Mildly psychoactive. Forms as THC ages. Known for sedative properties and is being studied for sleep support.' },
  { id: 'cbg', name: 'CBG', fullName: 'Cannabigerol', color: '#51cf66', description: 'The "mother cannabinoid" from which others are synthesized. Shows promise for focus, anti-inflammatory effects, and appetite stimulation.' },
  { id: 'thcv', name: 'THCV', fullName: 'Tetrahydrocannabivarin', color: '#22b8cf', description: 'Produces a clear-headed, energizing high at high doses. May suppress appetite and provide shorter-duration effects.' },
  { id: 'cbc', name: 'CBC', fullName: 'Cannabichromene', color: '#f06595', description: 'Non-psychoactive. May contribute to mood elevation and amplify the effects of other cannabinoids through the entourage effect.' },
];

export const THC_PREFERENCES = [
  { id: 'low', label: 'Low', desc: 'Under 15%', range: [0, 15] },
  { id: 'medium', label: 'Medium', desc: '15–22%', range: [15, 22] },
  { id: 'high', label: 'High', desc: '22–28%', range: [22, 28] },
  { id: 'very_high', label: 'Very High', desc: '28%+', range: [28, 40] },
  { id: 'no_preference', label: 'No Preference', desc: 'Any THC level', range: [0, 40] },
];

export const CBD_PREFERENCES = [
  { id: 'none', label: 'None Needed', desc: 'Minimal CBD', range: [0, 1] },
  { id: 'some', label: 'Some CBD', desc: 'Balanced 1–5%', range: [1, 5] },
  { id: 'high', label: 'High CBD', desc: 'Therapeutic 5–15%', range: [5, 15] },
  { id: 'cbd_dominant', label: 'CBD-Dominant', desc: '15%+ CBD', range: [15, 30] },
];
