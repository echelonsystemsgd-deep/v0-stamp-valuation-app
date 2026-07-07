const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://blgcrgvhhilbczsniqeu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZ2NyZ3ZoaGlsYmN6c25pcWV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjg0NzUxNCwiZXhwIjoyMDk4NDIzNTE0fQ.aCCshdrrjUxZ_wkXFVlsj0gf3E1QWzS0aD1FaliItRQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const tablesToCheck = [
  'profiles',
  'profile_payout_details',
  'stamp_categories',
  'submissions',
  'submission_items',
  'submission_images',
  'payouts',
  'submission_messages',
  'submission_internal_notes',
  'submission_history',
  'stamp_category_history',
  'admin_audit_logs',
  'user_login_history'
];

async function checkTables() {
  console.log('Checking tables in project blgcrgvhhilbczsniqeu...');
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table "${table}": Error - ${error.message} (code: ${error.code})`);
      } else {
        console.log(`✅ Table "${table}": Exists!`);
      }
    } catch (e) {
      console.log(`❌ Table "${table}": Exception - ${e.message}`);
    }
  }
}

checkTables();
