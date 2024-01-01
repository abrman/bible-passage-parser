import { describe, expect, it } from "vitest";
import parse_passage from "./parse_passage";

/* prettier-ignore */
const verse_count_gospel_matthew = [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20]

describe("Parse references", () => {
  it("01. 1:1 - Parse single verse", async () => {
    const passage = "1:1";
    const output = [
      {
        type: "single",
        chapter: 1,
        verse: 1,
      },
    ];
    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("02. 1:1,2 - Parse multiple verses from a single chapter", async () => {
    const passage = "1:1,2";
    const output = [
      {
        type: "single",
        chapter: 1,
        verse: 1,
      },
      {
        type: "single",
        chapter: 1,
        verse: 2,
      },
    ];
    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("03. 1:3-4 - Single range from a single chapter", async () => {
    const passage = "1:3-4";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 3,
        endChapter: 1,
        endVerse: 4,
      },
    ];
    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("04. 1:0-300 - Single range from a single chapter capped at verse count", async () => {
    const passage = "1:0-300";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 1,
        endChapter: 1,
        endVerse: 25,
      },
    ];
    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("05. 1:1,2-3,10,11,12-20 - Combination of ranges and single verses from a single chapter", async () => {
    const passage = "1:1,2-3,10,11,12-20";
    const output = [
      {
        type: "single",
        chapter: 1,
        verse: 1,
      },
      {
        type: "range",
        startChapter: 1,
        startVerse: 2,
        endChapter: 1,
        endVerse: 3,
      },
      {
        type: "single",
        chapter: 1,
        verse: 10,
      },
      {
        type: "single",
        chapter: 1,
        verse: 11,
      },
      {
        type: "range",
        startChapter: 1,
        startVerse: 12,
        endChapter: 1,
        endVerse: 20,
      },
    ];
    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("06. 1:1,2-3,10,11,12-50 - Combination of ranges and single verses from a single chapter with capping at verse count", async () => {
    const passage = "1:1,2-3,10,11,12-50";
    const output = [
      {
        type: "single",
        chapter: 1,
        verse: 1,
      },
      {
        type: "range",
        startChapter: 1,
        startVerse: 2,
        endChapter: 1,
        endVerse: 3,
      },
      {
        type: "single",
        chapter: 1,
        verse: 10,
      },
      {
        type: "single",
        chapter: 1,
        verse: 11,
      },
      {
        type: "range",
        startChapter: 1,
        startVerse: 12,
        endChapter: 1,
        endVerse: 25,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("07. 1 - Single chapter", async () => {
    const passage = "1";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 1,
        endChapter: 1,
        endVerse: 25,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("08. 1-2 - Chapter range", async () => {
    const passage = "1-2";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 1,
        endChapter: 2,
        endVerse: 23,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("09. 1:5-1:10 - Chapter range with verses within single chapter", async () => {
    const passage = "1:5-1:10";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 5,
        endChapter: 1,
        endVerse: 10,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("10. 1:5-2:10 - Chapter and verse range with chapter overflow", async () => {
    const passage = "1:5-2:10";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 5,
        endChapter: 2,
        endVerse: 10,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("11. 1:5-2:10 - Chapter and verse range with chapter overflow", async () => {
    const passage = "1:5-2:10";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 5,
        endChapter: 2,
        endVerse: 10,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("12. 1:50-2:10 - Chapter and verse range with chapter overflow capping test", async () => {
    const passage = "1:50-2:10";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 25,
        endChapter: 2,
        endVerse: 10,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("13. 1:10-2:10,20 - Chapter and verse range with contextual verses", async () => {
    const passage = "1:10-2:10,20";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 10,
        endChapter: 2,
        endVerse: 10,
      },
      {
        type: "single",
        chapter: 2,
        verse: 20,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });

  it("14. 1:1-5,10,12,3-4;2:3;3-4;2:10-3:6,8,10-12 - Complex", async () => {
    const passage = "1:1-5,10,12,3-4;2:3;3-4;2:10-3:6,8,10-12";
    const output = [
      {
        type: "range",
        startChapter: 1,
        startVerse: 1,
        endChapter: 1,
        endVerse: 5,
      },
      {
        type: "single",
        chapter: 1,
        verse: 10,
      },
      {
        type: "single",
        chapter: 1,
        verse: 12,
      },
      {
        type: "range",
        startChapter: 1,
        startVerse: 3,
        endChapter: 1,
        endVerse: 4,
      },
      {
        type: "single",
        chapter: 2,
        verse: 3,
      },
      {
        type: "range",
        startChapter: 3,
        startVerse: 1,
        endChapter: 4,
        endVerse: 25,
      },
      {
        type: "range",
        startChapter: 2,
        startVerse: 10,
        endChapter: 3,
        endVerse: 6,
      },
      {
        type: "single",
        chapter: 3,
        verse: 8,
      },
      {
        type: "range",
        startChapter: 3,
        startVerse: 10,
        endChapter: 3,
        endVerse: 12,
      },
    ];

    const parsed = parse_passage(passage, verse_count_gospel_matthew);
    expect(parsed).toMatchObject(output);
  });
});
