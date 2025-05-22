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
import { Audio } from 'expo-av'; // <--- Place this line here!

// All available quiz questions (80 unique questions with explanations)
const allQuizQuestions = [
  {
    question: "Which anime features a protagonist who can turn into a Titan?",
    options: ["My Hero Academia", "Attack on Titan", "One Piece", "Naruto"],
    answer: 1, // Attack on Titan
    explanation: "Eren Yeager, the main character of Attack on Titan, possesses the ability to transform into a Titan.",
  },
  {
    question: "In 'Dragon Ball Z', what is Goku's signature attack?",
    options: ["Spirit Bomb", "Rasengan", "Gum-Gum Pistol", "Kamehameha"],
    answer: 3, // Kamehameha
    explanation: "The Kamehameha is a powerful energy blast developed by Master Roshi and famously used by Goku.",
  },
  {
    question: "Who is the main character in 'One-Punch Man'?",
    options: ["Genos", "Saitama", "King", "Fubuki"],
    answer: 1, // Saitama
    explanation: "Saitama is the titular 'One-Punch Man' who can defeat any foe with a single punch.",
  },
  {
    question: "Which anime is known for its elaborate cooking battles and unique dishes?",
    options: ["Food Wars! Shokugeki no Soma", "Haikyuu!!", "Dr. Stone", "Demon Slayer"],
    answer: 0, // Food Wars! Shokugeki no Soma
    explanation: "Food Wars! Shokugeki no Soma centers around intense culinary competitions and creative cooking.",
  },
  {
    question: "What is the name of the organization that Light Yagami tries to defeat in 'Death Note'?",
    options: ["Akatsuki", "Phantom Troupe", "SPK", "Survey Corps"],
    answer: 2, // SPK
    explanation: "The SPK (Special Provision for Kira) is an organization formed to capture Kira, led by Near.",
  },
  {
    question: "Which magical girl anime features a character named Usagi Tsukino?",
    options: ["Cardcaptor Sakura", "Madoka Magica", "Sailor Moon", "Precure"],
    answer: 2, // Sailor Moon
    explanation: "Usagi Tsukino is the civilian identity of Sailor Moon, the leader of the Sailor Guardians.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what are the Elric brothers searching for?",
    options: ["The Philosopher's Stone", "The Holy Grail", "The One Piece", "The Infinity Stones"],
    answer: 0, // The Philosopher's Stone
    explanation: "Edward and Alphonse Elric seek the Philosopher's Stone to restore their bodies after a failed human transmutation.",
  },
  {
    question: "Which anime is set in a world where humans are hunted by monstrous creatures called 'Ghouls'?",
    options: ["Parasyte: The Maxim", "Tokyo Ghoul", "Jujutsu Kaisen", "Devilman Crybaby"],
    answer: 1, // Tokyo Ghoul
    explanation: "Tokyo Ghoul depicts a world where human-like creatures called Ghouls prey on humans.",
  },
  {
    question: "What is the name of the main protagonist in 'Naruto'?",
    options: ["Sasuke Uchiha", "Kakashi Hatake", "Naruto Uzumaki", "Sakura Haruno"],
    answer: 2, // Naruto Uzumaki
    explanation: "Naruto Uzumaki is the loud, hyperactive, and determined ninja who dreams of becoming Hokage.",
  },
  {
    question: "Which anime features a group of pirates searching for the ultimate treasure, the One Piece?",
    options: ["Fairy Tail", "Bleach", "One Piece", "Hunter x Hunter"],
    answer: 2, // One Piece
    explanation: "One Piece follows Monkey D. Luffy and his Straw Hat Pirates on their quest for the legendary treasure.",
  },
  {
    question: "Who is the strongest character in 'Jujutsu Kaisen'?",
    options: ["Yuji Itadori", "Megumi Fushiguro", "Satoru Gojo", "Nobara Kugisaki"],
    answer: 2, // Satoru Gojo
    explanation: "Satoru Gojo is widely considered the strongest Jujutsu Sorcerer in the series.",
  },
  {
    question: "In 'My Hero Academia', what is All Might's Quirk called?",
    options: ["Explosion", "One For All", "Zero Gravity", "Erasure"],
    answer: 1, // One For All
    explanation: "One For All is a transferable Quirk that stockpiles power, passed down to Izuku Midoriya.",
  },
  {
    question: "Which anime is known for its intense psychological battles and mind games?",
    options: ["Psycho-Pass", "Code Geass", "Death Note", "Erased"],
    answer: 2, // Death Note
    explanation: "Death Note is famous for the intellectual cat-and-mouse game between Light Yagami and L.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer: Kimetsu no Yaiba'?",
    options: ["Zenitsu Agatsuma", "Inosuke Hashibira", "Tanjiro Kamado", "Nezuko Kamado"],
    answer: 2, // Tanjiro Kamado
    explanation: "Tanjiro Kamado is the kind-hearted protagonist who seeks a cure for his sister's demon transformation.",
  },
  {
    question: "Which anime features a high school student who becomes a detective after gaining a supernatural notebook?",
    options: ["Detective Conan", "Death Note", "Psycho-Pass", "Bungo Stray Dogs"],
    answer: 1, // Death Note
    explanation: "Light Yagami finds the Death Note, a notebook that allows him to kill anyone by writing their name.",
  },
  {
    question: "In 'Attack on Titan', what is the name of the elite military squad led by Levi Ackerman?",
    options: ["Garrison Regiment", "Military Police Regiment", "Survey Corps", "Scout Regiment"],
    answer: 2, // Survey Corps
    explanation: "The Survey Corps (also known as the Scout Regiment) is the branch of the military responsible for venturing outside the walls.",
  },
  {
    question: "Which anime is about a boy who dreams of becoming the strongest Hunter?",
    options: ["Black Clover", "Jujutsu Kaisen", "Hunter x Hunter", "Fire Force"],
    answer: 2, // Hunter x Hunter
    explanation: "Gon Freecss embarks on a journey to become a Hunter and find his father.",
  },
  {
    question: "What is the name of the giant robot in 'Neon Genesis Evangelion'?",
    options: ["Gundam", "Voltron", "EVA Unit-01", "Mazinger Z"],
    answer: 2, // EVA Unit-01
    explanation: "EVA Unit-01 is the primary Evangelion piloted by Shinji Ikari.",
  },
  {
    question: "Which anime features a virtual reality MMORPG where players are trapped and must clear the game to escape?",
    options: ["Log Horizon", "Overlord", "Sword Art Online", "No Game No Life"],
    answer: 2, // Sword Art Online
    explanation: "Sword Art Online traps its players in a virtual world where death in the game means death in real life.",
  },
  {
    question: "In 'Fullmetal Alchemist', what is the law of equivalent exchange?",
    options: ["You must give something to gain something of equal value", "For every action, there is an equal and opposite reaction", "The strong survive, the weak perish", "Knowledge is power"],
    answer: 0, // You must give something to gain something of equal value
    explanation: "The fundamental principle of alchemy in Fullmetal Alchemist is that to obtain something, something of equal value must be lost.",
  },
  {
    question: "Which anime is about a group of teenagers with psychic abilities who fight against evil organizations?",
    options: ["Mob Psycho 100", "Psycho-Pass", "Charlotte", "Kiznaiver"],
    answer: 0, // Mob Psycho 100
    explanation: "Mob Psycho 100 follows Shigeo 'Mob' Kageyama, a powerful psychic who tries to live a normal life.",
  },
  {
    question: "What is the name of the school in 'My Hero Academia'?",
    options: ["Karasuno High", "UA High", "Seirin High", "Kunugigaoka Junior High"],
    answer: 1, // UA High
    explanation: "UA High School is the prestigious academy where aspiring heroes train.",
  },
  {
    question: "Which anime follows a group of high school students who form a band?",
    options: ["K-On!", "Love Live!", "Given", "Your Lie in April"],
    answer: 0, // K-On!
    explanation: "K-On! features the light music club members of Sakuragaoka High School.",
  },
  {
    question: "In 'Code Geass', what is Lelouch's Geass ability?",
    options: ["Mind Control", "Super Speed", "Time Travel", "Invisibility"],
    answer: 0, // Mind Control
    explanation: "Lelouch's Geass allows him to issue absolute commands to anyone he makes eye contact with.",
  },
  {
    question: "Which anime features a boy who can see spirits and becomes a Soul Reaper?",
    options: ["Noragami", "Bleach", "Blue Exorcist", "Fire Force"],
    answer: 1, // Bleach
    explanation: "Ichigo Kurosaki gains Soul Reaper powers and fights Hollows in Bleach.",
  },
  {
    question: "What is the name of the protagonist in 'Sword Art Online'?",
    options: ["Kirito", "Eren", "Luffy", "Naruto"],
    answer: 0, // Kirito
    explanation: "Kazuto Kirigaya, known as Kirito, is the main dual-wielding protagonist of Sword Art Online.",
  },
  {
    question: "Which anime is about a group of friends who travel through time using a microwave oven?",
    options: ["Re:Zero", "Steins;Gate", "Erased", "Orange"],
    answer: 1, // Steins;Gate
    explanation: "In Steins;Gate, the Future Gadget Lab invents a 'Phone Microwave' that can send messages to the past.",
  },
  {
    question: "In 'Hunter x Hunter', what is the name of Gon's best friend?",
    options: ["Leorio", "Kurapika", "Killua", "Hisoka"],
    answer: 2, // Killua
    explanation: "Killua Zoldyck is a former assassin and Gon's closest friend.",
  },
  {
    question: "Which anime features a world where humans are forced to live underground due to giant mechs?",
    options: ["Gurren Lagann", "Darling in the Franxx", "Knights of Sidonia", "Evangelion"],
    answer: 0, // Gurren Lagann
    explanation: "Gurren Lagann begins with humanity living in subterranean villages, fearing the surface.",
  },
  {
    question: "What is the name of the main antagonist in 'Dragon Ball Z'?",
    options: ["Frieza", "Cell", "Majin Buu", "All of the above"],
    answer: 3, // All of the above
    explanation: "Frieza, Cell, and Majin Buu are all major antagonists that Goku and his friends face in Dragon Ball Z.",
  },
  {
    question: "Which anime is about a boy who becomes a hero after eating a cursed finger?",
    options: ["Chainsaw Man", "Fire Force", "Jujutsu Kaisen", "Devilman Crybaby"],
    answer: 2, // Jujutsu Kaisen
    explanation: "Yuji Itadori consumes a cursed finger of Sukuna, becoming a vessel for the powerful curse.",
  },
  {
    question: "In 'One Piece', what is the name of Luffy's pirate crew?",
    options: ["Red-Hair Pirates", "Whitebeard Pirates", "Straw Hat Pirates", "Heart Pirates"],
    answer: 2, // Straw Hat Pirates
    explanation: "Monkey D. Luffy is the captain of the Straw Hat Pirates.",
  },
  {
    question: "Which anime features a group of students who are tasked with assassinating their alien teacher?",
    options: ["Assassination Classroom", "Boku no Hero Academia", "Mob Psycho 100", "Daily Lives of High School Boys"],
    answer: 0, // Assassination Classroom
    explanation: "In Assassination Classroom, students of Class 3-E are given the mission to kill their super-powered teacher, Koro-sensei.",
  },
  {
    question: "What is the name of the protagonist in 'Tokyo Ghoul'?",
    options: ["Ken Kaneki", "Touka Kirishima", "Rize Kamishiro", "Shu Tsukiyama"],
    answer: 0, // Ken Kaneki
    explanation: "Ken Kaneki is a human who becomes a half-ghoul after an encounter with Rize.",
  },
  {
    question: "Which anime is set in a world where magic is a common ability and follows a boy who can't use it?",
    options: ["Fairy Tail", "Black Clover", "Seven Deadly Sins", "Magi"],
    answer: 1, // Black Clover
    explanation: "Asta, the protagonist of Black Clover, is born without any magical ability in a world where magic is everything.",
  },
  {
    question: "In 'Naruto', what is the name of the tailed beast sealed within Naruto?",
    options: ["Shukaku", "Matatabi", "Kurama", "Gyuki"],
    answer: 2, // Kurama
    explanation: "Kurama, the Nine-Tailed Fox, is sealed inside Naruto Uzumaki.",
  },
  {
    question: "Which anime features a group of elite athletes competing in volleyball?",
    options: ["Kuroko's Basketball", "Haikyuu!!", "Free!", "Yuri!!! on Ice"],
    answer: 1, // Haikyuu!!
    explanation: "Haikyuu!! follows the Karasuno High School volleyball team.",
  },
  {
    question: "What is the name of the school in 'Haikyuu!!'?",
    options: ["Nekoma High", "Aoba Johsai High", "Shiratorizawa Academy", "Karasuno High"],
    answer: 3, // Karasuno High
    explanation: "Karasuno High is the school attended by Hinata and Kageyama, the main duo of Haikyuu!!",
  },
  {
    question: "Which anime is about a world where people with 'Quirks' have superpowers?",
    options: ["One-Punch Man", "Mob Psycho 100", "My Hero Academia", "Fire Force"],
    answer: 2, // My Hero Academia
    explanation: "My Hero Academia's society is largely composed of individuals with superpowers called Quirks.",
  },
  {
    question: "In 'Death Note', what is the name of the Shinigami who drops the Death Note?",
    options: ["Rem", "Ryuk", "Gelus", "Sidoh"],
    answer: 1, // Ryuk
    explanation: "Ryuk is the Shinigami who drops the Death Note into the human world out of boredom.",
  },
  {
    question: "Which anime features a boy who becomes a devil hunter after making a contract with a devil?",
    options: ["Blue Exorcist", "Devilman Crybaby", "Chainsaw Man", "Jujutsu Kaisen"],
    answer: 2, // Chainsaw Man
    explanation: "Denji, the protagonist of Chainsaw Man, forms a contract with the Chainsaw Devil, Pochita.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer'?",
    options: ["Zenitsu", "Inosuke", "Nezuko", "Tanjiro"],
    answer: 3, // Tanjiro
    explanation: "Tanjiro Kamado is the main character and a demon slayer.",
  },
  {
    question: "Which anime is about a group of friends who try to save their town from a mysterious phenomenon?",
    options: ["Erased", "Re:Zero", "Steins;Gate", "Orange"],
    answer: 0, // Erased
    explanation: "Satoru Fujinuma in Erased has an ability called 'Revival' that sends him back in time to prevent tragedies.",
  },
  {
    question: "In 'One-Punch Man', what is Saitama's training regimen?",
    options: ["100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday", "Eating healthy and sleeping well", "Fighting strong opponents", "Intense weightlifting"],
    answer: 0, // 100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday
    explanation: "Saitama's 'simple' training regimen is the source of his immense power.",
  },
  {
    question: "Which anime features a world where humanity lives in walled cities to protect themselves from giant humanoid creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The remnants of humanity in Attack on Titan live within three concentric walls to protect themselves from Titans.",
  },
  {
    question: "What is the name of the main character in 'Jujutsu Kaisen'?",
    options: ["Megumi Fushiguro", "Satoru Gojo", "Yuji Itadori", "Nobara Kugisaki"],
    answer: 2, // Yuji Itadori
    explanation: "Yuji Itadori is the kind-hearted high school student who becomes a Jujutsu Sorcerer.",
  },
  {
    question: "Which anime is about a boy who wants to become the Pirate King?",
    options: ["Naruto", "Bleach", "One Piece", "Fairy Tail"],
    answer: 2, // One Piece
    explanation: "Monkey D. Luffy's ultimate goal is to find the One Piece and become the Pirate King.",
  },
  {
    question: "In 'My Hero Academia', what is the name of the symbol of peace?",
    options: ["Eraser Head", "Endeavor", "All Might", "Hawks"],
    answer: 2, // All Might
    explanation: "All Might is the former No. 1 Hero and the 'Symbol of Peace'.",
  },
  {
    question: "Which anime features a group of students who play basketball?",
    options: ["Haikyuu!!", "Free!", "Kuroko's Basketball", "Yuri!!! on Ice"],
    answer: 2, // Kuroko's Basketball
    explanation: "Kuroko's Basketball focuses on the Seirin High School basketball team and the 'Generation of Miracles'.",
  },
  {
    question: "What is the name of the main character in 'Dragon Ball Super'?",
    options: ["Vegeta", "Gohan", "Goku", "Piccolo"],
    answer: 2, // Goku
    explanation: "Goku continues to be the main character in Dragon Ball Super, achieving new forms and power levels.",
  },
  {
    question: "Which anime is about a boy who becomes a hero for fun?",
    options: ["My Hero Academia", "One-Punch Man", "Mob Psycho 100", "Saiki K."],
    answer: 1, // One-Punch Man
    explanation: "Saitama became a hero 'for fun' and is often bored due to his overwhelming strength.",
  },
  {
    question: "In 'Naruto', what is the name of Sasuke's older brother?",
    options: ["Itachi", "Obito", "Madara", "Shisui"],
    answer: 0, // Itachi
    explanation: "Itachi Uchiha is Sasuke's older brother and a key figure in the Uchiha clan's history.",
  },
  {
    question: "Which anime features a group of assassins?",
    options: ["Akame ga Kill!", "Black Lagoon", "Darker than Black", "Assassination Classroom"],
    answer: 0, // Akame ga Kill!
    explanation: "Akame ga Kill! follows the story of Tatsumi as he joins the assassin group Night Raid.",
  },
  {
    question: "What is the name of the main character in 'Fairy Tail'?",
    options: ["Gray Fullbuster", "Erza Scarlet", "Natsu Dragneel", "Lucy Heartfilia"],
    answer: 2, // Natsu Dragneel
    explanation: "Natsu Dragneel is a fire dragon slayer and one of the main protagonists of Fairy Tail.",
  },
  {
    question: "Which anime is about a young boy who finds a mysterious book that grants him the power to kill anyone whose name he writes in it?",
    options: ["Code Geass", "Death Note", "Psycho-Pass", "Erased"],
    answer: 1, // Death Note
    explanation: "The Death Note allows its user to kill anyone by writing their name while picturing their face.",
  },
  {
    question: "In 'One Piece', what is the name of Zoro's sword style?",
    options: ["Two Sword Style", "Four Sword Style", "Three Sword Style", "One Sword Style"],
    answer: 2, // Three Sword Style
    explanation: "Roronoa Zoro is famous for his Santoryu, or Three Sword Style.",
  },
  {
    question: "Which anime features a school where students are forced to gamble to survive?",
    options: ["Kakegurui", "No Game No Life", "High-Rise Invasion", "Death Parade"],
    answer: 0, // Kakegurui
    explanation: "Hyakkaou Private Academy in Kakegurui uses gambling to determine students' hierarchy.",
  },
  {
    question: "What is the name of the main character in 'Hunter x Hunter'?",
    options: ["Killua Zoldyck", "Kurapika", "Leorio Paradinight", "Gon Freecss"],
    answer: 3, // Gon Freecss
    explanation: "Gon Freecss is the cheerful and determined main protagonist of Hunter x Hunter.",
  },
  {
    question: "Which anime is about a boy who can see ghosts and helps them pass on?",
    options: ["Bleach", "Noragami", "Mushishi", "Natsume's Book of Friends"],
    answer: 1, // Noragami
    explanation: "Yato, a minor deity in Noragami, helps spirits and grants wishes for a small fee.",
  },
  {
    question: "In 'Attack on Titan', what is the name of Eren's adoptive sister?",
    options: ["Sasha Blouse", "Hange Zoë", "Mikasa Ackerman", "Annie Leonhart"],
    answer: 2, // Mikasa Ackerman
    explanation: "Mikasa Ackerman was adopted into the Yeager family and is fiercely protective of Eren.",
  },
  {
    question: "Which anime features a world where humans are protected by giant walls from monstrous creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The last remnants of humanity in Attack on Titan live within three layers of massive walls to protect themselves from the Titans.",
  },
  {
    question: "What is the name of the main character in 'Re:Zero - Starting Life in Another World'?",
    options: ["Rem", "Ram", "Emilia", "Subaru Natsuki"],
    answer: 3, // Subaru Natsuki
    explanation: "Subaru Natsuki is transported to a fantasy world and gains the ability 'Return by Death'.",
  },
  {
    question: "Which anime is about a boy who can control shadows?",
    options: ["Black Butler", "Noragami", "Kageyama-kun", "Shadows House"],
    answer: 0, // Black Butler (Sebastian Michaelis has shadow-like abilities)
    explanation: "Sebastian Michaelis, the demon butler in Black Butler, often uses shadow-like abilities.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the country where the story takes place?",
    options: ["Xing", "Drachma", "Amestris", "Creta"],
    answer: 2, // Amestris
    explanation: "Amestris is the militaristic country where the Elric brothers' journey unfolds.",
  },
  {
    question: "Which anime features a group of high school students who solve mysteries?",
    options: ["Hyouka", "Detective Conan", "Erased", "Bungo Stray Dogs"],
    answer: 0, // Hyouka
    explanation: "Hyouka follows the Classic Literature Club as they solve various mysteries.",
  },
  {
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
    answer: 2, // Tokyo
    explanation: "Tokyo is the current capital and largest city of Japan.",
  },
  {
    question: "What is the name of the traditional Japanese garment?",
    options: ["Hanbok", "Kimono", "Sari", "Cheongsam"],
    answer: 1, // Kimono
    explanation: "The Kimono is a traditional Japanese robe-like garment.",
  },
  {
    question: "Which Japanese mountain is considered sacred and is a popular pilgrimage site?",
    options: ["Mount Fuji", "Mount Aso", "Mount Ontake", "Mount Kita"],
    answer: 0, // Mount Fuji
    explanation: "Mount Fuji is Japan's highest peak and an iconic symbol, revered as sacred.",
  },
  {
    question: "What is the traditional Japanese art of paper folding?",
    options: ["Ikebana", "Origami", "Bonsai", "Calligraphy"],
    answer: 1, // Origami
    explanation: "Origami is the art of folding paper into decorative shapes and figures.",
  },
  {
    question: "Which Japanese city was the first to be hit by an atomic bomb?",
    options: ["Nagasaki", "Hiroshima", "Kyoto", "Osaka"],
    answer: 1, // Hiroshima
    explanation: "Hiroshima was the first city to be devastated by an atomic bomb during World War II.",
  },
  {
    question: "What is the name of the Japanese martial art that focuses on throws and grappling?",
    options: ["Karate", "Kendo", "Judo", "Aikido"],
    answer: 2, // Judo
    explanation: "Judo is a Japanese martial art and Olympic sport focusing on throws, takedowns, and grappling.",
  },
  {
    question: "Which Japanese food consists of vinegared rice combined with other ingredients, often seafood?",
    options: ["Ramen", "Tempura", "Sushi", "Udon"],
    answer: 2, // Sushi
    explanation: "Sushi is a traditional Japanese dish of prepared vinegared rice, usually with seafood or vegetables.",
  },
  {
    question: "What is the national flower of Japan?",
    options: ["Rose", "Cherry Blossom", "Lotus", "Chrysanthemum"],
    answer: 1, // Cherry Blossom
    explanation: "The cherry blossom (sakura) is a highly symbolic and cherished national flower of Japan.",
  },
  {
    question: "Which Japanese sport involves two wrestlers trying to force each other out of a circular ring?",
    options: ["Kendo", "Judo", "Sumo", "Karate"],
    answer: 2, // Sumo
    explanation: "Sumo is a competitive full-contact wrestling sport where a rikishi (wrestler) attempts to force another wrestler out of a circular ring.",
  },
  {
    question: "What is the name of the famous Japanese bullet train?",
    options: ["Shinkansen", "Maglev", "TGV", "ICE"],
    answer: 0, // Shinkansen
    explanation: "The Shinkansen is Japan's network of high-speed railway lines.",
  },
  {
    question: "Which anime features a protagonist who can manipulate shadows?",
    options: ["Black Butler", "Noragami", "Kageyama-kun", "Shadows House"],
    answer: 0, // Black Butler (Sebastian Michaelis has shadow-like abilities)
    explanation: "Sebastian Michaelis, the demon butler in Black Butler, often uses shadow-like abilities.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the country where the story takes place?",
    options: ["Xing", "Drachma", "Amestris", "Creta"],
    answer: 2, // Amestris
    explanation: "Amestris is the militaristic country where the Elric brothers' journey unfolds.",
  },
  {
    question: "Which anime features a group of high school students who solve mysteries?",
    options: ["Hyouka", "Detective Conan", "Erased", "Bungo Stray Dogs"],
    answer: 0, // Hyouka
    explanation: "Hyouka follows the Classic Literature Club as they solve various mysteries.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer: Kimetsu no Yaiba'?",
    options: ["Zenitsu Agatsuma", "Inosuke Hashibira", "Tanjiro Kamado", "Nezuko Kamado"],
    answer: 2, // Tanjiro Kamado
    explanation: "Tanjiro Kamado is the kind-hearted protagonist who seeks a cure for his sister's demon transformation.",
  },
  {
    question: "Which anime is set in a world where magic is a common ability and follows a boy who can't use it?",
    options: ["Fairy Tail", "Black Clover", "Seven Deadly Sins", "Magi"],
    answer: 1, // Black Clover
    explanation: "Asta, the protagonist of Black Clover, is born without any magical ability in a world where magic is everything.",
  },
  {
    question: "In 'Naruto', what is the name of the tailed beast sealed within Naruto?",
    options: ["Shukaku", "Matatabi", "Kurama", "Gyuki"],
    answer: 2, // Kurama
    explanation: "Kurama, the Nine-Tailed Fox, is sealed inside Naruto Uzumaki.",
  },
  {
    question: "Which anime features a group of elite athletes competing in volleyball?",
    options: ["Kuroko's Basketball", "Haikyuu!!", "Free!", "Yuri!!! on Ice"],
    answer: 1, // Haikyuu!!
    explanation: "Haikyuu!! follows the Karasuno High School volleyball team.",
  },
  {
    question: "What is the name of the school in 'Haikyuu!!'?",
    options: ["Nekoma High", "Aoba Johsai High", "Shiratorizawa Academy", "Karasuno High"],
    answer: 3, // Karasuno High
    explanation: "Karasuno High is the school attended by Hinata and Kageyama, the main duo of Haikyuu!!",
  },
  {
    question: "Which anime is about a world where people with 'Quirks' have superpowers?",
    options: ["One-Punch Man", "Mob Psycho 100", "My Hero Academia", "Fire Force"],
    answer: 2, // My Hero Academia
    explanation: "My Hero Academia's society is largely composed of individuals with superpowers called Quirks.",
  },
  {
    question: "In 'Death Note', what is the name of the Shinigami who drops the Death Note?",
    options: ["Rem", "Ryuk", "Gelus", "Sidoh"],
    answer: 1, // Ryuk
    explanation: "Ryuk is the Shinigami who drops the Death Note into the human world out of boredom.",
  },
  {
    question: "Which anime features a boy who becomes a devil hunter after making a contract with a devil?",
    options: ["Blue Exorcist", "Devilman Crybaby", "Chainsaw Man", "Jujutsu Kaisen"],
    answer: 2, // Chainsaw Man
    explanation: "Denji, the protagonist of Chainsaw Man, forms a contract with the Chainsaw Devil, Pochita.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer'?",
    options: ["Zenitsu", "Inosuke", "Nezuko", "Tanjiro"],
    answer: 3, // Tanjiro
    explanation: "Tanjiro Kamado is the main character and a demon slayer.",
  },
  {
    question: "Which anime is about a group of friends who try to save their town from a mysterious phenomenon?",
    options: ["Erased", "Re:Zero", "Steins;Gate", "Orange"],
    answer: 0, // Erased
    explanation: "Satoru Fujinuma in Erased has an ability called 'Revival' that sends him back in time to prevent tragedies.",
  },
  {
    question: "In 'One-Punch Man', what is Saitama's training regimen?",
    options: ["100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday", "Eating healthy and sleeping well", "Fighting strong opponents", "Intense weightlifting"],
    answer: 0, // 100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday
    explanation: "Saitama's 'simple' training regimen is the source of his immense power.",
  },
  {
    question: "Which anime features a world where humanity lives in walled cities to protect themselves from giant humanoid creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The remnants of humanity in Attack on Titan live within three concentric walls to protect themselves from Titans.",
  },
  {
    question: "What is the name of the main character in 'Jujutsu Kaisen'?",
    options: ["Megumi Fushiguro", "Satoru Gojo", "Yuji Itadori", "Nobara Kugisaki"],
    answer: 2, // Yuji Itadori
    explanation: "Yuji Itadori is the kind-hearted high school student who becomes a Jujutsu Sorcerer.",
  },
  {
    question: "Which anime is about a boy who wants to become the Pirate King?",
    options: ["Naruto", "Bleach", "One Piece", "Fairy Tail"],
    answer: 2, // One Piece
    explanation: "Monkey D. Luffy's ultimate goal is to find the One Piece and become the Pirate King.",
  },
  {
    question: "In 'My Hero Academia', what is the name of the symbol of peace?",
    options: ["Eraser Head", "Endeavor", "All Might", "Hawks"],
    answer: 2, // All Might
    explanation: "All Might is the former No. 1 Hero and the 'Symbol of Peace'.",
  },
  {
    question: "Which anime features a group of students who play basketball?",
    options: ["Haikyuu!!", "Free!", "Kuroko's Basketball", "Yuri!!! on Ice"],
    answer: 2, // Kuroko's Basketball
    explanation: "Kuroko's Basketball focuses on the Seirin High School basketball team and the 'Generation of Miracles'.",
  },
  {
    question: "What is the name of the main character in 'Dragon Ball Super'?",
    options: ["Vegeta", "Gohan", "Goku", "Piccolo"],
    answer: 2, // Goku
    explanation: "Goku continues to be the main character in Dragon Ball Super, achieving new forms and power levels.",
  },
  {
    question: "Which anime is about a boy who becomes a hero for fun?",
    options: ["My Hero Academia", "One-Punch Man", "Mob Psycho 100", "Saiki K."],
    answer: 1, // One-Punch Man
    explanation: "Saitama became a hero 'for fun' and is often bored due to his overwhelming strength.",
  },
  {
    question: "In 'Naruto', what is the name of Sasuke's older brother?",
    options: ["Itachi", "Obito", "Madara", "Shisui"],
    answer: 0, // Itachi
    explanation: "Itachi Uchiha is Sasuke's older brother and a key figure in the Uchiha clan's history.",
  },
  {
    question: "Which anime features a group of assassins?",
    options: ["Akame ga Kill!", "Black Lagoon", "Darker than Black", "Assassination Classroom"],
    answer: 0, // Akame ga Kill!
    explanation: "Akame ga Kill! follows the story of Tatsumi as he joins the assassin group Night Raid.",
  },
  {
    question: "What is the name of the main character in 'Fairy Tail'?",
    options: ["Gray Fullbuster", "Erza Scarlet", "Natsu Dragneel", "Lucy Heartfilia"],
    answer: 2, // Natsu Dragneel
    explanation: "Natsu Dragneel is a fire dragon slayer and one of the main protagonists of Fairy Tail.",
  },
  {
    question: "Which anime is about a young boy who finds a mysterious book that grants him the power to kill anyone whose name he writes in it?",
    options: ["Code Geass", "Death Note", "Psycho-Pass", "Erased"],
    answer: 1, // Death Note
    explanation: "The Death Note allows its user to kill anyone by writing their name while picturing their face.",
  },
  {
    question: "In 'One Piece', what is the name of Zoro's sword style?",
    options: ["Two Sword Style", "Four Sword Style", "Three Sword Style", "One Sword Style"],
    answer: 2, // Three Sword Style
    explanation: "Roronoa Zoro is famous for his Santoryu, or Three Sword Style.",
  },
  {
    question: "Which anime features a school where students are forced to gamble to survive?",
    options: ["Kakegurui", "No Game No Life", "High-Rise Invasion", "Death Parade"],
    answer: 0, // Kakegurui
    explanation: "Hyakkaou Private Academy in Kakegurui uses gambling to determine students' hierarchy.",
  },
  {
    question: "What is the name of the main character in 'Hunter x Hunter'?",
    options: ["Killua Zoldyck", "Kurapika", "Leorio Paradinight", "Gon Freecss"],
    answer: 3, // Gon Freecss
    explanation: "Gon Freecss is the cheerful and determined main protagonist of Hunter x Hunter.",
  },
  {
    question: "Which anime is about a boy who can see ghosts and helps them pass on?",
    options: ["Bleach", "Noragami", "Mushishi", "Natsume's Book of Friends"],
    answer: 1, // Noragami
    explanation: "Yato, a minor deity in Noragami, helps spirits and grants wishes for a small fee.",
  },
  {
    question: "In 'Attack on Titan', what is the name of Eren's adoptive sister?",
    options: ["Sasha Blouse", "Hange Zoë", "Mikasa Ackerman", "Annie Leonhart"],
    answer: 2, // Mikasa Ackerman
    explanation: "Mikasa Ackerman was adopted into the Yeager family and is fiercely protective of Eren.",
  },
  {
    question: "Which anime features a world where humans are protected by giant walls from monstrous creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The last remnants of humanity in Attack on Titan live within three layers of massive walls to protect themselves from the Titans.",
  },
  {
    question: "What is the name of the main character in 'Re:Zero - Starting Life in Another World'?",
    options: ["Rem", "Ram", "Emilia", "Subaru Natsuki"],
    answer: 3, // Subaru Natsuki
    explanation: "Subaru Natsuki is transported to a fantasy world and gains the ability 'Return by Death'.",
  },
  {
    question: "Which anime is about a boy who can control shadows?",
    options: ["Black Butler", "Noragami", "Kageyama-kun", "Shadows House"],
    answer: 0, // Black Butler (Sebastian Michaelis has shadow-like abilities)
    explanation: "Sebastian Michaelis, the demon butler in Black Butler, often uses shadow-like abilities.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the country where the story takes place?",
    options: ["Xing", "Drachma", "Amestris", "Creta"],
    answer: 2, // Amestris
    explanation: "Amestris is the militaristic country where the Elric brothers' journey unfolds.",
  },
  {
    question: "Which anime features a group of high school students who solve mysteries?",
    options: ["Hyouka", "Detective Conan", "Erased", "Bungo Stray Dogs"],
    answer: 0, // Hyouka
    explanation: "Hyouka follows the Classic Literature Club as they solve various mysteries.",
  },
  {
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
    answer: 2, // Tokyo
    explanation: "Tokyo is the current capital and largest city of Japan.",
  },
  {
    question: "What is the name of the traditional Japanese garment?",
    options: ["Hanbok", "Kimono", "Sari", "Cheongsam"],
    answer: 1, // Kimono
    explanation: "The Kimono is a traditional Japanese robe-like garment.",
  },
  {
    question: "Which Japanese mountain is considered sacred and is a popular pilgrimage site?",
    options: ["Mount Fuji", "Mount Aso", "Mount Ontake", "Mount Kita"],
    answer: 0, // Mount Fuji
    explanation: "Mount Fuji is Japan's highest peak and an iconic symbol, revered as sacred.",
  },
  {
    question: "What is the traditional Japanese art of paper folding?",
    options: ["Ikebana", "Origami", "Bonsai", "Calligraphy"],
    answer: 1, // Origami
    explanation: "Origami is the art of folding paper into decorative shapes and figures.",
  },
  {
    question: "Which Japanese city was the first to be hit by an atomic bomb?",
    options: ["Nagasaki", "Hiroshima", "Kyoto", "Osaka"],
    answer: 1, // Hiroshima
    explanation: "Hiroshima was the first city to be devastated by an atomic bomb during World War II.",
  },
  {
    question: "What is the name of the Japanese martial art that focuses on throws and grappling?",
    options: ["Karate", "Kendo", "Judo", "Aikido"],
    answer: 2, // Judo
    explanation: "Judo is a Japanese martial art and Olympic sport focusing on throws, takedowns, and grappling.",
  },
  {
    question: "Which Japanese food consists of vinegared rice combined with other ingredients, often seafood?",
    options: ["Ramen", "Tempura", "Sushi", "Udon"],
    answer: 2, // Sushi
    explanation: "Sushi is a traditional Japanese dish of prepared vinegared rice, usually with seafood or vegetables.",
  },
  {
    question: "What is the national flower of Japan?",
    options: ["Rose", "Cherry Blossom", "Lotus", "Chrysanthemum"],
    answer: 1, // Cherry Blossom
    explanation: "The cherry blossom (sakura) is a highly symbolic and cherished national flower of Japan.",
  },
  {
    question: "Which Japanese sport involves two wrestlers trying to force each other out of a circular ring?",
    options: ["Kendo", "Judo", "Sumo", "Karate"],
    answer: 2, // Sumo
    explanation: "Sumo is a competitive full-contact wrestling sport where a rikishi (wrestler) attempts to force another wrestler out of a circular ring.",
  },
  {
    question: "What is the name of the famous Japanese bullet train?",
    options: ["Shinkansen", "Maglev", "TGV", "ICE"],
    answer: 0, // Shinkansen
    explanation: "The Shinkansen is Japan's network of high-speed railway lines.",
  },
  {
    question: "Which anime features a protagonist who can manipulate shadows?",
    options: ["Black Butler", "Noragami", "Kageyama-kun", "Shadows House"],
    answer: 0, // Black Butler (Sebastian Michaelis has shadow-like abilities)
    explanation: "Sebastian Michaelis, the demon butler in Black Butler, often uses shadow-like abilities.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the country where the story takes place?",
    options: ["Xing", "Drachma", "Amestris", "Creta"],
    answer: 2, // Amestris
    explanation: "Amestris is the militaristic country where the Elric brothers' journey unfolds.",
  },
  {
    question: "Which anime features a group of high school students who solve mysteries?",
    options: ["Hyouka", "Detective Conan", "Erased", "Bungo Stray Dogs"],
    answer: 0, // Hyouka
    explanation: "Hyouka follows the Classic Literature Club as they solve various mysteries.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer: Kimetsu no Yaiba'?",
    options: ["Zenitsu Agatsuma", "Inosuke Hashibira", "Tanjiro Kamado", "Nezuko Kamado"],
    answer: 2, // Tanjiro Kamado
    explanation: "Tanjiro Kamado is the kind-hearted protagonist who seeks a cure for his sister's demon transformation.",
  },
  {
    question: "Which anime is set in a world where magic is a common ability and follows a boy who can't use it?",
    options: ["Fairy Tail", "Black Clover", "Seven Deadly Sins", "Magi"],
    answer: 1, // Black Clover
    explanation: "Asta, the protagonist of Black Clover, is born without any magical ability in a world where magic is everything.",
  },
  {
    question: "In 'Naruto', what is the name of the tailed beast sealed within Naruto?",
    options: ["Shukaku", "Matatabi", "Kurama", "Gyuki"],
    answer: 2, // Kurama
    explanation: "Kurama, the Nine-Tailed Fox, is sealed inside Naruto Uzumaki.",
  },
  {
    question: "Which anime features a group of elite athletes competing in volleyball?",
    options: ["Kuroko's Basketball", "Haikyuu!!", "Free!", "Yuri!!! on Ice"],
    answer: 1, // Haikyuu!!
    explanation: "Haikyuu!! follows the Karasuno High School volleyball team.",
  },
  {
    question: "What is the name of the school in 'Haikyuu!!'?",
    options: ["Nekoma High", "Aoba Johsai High", "Shiratorizawa Academy", "Karasuno High"],
    answer: 3, // Karasuno High
    explanation: "Karasuno High is the school attended by Hinata and Kageyama, the main duo of Haikyuu!!",
  },
  {
    question: "Which anime is about a world where people with 'Quirks' have superpowers?",
    options: ["One-Punch Man", "Mob Psycho 100", "My Hero Academia", "Fire Force"],
    answer: 2, // My Hero Academia
    explanation: "My Hero Academia's society is largely composed of individuals with superpowers called Quirks.",
  },
  {
    question: "In 'Death Note', what is the name of the Shinigami who drops the Death Note?",
    options: ["Rem", "Ryuk", "Gelus", "Sidoh"],
    answer: 1, // Ryuk
    explanation: "Ryuk is the Shinigami who drops the Death Note into the human world out of boredom.",
  },
  {
    question: "Which anime features a boy who becomes a devil hunter after making a contract with a devil?",
    options: ["Blue Exorcist", "Devilman Crybaby", "Chainsaw Man", "Jujutsu Kaisen"],
    answer: 2, // Chainsaw Man
    explanation: "Denji, the protagonist of Chainsaw Man, forms a contract with the Chainsaw Devil, Pochita.",
  },
  {
    question: "What is the name of the main character in 'Demon Slayer'?",
    options: ["Zenitsu", "Inosuke", "Nezuko", "Tanjiro"],
    answer: 3, // Tanjiro
    explanation: "Tanjiro Kamado is the main character and a demon slayer.",
  },
  {
    question: "Which anime is about a group of friends who try to save their town from a mysterious phenomenon?",
    options: ["Erased", "Re:Zero", "Steins;Gate", "Orange"],
    answer: 0, // Erased
    explanation: "Satoru Fujinuma in Erased has an ability called 'Revival' that sends him back in time to prevent tragedies.",
  },
  {
    question: "In 'One-Punch Man', what is Saitama's training regimen?",
    options: ["100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday", "Eating healthy and sleeping well", "Fighting strong opponents", "Intense weightlifting"],
    answer: 0, // 100 push-ups, 100 sit-ups, 100 squats, and 10km running everyday
    explanation: "Saitama's 'simple' training regimen is the source of his immense power.",
  },
  {
    question: "Which anime features a world where humanity lives in walled cities to protect themselves from giant humanoid creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The remnants of humanity in Attack on Titan live within three concentric walls to protect themselves from Titans.",
  },
  {
    question: "What is the name of the main character in 'Jujutsu Kaisen'?",
    options: ["Megumi Fushiguro", "Satoru Gojo", "Yuji Itadori", "Nobara Kugisaki"],
    answer: 2, // Yuji Itadori
    explanation: "Yuji Itadori is the kind-hearted high school student who becomes a Jujutsu Sorcerer.",
  },
  {
    question: "Which anime is about a boy who wants to become the Pirate King?",
    options: ["Naruto", "Bleach", "One Piece", "Fairy Tail"],
    answer: 2, // One Piece
    explanation: "Monkey D. Luffy's ultimate goal is to find the One Piece and become the Pirate King.",
  },
  {
    question: "In 'My Hero Academia', what is the name of the symbol of peace?",
    options: ["Eraser Head", "Endeavor", "All Might", "Hawks"],
    answer: 2, // All Might
    explanation: "All Might is the former No. 1 Hero and the 'Symbol of Peace'.",
  },
  {
    question: "Which anime features a group of students who play basketball?",
    options: ["Haikyuu!!", "Free!", "Kuroko's Basketball", "Yuri!!! on Ice"],
    answer: 2, // Kuroko's Basketball
    explanation: "Kuroko's Basketball focuses on the Seirin High School basketball team and the 'Generation of Miracles'.",
  },
  {
    question: "What is the name of the main character in 'Dragon Ball Super'?",
    options: ["Vegeta", "Gohan", "Goku", "Piccolo"],
    answer: 2, // Goku
    explanation: "Goku continues to be the main character in Dragon Ball Super, achieving new forms and power levels.",
  },
  {
    question: "Which anime is about a boy who becomes a hero for fun?",
    options: ["My Hero Academia", "One-Punch Man", "Mob Psycho 100", "Saiki K."],
    answer: 1, // One-Punch Man
    explanation: "Saitama became a hero 'for fun' and is often bored due to his overwhelming strength.",
  },
  {
    question: "In 'Naruto', what is the name of Sasuke's older brother?",
    options: ["Itachi", "Obito", "Madara", "Shisui"],
    answer: 0, // Itachi
    explanation: "Itachi Uchiha is Sasuke's older brother and a key figure in the Uchiha clan's history.",
  },
  {
    question: "Which anime features a group of assassins?",
    options: ["Akame ga Kill!", "Black Lagoon", "Darker than Black", "Assassination Classroom"],
    answer: 0, // Akame ga Kill!
    explanation: "Akame ga Kill! follows the story of Tatsumi as he joins the assassin group Night Raid.",
  },
  {
    question: "What is the name of the main character in 'Fairy Tail'?",
    options: ["Gray Fullbuster", "Erza Scarlet", "Natsu Dragneel", "Lucy Heartfilia"],
    answer: 2, // Natsu Dragneel
    explanation: "Natsu Dragneel is a fire dragon slayer and one of the main protagonists of Fairy Tail.",
  },
  {
    question: "Which anime is about a young boy who finds a mysterious book that grants him the power to kill anyone whose name he writes in it?",
    options: ["Code Geass", "Death Note", "Psycho-Pass", "Erased"],
    answer: 1, // Death Note
    explanation: "The Death Note allows its user to kill anyone by writing their name while picturing their face.",
  },
  {
    question: "In 'One Piece', what is the name of Zoro's sword style?",
    options: ["Two Sword Style", "Four Sword Style", "Three Sword Style", "One Sword Style"],
    answer: 2, // Three Sword Style
    explanation: "Roronoa Zoro is famous for his Santoryu, or Three Sword Style.",
  },
  {
    question: "Which anime features a school where students are forced to gamble to survive?",
    options: ["Kakegurui", "No Game No Life", "High-Rise Invasion", "Death Parade"],
    answer: 0, // Kakegurui
    explanation: "Hyakkaou Private Academy in Kakegurui uses gambling to determine students' hierarchy.",
  },
  {
    question: "What is the name of the main character in 'Hunter x Hunter'?",
    options: ["Killua Zoldyck", "Kurapika", "Leorio Paradinight", "Gon Freecss"],
    answer: 3, // Gon Freecss
    explanation: "Gon Freecss is the cheerful and determined main protagonist of Hunter x Hunter.",
  },
  {
    question: "Which anime is about a boy who can see ghosts and helps them pass on?",
    options: ["Bleach", "Noragami", "Mushishi", "Natsume's Book of Friends"],
    answer: 1, // Noragami
    explanation: "Yato, a minor deity in Noragami, helps spirits and grants wishes for a small fee.",
  },
  {
    question: "In 'Attack on Titan', what is the name of Eren's adoptive sister?",
    options: ["Sasha Blouse", "Hange Zoë", "Mikasa Ackerman", "Annie Leonhart"],
    answer: 2, // Mikasa Ackerman
    explanation: "Mikasa Ackerman was adopted into the Yeager family and is fiercely protective of Eren.",
  },
  {
    question: "Which anime features a world where humans are protected by giant walls from monstrous creatures?",
    options: ["Kabaneri of the Iron Fortress", "God Eater", "Attack on Titan", "Seraph of the End"],
    answer: 2, // Attack on Titan
    explanation: "The last remnants of humanity in Attack on Titan live within three layers of massive walls to protect themselves from the Titans.",
  },
  {
    question: "What is the name of the main character in 'Re:Zero - Starting Life in Another World'?",
    options: ["Rem", "Ram", "Emilia", "Subaru Natsuki"],
    answer: 3, // Subaru Natsuki
    explanation: "Subaru Natsuki is transported to a fantasy world and gains the ability 'Return by Death'.",
  },
  {
    question: "Which anime is about a boy who can control shadows?",
    options: ["Black Butler", "Noragami", "Kageyama-kun", "Shadows House"],
    answer: 0, // Black Butler (Sebastian Michaelis has shadow-like abilities)
    explanation: "Sebastian Michaelis, the demon butler in Black Butler, often uses shadow-like abilities.",
  },
  {
    question: "In 'Fullmetal Alchemist: Brotherhood', what is the name of the country where the story takes place?",
    options: ["Xing", "Drachma", "Amestris", "Creta"],
    answer: 2, // Amestris
    explanation: "Amestris is the militaristic country where the Elric brothers' journey unfolds.",
  },
  {
    question: "Which anime features a group of high school students who solve mysteries?",
    options: ["Hyouka", "Detective Conan", "Erased", "Bungo Stray Dogs"],
    answer: 0, // Hyouka
    explanation: "Hyouka follows the Classic Literature Club as they solve various mysteries.",
  },
  {
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
    answer: 2, // Tokyo
    explanation: "Tokyo is the current capital and largest city of Japan.",
  },
  {
    question: "What is the name of the traditional Japanese garment?",
    options: ["Hanbok", "Kimono", "Sari", "Cheongsam"],
    answer: 1, // Kimono
    explanation: "The Kimono is a traditional Japanese robe-like garment.",
  },
  {
    question: "Which Japanese mountain is considered sacred and is a popular pilgrimage site?",
    options: ["Mount Fuji", "Mount Aso", "Mount Ontake", "Mount Kita"],
    answer: 0, // Mount Fuji
    explanation: "Mount Fuji is Japan's highest peak and an iconic symbol, revered as sacred.",
  },
  {
    question: "What is the traditional Japanese art of paper folding?",
    options: ["Ikebana", "Origami", "Bonsai", "Calligraphy"],
    answer: 1, // Origami
    explanation: "Origami is the art of folding paper into decorative shapes and figures.",
  },
  {
    question: "Which Japanese city was the first to be hit by an atomic bomb?",
    options: ["Nagasaki", "Hiroshima", "Kyoto", "Osaka"],
    answer: 1, // Hiroshima
    explanation: "Hiroshima was the first city to be devastated by an atomic bomb during World War II.",
  },
  {
    question: "What is the name of the Japanese martial art that focuses on throws and grappling?",
    options: ["Karate", "Kendo", "Judo", "Aikido"],
    answer: 2, // Judo
    explanation: "Judo is a Japanese martial art and Olympic sport focusing on throws, takedowns, and grappling.",
  },
  {
    question: "Which Japanese food consists of vinegared rice combined with other ingredients, often seafood?",
    options: ["Ramen", "Tempura", "Sushi", "Udon"],
    answer: 2, // Sushi
    explanation: "Sushi is a traditional Japanese dish of prepared vinegared rice, usually with seafood or vegetables.",
  },
  {
    question: "What is the national flower of Japan?",
    options: ["Rose", "Cherry Blossom", "Lotus", "Chrysanthemum"],
    answer: 1, // Cherry Blossom
    explanation: "The cherry blossom (sakura) is a highly symbolic and cherished national flower of Japan.",
  },
  {
    question: "Which Japanese sport involves two wrestlers trying to force each other out of a circular ring?",
    options: ["Kendo", "Judo", "Sumo", "Karate"],
    answer: 2, // Sumo
    explanation: "Sumo is a competitive full-contact wrestling sport where a rikishi (wrestler) attempts to force another wrestler out of a circular ring.",
  },
  {
    question: "What is the name of the famous Japanese bullet train?",
    options: ["Shinkansen", "Maglev", "TGV", "ICE"],
    answer: 0, // Shinkansen
    explanation: "The Shinkansen is Japan's network of high-speed railway lines.",
  },
];

// Shuffle function to randomize the order of questions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const QUIZ_LENGTH = 10; // Number of questions per session
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade animation
  const scaleAnim = useRef(new Animated.Value(0)).current; // For pop-in animation

  // Ref to store the sound object for control
  const soundObjectRef = useRef(null); // <--- Place this line here!

  // Function to initialize a new quiz session
  const startNewQuizSession = () => {
    setIsLoading(true);
    setTimeout(() => {
      const shuffledAllQuestions = shuffleArray([...allQuizQuestions]);
      // Take the first QUIZ_LENGTH questions for the current session
      setSessionQuestions(shuffledAllQuestions.slice(0, QUIZ_LENGTH));
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowResultModal(false);
      setIsLoading(false);
      // Start initial animations after loading
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500); // 1.5 seconds loading
  };


  // --- Define the playBackgroundMusic function here ---
  const playBackgroundMusic = async () => {
    try {
      // IMPORTANT: Update this path to your actual audio file!
      // Example: require('./assets/audio/calm_music.mp3')
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/audio/audio1bg.mp3'), // <--- **UPDATE THIS PATH**
        { shouldPlay: true, isLooping: true, volume: 0.5 } // Play immediately, loop, set volume
      );
      soundObjectRef.current = sound; // Store sound object in ref
    } catch (error) {
      console.log('Error playing background music:', error);
    }
  };
  // --- End of playBackgroundMusic function definition ---
  
  // --- THIS IS YOUR UPDATED useEffect HOOK ---
  useEffect(() => {
    startNewQuizSession(); // This sets up your quiz questions
    playBackgroundMusic(); // This starts the background music

    // Cleanup function: This runs when the component is removed from the screen.
    // It's crucial for stopping the music and releasing resources to prevent memory leaks.
    return () => {
      if (soundObjectRef.current) {
        soundObjectRef.current.stopAsync();
        soundObjectRef.current.unloadAsync();
      }
    };
  }, []); // The empty array means this effect runs only once after the initial render.
  // --- END OF UPDATED useEffect HOOK --- 

  // Function to handle option selection
  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    // Score is updated immediately upon selection
    if (optionIndex === sessionQuestions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  // Function to navigate to the next question or show results
  const handleNextQuestion = () => {
    if (selectedOption === null) {
      Alert.alert("Please select an option!", "You must choose an answer before proceeding.");
      return;
    }

    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for next question
      // Reset animations for next question
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setShowResultModal(true); // Show modal when quiz ends
    }
  };

  // Function to restart the quiz
  const restartQuiz = () => {
    startNewQuizSession(); // Start a completely new session with new random questions
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={[styles.quizCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {sessionQuestions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && styles.selectedOption,
                selectedOption !== null && index === currentQuestion.answer && styles.correctOption,
                selectedOption !== null && selectedOption === index && selectedOption !== currentQuestion.answer && styles.incorrectOption,
              ]}
              onPress={() => handleOptionSelect(index)}
              disabled={selectedOption !== null} // Disable options after one is selected
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display explanation if an option has been selected */}
        {selectedOption !== null && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextQuestion}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < sessionQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Result Modal */}
      <Modal isVisible={showResultModal} animationIn="zoomIn" animationOut="zoomOut">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Quiz Completed!</Text>
          <Text style={styles.modalScore}>
            You scored {score} out of {sessionQuestions.length}
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Vibrant purple background
    backgroundColor: '#4B0082', // Indigo
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B0082', // Indigo
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#BB86FC', // Light purple for text
    fontFamily: 'Inter',
  },
  quizCard: {
    backgroundColor: '#6200EE', // Darker purple for card
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BB86FC', // Light purple border
  },
  questionNumber: {
    fontSize: 16,
    color: '#E0BBE4', // Lighter purple for question number
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF', // White text for questions
    fontFamily: 'Inter',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#8A2BE2', // BlueViolet for options
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BB86FC', // Light purple border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF', // White text for options
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  selectedOption: {
    borderColor: '#03DAC6', // Teal for selected option
    borderWidth: 3,
  },
  correctOption: {
    backgroundColor: '#03DAC6', // Teal for correct
    borderColor: '#018786', // Darker teal
  },
  incorrectOption: {
    backgroundColor: '#CF6679', // Light red for incorrect
    borderColor: '#B00020', // Darker red
  },
  explanationContainer: {
    backgroundColor: '#3700B3', // Even darker purple for explanation background
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03DAC6', // Teal for explanation title
    marginBottom: 5,
    fontFamily: 'Inter',
  },
  explanationText: {
    fontSize: 15,
    color: '#E0BBE4', // Lighter purple for explanation text
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
    paddingVertical: 12,
    paddingHorizontal: 25,
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
});

export default App;
