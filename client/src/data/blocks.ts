export const BLOCKS: { [key: string]: blockrow[]; } = {
	"main-left": [
		{ name: "Name", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Rank", type: "input", checkboxes: 0, placeholder: true },
		{ name: "empty", type: "empty", checkboxes: 0 },
		{ name: "Relationships", type: "title", checkboxes: 0 },
		{ name: "relation_0", type: "input", checkboxes: 0 },
		{ name: "relation_1", type: "input", checkboxes: 0 },
		{ name: "relation_2", type: "input", checkboxes: 0 },
		{ name: "relation_3", type: "input", checkboxes: 0 },
		{ name: "relation_4", type: "input", checkboxes: 0 },
		{ name: "relation_5", type: "input", checkboxes: 0 }
	],

	"main-center": [
		{ name: "Portrait", type: "logo", checkboxes: 0, placeholder: true },
		{ name: "Portrait Link", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Age", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Sex", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Weight", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Height", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Drafts", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Dinars", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Hometown", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Experience", type: "input", checkboxes: 0, placeholder: true },
	],

	"main-right": [
		{ name: "Visuals", type: "title", checkboxes: 0 },
		{ name: "visual_0", type: "input", checkboxes: 0 },
		{ name: "visual_1", type: "input", checkboxes: 0 },
		{ name: "visual_2", type: "input", checkboxes: 0 },
		{ name: "visual_3", type: "input", checkboxes: 0 },
		{ name: "empty", type: "empty", checkboxes: 0 },
		{ name: "Legacies", type: "title", checkboxes: 0 },
		{ name: "legacy_0", type: "input", checkboxes: 0 },
		{ name: "legacy_1", type: "input", checkboxes: 0 },
		{ name: "legacy_2", type: "input", checkboxes: 0 }
	],

	"culture": [
		{ name: "Culture", type: "title-major", checkboxes: 0 },
		{ name: "culture-icon", type: "logo", checkboxes: 0 },
		{ name: "culture", type: "select", checkboxes: 0, selectdata: ["Borca", "Franka", "Pollen", "Balkhan", "Hyprispania", "Purgare", "Africa"] }
	],
	
	"concept": [
		{ name: "Concept", type: "title-major", checkboxes: 0 },
		{ name: "concept-icon", type: "logo", checkboxes: 0 },
		{ name: "concept", type: "select", checkboxes: 0, selectdata: ["0. The Adventurer", "I. The Creator", "II. The Mentor", "III. The Martyr", "IV. The Ruler", "V. The Seeker", "VI. The Healer", "VII. The Traditionalist", "VIII. The Mediator", "IX. The Hermit", "X. The Heretic", "XI. The Conqueror", "XII. The Abomination", "XIII. Destroyer", "XIV. The Chosen", "XV. The Defiler", "XVI. The Protector", "XVII. The Visionary", "XVIII. The Zealot", "XIX. The Disciple", "XX. The Righteous", "XXI. The Traveller"] }
	],

	"cult": [
		{ name: "Cult", type: "title-major", checkboxes: 0 },
		{ name: "cult-icon", type: "logo", checkboxes: 0 },
		{ name: "cult", type: "select", checkboxes: 0, selectdata: ["Spitalians", "Chroniclers", "Hellvetics", "Judges", "Clanners", "Scrappers", "Neolibyans", "Scourgers", "Anubians", "Jehammedans", "Apocalyptics", "Anabaptists", "Palers"] }
	],

	"body": [
		{ name: "Body", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Athletics", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Brawl", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Force", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Melee", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Stamina", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Toughness", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"agility": [
		{ name: "Agility", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Crafting", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Dexterity", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Navigation", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Mobility", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Projectiles", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Stealth", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"charisma": [
		{ name: "Charisma", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Arts", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Conduct", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Expression", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Leadership", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Negotiation", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Seduction", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"intellect": [
		{ name: "Intellect", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Artifact Lore", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Engineering", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Focus", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Legends", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Medicine", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Science", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"psyche": [
		{ name: "Psyche", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Cunning", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Deception", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Domination", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Faith", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Reaction", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Willpower", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"instinct": [
		{ name: "Instinct", type: "title", checkboxes: 6, dice: "attribute" },
		{ name: "Empathy", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Orienteering", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Perception", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Primal", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Survival", type: "normal", checkboxes: 6, dice: "skill" },
		{ name: "Taming", type: "normal", checkboxes: 6, dice: "skill" }
	],

	"origins": [
		{ name: "Origins", type: "title", checkboxes: 0 },
		{ name: "Allies", type: "normal", checkboxes: 6 },
		{ name: "Authority", type: "normal", checkboxes: 6 },
		{ name: "Network", type: "normal", checkboxes: 6 },
		{ name: "Renown", type: "normal", checkboxes: 6 },
		{ name: "Resource", type: "normal", checkboxes: 6 },
		{ name: "Secrets", type: "normal", checkboxes: 6 }
	],

	"potentials": [
		{ name: "Potentials", type: "title", checkboxes: 0 },
		{ name: "potential_0", type: "input", checkboxes: 3 },
		{ name: "potential_1", type: "input", checkboxes: 3 },
		{ name: "potential_2", type: "input", checkboxes: 3 },
		{ name: "potential_3", type: "input", checkboxes: 3 },
		{ name: "potential_4", type: "input", checkboxes: 3 },
		{ name: "potential_5", type: "input", checkboxes: 3 }
	],

	"scars": [
		{ name: "Scars", type: "title", checkboxes: 0 },
		{ name: "Group Name", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Alignment", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Constellation", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Scars Value", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Infamy", type: "normal", checkboxes: 6 }
	],

	"modifiers": [
		{ name: "Modifiers", type: "title", checkboxes: 0 },
		{ name: "modifier_0", type: "input", checkboxes: 0 },
		{ name: "modifier_1", type: "input", checkboxes: 0 },
		{ name: "modifier_2", type: "input", checkboxes: 0 },
		{ name: "modifier_3", type: "input", checkboxes: 0 },
		{ name: "modifier_4", type: "input", checkboxes: 0 },
		{ name: "modifier_6", type: "input", checkboxes: 0 },
		{ name: "modifier_5", type: "input", checkboxes: 0 }
	],

	"conditions": [
		{ name: "ego", type: "condition", checkboxes: 24 },
		{ name: "Ego", type: "condition-title", checkboxes: 0 },
		{ name: "spore", type: "condition", checkboxes: 24 },
		{ name: "Spore Infestations", type: "condition-title", checkboxes: 0 },
		{ name: "flesh", type: "condition", checkboxes: 24 },
		{ name: "Fleshwounds", type: "condition-title", checkboxes: 0 },
		{ name: "trauma", type: "condition", checkboxes: 12 },
		{ name: "Traumas", type: "condition-title", checkboxes: 0 },
	],

	"complications": [
		{ name: "Complications", type: "title", checkboxes: 0 },
		{ name: "complication_0", type: "input", checkboxes: 0 },
		{ name: "complication_1", type: "input", checkboxes: 0 },
		{ name: "complication_2", type: "input", checkboxes: 0 },
		{ name: "complication_3", type: "input", checkboxes: 0 },
		{ name: "complication_4", type: "input", checkboxes: 0 },
		{ name: "complication_5", type: "input", checkboxes: 0 },
		{ name: "complication_6", type: "input", checkboxes: 0 }
	],
};