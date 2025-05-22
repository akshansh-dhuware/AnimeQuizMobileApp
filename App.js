import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { Audio } from 'expo-av';

// --- NEW CONSTANT FOR NUMBER OF QUESTIONS PER SESSION ---
const NUM_QUESTIONS_PER_SESSION = 10;

// All available quiz questions (80 unique questions with explanations)
const questions = [
  {
    question: "In 'Attack on Titan', what is Eren Jaeger's Titan ability called, allowing him to control other Titans?",
    options: ["Colossal Titan", "Armored Titan", "Founding Titan", "Attack Titan"],
    correctAnswer: "Founding Titan",
    explanation: "Eren possesses the Founding Titan, which grants him the ability to control other Titans, though he often needs a Titan of royal blood to fully utilize it."
  },
  {
    question: "What is the name of the main protagonist in 'One Piece' who aims to become the Pirate King?",
    options: ["Roronoa Zoro", "Monkey D. Luffy", "Sanji", "Portgas D. Ace"],
    correctAnswer: "Monkey D. Luffy",
    explanation: "Monkey D. Luffy, a rubber man, leads the Straw Hat Pirates with the goal of finding the One Piece treasure and becoming the Pirate King."
  },
  {
    question: "Which anime features a Shinigami (Soul Reaper) who helps guide spirits and fight Hollows?",
    options: ["Naruto", "Dragon Ball Z", "Bleach", "One Punch Man"],
    correctAnswer: "Bleach",
    explanation: "Bleach follows Ichigo Kurosaki, who becomes a substitute Soul Reaper and fights against evil spirits called Hollows."
  },
  {
    question: "What is the name of the powerful energy currency in 'Hunter x Hunter' that Nen users manipulate?",
    options: ["Ki", "Chakra", "Nen", "Reiatsu"],
    correctAnswer: "Nen",
    explanation: "In Hunter x Hunter, Nen is a technique that allows a living being to manipulate their own life energy (aura) for various abilities."
  },
  {
    question: "In 'My Hero Academia', what is the name of the superhuman ability that most people possess?",
    options: ["Alchemy", "Jutsu", "Quirk", "Ki"],
    correctAnswer: "Quirk",
    explanation: "Quirks are unique superpowers that began appearing in the population, with Izuku Midoriya initially being one of the rare Quirkless individuals."
  },
  {
    question: "Which anime is set in a world where alchemy is a widely practiced science, but banned for human transmutation?",
    options: ["Soul Eater", "Fairy Tail", "Black Clover", "Fullmetal Alchemist"],
    correctAnswer: "Fullmetal Alchemist",
    explanation: "Fullmetal Alchemist follows the Elric brothers, Edward and Alphonse, who use alchemy but seek the Philosopher's Stone after a failed human transmutation attempt."
  },
  {
    question: "What unique power does the protagonist, Eren Yeager, primarily possess in 'Attack on Titan'?",
    options: ["Ice Manipulation", "Titan Shifting", "Super Speed", "Telekinesis"],
    correctAnswer: "Titan Shifting",
    explanation: "Eren's primary ability is to transform into a 15-meter Attack Titan, and later gains control over other Titan powers."
  },
  {
    question: "In 'Dragon Ball Z', what is the ultimate martial arts technique that Goku learns from King Kai?",
    options: ["Kamehameha", "Spirit Bomb", "Destructo Disc", "Instant Transmission"],
    correctAnswer: "Spirit Bomb",
    explanation: "The Spirit Bomb (Genki Dama) is a powerful attack where Goku gathers life energy from all living beings into a massive sphere."
  },
  {
    question: "What is the name of the virtual reality MMORPG where Kirito gets trapped in 'Sword Art Online'?",
    options: ["Alfheim Online", "Gun Gale Online", "Sword Art Online", "Underworld"],
    correctAnswer: "Sword Art Online",
    explanation: "The first arc of Sword Art Online takes place within the titular VRMMORPG, where players cannot log out until they clear all 100 floors of Aincrad."
  },
  {
    question: "Which anime features a high school student named Light Yagami who finds a supernatural notebook?",
    options: ["Code Geass", "Death Note", "Psycho-Pass", "Erased"],
    correctAnswer: "Death Note",
    explanation: "Light Yagami discovers the Death Note, a notebook that allows him to kill anyone by writing their name in it."
  },
  {
    question: "In 'Demon Slayer: Kimetsu no Yaiba', what is the primary weapon used by Demon Slayers?",
    options: ["Katana", "Nichirin Blade", "Scythe", "Chainsaw"],
    correctAnswer: "Nichirin Blade",
    explanation: "Demon Slayers wield Nichirin Blades, which are swords forged from a unique ore that changes color according to its owner and are effective against demons."
  },
  {
    question: "Who is known as the 'Strongest Hero' in 'One-Punch Man'?",
    options: ["Genos", "Saitama", "Mumen Rider", "King"],
    correctAnswer: "Saitama",
    explanation: "Saitama is the protagonist of One-Punch Man, capable of defeating any enemy with a single punch, leading to his overwhelming boredom."
  },
  {
    question: "What is the name of the magical school where Harry Potter-like adventures take place in 'Little Witch Academia'?",
    options: ["Hogwarts", "Luna Nova Magical Academy", "Cross Academy", "True Cross Academy"],
    correctAnswer: "Luna Nova Magical Academy",
    explanation: "Luna Nova Magical Academy is the prestigious school for witches where Atsuko 'Akko' Kagari enrolls to become a witch like her idol, Shiny Chariot."
  },
  {
    question: "In 'Naruto', what is the name of the powerful tailed beast sealed within Naruto Uzumaki?",
    options: ["Shukaku", "Gyuki", "Kurama", "Matatabi"],
    correctAnswer: "Kurama",
    explanation: "Kurama, also known as the Nine-Tails, is a powerful fox-like tailed beast sealed within Naruto, granting him immense chakra and power."
  },
  {
    question: "Which anime follows a group of mages in the Fairy Tail Guild who take on various quests?",
    options: ["Black Clover", "Seven Deadly Sins", "Fairy Tail", "Magi"],
    correctAnswer: "Fairy Tail",
    explanation: "Fairy Tail is a popular anime about a guild of mages known for their destructive power and strong bonds of friendship."
  },
  {
    question: "What is the primary goal of the protagonist, Gon Freecss, in 'Hunter x Hunter'?",
    options: ["To become a Hokage", "To find his father", "To collect all the Dragon Balls", "To defeat all Titans"],
    correctAnswer: "To find his father",
    explanation: "Gon's main objective is to become a Hunter and find his father, Ging Freecss, who is a legendary Hunter."
  },
  {
    question: "In 'Code Geass', what is the supernatural power that Lelouch vi Britannia gains?",
    options: ["Sharingan", "Geass", "Quirk", "Nen"],
    correctAnswer: "Geass",
    explanation: "Lelouch obtains the Geass, a power that allows him to command anyone to do anything, once per person, by making eye contact."
  },
  {
    question: "Which anime features a boy named Tanjiro Kamado who becomes a Demon Slayer to avenge his family?",
    options: ["Jujutsu Kaisen", "Fire Force", "Demon Slayer: Kimetsu no Yaiba", "Chainsaw Man"],
    correctAnswer: "Demon Slayer: Kimetsu no Yaiba",
    explanation: "Tanjiro's family is slaughtered by demons, and his sister Nezuko is turned into a demon, leading him to join the Demon Slayer Corps."
  },
  {
    question: "What is the name of the currency used in the world of 'Dragon Ball Z'?",
    options: ["Yen", "Zeni", "Dollars", "Credits"],
    correctAnswer: "Zeni",
    explanation: "Zeni is the fictional currency used throughout the Dragon Ball universe."
  },
  {
    question: "In 'Tokyo Ghoul', what are the human-like creatures that feed on human flesh called?",
    options: ["Vampires", "Zombies", "Ghouls", "Demons"],
    correctAnswer: "Ghouls",
    explanation: "Ghouls are carnivorous and can only feed on humans and other ghouls, living in secret among human society."
  },
  {
    question: "Which anime explores a dystopian future where a system called the 'Sibyl System' judges people's criminal intent?",
    options: ["Ghost in the Shell", "Ergo Proxy", "Psycho-Pass", "Akira"],
    correctAnswer: "Psycho-Pass",
    explanation: "Psycho-Pass is set in a future Japan where the Sibyl System objectively measures the public's mental state, known as their 'Psycho-Pass', to determine their criminal potential."
  },
  {
    question: "What is the name of the main antagonist and leader of the Akatsuki in 'Naruto Shippuden'?",
    options: ["Orochimaru", "Madara Uchiha", "Pain (Nagato)", "Obito Uchiha"],
    correctAnswer: "Pain (Nagato)",
    explanation: "Nagato, using the alias Pain, serves as the primary leader of the Akatsuki during much of Naruto Shippuden, controlling six different bodies."
  },
  {
    question: "In 'One Piece', what is the name of the special fruit that grants the user superhuman abilities, but takes away their ability to swim?",
    options: ["Spirit Fruit", "Devil Fruit", "Magic Fruit", "Power Fruit"],
    correctAnswer: "Devil Fruit",
    explanation: "Devil Fruits are mystical fruits that grant the eater a unique superpower at the cost of their ability to swim."
  },
  {
    question: "Which anime features a boy named Izuku Midoriya who inherits the 'One For All' Quirk?",
    options: ["Black Clover", "Fire Force", "My Hero Academia", "Jujutsu Kaisen"],
    correctAnswer: "My Hero Academia",
    explanation: "Izuku Midoriya, born Quirkless, is chosen by the world's greatest hero, All Might, to inherit his powerful Quirk, One For All."
  },
  {
    question: "What is the name of the main character in 'Death Note' who finds the titular notebook?",
    options: ["L Lawliet", "Mello", "Near", "Light Yagami"],
    correctAnswer: "Light Yagami",
    explanation: "Light Yagami, a brilliant high school student, finds the Death Note and attempts to rid the world of criminals as 'Kira'."
  },
  {
    question: "In 'Jujutsu Kaisen', what is the name of the cursed energy that sorcerers use to fight curses?",
    options: ["Chakra", "Ki", "Nen", "Cursed Energy"],
    correctAnswer: "Cursed Energy",
    explanation: "Cursed Energy is born from negative emotions and is the power source for Jujutsu Sorcerers and Curses alike."
  },
  {
    question: "Which anime is about a genius high school student who becomes the world's greatest detective, known as L?",
    options: ["Detective Conan", "Death Note", "Psycho-Pass", "Monster"],
    correctAnswer: "Death Note",
    explanation: "L is the enigmatic, highly intelligent detective who takes on the task of catching the serial killer Kira in Death Note."
  },
  {
    question: "What is the name of the mysterious floating island where the protagonist, Haku, lives in 'Spirited Away'?",
    options: ["Laputa", "Aincrad", "The Spirit World", "Zentopia"],
    correctAnswer: "The Spirit World",
    explanation: "Haku is a spirit who helps Chihiro navigate the Spirit World, a realm inhabited by gods, spirits, and other mythical creatures."
  },
  {
    question: "In 'My Hero Academia', who is the Symbol of Peace and Izuku Midoriya's mentor?",
    options: ["Eraser Head", "Endeavor", "All Might", "Hawks"],
    correctAnswer: "All Might",
    explanation: "All Might is the previous No. 1 Pro Hero and the eighth user of the One For All Quirk, which he passes on to Izuku."
  },
  {
    question: "Which anime features a boy named Asta who aims to become the Wizard King despite having no magic?",
    options: ["Fairy Tail", "Black Clover", "Seven Deadly Sins", "Magi"],
    correctAnswer: "Black Clover",
    explanation: "Asta, born without magic in a world where everyone has it, strives to become the Wizard King by using anti-magic abilities from his grimoire."
  },
  {
    question: "What type of creature does San from 'Princess Mononoke' primarily associate herself with?",
    options: ["Wolves", "Bears", "Monkeys", "Boars"],
    correctAnswer: "Wolves",
    explanation: "San is a human girl raised by the wolf goddess Moro, and identifies herself as a wolf."
  },
  {
    question: "In 'Naruto', what is the name of Naruto's primary rival and best friend?",
    options: ["Kakashi Hatake", "Sakura Haruno", "Sasuke Uchiha", "Jiraiya"],
    correctAnswer: "Sasuke Uchiha",
    explanation: "Sasuke Uchiha is a member of Team 7 and Naruto's closest friend and fiercest rival, driven by a desire for revenge against his brother Itachi."
  },
  {
    question: "Which anime involves a world where people can become 'Witches' by forming contracts with magical creatures?",
    options: ["Madoka Magica", "Sailor Moon", "Cardcaptor Sakura", "Little Witch Academia"],
    correctAnswer: "Madoka Magica",
    explanation: "Puella Magi Madoka Magica explores the dark side of becoming a magical girl, as contracts with Kyubey turn them into 'Magical Girls' who must fight Witches."
  },
  {
    question: "What is the name of the protagonist in 'Mob Psycho 100' who possesses immense psychic powers?",
    options: ["Reigen Arataka", "Teruki Hanazawa", "Shigeo Kageyama (Mob)", "Dimple"],
    correctAnswer: "Shigeo Kageyama (Mob)",
    explanation: "Shigeo Kageyama, known as Mob, is a seemingly ordinary middle school boy with incredible psychic abilities that he tries to keep suppressed."
  },
  {
    question: "In 'Attack on Titan', what is the name of the elite military branch dedicated to exploring outside the walls and fighting Titans?",
    options: ["Garrison Regiment", "Military Police Regiment", "Survey Corps", "Training Corps"],
    correctAnswer: "Survey Corps",
    explanation: "The Survey Corps is the branch of the Military most actively engaged in direct combat and research of Titans, often venturing outside the walls."
  },
  {
    question: "Which anime features a young boy named Senku Ishigami who aims to rebuild civilization using science after humanity turns to stone?",
    options: ["Cells at Work!", "Dr. Stone", "Promised Neverland", "Fire Force"],
    correctAnswer: "Dr. Stone",
    explanation: "Dr. Stone is set in a world thousands of years after a mysterious phenomenon petrifies all of humanity, and Senku uses his scientific knowledge to revive civilization."
  },
  {
    question: "What is the primary way that demons are killed in 'Demon Slayer: Kimetsu no Yaiba'?",
    options: ["Holy Water", "Sunlight or Nichirin Blades", "Magic Spells", "Silver Bullets"],
    correctAnswer: "Sunlight or Nichirin Blades",
    explanation: "Demons are vulnerable to sunlight and can be decapitated by a Nichirin Blade, which absorbs sunlight."
  },
  {
    question: "Who is the main protagonist of 'JoJo's Bizarre Adventure: Stardust Crusaders'?",
    options: ["Joseph Joestar", "Jotaro Kujo", "Giorno Giovanna", "Johnny Joestar"],
    correctAnswer: "Jotaro Kujo",
    explanation: "Jotaro Kujo is the stoic and powerful Stand user and the main protagonist of the third part of JoJo's Bizarre Adventure."
  },
  {
    question: "In 'One Piece', what is the unique ability of Monkey D. Luffy, gained from eating a Devil Fruit?",
    options: ["Fire Manipulation", "Rubber Body", "Super Strength", "Teleportation"],
    correctAnswer: "Rubber Body",
    explanation: "Luffy ate the Gomu Gomu no Mi, turning his body into rubber, making him immune to blunt attacks and allowing him to stretch."
  },
  {
    question: "Which anime features a detective named Conan Edogawa, who is actually a high school student shrunk by poison?",
    options: ["Psycho-Pass", "Death Note", "Case Closed (Detective Conan)", "Kindaichi Case Files"],
    correctAnswer: "Case Closed (Detective Conan)",
    explanation: "Shinichi Kudo is poisoned by a mysterious organization, shrinking him into a child, and he adopts the alias Conan Edogawa to solve crimes."
  },
  {
    question: "What is the name of the special police force dedicated to fighting the Ghouls in 'Tokyo Ghoul'?",
    options: ["Soul Reapers", "Demon Slayers", "CCG (Commission of Counter Ghoul)", "Special Fire Force"],
    correctAnswer: "CCG (Commission of Counter Ghoul)",
    explanation: "The CCG is a federal agency that serves as the primary governing body in the ghoul world, investigating and eliminating ghouls."
  },
  {
    question: "In 'Fullmetal Alchemist', what is the core principle of alchemy, stating that to obtain something, something of equal value must be lost?",
    options: ["Law of Conservation", "Equivalent Exchange", "Alchemy Code", "Philosopher's Law"],
    correctAnswer: "Equivalent Exchange",
    explanation: "Equivalent Exchange is the fundamental law of alchemy, stating that 'Mankind cannot gain anything without first giving something in return.'"
  },
  {
    question: "Which anime features a character named Guts, wielding a massive sword, in a dark fantasy setting?",
    options: ["Claymore", "Berserk", "Goblin Slayer", "Vinland Saga"],
    correctAnswer: "Berserk",
    explanation: "Berserk is a dark fantasy series following Guts, a lone mercenary, and his struggles against demons and fate."
  },
  {
    question: "What is the name of the professional wrestling league where the protagonist, Ashita no Joe, competes?",
    options: ["World Boxing Association", "Japan Pro Wrestling", "Danpei's Gym", "Ashita no Joe's League"],
    correctAnswer: "Japan Pro Wrestling",
    explanation: "Ashita no Joe is a classic boxing anime where Joe Yabuki rises through the ranks of the professional boxing world in Japan."
  },
  {
    question: "In 'Sailor Moon', what is the name of the protagonist's magical cat companion who guides her?",
    options: ["Luna", "Artemis", "Diana", "Pusheen"],
    correctAnswer: "Luna",
    explanation: "Luna is a black cat who gives Usagi Tsukino (Sailor Moon) her powers and serves as her mentor."
  },
  {
    question: "Which anime follows a young man named Thorfinn, seeking revenge on his father's killer, in a Viking-era setting?",
    options: ["Berserk", "Attack on Titan", "Vinland Saga", "Dororo"],
    correctAnswer: "Vinland Saga",
    explanation: "Vinland Saga is a historical epic following Thorfinn's journey with a band of Vikings, consumed by the desire for revenge against Askeladd."
  },
  {
    question: "What is the main theme song for the anime 'Neon Genesis Evangelion'?",
    options: ["Guren no Yumiya", "A Cruel Angel's Thesis", "Tank!", "Unravel"],
    correctAnswer: "A Cruel Angel's Thesis",
    explanation: "'Zankoku na Tenshi no Thesis' (A Cruel Angel's Thesis) is the iconic opening theme song for Neon Genesis Evangelion."
  },
  {
    question: "In 'Cowboy Bebop', what is the name of the spaceship the main characters travel in?",
    options: ["Yamato", "Serenity", "Bebop", "Millennium Falcon"],
    correctAnswer: "Bebop",
    explanation: "The Bebop is the spaceship used by Spike, Jet, Faye, and Ed as they travel the solar system as bounty hunters."
  },
  {
    question: "Which anime features a futuristic setting where humans use specialized vehicles called 'Mobile Suits' for combat?",
    options: ["Robotech", "Code Geass", "Gundam", "Macross"],
    correctAnswer: "Gundam",
    explanation: "The Gundam franchise is famous for its massive humanoid mecha known as Mobile Suits, used extensively in warfare."
  },
  {
    question: "What is the name of the popular ramen shop that Naruto frequently visits in 'Naruto'?",
    options: ["Ichiraku Ramen", "Ramen Ichiban", "Naruto's Noodles", "Hidden Leaf Cafe"],
    correctAnswer: "Ichiraku Ramen",
    explanation: "Ichiraku Ramen is Naruto's favorite place to eat, and a significant location throughout the series."
  },
  {
    question: "In 'Your Name.', what celestial event causes the two protagonists to swap bodies?",
    options: ["Solar Eclipse", "Lunar Eclipse", "Comet Shower", "Meteor Shower"],
    correctAnswer: "Comet Shower",
    explanation: "The Tiamat Comet, which appears every 1,200 years, is responsible for the body-swapping phenomenon between Taki and Mitsuha."
  },
  {
    question: "Which anime follows a group of high school students who form a band called 'Ho-kago Tea Time'?",
    options: ["Love Live!", "K-On!", "The Melancholy of Haruhi Suzumiya", "Nana"],
    correctAnswer: "K-On!",
    explanation: "K-On! is a slice-of-life anime about four high school girls who join their school's Light Music Club and form a band."
  },
  {
    question: "What is the name of the organization that investigates supernatural occurrences in 'Bungo Stray Dogs'?",
    options: ["The Detective Agency", "Armed Detective Agency", "Special Abilities Division", "Port Mafia"],
    correctAnswer: "Armed Detective Agency",
    explanation: "The Armed Detective Agency consists of individuals with supernatural abilities who solve crimes too difficult for the police."
  },
  {
    question: "In 'Demon Slayer: Kimetsu no Yaiba', what is Nezuko's unique ability after becoming a demon?",
    options: ["Blood Demon Art", "Healing Factor", "Super Strength", "Telekinesis"],
    correctAnswer: "Blood Demon Art",
    explanation: "Nezuko's Blood Demon Art allows her to generate and manipulate demonic flames."
  },
  {
    question: "Which anime features a world where humanity is protected by three giant walls from monstrous creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    correctAnswer: "Attack on Titan",
    explanation: "Humans live within cities surrounded by three enormous walls (Maria, Rose, and Sina) to protect themselves from Titans."
  },
  {
    question: "What is the name of the main antagonist in 'Dragon Ball Super' who is a God of Destruction?",
    options: ["Frieza", "Cell", "Beerus", "Jiren"],
    correctAnswer: "Beerus",
    explanation: "Beerus is the God of Destruction of Universe 7, known for his love of food and immense power."
  },
  {
    question: "In 'One Piece', what is the name of Zoro's signature sword style?",
    options: ["Two-Sword Style", "Four-Sword Style", "Three-Sword Style", "One-Sword Style"],
    correctAnswer: "Three-Sword Style",
    explanation: "Roronoa Zoro fights using Santoryu, a unique sword style where he wields three katanas, one in each hand and one in his mouth."
  },
  {
    question: "Which anime features a high school student named Atsushi Nakajima who joins the Armed Detective Agency?",
    options: ["Durarara!!", "Noragami", "Bungo Stray Dogs", "Devil is a Part-Timer!"],
    correctAnswer: "Bungo Stray Dogs",
    explanation: "Atsushi, who can transform into a weretiger, is recruited by the Armed Detective Agency after being involved in a supernatural incident."
  },
  {
    question: "What is the name of the main organization of heroes in 'My Hero Academia'?",
    options: ["Justice League", "Pro Hero Association", "Hero Public Safety Commission", "Hero Agency"],
    correctAnswer: "Hero Public Safety Commission",
    explanation: "While there are many hero agencies, the Hero Public Safety Commission oversees and regulates all professional hero activities."
  },
  {
    question: "In 'Code Geass', what is the name of the organization that Lelouch forms to fight the Britannian Empire?",
    options: ["Black Knights", "Freedom Fighters", "Zero's Rebellion", "Red Resistance"],
    correctAnswer: "Black Knights",
    explanation: "Lelouch, under the guise of Zero, forms the Black Knights, a resistance organization dedicated to fighting the Holy Britannian Empire."
  },
  {
    question: "Which anime involves a scavenger girl named Alita who discovers a powerful cyborg body?",
    options: ["Ghost in the Shell", "Ergo Proxy", "Battle Angel Alita (Gunnm)", "Psycho-Pass"],
    correctAnswer: "Battle Angel Alita (Gunnm)",
    explanation: "Ido, a cybernetics doctor, finds Alita's head in a scrapyard and rebuilds her, leading her to discover her past as a legendary warrior."
  },
  {
    question: "What is the name of the virtual currency used in the world of 'Log Horizon'?",
    options: ["Gold", "Credits", "Delius", "Gil"],
    correctAnswer: "Delius",
    explanation: "Delius is the primary currency used by players and NPCs within the world of Elder Tale in Log Horizon."
  },
  {
    question: "In 'Re:Zero', what is Subaru Natsuki's unique ability that allows him to return from death?",
    options: ["Time Travel", "Return by Death", "Reset Button", "Immortality"],
    correctAnswer: "Return by Death",
    explanation: "Subaru's Return by Death ability allows him to rewind time to a certain checkpoint every time he dies, but he retains his memories."
  },
  {
    question: "Which anime features a protagonist who is a master strategist and plays mind games to win wars?",
    options: ["Sword Art Online", "No Game No Life", "Log Horizon", "Code Geass"],
    correctAnswer: "Code Geass",
    explanation: "Lelouch vi Britannia, using his Geass and genius intellect, devises complex strategies to defeat the Britannian Empire."
  },
  {
    question: "What is the name of the main character who collects and studies Yokai in 'Natsume's Book of Friends'?",
    options: ["Yato", "Izuku", "Natsume Takashi", "Eren"],
    correctAnswer: "Natsume Takashi",
    explanation: "Natsume Takashi possesses the ability to see Yokai and inherits the 'Book of Friends' from his grandmother, which allows him to control Yokai."
  },
  {
    question: "In 'Fire Force', what are the special individuals who can manipulate fire called?",
    options: ["Pyromancers", "Igniters", "Fire Soldiers", "Infernals"],
    correctAnswer: "Fire Soldiers",
    explanation: "Fire Soldiers are individuals with the ability to ignite and control flames, fighting against 'Infernals' (demonic fire creatures)."
  },
  {
    question: "Which anime is about high schoolers trapped in a game where they must kill each other to escape?",
    options: ["Danganronpa", "Mirai Nikki (Future Diary)", "Death Parade", "No Game No Life"],
    correctAnswer: "Danganronpa",
    explanation: "Danganronpa features elite high school students trapped in a school, forced to participate in a killing game by the bear Monokuma."
  },
  {
    question: "What is the name of the spiritual energy that Soul Reapers use in 'Bleach'?",
    options: ["Chakra", "Nen", "Reiatsu", "Ki"],
    correctAnswer: "Reiatsu",
    explanation: "Reiatsu is the physical pressure of a person's spiritual energy, used by Soul Reapers and other spiritual beings for abilities."
  },
  {
    question: "In 'Hunter x Hunter', what is the name of the main villain and leader of the Phantom Troupe?",
    options: ["Hisoka", "Illumi Zoldyck", "Chrollo Lucilfer", "Meruem"],
    correctAnswer: "Chrollo Lucilfer",
    explanation: "Chrollo Lucilfer is the charismatic and dangerous leader of the Phantom Troupe, a notorious group of thieves."
  },
  {
    question: "Which anime features a group of children escaping a seemingly idyllic orphanage after discovering a dark secret?",
    options: ["Made in Abyss", "Erased", "The Promised Neverland", "Devilman Crybaby"],
    correctAnswer: "The Promised Neverland",
    explanation: "The Promised Neverland follows Emma, Norman, and Ray as they uncover the truth about their orphanage being a farm to raise human children as food for demons."
  },
  {
    question: "What is the name of the virtual currency that forms the basis of the economy in 'No Game No Life'?",
    options: ["Yen", "Gold", "Unit", "Coin"],
    correctAnswer: "Unit",
    explanation: "In the world of Disboard, all conflicts and disputes are settled through games, with 'Units' being the currency traded as stakes."
  },
  {
    question: "In 'Fairy Tail', what is Natsu Dragneel's unique type of magic?",
    options: ["Ice Magic", "Celestial Spirit Magic", "Dragon Slayer Magic", "Requip Magic"],
    correctAnswer: "Dragon Slayer Magic",
    explanation: "Natsu is a Fire Dragon Slayer, a rare type of mage who uses fire magic granted by a dragon."
  },
  {
    question: "Which anime features a high school girl named Usagi Tsukino who transforms into a magical warrior?",
    options: ["Cardcaptor Sakura", "Madoka Magica", "Sailor Moon", "Precure"],
    correctAnswer: "Sailor Moon",
    explanation: "Usagi Tsukino becomes Sailor Moon, a warrior who fights evil and protects the solar system, guided by the talking cat Luna."
  },
  {
    question: "What is the name of the protagonist in 'Erased' who can travel back in time to prevent tragedies?",
    options: ["Okabe Rintarou", "Satoru Fujinuma", "Subaru Natsuki", "Shinji Ikari"],
    correctAnswer: "Satoru Fujinuma",
    explanation: "Satoru possesses an ability called 'Revival,' which sends him back in time just before a life-threatening incident occurs."
  },
  {
    question: "In 'Jujutsu Kaisen', who is the strongest Jujutsu Sorcerer, known for his Limitless technique?",
    options: ["Yuji Itadori", "Megumi Fushiguro", "Satoru Gojo", "Kento Nanami"],
    correctAnswer: "Satoru Gojo",
    explanation: "Satoru Gojo is an eccentric but incredibly powerful special-grade Jujutsu Sorcerer, renowned for his mastery of the Limitless technique."
  },
  {
    question: "Which anime revolves around a high school student named Reigen Arataka who is actually a fraud psychic, but has a powerful assistant?",
    options: ["One-Punch Man", "Mob Psycho 100", "Saiki K.", "Aggretsuko"],
    correctAnswer: "Mob Psycho 100",
    explanation: "Reigen Arataka is a con artist who runs a psychic consultation office, often relying on his powerful student, Shigeo 'Mob' Kageyama."
  },
  {
    question: "What is the name of the giant humanoid weapons used in 'Neon Genesis Evangelion' to fight Angels?",
    options: ["Gundams", "LFOs", "Evas (Evangelions)", "Megazords"],
    correctAnswer: "Evas (Evangelions)",
    explanation: "Evangelions are bio-mechanical mechas piloted by specially chosen children to combat monstrous beings known as Angels."
  },
  {
    question: "In 'Steins;Gate', what is the name of the device created by Okabe Rintarou that can send messages to the past?",
    options: ["Time Machine", "PhoneWave (name subject to change)", "Future Gadget", "Temporal Communicator"],
    correctAnswer: "PhoneWave (name subject to change)",
    explanation: "The PhoneWave, initially a bizarre invention, accidentally discovers the ability to send short messages (D-Mails) to the past."
  },
  {
    question: "Which anime features a girl named Chise Hatori who becomes an apprentice to a non-human sorcerer named Elias Ainsworth?",
    options: ["Ancient Magus' Bride", "Spice and Wolf", "Mushishi", "Noragami"],
    correctAnswer: "Ancient Magus' Bride",
    explanation: "Chise is bought at an auction by Elias Ainsworth, a powerful magus with a skull-like head, and becomes his apprentice and future bride."
  },
  {
    question: "What is the name of the dystopian city where the protagonist, Akane Tsunemori, works as an Enforcer in 'Psycho-Pass'?",
    options: ["Neo-Tokyo", "Shamballa", "Neo Kyoto", "Tokyo"],
    correctAnswer: "Tokyo",
    explanation: "Psycho-Pass is primarily set in a futuristic Tokyo, governed by the Sibyl System."
  },
  {
    question: "In 'Haikyuu!!', what high school volleyball team does Shoyo Hinata join?",
    options: ["Seijoh", "Shiratorizawa", "Karasuno", "Nekoma"],
    correctAnswer: "Karasuno",
    explanation: "Shoyo Hinata joins the Karasuno High School volleyball team, famously known as the 'Fallen Giants' or 'Flightless Crows'."
  },
  {
    question: "Which anime centers around a food-loving, laid-back high school student named Rintarou Okabe who discovers time travel?",
    options: ["Erased", "Re:Zero", "Steins;Gate", "The Melancholy of Haruhi Suzumiya"],
    correctAnswer: "Steins;Gate",
    explanation: "Okabe Rintarou, a self-proclaimed 'mad scientist', accidentally invents a time machine while experimenting with a microwave oven."
  },
  {
    question: "What is the name of the powerful martial arts technique that allows users to manipulate their life force in 'Jujutsu Kaisen'?",
    options: ["Ki", "Chakra", "Nen", "Cursed Energy"],
    correctAnswer: "Cursed Energy",
    explanation: "Cursed Energy is the very essence of Jujutsu Sorcery, allowing users to amplify their physical abilities and cast Jujutsu techniques."
  },
  {
    question: "In 'Dr. Stone', what material does Senku primarily use to revive petrified humans?",
    options: ["Water", "Sulfuric Acid", "Nitric Acid", "Nitric Acid and Alcohol"],
    correctAnswer: "Nitric Acid and Alcohol",
    explanation: "Senku discovers that a solution of nitric acid and alcohol is effective in reversing the petrification."
  },
  {
    question: "Which anime follows a protagonist named Yato, a minor deity, who grants wishes for 5 yen?",
    options: ["Noragami", "Mushishi", "Natsume's Book of Friends", "Kamisama Kiss"],
    correctAnswer: "Noragami",
    explanation: "Yato is a stray god striving to gain enough worshippers to have his own shrine, offering his services for a small fee."
  },
  {
    question: "What is the name of the main antagonist of 'My Hero Academia' who can steal Quirks?",
    options: ["Stain", "Shigaraki Tomura", "All For One", "Overhaul"],
    correctAnswer: "All For One",
    explanation: "All For One is a supervillain and the arch-nemesis of All Might, possessing a Quirk that allows him to steal and bestow other Quirks."
  },
  {
    question: "In 'Re:Zero', what is the name of the powerful witch responsible for the 'Return by Death' ability?",
    options: ["Echidna", "Satella", "Minerva", "Typhon"],
    correctAnswer: "Satella",
    explanation: "Satella, the Witch of Envy, is mysteriously connected to Subaru's Return by Death ability, though her true intentions are ambiguous."
  },
  {
    question: "Which anime is set in a world where magic is banned, and the protagonist uses a giant sword to fight against a corrupt church?",
    options: ["Fire Force", "Black Clover", "Seven Deadly Sins", "Claymore"],
    correctAnswer: "Seven Deadly Sins",
    explanation: "Meliodas, the Dragon Sin of Wrath, leads the Seven Deadly Sins, a group of knights accused of treason, fighting against the corrupt Holy Knights."
  },
  {
    question: "What is the name of the spirit who acts as a guide and mentor to the protagonist in 'Spirited Away'?",
    options: ["No-Face", "Boh", "Yubaba", "Haku"],
    correctAnswer: "Haku",
    explanation: "Haku is a river spirit who helps Chihiro (Sen) navigate the dangers and rules of the Spirit World."
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the secret organization of artificial humans created by Father?",
    options: ["Chimeras", "Homunculi", "Automails", "Golems"],
    correctAnswer: "Homunculi",
    explanation: "The Homunculi are seven artificial humans, each named after one of the Seven Deadly Sins, created by Father as extensions of himself."
  },
  {
    question: "Which anime features a high school student named Haruhi Suzumiya who unknowingly possesses reality-altering powers?",
    options: ["Lucky Star", "Azumanga Daioh", "The Melancholy of Haruhi Suzumiya", "Nichijou"],
    correctAnswer: "The Melancholy of Haruhi Suzumiya",
    explanation: "Haruhi forms the SOS Brigade to search for aliens, time travelers, and espers, unknowingly drawing them to her through her latent reality-altering abilities."
  },
  {
    question: "What is the name of the powerful technique in 'Dragon Ball Z' that allows a Saiyan to transform into a golden-haired, powered-up state?",
    options: ["Kaioken", "Spirit Bomb", "Super Saiyan", "Fusion"],
    correctAnswer: "Super Saiyan",
    explanation: "The Super Saiyan transformation is a legendary state achieved by Saiyans, drastically increasing their power, speed, and fighting ability."
  },
  {
    question: "In 'One Piece', what is the name of the 'Surgeon of Death' and captain of the Heart Pirates?",
    options: ["Trafalgar D. Water Law", "Eustass Kid", "Basil Hawkins", "X Drake"],
    correctAnswer: "Trafalgar D. Water Law",
    explanation: "Law is a prominent pirate and doctor, possessing the Ope Ope no Mi Devil Fruit, which grants him the ability to create 'Rooms' to manipulate space."
  },
  {
    question: "Which anime focuses on the daily lives of anthropomorphic cells working inside the human body?",
    options: ["Osmosis Jones", "Cells at Work!", "The Human Body", "Physiology Frenzy"],
    correctAnswer: "Cells at Work!",
    explanation: "Cells at Work! depicts the various types of cells (like Red Blood Cells and White Blood Cells) working together to maintain the human body."
  },
  {
    question: "What is the name of the organization in 'Attack on Titan' that protects the royal family and maintains order within the walls?",
    options: ["Garrison Regiment", "Military Police Regiment", "Survey Corps", "Training Corps"],
    correctAnswer: "Military Police Regiment",
    explanation: "The Military Police Regiment is the most prestigious branch, serving directly under the King and maintaining order within the inner walls."
  },
  {
    question: "In 'Naruto', what is the name of the forbidden jutsu that allows the user to create clones of themselves?",
    options: ["Rasengan", "Chidori", "Shadow Clone Jutsu", "Summoning Jutsu"],
    correctAnswer: "Shadow Clone Jutsu",
    explanation: "The Shadow Clone Jutsu creates tangible copies of the user, distributing chakra equally among them, making it dangerous but versatile."
  },
  {
    question: "Which anime features a boy named Yugi Muto who solves ancient puzzles and plays a card game called Duel Monsters?",
    options: ["Cardfight!! Vanguard", "Beyblade", "Yu-Gi-Oh!", "Pokémon"],
    correctAnswer: "Yu-Gi-Oh!",
    explanation: "Yu-Gi-Oh! centers around Yugi Muto, who holds the Millennium Puzzle and uses his alter ego, Yami Yugi, to play the card game Duel Monsters."
  },
  {
    question: "What is the name of the cursed spirit that often accompanies Yuji Itadori in 'Jujutsu Kaisen' and speaks through his mouth?",
    options: ["Mahito", "Jogo", "Sukuna", "Toji Fushiguro"],
    correctAnswer: "Sukuna",
    explanation: "Ryomen Sukuna is a powerful and malevolent Cursed Spirit whose fingers Yuji Itadori consumed, leading to Sukuna residing within Yuji's body."
  },
  {
    question: "In 'Assassination Classroom', what is the name of the incredibly fast and powerful alien creature who becomes a teacher?",
    options: ["Koro-sensei", "Nagisa Shiota", "Karma Akabane", "Principal Asano"],
    correctAnswer: "Koro-sensei",
    explanation: "Koro-sensei is a powerful octopus-like creature who promises to destroy the Earth if his students in Class 3-E of Kunugigaoka Junior High School fail to assassinate him before graduation."
  },
  {
    question: "Which anime features a group of individuals known as 'Pilots' who control gigantic mechs called 'FranXX'?",
    options: ["Code Geass", "Darling in the FranXX", "Neon Genesis Evangelion", "Gurren Lagann"],
    correctAnswer: "Darling in the FranXX",
    explanation: "Darling in the FranXX follows a group of teenage pilots, including Hiro and Zero Two, who pilot mechs called FranXX to fight mysterious giant beasts called Klaxosaurs."
  },
  {
    question: "What is the name of the mysterious substance in 'Made in Abyss' that grants wishes but causes a terrible curse upon ascent?",
    options: ["Philosopher's Stone", "Orbs", "Relics", "Curse of the Abyss"],
    correctAnswer: "Curse of the Abyss",
    explanation: "The Abyss is a gigantic hole with a unique ecosystem and physical laws. Ascending from its deeper layers triggers a severe and often fatal 'Curse of the Abyss'."
  },
  {
    question: "In 'Re:Zero', what is the name of the half-elf girl with silver hair whom Subaru falls in love with?",
    options: ["Rem", "Ram", "Emilia", "Beatrice"],
    correctAnswer: "Emilia",
    explanation: "Emilia is a kind-hearted half-elf spirit user who helps Subaru when he first arrives in the new world, and he develops strong feelings for her."
  },
  {
    question: "Which anime features a high schooler who becomes a superhero despite having no special powers, relying on training?",
    options: ["My Hero Academia", "One-Punch Man", "Mob Psycho 100", "Jujutsu Kaisen"],
    correctAnswer: "One-Punch Man",
    explanation: "Saitama gained immense strength through simple, intense training, allowing him to defeat any enemy with a single punch."
  },
  {
    question: "What is the name of the family of assassins that Killua Zoldyck belongs to in 'Hunter x Hunter'?",
    options: ["Uchiha", "Hyuga", "Zoldyck", "Kageyama"],
    correctAnswer: "Zoldyck",
    explanation: "The Zoldyck family is a notorious and powerful family of assassins, with Killua being one of its most promising members."
  },
  {
    question: "In 'Dragon Ball Z', what is the name of Goku's first son?",
    options: ["Goten", "Trunks", "Gohan", "Vegeta"],
    correctAnswer: "Gohan",
    explanation: "Gohan is the first son of Goku and Chi-Chi, who later becomes a powerful warrior in his own right."
  },
  {
    question: "Which anime features a unique form of martial arts called 'Hamon' that uses sunlight energy?",
    options: ["Fist of the North Star", "JoJo's Bizarre Adventure", "Baki the Grappler", "Kengan Ashura"],
    correctAnswer: "JoJo's Bizarre Adventure",
    explanation: "Hamon (or Ripple) is a technique that uses controlled breathing to send ripple-like energy throughout the body, imitating the sun's energy."
  },
  {
    question: "What is the name of the main antagonist in 'Demon Slayer: Kimetsu no Yaiba' who is the first and strongest demon?",
    options: ["Akaza", "Doma", "Kokushibo", "Muzan Kibutsuji"],
    correctAnswer: "Muzan Kibutsuji",
    explanation: "Muzan Kibutsuji is the Demon King and the progenitor of all demons, responsible for turning Nezuko into a demon and slaying Tanjiro's family."
  },
  {
    question: "In 'Attack on Titan', what is the name of the military commander and strategist of the Survey Corps, known for his unwavering resolve?",
    options: ["Levi Ackerman", "Hange Zoë", "Erwin Smith", "Pixis Dot"],
    correctAnswer: "Erwin Smith",
    explanation: "Erwin Smith was the charismatic and ruthless 13th Commander of the Survey Corps, leading daring operations against the Titans."
  },
  {
    question: "Which anime features a young girl named Chihiro who gets lost in a spirit world and works at a bathhouse?",
    options: ["My Neighbor Totoro", "Howl's Moving Castle", "Spirited Away", "Ponyo"],
    correctAnswer: "Spirited Away",
    explanation: "Chihiro stumbles into a world inhabited by spirits and gods and must work at the bathhouse of the witch Yubaba to save her parents."
  },
  {
    question: "What is the name of the protagonist in 'One-Punch Man' who can defeat any enemy with a single punch?",
    options: ["Genos", "Saitama", "Mumen Rider", "King"],
    correctAnswer: "Saitama",
    explanation: "Saitama is a hero for fun, capable of defeating any foe with a single punch, leading to his overwhelming strength and boredom."
  },
  {
    question: "In 'Naruto Shippuden', what is the name of the main villain who plans to put the entire world under a genjutsu called the Infinite Tsukuyomi?",
    options: ["Orochimaru", "Madara Uchiha", "Pain", "Obito Uchiha"],
    correctAnswer: "Madara Uchiha",
    explanation: "Madara Uchiha is a legendary Uchiha clan member who conspired with Obito to initiate the Fourth Great Ninja War and cast the Infinite Tsukuyomi."
  },
  {
    question: "Which anime follows a protagonist named Shigeo Kageyama (Mob) who tries to live a normal life despite possessing immense psychic powers?",
    options: ["One-Punch Man", "Saiki K.", "Mob Psycho 100", "Bungo Stray Dogs"],
    correctAnswer: "Mob Psycho 100",
    explanation: "Mob tries to suppress his emotions to control his psychic powers, working for a con artist psychic, Reigen Arataka."
  },
  {
    question: "What is the name of the organization that runs the Death Games in 'Sword Art Online'?",
    options: ["Argus", "Kayaba Akihiko", "Laughing Coffin", "SAO Inc."],
    correctAnswer: "Argus",
    explanation: "Argus is the company that developed and launched the Sword Art Online game, and Kayaba Akihiko was the game's creator and its final boss."
  },
  {
    question: "In 'Fire Force', what are the demonic beings created from spontaneous human combustion called?",
    options: ["Devils", "Demons", "Infernals", "Combustionals"],
    correctAnswer: "Infernals",
    explanation: "Infernals are the first generation of fire-wielding beings, created when humans spontaneously combust and turn into fiery demons."
  },
];

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
};

export default function App() {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [correctSound, setCorrectSound] = useState();
  const [incorrectSound, setIncorrectSound] = useState();
  const [backgroundSound, setBackgroundSound] = useState(null); // <-- NEW STATE FOR BACKGROUND SOUND

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: correctS } = await Audio.Sound.createAsync(
          require('./assets/correct.mp3')
        );
        setCorrectSound(correctS);

        const { sound: incorrectS } = await Audio.Sound.createAsync(
          require('./assets/incorrect.mp3')
        );
        setIncorrectSound(incorrectS);

        // --- BACKGROUND MUSIC LOADING ---
        const { sound: bgS } = await Audio.Sound.createAsync(
          require('./assets/audio1bg.mp3'), // <-- UPDATED PATH FOR YOUR BG SONG
          { shouldPlay: true, isLooping: true, volume: 0.2 } // Adjust volume as needed
        );
        setBackgroundSound(bgS);
        // --- END BACKGROUND MUSIC LOADING ---

      } catch (error) {
        console.error("Error loading sounds: ", error); // Changed from .warn to .error for visibility
        Alert.alert("Sound Error", "Could not load quiz sounds. Please check your assets folder and file names.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSounds();
    return () => {
      correctSound?.unloadAsync();
      incorrectSound?.unloadAsync();
      backgroundSound?.unloadAsync(); // <-- UNLOAD BACKGROUND SOUND
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      startQuiz();
    }
  }, [isLoading]);

  useEffect(() => {
    if (showExplanation) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 10,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [showExplanation]);

  const startQuiz = () => {
    // Shuffle all questions and then pick the first 10
    const allShuffled = shuffleArray([...questions]);
    const selectedTenQuestions = allShuffled.slice(0, NUM_QUESTIONS_PER_SESSION); // <-- LIMIT TO 10 QUESTIONS

    setShuffledQuestions(selectedTenQuestions); // <-- SET THE 10 QUESTIONS
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setShowExplanation(false);
    setModalVisible(false);
  };

  const playSound = async (isCorrect) => {
    try {
      if (isCorrect) {
        await correctSound?.replayAsync();
      } else {
        await incorrectSound?.replayAsync();
      }
    } catch (error) {
      console.warn("Error playing sound: ", error);
    }
  };

  const handleAnswer = (selectedOption) => {
    if (selectedAnswer !== null) {
      return; // Prevent multiple selections
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = (selectedOption === currentQuestion.correctAnswer);
    setSelectedAnswer(selectedOption);

    if (isCorrect) {
      setScore(score + 1);
      playSound(true);
    } else {
      playSound(false);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < shuffledQuestions.length) { // Now based on the 10 selected questions
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      setModalVisible(true);
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length} {/* Display total of 10 */}
        </Text>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;

            let buttonStyle = styles.optionButton;
            let textStyle = styles.optionButtonText;

            if (showExplanation && isSelected) {
              buttonStyle = isCorrect ? styles.correctAnswerButton : styles.incorrectAnswerButton;
              textStyle = styles.selectedButtonText;
            } else if (showExplanation && isCorrect) {
              // Highlight correct answer even if not selected
              buttonStyle = styles.correctAnswerButton;
              textStyle = styles.selectedButtonText;
            } else if (selectedAnswer !== null) {
              // Dim unselected incorrect answers
              buttonStyle = { ...styles.optionButton, opacity: 0.6 };
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showExplanation && (
          <Animated.View style={[styles.explanationContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{currentQuestion?.explanation}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex + 1 === shuffledQuestions.length ? "Finish Quiz" : "Next Question"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Quiz Completed!</Text>
          <Text style={styles.modalScore}>You scored {score} out of {shuffledQuestions.length}!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={startQuiz}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created by{' '}
          <Text
            style={styles.githubLink}
            onPress={() => {
              // Placeholder for opening URL, React Native Linking API would be used here
              // import { Linking } from 'react-native';
              // Linking.openURL('https://github.com/Akshansh-Dhuware');
              Alert.alert("GitHub", "Visit https://github.com/Akshansh-Dhuware");
            }}
          >
            @Akshansh-Dhuware
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Adjust for status bar on Android
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#BB86FC', // Light purple
  },
  questionNumber: {
    fontSize: 18,
    color: '#BB86FC', // Light purple
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light grey for question text
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Inter-Bold', // Assuming a bold font
    lineHeight: 32,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#3700B3', // Dark purple
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#BB86FC', // Light purple border
  },
  optionButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  correctAnswerButton: {
    backgroundColor: '#03DAC6', // Teal for correct answer
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  incorrectAnswerButton: {
    backgroundColor: '#CF6679', // Red for incorrect answer
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedButtonText: {
    color: '#121212', // Dark text for selected/highlighted buttons
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  explanationContainer: {
    backgroundColor: '#1F1F1F', // Slightly lighter dark for explanation background
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 9,
    borderWidth: 1,
    borderColor: '#3700B3',
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03DAC6', // Teal for explanation title
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  explanationText: {
    fontSize: 16,
    color: '#E0E0E0', // Light grey text
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  nextButton: {
    backgroundColor: '#BB86FC', // Light purple for next button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20, // Increased margin to separate from explanation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
  },
  nextButtonText: {
    color: '#3700B3', // Dark purple text
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  modalContent: {
    backgroundColor: '#6200EE', // Darker purple for modal
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#03DAC6', // Teal for title
    fontFamily: 'Inter',
  },
  modalScore: {
    fontSize: 24,
    marginBottom: 25,
    color: '#FFFFFF', // White text for score
    fontFamily: 'Inter',
  },
  restartButton: {
    backgroundColor: '#03DAC6', // Teal for restart button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
  },
  restartButtonText: {
    color: '#3700B3', // Dark purple text
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#1F1F1F', // Slightly lighter dark for footer
    borderTopWidth: 1,
    borderColor: '#3700B3', // Dark purple border
  },
  footerText: {
    color: '#E0E0E0', // Light grey text
    fontSize: 12,
    fontFamily: 'Inter',
  },
  githubLink: {
    color: '#BB86FC', // Light purple for the link
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});