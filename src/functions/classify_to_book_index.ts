import FuseJs from "fuse.js";

const normalize = (input: string) => input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const defaultFuzzyBooks = [
  ["Genesis", "Gn", "Ge", "Gen"],
  ["Exodus", "Ex"],
  ["Leviticus", "Lv", "Lev"],
  ["Numbers", "num", "Nm"],
  ["Deuteronomy", "Deut", "Dt"],
  ["Joshua", "Jo"],
  ["Judges", "Jdg"],
  ["Ruth", "Ru"],
  ["1 Samuel", "1sa", "1Sam", "1s"],
  ["2 Samuel", "2sa", "2Sam", "2s"],
  ["1 Kings", "1k", "1ki"],
  ["2 Kings", "2k", "2ki"],
  ["1 Chronicles", "1ch"],
  ["2 Chronicles", "2ch"],
  ["Ezra", "Ezr"],
  ["Nehemiah", "Neh"],
  ["Esther", "Ester", "Est"],
  ["Job", "Jb"],
  ["Psalms", "Ps"],
  ["Proverbs", "Prov"],
  ["Ecclesiastes", "Ecc"],
  ["Song of Solomon", "Song"],
  ["Isaiah", "Is"],
  ["Jeremiah", "Jer"],
  ["Lamentations", "Lam"],
  ["Ezekiel", "Ez"],
  ["Daniel", "Da", "Dan"],
  ["Hosea", "Hos"],
  ["Joel", "Jl"],
  ["Amos", "Am"],
  ["Obadiah", "Ob"],
  ["Jonah", "Jon"],
  ["Micah", "Mic"],
  ["Nahum", "Na", "Nah"],
  ["Habakkuk", "Hab"],
  ["Zephaniah", "Zep"],
  ["Haggai", "Hag"],
  ["Zechariah", "Zec"],
  ["Malachi", "Mal"],
  ["Matthew", "Mt"],
  ["Mark", "Mk"],
  ["Luke", "Lk"],
  ["John", "Jn"],
  ["Acts", "Ac"],
  ["Romans", "Rm", "Rom"],
  ["1 Corinthians", "1 Cor", "1co"],
  ["2 Corinthians", "2 Cor", "2co"],
  ["Galatians", "Gal", "Ga"],
  ["Ephesians", "Eph"],
  ["Philippians", "Php"],
  ["Colossians", "Col"],
  ["1 Thessalonians", "1 Th", "1th"],
  ["2 Thessalonians", "2 Th", "2th"],
  ["1 Timothy", "1 Ti", "1ti", "1Tim"],
  ["2 Timothy", "2 Ti", "2ti", "2Tim"],
  ["Titus", "Tit"],
  ["Philemon", "Phm"],
  ["Hebrews", "Heb"],
  ["James", "Jas"],
  ["1 Peter", "1 Pe", "1pe"],
  ["2 Peter", "2 Pe", "2pe"],
  ["1 John", "1 Jn"],
  ["2 John", "2 Jn"],
  ["3 John", "3 Jn"],
  ["Jude", "Jud"],
  ["Revelation", "Rev"],
].map((entries) => entries.map(normalize));

let fuzzyBooks = defaultFuzzyBooks;
let Fuse = new FuseJs(fuzzyBooks.flatMap((v) => v).map(normalize), { includeScore: true });

const classify_to_book_index = (query: string) => {
  const results = Fuse.search(normalize(query)).filter((v) => v?.score === 0 || !v.score || v.score < 0.1);
  if (results.length > 0) {
    const resolvedBookIndex = fuzzyBooks.findIndex((book) => book.map(normalize).includes((results[0] as any).item));
    return resolvedBookIndex;
  } else {
    return -1;
  }
};

/**
 *
 * @param customFuzzyBookList An array with 66 books of the bible, each book is an array of various strings the book might be referenced by. If left blank, defaults will be loaded.
 */
const set_fuzzy_search_book_list = (customFuzzyBookList: string[][] = defaultFuzzyBooks) => {
  fuzzyBooks = customFuzzyBookList;
  Fuse = new FuseJs(fuzzyBooks.flatMap((v) => v).map(normalize), { includeScore: true });
};

export { classify_to_book_index, set_fuzzy_search_book_list };
