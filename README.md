# Bible Passage Parser

This library provides methods to parse bible references. It supports various formats, including simple references like `John 3:16` and more complex combinations like `Rom 3:23;6:23;5:8;10:9-10,13 KJV`.

## Installation

To install `bible-passage-parser`, use:

```bash
npm  i  bible-passage-parser
```

## Usage

[Codesandbox Example](//https://to-be-added)

## Methods

### query

Accepts a string input representing a Bible passage and returns the formatted passage with verse content.

```ts
query(input: string): {
	book_index: number;
	book_name: string;
	reference: string;
	translation: string;
	content: ...
}[]
```

### set_default_translation

Allows you to set the default translation for queried verses. Only KJV embedded by default.

```ts
set_default_translation(
	translation_code: string
): void
```

### add_bible_translation

Allows you to add your own bible translation

```ts
add_bible_translation(
	translation_code: string,
	chapters: {
		book: string;
		chapterNumber: number;
		content: (
			[verseNumber: number, verseContent: string] |
			[nonVerseTag: string, content: string]
		)[];
	}[],
	 bookList?: string[]
): void
```

### set_fuzzy_search_book_list

Allows you to set your own book interpreter for use with non-english bibles.

```ts
set_fuzzy_search_book_list(
	fuzzy_book_list: string[][],
): void
```
