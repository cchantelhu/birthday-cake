#!/usr/bin/env python3
"""Make centerpiece read as cake; strip countdown; warm HUD copy."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "assets" / "index-CZPyPNxJ.js"
data = path.read_text()

replacements = []

# 1) Shorter/wider cake proportions (was tree-tall la=15,pp=6)
replacements.append(
    (
        ",la=15,pp=6,ku=",
        ",la=7.4,pp=9.2,ku=",
        1,
    )
)

# 2) Clearer frosting tiers + thin candle column
replacements.append(
    (
        "X=pp*((F+la/2)/la<.28?1.18:(F+la/2)/la<.55?.95:(F+la/2)/la<.78?.72:(F+la/2)/la<.9?.2:.09)*(.84+.16*Math.random())",
        "X=pp*((F+la/2)/la<.34?1.0:(F+la/2)/la<.62?.76:(F+la/2)/la<.86?.55:(F+la/2)/la<.93?.14:.07)*(.9+.1*Math.random())",
        1,
    )
)

# 3) Props follow cake tiers (already patched once; refresh multipliers for new shape)
replacements.append(
    (
        "A=pp*((M+la/2)/la<.28?1.08:(M+la/2)/la<.55?.88:(M+la/2)/la<.78?.66:.16)*(.55+Math.random()*.35)",
        "A=pp*((M+la/2)/la<.34?0.96:(M+la/2)/la<.62?.72:(M+la/2)/la<.86?.52:.12)*(.5+Math.random()*.28)",
        2,
    )
)

# 4) Garland spiral → cake-tier ribbon (not tree swirl radius)
replacements.append(
    (
        "N=pp*((A+la/2)/la<.28?1.12:(A+la/2)/la<.55?.9:(A+la/2)/la<.78?.68:.18)+.12",
        "N=pp*((A+la/2)/la<.34?0.98:(A+la/2)/la<.62?.74:(A+la/2)/la<.86?.54:.12)+.1",
        1,
    )
)

# 5) Fewer ornament cubes/baubles (less Christmas clutter)
replacements.append(
    (
        "boxCount:Gb?80:220,bellCount:Gb?80:220",
        "boxCount:Gb?28:70,bellCount:Gb?24:60",
        1,
    )
)

# 6) Kill tree spiral particle ribbon (count 0)
replacements.append(
    (
        "re.jsx(JP,{audioData:e})",
        "re.jsx(JP,{audioData:e,count:0})",
        1,
    )
)

# 7) Remove countdown / timer strip
countdown = (
    're.jsxs("div",{className:"flex items-center gap-2 mt-4",children:[re.jsx(Ez,{size:13,style:{color:z}}),'
    're.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-semibold",children:['
    're.jsxs("span",{className:"px-2 py-1 rounded-md border backdrop-blur-md",style:{borderColor:"rgba(255,217,138,0.3)",background:"rgba(255,217,138,0.08)",color:z},children:[B.days," days"]}),'
    're.jsxs("span",{className:"px-2 py-1 rounded-md border backdrop-blur-md",style:{borderColor:"rgba(255,217,138,0.3)",background:"rgba(255,217,138,0.08)",color:z},children:[String(B.hours).padStart(2,"0")," hrs"]}),'
    're.jsxs("span",{className:"px-2 py-1 rounded-md border backdrop-blur-md",style:{borderColor:"rgba(255,217,138,0.3)",background:"rgba(255,217,138,0.08)",color:z},children:[String(B.minutes).padStart(2,"0")," min"]}),'
    're.jsxs("span",{className:"px-2 py-1 rounded-md border backdrop-blur-md",style:{borderColor:"rgba(255,217,138,0.3)",background:"rgba(255,217,138,0.08)",color:z},children:[String(B.seconds).padStart(2,"0")," sec"]})'
    "]})]})]}"
)
# Keep a harmless null sibling so surrounding commas stay valid
replacements.append((countdown, "null", 1))

# 8) Warm HUD copy (placeholders; wish-layer overwrites with gift-config)
replacements.append(
    (
        'children:"TODAY\\\'S THE DAY"',
        'children:"For you"',
        1,
    )
)
replacements.append(
    (
        'children:"Happy Birthday"',
        'children:"Happy birthday"',
        1,
    )
)
replacements.append(
    (
        'children:"Radiant Birthday Cake · Make a wish"',
        'children:"I made this little cake for you."',
        1,
    )
)
replacements.append(
    (
        ':"Click anywhere · Enter the Radiant Birthday Cake"',
        ':"Click anywhere · come see your cake"',
        1,
    )
)

# 9) Intro Pg silhouette — flatter cake rings (not a cone tip)
replacements.append(
    (
        "function Pg(r){const t=cl(r);return t<.34?168:t<.62?128:t<.86?92:18}",
        "function Pg(r){const t=cl(r);return t<.36?190:t<.64?150:t<.88?112:22}",
        1,
    )
)

for old, new, expected in replacements:
    count = data.count(old)
    if count != expected:
        raise SystemExit(f"Expected {expected}, found {count} for: {old[:100]!r}")
    data = data.replace(old, new)
    print(f"ok x{expected}: {old[:70]}...")

# sanity
assert "days\"]" not in data or data.count('B.days," days"') == 0
assert "Radiant Birthday Cake" not in data
assert "TODAY'S THE DAY" not in data
assert 'la=7.4,pp=9.2' in data

path.write_text(data)
print("wrote", path.stat().st_size)
