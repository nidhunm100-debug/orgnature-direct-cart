-- ROLES
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return exists (select 1 from public.user_roles where user_id = uid and role = 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin') on conflict do nothing;
  return true;
end; $$;

grant execute on function public.claim_admin() to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, anon;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories are public" on public.categories for select to anon, authenticated using (true);
create policy "admins manage categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_slug text not null references public.categories(slug) on update cascade,
  subcategory text,
  short_description text,
  description text,
  price numeric(10,2) not null default 0,
  mrp numeric(10,2),
  pack_size text,
  image_url text,
  image_url_2 text,
  lifestyle_image_url text,
  ingredients text,
  nutrition text,
  benefits text,
  preparation text,
  storage text,
  allergens text,
  additional_details text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  best_seller boolean not null default false,
  available boolean not null default true,
  product_type text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category_slug);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products are public" on public.products for select to anon, authenticated using (true);
create policy "admins manage products" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();

-- SITE SETTINGS
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings are public" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

insert into public.site_settings (key, value) values
('brand', '{"logoUrl": null, "brandName": "ANKURA", "subBrand": "by ORGNATURE", "heroImageUrl": null, "aboutImageUrl": null, "wellnessImageUrl": null}'::jsonb),
('contact', '{"whatsapp": "919449150477", "phone": "+91 94491 50477", "phoneAlt": "+91 93903 33077", "email": "orgnature3@gmail.com", "website": "www.orgnature.in", "address": "Orgnature, India", "mapEmbedUrl": null}'::jsonb),
('shipping', '{"mode": "to_be_confirmed", "flatRate": 0, "freeAbove": null, "note": "Delivery charges will be confirmed on WhatsApp."}'::jsonb);

-- STORAGE POLICIES
create policy "product images readable" on storage.objects for select using (bucket_id = 'product-images');
create policy "admins upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins update product images" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- SEED CATEGORIES
insert into public.categories (slug, name, tagline, description, sort_order) values
('cold-pressed-oils','Cold Pressed Oils','Traditionally extracted','Pure oils crafted with traditional cold pressing methods for everyday cooking.',1),
('millet-products','Millet Products','Ancient grains, modern kitchens','Wholesome millet based foods for balanced everyday eating.',2),
('health-mixes','Health Mixes','Nourishing everyday blends','Thoughtfully blended health mixes for wholesome family nutrition.',3),
('herbal-teas','Herbal Teas','Calm in every cup','Herbal infusions inspired by traditional wellness wisdom.',4),
('spices-masalas','Spices & Masalas','Freshly ground flavour','Aromatic spices and blends for authentic Indian cooking.',5),
('flours-atta','Flours & Atta','Stone ground goodness','A wide range of everyday and speciality flours.',6),
('noodles-pasta','Noodles & Pasta','Millet made fun','Millet based noodles and pasta the whole family enjoys.',7),
('baby-kids-nutrition','Baby & Kids Nutrition','Gentle beginnings','Carefully made cereals and mixes for growing little ones.',8),
('ghee-traditional','Ghee & Traditional Foods','Time honoured staples','Traditional foods made the way they always were.',9),
('snacks-nuts','Snacks & Nuts','Snack naturally','Nuts, seeds and natural snacks for everyday munching.',10),
('combos-value-packs','Combos & Value Packs','Curated together','Thoughtfully bundled combos for better value.',11),
('traditional-drinks','Traditional Drinks','Refreshing traditions','Traditional drink mixes and pulps for natural refreshment.',12);

-- SEED PRODUCTS (placeholder prices, editable in admin)
insert into public.products (slug, name, category_slug, short_description, description, price, mrp, pack_size, featured, best_seller, tags, product_type, sort_order) values
('cold-pressed-groundnut-oil','Cold Pressed Groundnut Oil','cold-pressed-oils','Traditionally cold pressed groundnut oil for everyday cooking.','Cold pressed groundnut oil extracted using traditional methods to retain its natural aroma and character. Ideal for everyday Indian cooking.',540,620,'1 Litre',true,true,'{oil,groundnut,peanut,cooking,cold pressed}','Oil',1),
('cold-pressed-sesame-oil','Cold Pressed Sesame Oil','cold-pressed-oils','Aromatic cold pressed sesame (gingelly) oil.','Cold pressed sesame oil with a rich traditional aroma, suited for cooking, tempering and traditional uses.',560,640,'1 Litre',true,false,'{oil,sesame,gingelly,til,cold pressed}','Oil',2),
('cold-pressed-coconut-oil','Cold Pressed Coconut Oil','cold-pressed-oils','Pure cold pressed coconut oil.','Cold pressed coconut oil made from carefully selected copra, with its natural coconut aroma retained.',480,540,'1 Litre',false,false,'{oil,coconut,cold pressed}','Oil',3),
('cold-pressed-sunflower-oil','Cold Pressed Sunflower Oil','cold-pressed-oils','Light cold pressed sunflower oil.','Cold pressed sunflower oil with a light taste, suitable for daily cooking.',420,480,'1 Litre',false,false,'{oil,sunflower,cold pressed}','Oil',4),
('cold-pressed-mustard-oil','Cold Pressed Mustard Oil','cold-pressed-oils','Pungent cold pressed mustard oil.','Cold pressed mustard oil with its characteristic sharp aroma, traditionally used across Indian kitchens.',460,520,'1 Litre',false,false,'{oil,mustard,sarson,cold pressed}','Oil',5),
('multi-millet-health-mix','Multi Millet Health Mix','health-mixes','A wholesome blend of millets, grains and pulses.','A traditional style health mix made with a blend of millets, grains and pulses. Simple to prepare as a warm nourishing drink or porridge.',320,360,'500 g',true,true,'{millet,health mix,breakfast,ragi,porridge}','Health Mix',1),
('millet-health-booster','Millet Health Booster','health-mixes','Everyday millet based nourishment.','A millet forward blend crafted for everyday nourishment, easy to prepare for the whole family.',340,380,'500 g',false,false,'{millet,health mix,booster}','Health Mix',2),
('high-protein-chilla-mix','High Protein Chilla Mix','millet-products','Ready blend for quick savoury chillas.','A convenient blend for preparing soft savoury chillas at home. Just add water, rest and cook.',210,240,'500 g',false,false,'{chilla,protein,millet,breakfast}','Mix',3),
('multi-millet-pasta','Multi Millet Pasta','noodles-pasta','Millet based pasta for family meals.','Pasta made with a blend of millets, a wholesome alternative for pastas and bakes at home.',150,180,'250 g',true,true,'{millet,pasta,noodles,kids}','Pasta',1),
('multi-millet-noodles','Multi Millet Noodles','noodles-pasta','Millet noodles the family enjoys.','Noodles made with a blend of millets, quick to cook and easy to pair with vegetables of your choice.',140,170,'250 g',true,true,'{millet,noodles,kids,snack}','Noodles',2),
('sprouted-ragi-baby-cereal','Sprouted Ragi Baby Cereal','baby-kids-nutrition','Sprouted ragi cereal for little ones.','A gentle cereal made from sprouted ragi, carefully processed and finely ground for easy preparation.',280,320,'300 g',true,true,'{ragi,baby,sprouted,cereal,kids}','Cereal',1),
('ancient-herbs-herbal-tea','Ancient Herbs Herbal Tea','herbal-teas','A traditional herbal infusion.','A herbal tea blend inspired by traditional herbs, made to be enjoyed as a warm everyday infusion.',350,399,'100 g',true,true,'{tea,herbal,herbs,wellness,drink}','Tea',1),
('herbal-wellness-drink-pulp','Herbal Wellness Drink Pulp','traditional-drinks','Herbal pulp for a refreshing drink.','A herbal drink pulp that can be mixed with water for a traditional style refreshing beverage.',260,299,'500 g',false,false,'{herbal,drink,pulp,wellness}','Drink Mix',1),
('wood-apple-refreshing-drink-mix','Wood Apple Refreshing Drink Mix','traditional-drinks','Traditional wood apple (bael) drink mix.','A traditional wood apple drink mix, simple to prepare as a cooling everyday beverage.',240,280,'500 g',false,false,'{wood apple,bael,drink,traditional}','Drink Mix',2),
('multi-millet-health-mix-1kg','Multi Millet Health Mix Family Pack','health-mixes','Family sized pack of our multi millet health mix.','The same wholesome multi millet health mix in a larger family pack.',590,660,'1 kg',false,false,'{millet,health mix,family pack}','Health Mix',3),
('pure-cow-ghee','Pure Cow Ghee','ghee-traditional','Aromatic pure cow ghee.','Pure cow ghee with a rich traditional aroma, prepared for everyday cooking and traditional preparations.',890,990,'500 ml',true,true,'{ghee,cow,traditional,cooking}','Ghee',1),
('wheat-atta','Wheat Atta','flours-atta','Everyday whole wheat atta.','Whole wheat atta for soft everyday rotis and chapatis.',260,290,'5 kg',false,false,'{atta,wheat,flour,roti}','Flour',1),
('multigrain-atta','Multigrain Atta','flours-atta','A blend of wholesome grains.','Multigrain atta blending wheat with other wholesome grains for everyday rotis.',320,360,'5 kg',true,false,'{atta,multigrain,flour}','Flour',2),
('jowar-atta','Jowar Atta','flours-atta','Finely milled jowar flour.','Jowar (sorghum) atta for traditional rotis and bhakris.',180,210,'1 kg',false,false,'{atta,jowar,sorghum,millet,flour}','Flour',3),
('ragi-atta','Ragi Atta','flours-atta','Finely milled ragi flour.','Ragi (finger millet) atta for rotis, porridges and traditional preparations.',170,200,'1 kg',false,false,'{atta,ragi,millet,flour}','Flour',4),
('bajra-atta','Bajra Atta','flours-atta','Finely milled bajra flour.','Bajra (pearl millet) atta for traditional rotis and bhakris.',160,190,'1 kg',false,false,'{atta,bajra,millet,flour}','Flour',5),
('besan','Besan','flours-atta','Freshly milled gram flour.','Besan milled from gram, for everyday batters, savouries and traditional cooking.',150,180,'1 kg',false,false,'{besan,gram,flour,chickpea}','Flour',6),
('kuttu-flour','Kuttu Flour','flours-atta','Buckwheat flour for fasting days.','Kuttu (buckwheat) flour, traditionally used during fasting preparations.',220,250,'500 g',false,false,'{kuttu,buckwheat,flour,vrat}','Flour',7),
('rice-atta','Rice Atta','flours-atta','Finely milled rice flour.','Rice flour for traditional snacks, batters and everyday cooking.',120,140,'1 kg',false,false,'{rice,flour,atta}','Flour',8),
('black-channa-atta','Black Channa Atta','flours-atta','Black chana flour.','Flour milled from black chana, for traditional rotis and preparations.',170,200,'1 kg',false,false,'{channa,chana,flour,atta}','Flour',9),
('broken-wheat','Broken Wheat','flours-atta','Coarse broken wheat (dalia).','Broken wheat for upma, khichdi and porridge style preparations.',110,130,'1 kg',false,false,'{broken wheat,dalia,wheat}','Flour',10),
('idli-rawa','Idli Rawa','flours-atta','Rawa for soft idlis.','Idli rawa for preparing soft traditional idlis at home.',110,130,'1 kg',false,false,'{idli,rawa,rice,breakfast}','Flour',11),
('chilli-powder','Chilli Powder','spices-masalas','Vibrant everyday chilli powder.','Chilli powder ground for everyday Indian cooking.',180,210,'500 g',false,false,'{chilli,mirchi,spice,masala}','Spice',1),
('turmeric-powder','Turmeric Powder','spices-masalas','Aromatic turmeric powder.','Turmeric powder ground for everyday cooking.',160,190,'500 g',true,false,'{turmeric,haldi,spice}','Spice',2),
('coriander-powder','Coriander Powder','spices-masalas','Freshly ground coriander powder.','Coriander powder for everyday curries and masalas.',140,170,'500 g',false,false,'{coriander,dhania,spice}','Spice',3),
('cumin-powder','Cumin Powder','spices-masalas','Freshly ground cumin powder.','Cumin powder for everyday tempering and seasoning.',190,220,'250 g',false,false,'{cumin,jeera,spice}','Spice',4),
('garam-masala','Garam Masala','spices-masalas','A warm aromatic blend.','A traditional garam masala blend for finishing curries and rice preparations.',210,240,'200 g',false,false,'{garam masala,spice,blend}','Spice',5),
('mixed-nuts','Mixed Nuts','snacks-nuts','A wholesome everyday nut mix.','A mix of nuts for everyday snacking and topping.',450,520,'500 g',false,false,'{nuts,snack,dry fruits}','Snack',1),
('mixed-seeds','Mixed Seeds','snacks-nuts','A blend of everyday seeds.','A blend of seeds for sprinkling over meals, salads and breakfast bowls.',260,299,'400 g',false,false,'{seeds,snack,healthy}','Snack',2),
('healthy-breakfast-combo','Healthy Breakfast Combo','combos-value-packs','Health mix, millet noodles and ragi cereal.','A curated breakfast combo bringing together everyday favourites for wholesome mornings.',680,780,'Combo Pack',true,false,'{combo,breakfast,millet,value}','Combo',1),
('millet-wellness-combo','Millet Wellness Combo','combos-value-packs','Millet pasta, noodles and health mix.','A millet focused combo for families switching to wholesome grains.',590,690,'Combo Pack',true,false,'{combo,millet,wellness}','Combo',2),
('family-wellness-combo','Family Wellness Combo','combos-value-packs','Ghee, health mix and herbal tea.','A family combo of everyday essentials for wholesome living.',1450,1650,'Combo Pack',false,false,'{combo,family,wellness}','Combo',3),
('natural-cooking-essentials','Natural Cooking Essentials','combos-value-packs','Cold pressed oil, ghee and spices.','A cooking essentials combo bringing together natural staples for the everyday kitchen.',1590,1790,'Combo Pack',false,false,'{combo,cooking,oil,ghee,spices}','Combo',4),
('tea-wellness-combo','Tea & Wellness Combo','combos-value-packs','Herbal tea with wellness drink mixes.','A combo of herbal tea and traditional drink mixes for calm everyday moments.',760,880,'Combo Pack',false,false,'{combo,tea,wellness,drink}','Combo',5);