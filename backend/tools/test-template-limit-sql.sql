-- Script pour tester les limites de templates

-- 1. Voir la limite actuelle du plan gratuit
SELECT id, name, "templateLimit" 
FROM plans 
WHERE id = 'free';

-- 2. Réduire la limite pour tester (ex: 2 templates)
UPDATE plans 
SET "templateLimit" = 2 
WHERE id = 'free';

-- 3. Vérifier le changement
SELECT id, name, "templateLimit" 
FROM plans 
WHERE id = 'free';

-- 4. Voir les templates d'un utilisateur
SELECT t.name, t.category, u.email
FROM templates t
JOIN users u ON t."userId" = u.id
WHERE u.email = 'votre-email@example.com';

-- 5. Compter les templates d'un utilisateur
SELECT COUNT(*) as template_count
FROM templates t
JOIN users u ON t."userId" = u.id
WHERE u.email = 'votre-email@example.com';

-- 6. Remettre la limite originale (3 templates)
UPDATE plans 
SET "templateLimit" = 3 
WHERE id = 'free'; 