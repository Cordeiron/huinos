-- ====================================================================
-- HUIOS SYSTEM - SETTINGS TABLE MIGRATION
-- ====================================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard/project/rtskdnthauspcjrdwffh/sql/new
-- ====================================================================

-- Create settings table (safe to run multiple times)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  verse_text TEXT NOT NULL DEFAULT '',
  verse_reference TEXT NOT NULL DEFAULT '',
  verse_translation TEXT NOT NULL DEFAULT 'Almeida Revista e Corrigida',
  banner_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings row (only if not exists)
INSERT INTO settings (id, verse_text, verse_reference, verse_translation, banner_url)
SELECT
  'global-1',
  'Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito, na fé, na pureza.',
  '1 Timóteo 4:12',
  'Almeida Revista e Corrigida',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 'global-1');
