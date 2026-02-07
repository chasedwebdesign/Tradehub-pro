import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase LOCALLY with Safety Fallbacks
// Using the Service Role Key allows bypassing RLS to write data.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrhetnezmccltwqmqrhs.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaGV0bmV6bWNjbHR3cW1xcmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTgwNjYyMSwiZXhwIjoyMDg1MzgyNjIxfQ.Tq-SBp8uuuHfRO-RRqNYNZTnDx7-euSmDgaO6bopAXY'
);

// Real-world data sample for Water Treatment Operators
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
  { city: "Austin", state: "TX", slug: "austin-tx", salary: 62000 }, // Added Austin for good measure
];

export async function GET() {
  try {
    const results = [];

    // 1. Ensure the Occupation exists (Upsert handles duplicate checks)
    const { data: occupation, error: occError } = await supabase
      .from('occupations')
      .upsert(
        { title: 'Water Treatment Operator', slug: 'water-treatment' },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (occError || !occupation) throw new Error('Failed to create/find occupation');

    // 2. Loop through every city and insert data
    for (const item of SEED_DATA) {
      
      // A. Upsert Location (The Fix: Prevents "Duplicate Key" errors)
      // If the slug 'new-york-ny' exists, it updates it. If not, it creates it.
      const { data: location, error: locError } = await supabase
        .from('locations')
        .upsert(
          { 
            city: item.city, 
            state: item.state, 
            slug: item.slug 
          },
          { onConflict: 'slug' } // <--- This matches your new DB constraint
        )
        .select('id')
        .single();

      if (locError) {
        console.error(`Error upserting location ${item.city}:`, locError);
        continue;
      }

      // B. Upsert Salary Data
      // Ensures we don't duplicate salary entries for the same city+trade
      if (occupation && location) {
        const { error: salaryError } = await supabase
          .from('salary_data')
          .upsert({
            occupation_id: occupation.id,
            location_id: location.id,
            annual_salary: item.salary
          }, { onConflict: 'occupation_id, location_id' }); 

        if (!salaryError) {
          results.push(`Processed: ${item.city}`);
        } else {
          console.error(`Error inserting salary for ${item.city}:`, salaryError);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database seeded successfully! Processed ${results.length} cities.`,
      cities: results 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}