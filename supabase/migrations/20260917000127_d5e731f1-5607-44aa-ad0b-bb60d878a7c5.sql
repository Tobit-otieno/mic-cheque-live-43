CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  handle text NOT NULL UNIQUE CHECK (handle ~ '^[A-Za-z0-9_]{3,20}$'),
  favorite_host text NOT NULL CHECK (favorite_host IN ('Chaxy', 'Mariah', 'Mwass', 'Saddam')),
  fpl_manager_id text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Members update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Members delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hot_takes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 8 AND 1200),
  tag text NOT NULL CHECK (tag IN ('DatingDilemmas', 'CampusLife', 'WildStories', 'KenyanPopCulture')),
  discussed_on_air boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'hidden')),
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hot_takes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hot_takes TO authenticated;
GRANT ALL ON public.hot_takes TO service_role;
ALTER TABLE public.hot_takes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public views approved takes" ON public.hot_takes FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "Members view approved or own takes" ON public.hot_takes FOR SELECT TO authenticated USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Members submit own takes" ON public.hot_takes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND discussed_on_air = false AND vote_count = 0);
CREATE POLICY "Members update own takes" ON public.hot_takes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND discussed_on_air = false);
CREATE POLICY "Members delete own takes" ON public.hot_takes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER hot_takes_updated_at BEFORE UPDATE ON public.hot_takes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hot_take_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  hot_take_id uuid NOT NULL REFERENCES public.hot_takes(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, hot_take_id)
);
GRANT SELECT, INSERT, DELETE ON public.hot_take_votes TO authenticated;
GRANT ALL ON public.hot_take_votes TO service_role;
ALTER TABLE public.hot_take_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view votes" ON public.hot_take_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members add own votes" ON public.hot_take_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members remove own votes" ON public.hot_take_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.sync_hot_take_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hot_takes
  SET vote_count = (SELECT count(*) FROM public.hot_take_votes WHERE hot_take_id = COALESCE(NEW.hot_take_id, OLD.hot_take_id))
  WHERE id = COALESCE(NEW.hot_take_id, OLD.hot_take_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER hot_take_vote_count_after_change AFTER INSERT OR DELETE ON public.hot_take_votes FOR EACH ROW EXECUTE FUNCTION public.sync_hot_take_vote_count();

CREATE TABLE public.banter_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 280),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banter_comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.banter_comments TO authenticated;
GRANT ALL ON public.banter_comments TO service_role;
ALTER TABLE public.banter_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone views banter" ON public.banter_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Members post banter" ON public.banter_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members delete own banter" ON public.banter_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.event_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_slug text NOT NULL,
  attendee_name text NOT NULL,
  pass_code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_slug)
);
GRANT SELECT, INSERT, DELETE ON public.event_passes TO authenticated;
GRANT ALL ON public.event_passes TO service_role;
ALTER TABLE public.event_passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view own passes" ON public.event_passes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Members claim own passes" ON public.event_passes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members release own passes" ON public.event_passes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_kes integer NOT NULL CHECK (total_kes >= 0),
  status text NOT NULL DEFAULT 'cart' CHECK (status IN ('cart', 'pending', 'paid', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Members create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members update own carts" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'cart') WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members delete own carts" ON public.orders FOR DELETE TO authenticated USING (auth.uid() = user_id AND status = 'cart');
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();