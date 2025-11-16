Project Overview

"Lily's Life" is a "Choose Your Own Adventure" (CYOA) and simulation game focused on narrative, character interaction, and detailed game mechanics. The player navigates the life of Lily, making choices that affect her stats, relationships, and story progression.

Core Documents

This project is built upon a foundation of several key design documents (GDDs):

⚜️ The Lily's Life Narrative & Simulation Bible (V-CANON) ⚜️: The master rulebook. This document defines the core persona of the AI assistant, the narrative style (e.g., "Hummingbird Mask"), and the 12-choice UI block.

Character Compendium: Contains detailed profiles for all 50+ NPCs, including their backstories, personalities, stats (WILL, INTIMIDATION), and romantic preferences.

Locations Database - Master List (V2): Details all game locations, their sub-locations, resident NPCs, and the "Stat Auras" (e.g., MALE_GAZE, SOCIAL_CLASS) that affect the player.

Item Database-V2: A complete list of all wearable items, their stats (e.g., RESTRICTION, EXPOSURE, AWARENESS), and their narrative roles.

Core Game Mechanics-V1: Explains foundational systems like the 5-segment day cycle, job mechanics, item states (Clean, Dirty, Destroyed), and the starting Player Presets.

Event Database V1: A database of narrative events, triggers, choices, and consequences.

NPC Schedule Masterlist (V1): Tracks the location of all key NPCs across the 5 time segments (Dawn, Morning, Day, Evening, Night).

Interactive Tools

To visualize and test the data from the core documents, this project uses several interactive HTML-based tools:

index.html: The main "game" interface, which loads the other tools as modules.

location_viewer.html: A tool to browse all game locations. You can select a time of day to see which NPCs are present at each sub-location and view the location's "Aura."

character_roster.html: An interactive roster of all NPCs. You can sort by name, gender, or location and click any character to view their detailed profile, bio, and preferences.

lily_stat_calculator.html: A stat calculator to test outfit combinations. You can select a Player Preset ("Reluctant," "Enthusiast," "Neutral") and equip various items to see the final calculated stats for Lily's "Core Attributes" and her "Delilah Gauge" (clothing modifiers).