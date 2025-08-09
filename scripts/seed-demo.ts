import { supabase } from '@/lib/supabase-client';
import { generateDemoPortfolio } from '@/lib/demo-portfolio';

/**
 * Seed script for generating demo portfolios for QA/testing.
 * Usage: bun run scripts/seed-demo.ts
 */
async function seedDemoPortfolios(count = 5) {
  for (let i = 0; i < count; i++) {
    const { data: user, error } = await supabase.auth.signUp({
      email: `qa_demo_${Date.now()}_${i}@virginfund.local`,
      password: crypto.randomUUID(),
      options: { data: { is_demo_user: true } }
    });
    if (error || !user?.user) {
      console.error('Demo user creation failed:', error?.message);
      continue;
    }
    try {
      await generateDemoPortfolio(user.user.id);
      console.log(`Seeded demo portfolio for user ${user.user.id}`);
    } catch (err) {
      console.error('Demo portfolio generation failed:', err);
    }
  }
}

seedDemoPortfolios();
