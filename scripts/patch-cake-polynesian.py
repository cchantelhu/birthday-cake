#!/usr/bin/env python3
"""Rounder birthday-cake silhouette, sharper bloom, Polynesian accents."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "assets" / "index-CZPyPNxJ.js"
data = path.read_text()

replacements = []

# 1) Denser + slightly smaller sparkles; shorter/wider cake body
replacements.append(
    (
        "const GP=6e3,WP=.06,la=10.2,pp=7.6,ku=",
        "const GP=7200,WP=.048,la=6.4,pp=11.2,ku=",
        1,
    )
)

# 2) Palette: keep warm gold bloom; ice → island teal
replacements.append(
    (
        'ku={primary:"#ffd98a",secondary:"#ffce7a",accent:"#fff7e6",ice:"#9fd8ff",bg:"#070b18"}',
        'ku={primary:"#ffd98a",secondary:"#ffce7a",accent:"#fff4d6",ice:"#4ec4b8",bg:"#070b18"}',
        1,
    )
)

# 3) Clear cylindrical tiers + thin candle (less cone taper, less scatter)
old_tiers = (
    "X=pp*((F+la/2)/la<.30?1.05:(F+la/2)/la<.55?.82:(F+la/2)/la<.78?.62:(F+la/2)/la<.90?.18:.08)*(.88+.12*Math.random())"
)
new_tiers = (
    "X=pp*((F+la/2)/la<.36?1.0:(F+la/2)/la<.64?.78:(F+la/2)/la<.88?.58:(F+la/2)/la<.94?.13:.06)*(.95+.05*Math.random())"
)
replacements.append((old_tiers, new_tiers, 1))

# 4) Props follow the same round tiers
old_props = (
    "A=pp*((M+la/2)/la<.30?1.0:(M+la/2)/la<.55?.78:(M+la/2)/la<.78?.58:.14)*(.5+Math.random()*.3)"
)
new_props = (
    "A=pp*((M+la/2)/la<.36?0.96:(M+la/2)/la<.64?.74:(M+la/2)/la<.88?.55:.11)*(.55+Math.random()*.22)"
)
replacements.append((old_props, new_props, 2))

# 5) Soften Christmas star particles → rounded plumeria-ish sparkle
replacements.append(
    (
        "qP=()=>{const r=new rf,e=.62,t=.26;for(let s=0;s<10;s++){const l=s%2===0?e:t,f=s/10*Math.PI*2-Math.PI/2,h=Math.cos(f)*l,m=Math.sin(f)*l;s===0?r.moveTo(h,m):r.lineTo(h,m)}r.closePath();",
        "qP=()=>{const r=new rf,e=.56,t=.4;for(let s=0;s<10;s++){const l=s%2===0?e:t,f=s/10*Math.PI*2-Math.PI/2,h=Math.cos(f)*l,m=Math.sin(f)*l;s===0?r.moveTo(h,m):r.lineTo(h,m)}r.closePath();",
        1,
    )
)

# 6) Sharper post bloom (less foggy tree wash); keep gold glow
replacements.append(
    (
        "luminanceThreshold:.3,mipmapBlur:!0,intensity:.85,radius:.65",
        "luminanceThreshold:.42,mipmapBlur:!0,intensity:.48,radius:.38",
        1,
    )
)

# 7) Intro Pg silhouette — round cake rings (not cone tip)
replacements.append(
    (
        "function Pg(r){const t=cl(r);return t<.36?190:t<.64?150:t<.88?112:22}",
        "function Pg(r){const t=cl(r);return t<.38?210:t<.66?168:t<.90?128:20}",
        1,
    )
)

# 8) Prop colors: hibiscus / teal instead of forest-green Christmas
replacements.append(
    (
        'boxColor1:"#b23a48",boxColor2:"#2e6b4f",bellColor:"#f2c14e"',
        'boxColor1:"#d6456a",boxColor2:"#2fa39a",bellColor:"#fff0d2"',
        1,
    )
)

# 9) Plate rim → teal tapa band + outer gold band (gold bloom gestures untouched)
replacements.append(
    (
        're.jsx("ringGeometry",{args:[pp*.4,pp*1.9,64]}),re.jsx("meshBasicMaterial",{color:"#ffce7a",transparent:!0,opacity:.35,side:ua,blending:ip,depthWrite:!1})]})',
        're.jsx("ringGeometry",{args:[pp*1.28,pp*1.52,72]}),re.jsx("meshBasicMaterial",{color:"#2fa39a",transparent:!0,opacity:.28,side:ua,blending:ip,depthWrite:!1})]}),re.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.035,0],children:[re.jsx("ringGeometry",{args:[pp*1.52,pp*1.68,72]}),re.jsx("meshBasicMaterial",{color:"#ffd98a",transparent:!0,opacity:.4,side:ua,blending:ip,depthWrite:!1})]})',
        1,
    )
)

# 10) Wider warmer island-gold plate
replacements.append(
    (
        're.jsx("cylinderGeometry",{args:[2.35,2.55,.55,28]}),re.jsx("meshStandardMaterial",{color:"#f0d9a8",roughness:.65,metalness:.08,emissive:"#ffd9a0",emissiveIntensity:.08})',
        're.jsx("cylinderGeometry",{args:[3.15,3.4,.4,48]}),re.jsx("meshStandardMaterial",{color:"#e8c98a",roughness:.52,metalness:.14,emissive:"#c9a05a",emissiveIntensity:.16})',
        1,
    )
)

# 11) Punchier gold sparkle emissive (reads denser / less washed-out)
replacements.append(
    (
        "emissiveIntensity:1.3,color:s,transparent:!0,opacity:.9",
        "emissiveIntensity:1.85,color:s,transparent:!0,opacity:.96",
        1,
    )
)

# 12) Fill tier disks (not hollow shells) so cake reads solid, not ring-like
replacements.append(
    (
        "te=Math.random()*Math.PI*2;M[z*3]=Math.cos(te)*X,M[z*3+1]=F,M[z*3+2]=Math.sin(te)*X",
        "te=Math.random()*Math.PI*2;const rFill=X*Math.pow(Math.random(),.35);M[z*3]=Math.cos(te)*rFill,M[z*3+1]=F,M[z*3+2]=Math.sin(te)*rFill",
        1,
    )
)

for old, new, expected in replacements:
    count = data.count(old)
    if count != expected:
        raise SystemExit(f"Expected {expected}, found {count} for: {old[:120]!r}")
    data = data.replace(old, new)
    print(f"ok x{expected}: {old[:70]}...")

assert "la=6.4,pp=11.2" in data
assert 'ice:"#4ec4b8"' in data
assert "intensity:.48,radius:.38" in data
assert 'boxColor2:"#2fa39a"' in data
assert "luminanceThreshold:.42" in data
assert "la=10.2" not in data
assert "WP=.048" in data

path.write_text(data)
print("wrote", path, path.stat().st_size)
