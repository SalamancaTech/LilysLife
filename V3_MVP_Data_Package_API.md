<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lily's Life - V3 MVP Data Package</title>
    <!-- Importing Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Setting a modern, readable font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Using Inter as the default font */
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Styling for the code blocks for readability */
        pre {
            white-space: pre-wrap;       /* Wraps the text inside the pre block */
            word-wrap: break-word;      /* Breaks long words */
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-900 p-6 md:p-12">

    <div class="max-w-4xl mx-auto">

        <!-- Main Header -->
        <header class="text-center mb-10">
            <h1 class="text-3xl md:text-4xl font-bold text-purple-700 mb-2">⚜️ LILY'S LIFE - V3 MVP DATA PACKAGE ⚜️</h1>
            <p class="text-lg text-gray-600">(API-Ready JSON-Style Format)</p>
        </header>

        <!-- Section 1: MVP Location -->
        <section class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-semibold mb-5 text-purple-600 border-b pb-2">1. MVP Location</h2>
            <!-- Code block for easy parsing/copying -->
            <pre class="bg-gray-900 text-green-300 rounded-lg p-4 overflow-x-auto"><code>
{
  "LocationID": "home_ashley",
  "Name": "Ashley's House",
  "Description": "Ashley's house, on the other side. You can hear video game music from the porch.",
  "Hours": ["Dawn", "Morning", "Day", "Evening", "Night"],
  "GlobalStatAura": {
    "FEMALE_JUDGE": 0,
    "MALE_GAZE": 0,
    "SOCIAL_CLASS": 0,
    "DANGER": -100
  },
  "SubLocations": [
    {
      "SubLocationID": "home_ashley_livingroom",
      "Name": "Ashley's Living Room",
      "Description": "A gamer's paradise. Big-screen TV, multiple consoles, and comfy beanbags. Her streaming setup is in the corner.",
      "MusicTrack": "track_home_ashley_ambient",
      "PrimaryMechanic": ["Social_Home", "Event_Advice_Outfits", "Event_Watch_Stream (Night)"],
      "Temperature": "Neutral"
    }
  ]
}
            </code></pre>
        </section>

        <!-- Section 2: MVP NPC -->
        <section class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-semibold mb-5 text-purple-600 border-b pb-2">2. MVP NPC</h2>
            <pre class="bg-gray-900 text-green-300 rounded-lg p-4 overflow-x-auto"><code>
{
  "NPC_ID": "Ashley",
  "Function": "The Outfit Analyst",
  "Stats": {
    "WILL": 65,
    "INTIMIDATION": 5
  },
  "Relational_Base": {
    "FAMILIARITY": 100,
    "TRUST": 100,
    "ATTRACTION": 40,
    "DESIRE": 20
  },
  "Preferences": {
    "WILL": "Dominant",
    "PRESENTATION": "Masculine",
    "SOCIAL_CLASS": ["Low", "Neutral"]
  },
  "Schedule": {
    "Dawn": "home_ashley_livingroom",
    "Morning": "home_ashley_livingroom",
    "Day": "home_ashley_livingroom",
    "Evening": "TBD_Visitor",
    "Night": "home_ashley_livingroom (Streaming)"
  },
  "Tags": ["BestFriend", "Gamer", "OutfitAnalyst", "Feisty", "Protective"]
}
            </code></pre>
        </section>

        <!-- Section 3: MVP Item -->
        <section class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-semibold mb-5 text-purple-600 border-b pb-2">3. MVP Item</h2>
            <pre class="bg-gray-900 text-green-300 rounded-lg p-4 overflow-x-auto"><code>
{
  "ItemID": "btm_skirt_mini_01",
  "Name": "Black Mini Skirt",
  "Slot": "Bottom",
  "BasePrice": 35,
  "Stats": {
    "RESTRICTION": 4,
    "UTILITY": -2,
    "EXPOSURE": 15,
    "SOCIAL_CLASS": 2,
    "PRESENTATION": 10,
    "MALE_GAZE": 12,
    "FEMALE_JUDGE": 8,
    "AWARENESS": 10,
    "INSULATION": 1
  },
  "Tags": ["Feminine", "Fashionable", "High-Risk", "High-Awareness", "Low-Utility"]
}
            </code></pre>
        </section>

        <!-- Section 4: MVP Event (Code-Ready Logic) -->
        <section class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-semibold mb-5 text-purple-600 border-b pb-2">4. MVP Event (Code-Ready Logic)</h2>
            <pre class="bg-gray-900 text-green-300 rounded-lg p-4 overflow-x-auto"><code>
{
  "EventID": "ASHLEY_Commando_Intervention_01",
  "EventTitle": "The 'Commando' Intervention",
  "Category": "Tutorial",
  "Trigger": {
    "Location": ["home_ashley"],
    "NPC": ["Ashley"],
    "Attire": [
      "EQUIPPED(und_bottom_none_01)",
      "EQUIPPED_SLOT(Bottom) != btm_pants_yoga_01"
    ],
    "Flag": ["NOT(FIRED:ASHLEY_Commando_Intervention_01)"],
    "Stat": ["Ashley.TRUST >= 50"]
  },
  "OnFire": {
    "DialogueID": "ASHLEY_Commando_01_Start",
    "ChoiceBlockID": "ASHLEY_Commando_01_Prompt"
  },
  "Consequences": {
    "Embrace_Curious": {
      "DialogueID": "ASHLEY_Commando_01_Embrace",
      "SetFlag": ["FIRED:ASHLEY_Commando_Intervention_01", "FIRED:ASHLEY_Commando_Tutorial_02"],
      "ModStat": ["Ashley.TRUST +5"]
    },
    "Resist_Bold": {
      "DialogueID": "ASHLEY_Commando_01_ResistBold",
      "SetFlag": ["FIRED:ASHLEY_Commando_Intervention_01"],
      "Check": "WILL vs Ashley.WILL",
      "Pass": {
        "ModStat": ["Ashley.ATTRACTION +2"]
      },
      "Fail": {
        "ModStat": []
      }
    },
    "Resist_Shy": {
      "DialogueID": "ASHLEY_Commando_01_ResistShy",
      "SetFlag": ["FIRED:ASHLEY_Commando_Intervention_01"],
      "ModStat": []
    }
  }
}
            </code></pre>
        </section>

        <!-- Footer Note -->
        <footer class="text-center text-gray-600 italic mt-10">
            <p>*(Note: The corresponding `DialogueID` text (like `ASHLEY_Commando_01_Start`) would be stored in a separate `Dialogue_Database` file, just as we discussed, to keep this logic file clean!)*</p>
        </footer>

    </div> <!-- /max-w-4xl -->

</body>
</html>
