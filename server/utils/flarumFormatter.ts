/**
 * Decodes standard HTML entities back into plain characters.
 * @param str - The input string containing HTML entities.
 * @returns The unescaped string.
 */
export function decodeHtmlEntities(str: string): string {
  return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;|&#39;/g, '\'')
      .replace(/&nbsp;/g, ' ');
}

/**
 * Converts Flarum post content (s9e/TextFormatter XML, BBCode, or Markdown)
 * into standard Discord Markdown.
 * @param raw - The raw post content string stored in Flarum.
 * @returns The formatted Discord Markdown string.
 */
export function flarumToDiscordMarkdown(
    raw: string | null | undefined,
): string {
  if (!raw) {
    return '';
  }

  let text = raw;

  // If wrapped in <t>...</t>, it is plain text or raw markdown.
  if (text.startsWith('<t>') && text.endsWith('</t>')) {
    return decodeHtmlEntities(text.slice(3, -4)).trim();
  }

  // 1. Mentions
  text = text.replace(
      /<USERMENTION[^>]*username="([^"]+)"[^>]*>.*?<\/USERMENTION>/gi,
      '@$1',
  );
  text = text.replace(
      /<USERMENTION[^>]*>@"?([^"#<]+)"?#\d+<\/USERMENTION>/gi,
      '@$1',
  );
  text = text.replace(
      /<POSTMENTION[^>]*number="([^"]+)"[^>]*>.*?<\/POSTMENTION>/gi,
      '(Post #$1)',
  );
  text = text.replace(
      /<POSTMENTION[^>]*>@"?([^"#<]+)"?#p\d+<\/POSTMENTION>/gi,
      '(Post by @$1)',
  );

  // 2. Images
  text = text.replace(/<IMG[^>]*src="([^"]+)"[^>]*>.*?<\/IMG>/gi, '$1');

  // 3. URLs
  const urlRegex = new RegExp(
      '<URL[^>]*url="([^"]+)"[^>]*>(?:<s>.*?<\\/s>)?' +
      '([\\s\\S]*?)(?:<e>.*?<\\/e>)?<\\/URL>',
      'gi',
  );
  text = text.replace(
      urlRegex,
      (_, url: string, label: string) => {
        const trimmedLabel = label.trim();
        if (!trimmedLabel || trimmedLabel === url) {
          return url;
        }
        return `${trimmedLabel} (${url})`;
      },
  );

  // 4. Code blocks and inline code
  const codeRegex = new RegExp(
      '<CODE\\b(?:[^>]*lang="([^"]+)")?[^>]*>(?:<s>.*?<\\/s>)?' +
      '([\\s\\S]*?)(?:<e>.*?<\\/e>)?<\\/CODE>',
      'gi',
  );
  text = text.replace(
      codeRegex,
      (_, lang: string | undefined, code: string) => {
        return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
      },
  );
  text = text.replace(
      /<C\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)(?:<e>.*?<\/e>)?<\/C>/gi,
      '`$1`',
  );

  // 5. Spoilers
  text = text.replace(
      /<SPOILER\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)(?:<e>.*?<\/e>)?<\/SPOILER>/gi,
      '||$1||',
  );

  // 6. Formatting tags with delimiters
  text = text.replace(
      /<B\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)(?:<e>.*?<\/e>)?<\/B>/gi,
      '**$1**',
  );
  text = text.replace(
      /<I\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)(?:<e>.*?<\/e>)?<\/I>/gi,
      '*$1*',
  );
  text = text.replace(
      /<U\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)(?:<e>.*?<\/e>)?<\/U>/gi,
      '__$1__',
  );
  const delRegex = new RegExp(
      '<(?:DEL|STRIKE)\\b[^>]*>(?:<s>.*?<\\/s>)?([\\s\\S]*?)' +
      '(?:<e>.*?<\\/e>)?<\\/(?:DEL|STRIKE)>',
      'gi',
  );
  text = text.replace(delRegex, '~~$1~~');

  // 7. Quotes
  const quoteRegex = new RegExp(
      '<QUOTE\\b(?:[^>]*author="([^"]+)")?[^>]*>(?:<s>.*?<\\/s>)?' +
      '([\\s\\S]*?)(?:<e>.*?<\\/e>)?<\\/QUOTE>',
      'gi',
  );
  text = text.replace(
      quoteRegex,
      (_, author: string | undefined, quote: string) => {
        let cleanQuote = quote.replace(/<[se]>.*?<\/[se]>/gi, '');
        cleanQuote = cleanQuote.replace(/^>+\s*/gm, '').trim();
        const lines = cleanQuote.split('\n');
        const header = author ? `> **${author}:**\n` : '';
        return '\n' + header + lines.map((l) => `> ${l}`).join('\n') + '\n';
      },
  );

  // 8. Lists
  text = text.replace(
      /<LI\b[^>]*>(?:<s>.*?<\/s>)?([\s\S]*?)<\/LI>/gi,
      (_, item: string) => {
        const cleanItem = item.replace(/<[se]>.*?<\/[se]>/gi, '').trim();
        return `- ${cleanItem}\n`;
      },
  );

  // Clean any remaining <s> or <e> tags
  text = text.replace(/<[se]>.*?<\/[se]>/gi, '');

  // Paragraphs and breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<p>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Strip container tags <r>, </r>, <LIST>, </LIST>
  text = text.replace(/<\/?(?:r|LIST)[^>]*>/gi, '');

  // Handle standard BBCode in case of non-s9e BBCode
  text = text.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '**$1**');
  text = text.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '*$1*');
  text = text.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '__$1__');
  text = text.replace(/\[(?:s|del)\]([\s\S]*?)\[\/(?:s|del)\]/gi, '~~$1~~');
  text = text.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, '||$1||');
  text = text.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, '$2 ($1)');
  text = text.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1');
  text = text.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, '$1');
  text = text.replace(
      /\[quote(?:="([^"]*)")?\]([\s\S]*?)\[\/quote\]/gi,
      (_, author: string | undefined, quote: string) => {
        const cleanQuote = quote.replace(/^>+\s*/gm, '').trim();
        const lines = cleanQuote.split('\n');
        const header = author ? `> **${author}:**\n` : '';
        return '\n' + header + lines.map((l) => `> ${l}`).join('\n') + '\n';
      },
  );
  text = text.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, '\n```\n$1\n```\n');

  text = decodeHtmlEntities(text);
  return text.trim();
}
