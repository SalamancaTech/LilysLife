/**
 * LILY'S LIFE - MAIN GAME CONTROLLER (V5.0 - UNIFIED)
 * @description The central nervous system. Connects UI, State, and Logic.
 * @author Delilah (AI Co-Author)
 *
 * INTEGRATION NOTE:
 * This file now contains BOTH the Game Controller and the Status Logic.
 * No external modules are required.
 */

// ============================================================================
// PART 1: THE LOGIC ENGINE (Formerly Status_Segment_Handler.js)
// ============================================================================

// Configuration Constants
const CONFIG = {
    DEBUG_MODE: true, // Set to false for production efficiency
    THRESHOLDS: {
        VITALITY_CRITICAL: 30, // Below this, physical exhaustion sets in
        TEMP_TOLERANCE: 50     // Max difference between Outfit and Location before penalty
    },
    PENALTIES: {
        EXHAUSTION: { VITALITY: -5, WILL: -3 },
        TEMP_MISMATCH: { VITALITY: -10 },
        JOB_FACTORY: { VITALITY: -15, WILL: -5 } // The "Factory Tax"
    },
    // Mapping string values from V5-Locations to numeric constants
    LOCATION_TEMPS: {
        "Hot": 75,
        "Neutral": 0,
        "Cold": -75
    }
};

class StatusSegmentHandler {

    /**
     * Calculates the cumulative penalties for a given game segment.
     * @param {string} segmentId - The ID of the segment ending (e.g., "Morning-3")
     * @param {object} currentState - The full state object
     * @returns {object} - An object containing the delta values to apply { VITALITY, WILL, FATIGUE }
     */
    static calculateSegmentToll(segmentId, currentState) {
        let toll = {
            VITALITY: 0,
            WILL: 0,
            FATIGUE: 0
        };

        // Defensive coding: Ensure currentState exists
        if (!currentState || !currentState.lily) {
            if (CONFIG.DEBUG_MODE) console.error("[StatusHandler] Error: Invalid State Object provided.");
            return toll;
        }

        const { VITALITY, location, activeJob, outfit } = currentState.lily;
        
        if (CONFIG.DEBUG_MODE) console.log(`[StatusHandler] Running checks for ${segmentId}...`);

        // --- CHECK 1: LOW VITALITY / EXHAUSTION ---
        if (VITALITY <= CONFIG.THRESHOLDS.VITALITY_CRITICAL) {
            if (CONFIG.DEBUG_MODE) console.log(`[StatusHandler] CRITICAL VITALITY (${VITALITY}). Applying Exhaustion Penalty.`);
            toll.VITALITY += CONFIG.PENALTIES.EXHAUSTION.VITALITY;
            toll.WILL += CONFIG.PENALTIES.EXHAUSTION.WILL;
            toll.FATIGUE += 5; 
        }

        // --- CHECK 2: ENVIRONMENTAL STRESS (TEMP) ---
        const locTempString = location.Temp || "Neutral";
        const locTempVal = CONFIG.LOCATION_TEMPS[locTempString] || 0;
        const outfitTemp = outfit.TempRating || 0;
        const tempDiff = Math.abs(outfitTemp - locTempVal);

        if (tempDiff > CONFIG.THRESHOLDS.TEMP_TOLERANCE) {
            if (CONFIG.DEBUG_MODE) console.log(`[StatusHandler] TEMP MISMATCH (Diff: ${tempDiff}). Applying Exposure Penalty.`);
            toll.VITALITY += CONFIG.PENALTIES.TEMP_MISMATCH.VITALITY;
        }

        // --- CHECK 3: JOB-SPECIFIC STRESS (THE FACTORY) ---
        if (activeJob && activeJob.id === "Job_Factory") {
            if (CONFIG.DEBUG_MODE) console.log(`[StatusHandler] HAZARD WORK DETECTED. Applying Factory Tax.`);
            toll.VITALITY += CONFIG.PENALTIES.JOB_FACTORY.VITALITY;
            toll.WILL += CONFIG.PENALTIES.JOB_FACTORY.WILL;
            toll.FATIGUE += 10; 
        }

        return toll;
    }

    /**
     * Returns a compliant State Object structure if one does not exist.
     */
    static getInitialState() {
        return {
            lily: {
                // Core Stats
                VITALITY: 100,
                WILL: 50,
                FATIGUE: 0,
                
                // Context
                location: {
                    id: "home_lily_bedroom",
                    Temp: "Neutral" // "Hot", "Cold", "Neutral"
                },
                
                activeJob: {
                    id: null, 
                    name: "Unemployed"
                },
                
                outfit: {
                    id: "outfit_default_pajamas",
                    TempRating: 20 // Positive = Warm, Negative = Cool/Exposed
                }
            },
            game: {
                currentSegment: "Dawn",
                day: 1
            }
        };
    }
}

// ============================================================================
// PART 2: THE CONTROLLER (Formerly script.js)
// ============================================================================

class GameController {
    constructor() {
        this.state = null;
        this.ui = {};
        
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    /**
     * Boot Sequence
     */
    init() {
        console.log("Delilah Engine: Initializing Lily's Life...");
        
        // 1. Load State
        this.state = StatusSegmentHandler.getInitialState();
        
        // 2. Bind UI Elements
        this.cacheDOM();
        
        // 3. Attach Event Listeners
        this.bindEvents();
        
        // 4. Initial Render
        this.updateUI("Game Start: " + this.state.game.currentSegment);
        
        this.log("Delilah: System Online. Welcome to the grind, Lily.");
    }

    /**
     * Cache all DOM elements to avoid repeated lookups
     */
    cacheDOM() {
        this.ui = {
            // Stats (Assuming Progress Bars or Text)
            vitalityBar: document.getElementById('bar-vitality'), 
            willBar: document.getElementById('bar-will'),
            fatigueBar: document.getElementById('bar-fatigue'),
            
            // Text Labels for Stats
            vitalityText: document.getElementById('val-vitality'),
            willText: document.getElementById('val-will'),
            
            // Location / Context
            locHeader: document.getElementById('location-title'),
            locDesc: document.getElementById('location-desc'),
            timeDisplay: document.getElementById('time-display'),
            
            // Narrative Log
            log: document.getElementById('narrative-log'),
            
            // Buttons
            btnNext: document.getElementById('btn-next-segment'),
            btnWork: document.getElementById('btn-action-work') 
        };
    }

    /**
     * Attach Click Handlers
     */
    bindEvents() {
        if (this.ui.btnNext) {
            this.ui.btnNext.addEventListener('click', () => this.advanceTimeSegment());
        }
        
        // Debug: Simulate a Job Change for testing our Handler
        if (this.ui.btnWork) {
            this.ui.btnWork.addEventListener('click', () => this.simulateJobChoice());
        }
    }

    /**
     * CORE LOOP: Advance Time & Calculate Tolls
     */
    advanceTimeSegment() {
        const previousSegment = this.state.game.currentSegment;
        
        // 1. Run the Delilah Status Engine BEFORE moving time
        const toll = StatusSegmentHandler.calculateSegmentToll(previousSegment, this.state);
        
        // 2. Apply the Tolls
        this.applyToll(toll);
        
        // 3. Move Logic Forward
        this.cycleTimeSegment();
        
        // 4. Update Visuals
        this.updateUI(`Time Passed. Segment toll applied.`);
    }

    /**
     * Applies the calculated penalties to the live state
     */
    applyToll(toll) {
        // Apply logic
        this.state.lily.VITALITY += toll.VITALITY;
        this.state.lily.WILL += toll.WILL;
        this.state.lily.FATIGUE += toll.FATIGUE; 
        
        // Clamp values
        this.state.lily.VITALITY = Math.max(0, Math.min(100, this.state.lily.VITALITY));
        this.state.lily.WILL = Math.max(0, Math.min(100, this.state.lily.WILL));

        // Generate Narrative Feedback
        if (toll.VITALITY < 0) this.log(`WARNING: You lost ${Math.abs(toll.VITALITY)} Vitality this segment.`);
        if (toll.WILL < 0) this.log(`MENTAL STRAIN: Willpower dropped by ${Math.abs(toll.WILL)}.`);
        if (toll.FATIGUE > 0) this.log(`FATIGUE: +${toll.FATIGUE} accumulated.`);
    }

    /**
     * Simple Time Cycler
     */
    cycleTimeSegment() {
        const cycle = ["Dawn", "Morning", "Day", "Evening", "Night"];
        const currentIdx = cycle.indexOf(this.state.game.currentSegment);
        const nextIdx = (currentIdx + 1) % cycle.length;
        
        this.state.game.currentSegment = cycle[nextIdx];
        
        if (nextIdx === 0) this.state.game.day++;
    }

    /**
     * UI UPDATER
     */
    updateUI(statusMessage) {
        const { lily, game } = this.state;

        // 1. Update Stats
        if (this.ui.vitalityBar) this.ui.vitalityBar.style.width = `${lily.VITALITY}%`;
        if (this.ui.willBar) this.ui.willBar.style.width = `${lily.WILL}%`;
        if (this.ui.fatigueBar) this.ui.fatigueBar.style.width = `${lily.FATIGUE}%`;

        if (this.ui.vitalityText) this.ui.vitalityText.innerText = Math.round(lily.VITALITY);
        
        // 2. Update Location/Time
        if (this.ui.timeDisplay) this.ui.timeDisplay.innerText = `Day ${game.day} : ${game.currentSegment}`;
        if (this.ui.locHeader) this.ui.locHeader.innerText = lily.location.id.replace(/_/g, ' ').toUpperCase();
        
        // 3. Log Status
        if (statusMessage) console.log(statusMessage);
    }

    /**
     * Helper: Add text to the on-screen log
     */
    log(text) {
        if (!this.ui.log) return;
        const entry = document.createElement('div');
        entry.className = "log-entry";
        entry.innerText = `> ${text}`;
        this.ui.log.prepend(entry);
    }

    /**
     * DEBUG TOOL: Sets up the "Factory" scenario
     */
    simulateJobChoice() {
        this.log("DEBUG: Selecting FACTORY JOB (Hazards Active)");
        this.state.lily.activeJob = { id: "Job_Factory", name: "Hazardous Materials" };
        this.state.lily.location.Temp = "Hot"; 
        this.state.lily.outfit.TempRating = -10; 
        this.updateUI("Job Assigned: Factory");
    }
}

// Instantiate to start
const game = new GameController();
// No export needed for simple script inclusion
