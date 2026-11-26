#!/usr/bin/env python3
"""Warm gold lights (clearer bloom) + pinch/gift copy (photos demoted)."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "assets" / "index-CZPyPNxJ.js"
data = path.read_text()

replacements = []

# Palette → warm gold (keep ice as soft sky, not pink)
replacements.append(
    (
        'ku={primary:"#d5e4f7",secondary:"#9eb8e8",accent:"#f2f7ff",ice:"#6eb0ff",bg:"#070b18"}',
        'ku={primary:"#ffd98a",secondary:"#ffce7a",accent:"#fff7e6",ice:"#ffe6b0",bg:"#070b18"}',
        1,
    )
)

# HUD accent borders back to gold
replacements.append(("rgba(158,184,232,", "rgba(255,217,138,", -1))

# Sparkle icon + title color
replacements.append(('z="#d5e4f7"', 'z="#ffe1a8"', 1))
replacements.append(
    (
        'style:{color:"#d5e4f7",textShadow:"0 2px 18px rgba(110,176,255,0.45)"},children:"Happy birthday"',
        'style:{color:"#ffd98a",textShadow:"0 2px 18px rgba(255,205,110,0.4)"},children:"Happy birthday"',
        1,
    )
)

# Candle / plate / point light → warm gold
replacements.append(('color:"#b8d0f5"', 'color:"#ffb84d"', -1))
replacements.append(
    (
        'meshStandardMaterial",{color:"#e4ecf7",emissive:"#9eb8e8",emissiveIntensity:.25,roughness:.55,metalness:.12}',
        'meshStandardMaterial",{color:"#f4e4c4",emissive:"#ffd9a0",emissiveIntensity:.22,roughness:.55,metalness:.05}',
        1,
    )
)
replacements.append(
    (
        'meshStandardMaterial",{color:"#c5daf8",emissive:"#6eb0ff",emissiveIntensity:2.4,toneMapped:!1}',
        'meshStandardMaterial",{color:"#ff9d6b",emissive:"#ff7a2e",emissiveIntensity:2.2,toneMapped:!1}',
        1,
    )
)
replacements.append(
    (
        'meshStandardMaterial",{color:"#f2f7ff",emissive:"#d5e4f7",emissiveIntensity:3,toneMapped:!1,transparent:!0,opacity:.92}',
        'meshStandardMaterial",{color:"#fff4dd",emissive:"#ffd86b",emissiveIntensity:2.6,toneMapped:!1,transparent:!0,opacity:.9}',
        1,
    )
)
replacements.append(
    (
        'meshBasicMaterial",{color:"#9eb8e8",transparent:!0,opacity:.35,side:ua,blending:ip,depthWrite:!1}',
        'meshBasicMaterial",{color:"#ffce7a",transparent:!0,opacity:.32,side:ua,blending:ip,depthWrite:!1}',
        1,
    )
)
replacements.append(
    (
        'meshStandardMaterial",{color:"#d5deed",roughness:.65,metalness:.18,emissive:"#8aa6d4",emissiveIntensity:.12}',
        'meshStandardMaterial",{color:"#f0d9a8",roughness:.65,metalness:.08,emissive:"#ffd9a0",emissiveIntensity:.1}',
        1,
    )
)

# Props back to warm gift colors (not silver)
replacements.append(
    (
        'boxColor1:"#5b7db3",boxColor2:"#8aa6d4",bellColor:"#e8eef8"',
        'boxColor1:"#c45c3e",boxColor2:"#e8b86d",bellColor:"#fff0d2"',
        1,
    )
)

# Clearer bloom: bright but less foggy blur (higher threshold, milder intensity/radius)
replacements.append(
    (
        "luminanceThreshold:.3,mipmapBlur:!0,intensity:.85,radius:.65",
        "luminanceThreshold:.48,mipmapBlur:!0,intensity:.52,radius:.36",
        1,
    )
)

# Pinch / gallery copy → gift wishes
replacements.append(
    (
        'children:"Cake Photos"',
        'children:"Birthday wishes"',
        -1,
    )
)
replacements.append(
    (
        'children:"Each pinch: next photo"',
        'children:"Each pinch: open a gift"',
        1,
    )
)
replacements.append(
    (
        'children:"Open palm: birthday cake lights up"',
        'children:"Open palm: lights bloom"',
        1,
    )
)
replacements.append(
    (
        'children:"Closed fist: particles return to the cake"',
        'children:"Closed fist: gather the cake"',
        1,
    )
)

# Gesture ring colors warm gold
replacements.append(
    (
        'color:t.gesture===Zn.PINCH?"#6eb0ff":"#d5e4f7"',
        'color:t.gesture===Zn.PINCH?"#ff9d6b":"#ffd98a"',
        1,
    )
)

# Birthday tag textures gold again
replacements.append(
    (
        'Kc("BIRTHDAY 01","#141a30","#d5e4f7"),Kc("BIRTHDAY 02","#12182a","#9eb8e8")',
        'Kc("BIRTHDAY 01","#141a30","#ffd98a"),Kc("BIRTHDAY 02","#12182a","#ffd86b")',
        1,
    )
)
replacements.append(
    (
        'Kc("BIRTHDAY 05","#141a30","#d5e4f7"),Kc("BIRTHDAY 06","#12182a","#9eb8e8")',
        'Kc("BIRTHDAY 05","#141a30","#ffd98a"),Kc("BIRTHDAY 06","#12182a","#ffd86b")',
        1,
    )
)

# Spiral leftover colors
replacements.append(
    (
        'v=new wt("#d5e4f7"),_=new wt("#6eb0ff"),S=new wt("#9eb8e8")',
        'v=new wt("#ffd98a"),_=new wt("#ff9d6b"),S=new wt("#fff7e6")',
        1,
    )
)

# Soften remaining cool hex used as soft glows
replacements.append(('color:"#e8eef8"', 'color:"#fff4e0"', -1))
replacements.append(('color:"#8aa6d4"', 'color:"#ff9d6b"', -1))

# Disable in-engine photo advance on pinch (S.length gate → always empty selection)
# The pinch photo cycle: if(r.gesture===Zn.PINCH&&h.current===-1&&S.length)
replacements.append(
    (
        "if(r.gesture===Zn.PINCH&&h.current===-1&&S.length){",
        "if(r.gesture===Zn.PINCH&&h.current===-1&&S.length&&!1){",
        1,
    )
)

for old, new, expected in replacements:
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

assert 'primary:"#ffd98a"' in data
assert "intensity:.52,radius:.36" in data
assert "Each pinch: open a gift" in data
assert "Birthday wishes" in data
assert 'primary:"#d5e4f7"' not in data

path.write_text(data)
print("wrote", path, path.stat().st_size)
