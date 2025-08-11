import { supabase } from '@/lib/supabase-client';
import { generateDemoPortfolios } from '@/lib/demo-data';

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

async function generateDemoPortfolio(userId: string) {
  const demoPortfolios = generateDemoPortfolios();
  for (const portfolio of demoPortfolios) {
    const { error } = await supabase
      .from('portfolios')
      .insert({ user_id: userId, ...portfolio });
    if (error) {
      console.error(`Failed to insert portfolio ${portfolio.name}:`, error.message);
    }
  }
}

seedDemoPortfolios();
