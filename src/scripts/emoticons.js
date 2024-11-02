import { escapeRegExp } from "./escapeRegExp.js";

//._delays isnt used in code but is used for manualy calculating the keyframes in CSS

const _emoticons = [
  // Order of these two is important
  { img: require('../images/emoticons/msn_75.png'), gif: require('../images/emoticons/msn_75.gif'), key: "Party", text: "&lt;:o)" },
  { img: require('../images/emoticons/msn_19.png'), key: "Dog face", text: "(&amp;)" },
  // Order of the following don't matter
  { img: require('../images/emoticons/msn_01.png'), key: "Smile", text: [":-)", ":)"] },
  { img: require('../images/emoticons/msn_02.png'), key: "Open-mouthed", text: [":-D", ":d"] },
  { img: require('../images/emoticons/msn_03.png'), gif: require('../images/emoticons/msn_03.gif'), key: "Wink", text: [";-)", ";)"] },
  { img: require('../images/emoticons/msn_04.png'), key: "Surprised", text: [":-O", ":o"] },
  { img: require('../images/emoticons/msn_05.png'), key: "Tongue out", text: [":-P", ":p"] },
  { img: require('../images/emoticons/msn_06.png'), key: "Hot", text: "(H)" },
  { img: require('../images/emoticons/msn_07.png'), key: "Angry", text: [":-@", ":@"] },
  { img: require('../images/emoticons/msn_08.png'), key: "Embarrassed", text: [":-$", ":$"] },
  { img: require('../images/emoticons/msn_09.png'), key: "Confused", text: [":-S", ":s"] },
  { img: require('../images/emoticons/msn_10.png'), key: "Sad", text: [":-(", ":("] },
  { img: require('../images/emoticons/msn_11.png'), gif: require('../images/emoticons/msn_11.gif'), key: "Crying", text: ":'(" },
  { img: require('../images/emoticons/msn_12.png'), key: "Disappointed", text: [":-|", ":|"] },
  { img: require('../images/emoticons/msn_13.png'), key: "Devil", text: "(6)" },
  { img: require('../images/emoticons/msn_14.png'), key: "Angel", text: "(A)" },
  { img: require('../images/emoticons/msn_15.png'), key: "Red heart", text: "(L)" },
  { img: require('../images/emoticons/msn_16.png'), key: "Broken heart", text: "(U)" },
  { img: require('../images/emoticons/msn_17.png'), key: "MSN Messenger icon", text: "(M)" },
  { img: require('../images/emoticons/msn_18.png'), key: "Cat face", text: "(@)" },
  //Note: 75 must come before 03
  { img: require('../images/emoticons/msn_20.png'), key: "Sleeping half-moon", text: "(S)" },
  { img: require('../images/emoticons/msn_21.png'), key: "Star", text: "(*)" },
  { img: require('../images/emoticons/msn_22.png'), key: "Filmstrip", text: "(~)" },
  { img: require('../images/emoticons/msn_23.png'), key: "Note", text: "(8)" },
  { img: require('../images/emoticons/msn_24.png'), key: "E-mail", text: "(E)" },
  { img: require('../images/emoticons/msn_25.png'), key: "Red rose", text: "(F)" },
  { img: require('../images/emoticons/msn_26.png'), key: "Wilted rose", text: "(W)" },
  { img: require('../images/emoticons/msn_27.png'), key: "Clock", text: "(O)" },
  { img: require('../images/emoticons/msn_28.png'), key: "Red lips", text: "(K)" },
  { img: require('../images/emoticons/msn_29.png'), key: "Gift with a bow", text: "(G)" },
  { img: require('../images/emoticons/msn_30.png'), gif: require('../images/emoticons/msn_30.gif'), key: "Birthday cake", text: "(^)" },
  { img: require('../images/emoticons/msn_31.png'), key: "Camera", text: "(P)" },
  { img: require('../images/emoticons/msn_32.png'), key: "Light bulb", text: "(I)" },
  { img: require('../images/emoticons/msn_33.png'), key: "Coffee cup", text: "(C)" },
  { img: require('../images/emoticons/msn_34.png'), key: "Telephone receiver", text: "(T)" },
  { img: require('../images/emoticons/msn_35.png'), key: "Left hug", text: "({)" },
  { img: require('../images/emoticons/msn_36.png'), key: "Right hug", text: "(})" },
  { img: require('../images/emoticons/msn_37.png'), key: "Beer mug", text: "(B)" },
  { img: require('../images/emoticons/msn_38.png'), key: "Martini glass", text: "(D)" },
  { img: require('../images/emoticons/msn_39.png'), key: "Boy", text: "(Z)" },
  { img: require('../images/emoticons/msn_40.png'), key: "Girl", text: "(X)" },
  { img: require('../images/emoticons/msn_41.png'), key: "Thumbs up", text: "(Y)" },
  { img: require('../images/emoticons/msn_42.png'), key: "Thumbs down", text: "(N)" },
  { img: require('../images/emoticons/msn_43.png'), gif: require('../images/emoticons/msn_43.gif'), key: "Vampire bat", text: [":-[", ":["], },
  { img: require('../images/emoticons/msn_44.png'), key: "ASL", text: "(?)" },
  { img: require('../images/emoticons/msn_45.png'), key: "Handcuffs", text: "(%)" },
  { img: require('../images/emoticons/msn_46.png'), key: "Sunshine", text: "(#)" },
  { img: require('../images/emoticons/msn_47.png'), key: "Rainbow", text: "(R)" },
  { img: require('../images/emoticons/msn_48.png'), key: "Don't tell anyone", text: ":-#" },
  { img: require('../images/emoticons/msn_49.png'), key: "Baring teeth", text: "8o|" },
  { img: require('../images/emoticons/msn_50.png'), key: "Nerd", text: "8-|" },
  { img: require('../images/emoticons/msn_51.png'), key: "Sarcastic", text: "^o)" },
  { img: require('../images/emoticons/msn_52.png'), key: "Secret telling", text: ":-*" },
  { img: require('../images/emoticons/msn_53.png'), key: "Sick", text: "+o(" },
  { img: require('../images/emoticons/msn_54.png'), key: "Snail", text: "(sn)" },
  { img: require('../images/emoticons/msn_55.png'), key: "Turtle", text: "(tu)" },
  { img: require('../images/emoticons/msn_56.png'), key: "Plate", text: "(pl)" },
  { img: require('../images/emoticons/msn_57.png'), key: "Bowl", text: "(||)" },
  { img: require('../images/emoticons/msn_58.png'), key: "Pizza", text: "(pi)" },
  { img: require('../images/emoticons/msn_59.png'), key: "Soccer ball", text: "(so)" },
  { img: require('../images/emoticons/msn_60.png'), key: "Auto", text: "(au)" },
  { img: require('../images/emoticons/msn_61.png'), key: "Airplane", text: "(ap)" },
  { img: require('../images/emoticons/msn_62.png'), key: "Umbrella", text: "(um)" },
  { img: require('../images/emoticons/msn_63.png'), key: "Island with a palm tree", text: "(ip)" },
  { img: require('../images/emoticons/msn_64.png'), key: "Computer", text: "(co)" },
  { img: require('../images/emoticons/msn_65.png'), key: "Mobile Phone", text: "(mp)" },
  { img: require('../images/emoticons/msn_66.png'), key: "Be Right Back", text: "(brb)" },
  { img: require('../images/emoticons/msn_67.png'), key: "Stormy cloud", text: "(st)" },
  { img: require('../images/emoticons/msn_68.png'), key: "Fingers crossed", text: "(yn)" },
  { img: require('../images/emoticons/msn_69.png'), key: "High five", text: "(h5)" },
  { img: require('../images/emoticons/msn_70.png'), key: "Money", text: "(mo)" },
  { img: require('../images/emoticons/msn_71.png'), key: "Black Sheep", text: "(bah)" },
  { img: require('../images/emoticons/msn_72.png'), gif: require('../images/emoticons/msn_72.gif'), key: "I don't know", text: ":^)" },
  { img: require('../images/emoticons/msn_73.png'), gif: require('../images/emoticons/msn_73.gif'), key: "Thinking", text: "*-)" },
  { img: require('../images/emoticons/msn_74.png'), gif: require('../images/emoticons/msn_74.gif'), key: "Lightning", text: "(li)" },
  //Note: 75 must come before 04
  { img: require('../images/emoticons/msn_76.png'), gif: require('../images/emoticons/msn_76.gif'), key: "Eye-rolling", text: "8-)" },
  { img: require('../images/emoticons/msn_77.png'), gif: require('../images/emoticons/msn_77.gif'), key: "Smoking", text: "(ci)" },
  { img: require('../images/emoticons/msn_78.png'), gif: require('../images/emoticons/msn_78.gif'), key: "Sleepy", text: "|-)" },
  { img: require('../images/emoticons/msn_79.png'), key: "Xbox", text: "(xx)" },
];

const emoticons = _emoticons.map((emoticon) => ({
  ...emoticon,
  // Add regex
  regex: (Array.isArray(emoticon.text) ? emoticon.text : [emoticon.text]).map(
    (text) => new RegExp(escapeRegExp(text), "ig")
  )
}));

export { emoticons };
