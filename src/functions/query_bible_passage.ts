import { bibles } from "./bible_manager";
import { classify_to_book_index } from "./classify_to_book_index";
import parse_passage from "./parse_passage";

let default_translation = "KJV";

const normalize = (input: string) => input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const set_default_translation = (translation_code: string) => {
  if (
    Object.keys(bibles)
      .map((_) => _.toLowerCase())
      .includes(translation_code.toLowerCase())
  ) {
    default_translation = translation_code;
  } else {
    throw new Error(`Unknown translation: "${translation_code}"`);
  }
};

const query_bible_passage = (query: string) => {
  const regex = new RegExp(/(((^| |,|;)[1-3]? ?[\(\)a-z\.]+)|([\d:,;-])+)/gi);

  query = query.replace(/ ?- ?/g, "-").replace(/ ?; ?/g, ";").replace(/ ?, ?/g, ",").replace(/ ?: ?/g, ":");

  const parts = [...normalize(query).matchAll(regex)].map((v) => v[0].replace(/(^[\( ,;\-]+)|([\( ,;\-]+$)/g, ""));
  console.log(parts);
  let book_index: number;
  let translation: string;

  let list_of_passages_before_parsing: {
    book_index: number;
    unparsed_passage: string;
    translation: string;
  }[] = [];

  parts.forEach((part) => {
    if (Object.keys(bibles).includes(part.toUpperCase())) {
      translation = part.toUpperCase();
      list_of_passages_before_parsing = list_of_passages_before_parsing.map((v) => ({
        ...v,
        translation: v.translation === "WAITING_FOR_ASSIGNMENT" ? translation : v.translation,
      }));
    } else if (/[a-zA-Z]/.test(part)) {
      const found_book_index = classify_to_book_index(part);
      if (found_book_index >= 0) {
        book_index = found_book_index;
        list_of_passages_before_parsing = list_of_passages_before_parsing.map((v) => ({
          ...v,
          translation: v.translation === "WAITING_FOR_ASSIGNMENT" ? default_translation : v.translation,
        }));
      } else {
        // console.error(`Unknown book ${part}`);
      }
    } else if (book_index >= 0) {
      //likely a passage
      list_of_passages_before_parsing.push({
        book_index,
        unparsed_passage: part,
        translation: "WAITING_FOR_ASSIGNMENT",
      });
    }
  });

  list_of_passages_before_parsing = list_of_passages_before_parsing.map((v) => ({
    ...v,
    translation: v.translation === "WAITING_FOR_ASSIGNMENT" ? default_translation : v.translation,
  }));

  const parsed = list_of_passages_before_parsing.flatMap((entry) => {
    const { book_index, unparsed_passage, translation } = entry;
    const bible = bibles[translation];
    if (bible) {
      // bible.bookKey[book_index]
      const book_key = bible.bookKey[book_index];
      const verse_counts = bible.verseCounts[book_key as string];

      if (!book_key || !verse_counts) {
        throw new Error(
          "Invalid verse counts provided. Make sure that your fuzzy_search_book_list has identical book count as chosen bible translation."
        );
      }
      const passages = parse_passage(unparsed_passage, verse_counts);
      if (Array.isArray(passages))
        return passages.map((p) => {
          const content =
            p.type === "single"
              ? bible.chapters
                  .find((ch) => ch.chapterNumber === p.chapter && ch.book === book_key)
                  ?.content.filter(
                    (_, i, a: any) =>
                      a[i][0] === p.verse ||
                      (i < a.length - 1 && a[i + 1][0] === p.verse && typeof a[i][0] !== "number")
                  )
              : bible.chapters
                  .filter(
                    (ch) =>
                      ch.book === book_key && ch.chapterNumber >= p.startChapter && ch.chapterNumber <= p.endChapter
                  )
                  .map((ch) => {
                    if (ch.chapterNumber === p.startChapter && ch.chapterNumber === p.endChapter) {
                      return {
                        chapter_number: ch.chapterNumber,
                        content: ch.content.filter(
                          (_, i, a: any) =>
                            (typeof a[i][0] === "number" &&
                              (a[i][0] as any) >= p.startVerse &&
                              (a[i][0] as any) <= p.endVerse) ||
                            (i < a.length - 1 && a[i + 1][0] === p.startVerse && typeof a[i][0] !== "number")
                        ),
                      };
                    }
                    if (ch.chapterNumber === p.startChapter) {
                      return {
                        chapter_number: ch.chapterNumber,
                        content: ch.content.filter(
                          (_, i, a: any) =>
                            (typeof a[i][0] === "number" && (a[i][0] as any) >= p.startVerse) ||
                            (i < a.length - 1 && a[i + 1][0] === p.startVerse && typeof a[i][0] !== "number")
                        ),
                      };
                    }
                    if (ch.chapterNumber === p.endChapter) {
                      return {
                        chapter_number: ch.chapterNumber,
                        content: ch.content.filter(
                          (_, i, a: any) => typeof a[i][0] === "number" && (a[i][0] as any) <= p.endVerse
                        ),
                      };
                    }
                    return {
                      chapter_number: ch.chapterNumber,
                      content: ch.content,
                    };
                  });
          return {
            ...p,
            book_index,
            book_name: bible.bookList[book_index],
            reference: `${bible.bookList[book_index]} ${
              p.type === "single"
                ? `${p.chapter}:${p.verse}`
                : p.startChapter === p.endChapter
                ? `${p.startChapter}:${p.startVerse}-${p.endVerse}`
                : `${p.startChapter}:${p.startVerse}-${p.endChapter}:${p.endVerse}`
            } ${translation}`,
            translation,
            content,
          };
        });
    }
    return [];
  });
  return parsed;
};

export { query_bible_passage, set_default_translation };
