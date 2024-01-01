import kjv from "../resources/kjv.json" assert { type: "json" };

type bible = {
  bookList: string[];
  bookKey: string[];
  verseCounts: {
    [bookKey: string]: number[];
  };
  chapters: {
    book: string;
    chapterNumber: number;
    content: ([verse_number: number, verse_content: string] | [html_tag: string, content: string])[];
  }[];
};

const chapter_list_to_verse_counts = (
  chapters: {
    book: string;
    chapterNumber: number;
    content: ([verse_number: number, verse_content: string] | [html_tag: string, content: string])[];
  }[]
) => {
  const verseCounts: {
    [bookKey: string]: number[];
  } = {};
  chapters.forEach(
    ({
      book,
      chapterNumber,
      content,
    }: {
      book: string;
      chapterNumber: number;
      content: [number | string, string][];
    }) => {
      if (!verseCounts[book]) verseCounts[book] = [];
      (verseCounts[book] as any)[chapterNumber - 1] = Math.max(
        ...(content.map((v) => v[0]).filter((_) => typeof _ === "number") as number[])
      );
    }
  );
  return verseCounts;
};

let bibles: { [translationKey: string]: bible } = {
  KJV: {
    bookList: (kjv as any).books,
    bookKey: [...new Set((kjv as any).chapters.map((v: any) => v.book))] as string[],
    verseCounts: chapter_list_to_verse_counts((kjv as any).chapters),
    chapters: (kjv as any).chapters,
  },
};

const add_bible = (
  translation_code: string,
  chapters: {
    book: string;
    chapterNumber: number;
    content: ([verseNumber: number, verseContent: string] | [nonVerseTag: string, content: string])[];
  }[],
  bookList?: string[]
) => {
  const bookKey = [...new Set(chapters.map((v) => v.book))];
  bibles = {
    ...bibles,
    [translation_code.toUpperCase()]: {
      bookList: bookList || bookKey,
      verseCounts: chapter_list_to_verse_counts(chapters),
      bookKey,
      chapters,
    },
  };
};

export { bibles, add_bible };
