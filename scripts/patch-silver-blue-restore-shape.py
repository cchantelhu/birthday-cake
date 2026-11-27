#!/usr/bin/env python3
"""Restore pre-PR cake silhouette; switch lights to cool silver/blue; note stays removed."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "assets" / "index-CZPyPNxJ.js"
data = path.read_text()

replacements = []

# --- SHAPE: restore main proportions / tiers / plate / particle placement ---

replacements.append(
    (
        "const GP=7200,WP=.048,la=6.4,pp=11.2,ku=",
        "const GP=6e3,WP=.06,la=10.2,pp=7.6,ku=",
        1,
    )
)

replacements.append(
    (
        "X=pp*((F+la/2)/la<.36?1.0:(F+la/2)/la<.64?.78:(F+la/2)/la<.88?.58:(F+la/2)/la<.94?.13:.06)*(.95+.05*Math.random())",
        "X=pp*((F+la/2)/la<.30?1.05:(F+la/2)/la<.55?.82:(F+la/2)/la<.78?.62:(F+la/2)/la<.90?.18:.08)*(.88+.12*Math.random())",
        1,
    )
)

replacements.append(
    (
        "A=pp*((M+la/2)/la<.36?0.96:(M+la/2)/la<.64?.74:(M+la/2)/la<.88?.55:.11)*(.55+Math.random()*.22)",
        "A=pp*((M+la/2)/la<.30?1.0:(M+la/2)/la<.55?.78:(M+la/2)/la<.78?.58:.14)*(.5+Math.random()*.3)",
        2,
    )
)

replacements.append(
    (
        "qP=()=>{const r=new rf,e=.56,t=.4;for(let s=0;s<10;s++){const l=s%2===0?e:t,f=s/10*Math.PI*2-Math.PI/2,h=Math.cos(f)*l,m=Math.sin(f)*l;s===0?r.moveTo(h,m):r.lineTo(h,m)}r.closePath();",
        "qP=()=>{const r=new rf,e=.62,t=.26;for(let s=0;s<10;s++){const l=s%2===0?e:t,f=s/10*Math.PI*2-Math.PI/2,h=Math.cos(f)*l,m=Math.sin(f)*l;s===0?r.moveTo(h,m):r.lineTo(h,m)}r.closePath();",
        1,
    )
)

replacements.append(
    (
        "function Pg(r){const t=cl(r);return t<.38?210:t<.66?168:t<.90?128:20}",
        "function Pg(r){const t=cl(r);return t<.36?190:t<.64?150:t<.88?112:22}",
        1,
    )
)

# Undo disk-fill → surface shell like before
replacements.append(
    (
        "te=Math.random()*Math.PI*2;const rFill=X*Math.pow(Math.random(),.35);M[z*3]=Math.cos(te)*rFill,M[z*3+1]=F,M[z*3+2]=Math.sin(te)*rFill",
        "te=Math.random()*Math.PI*2;M[z*3]=Math.cos(te)*X,M[z*3+1]=F,M[z*3+2]=Math.sin(te)*X",
        1,
    )
)

# Restore single plate ring + original plate size (colors set to silver/blue below)
replacements.append(
    (
        're.jsxs("mesh",{ref:r,rotation:[-Math.PI/2,0,0],position:[0,.02,0],children:[re.jsx("ringGeometry",{args:[pp*1.28,pp*1.52,72]}),re.jsx("meshBasicMaterial",{color:"#2fa39a",transparent:!0,opacity:.28,side:ua,blending:ip,depthWrite:!1})]}),re.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.035,0],children:[re.jsx("ringGeometry",{args:[pp*1.52,pp*1.68,72]}),re.jsx("meshBasicMaterial",{color:"#ffd98a",transparent:!0,opacity:.4,side:ua,blending:ip,depthWrite:!1})]})',
        're.jsxs("mesh",{ref:r,rotation:[-Math.PI/2,0,0],position:[0,.02,0],children:[re.jsx("ringGeometry",{args:[pp*.4,pp*1.9,64]}),re.jsx("meshBasicMaterial",{color:"#9eb8e8",transparent:!0,opacity:.35,side:ua,blending:ip,depthWrite:!1})]})',
        1,
    )
)

replacements.append(
    (
        're.jsx("cylinderGeometry",{args:[3.15,3.4,.4,48]}),re.jsx("meshStandardMaterial",{color:"#e8c98a",roughness:.52,metalness:.14,emissive:"#c9a05a",emissiveIntensity:.16})',
        're.jsx("cylinderGeometry",{args:[2.35,2.55,.55,28]}),re.jsx("meshStandardMaterial",{color:"#d5deed",roughness:.65,metalness:.18,emissive:"#8aa6d4",emissiveIntensity:.12})',
        1,
    )
)

# Restore prior bloom strength (preferred earlier look); cool tint comes from particle colors
replacements.append(
    (
        "luminanceThreshold:.42,mipmapBlur:!0,intensity:.48,radius:.38",
        "luminanceThreshold:.3,mipmapBlur:!0,intensity:.85,radius:.65",
        1,
    )
)

replacements.append(
    (
        "emissiveIntensity:1.85,color:s,transparent:!0,opacity:.96",
        "emissiveIntensity:1.3,color:s,transparent:!0,opacity:.9",
        1,
    )
)

# --- COLORS: cool silver + blue lights ---

replacements.append(
    (
        'ku={primary:"#ffd98a",secondary:"#ffce7a",accent:"#fff4d6",ice:"#4ec4b8",bg:"#070b18"}',
        'ku={primary:"#d5e4f7",secondary:"#9eb8e8",accent:"#f2f7ff",ice:"#6eb0ff",bg:"#070b18"}',
        1,
    )
)

replacements.append(
    (
        'boxColor1:"#d6456a",boxColor2:"#2fa39a",bellColor:"#fff0d2"',
        'boxColor1:"#5b7db3",boxColor2:"#8aa6d4",bellColor:"#e8eef8"',
        1,
    )
)

# Point light over cake + candle accents → cool silver/blue
replacements.append(('color:"#ffb84d"', 'color:"#b8d0f5"', 1))
replacements.append(
    (
        'meshStandardMaterial",{color:"#f4e4c4",emissive:"#ffd9a0",emissiveIntensity:.2,roughness:.55,metalness:.05}',
        'meshStandardMaterial",{color:"#e4ecf7",emissive:"#9eb8e8",emissiveIntensity:.25,roughness:.55,metalness:.12}',
        1,
    )
)
replacements.append(
    (
        'meshStandardMaterial",{color:"#ff9d6b",emissive:"#ff7a2e",emissiveIntensity:2.4,toneMapped:!1}',
        'meshStandardMaterial",{color:"#c5daf8",emissive:"#6eb0ff",emissiveIntensity:2.4,toneMapped:!1}',
        1,
    )
)
replacements.append(
    (
        'meshStandardMaterial",{color:"#fff4dd",emissive:"#ffd86b",emissiveIntensity:3,toneMapped:!1,transparent:!0,opacity:.92}',
        'meshStandardMaterial",{color:"#f2f7ff",emissive:"#d5e4f7",emissiveIntensity:3,toneMapped:!1,transparent:!0,opacity:.92}',
        1,
    )
)

# Intro / enter-gate warm gold washes → cool silver/blue
replacements.append(('[[0,"#4a3a1ecf"],[.39,"#33270fa9"],[.71,"#2218', '[[0,"#1e2a4acf"],[.39,"#152038a9"],[.71,"#0e', 0))  # optional fragile

# Gesture ring + misc gold UI accents tied to ku.primary still follow ku after palette swap.
# Hardcoded gold HUD borders / text → silver-blue
replacements.append(("rgba(255,217,138,", "rgba(158,184,232,", -1))  # all
replacements.append(
    (
        "from-amber-200 via-yellow-300 to-red-300",
        "from-slate-100 via-sky-200 to-blue-300",
        1,
    )
)

# XP gift tag colors that were gold
replacements.append(
    (
        'Kc("BIRTHDAY 01","#141a30","#ffd98a"),Kc("BIRTHDAY 02","#12182a","#ffd86b")',
        'Kc("BIRTHDAY 01","#141a30","#d5e4f7"),Kc("BIRTHDAY 02","#12182a","#9eb8e8")',
        1,
    )
)

# Remaining scene gold soft glows near cake base
replacements.append(('color:"#ffd9a0"', 'color:"#b8d0f5"', -1))
replacements.append(('color:"#fff4e0"', 'color:"#e8eef8"', -1))
replacements.append(('color:"#ff9d6b"', 'color:"#8aa6d4"', -1))

for old, new, expected in replacements:
    if expected == 0:
        if old in data and old != new:
            data = data.replace(old, new)
            print(f"optional ok: {old[:70]}...")
        else:
            print(f"optional skip: {old[:70]}...")
        continue
    if expected < 0:
        count = data.count(old)
        if count == 0:
            raise SystemExit(f"Expected some, found 0 for: {old[:120]!r}")
        data = data.replace(old, new)
        print(f"ok x{count} (all): {old[:70]}...")
        continue
    count = data.count(old)
    if count != expected:
        raise SystemExit(f"Expected {expected}, found {count} for: {old[:140]!r}")
    data = data.replace(old, new)
    print(f"ok x{expected}: {old[:70]}...")

# sanity — shape restored
assert "la=10.2,pp=7.6" in data
assert "la=6.4" not in data
assert "rFill" not in data
assert 'primary:"#d5e4f7"' in data
assert 'secondary:"#9eb8e8"' in data
assert "rgba(255,217,138," not in data

path.write_text(data)
print("wrote", path, path.stat().st_size)
