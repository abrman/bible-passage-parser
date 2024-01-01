type passage =
  | {
      type: "single";
      chapter: number;
      verse: number;
    }
  | {
      type: "range";
      startChapter: number;
      startVerse: number;
      endChapter: number;
      endVerse: number;
    };
type passageList = passage[];

const validate_range = (range: passage, verseCounts: number[]) => {
  if (range.type === "single") {
    if (range.chapter < 1) range.chapter = 1;
    if (range.chapter > verseCounts.length) range.chapter = verseCounts.length;
    if (range.verse < 1) range.verse = 1;
    if (range.verse > (verseCounts[range.chapter - 1] as number))
      range.verse = verseCounts[range.chapter - 1] as number;
    return range;
  }
  if (range.type === "range") {
    if (range.startChapter < 1) range.startChapter = 1;
    if (range.startChapter > verseCounts.length) range.startChapter = verseCounts.length;

    if (range.endChapter < range.startChapter) range.endChapter = range.startChapter;
    if (range.endChapter > verseCounts.length) range.endChapter = verseCounts.length;

    if (range.startVerse < 1) range.startVerse = 1;
    if (range.startVerse > (verseCounts[range.startChapter - 1] as number))
      range.startVerse = verseCounts[range.startChapter - 1] as number;

    if (range.endVerse < 1) range.endVerse = 1;
    if (range.startChapter === range.endChapter && range.endVerse < range.startVerse) range.endVerse = range.startVerse;
    if (range.endVerse > (verseCounts[range.endChapter - 1] as number))
      range.endVerse = verseCounts[range.startChapter - 1] as number;
  }
  return range;
};

const parse_passage = (originalInput: string, verseCounts: number[]) => {
  const passages: passageList = [];
  let input = originalInput; // add a end separator so that everything is parsed without additional logic
  const parts = originalInput.split(/[:\-,;]/).map(Number);
  const separators = originalInput.replace(/[^:\-,;]/g, "");
  const sequence = parts.flatMap((v, i) => (separators[i] ? [v, separators[i]] : [v]));

  if (originalInput.replace(/[:\-,;0-9 ]/g, "").length > 0) {
    return new Error("invalid input");
  }
  if (/[:\-,;]{2,}/g.test(originalInput)) {
    return new Error("invalid input");
  }

  [...sequence, ";"].forEach((part, i, sequence) => {
    if (part === ";" || part === ",") {
      // is chapter range
      if (sequence[i - 2] == "-" && (sequence[i - 4] == ";" || i === 3)) {
        const range = validate_range(
          {
            type: "range",
            startChapter: sequence[i - 3] as number,
            endChapter: sequence[i - 1] as number,
            startVerse: 1,
            endVerse: verseCounts[(sequence[i - 1] as number) - 1] as number,
          },
          verseCounts
        );
        if (range) passages.push(range);
      }
      // is single chapter
      else if (sequence[i - 2] == ";" || i == 1) {
        const range = validate_range(
          {
            type: "range",
            startChapter: sequence[i - 1] as number,
            endChapter: sequence[i - 1] as number,
            startVerse: 1,
            endVerse: verseCounts[(sequence[i - 1] as number) - 1] as number,
          },
          verseCounts
        );
        if (range) passages.push(range);
      }

      // is single verse
      else if ((sequence[i - 2] === ":" && sequence[i - 4] !== "-") || sequence[i - 2] === ",") {
        let chapterSeqIndex = i;
        while (sequence[chapterSeqIndex + 1] !== ":" && chapterSeqIndex > 0) chapterSeqIndex--;
        const chapter = sequence[chapterSeqIndex] as number;
        const verse = sequence[i - 1] as number;
        const range = validate_range(
          {
            type: "single",
            chapter,
            verse,
          },
          verseCounts
        );
        if (range) passages.push(range);
      }

      // is verse range
      else if (sequence[i - 2] == "-" || sequence[i - 4] == "-") {
        let endVerse = sequence[i - 1] as number;
        if (sequence[i - 2] == "-") {
          let startVerse = sequence[i - 3] as number;
          let chapterSeqIndex = i;
          while (sequence[chapterSeqIndex + 1] !== ":" && chapterSeqIndex > 0) chapterSeqIndex--;
          const chapter = sequence[chapterSeqIndex] as number;
          const range = validate_range(
            {
              type: "range",
              startChapter: chapter,
              endChapter: chapter,
              startVerse,
              endVerse,
            },
            verseCounts
          );
          if (range) passages.push(range);
        } else {
          let startVerse = sequence[i - 5] as number;
          const endChapter = Math.min(verseCounts.length, sequence[i - 3] as number);
          const startChapter = Math.min(verseCounts.length, sequence[i - 7] as number);

          const range = validate_range(
            {
              type: "range",
              startChapter,
              endChapter,
              startVerse,
              endVerse,
            },
            verseCounts
          );
          if (range) passages.push(range);
        }
      }
    }
  });

  return passages;
};

export default parse_passage;
