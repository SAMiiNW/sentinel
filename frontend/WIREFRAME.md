# Sentinel - Operations Console Wireframe

## Concept

Not a website. A futuristic moderation OPERATIONS CONSOLE: a permanent left
command rail wired to a field of free-floating "signal panels" that hang at
asymmetric positions across a dark indigo operations field. Panels are connected
by drawn SVG filaments (signal paths) so the whole thing reads as one wired
instrument, not a stack of sections. No frosted-glass cards: panels are solid
deep-indigo plates framed with thin teal hairlines, corner brackets, and small
node markers (a "blueprint console" look). The aurora mesh stays only as an
ambient field far behind everything.

## Spatial map (desktop, single non-scrolling-feeling field that does scroll)

```
+----+-------------------------------------------------------------------+
| R  |                                                                   |
| A  |     .[ MASTHEAD PLATE ]  (top-left, angular clip)                 |
| I  |        Sentinel / "settles under consensus"                       |
| L  |          \                                                        |
|    |           \____filament____                                       |
| s  |                            \                                      |
| i  |    [ SIGNAL CLUSTER ]       \      .[ GATE INTAKE ]   (upper-right)|
| g  |     scattered gauge nodes    \        publish / check             |
| i  |     policies/checks/...       \______/      |                     |
| l  |          |                           \      | filament            |
|    |          | filament                   \     |                     |
| n  |          |                             \    |                     |
| a  |   .[ TELEMETRY TAG ]                     [ REGISTRY FIELD ]        |
| v  |     network/contract/faucet              staggered policy panels  |
|    |     (offset low-left)                    (non-grid, mixed widths) |
| .. |                                              |                    |
| w  |                                              | filament           |
| a  |                                              |                    |
| l  |                          [ TRACE STREAM ]  (lower, wired timeline) |
| l  |                            chronicle filament w/ node beads        |
| e  |                                                                   |
| t  |     .......... large empty void on the left-low quadrant ........ |
+----+-------------------------------------------------------------------+
```

### Left command rail (fixed, vertical, ~76px collapsed / 240px on wide)
- Top: Sentinel sigil (shield glyph) + tiny "DESK" stamp.
- Vertical nav nodes, stacked, each a dot + hairline tick + label:
  OVERVIEW, REGISTRY, TRACE. Active node lights teal, a vertical spine line
  links them (this spine is itself a drawn path, OS scanline feel).
- A vertical "PUBLISH" trigger (rotated or stacked glyph button) mid-rail.
- Bottom dock of the rail: WALLET NODE. Disconnected = "LINK" pad; connected =
  address chip + status LED, click opens an upward popover (full address, copy,
  wrong-network warning, view contract, disconnect). This replaces the old top
  control bar entirely. NO horizontal bar anywhere.

### Floating panels (absolute / asymmetric, each a distinct shape)
1. MASTHEAD PLATE - upper-left, angular clip-path corner, holds brand line,
   the "Moderation that settles under consensus" headline, one line of body,
   and a CHECK shortcut. Largest plate.
2. SIGNAL CLUSTER - a loose constellation of 5 gauge nodes (policies, checks,
   compliant, flagged, blocked + clean-rate). Different sizes, NOT a row, NOT a
   grid: placed at varying x/y offsets like instrument readouts. Each is a
   bracketed mini-node, no card fill.
3. GATE INTAKE - upper-right small console window with the two primary verbs
   (Publish a policy / Check content) and a 3-step "how the gate works" micro
   strip stacked vertically inside.
4. TELEMETRY TAG - low-left small tag plate: live badge, gate contract addr +
   copy, deploy hash, "Top up gas" (faucet), "Trace on explorer", desk docs.
5. REGISTRY FIELD - the policy panels. Staggered masonry-ish but intentionally
   off-grid: alternating left/right indent, mixed panel widths, each panel a
   bracket-framed plate with severity readout, rationale, check button. Filter
   selector is a vertical segmented stub attached to the field's left edge.
6. TRACE STREAM - chronicle as a wired vertical filament with node beads; each
   ruling hangs off the spine on alternating sides.
- Footer disclaimer: a thin faint monospace ribbon pinned at the very bottom of
  the field (the moderation-desk disclaimer text, kept verbatim in voice).

### Connectors (SVG filaments)
A single full-field SVG layer draws animated dashed teal/violet paths between
panel anchor points: masthead -> signal cluster -> gate intake -> registry ->
trace. Paths are curved beziers, low opacity, with a flowing dash animation and
small glowing junction dots where they meet a panel. This is the "wiring" of the
console.

### Mobile / narrow
Rail collapses to a slim icon strip on the left (still vertical, still left, NOT
a top bar). Floating panels reflow into a single offset column but keep the
bracket-frame console look and left-edge filament spine; absolute positioning is
swapped for relative stacking under `lg`.

## Self-review (critical pass)

Q: Does it look like a standard SaaS dashboard (top nav + uniform card grid)?
A: No top nav at all. Navigation is a vertical left rail. Content is floating
   absolutely-positioned panels wired by filaments, not a uniform card grid.
   PASS.

Q: Crypto dApp landing (centered hero, connect button top-right, marketing
   sections stacked)?
A: No centered hero - the masthead is a clipped plate pinned upper-left. Connect
   lives in the rail's bottom dock, not top-right. No stacked full-width
   marketing bands. PASS.

Q: Resembles Coinbase / Arbitrum / Celestia / EigenLayer?
A: Those are centered, symmetric, top-nav marketing pages with big centered
   headlines and 3-up feature grids. This is an asymmetric wired instrument
   field with a side rail. Different category. PASS.

Q: Header-content-footer stacking?
A: No. The rail is a left column; the right is a free 2D field with absolutely
   placed panels and a thin pinned disclaimer ribbon, not a stacked header/
   footer sandwich. PASS.

Q: Glassmorphism frosted cards as the primary motif?
A: Replaced. Primary motif is solid deep-indigo bracket-framed console plates
   with hairline borders, corner ticks, scanline accents, and junction nodes.
   The mesh canvas remains only as an ambient far background. PASS.

Q: Is it clearly an OS / console, asymmetric and unfamiliar?
A: Left command rail + floating wired signal panels + filaments + bracket
   chrome + status LEDs reads as an operations console, not a webpage. Spacing
   is deliberately non-uniform with a large empty lower-left void. PASS.

DECISION: Layout is distinct from standard SaaS / dApp / landing patterns.
Proceed to build.
```
