SELECT 
    relname as table_name, 
    relrowsecurity as rls_enabled 
FROM pg_class 
JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
WHERE nspname = 'public' 
AND relname IN ('pathfinder_specialties', 'pathfinder_classes');

SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename IN ('pathfinder_specialties', 'pathfinder_classes');
