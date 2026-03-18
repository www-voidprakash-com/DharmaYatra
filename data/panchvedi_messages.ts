// data/panchvedi_messages.ts
// PanchVedi Dynamic Messaging — Tier 1 seed table
// Aligned to DharmaYatra's actual SNAKES_LADDERS_MAP, animals, and colors
// v2.0 — March 2026 · VoidPrakash

export type MomentFeel =
  | 'collective_exhaustion'
  | 'social_noise'
  | 'quiet_clarity'
  | 'inner_conflict'
  | 'curious_uncertainty'
  | 'festival_flow'
  | 'veteran_calm'
  | 'any';

export type EventType = 'ladder' | 'snake' | 'win' | 'start' | 'normal';

export interface PanchVediMessageSeed {
  box: string;           // Virtue/vice name e.g. 'Viveka', 'Moha'
  square?: number;       // Optional — link to exact square
  eventType: EventType;
  animal: string;        // Lowercase — matches animal_lion etc. (minus 'animal_' prefix)
  color: string;         // Lowercase — matches color_blue etc. (minus 'color_' prefix)
  moment_feel: MomentFeel;
  message: string;       // Uses {playerName}, {playerAnimalName}, {playerColorName}
}

// ─────────────────────────────────────────────────────────────────────────────
// LADDER SQUARES — Dharma / Virtues
// ─────────────────────────────────────────────────────────────────────────────

export const PANCHVEDI_MESSAGE_SEEDS: PanchVediMessageSeed[] = [

  // VIVEKA (Wisdom) — Square 4 → 14
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'lion', color: 'red', moment_feel: 'any',
    message: '{playerName}, your {playerColorName} Lion has always had fire — but Viveka gives that flame a direction. Ascend with knowing.' },
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: 'The Blue Elephant remembers every path. {playerName}, Viveka is simply that memory made conscious. Climb.' },
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: '{playerName}, wisdom is the Peacock\'s truest dance — more profound than any display. Step higher.' },
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'horse', color: 'green', moment_feel: 'any',
    message: 'The Green Horse gallops fast, {playerName} — but Viveka tells it when to gallop and when to be still. Rise.' },
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'deer', color: 'yellow', moment_feel: 'any',
    message: '{playerName}, even the gentle Yellow Deer knows when to move and when to be quiet. That is Viveka. Ascend.' },
  { box: 'Viveka', square: 4, eventType: 'ladder', animal: 'tiger', color: 'pink', moment_feel: 'any',
    message: 'The Pink Tiger who chooses wisdom over force is unstoppable, {playerName}. This ladder is yours.' },

  // SHRADDHA (Faith) — Square 9 → 31
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: 'Shraddha lifts the Blue Elephant of {playerName} higher — faith is the oldest kind of gravity, pulling upward.' },
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'deer', color: 'yellow', moment_feel: 'collective_exhaustion',
    message: '{playerName}, when the world grows tired, the Yellow Deer just keeps moving with quiet faith. Shraddha carries you.' },
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'lion', color: 'red', moment_feel: 'any',
    message: 'Even a Red Lion must sometimes trust the path without seeing the end. That is Shraddha, {playerName}. Climb.' },
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse does not doubt the field — it runs. That is Shraddha. Ascend.' },
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'tiger', color: 'purple', moment_feel: 'any',
    message: 'The Purple Tiger who leaps without seeing the other side is practicing Shraddha, {playerName}. Well done.' },
  { box: 'Shraddha', square: 9, eventType: 'ladder', animal: 'peacock', color: 'pink', moment_feel: 'any',
    message: 'Faith is the Peacock\'s hidden feather, {playerName} — you don\'t always need to show what carries you. Rise.' },

  // DANA (Generosity) — Square 20 → 38
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: 'The Blue Elephant gives water to the forest and the forest gives it shade. {playerName}, Dana always returns. Ascend.' },
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'deer', color: 'yellow', moment_feel: 'festival_flow',
    message: '{playerName}, the Yellow Deer shares freely during the festival of giving. Dana elevates you — 20 to 38!' },
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'lion', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Lion who gives from strength — not fear — is practicing the deepest Dana. Rise.' },
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: 'The Purple Peacock who displays its beauty for others, not itself — that is Dana, {playerName}. Climb high.' },
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'horse', color: 'green', moment_feel: 'any',
    message: 'Generosity is the horse that never tires, {playerName}. Your {playerColorName} energy rises with Dana\'s ladder.' },
  { box: 'Dana', square: 20, eventType: 'ladder', animal: 'tiger', color: 'pink', moment_feel: 'any',
    message: '{playerName}, even the Tiger rests its strength in service. Dana lifts the Pink Tiger upward today.' },

  // SANTOSHA (Contentment) — Square 21 → 42
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'lion', color: 'yellow', moment_feel: 'any',
    message: '{playerName}, the Yellow Lion who rests in enough is mightier than one who always hunts. Santosha lifts you.' },
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'elephant', color: 'green', moment_feel: 'quiet_clarity',
    message: 'In this quiet moment, {playerName}, the Green Elephant finds Santosha — and the ladder appears. Peace is power.' },
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'deer', color: 'blue', moment_feel: 'any',
    message: '{playerName}, the Blue Deer grazes only what it needs. That contentment carries it upward. Santosha.' },
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: 'The Purple Peacock finds its deepest beauty in stillness, not display, {playerName}. That is Santosha. Ascend.' },
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'horse', color: 'pink', moment_feel: 'any',
    message: '{playerName}, even the Horse knows when to rest in the meadow. Santosha — and a ladder appears.' },
  { box: 'Santosha', square: 21, eventType: 'ladder', animal: 'tiger', color: 'red', moment_feel: 'any',
    message: 'The Red Tiger today does not hunt. It simply is. That, {playerName}, is Santosha — and it lifts you to 42.' },

  // KARUNA (Compassion) — Square 28 → 84
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'collective_exhaustion',
    message: '{playerName}, in a world of exhaustion the Blue Elephant\'s compassion becomes an anchor for all. Karuna carries you far — to 84.' },
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: 'The Pink Deer moves gently through the world, harming none. Karuna recognizes this, {playerName}. A great leap — 28 to 84.' },
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'lion', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Lion who protects the weak carries the greatest warrior heart. Karuna sends you soaring.' },
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: 'The Purple Peacock cries for the pain of others and dances to lift their spirit. {playerName}, Karuna sees you. Rise to 84.' },
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'horse', color: 'yellow', moment_feel: 'any',
    message: '{playerName}, the Yellow Horse carries others without complaint. That is Karuna — and today it grants you wings.' },
  { box: 'Karuna', square: 28, eventType: 'ladder', animal: 'tiger', color: 'red', moment_feel: 'any',
    message: 'The Red Tiger who uses its strength to shelter, not dominate — that is Karuna, {playerName}. Leap to 84.' },

  // MAITRI (Loving-kindness) — Square 51 → 68
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: '{playerName}, the Purple Peacock spreads Maitri like its feathers — wide, beautiful, unconditional. You rise.' },
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: 'Maitri is the Pink Deer\'s natural state, {playerName} — kindness without hesitation. The ladder is yours.' },
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: '{playerName}, the Blue Elephant\'s loving-kindness is so vast it holds entire forests. Maitri lifts you to 68.' },
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'lion', color: 'yellow', moment_feel: 'festival_flow',
    message: '{playerName}, in this joyful energy, the Yellow Lion\'s warmth is infectious. Maitri recognizes the heart behind the roar.' },
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'horse', color: 'green', moment_feel: 'any',
    message: 'The Green Horse carries riders and never resents the weight. That is Maitri, {playerName}. Ascend.' },
  { box: 'Maitri', square: 51, eventType: 'ladder', animal: 'tiger', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Tiger showing Maitri is the universe\'s greatest paradox — and its deepest truth. Rise to 68.' },

  // KSHAMA (Forgiveness) — Square 71 → 91
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'elephant', color: 'blue', moment_feel: 'inner_conflict',
    message: '{playerName}, the Blue Elephant holds no grudges — its blue is the color of the sky: wide, forgiving, boundless. Kshama lifts you to 91.' },
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'deer', color: 'yellow', moment_feel: 'any',
    message: 'The Yellow Deer forgives the wolf that chased it — and moves on. {playerName}, that is Kshama. A golden leap to 91.' },
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'lion', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Lion who can forgive is more powerful than any lion who cannot let go. Kshama — 71 to 91.' },
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: 'The Purple Peacock who forgives the rain for ruining its dance still dances in the sun. {playerName}, Kshama elevates.' },
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse that forgives the rough terrain is the one that runs the farthest. Kshama lifts you.' },
  { box: 'Kshama', square: 71, eventType: 'ladder', animal: 'tiger', color: 'pink', moment_feel: 'any',
    message: 'A Tiger who forgives does not become prey — it becomes wise, {playerName}. Kshama is the highest strength. Rise to 91.' },

  // MOKSHA (Wholeness) — Square 80 → 100
  { box: 'Moksha', square: 80, eventType: 'ladder', animal: 'any' as any, color: 'any' as any, moment_feel: 'any',
    message: '{playerName}, the final ladder appears — not as a reward for perfection, but as recognition that you were always whole. Moksha.' },

  // ─────────────────────────────────────────────────────────────────────────────
  // SNAKE SQUARES — Adharma / Vices
  // ─────────────────────────────────────────────────────────────────────────────

  // MOHA (Delusion) — Square 17 → 7
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'tiger', color: 'red', moment_feel: 'social_noise',
    message: '{playerName}, even the Red Tiger can mistake the reflection in still water for prey. Moha is powerful noise. Return and see clearly.' },
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: 'The Purple Peacock sometimes mistakes a mirror for a competitor, {playerName}. Moha. The snake asks: what were you really chasing?' },
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse galloped fast — but toward a mirage. Moha caught the speed. Rest now, then see.' },
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'deer', color: 'yellow', moment_feel: 'curious_uncertainty',
    message: '{playerName}, curiosity without clarity is Moha. The Yellow Deer froze before a shadow. Breathe. Look again.' },
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: 'Even the Blue Elephant\'s calm memory can be clouded, {playerName}. Moha. The descent is the teacher here.' },
  { box: 'Moha', square: 17, eventType: 'snake', animal: 'lion', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Lion confused fondness for truth. That is Moha. The snake is kind — it returns you to ground.' },

  // LOBHA (Greed) — Square 54 → 34
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'tiger', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Tiger hunted beyond hunger. Lobha. The jungle always corrects excess — and so does this square.' },
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse ate the entire meadow and now finds itself at 34. Lobha. Enough was already a feast.' },
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'lion', color: 'yellow', moment_feel: 'any',
    message: 'Lobha tempted the Yellow Lion with gold it could not carry, {playerName}. What you truly need weighs less. Descend and recalibrate.' },
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: '{playerName}, the Purple Peacock wanted every stage to itself. Lobha. Beauty shared multiplies. Return and remember.' },
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'elephant', color: 'blue', moment_feel: 'collective_exhaustion',
    message: '{playerName}, even the Blue Elephant cannot hold more water than its body allows. Lobha. The descent is not a loss — it is a reset.' },
  { box: 'Lobha', square: 54, eventType: 'snake', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: 'The Pink Deer ran toward every glittering thing, {playerName}. Lobha caught it. The forest has enough beauty — breathe it without taking.' },

  // MADA (Arrogance) — Square 62 → 19
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'lion', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Lion roared so loudly it stopped listening. Mada. Greatness needs no announcement — the snake is the reminder.' },
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'tiger', color: 'purple', moment_feel: 'any',
    message: 'The Purple Tiger believed its color made it untouchable, {playerName}. Mada is the great equalizer. Descend to 19.' },
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'peacock', color: 'blue', moment_feel: 'social_noise',
    message: '{playerName}, in the noise the Blue Peacock forgot that beauty must be gracious. Mada. A humble heart is the finest display.' },
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse moved too fast to notice others on the path. Mada. Slow descents teach better than fast climbs.' },
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'elephant', color: 'yellow', moment_feel: 'any',
    message: '{playerName}, the Yellow Elephant stood so tall it stopped bowing to rivers. Mada. The snake reminds: even mountains were once dust.' },
  { box: 'Mada', square: 62, eventType: 'snake', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Deer grew proud of its grace and stumbled. Mada. True grace doesn\'t know it is graceful.' },

  // ASAKTI (Attachment) — Square 67 → 23
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'inner_conflict',
    message: '{playerName}, the Purple Peacock clutched its feathers so tight it couldn\'t dance. Asakti. What must you release to rise again?' },
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'deer', color: 'yellow', moment_feel: 'any',
    message: 'The Yellow Deer returned to the same grove again and again, {playerName}. Asakti. The world has infinite forests — let go and explore.' },
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: '{playerName}, the Blue Elephant carries memories of waters long dried. Asakti. Even the deepest memory must sometimes flow forward.' },
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'lion', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Lion refused to leave the territory it had outgrown. Asakti. Growth asks you to leave the den that held you.' },
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'horse', color: 'green', moment_feel: 'any',
    message: 'The Green Horse kept circling the same green field, {playerName}. Asakti. New pastures wait — but only for those who unhook the gate.' },
  { box: 'Asakti', square: 67, eventType: 'snake', animal: 'tiger', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Tiger held to its prey long after the hunt. Asakti. The snake is asking you to open your paws.' },

  // KAMA (Excessive Desire) — Square 87 → 24
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'tiger', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Tiger at square 87 burned bright — but Kama burns everything eventually. Cool down at 24 and want wisely.' },
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'horse', color: 'yellow', moment_feel: 'curious_uncertainty',
    message: 'The Yellow Horse galloped after every glittering possibility, {playerName}. Kama. The art is not in wanting less — it is in wanting what is real.' },
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: '{playerName}, the Purple Peacock wanted every eye on it. But Kama distorts visibility. Descend to 24 and shine with intention.' },
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'lion', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Lion craved so deeply it forgot what it already had. Kama. The snake\'s gift is clarity about what actually nourishes.' },
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'deer', color: 'blue', moment_feel: 'any',
    message: '{playerName}, even the Blue Deer\'s gentle heart gets swept by Kama when it lingers too long at the riverbank of desire.' },
  { box: 'Kama', square: 87, eventType: 'snake', animal: 'elephant', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Elephant wanted the entire jungle\'s water. Kama. The snake teaches: drink deep, not endlessly.' },

  // MATSARYA (Jealousy) — Square 93 → 73
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'social_noise',
    message: '{playerName}, the Purple Peacock lost itself comparing feathers with others\'. Matsarya. Your path is singular — no other Peacock walks it.' },
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'tiger', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Tiger watched the other hunters and forgot its own prey. Matsarya. Look at your own track — it is more interesting.' },
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'horse', color: 'red', moment_feel: 'any',
    message: '{playerName}, the Red Horse envied the faster one and slowed itself with watching. Matsarya. Race only with yesterday\'s version of you.' },
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'lion', color: 'blue', moment_feel: 'any',
    message: '{playerName}, the Blue Lion measured its roar against another\'s. Matsarya. There is no roar worthier than your own authentic one.' },
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'deer', color: 'yellow', moment_feel: 'any',
    message: 'The Yellow Deer watched a leaping gazelle and felt small, {playerName}. Matsarya. But no gazelle is you — and only you can run your Yatra.' },
  { box: 'Matsarya', square: 93, eventType: 'snake', animal: 'elephant', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Elephant\'s jealousy made it forget how much memory it carries. Matsarya. Your gifts are incomparable — literally.' },

  // AHANKARA (Ego) — Square 95 → 75
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'lion', color: 'red', moment_feel: 'social_noise',
    message: '{playerName}, even a Red Lion at 95 can roar too loud in the chaos. Ahankara. This square asks for a whisper, not a war cry.' },
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'tiger', color: 'purple', moment_feel: 'any',
    message: '{playerName}, the Purple Tiger confused its stripes for its entire identity. Ahankara. Who are you without the pattern? Go find out at 75.' },
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'peacock', color: 'blue', moment_feel: 'any',
    message: 'The Blue Peacock\'s ego forgot that the sky is also blue — and the sky doesn\'t try, {playerName}. Ahankara. Return and be the sky.' },
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'horse', color: 'green', moment_feel: 'any',
    message: '{playerName}, the Green Horse told every field it was the fastest. Ahankara. Speed proves itself in the running, not the telling.' },
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'elephant', color: 'yellow', moment_feel: 'any',
    message: 'The Yellow Elephant stood tall proclaiming its height, {playerName}. Ahankara asks: if no one is watching, are you still great?' },
  { box: 'Ahankara', square: 95, eventType: 'snake', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Deer\'s ego made it believe only its grace mattered. Ahankara. The forest values the deer that also listens.' },

  // KRODHA (Anger) — Square 98 → 79
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'tiger', color: 'red', moment_feel: 'inner_conflict',
    message: '{playerName}, the Red Tiger at 98 — so close to the end — let Krodha ignite. Heat forges, but only when directed. Return to 79 and reforge.' },
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'lion', color: 'yellow', moment_feel: 'any',
    message: '{playerName}, the Yellow Lion\'s roar at 98 scorched the path. Krodha. The flame that is mastered becomes lantern, not wildfire.' },
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'horse', color: 'red', moment_feel: 'any',
    message: 'The Red Horse at 98 — 2 squares from Poorna — kicked over the gate with Krodha, {playerName}. Breathe. Return. The gate opens inward.' },
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'peacock', color: 'purple', moment_feel: 'any',
    message: '{playerName}, the Purple Peacock raged at the clouds for blocking its display. Krodha. Anger at what is outside cannot change what is inside.' },
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'elephant', color: 'blue', moment_feel: 'any',
    message: 'The Blue Elephant\'s calm finally broke at 98, {playerName}. Krodha. Even the deepest lake can be disturbed — and must then settle again.' },
  { box: 'Krodha', square: 98, eventType: 'snake', animal: 'deer', color: 'pink', moment_feel: 'any',
    message: '{playerName}, the Pink Deer startled and bolted at 98, undone by Krodha. Gentleness is not weakness — but panic is. Return carefully.' },

  // ─────────────────────────────────────────────────────────────────────────────
  // SPECIAL EVENTS
  // ─────────────────────────────────────────────────────────────────────────────

  // WIN / MOKSHA
  { box: 'Poorna', square: 100, eventType: 'win', animal: 'any' as any, color: 'any' as any, moment_feel: 'any',
    message: '{playerName}, you have reached Poorna. The Yatra was never about the destination — it was about every roll, every snake, every ladder. You are whole.' },
  { box: 'Poorna', square: 100, eventType: 'win', animal: 'elephant', color: 'blue', moment_feel: 'veteran_calm',
    message: '{playerName}, the Blue Elephant remembered every square, every stumble, every ascent — and now stands at Poorna. This is not the end. This is recognition.' },
  { box: 'Poorna', square: 100, eventType: 'win', animal: 'lion', color: 'red', moment_feel: 'any',
    message: 'The Red Lion\'s fire finally illuminates, not burns, {playerName}. Poorna is the moment the warrior becomes the sage.' },

  // VETERAN / RETURNING PLAYER START
  { box: 'Janma', square: 1, eventType: 'start', animal: 'any' as any, color: 'any' as any, moment_feel: 'veteran_calm',
    message: '{playerName}, the Yatra calls again. But this time you carry the memory of every snake you\'ve faced and every ladder you\'ve climbed. Begin with wisdom.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Moment-feel resolver — maps DharmaYatra session state to a moment-feel label
// Call this before rendering any PanchVedi message
// ─────────────────────────────────────────────────────────────────────────────
export function resolveMomentFeel(params: {
  consecutiveWins?: number;
  isFirstTurn?: boolean;
  recentSnakeCount?: number;  // snakes hit in last 5 turns
  hourOfDay?: number;         // 0-23, optional
}): MomentFeel {
  const { consecutiveWins = 0, isFirstTurn = false, recentSnakeCount = 0, hourOfDay } = params;

  if (consecutiveWins >= 3) return 'veteran_calm';
  if (isFirstTurn) return 'curious_uncertainty';
  if (recentSnakeCount >= 3) return 'inner_conflict';
  if (hourOfDay !== undefined) {
    if (hourOfDay >= 22 || hourOfDay < 5) return 'quiet_clarity';
    if (hourOfDay >= 17 && hourOfDay < 22) return 'festival_flow';
    if (hourOfDay >= 7 && hourOfDay < 10) return 'quiet_clarity';
  }
  return 'any'; // Default: any/wildcard
}

// ─────────────────────────────────────────────────────────────────────────────
// PanchVedi message lookup — Tier 1 retrieval with fallback chain
// ─────────────────────────────────────────────────────────────────────────────
export function getPanchVediMessage(params: {
  boxName: string;
  eventType: EventType;
  playerName: string;
  playerAnimal: string;   // e.g. 'lion' (from animal_lion key, minus prefix)
  playerColor: string;    // e.g. 'red' (from color_red key, minus prefix)
  playerAnimalName: string; // Display name e.g. 'Lion'
  playerColorName: string;  // Display name e.g. 'Red'
  momentFeel?: MomentFeel;
  square?: number;
}): string | null {
  const { boxName, eventType, playerName, playerAnimal, playerColor,
          playerAnimalName, playerColorName, momentFeel = 'any', square } = params;

  const box = boxName.toLowerCase();
  const animal = playerAnimal.toLowerCase();
  const color = playerColor.toLowerCase();
  const feel = momentFeel;

  const applyReplacements = (msg: string) =>
    msg
      .replace(/{playerName}/g, playerName)
      .replace(/{playerAnimalName}/g, playerAnimalName)
      .replace(/{playerColorName}/g, playerColorName);

  // Chain 1: Exact match — box + eventType + animal + color + moment_feel
  let match = PANCHVEDI_MESSAGE_SEEDS.find(s =>
    s.box.toLowerCase() === box &&
    s.eventType === eventType &&
    (s.animal === animal || (s.animal as any) === 'any') &&
    (s.color === color || (s.color as any) === 'any') &&
    (s.moment_feel === feel || s.moment_feel === 'any')
  );

  // Chain 2: box + eventType + animal (drop color/feel specificity)
  if (!match) {
    match = PANCHVEDI_MESSAGE_SEEDS.find(s =>
      s.box.toLowerCase() === box &&
      s.eventType === eventType &&
      (s.animal === animal || (s.animal as any) === 'any')
    );
  }

  // Chain 3: box + eventType (fully generic)
  if (!match) {
    match = PANCHVEDI_MESSAGE_SEEDS.find(s =>
      s.box.toLowerCase() === box &&
      s.eventType === eventType
    );
  }

  return match ? applyReplacements(match.message) : null;
}
