import { describe, expect, it } from "vitest";
import { classify_to_book_index, set_fuzzy_search_book_list } from "./classify_to_book_index";

const slovakFuzzyBookList = [
  ["Genesis", "Gn", "ge", "gen", "1. Mojžišová", "Genezis", "1mo"],
  ["Exodus", "Ex", "2. Mojžišová", "2mo"],
  ["Leviticus", "Lv", "lev", "3. Mojžišová", "Levitikus", "3mo"],
  ["Numbers", "num", "Nm", "4. Mojžišová", "Numery", "Numeri", "4mo"],
  ["Deuteronomy", "5. Mojžišová", "Deuteronómia", "deut", "5mo", "Dt"],
  ["Joshua", "Jo", "Jozue", "Joz"],
  ["Judges", "Jdg", "Sudcov", "Sud", "Sdc"],
  ["Ruth", "Ru", "Rút"],
  ["1 Samuel", "1sa", "1Sam", "1s", "1. Samuelova"],
  ["2 Samuel", "2sa", "2Sam", "2s", "2. Samuelova"],
  ["1 Kings", "1k", "1ki", "1. Kráľov", "1Krl"],
  ["2 Kings", "2k", "2ki", "2. Kráľov", "2Krl"],
  ["1 Chronicles", "1ch", "1. Kronícka", "1 Kron", "1. Paralipomenom", "1Krn"],
  ["2 Chronicles", "2ch", "2. Kronícka", "2 Kron", "2. Paralipomenom", "2Krn"],
  ["Ezra", "Ezdráš", "Ezr", "Ezd"],
  ["Nehemiah", "Neh", "Nehemiáš"],
  ["Esther", "Ester", "Est"],
  ["Job", "Jb"],
  ["Psalms", "Ps", "Žalmy", "Žlm", "Ž"],
  ["Proverbs", "Prov", "Príslovia", "Poviedky", "Pris", "Prís"],
  ["Ecclesiastes", "Ecc", "Kohelet", "Koh", "Kazateľ", "Kaz"],
  ["Song of Solomon", "Song", "Pieseň piesní", "Pieseň Šalamúnová", "Velpieseň", "Pie", "Vľp"],
  ["Isaiah", "Is", "Izaiáš", "Iz"],
  ["Jeremiah", "Jer", "Jeremiáš"],
  ["Lamentations", "Lam", "Náreky", "Nár", "Plač", "Plač Jeremiášov"],
  ["Ezekiel", "Ez", "Ezechiel"],
  ["Daniel", "Da", "Dan"],
  ["Hosea", "Hos", "Ozeáš", "Os", "Oz"],
  ["Joel", "Jl", "Jóel"],
  ["Amos", "Am"],
  ["Obadiah", "Ob", "Abdiáš", "Abd"],
  ["Jonah", "Jon", "Jonáš"],
  ["Micah", "Mic", "Mich", "Micheáš"],
  ["Nahum", "Na", "Nah"],
  ["Habakkuk", "Habakuk", "Hab"],
  ["Zephaniah", "Zep", "Sofoniáš", "Sof"],
  ["Haggai", "Hag", "Aggeus", "Ag"],
  ["Zechariah", "Zec", "Zachariáš", "Zach"],
  ["Malachi", "Mal", "Malachiáš"],
  ["Matthew", "Mt", "Matúš"],
  ["Mark", "Mk", "Mr", "Marek"],
  ["Luke", "Lk", "Lukáš"],
  ["John", "Jn", "Ján"],
  ["Acts", "Ac", "Skutky apoštolov", "Sk"],
  ["Romans", "Rm", "Rom", "Rimanom", "Rim"],
  ["1 Corinthians", "1 Cor", "1co", "1. list Korinťanom", "1Kor"],
  ["2 Corinthians", "2 Cor", "2co", "2. list Korinťanom", "2Kor"],
  ["Galatians", "Gal", "Ga"],
  ["Ephesians", "Eph", "Efezanom", "Ef"],
  ["Philippians", "Php", "Flp", "Filipanom"],
  ["Colossians", "Col", "Kol", "Kolosanom"],
  ["1 Thessalonians", "1 Th", "1th", "1Tes", "1. list Solúňanom"],
  ["2 Thessalonians", "2 Th", "2th", "2Tes", "2. list Solúňanom"],
  ["1 Timothy", "1 Ti", "1ti", "1Tim", "1. list Timotejovi"],
  ["2 Timothy", "2 Ti", "2ti", "2Tim", "2. list Timotejovi"],
  ["Titus", "Tit", "Títovi"],
  ["Philemon", "Phm", "Filemonovi", "Flm"],
  ["Hebrews", "Heb", "Židom"],
  ["James", "Jas", "Jakubov", "Jk"],
  ["1 Peter", "1 Pe", "1pe", "1Pt", "1. list Petrov"],
  ["2 Peter", "2 Pe", "2pe", "2Pt", "2. list Petrov"],
  ["1 John", "1 Jn", "1jn", "1. janov list"],
  ["2 John", "2 Jn", "2jn", "2. janov list"],
  ["3 John", "3 Jn", "3jn", "3. janov list"],
  ["Jude", "Jud", "Júdov"],
  ["Revelation", "Rev", "Zjavenie Jána", "Zjv", "Zj"],
];

describe("Lookup books of bible", () => {
  it("Non-comprehensive testing", async () => {
    expect(classify_to_book_index("mt")).toBe(39);
    expect(classify_to_book_index("mat")).toBe(39);
    expect(classify_to_book_index("matthew")).toBe(39);
    expect(classify_to_book_index("matus")).toBe(-1);

    set_fuzzy_search_book_list(slovakFuzzyBookList);

    expect(classify_to_book_index("matus")).toBe(39);
  });
});
