import { createClient } from '@supabase/supabase-js';

// DIRECT PASTE: We are bypassing the environment variables to force it to work.
const supabaseUrl = 'https://wrhetnezmccltwqmqrhs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaGV0bmV6bWNjbHR3cW1xcmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDY2MjEsImV4cCI6MjA4NTM4MjYyMX0.nxU_iCOM8twcQj6JEgQoM2n4dt_amvnCrDQlPOLkFyY';

export const supabase = createClient(supabaseUrl, supabaseKey);