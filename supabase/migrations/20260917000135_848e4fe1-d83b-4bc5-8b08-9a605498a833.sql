REVOKE EXECUTE ON FUNCTION public.sync_hot_take_vote_count() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_hot_take_vote_count() TO service_role;