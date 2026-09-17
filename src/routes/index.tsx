import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowUp, CalendarDays, Check, ChevronRight, CircleUserRound, Flame, Headphones, Home, LockKeyhole, Menu, Mic2, Play, Radio, ShoppingBag, Sparkles, Ticket, Trophy, Users, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import micImage from "@/assets/mic-cheque-microphone.jpg";
import busImage from "@/assets/mic-cheque-bus.png";
import merchImage from "@/assets/mic-cheque-merch.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Mic Cheque Podcast — The Studio" },
    { name: "description", content: "Watch Mic Cheque, join Kenya's loudest podcast community, claim event passes and shop official merch." },
    { property: "og:title", content: "Mic Cheque Podcast — The Studio" },
    { property: "og:description", content: "Watch, debate, link up and rep the Mic Cheque community." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const nav = [{ id: "studio", label: "Studio", icon: Home }, { id: "community", label: "Community", icon: Users }, { id: "events", label: "Events", icon: Ticket }, { id: "shop", label: "Shop", icon: ShoppingBag }];
const campuses = ["UoN", "KU", "Strathmore", "JKUAT"];
const hosts = ["Chaxy", "Mariah", "Mwass", "Saddam"];
const products = [{ name: "Studio Heavyweight Hoodie", price: 4800 }, { name: "Cheque Mate Cap", price: 1800 }, { name: "On-Air Tee", price: 2500 }];
const seedTakes = [
  { id: "seed-1", handle: "@nairobinoise", body: "Is splitting the bill on a first date romance or a finance meeting?", tag: "DatingDilemmas", votes: 284, aired: true },
  { id: "seed-2", handle: "@kuafterdark", body: "Our lecturer joined the class WhatsApp group undercover. Chaos followed.", tag: "CampusLife", votes: 197, aired: false },
  { id: "seed-3", handle: "@matatuoracle", body: "Kenyan artists need to bring back proper album rollouts—not one post and vibes.", tag: "KenyanPopCulture", votes: 143, aired: false },
];

function Index() {
  const [active, setActive] = useState("studio");
  const [authOpen, setAuthOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [take, setTake] = useState("");
  const [filter, setFilter] = useState("All");
  const [voted, setVoted] = useState<string[]>([]);
  const [cart, setCart] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const visibleTakes = useMemo(() => filter === "All" ? seedTakes : seedTakes.filter((item) => item.tag === filter), [filter]);
  const jump = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const requireMember = (action: () => void) => session ? action() : setAuthOpen(true);

  return (
    <div className="min-h-screen overflow-x-hidden pb-24 lg:pb-0">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <button onClick={() => jump("studio")} className="flex items-center gap-2" aria-label="Mic Cheque home"><span className="grid size-9 place-items-center rounded-md bg-primary font-black text-primary-foreground">MC</span><span className="text-base font-black uppercase">Mic Cheque</span></button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">{nav.map((item) => <Button key={item.id} variant="ghost" onClick={() => jump(item.id)} className={active === item.id ? "text-primary" : "text-muted-foreground"}>{item.label}</Button>)}</nav>
          <Button variant="glass" size="sm" onClick={() => setAuthOpen(true)}><CircleUserRound />{session ? "My Profile" : "Become a Cheque Mate"}</Button>
        </div>
      </header>

      <main>
        <section id="studio" className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-10 px-4 pb-16 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="relative z-10">
            <div className="mb-7 flex items-center gap-3"><Badge variant="destructive" className="gap-1.5"><Radio className="size-3" /> NEW EPISODE</Badge><span className="text-xs font-bold uppercase text-muted-foreground">Every Thursday</span></div>
            <p className="mb-3 text-sm font-black uppercase text-primary">Kenya's loudest studio</p>
            <h1 className="max-w-3xl text-6xl font-black uppercase leading-[.9] sm:text-7xl lg:text-8xl">Mic<br/><span className="text-outline">Cheque</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Comedy, culture, unfiltered chaos. Chaxy, Mariah, Mwass and Saddam put Nairobi's hottest conversations on the mic.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button variant="studio" size="lg" asChild><a href="https://www.youtube.com/results?search_query=Mic+Cheque+Podcast" target="_blank" rel="noreferrer"><Play fill="currentColor" /> Watch on YouTube</a></Button><Button variant="glass" size="lg" asChild><a href="https://open.spotify.com/search/Mic%20Cheque%20Podcast" target="_blank" rel="noreferrer"><Headphones /> Listen on Spotify</a></Button></div>
            <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-border py-5"><Metric value="200K+" label="Cheque Mates"/><Metric value="4.9" label="Fan rating"/><Metric value="156" label="Episodes"/></div>
          </div>
          <MicStage />
        </section>

        <section className="border-y border-border bg-ink/50 py-16"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><SectionTitle kicker="Now playing" title="The group chat went public."/><div className="text-right"><p className="text-sm font-bold text-primary">EP. 156</p><p className="text-sm text-muted-foreground">1 HR 42 MIN · WITH JUST IVY</p></div></div><div className="glass-panel grid overflow-hidden rounded-lg lg:grid-cols-[1fr_1.2fr]"><img src={micImage} width={1200} height={1200} alt="Broadcast microphone inside the Mic Cheque studio" className="aspect-video h-full w-full object-cover lg:aspect-auto"/><div className="flex flex-col justify-center p-6 sm:p-10"><Badge className="mb-5 w-fit">GUEST EPISODE</Badge><h2 className="text-3xl font-black uppercase sm:text-5xl">Soft life, hard truths & Nairobi dating</h2><p className="mt-4 max-w-xl text-muted-foreground">The crew gets honest about dating budgets, online personas and the audacity economy.</p><div className="mt-8 flex gap-3"><Button variant="studio"><Play fill="currentColor"/>Play episode</Button><Button variant="glass">View notes <ChevronRight/></Button></div></div></div></div></section>

        <section className="overflow-hidden py-20"><div className="mx-auto max-w-7xl px-4 lg:px-8"><SectionTitle kicker="Cheque Mate Campus Tour" title="Next stop: your campus."/><div className="relative mt-10 rounded-lg border border-border bg-secondary/70 px-4 pb-8 pt-10"><div className="absolute left-[8%] right-[8%] top-[58%] border-t-2 border-dashed border-primary/50"/><img src={busImage} width={1408} height={800} loading="lazy" alt="Yellow Mic Cheque campus tour bus" className="bus-drive relative z-10 mx-auto w-full max-w-3xl drop-shadow-2xl"/><div className="relative z-20 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{campuses.map((campus, i) => <button key={campus} onClick={() => requireMember(() => { setClaimed(true); jump("events"); })} className="glass-panel rounded-md p-4 text-left transition hover:border-primary/50"><span className="mb-3 block size-3 rounded-full bg-primary ring-4 ring-primary/15"/><strong className="block">{campus}</strong><span className="text-xs text-muted-foreground">{["Sep 24", "Oct 03", "Oct 11", "Oct 18"][i]} · Free RSVP</span></button>)}</div></div></div></section>

        <section id="community" className="border-y border-border bg-ink/55 py-20"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]"><div><SectionTitle kicker="Digital mailbag" title="Hot Takes Wall"/><div className="glass-panel mt-8 rounded-lg p-4 sm:p-6"><Textarea value={take} onChange={(e) => setTake(e.target.value)} placeholder="Drop the story you can't tell in the family group..." className="min-h-28 resize-none border-0 bg-transparent text-base"/><div className="mt-3 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">Anonymous until you choose otherwise</span><Button variant="studio" onClick={() => requireMember(() => setTake(""))}><Mic2/>Send to studio</Button></div></div><div className="my-6 flex gap-2 overflow-x-auto pb-2">{["All", "DatingDilemmas", "CampusLife", "WildStories", "KenyanPopCulture"].map((tag) => <Button key={tag} size="sm" variant={filter === tag ? "studio" : "glass"} onClick={() => setFilter(tag)}>#{tag}</Button>)}</div><div className="space-y-3">{visibleTakes.map((item) => <article key={item.id} className="glass-panel rounded-lg p-5"><div className="mb-4 flex items-center justify-between gap-3"><span className="text-sm font-bold text-primary">{item.handle}</span>{item.aired && <Badge variant="destructive" className="gap-1"><Radio className="size-3"/>Discussed on Air</Badge>}</div><p className="text-lg font-semibold leading-snug">{item.body}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs text-muted-foreground">#{item.tag}</span><Button size="sm" variant={voted.includes(item.id) ? "studio" : "glass"} onClick={() => requireMember(() => setVoted((old) => old.includes(item.id) ? old.filter((id) => id !== item.id) : [...old, item.id]))}><ArrowUp/>{item.votes + (voted.includes(item.id) ? 1 : 0)}</Button></div></article>)}</div></div><FplPanel onMember={() => requireMember(() => setAuthOpen(true))}/></div></div></section>

        <section id="events" className="py-20"><div className="mx-auto max-w-7xl px-4 lg:px-8"><SectionTitle kicker="Live outside the studio" title="Your pass is the link-up."/><div className="mt-10 grid items-center gap-10 lg:grid-cols-2"><TicketCard flipped={flipped} claimed={claimed} onFlip={() => requireMember(() => { setClaimed(true); setFlipped(!flipped); })}/><div><Badge variant="destructive" className="mb-4">LIMITED CAPACITY</Badge><h3 className="text-4xl font-black uppercase">Cheque Mates Hangout: Nairobi</h3><p className="mt-4 text-muted-foreground">Live recording, games, host Q&A and zero boring small talk. Your digital pass lives in your profile.</p><div className="mt-6 space-y-3"><InfoRow icon={CalendarDays} label="Saturday, 26 September · 2:00 PM"/><InfoRow icon={Mic2} label="The Alchemist, Westlands"/><InfoRow icon={Users} label="18+ · Limited to 400 Cheque Mates"/></div><Button className="mt-8" variant="studio" size="lg" onClick={() => requireMember(() => { setClaimed(true); setFlipped(true); })}>{claimed ? <><Check/>Pass claimed</> : <><Ticket/>Claim free pass</>}</Button></div></div></div></section>

        <section id="shop" className="border-t border-border bg-ink/55 py-20"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><SectionTitle kicker="Official drop 01" title="Wear the conversation."/><Button variant="glass"><ShoppingBag/>Cart <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{cart}</span></Button></div><div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="overflow-hidden rounded-lg border border-border"><img src={merchImage} width={1408} height={912} loading="lazy" alt="Mic Cheque black hoodie, cap and t-shirt collection" className="h-full min-h-96 w-full object-cover"/></div><div className="space-y-3">{products.map((product, i) => <div key={product.name} className="glass-panel flex items-center justify-between rounded-lg p-5"><div><p className="text-xs font-bold text-primary">0{i+1}</p><h3 className="mt-1 font-bold">{product.name}</h3><p className="mt-1 text-sm text-muted-foreground">KES {product.price.toLocaleString()}</p></div><Button variant="studio" size="icon" aria-label={`Add ${product.name} to cart`} onClick={() => setCart((n) => n + 1)}><ShoppingBag/></Button></div>)}<div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-5"><Sparkles className="mb-3 text-primary"/><p className="font-bold">Cheque Mate early access</p><p className="mt-1 text-sm text-muted-foreground">Members get first dibs on every limited drop.</p></div></div></div></div></section>
      </main>

      <footer className="border-t border-border py-12"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between lg:px-8"><div><span className="text-2xl font-black uppercase">Mic Cheque</span><p className="mt-2 text-sm text-muted-foreground">Chaxy · Mariah · Mwass · Saddam</p></div><p className="text-xs uppercase text-muted-foreground">Nairobi, Kenya · Cheque your mic.</p></div></footer>
      <MobileNav active={active} jump={jump}/>
      {authOpen && <AuthModal session={session} close={() => setAuthOpen(false)}/>} 
    </div>
  );
}

function MicStage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (e: MouseEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY-r.top)/r.height-.5)*-8, y: ((e.clientX-r.left)/r.width-.5)*10 }); };
  return <div onMouseMove={move} onMouseLeave={() => setTilt({x:0,y:0})} className="perspective-stage relative mx-auto w-full max-w-xl"><div className="absolute -inset-3 rounded-lg border border-primary/20"/><div className="mic-float relative overflow-hidden rounded-lg border border-border transition-transform duration-200" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}><img src={micImage} width={1200} height={1200} alt="Mic Cheque studio microphone" className="aspect-square w-full object-cover"/><div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-background/80 p-5 backdrop-blur-sm"><div><p className="text-xs font-bold text-primary">LATEST · EP 156</p><p className="font-black">Soft life, hard truths</p></div><span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"><Play fill="currentColor"/></span></div></div></div>;
}

function AuthModal({ session, close }: { session: Session | null; close: () => void }) {
  const [mode, setMode] = useState<"options"|"email"|"profile">(session ? "profile" : "options");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  const [handle, setHandle] = useState(""); const [host, setHost] = useState("Mariah");
  async function oauth(provider: "google"|"apple") { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin }); if (result.error) setMessage(result.error.message); else if (!result.redirected) setMode("profile"); }
  async function emailAuth(e: FormEvent) { e.preventDefault(); const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } }); if (result.error) setMessage(result.error.message); else if (!result.data.session) setMessage("Cheque your inbox to confirm your email, then come back to finish your profile."); else setMode("profile"); }
  async function saveProfile(e: FormEvent) { e.preventDefault(); const { data } = await supabase.auth.getUser(); if (!data.user) { setMessage("Sign in first to save your Cheque Mate profile."); return; } const { error } = await supabase.from("profiles").upsert({ id: data.user.id, handle: handle.replace(/^@/, ""), favorite_host: host }); if (error) setMessage(error.message); else { setMessage("You're officially a Cheque Mate."); setTimeout(close, 700); } }
  async function signOut() { await supabase.auth.signOut(); close(); }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Become a Cheque Mate"><div className="glass-panel relative w-full max-w-md rounded-lg p-6 sm:p-8"><Button variant="ghost" size="icon" className="absolute right-3 top-3" onClick={close} aria-label="Close"><X/></Button><div className="mb-7 grid size-12 place-items-center rounded-md bg-primary text-xl font-black text-primary-foreground">MC</div><p className="text-xs font-bold uppercase text-primary">Members only</p><h2 className="mt-2 text-3xl font-black uppercase">Become a Cheque Mate</h2>{mode === "options" && <div className="mt-7 space-y-3"><Button variant="glass" className="h-12 w-full" onClick={() => oauth("google")}>Continue with Google</Button><Button variant="glass" className="h-12 w-full" onClick={() => oauth("apple")}>Continue with Apple</Button><div className="flex items-center gap-3 py-2"><span className="h-px flex-1 bg-border"/><span className="text-xs text-muted-foreground">OR</span><span className="h-px flex-1 bg-border"/></div><Button variant="studio" className="h-12 w-full" onClick={() => setMode("email")}><LockKeyhole/>Sign up with email</Button></div>}{mode === "email" && <form className="mt-7 space-y-3" onSubmit={emailAuth}><Input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}/><Input type="password" required minLength={8} placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)}/><Button variant="studio" className="h-12 w-full" type="submit">Create account</Button><Button variant="ghost" className="w-full" type="button" onClick={() => setMode("options")}>Back</Button></form>}{mode === "profile" && <form className="mt-7 space-y-4" onSubmit={saveProfile}><Input required minLength={3} maxLength={20} placeholder="@ChequeMate handle" value={handle} onChange={(e) => setHandle(e.target.value)}/><fieldset><legend className="mb-2 text-sm font-bold">Your favorite host</legend><div className="grid grid-cols-2 gap-2">{hosts.map((name) => <Button key={name} type="button" variant={host === name ? "studio" : "glass"} onClick={() => setHost(name)}>{name}</Button>)}</div></fieldset><Button variant="studio" className="h-12 w-full" type="submit">Save my profile</Button>{session && <Button variant="ghost" className="w-full text-muted-foreground" type="button" onClick={signOut}>Sign out</Button>}</form>}{message && <p className="mt-5 rounded-md border border-border bg-secondary p-3 text-sm text-muted-foreground">{message}</p>}</div></div>;
}

function TicketCard({ flipped, claimed, onFlip }: { flipped: boolean; claimed: boolean; onFlip: () => void }) { return <button onClick={onFlip} className="perspective-stage aspect-[1.6/1] w-full text-left"><div className={`preserve-3d relative h-full w-full transition-transform duration-700 ${flipped ? "rotate-y-180" : ""}`}><div className="backface-hidden absolute inset-0 overflow-hidden rounded-lg border border-primary/40 bg-secondary p-6 shadow-[0_20px_60px_var(--primary-glow)]"><div className="flex h-full flex-col justify-between"><div className="flex justify-between"><span className="grid size-12 place-items-center rounded-md bg-primary text-lg font-black text-primary-foreground">MC</span><Badge variant="destructive">LIVE</Badge></div><div><p className="text-xs font-bold text-primary">ADMIT ONE · NAIROBI</p><p className="mt-2 text-2xl font-black uppercase sm:text-4xl">Cheque Mates Hangout</p><p className="mt-2 text-sm text-muted-foreground">Tap to reveal your digital pass</p></div></div></div><div className="backface-hidden rotate-y-180 absolute inset-0 rounded-lg border border-primary/40 bg-primary p-5 text-primary-foreground"><div className="flex h-full items-center justify-between gap-4"><div><p className="text-xs font-black">DIGITAL ENTRY PASS</p><p className="mt-3 text-xl font-black">{claimed ? "CM-NAIROBI-0926" : "CLAIM TO UNLOCK"}</p><p className="mt-2 text-xs opacity-70">26 SEP · THE ALCHEMIST</p></div><div className="rounded-md bg-foreground p-3">{claimed ? <QRCodeSVG value="MIC-CHEQUE-CM-NAIROBI-0926" size={100}/> : <LockKeyhole className="size-16 text-background"/>}</div></div></div></div></button>; }
function FplPanel({ onMember }: { onMember: () => void }) { const leaders = [["1","Saddam FC","2,184"],["2","Mwas City","2,106"],["3","Wanjiku XI","2,071"],["4","Chaxy Ballers","2,042"]]; return <aside className="lg:sticky lg:top-24 lg:self-start"><div className="rounded-lg bg-primary p-6 text-primary-foreground"><div className="flex items-center justify-between"><Trophy className="size-8"/><span className="text-xs font-black">LEAGUE ykpeg4</span></div><p className="mt-10 text-xs font-black uppercase">Manager of the week</p><h3 className="mt-1 text-3xl font-black uppercase">Akinyi's XI</h3><p className="mt-1 text-sm">96 pts · Triple captain masterclass</p></div><div className="glass-panel mt-3 rounded-lg p-5"><div className="mb-5 flex items-center justify-between"><h3 className="font-black uppercase">FPL Table</h3><Badge variant="outline">GW 5</Badge></div>{leaders.map(([rank,name,points]) => <div key={name} className="grid grid-cols-[2rem_1fr_auto] border-t border-border py-3 text-sm"><span className="text-muted-foreground">{rank}</span><strong>{name}</strong><span>{points}</span></div>)}<Button variant="glass" className="mt-4 w-full" onClick={onMember}><Flame/>Join the banter</Button></div></aside>; }
function Metric({ value, label }: { value: string; label: string }) { return <div><strong className="block text-xl text-primary sm:text-2xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></div>; }
function SectionTitle({ kicker, title }: { kicker: string; title: string }) { return <div><p className="mb-2 text-xs font-black uppercase text-primary">{kicker}</p><h2 className="max-w-3xl text-4xl font-black uppercase leading-none sm:text-5xl">{title}</h2></div>; }
function InfoRow({ icon: Icon, label }: { icon: typeof Menu; label: string }) { return <div className="flex items-center gap-3 text-sm"><span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Icon className="size-4"/></span><span>{label}</span></div>; }
function MobileNav({ active, jump }: { active: string; jump: (id: string) => void }) { return <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-lg border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">{nav.map(({id,label,icon:Icon}) => <button key={id} onClick={() => jump(id)} className={`flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-bold ${active === id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="size-5"/>{label}</button>)}</nav>; }