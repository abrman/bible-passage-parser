import { describe, expect, it } from "vitest";
import { query_bible_passage } from "./query_bible_passage";
import { set_fuzzy_search_book_list } from "./classify_to_book_index";

describe("Query passages", () => {
  it("Simple", async () => {
    expect(query_bible_passage("John 3:16 KJV")).toMatchObject([
      {
        book_index: 42,
        book_name: "John",
        chapter: 3,
        content: [
          [
            16,
            "For God so loved the world, that he gave his only be­got­ten Son, that whoso­ev­er be­lieveth in him should not per­ish, but have ev­er­last­ing life.",
          ],
        ],
        reference: "John 3:16",
        type: "single",
        verse: 16,
      },
    ]);
  });
});
