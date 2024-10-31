import { escapeRegExp } from "./escapeRegExp.js";

//._delays isnt used in code but is used for manualy calculating the keyframes in CSS

const _emoticons = [
  // Order of these two is important
  { img: "msn_75.png", gif: "msn_75.gif", key: "Party", text: "&lt;:o)" },
  { img: "msn_19.png", key: "Dog face", text: "(&amp;)" },
  // Order of the following don't matter
  { img: "msn_01.png", key: "Smile", text: [":-)", ":)"] },
  { img: "msn_02.png", key: "Open-mouthed", text: [":-D", ":d"] },
  { img: "msn_03.png", gif: "msn_03.gif", key: "Wink", text: [";-)", ";)"] },
  { img: "msn_04.png", key: "Surprised", text: [":-O", ":o"] },
  { img: "msn_05.png", key: "Tongue out", text: [":-P", ":p"] },
  { img: "msn_06.png", key: "Hot", text: "(H)" },
  { img: "msn_07.png", key: "Angry", text: [":-@", ":@"] },
  { img: "msn_08.png", key: "Embarrassed", text: [":-$", ":$"] },
  { img: "msn_09.png", key: "Confused", text: [":-S", ":s"] },
  { img: "msn_10.png", key: "Sad", text: [":-(", ":("] },
  { img: "msn_11.png", gif: "msn_11.gif", key: "Crying", text: ":'(" },
  { img: "msn_12.png", key: "Disappointed", text: [":-|", ":|"] },
  { img: "msn_13.png", key: "Devil", text: "(6)" },
  { img: "msn_14.png", key: "Angel", text: "(A)" },
  { img: "msn_15.png", key: "Red heart", text: "(L)" },
  { img: "msn_16.png", key: "Broken heart", text: "(U)" },
  { img: "msn_17.png", key: "MSN Messenger icon", text: "(M)" },
  { img: "msn_18.png", key: "Cat face", text: "(@)" },
  //Note: 75 must come before 03
  { img: "msn_20.png", key: "Sleeping half-moon", text: "(S)" },
  { img: "msn_21.png", key: "Star", text: "(*)" },
  { img: "msn_22.png", key: "Filmstrip", text: "(~)" },
  { img: "msn_23.png", key: "Note", text: "(8)" },
  { img: "msn_24.png", key: "E-mail", text: "(E)" },
  { img: "msn_25.png", key: "Red rose", text: "(F)" },
  { img: "msn_26.png", key: "Wilted rose", text: "(W)" },
  { img: "msn_27.png", key: "Clock", text: "(O)" },
  { img: "msn_28.png", key: "Red lips", text: "(K)" },
  { img: "msn_29.png", key: "Gift with a bow", text: "(G)" },
  { img: "msn_30.png", gif: "msn_30.gif", key: "Birthday cake", text: "(^)" },
  { img: "msn_31.png", key: "Camera", text: "(P)" },
  { img: "msn_32.png", key: "Light bulb", text: "(I)" },
  { img: "msn_33.png", key: "Coffee cup", text: "(C)" },
  { img: "msn_34.png", key: "Telephone receiver", text: "(T)" },
  { img: "msn_35.png", key: "Left hug", text: "({)" },
  { img: "msn_36.png", key: "Right hug", text: "(})" },
  { img: "msn_37.png", key: "Beer mug", text: "(B)" },
  { img: "msn_38.png", key: "Martini glass", text: "(D)" },
  { img: "msn_39.png", key: "Boy", text: "(Z)" },
  { img: "msn_40.png", key: "Girl", text: "(X)" },
  { img: "msn_41.png", key: "Thumbs up", text: "(Y)" },
  { img: "msn_42.png", key: "Thumbs down", text: "(N)" },
  { img: "msn_43.png", gif: "msn_43.gif", key: "Vampire bat", text: [":-[", ":["], },
  { img: "msn_44.png", key: "ASL", text: "(?)" },
  { img: "msn_45.png", key: "Handcuffs", text: "(%)" },
  { img: "msn_46.png", key: "Sunshine", text: "(#)" },
  { img: "msn_47.png", key: "Rainbow", text: "(R)" },
  { img: "msn_48.png", key: "Don't tell anyone", text: ":-#" },
  { img: "msn_49.png", key: "Baring teeth", text: "8o|" },
  { img: "msn_50.png", key: "Nerd", text: "8-|" },
  { img: "msn_51.png", key: "Sarcastic", text: "^o)" },
  { img: "msn_52.png", key: "Secret telling", text: ":-*" },
  { img: "msn_53.png", key: "Sick", text: "+o(" },
  { img: "msn_54.png", key: "Snail", text: "(sn)" },
  { img: "msn_55.png", key: "Turtle", text: "(tu)" },
  { img: "msn_56.png", key: "Plate", text: "(pl)" },
  { img: "msn_57.png", key: "Bowl", text: "(||)" },
  { img: "msn_58.png", key: "Pizza", text: "(pi)" },
  { img: "msn_59.png", key: "Soccer ball", text: "(so)" },
  { img: "msn_60.png", key: "Auto", text: "(au)" },
  { img: "msn_61.png", key: "Airplane", text: "(ap)" },
  { img: "msn_62.png", key: "Umbrella", text: "(um)" },
  { img: "msn_63.png", key: "Island with a palm tree", text: "(ip)" },
  { img: "msn_64.png", key: "Computer", text: "(co)" },
  { img: "msn_65.png", key: "Mobile Phone", text: "(mp)" },
  { img: "msn_66.png", key: "Be Right Back", text: "(brb)" },
  { img: "msn_67.png", key: "Stormy cloud", text: "(st)" },
  { img: "msn_68.png", key: "Fingers crossed", text: "(yn)" },
  { img: "msn_69.png", key: "High five", text: "(h5)" },
  { img: "msn_70.png", key: "Money", text: "(mo)" },
  { img: "msn_71.png", key: "Black Sheep", text: "(bah)" },
  { img: "msn_72.png", gif: "msn_72.gif", key: "I don't know", text: ":^)" },
  { img: "msn_73.png", gif: "msn_73.gif", key: "Thinking", text: "*-)" },
  { img: "msn_74.png", gif: "msn_74.gif", key: "Lightning", text: "(li)" },
  //Note: 75 must come before 04
  { img: "msn_76.png", gif: "msn_76.gif", key: "Eye-rolling", text: "8-)" },
  { img: "msn_77.png", gif: "msn_77.gif", key: "Smoking", text: "(ci)" },
  { img: "msn_78.png", gif: "msn_78.gif", key: "Sleepy", text: "|-)" },
  { img: "msn_79.png", key: "Xbox", text: "(xx)" },
];

const emoticons = _emoticons.map((emoticon) => ({
  ...emoticon,
  // Add regex
  regex: (Array.isArray(emoticon.text) ? emoticon.text : [emoticon.text]).map(
    (text) => new RegExp(escapeRegExp(text), "ig")
  ),
  // Change img to include prefix
  img: `images/emoticons/${emoticon.img}`,
  ...(emoticon.gif && {
    gif: `images/emoticons/${emoticon.gif}`,
  }),
}));

export { emoticons };
