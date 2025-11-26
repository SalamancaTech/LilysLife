LILY'S LIFE | V7: THE IDENTITY UPDATE

Project Architect: Delilah
Core Philosophy: "The Pilot & The Vehicle: Adaptation is Power."

01. PROJECT OVERVIEW

The Lily's Life V7 engine shifts the narrative focus from basic survival to high-performance Social Strategy and Identity Calibration. The player (The Pilot) is tasked with synchronizing the protagonist (The Vehicle) with a volatile, scrutinizing world. Every choice, from a lace thong to a steel-toed boot, has quantifiable mechanical repercussions. The core challenge is managing perception and physical stability within the constraints of Lilith's Lake society.

The world structure has now evolved into a Single Source of Truth (SSOT), where all locations and items are governed by a comprehensive, mechanically explicit TAG_LIBRARY.

02. CORE MECHANICS: THE ENGINE ROOM

The game state is governed by a dual system of Resources (The Tanks) and Attributes (The Pentagram).

A. THE TANKS (Fluid Resources: 0–100)

These dictate Lily's moment-to-moment capacity to act, endure, and interact.

Resource

Concept

Drain Vectors

Critical State (0-10)

VITALITY

Raw physical energy.

Exertion, Thermal Debt (Heat/Cold), Restrictive Clothing.

Locks [BOLD] and [PLAYFUL] Stances.

COMPOSURE

Social health and integrity of the persona.

Scrutiny (Outfit Mismatch), High Visibility/Spotlight, Failure.

Locks [SHARP] and [ELEGANT] Stances.

SYNC

The Pilot Rating (0-100).

How intuitive Lily's movement and presentation feel. Low Sync impairs GRACE checks; High Sync unlocks [EUPHORIA] (Composure regen).

Uncalibrated (Clumsy) vs. Calibrated (Fluidity).

B. THE PENTAGRAM (Core Attributes: 1–10)

Five persistent stats used for all skill checks and stance selections.

Attribute

Domain

Key Stances

WILL

Force, Boundaries, Endurance.

[COMMANDING], [STOIC]

GRACE

Coordination, Etiquette, Harmony.

[ELEGANT], [DEMURE]

WIT

Logic, Banter, Observation, Deception.

[SHARP], [CRYPTIC]

HEART

Empathy, Connection, Sincerity.

[SINCERE], [NURTURING]

FLAIR

Projection, Drama, Attention Capture.

[BOLD], [MYSTERIOUS]

03. THE WARDROBE PHYSICS ENGINE

Clothing is not cosmetic; it is a complex layer of protection, vulnerability, and social compliance, filtered through the environment's tags.

System

Effect & Calculation

Penalty/Risk

EXPOSURE

Sum of outfit tags (e.g., [MINI], [CROP]). Determines Visibility and Cold sensitivity.

High Exposure = High VISIBILITY + High FREEZE RISK.

THERMODYNAMICS

Insulation vs. Heat Stress. (Comfort Zone: 40–70).

FREEZE STATE (below 30): -GRACE, -VITALITY. OVERHEAT STATE (above 80): -VITALITY, [MESSY] tag.

SOCIAL SCRUTINY

Outfit context mismatch (e.g., [TRASHY] in a [LUXURY] zone).

Locks high-confidence options. Drains COMPOSURE.

VPL

Visible Panty Line Risk. Calculated by [INNER_BOTTOM] vs. [OUTER_BOTTOM] tags.

Critical failure in social or romantic scenarios.

SOCIAL DYNAMICS

Location tags (JUDGMENT_ZONE, FLIRTY_ZONE, MASCULINE_SPACE) modify the difficulty of social Attribute checks.

JUDGMENT_ZONE: Increases SOCIAL SCRUTINY penalty severity.

04. INTERACTION & RESOLUTION

A. THE INTERACTION MATRIX

All player actions combine an INTENT (Goal) with a STANCE (Delivery) selected from the Pentagram. The core action library (LOOK, TAKE, USE, TALK) has been standardized for object interaction.

Example: INTENT: CHARM + STANCE: [DEMURE] (Grace)

B. THE GAMBIT SYSTEM

When an Attribute Check fails by a narrow margin, the player may be offered a GAMBIT—a last-ditch resource sacrifice to force a success.

Example: Failed Social Check? Burn 20 COMPOSURE to laugh off the awkwardness and save the conversation.

05. CORE NARRATIVE CAST

MITCH: The Anchor / The Shield

Archetype: The Guardian Bear.

Role: Physical Protector. Operates on Trust (0-100).

Dynamic: Over-protective, values honesty and stability.

Synergy: [SINCERE] (Heart) and [DEMURE] (Grace). Grants Aura of Safety (halts Visibility accumulation).

ASHLEY: The Stylist / The Chaos Engine

Archetype: The Digital Witch.

Role: Social/Digital Strategist. Operates on Affinity (0-100).

Dynamic: Analytical, cynical, thrives on chaos. Sees social life as a hackable system.

Synergy: [SHARP] (Wit) and [BOLD] (Flair). Grants The Scanner (reveals NPC/Object tags).

06. THE WORLD STRUCTURE (16 HUBS & SSOT)

The world has evolved from a small test map into a Single Source of Truth (SSOT) comprising 16 major Hubs and over 50 unique, explicitly tagged Sub-Locations. Locations now apply instantaneous status effects (Tags) which are guaranteed to be "sticky" and non-bleeding due to the fixed inheritance hierarchy.

All residences are global [SAFE_ZONE] hubs where Visibility is locked at 0% and Composure regenerates.

Location

Archetype

Key Interactive Objects

Lily's Residence (2B)

The Sanctuary / The Cockpit

obj_wardrobe_rack (Wardrobe UI), obj_mirror_main (Sync Check).

Mitch's Residence (2A)

The Bear's Den / The Anchor

obj_mitch_fridge (Resource Hub), Mitch NPC (Trust Builder).

Ashley's Residence (2C)

The Digital Nest / The Chaos

obj_streaming_rig (High Visibility Event), Ashley NPC (Style Audit).

Utility & Commerce

Expanded World

[RESTROOM] (Hygiene/Composure), [FOOD_SOURCE] (Vitality), [VIP_ACCESS] (Progression/Checks).