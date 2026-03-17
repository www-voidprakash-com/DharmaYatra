
import { Language, Translations, TranslationSet, SnakeLadderInfo, PlayerColor, AnimalIconInfo, LanguageOption, VoiceOption } from './types';

export const BOARD_SIZE = 100;
export const PLAYER_INITIAL_POSITION = 0; // Off-board
export const PLAYER_BOARD_START_POSITION = 1; // Janma square

export const AVAILABLE_COLORS: PlayerColor[] = [
  { nameKey: 'color_blue', tailwindClass: 'bg-blue-500', tailwindBorderClass: 'border-blue-700' },
  { nameKey: 'color_red', tailwindClass: 'bg-red-500', tailwindBorderClass: 'border-red-700' },
  { nameKey: 'color_green', tailwindClass: 'bg-green-500', tailwindBorderClass: 'border-green-700' },
  { nameKey: 'color_yellow', tailwindClass: 'bg-yellow-500', tailwindBorderClass: 'border-yellow-700' },
  { nameKey: 'color_purple', tailwindClass: 'bg-purple-500', tailwindBorderClass: 'border-purple-700' },
  { nameKey: 'color_pink', tailwindClass: 'bg-pink-500', tailwindBorderClass: 'border-pink-700' },
];

export const AVAILABLE_ANIMAL_ICONS: AnimalIconInfo[] = [
  { nameKey: 'animal_lion', iconKey: 'FaLion' },
  { nameKey: 'animal_elephant', iconKey: 'FaHippo' }, 
  { nameKey: 'animal_horse', iconKey: 'FaHorseHead' },
  { nameKey: 'animal_deer', iconKey: 'FaPersonRunning' }, 
  { nameKey: 'animal_peacock', iconKey: 'FaDove' }, 
  { nameKey: 'animal_tiger', iconKey: 'FaCat' },
];

export const AVAILABLE_VOICES: VoiceOption[] = [
  { name: 'Fenrir', label: 'Himalayan Sage (Indian)' },
  { name: 'Charon', label: 'Royal Historian (British)' },
  { name: 'Kore', label: 'Canyon Guide (American)' },
  { name: 'Zephyr', label: 'Outback Tracker (Australian)' },
  { name: 'Puck', label: 'Celtic Bard (Irish)' },
];


export const SNAKES_LADDERS_MAP: { [key: number]: SnakeLadderInfo } = {
  17: { to: 7, type: 'snake', key: 'text_snake_moha', themeIndex: 0 }, // Red
  54: { to: 34, type: 'snake', key: 'text_snake_lobha', themeIndex: 1 }, // Green
  62: { to: 19, type: 'snake', key: 'text_snake_mada', themeIndex: 2 }, // Purple
  67: { to: 23, type: 'snake', key: 'text_snake_kama_alt', themeIndex: 3 }, // Orange
  87: { to: 24, type: 'snake', key: 'text_snake_kama', themeIndex: 4 }, // Grey
  93: { to: 73, type: 'snake', key: 'text_snake_matsarya', themeIndex: 5 }, // Blue
  95: { to: 75, type: 'snake', key: 'text_snake_ahankara', themeIndex: 6 }, // Cyan
  98: { to: 79, type: 'snake', key: 'text_snake_krodha', themeIndex: 7 }, // Pink

  4: { to: 14, type: 'ladder', key: 'text_ladder_viveka' },
  9: { to: 31, type: 'ladder', key: 'text_ladder_shraddha' },
  20: { to: 38, type: 'ladder', key: 'text_ladder_dana' },
  21: { to: 42, type: 'ladder', key: 'text_ladder_santosha' },
  28: { to: 84, type: 'ladder', key: 'text_ladder_karuna' },
  51: { to: 68, type: 'ladder', key: 'text_ladder_maitri' },
  71: { to: 91, type: 'ladder', key: 'text_ladder_kshama' },
  80: { to: 100, type: 'ladder', key: 'text_ladder_moksha_direct' },
};

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: Language.English, name: 'English', fontClass: 'font-noto-sans' },
  { code: Language.Hindi, name: 'हिन्दी (Hindi)', fontClass: 'font-noto-devanagari' },
  { code: Language.Sanskrit, name: 'संस्कृतम् (Sanskrit)', fontClass: 'font-noto-devanagari' },
  { code: Language.Bengali, name: 'বাংলা (Bengali)', fontClass: 'font-noto-bengali' },
  { code: Language.Tamil, name: 'தமிழ் (Tamil)', fontClass: 'font-noto-tamil' },
  { code: Language.Telugu, name: 'తెలుగు (Telugu)', fontClass: 'font-noto-telugu' },
  { code: Language.Kannada, name: 'ಕನ್ನಡ (Kannada)', fontClass: 'font-noto-kannada' },
  { code: Language.Gujarati, name: 'ગુજરાતી (Gujarati)', fontClass: 'font-noto-gujarati' },
  { code: Language.Marathi, name: 'मराठी (Marathi)', fontClass: 'font-noto-devanagari' },
  { code: Language.Punjabi, name: 'ਪੰਜਾਬੀ (Punjabi)', fontClass: 'font-noto-gurmukhi' },
];

const englishTranslations: TranslationSet = {
  // UI
  'app_title': 'DharmaYatra Snakes & Ladders 2D',
  'roll_dice': 'Roll Dice',
  'reset_game': 'Reset Game',
  'player_position': '{playerName}\'s Position: {position}',
  'player_position_trim_suffix': '{playerName}\'s Position: ', 
  'current_player_turn': '{playerName}\'s Turn',
  'dice_rolled': 'Rolled: {diceValue}',
  'game_over_win': 'Congratulations {playerName}! You have reached Poorna (Wholeness)!', // Can be used by WinScreen or kept for log
  'game_over_final': 'The journey concludes. Well played by all!', // Can be used by WinScreen or kept for log
  'game_over_start_again': 'Play Again?',
  'game_stats_button': 'Game Stats',
  'global_stats_button': 'Global Stats',
  'language_switcher_label': 'Language:',
  'voice_switcher_label': 'Sage Voice:',
  'janma_label': 'Janma (Birth)',
  'poorna_label': 'Poorna (Wholeness)',
  'square_info_title': 'Square {id}: {name}',
  'text_snake_description_prefix': 'Snake to',
  'text_ladder_description_prefix': 'Ladder to',
  'text_waiting_to_start': 'Waiting to start',
  'text_finished_rank': 'Finished! Rank:',
  'loading_text': 'Loading {item}...',

  // Nickname Screen
  'nickname_title': 'Welcome to DharmaYatra!',
  'nickname_label': 'Enter Your Nickname:',
  'nickname_placeholder': 'E.g., Pilgrim Player',
  'nickname_description': 'This will be your name in the game and on the leaderboard.',
  'nickname_proceed_button': 'Confirm & Proceed to Setup',

  // Setup Screen
  'setup_title': 'Prepare for DharmaYatra',
  'num_players_label': 'Number of Players (2-6):',
  'player_name_label': 'Name',
  'player_color_label': 'Color',
  'player_animal_label': 'Avatar',
  'start_game_button': 'Begin Yatra',
  'start_practice_button': 'Practice vs Computer',
  'player_setup_error_name': 'Player {id} needs a name.',
  'player_setup_error_color_conflict': 'Player colors must be unique.',
  'player_setup_error_animal_conflict': 'Player peg animals must be unique.',
  
  // New Setup Keys
  'setup_class_label': 'Class / Ability',
  'setup_class_pilgrim': 'Pilgrim (Normal Start)',
  'setup_class_traveler': 'Traveler (Start at 2)',
  'setup_class_explorer': 'Explorer (Start at 5)',
  'setup_class_veteran': 'Veteran (Start at 10)',
  'setup_class_custom': 'Custom',
  'setup_starting_square': 'Starting Square',
  'setup_advanced_options': 'Advanced Options',

  // Game Messages
  'msg_welcome': 'Welcome to DharmaYatra! Setup your game to begin the journey.',
  'msg_game_started': 'The Yatra begins! {firstPlayerName}, roll a 1 or 6 to start.',
  'msg_player_turn_prompt_start': '{playerName}, roll a 1 or 6 to start your journey!',
  'msg_player_started': '{playerName} rolled a {diceValue} and starts the journey from Janma!',
  'msg_player_roll_to_start_fail': '{playerName} rolled a {diceValue}. Need a 1 or 6 to start.',
  'msg_landed_on': '{playerName} landed on {position}.',
  'msg_landed_on_snake': '{playerName} landed on {position}. Oh no! Adharma pulls you down: {text} to {newPosition}.',
  'msg_climbed_ladder': '{playerName} landed on {position}. Wonderful! Dharma lifts you up: {text} to {newPosition}.',
  'msg_exact_roll_needed': '{playerName} rolled {diceValue}. An exact roll is needed to reach 100. Stay at {position}.',
  'msg_player_wins': '{playerName} has reached Poorna with {diceThrows} throws! Congratulations!',
  'msg_all_players_finished': 'All players have completed their journey! The Yatra is complete.',
  'msg_game_continues': 'The game continues for other players.',
  'msg_extra_turn': '{playerName} rolled a 6! The cosmos aligns. Roll again!',
  'msg_player_started_veteran': '{playerName} uses their experience to enter immediately!',

  // Snakes (Adharma)
  'text_snake_moha': 'Oh {playerName}, the {playerAnimalName} of {playerColorName} hue gets caught in Moha (Delusion)!',
  'text_snake_lobha': 'Alas {playerName}, Lobha (Greed) tempts your {playerColorName} {playerAnimalName}.',
  'text_snake_mada': 'Mada (Arrogance) affects {playerName}\'s {playerAnimalName}.',
  'text_snake_kama': '{playerName}, your {playerColorName} {playerAnimalName} stumbles due to Kama (Excessive Desire).',
  'text_snake_kama_alt': 'Asakti (Attachment) pulls {playerName} the {playerAnimalName} back.',
  'text_snake_matsarya': 'Matsarya (Jealousy) shadows {playerName}\'s path with the {playerColorName} {playerAnimalName}.',
  'text_snake_ahankara': 'Ahankara (Ego) misguides {playerName} and their {playerAnimalName}.',
  'text_snake_krodha': 'Krodha (Anger) flares up for {playerName}\'s {playerColorName} {playerAnimalName}!',

  // Ladders (Dharma)
  'text_ladder_viveka': '{playerName}, your {playerAnimalName} gains Viveka (Wisdom) and ascends!',
  'text_ladder_shraddha': 'Shraddha (Faith) lifts {playerName}\'s {playerColorName} {playerAnimalName} higher.',
  'text_ladder_dana': 'The virtue of Dana (Generosity) elevates {playerName} and their {playerAnimalName}.',
  'text_ladder_santosha': '{playerName}, the {playerColorName} {playerAnimalName} finds Santosha (Contentment) and moves up.',
  'text_ladder_karuna': 'Karuna (Compassion) guides {playerName}\'s {playerAnimalName} upwards.',
  'text_ladder_maitri': '{playerName}, your {playerColorName} {playerAnimalName} is blessed by Maitri (Loving-kindness).',
  'text_ladder_kshama': 'Kshama (Forgiveness) allows {playerName}\'s {playerAnimalName} to advance.',
  'text_ladder_moksha_direct': '{playerName}, your {playerAnimalName} finds a direct path to Poorna (Wholeness)!',

  // Sage Fallbacks (Offline/Error Mode)
  'sage_fallback_snake': 'A stumble is but a lesson in disguise... Rise again, {playerName}!',
  'sage_fallback_ladder': 'Virtue is its own reward... Well done on your ascent, {playerName}!',
  'sage_fallback_win': 'Moksha achieved! A glorious journey ends in wholeness.',
  'sage_fallback_extra': 'Fortune favors the bold. The universe grants another chance.',

  // Colors
  'color_blue': 'Blue', 'color_red': 'Red', 'color_green': 'Green', 'color_yellow': 'Yellow', 'color_purple': 'Purple', 'color_pink': 'Pink',
  // Animals
  'animal_lion': 'Lion', 'animal_elephant': 'Elephant', 'animal_horse': 'Horse', 'animal_deer': 'Deer', 'animal_peacock': 'Peacock', 'animal_tiger': 'Tiger',

  // Winners Table (some keys might be reused by WinScreen)
  'winners_table_title': 'Journey Results',
  'rank_header': 'Rank',
  'player_header': 'Player',
  'throws_header': 'Dice Throws',
  'no_winners_yet': 'No players have finished yet.',

  // History Logs
  'message_history_title': 'Game Log',
  'turn_history_title': 'Turn Log',
  'empty_message_history': 'No game messages yet.',
  'empty_turn_history': 'No turns taken yet.',
  'turn_action_started_journey': '{playerName} rolled {diceValue}, started at {endPosition}.',
  'turn_action_started_veteran': '{playerName} started at {endPosition} (Custom Start).',
  'turn_action_failed_to_start': '{playerName} rolled {diceValue}, needs 1 or 6.',
  'turn_action_moved': '{playerName} rolled {diceValue}, {startPosition} → {endPosition}.',
  'turn_action_snake': '{playerName} rolled {diceValue}, landed on {startPosition}. Snake! → {endPosition}.',
  'turn_action_ladder': '{playerName} rolled {diceValue}, landed on {startPosition}. Ladder! → {endPosition}.',
  'turn_action_overshot': '{playerName} rolled {diceValue}. Overshot! Stays at {endPosition}.',
  'turn_action_won': '{playerName} rolled {diceValue}, reached Poorna ({endPosition})! Finished.',
  'turn_action_won_via_sl': '{playerName} landed on {startPosition}. {slType}! Reached Poorna ({endPosition})! Finished.',

  // Leaderboard
  'leaderboard_title': '🏆 Leaderboard',
  'leaderboard_wins_format': '{count} win(s)',
  'leaderboard_empty': 'No victors recorded yet.',

  // WinScreen specific
  'game_over_all_finished_title': 'Journey Complete!',
  'game_over_player_wins_title': '{winnerName} Reaches Poorna!',
  'game_over_title': 'The Yatra Concludes',
  'final_rankings_title': 'Final Rankings',

  // Background Uploader
  'background_uploader_title': 'Custom Background',
  'upload_background_button': 'Upload Image',
  'clear_background_button': 'Clear',
  'background_input_label': 'Choose background image',

  // Legal & Copyright
  'legal_copyright_text': '© 2026 VoidPrakash. All Rights Reserved.',
  'legal_disclaimer_title': 'Spiritual Disclaimer',
  'legal_disclaimer_content': 'The Sage\'s commentary is generated by AI for educational and philosophical entertainment. It should not be taken as literal religious or absolute scriptural doctrine.',
  'legal_rights_text': 'DharmaYatra - A journey from Janma to Poorna.',
  'built_by_text': 'Conceived and Crafted by VoidPrakash',
  'privacy_policy_label': 'Privacy Policy',
  'terms_of_service_label': 'Terms of Service',

  // AI Settings
  'ai_settings_title': 'Advanced AI Settings',
  'custom_api_key_placeholder': 'Enter your Gemini API Key...',
  'custom_api_key_help': 'Provide your own Google AI Studio key to bypass daily quotas and enable persistent Sage wisdom.',
  'save_api_key_button': 'Save Key',
  'api_key_active_status': 'Custom Key Active',
  'api_key_cleared_status': 'Using System Default',
};

export const TRANSLATIONS: Translations = {
  [Language.English]: englishTranslations,
  [Language.Hindi]: {
    ...englishTranslations, 
    'app_title': 'धर्मयात्रा सांप और सीढ़ी 2D',
    'roll_dice': 'पासा फेंको',
    'reset_game': 'पुनः आरंभ करें',
    'player_position': '{playerName} की स्थिति: {position}',
    'player_position_trim_suffix': '{playerName} की स्थिति: ',
    'current_player_turn': '{playerName} की बारी',
    'dice_rolled': 'पासे का अंक: {diceValue}',
    'game_over_win': 'बधाई हो {playerName}! आप पूर्णता को प्राप्त हुए!',
    'game_over_final': 'यात्रा समाप्त हुई। सभी ने अच्छा खेला!',
    'game_over_start_again': 'फिर से खेलें?',
    'game_stats_button': 'वर्तमान खेल',
    'global_stats_button': 'लीडरबोर्ड',
    'language_switcher_label': 'भाषा:',
    'voice_switcher_label': 'ऋषि की आवाज:',
    'janma_label': 'जन्म',
    'poorna_label': 'पूर्ण',
    'square_info_title': 'स्थान {id}: {name}',
    'text_snake_description_prefix': 'सर्प से',
    'text_ladder_description_prefix': 'सीढ़ी से',
    'text_waiting_to_start': 'प्रतीक्षते',
    'text_finished_rank': 'समाप्त! स्थान:',
    'loading_text': '{item} लोड हो रहा है...',
    'msg_extra_turn': '{playerName} ने ६ अंक प्राप्त किया! एक और चाल चलें!',
    'msg_player_started_veteran': '{playerName} सीधे प्रवेश करते हैं!',

    'nickname_title': 'धर्मयात्रा में आपका स्वागत है!',
    'nickname_label': 'अपना उपनाम दर्ज करें:',
    'nickname_placeholder': 'उदा., वीर खिलाड़ी',
    'nickname_description': 'यह खेल और लीडरबोर्ड में आपका नाम होगा।',
    'nickname_proceed_button': 'पुष्टि करें और सेटअप के लिए आगे बढ़ें',

    'setup_title': 'धर्मयात्रा की तैयारी',
    'num_players_label': 'खिलाड़ियों की संख्या (२-६):',
    'player_name_label': 'नाम',
    'player_color_label': 'रंग',
    'player_animal_label': 'गोटी',
    'start_game_button': 'यात्रा आरंभ करें',
    'start_practice_button': 'कंप्यूटर के साथ अभ्यास',
    'player_setup_error_name': 'खिलाड़ी {id} का नाम आवश्यक है।',
    'player_setup_error_color_conflict': 'खिलाड़ियों के रंग अद्वितीय होने चाहिए।',
    'player_setup_error_animal_conflict': 'खिलाड़ियों की गोटियाँ अद्वितीय होनी चाहिए।',
    
    'setup_class_label': 'वर्ग / क्षमता',
    'setup_class_pilgrim': 'तीर्थयात्री (सामान्य)',
    'setup_class_traveler': 'यात्री (स्थान २ से)',
    'setup_class_explorer': 'अन्वेषक (स्थान ५ से)',
    'setup_class_veteran': 'अनुभवी (स्थान १० से)',
    'setup_class_custom': 'कस्टम',
    'setup_starting_square': 'प्रारंभिक स्थान',
    'setup_advanced_options': 'उन्नत विकल्प',

    'msg_welcome': 'धर्मयात्रा में आपका स्वागत है! यात्रा शुरू करने के लिए खेल सेट करें।',
    'msg_game_started': 'यात्रा प्रारम्भ! {firstPlayerName}, अपनी यात्रा शुरू करने के लिए १ या ६ फेंकें।',
    'msg_player_turn_prompt_start': '{playerName}, अपनी यात्रा शुरू करने के लिए १ या ६ फेंकें!',
    'msg_player_started': '{playerName} ने {diceValue} फेंका और जन्म से यात्रा शुरू की!',
    'msg_player_roll_to_start_fail': '{playerName} ने {diceValue} फेंका। शुरू करने के लिए १ या ६ चाहिए।',
    'msg_landed_on': '{playerName} {position} पर उतरे।',
    'msg_landed_on_snake': '{playerName} {position} पर उतरे। अरे नहीं! अधर्म ने आपको नीचे खींच लिया: {text} से {newPosition} पर।',
    'msg_climbed_ladder': '{playerName} {position} पर उतरे। अद्भुत! धर्म ने आपको ऊपर उठाया: {text} से {newPosition} पर।',
    'msg_exact_roll_needed': '{playerName} ने {diceValue} फेंका। १०० तक पहुँचने के लिए सटीक अंक चाहिए। {position} पर रहें।',
    'msg_player_wins': '{playerName} {diceThrows} चालों में पूर्णता को प्राप्त हुए! बधाई हो!',
    'msg_all_players_finished': 'सभी खिलाड़ियों ने अपनी यात्रा पूरी कर ली है! यात्रा सम्पूर्ण हुई।',
    'msg_game_continues': 'अन्य खिलाड़ियों के लिए खेल जारी है।',

    'text_snake_moha': 'ओह {playerName}, आपका {playerColorName} {playerAnimalName} मोह में फँस गया!',
    'text_snake_lobha': 'हाय {playerName}, लोभ आपके {playerColorName} {playerAnimalName} को ललचाता है।',
    'text_snake_mada': 'मद ({playerName} के {playerAnimalName} को प्रभावित करता है)।',
    'text_snake_kama': '{playerName}, आपका {playerColorName} {playerAnimalName} काम (अत्यधिक इच्छा) के कारण ठोकर खाता है।',
    'text_snake_kama_alt': 'आसक्ति ({playerName} के {playerAnimalName} को पीछे खींचती है)।',
    'text_snake_matsarya': 'मत्सर्य ({playerName} के {playerColorName} {playerAnimalName} के मार्ग पर छाया डालता है)।',
    'text_snake_ahankara': 'अहंकार ({playerName} और उनके {playerAnimalName} को भ्रमित करता है)।',
    'text_snake_krodha': '{playerName} के {playerColorName} {playerAnimalName} के लिए क्रोध भड़क उठता है!',

    'text_ladder_viveka': '{playerName}, आपका {playerAnimalName} विवेक प्राप्त करता है और ऊपर चढ़ता है!',
    'text_ladder_shraddha': 'श्रद्धा {playerName} के {playerColorName} {playerAnimalName} को ऊपर उठाती है।',
    'text_ladder_dana': 'दान का पुण्य {playerName} और उनके {playerAnimalName} को ऊपर उठाता है।',
    'text_ladder_santosha': '{playerName}, आपका {playerColorName} {playerAnimalName} संतोष पाता है और आगे बढ़ता है।',
    'text_ladder_karuna': 'करुणा {playerName} के {playerAnimalName} को ऊपर की ओर मार्गदर्शन करती है।',
    'text_ladder_maitri': '{playerName}, आपका {playerColorName} {playerAnimalName} मैत्री से धन्य है।',
    'text_ladder_kshama': 'क्षमा {playerName} के {playerAnimalName} को आगे बढ़ने देती है।',
    'text_ladder_moksha_direct': '{playerName}, आपका {playerAnimalName} पूर्णता का सीधा मार्ग पाता है!',
    
    'sage_fallback_snake': 'यह एक ठोकर मात्र है, {playerName}... हार नहीं। फिर उठो!',
    'sage_fallback_ladder': 'पुण्य स्वयं अपना पुरस्कार है... अच्छी चढ़ाई, {playerName}!',
    'sage_fallback_win': 'मोक्ष प्राप्त हुआ! एक गौरवशाली यात्रा पूर्णता में समाप्त होती है।',
    'sage_fallback_extra': 'भाग्य वीरों का साथ देता है। पुनः प्रयास करें।',

    'winners_table_title': 'परिणामः',
    'rank_header': 'श्रेणी',
    'player_header': 'क्रीडकः',
    'throws_header': 'अक्षक्षेपणानि',
    'no_winners_yet': 'न कोऽपि क्रीडकः अद्यापि यात्रां समाप्तवान्।',

    'message_history_title': 'क्रीडावृत्तान्तः',
    'turn_history_title': 'वारवृत्तान्तः',
    'leaderboard_title': '🏆 अग्रगण्यसूची',
    'leaderboard_wins_format': '{count} विजयाः',
    'leaderboard_empty': 'कोऽपि न जयति।',

    'game_over_all_finished_title': 'यात्रा सम्पूर्णा!',
    'game_over_player_wins_title': '{winnerName} पूर्णतां गतः!',
    'game_over_title': 'यात्रा समाप्ता',
    'final_rankings_title': 'अन्तिमा श्रेणी',
    'background_uploader_title': 'पृष्ठभूमिः',
    'upload_background_button': 'चित्रं योजयतु',
    'clear_background_button': 'निष्कासयतु',
    'background_input_label': 'चित्रं चिनोतु',

    // Legal & Copyright (Hindi)
    'legal_copyright_text': '© २०२६ VoidPrakash. सर्वाधिकार सुरक्षित।',
    'legal_disclaimer_title': 'सत्यता अस्वीकरण',
    'legal_disclaimer_content': 'ऋषि की टिप्पणी एआई द्वारा मनोरंजन और दार्शनिक शिक्षा के लिए उत्पन्न की गई है। इसे शाब्दिक धार्मिक सिद्धांत के रूप में न लें।',
    'legal_rights_text': 'धर्मयात्रा - जन्म से पूर्णता की ओर।',
    'built_by_text': 'VoidPrakash द्वारा परिकल्पित एवं निर्मित।',
    'privacy_policy_label': 'गोपनीयता नीति',
    'terms_of_service_label': 'सेवा की शर्तें',

    // AI Settings (Hindi)
    'ai_settings_title': 'उन्नत एआई सेटिंग्स',
    'custom_api_key_placeholder': 'अपनी जेमिनी एपीआई कुंजी दर्ज करें...',
    'custom_api_key_help': 'दैनिक कोटा को दरकिनार करने और निरंतर ऋषि ज्ञान को सक्षम करने के लिए अपनी स्वयं की Google AI Studio कुंजी प्रदान करें।',
    'save_api_key_button': 'कुंजी सहेजें',
    'api_key_active_status': 'कस्टम कुंजी सक्रिय',
    'api_key_cleared_status': 'सिस्टम डिफ़ॉल्ट का उपयोग कर रहे हैं',
  },
  [Language.Sanskrit]: {
     ...englishTranslations,
    'app_title': 'धर्मयात्रा १००',
    'roll_dice': 'अक्षक्षेपणम्',
    'reset_game': 'पुनः आरम्भम्',
    'game_stats_button': 'क्रीडा सांख्यिकी',
    'global_stats_button': 'अग्रगण्यसूची',
    'language_switcher_label': 'भाषा:',
    'janma_label': 'जन्म',
    'poorna_label': 'पूर्ण',
    'winners_table_title': 'परिणामः',
    'rank_header': 'श्रेणी',
    'player_header': 'क्रीडकः',
    'throws_header': 'अक्षक्षेपणानि',
    'no_winners_yet': 'न कोऽपि क्रीडकः अद्यापि यात्रां समाप्तवान्।',
    'message_history_title': 'क्रीडावृत्तान्तः',
    'turn_history_title': 'वारवृत्तान्तः',
    'leaderboard_title': '🏆 अग्रगण्यसूची',
    'leaderboard_wins_format': '{count} विजयाः',
    'leaderboard_empty': 'कोऽपि न जयति।',
    'game_over_all_finished_title': 'यात्रा सम्पूर्णा!',
    'game_over_player_wins_title': '{winnerName} पूर्णतां गतः!',
    'game_over_title': 'यात्रा समाप्ता',
    'final_rankings_title': 'अन्तिमा श्रेणी',
    'background_uploader_title': 'पृष्ठभूमिः',
    'upload_background_button': 'चित्रं योजयतु',
    'clear_background_button': 'निष्कासयतु',
    'background_input_label': 'चित्रं चिनोतु',
    'player_position_trim_suffix': '{playerName} स्थानम्: ',
    'setup_class_label': 'वर्गः',
    'setup_starting_square': 'आरम्भस्थानम्',
    'setup_advanced_options': 'विशेषाः विकल्पाः',
  },
  [Language.Bengali]: { ...englishTranslations, 'app_title': 'ধর্মयात्रा ১০০', 'game_stats_button': 'খেলার পরিসংখ্যান', 'global_stats_button': 'লিডারবোর্ড', 'language_switcher_label': 'ভাষা:', 'player_position_trim_suffix': '{playerName}-এর অবস্থান: ', 'message_history_title': 'খেলার লগ', 'turn_history_title': 'পালা লগ', 'leaderboard_title': '🏆 লিডারবোর্ড', 'leaderboard_wins_format': '{count} জয়', 'leaderboard_empty': 'এখনও কোন বিজয়ী রেকর্ড করা হয়নি।', 'game_over_all_finished_title': 'যাত্রা সম্পন্ন!', 'game_over_player_wins_title': '{winnerName} পূর্ণতা লাভ করেছেন!', 'game_over_title': 'যাত্রা সমাপ্ত', 'final_rankings_title': 'চূড়ান্ত স্থান', 'background_uploader_title': 'কাস্টম পটভূমি', 'upload_background_button': 'ছবি আপলোড করুন', 'clear_background_button': 'সাফ করুন', 'background_input_label': 'পটভূমি চিত্র চয়ন করুন' },
  [Language.Tamil]: { ...englishTranslations, 'app_title': 'தர்மயாத்ரா 100', 'game_stats_button': 'விளையாட்டு புள்ளிவிவரங்கள்', 'global_stats_button': 'உலகளாவிய புள்ளிவிவரங்கள்', 'language_switcher_label': 'மொழி:', 'player_position_trim_suffix': '{playerName}இன் நிலை: ', 'message_history_title': 'விளையாட்டு பதிவு', 'turn_history_title': 'முறை பதிவு', 'leaderboard_title': '🏆 முன்னிலை வகிப்போர் பட்டியல்', 'leaderboard_wins_format': '{count} வெற்றிகள்', 'leaderboard_empty': 'வெற்றியாளர்கள் யாரும் இன்னும் பதிவு செய்யப்படவில்லை.', 'game_over_all_finished_title': 'பயணம் முடிந்தது!', 'game_over_player_wins_title': '{winnerName} பூரணத்தை அடைந்தார்!', 'game_over_title': 'யாத்திரை முடிகிறது', 'final_rankings_title': 'இறுதி தரவரிசை', 'background_uploader_title': 'தனிப்பயன் பின்னணி', 'upload_background_button': 'படத்தை பதிவேற்றவும்', 'clear_background_button': 'அழிக்கவும்', 'background_input_label': 'பின்னணி ಚಿತ್ರத்தை தேர்வு செய்யவும்' },
  [Language.Telugu]: { ...englishTranslations, 'app_title': 'ధర్మయాత్ర 100', 'game_stats_button': 'గేమ్ గణాంకాలు', 'global_stats_button': 'లీడర్‌బోర్డ్', 'language_switcher_label': 'భాష:', 'player_position_trim_suffix': '{playerName} గారి స్థానం: ', 'message_history_title': 'గేమ్ లాగ్', 'turn_history_title': 'టర్న్ లాగ్', 'leaderboard_title': '🏆 లీడర్‌బోర్డ్', 'leaderboard_wins_format': '{count} విజయాలు', 'leaderboard_empty': 'ఇప్పటివరకు విజేతలు నమోదు కాలేదు.', 'game_over_all_finished_title': 'యాత్ర పూర్తయింది!', 'game_over_player_wins_title': '{winnerName} పూర్ణత్వానికి చేరుకున్నారు!', 'game_over_title': 'యాత్ర ముగుస్తుంది', 'final_rankings_title': 'తుది ర్యాంకింగ్‌లు', 'background_uploader_title': 'అనుకూల నేపథ్యం', 'upload_background_button': 'చిత్రాన్ని అప్‌లోడ్ చేయండి', 'clear_background_button': 'క్లియర్ చేయండి', 'background_input_label': 'నేపథ్య చిత్రాన్ని ఎంచుకోండి' },
  [Language.Kannada]: { ...englishTranslations, 'app_title': 'ಧರ್ಮಯಾತ್ರಾ 100', 'game_stats_button': 'ಆಟದ ಅಂಕಿಅಂಶಗಳು', 'global_stats_button': 'ಲೀಡರ್‌ಬೋರ್ಡ್', 'language_switcher_label': 'ಭಾಷೆ:', 'player_position_trim_suffix': '{playerName} ಅವರ ಸ್ಥಾನ: ', 'message_history_title': 'ಆಟದ ಲಾಗ್', 'turn_history_title': 'ಟರ್న్ ಲಾಗ್', 'leaderboard_title': '🏆 ಲೀಡರ್‌ಬೋರ್ಡ್', 'leaderboard_wins_format': '{count} ಗೆಲುವುಗಳು', 'leaderboard_empty': 'ಯಾವುದೇ ವಿಜೇತರನ್ನು ಇನ್ನೂ ದಾಖಲಿಸಲಾಗಿಲ್ಲ.', 'game_over_all_finished_title': 'ಯಾತ್ರೆ ಪೂರ್ಣಗೊಂಡಿದೆ!', 'game_over_player_wins_title': '{winnerName} ಪೂರ್ಣತೆಯನ್ನು ತಲುಪಿದ್ದಾರೆ!', 'game_over_title': 'ಯಾತ್ರೆ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ', 'final_rankings_title': 'ಅಂತಿಮ ಶ್ರೇಯಾಂಕಗಳು', 'background_uploader_title': 'ಕಸ್ಟಮ್ ಹಿನ್ನೆಲೆ', 'upload_background_button': 'ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ', 'clear_background_button': 'ತೆರವುಗೊಳಿಸಿ', 'background_input_label': 'ಹಿನ್ನೆಲೆ ಚಿತ್ರವನ್ನು ಆರಿಸಿ' },
  [Language.Gujarati]: { ...englishTranslations, 'app_title': 'ધર્મયાત્રા ૧૦૦', 'game_stats_button': 'રમત આંકડા', 'global_stats_button': 'લીડરબોર્ડ', 'language_switcher_label': 'ભાષા:', 'player_position_trim_suffix': '{playerName}નું સ્થાન: ', 'message_history_title': 'ગેમ લોગ', 'turn_history_title': 'ટર્ન લોગ', 'leaderboard_title': '🏆 લીડરબોર્ડ', 'leaderboard_wins_format': '{count} જીત', 'leaderboard_empty': 'હજી સુધી કોઈ વિજેતાઓ નોંધાયા નથી.', 'game_over_all_finished_title': 'યાત્રા પૂર્ણ!', 'game_over_player_wins_title': '{winnerName} પૂર્ણતાએ પહોંચ્યા!', 'game_over_title': 'યાત્રા સમાપ્ત થાય છે', 'final_rankings_title': 'અંતિમ રેન્કિંગ', 'background_uploader_title': 'કસ્ટમ પૃષ્ઠભૂમિ', 'upload_background_button': 'છબી અપલોડ કરો', 'clear_background_button': 'સાફ કરો', 'background_input_label': 'પૃષ્ઠભૂમિ છબી પસંદ કરો' },
  [Language.Marathi]: { ...englishTranslations, 'app_title': 'धर्मयात्रा १००', 'game_stats_button': 'खेळ आकडेवारी', 'global_stats_button': 'लीडरबोर्ड', 'language_switcher_label': 'भाषा:', 'player_position_trim_suffix': '{playerName}ची स्थिती: ', 'message_history_title': 'खेळ लॉग', 'turn_history_title': 'खेळी लॉग', 'leaderboard_title': '🏆 लीडरबोर्ड', 'leaderboard_wins_format': '{count} विजय', 'leaderboard_empty': 'अद्याप कोणतेही विजेते नोंदलेले नाहीत.', 'game_over_all_finished_title': 'यात्रा पूर्ण!', 'game_over_player_wins_title': '{winnerName} पूर्णत्वास पोहोचले!', 'game_over_title': 'यात्रा समाप्त होते', 'final_rankings_title': 'अंतिम क्रमवारी', 'background_uploader_title': 'सानुकूल पार्श्वभूमी', 'upload_background_button': 'प्रतिमा अपलोड करा', 'clear_background_button': 'साफ करा', 'background_input_label': 'पार्श्वभूमी प्रतिमा निवडा' },
  [Language.Punjabi]: { ...englishTranslations, 'app_title': 'ਧਰਮਯਾਤਰਾ ੧੦੦', 'game_stats_button': 'ਖੇਡ ਅੰਕੜੇ', 'global_stats_button': 'ਲੀਡਰਬੋਰਡ', 'language_switcher_label': 'ਭਾਸ਼ਾ:', 'player_position_trim_suffix': '{playerName} ਦੀ ਸਥਿਤੀ: ', 'message_history_title': 'ਖੇਡ ਲਾਗ', 'turn_history_title': 'ਵਾਰੀ ਲਾਗ', 'leaderboard_title': '🏆 ਲੀਡਰਬੋਰਡ', 'leaderboard_wins_format': '{count} ਜਿੱਤਾਂ', 'leaderboard_empty': 'ਹੁਣ ਤੱਕ ਕੋਈ ਜੇਤੂ ਦਰਜ ਨਹੀਂ ਹੋਇਆ ਹੈ।', 'game_over_all_finished_title': 'ਯਾਤਰਾ ਸੰਪੂਰਨ!', 'game_over_player_wins_title': '{winnerName} ਪੂਰਨਤਾ ਤੇ ਪਹੁੰਚੇ!', 'game_over_title': 'ਯਾਤਰਾ ਸਮਾਪਤ ਹੁੰਦੀ ਹੈ', 'final_rankings_title': 'ਅੰਤਿਮ ਦਰਜਾਬੰਦੀ', 'background_uploader_title': 'ਕਸਟਮ ਬੈਕਗ੍ਰਾਉਂਡ', 'upload_background_button': 'ਚਿੱਤਰ ਅੱਪਲੋਡ ਕਰੋ', 'clear_background_button': 'ਸਾਫ਼ ਕਰੋ', 'background_input_label': 'ਬੈਕਗ੍ਰਾਉਂਡ ਸਾਫ਼ ਕਰੋ' },
};
