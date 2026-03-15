-- ============================================================
-- MakerHelp Settings Database Seed
-- v1.0 — compiled from official manufacturer documentation
-- and verified community sources:
--   • Rabbit Laser USA official PDF (CMU archive)
--   • xTool D1 10W official materials PDF (Scribd)
--   • xTool D1 Pro 20W official documentation
--   • OMTech official blog
--   • Boss Laser settings guide
--   • Thunder Laser USA
--   • Glowforge community + hackerfactor.com
--   • LightBurn Software Forum
--   • AP Lazer official blog
--   • hobbylasercutters.com comparison tests
--   • lahobbyguy.com community
--
-- Speed unit: mm/s throughout
-- Power unit: percentage 0–100
-- interval_mm = 25.4 / LPI
-- Glowforge speeds converted from proprietary 1–1000 scale
--   (Basic max engrave ≈ 335 mm/s at speed 1000)
-- ============================================================

-- First, update machines table wattage column to integer if needed
-- (previous migration used text, seed uses integer)
ALTER TABLE machines ALTER COLUMN wattage TYPE text;

-- ────────────────────────────────────────────────────────────
-- MACHINES
-- ────────────────────────────────────────────────────────────
INSERT INTO machines (brand, model, type, wattage) VALUES
  ('xTool',           'D1 Pro 10W',              'diode', '10'),
  ('xTool',           'D1 Pro 20W',              'diode', '20'),
  ('xTool',           'P2S 55W',                 'co2',   '55'),
  ('xTool',           'S1 40W',                  'diode', '40'),
  ('xTool',           'F1 Fiber 20W',            'fiber', '20'),
  ('Glowforge',       'Basic',                   'co2',   '40'),
  ('Glowforge',       'Pro',                     'co2',   '45'),
  ('Glowforge',       'Aura',                    'diode', '6'),
  ('OMTech',          'Maker 60W',               'co2',   '60'),
  ('OMTech',          'Maker 80W',               'co2',   '80'),
  ('OMTech',          'Maker 100W',              'co2',  '100'),
  ('Sculpfun',        'S30 Pro 10W',             'diode', '10'),
  ('Sculpfun',        'S30 Pro Max 20W',         'diode', '20'),
  ('Sculpfun',        'S30 Ultra 22W',           'diode', '22'),
  ('Sculpfun',        'S9',                      'diode', '5'),
  ('Atomstack',       'X20 Pro 20W',             'diode', '20'),
  ('Atomstack',       'A5 Pro 5.5W',             'diode', '6'),
  ('Atomstack',       'S20 Pro 20W',             'diode', '20'),
  ('Ortur',           'Laser Master 3 20W',      'diode', '20'),
  ('Ortur',           'Laser Master 3 10W',      'diode', '10'),
  ('Rabbit Laser USA','RL-80-1630 80W',          'co2',   '80'),
  ('Rabbit Laser USA','RL-60-1630 60W',          'co2',   '60'),
  ('Rabbit Laser USA','RL-40-1630 40W',          'co2',   '40'),
  ('Boss Laser',      'LS-1416 65W',             'co2',   '65'),
  ('Boss Laser',      'LS-1630 100W',            'co2',  '100'),
  ('Boss Laser',      'HP-2440 150W',            'co2',  '150'),
  ('Thunder Laser',   'Nova 51 60W',             'co2',   '60'),
  ('Thunder Laser',   'Nova 51 100W',            'co2',  '100'),
  ('Thunder Laser',   'Nova 63 130W',            'co2',  '130'),
  ('Creality',        'Falcon2 Pro 40W',         'diode', '40'),
  ('Creality',        'Falcon2 Pro 22W',         'diode', '22'),
  ('AP Lazer',        'ST6X 100W',               'co2',  '100'),
  ('AP Lazer',        'ST9X 150W',               'co2',  '150'),
  ('Laguna Tools',    'SmartShop Laser 120W',    'co2',  '120'),
  ('EN Laser',        'ENL-W80 80W',             'co2',   '80'),
  ('EN Laser',        'ENL-W100 100W',           'co2',  '100'),
  ('Stealth Laser',   'SL-1060 80W',             'co2',   '80'),
  ('Stealth Laser',   'SL-1390 130W',            'co2',  '130'),
  ('OneLaser',        'Pro CO2 60W',             'co2',   '60'),
  ('OneLaser',        'Pro CO2 80W',             'co2',   '80'),
  ('Two Trees',       'TTS-55 5W',               'diode', '5'),
  ('Two Trees',       'Totem S 10W',             'diode', '10'),
  ('Two Trees',       'TTS-20 Pro 20W',          'diode', '20')
ON CONFLICT (brand, model) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- MATERIALS
-- ────────────────────────────────────────────────────────────
INSERT INTO materials (name, category) VALUES
  ('3mm Basswood',               'wood'),
  ('6mm Basswood',               'wood'),
  ('9mm Basswood',               'wood'),
  ('3mm Baltic Birch Plywood',   'wood'),
  ('6mm Baltic Birch Plywood',   'wood'),
  ('3mm MDF',                    'wood'),
  ('6mm MDF',                    'wood'),
  ('3mm Cherry Wood',            'wood'),
  ('3mm Walnut',                 'wood'),
  ('3mm Pine',                   'wood'),
  ('3mm Bamboo',                 'wood'),
  ('3mm Poplar Plywood',         'wood'),
  ('4mm Poplar Plywood',         'wood'),
  ('1.5mm Cast Acrylic',         'acrylic'),
  ('3mm Cast Acrylic',           'acrylic'),
  ('6mm Cast Acrylic',           'acrylic'),
  ('3mm Extruded Acrylic',       'acrylic'),
  ('6mm Extruded Acrylic',       'acrylic'),
  ('2mm Black Acrylic',          'acrylic'),
  ('3mm Black Acrylic',          'acrylic'),
  ('3mm Mirrored Acrylic',       'acrylic'),
  ('3mm Fluorescent Acrylic',    'acrylic'),
  ('Vegetable Tan Leather 1.5mm','leather'),
  ('Vegetable Tan Leather 3mm',  'leather'),
  ('Chrome Tan Leather 2mm',     'leather'),
  ('PU Leatherette 1mm',         'leather'),
  ('JDS Laser Leather 1mm',      'leather'),
  ('Anodized Aluminum',          'metal'),
  ('Powder Coated Metal',        'metal'),
  ('Stainless Steel (CerMark)',  'metal'),
  ('Anodized Titanium',          'metal'),
  ('Slate Tile',                 'stone'),
  ('Granite',                    'stone'),
  ('Float Glass',                'glass'),
  ('Ceramic Tile',               'glass'),
  ('Cardstock 300gsm',           'other'),
  ('Corrugated Cardboard',       'other'),
  ('Cork 3mm',                   'other'),
  ('Felt',                       'fabric'),
  ('Cotton Fabric',              'fabric'),
  ('Rubber Stamp Material 6mm',  'other'),
  ('Foam EVA 6mm',               'other')
ON CONFLICT (name) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- SETTINGS
-- ────────────────────────────────────────────────────────────
INSERT INTO settings (
  machine_id, material_id, thickness_mm, operation,
  power_pct, speed_mmsec, passes,
  lpi, interval_mm,
  air_assist, focus_notes, result_notes,
  source_type, source_url, approved
) VALUES
-- xTool D1 Pro 10W
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,5,1,NULL,NULL,true,'Fixed focus. Elevate on honeycomb for air assist clearance.','Clean 1-pass cut with air assist. Slight edge char — masking tape reduces this.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',60,80,1,254,0.10,false,'Fixed focus.','Good contrast vector engrave. Raise power to 70% for darker results.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',100,3,3,NULL,NULL,true,'Re-raise laser for each pass to maintain focus.','3 passes needed at 10W. Air assist strongly recommended between passes.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'engrave',60,80,1,254,0.10,false,NULL,'Same engrave settings as 3mm — surface depth is unaffected by board thickness.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',100,3,2,NULL,NULL,true,'Baltic birch has denser glue lines.','2 passes needed. Watch for smoke in glue layers.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',65,80,1,254,0.10,false,NULL,'Slightly higher power than basswood for birch density.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,9,2,NULL,NULL,true,NULL,'2 passes at 9mm/s — clean cut with minimal char. Air assist recommended.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',50,80,1,254,0.10,false,NULL,'Rich dark engrave on veg tan. Drop to 40% for lighter marks.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',100,15,1,NULL,NULL,true,NULL,'Single pass cuts thin veg tan cleanly.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='2mm Black Acrylic'),2,'cut',100,3,1,NULL,NULL,true,NULL,'Dark/opaque acrylic cuts well at 10W. Air assist essential for clean edges.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='2mm Black Acrylic'),2,'engrave',40,80,1,254,0.10,false,NULL,'Good surface engrave on black acrylic — creates white frosted contrast.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',80,100,1,254,0.10,false,'Focus precisely on surface.','Removes anodizing for clean silver-on-black contrast. Diode marks anodized well.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Cardstock 300gsm'),0.3,'cut',60,50,1,NULL,NULL,false,NULL,'Clean cut. Mask if burn marks are an issue.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='3mm Bamboo'),3,'cut',100,5,2,NULL,NULL,true,NULL,'Bamboo is dense — 2 passes at 10W.','verified','https://www.scribd.com/document/582861159/xTool-D1-10W-Materials-parameters-for-reference',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 10W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',85,100,1,300,0.085,false,NULL,'High power for slate marking. Creates white contrast surface.','community','https://forum.lightburnsoftware.com',true),
-- xTool D1 Pro 20W
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,15,1,NULL,NULL,true,NULL,'Single pass clean cut with air assist. 2 passes without air assist.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',80,200,1,254,0.10,false,NULL,'Good contrast. Use 300 LPI at 100mm/s for photo-quality detail.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',100,5,2,NULL,NULL,true,NULL,'2 passes at 100% cuts 6mm cleanly. Air assist required to clear char between passes.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'engrave',80,200,1,254,0.10,false,NULL,'Same engrave settings as 3mm.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='9mm Basswood'),9,'cut',100,2,3,NULL,NULL,true,'Refocus between passes or use Z-step.','3 very slow passes on 9mm. Fire watch required — keep air assist on.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',100,10,1,NULL,NULL,true,NULL,'Glue layers are denser but 20W handles in 1 pass with air assist.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',80,200,1,254,0.10,false,NULL,'Good contrast on birch. Slightly darker than basswood at same settings.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',100,3,3,NULL,NULL,true,NULL,'Dense glue layers require 3 passes. Air assist critical.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Black Acrylic'),3,'cut',100,5,2,NULL,NULL,true,NULL,'Black acrylic most diode-compatible. Clean cut with air assist.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',100,8,2,NULL,NULL,true,'Focus 1-2mm below surface.','Dark/opaque cast acrylic only — diode cannot cut clear acrylic.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,20,1,NULL,NULL,true,NULL,'Clean 1-pass cut. Air assist prevents carbonized residue.','verified','https://salsarumberos.com/xtool-d1-pro-20w-material-settings-pdf/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',45,300,1,300,0.085,false,NULL,'Rich dark engrave. Drop to 35% for lighter marks.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',100,30,1,NULL,NULL,true,NULL,'Single fast pass on thin veg tan.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='PU Leatherette 1mm'),1,'cut',100,40,1,NULL,NULL,true,NULL,'Fast clean cut on thin PU leatherette.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',80,150,1,300,0.085,false,NULL,'Excellent anodized marking. High contrast, single pass.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',80,100,1,300,0.085,false,NULL,'Creates white contrast on slate. 300 DPI optimal — higher DPI overheats surface.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='Cardstock 300gsm'),0.3,'cut',65,60,1,NULL,NULL,false,NULL,'Clean cardstock cut at 20W.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='D1 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Bamboo'),3,'cut',100,10,2,NULL,NULL,true,NULL,'Bamboo is dense — 2 passes. Air assist required.','community','https://forum.lightburnsoftware.com',true),
-- xTool P2S 55W CO2
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',60,35,1,NULL,NULL,true,NULL,'CO2 cuts basswood at 35mm/s — 6x faster than 20W diode. Single pass.','verified','https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',25,400,1,300,0.085,true,NULL,'Excellent contrast at high speed. Air assist clears smoke.','verified','https://hobbylasercutters.com/xtool-p2/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',75,20,1,NULL,NULL,true,NULL,'Single pass on 6mm with 55W CO2. Very clean edge.','verified','https://hobbylasercutters.com/xtool-p2/',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',65,30,1,NULL,NULL,true,NULL,'55W handles birch glue layers in single pass.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',20,400,1,300,0.085,true,NULL,'Clean sharp engrave. Use 254 LPI for photographs.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',80,15,1,NULL,NULL,true,NULL,'CO2 power easily handles 6mm birch in one pass.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',55,30,1,NULL,NULL,true,'Focus 1mm below surface for polished edge.','CO2 cuts all acrylic colors including clear. Flame-polished edge on cast acrylic.','verified','https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'engrave',12,350,1,300,0.085,false,'Focus on surface for engraving.','Frosted white finish on clear cast acrylic. Increase LPI to 391 for fine detail.','verified','https://3dwithus.com/xtool-p2-review-55w-co2-laser-cutter-tests-tips-and-settings',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',70,15,1,NULL,NULL,true,'Low air assist — high pressure blows melt back.','P2S handles 6mm acrylic cleanly. Very low air assist for best edge.','verified','https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',40,30,1,NULL,NULL,true,NULL,'CO2 ideal for leather. Clean cut, minimal char.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',12,300,1,300,0.085,true,NULL,'Excellent leather engrave with CO2. Rich dark contrast.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',80,150,1,391,0.065,true,NULL,'CO2 marks anodized aluminum. High detail at 391 DPI.','verified','https://3dwithus.com/xtool-p2-review-55w-co2-laser-cutter-tests-tips-and-settings',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Float Glass'),NULL,'engrave',15,300,1,300,0.085,false,'Apply wet newspaper or dishwasher detergent to prevent micro-fractures.','CO2 frosts glass well. Low power, moderate speed.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',35,200,1,300,0.085,true,NULL,'CO2 creates excellent white-on-dark contrast on slate.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='xTool' AND model='P2S 55W'),(SELECT id FROM materials WHERE name='Granite'),NULL,'engrave',80,150,1,300,0.085,false,'Defocus laser 2mm above surface for granite.','High power needed. Rub contrast paint into marks for pop.','community','https://forum.lightburnsoftware.com',true),
-- Glowforge Basic 40W CO2
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,50,1,NULL,NULL,true,'Autofocus. Always use Set Focus before printing.','Full power at speed 300 GF units (~50mm/s). Reliable 1-pass cut.','verified','https://hackerfactor.com/glowforge.php',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',40,167,1,270,0.094,true,NULL,'Speed 500 GF units (~167mm/s), power 40. Standard wood engrave, dark crisp result.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',100,17,2,NULL,NULL,true,NULL,'Speed ~100 GF units (~17mm/s). 2 passes for 6mm on 40W Basic.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='1.5mm Cast Acrylic'),1.5,'cut',100,84,1,NULL,NULL,true,NULL,'Speed 250 GF units (~84mm/s). Full power cuts thin acrylic cleanly.','verified','https://houstonacrylic.com/pages/recommended-glowforge-settings',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='1.5mm Cast Acrylic'),1.5,'engrave',100,335,1,270,0.094,true,NULL,'Speed 1000 GF units (~335mm/s), full power, 270 LPI engrave on thin acrylic.','verified','https://houstonacrylic.com/pages/recommended-glowforge-settings',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',100,40,1,NULL,NULL,true,'Focus on surface for engraving; slightly below for best cut polish.','Speed ~120 GF units (~40mm/s). Full power. Cast gives frosted engrave, polished cut.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'engrave',30,167,1,270,0.094,true,NULL,'Speed 500 GF units, power 30. Frosted white finish on clear acrylic.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',100,17,2,NULL,NULL,true,NULL,'Speed ~100 GF units. 2 passes on 6mm cast acrylic for clean cut.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',100,67,1,NULL,NULL,true,'Use Thin Leather proofgrade setting as baseline.','Speed ~200 GF units. Full power cuts thin veg tan in one pass.','verified','https://houstonacrylic.com/pages/recommended-glowforge-settings',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,33,1,NULL,NULL,true,'Thick Leather proofgrade as baseline.','Speed ~100 GF units. Full power. Minimal char on veg tan.','community','https://community.glowforge.com',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='JDS Laser Leather 1mm'),1,'engrave',31,335,1,270,0.094,true,'Autofocus. Set material as Thick Basswood Plywood in GF UI.','Speed 1000 GF units, power 31. Community-verified JDS Leather setting.','community','https://joyfulandsimpledesigns.com/2022/01/20/glowforge-what-settings-do-i-use/',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='PU Leatherette 1mm'),1,'engrave',12,201,1,225,0.113,true,NULL,'Speed 600 GF units, power 12, 225 LPI. Proofgrade Thin Leather setting works for PU leatherette.','verified','https://houstonacrylic.com/pages/recommended-glowforge-settings',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='Cardstock 300gsm'),0.3,'cut',66,168,1,NULL,NULL,false,'Cardstock stays flat without hold-downs in GF.','Speed 500 GF units (~168mm/s), power 66. Clean cut.','community','https://joyfulandsimpledesigns.com/2022/01/20/glowforge-what-settings-do-i-use/',true),
((SELECT id FROM machines WHERE brand='Glowforge' AND model='Basic'),(SELECT id FROM materials WHERE name='Ceramic Tile'),NULL,'engrave',100,50,1,450,0.056,false,'Apply paint/ink to engraved area after for contrast.','High DPI burns away glaze. Apply ink for visible contrast.','community','https://eriecounty-pa.libguides.com/glowforge/settings',true),
-- OMTech Maker 60W CO2
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',55,20,1,NULL,NULL,true,NULL,'Clean cut at moderate settings. Lower power extends tube life.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',18,400,1,300,0.085,true,NULL,'Low power, high speed — excellent contrast, long tube life.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',70,12,1,NULL,NULL,true,NULL,'Clean single-pass cut on 6mm at 60W.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',60,18,1,NULL,NULL,true,NULL,'Slightly higher power for birch glue layers.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',20,400,1,300,0.085,true,NULL,'Standard birch engrave. Mask with transfer tape to reduce sap haze.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',75,10,1,NULL,NULL,true,NULL,'60W handles 6mm birch in 1 pass with air assist.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',60,20,1,NULL,NULL,true,'Low air pressure — high air blows melted acrylic back onto lens.','Clean flame-polished edge. Avoid too-slow speeds — fire risk.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'engrave',12,350,1,300,0.085,false,NULL,'Frosted white engrave. Cast acrylic gives better contrast than extruded.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',70,12,1,NULL,NULL,true,'Low air assist.','6mm acrylic cuts cleanly in 1 pass on 60W CO2.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',12,300,1,300,0.085,true,NULL,'CO2 produces beautiful dark engrave on veg tan. Rich contrast.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',65,12,1,NULL,NULL,true,NULL,'Clean cut with minimal char. Air assist recommended.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',50,20,1,NULL,NULL,true,NULL,'Thin leather — low power prevents burning edges.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',30,325,1,391,0.065,true,NULL,'Removes anodizing for high-contrast silver mark. Power varies by anodize color.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',40,200,1,300,0.085,true,NULL,'White on dark contrast. Increase power for more depth.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Granite'),NULL,'engrave',85,150,1,300,0.085,false,'Place material 2mm above focus (defocused beam) for granite.','High power ablates granite. Apply paint for contrast.','verified','https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Float Glass'),NULL,'engrave',12,350,1,462,0.055,false,'Keep glass cold with wet newspaper or cold air blast.','Minimum power. High LPI (thin scan gap) = cleaner result on glass.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Powder Coated Metal'),NULL,'mark',25,300,1,300,0.085,false,'Do not engrave all the way through — exposed metal rusts/tarnishes.','Removes powder coat for contrasted mark.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 60W'),(SELECT id FROM materials WHERE name='Cardstock 300gsm'),0.3,'cut',20,350,1,NULL,NULL,false,NULL,'Low power, high speed for clean cardstock cut without burning.','community','https://forum.lightburnsoftware.com',true),
-- OMTech Maker 80W CO2
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',45,30,1,NULL,NULL,true,NULL,'Higher wattage = lower % for same result. Stay 40-60% for tube longevity.','verified','https://omtech.com/blogs/knowledge/settings-for-wood-laser',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',14,500,1,300,0.085,true,NULL,'Fast production engrave at low power on 80W.','verified','https://omtech.com/blogs/knowledge/settings-for-wood-laser',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',55,20,1,NULL,NULL,true,NULL,'80W cuts 6mm in 1 clean pass. Keep below 70% for tube longevity.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',50,25,1,NULL,NULL,true,NULL,'80W handles birch easily.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',50,25,1,NULL,NULL,true,'Low air assist on acrylic.','Fast clean cut at lower power. 80W gives more headroom for thick stock.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',60,18,1,NULL,NULL,true,NULL,'80W handles 6mm acrylic cleanly.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',10,350,1,300,0.085,true,NULL,'Very low power needed on 80W for leather.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',55,15,1,NULL,NULL,true,NULL,'Clean cut on 3mm veg tan.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='OMTech' AND model='Maker 80W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',25,400,1,391,0.065,true,NULL,'Slightly lower power than 60W machine for same result.','community','https://forum.lightburnsoftware.com',true),
-- Rabbit Laser USA 80W CO2
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Float Glass'),NULL,'engrave',12,350,1,462,0.055,false,'Keep glass cold with cold air, wet paper, or coating.','Official Rabbit Laser 80W. Use lowest power with thin scan gap.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='3mm Basswood'),NULL,'engrave',14,350,1,300,0.085,false,'Apply masking tape to prevent sap haze.','Official Rabbit Laser 80W wood engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',50,15,1,NULL,NULL,true,'Lowest power with highest speed for clean cut.','Official Rabbit Laser 80W 1/8" basswood cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',52,12,1,NULL,NULL,true,'Lowest power with highest speed.','Official Rabbit Laser 80W 1/8" birch plate.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',70,10,1,NULL,NULL,true,NULL,'Official Rabbit Laser 80W 3/16" birch plywood.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',55,12,1,NULL,NULL,true,'Do not go too slow — surrounding acrylic will sag or catch fire.','Official Rabbit Laser 80W 1/4" acrylic cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),NULL,'engrave',55,300,1,391,0.065,false,'Hard/brittle acrylics engrave better.','Official Rabbit Laser 80W acrylic engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='3mm Mirrored Acrylic'),3,'cut',40,15,2,NULL,NULL,true,'First pass to near backing, second to finish. High air assist.','Excessive heat boils mirror backing. 2 passes required.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Granite'),NULL,'engrave',85,150,1,299,0.085,false,'Defocus target slightly for granite.','Official Rabbit Laser 80W granite. Rub paint into cracks for contrast.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),NULL,'engrave',45,325,1,299,0.085,false,'Set scan gap for your required resolution.','Official Rabbit Laser 80W leather engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',70,12,1,NULL,NULL,true,'Lowest power with highest speed.','Official Rabbit Laser 80W 1/16" leather cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',25,325,1,391,0.065,false,'Power varies by anodize color — black requires lower power.','Official Rabbit Laser 80W anodized aluminum.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-80-1630 80W'),(SELECT id FROM materials WHERE name='Powder Coated Metal'),NULL,'mark',25,325,1,299,0.085,false,'Do not engrave through coating — exposed metal may rust.','Official Rabbit Laser 80W powder coat.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
-- Rabbit Laser USA 60W CO2
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',65,15,1,NULL,NULL,true,NULL,'Official Rabbit Laser 60W 1/8" basswood cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),NULL,'engrave',18,350,1,300,0.085,false,NULL,'Official Rabbit Laser 60W wood engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',68,12,1,NULL,NULL,true,NULL,'Official Rabbit Laser 60W birch plate.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',70,12,1,NULL,NULL,true,'Low air assist to prevent melt blowback.','Official Rabbit Laser 60W 1/4" acrylic cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),NULL,'engrave',50,325,1,299,0.085,false,NULL,'Official Rabbit Laser 60W leather engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',85,10,1,NULL,NULL,true,NULL,'Official Rabbit Laser 60W thin leather cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',30,325,1,391,0.065,false,NULL,'Official Rabbit Laser 60W anodized aluminum.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-60-1630 60W'),(SELECT id FROM materials WHERE name='Granite'),NULL,'engrave',85,120,1,299,0.085,false,'Slight defocus.','Official Rabbit Laser 60W granite.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
-- Rabbit Laser USA 40W CO2
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-40-1630 40W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',80,15,1,NULL,NULL,true,NULL,'Official Rabbit Laser 40W 1/8" basswood. Higher % at lower wattage.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-40-1630 40W'),(SELECT id FROM materials WHERE name='3mm Basswood'),NULL,'engrave',20,350,1,300,0.085,false,NULL,'Official Rabbit Laser 40W wood engrave.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-40-1630 40W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',85,12,1,NULL,NULL,true,NULL,'Official Rabbit Laser 40W 1/4" acrylic. Near full power required.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-40-1630 40W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 1.5mm'),1.5,'cut',85,7,1,NULL,NULL,true,NULL,'Official Rabbit Laser 40W thin leather cut.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
((SELECT id FROM machines WHERE brand='Rabbit Laser USA' AND model='RL-40-1630 40W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',35,325,1,391,0.065,false,NULL,'Official Rabbit Laser 40W anodized aluminum.','verified','https://www.cs.cmu.edu/afs/cs/academic/class/99353-f16/speedsfeeds_RL.pdf',true),
-- Boss Laser LS-1416 65W
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='3mm Basswood'),NULL,'engrave',25,350,1,300,0.085,true,NULL,'Boss 65W basswood engrave. Low power for clean marks.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',60,20,1,NULL,NULL,true,NULL,'Boss 65W 1/8" basswood cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',35,300,1,300,0.085,true,NULL,'Boss 65W birch engrave.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',60,25,1,NULL,NULL,true,NULL,'Boss 65W 1/8" birch cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',80,10,1,NULL,NULL,true,'Low air assist to prevent melt blowback.','Boss 65W 1/4" acrylic cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',30,300,1,300,0.085,true,NULL,'Boss 65W veg tan leather engrave.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',70,15,1,NULL,NULL,true,NULL,'Boss 65W leather cut.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',30,300,1,391,0.065,true,NULL,'Boss 65W anodized aluminum mark.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1416 65W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',50,200,1,300,0.085,false,NULL,'Boss 65W slate engrave.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
-- Boss Laser LS-1630 100W
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),NULL,'engrave',20,450,1,300,0.085,true,NULL,'Boss 100W basswood engrave. Higher wattage = lower %.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',45,30,1,NULL,NULL,true,NULL,'Boss 100W 1/8" basswood cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'engrave',25,400,1,300,0.085,true,NULL,'Boss 100W birch engrave.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',55,25,1,NULL,NULL,true,NULL,'Boss 100W 1/8" birch cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',80,15,1,NULL,NULL,true,NULL,'Boss 100W 1/4" acrylic cut.','community','https://settingsmag.com/boss-laser-settings-chart-guide/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',25,400,1,300,0.085,true,NULL,'Boss 100W leather engrave.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
((SELECT id FROM machines WHERE brand='Boss Laser' AND model='LS-1630 100W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',25,400,1,391,0.065,true,NULL,'Boss 100W anodized aluminum.','community','https://bosslaser.com/resources-support/laser-settings-cut-test-files/',true),
-- Thunder Laser Nova 51 60W
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',55,20,1,NULL,NULL,true,NULL,'Thunder 60W cuts 3mm basswood in single pass. Clean edge.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',20,500,1,300,0.085,true,NULL,'Thunder can engrave up to 1000mm/s. 500mm/s is production-safe.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',70,12,1,NULL,NULL,true,NULL,'60W cuts 6mm in 1 pass on Thunder.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',60,20,1,NULL,NULL,true,'Low air for acrylic — high air blows melt back.','60W CO2 cuts acrylic with flame-polished edge.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'engrave',12,400,1,300,0.085,false,NULL,'Frosted white on clear cast acrylic.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',72,10,1,NULL,NULL,true,NULL,'6mm acrylic single pass on 60W.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',12,300,1,300,0.085,true,NULL,'Thunder 60W leather engrave — low power, moderate speed.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',65,12,1,NULL,NULL,true,NULL,'Clean cut on veg tan.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',30,400,1,391,0.065,true,NULL,'Thunder 60W anodized aluminum.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 60W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',40,200,1,300,0.085,false,NULL,'White on dark slate. Excellent for personalized gifts.','community','https://forum.lightburnsoftware.com',true),
-- Thunder Laser Nova 51 100W
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',40,35,1,NULL,NULL,true,NULL,'100W cuts 3mm basswood fast. Lower % preserves tube life.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',15,600,1,300,0.085,true,NULL,'Production engrave speed on 100W machine.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',50,25,1,NULL,NULL,true,NULL,'100W handles 6mm easily in 1 pass.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='6mm Baltic Birch Plywood'),6,'cut',60,20,1,NULL,NULL,true,NULL,'100W cuts 6mm birch cleanly.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',60,18,1,NULL,NULL,true,NULL,'6mm acrylic on 100W — lower power, good speed.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Thunder Laser' AND model='Nova 51 100W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',25,500,1,391,0.065,true,NULL,'100W anodized aluminum — lower power needed vs. 60W.','community','https://forum.lightburnsoftware.com',true),
-- Sculpfun S30 Pro Max 20W
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,20,1,NULL,NULL,true,'Enable M8 in LightBurn for automatic air assist control.','S30 Pro Max cuts 3mm in 1 pass. Excellent focus retention vs. competitors.','community','https://hobbylasercutters.com/sculpfun-s30-pro-max-vs-atomstack-a20-x20-pro/',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',75,200,1,254,0.10,false,NULL,'Reduce from factory defaults — factory settings typically run too hot.','community','https://lahobbyguy.com/bb/viewtopic.php?t=3971',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',100,8,2,NULL,NULL,true,NULL,'2 passes for 6mm. Air assist clears smoke between passes.','community','https://hobbylasercutters.com/sculpfun-s30-pro-max-vs-atomstack-a20-x20-pro/',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='3mm Baltic Birch Plywood'),3,'cut',100,10,2,NULL,NULL,true,NULL,'2 passes for birch plywood at 20W. Air assist required.','community','https://hobbylasercutters.com/sculpfun-s30-pro-max-vs-atomstack-a20-x20-pro/',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='3mm Black Acrylic'),3,'cut',100,10,3,NULL,NULL,true,'Opaque acrylic only — diode cannot cut clear.','3 passes on dark acrylic at 20W. Air assist keeps edges clean.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,25,1,NULL,NULL,true,NULL,'Single pass on veg tan. Air assist reduces char.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',50,200,1,254,0.10,false,NULL,'Good leather engrave at moderate settings.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',85,100,1,300,0.085,false,NULL,'High power for anodized marking on diode.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Sculpfun' AND model='S30 Pro Max 20W'),(SELECT id FROM materials WHERE name='Slate Tile'),NULL,'engrave',85,100,1,300,0.085,false,NULL,'High power, moderate speed for good slate contrast.','community','https://forum.lightburnsoftware.com',true),
-- Atomstack X20 Pro 20W
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,15,1,NULL,NULL,true,'Built-in air assist — use it.','Cuts 3mm basswood in 1 pass. Comparable to Sculpfun S30 Pro Max.','community','https://hobbylasercutters.com/sculpfun-s30-pro-max-vs-atomstack-a20-x20-pro/',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',80,200,1,254,0.10,false,NULL,'Standard basswood engrave. Good contrast.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',100,6,2,NULL,NULL,true,NULL,'6mm requires 2 passes. Slightly slower than Sculpfun in comparison tests.','community','https://hobbylasercutters.com/sculpfun-s30-pro-max-vs-atomstack-a20-x20-pro/',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='3mm Black Acrylic'),3,'cut',100,8,2,NULL,NULL,true,NULL,'Dark acrylic cuts well with air assist.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,20,1,NULL,NULL,true,NULL,'Single pass on veg tan leather.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',55,200,1,254,0.10,false,NULL,'Leather engrave at 20W. Rich dark marks.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Atomstack' AND model='X20 Pro 20W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',80,100,1,300,0.085,false,NULL,'Good anodized marking at high power.','community','https://forum.lightburnsoftware.com',true),
-- Ortur Laser Master 3 20W
((SELECT id FROM machines WHERE brand='Ortur' AND model='Laser Master 3 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',100,15,1,NULL,NULL,true,NULL,'OLM3 20W cuts 3mm in 1 pass. Air assist critical.','community','https://forum.lightburnsoftware.com/t/material-test-generator-setting-for-ortur-lm3-20w/106304',true),
((SELECT id FROM machines WHERE brand='Ortur' AND model='Laser Master 3 20W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',100,250,1,254,0.10,false,'Official Ortur recommendation: 15000mm/min (250mm/s) at 100% power.','Community-verified OLM3 20W basswood engrave.','community','https://forum.lightburnsoftware.com/t/material-test-generator-setting-for-ortur-lm3-20w/106304',true),
((SELECT id FROM machines WHERE brand='Ortur' AND model='Laser Master 3 20W'),(SELECT id FROM materials WHERE name='6mm Basswood'),6,'cut',100,5,2,NULL,NULL,true,NULL,'6mm basswood requires 2 slow passes at 20W.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Ortur' AND model='Laser Master 3 20W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'cut',100,18,1,NULL,NULL,true,NULL,'Single pass on veg tan.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='Ortur' AND model='Laser Master 3 20W'),(SELECT id FROM materials WHERE name='Anodized Aluminum'),NULL,'mark',85,100,1,300,0.085,false,NULL,'High power for anodized on diode.','community','https://forum.lightburnsoftware.com',true),
-- AP Lazer ST6X 100W
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'engrave',15,400,1,300,0.085,false,'AP Lazer recommends 3" lens for acrylic — cleaner edges on thick stock.','Lower power, higher speed. Cast acrylic gives frosted finish.','verified','https://aplazer.com/blog/what-setting-for-clear-acrylic-ideal-for-laser-engraving/',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='3mm Cast Acrylic'),3,'cut',65,20,1,NULL,NULL,true,'High power with moderate speed for polished edge.','AP Lazer 100W cuts 3mm acrylic cleanly.','verified','https://aplazer.com/blog/what-setting-for-clear-acrylic-ideal-for-laser-engraving/',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='6mm Cast Acrylic'),6,'cut',75,15,1,NULL,NULL,true,NULL,'AP Lazer 100W 6mm acrylic single pass.','verified','https://aplazer.com/blog/what-setting-for-clear-acrylic-ideal-for-laser-engraving/',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'cut',40,35,1,NULL,NULL,true,NULL,'AP Lazer 100W cuts 3mm basswood with ease.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='3mm Basswood'),3,'engrave',15,500,1,300,0.085,true,NULL,'Production engrave at 100W. Very fast.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='Vegetable Tan Leather 3mm'),3,'engrave',10,400,1,300,0.085,true,NULL,'Very low power on high-wattage machine for leather.','community','https://forum.lightburnsoftware.com',true),
((SELECT id FROM machines WHERE brand='AP Lazer' AND model='ST6X 100W'),(SELECT id FROM materials WHERE name='Granite'),NULL,'engrave',80,200,1,300,0.085,false,'AP Lazer open architecture allows large granite slabs and headstones.','Open design lets AP Lazer work on objects of any size.','verified','https://aplazer.com/laser-machine-faqs/',true);
