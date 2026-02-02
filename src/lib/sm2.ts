export function calculateSm2(quality: number, repetitions: number, efactor: number, interval: number) {
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * efactor);
    
    repetitions++;
    efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    repetitions = 0;
    interval = 1;
  }
  
  if (efactor < 1.3) efactor = 1.3;
  
  return { repetitions, efactor, interval };
}