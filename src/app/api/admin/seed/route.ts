import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase LOCALLY with Safety Fallbacks
// This prevents the build from crashing if Vercel checks for keys before the app runs.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrhetnezmccltwqmqrhs.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaGV0bmV6bWNjbHR3cW1xcmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTgwNjYyMSwiZXhwIjoyMDg1MzgyNjIxfQ.Tq-SBp8uuuHfRO-RRqNYNZTnDx7-euSmDgaO6bopAXY'
);

// Real-world data sample for Water Treatment Operators (BLS estimates)
const SEED_DATA = [
  { city: "New York", state: "NY", slug: "new-york-ny", salary: 78000 },
  { city: "Los Angeles", state: "CA", slug: "los-angeles-ca", salary: 84500 },
  { city: "Chicago", state: "IL", slug: "chicago-il", salary: 71000 },
  { city: "Houston", state: "TX", slug: "houston-tx", salary: 64000 },
  { city: "Phoenix", state: "AZ", slug: "phoenix-az", salary: 61500 },
  { city: "Philadelphia", state: "PA", slug: "philadelphia-pa", salary: 66000 },
  { city: "San Antonio", state: "TX", slug: "san-antonio-tx", salary: 59000 },
  { city: "San Diego", state: "CA", slug: "san-diego-ca", salary: 81000 },
  { city: "Dallas", state: "TX", slug: "dallas-tx", salary: 63500 },
  { city: "San Jose", state: "CA", slug: "san-jose-ca", salary: 92000 },
  { city: "Seattle", state: "WA", slug: "seattle-wa", salary: 76000 },
  { city: "Denver", state: "CO", slug: "denver-co", salary: 68500 },
];

export async function GET() {
  try {
    const results = [];

    // 1. Ensure the Occupation exists
    let { data: occupation } = await supabase
      .from('occupations')
      .select('id')
      .eq('slug', 'water-treatment')
      .single();

    if (!occupation) {
      const { data: newOcc } = await supabase
        .from('occupations')
        .insert({ title: 'Water Treatment Operator', slug: 'water-treatment' })
        .select()
        .single();
      occupation = newOcc;
    }

    // 2. Loop through every city and insert data
    for (const item of SEED_DATA) {
      
      // A. Insert/Get Location
      let { data: location } = await supabase
        .from('locations')
        .select('id')
        .eq('slug', item.slug)
        .single();

      if (!location) {
        const { data: newLoc } = await supabase
          .from('locations')
          .insert({ city: item.city, state: item.state, slug: item.slug })
          .select()
          .single();
        location = newLoc;
      }

      // B. Insert Salary Data
      if (occupation && location) {
        const { error } = await supabase
          .from('salary_data')
          .upsert({
            occupation_id: occupation.id,
            location_id: location.id,
            annual_salary: item.salary
          }, { onConflict: 'occupation_id, location_id' }); // Prevent duplicates

        if (!error) {
          results.push(`Inserted: ${item.city}`);
        } else {
          console.error(`Error for ${item.city}:`, error);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database seeded with ${results.length} cities!`,
      cities: results 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}