import {
  AsyncPipe,
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  DomSanitizer,
  ElementRef,
  EventEmitter,
  HttpClient,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
  PLATFORM_ID,
  Pipe,
  SecurityContext,
  Subject,
  ViewContainerRef,
  distinctUntilChanged,
  first,
  isPlatformBrowser,
  map,
  mapTo,
  merge,
  of,
  setClassMetadata,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  timer,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵinject,
  ɵɵlistener,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZG2BHLTP.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/marked/lib/marked.esm.js
function _getDefaults() {
  return {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null
  };
}
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
  _defaults = newDefaults;
}
var escapeTest = /[&<>"']/;
var escapeReplace = new RegExp(escapeTest.source, "g");
var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape$1(html2, encode) {
  if (encode) {
    if (escapeTest.test(html2)) {
      return html2.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html2)) {
      return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html2;
}
var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html2) {
  return html2.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === "colon") return ":";
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return "";
  });
}
var caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  let source = typeof regex === "string" ? regex : regex.source;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      valSource = valSource.replace(caret, "$1");
      source = source.replace(name, valSource);
      return obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    }
  };
  return obj;
}
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
}
var noopTest = {
  exec: () => null
};
function splitCells(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
    let escaped = false;
    let curr = offset;
    while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) {
    cells.pop();
  }
  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push("");
    }
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  let level = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}
function outputLink(cap, link2, raw, lexer2) {
  const href = link2.href;
  const title = link2.title ? escape$1(link2.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    lexer2.state.inLink = true;
    const token = {
      type: "link",
      raw,
      href,
      title,
      text,
      tokens: lexer2.inlineTokens(text)
    };
    lexer2.state.inLink = false;
    return token;
  }
  return {
    type: "image",
    raw,
    href,
    title,
    text: escape$1(text)
  };
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
var _Tokenizer = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let text = cap[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1");
      text = rtrim(text.replace(/^ *>[ \t]?/gm, ""), "\n");
      const top = this.lexer.state.top;
      this.lexer.state.top = true;
      const tokens = this.lexer.blockTokens(text);
      this.lexer.state.top = top;
      return {
        type: "blockquote",
        raw: cap[0],
        tokens,
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let raw = "";
      let itemContents = "";
      let endsWithBlankLine = false;
      while (src) {
        let endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        let line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t) => " ".repeat(3 * t.length));
        let nextLine = src.split("\n", 1)[0];
        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else {
          indent = cap[2].search(/[^ ]/);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        let blankLine = false;
        if (!line && /^ *$/.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(src)) {
              break;
            }
            if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLine.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.search(/[^ ]/) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLine.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        let istask = null;
        let ischecked;
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: []
        });
        list2.raw += raw;
      }
      list2.items[list2.items.length - 1].raw = raw.trimEnd();
      list2.items[list2.items.length - 1].text = itemContents.trimEnd();
      list2.raw = list2.raw.trimEnd();
      for (let i = 0; i < list2.items.length; i++) {
        this.lexer.state.top = false;
        list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
        if (!list2.loose) {
          const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => /\n.*\n/.test(t.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      }
      if (list2.loose) {
        for (let i = 0; i < list2.items.length; i++) {
          list2.items[i].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
      const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }
    if (!/[:|]/.test(cap[2])) {
      return;
    }
    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(/^\||\| *$/g, "").split("|");
    const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : [];
    const item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length) {
      return;
    }
    for (const align of aligns) {
      if (/^ *-+: *$/.test(align)) {
        item.align.push("right");
      } else if (/^ *:-+: *$/.test(align)) {
        item.align.push("center");
      } else if (/^ *:-+ *$/.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }
    for (const header of headers) {
      item.header.push({
        text: header,
        tokens: this.lexer.inline(header)
      });
    }
    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell)
        };
      }));
    }
    return item;
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape$1(cap[1])
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link2) {
          href = link2[1];
          title = link2[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(/\s+/g, " ");
      const link2 = links[linkString.toLowerCase()];
      if (!link2) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link2, cap[0], this.lexer);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match) return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim) continue;
        rLength = [...rDelim].length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0) continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text2,
            tokens: this.lexer.inlineTokens(text2)
          };
        }
        const text = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape$1(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$1(cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape$1(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [{
          type: "text",
          raw: text,
          text
        }]
      };
    }
  }
  url(src) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$1(cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        } while (prevCapZero !== cap[0]);
        text = escape$1(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [{
          type: "text",
          raw: text,
          text
        }]
      };
    }
  }
  inlineText(src) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = cap[0];
      } else {
        text = escape$1(cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
};
var newline = /^(?: *(?:\n|$))+/;
var blockCode = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheading = edit(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, bullet).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
var blockNormal = {
  blockquote,
  code: blockCode,
  def,
  fences,
  heading,
  hr,
  html,
  lheading,
  list,
  newline,
  paragraph,
  table: noopTest,
  text: blockText
};
var gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = __spreadProps(__spreadValues({}, blockNormal), {
  table: gfmTable,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
});
var blockPedantic = __spreadProps(__spreadValues({}, blockNormal), {
  html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
});
var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = "\\p{P}\\p{S}";
var punctuation = edit(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, _punctuation).getRegex();
var blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAst = edit("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\([punct])/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
var inlineNormal = {
  _backpedal: noopTest,
  // only used for GFM url
  anyPunctuation,
  autolink,
  blockSkip,
  br,
  code: inlineCode,
  del: noopTest,
  emStrongLDelim,
  emStrongRDelimAst,
  emStrongRDelimUnd,
  escape,
  link,
  nolink,
  punctuation,
  reflink,
  reflinkSearch,
  tag,
  text: inlineText,
  url: noopTest
};
var inlinePedantic = __spreadProps(__spreadValues({}, inlineNormal), {
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
});
var inlineGfm = __spreadProps(__spreadValues({}, inlineNormal), {
  escape: edit(escape).replace("])", "~|])").getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});
var inlineBreaks = __spreadProps(__spreadValues({}, inlineGfm), {
  br: edit(br).replace("{2,}", "*").getRegex(),
  text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
});
var block = {
  normal: blockNormal,
  gfm: blockGfm,
  pedantic: blockPedantic
};
var inline = {
  normal: inlineNormal,
  gfm: inlineGfm,
  breaks: inlineBreaks,
  pedantic: inlinePedantic
};
var _Lexer = class __Lexer {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options2 || _defaults;
    this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n");
    this.blockTokens(src, this.tokens);
    for (let i = 0; i < this.inlineQueue.length; i++) {
      const next = this.inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];
    return this.tokens;
  }
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
        return leading + "    ".repeat(tabs.length);
      });
    }
    let token;
    let lastToken;
    let cutSrc;
    let lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call({
          lexer: this
        }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          tokens[tokens.length - 1].raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({
            lexer: this
          }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({
      src,
      tokens
    });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call({
          lexer: this
        }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({
            lexer: this
          }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var _Renderer = class {
  options;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/^\S*/)?.[0];
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="language-' + escape$1(lang) + '">' + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
  }
  blockquote(quote) {
    return `<blockquote>
${quote}</blockquote>
`;
  }
  html(html2, block2) {
    return html2;
  }
  heading(text, level, raw) {
    return `<h${level}>${text}</h${level}>
`;
  }
  hr() {
    return "<hr>\n";
  }
  list(body, ordered, start) {
    const type = ordered ? "ol" : "ul";
    const startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  listitem(text, task, checked) {
    return `<li>${text}</li>
`;
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph(text) {
    return `<p>${text}</p>
`;
  }
  table(header, body) {
    if (body) body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow(content) {
    return `<tr>
${content}</tr>
`;
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag2 = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
    return tag2 + content + `</${type}>
`;
  }
  /**
   * span level renderer
   */
  strong(text) {
    return `<strong>${text}</strong>`;
  }
  em(text) {
    return `<em>${text}</em>`;
  }
  codespan(text) {
    return `<code>${text}</code>`;
  }
  br() {
    return "<br>";
  }
  del(text) {
    return `<del>${text}</del>`;
  }
  link(href, title, text) {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += ">";
    return out;
  }
  text(text) {
    return text;
  }
};
var _TextRenderer = class {
  // no need for block level renderers
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
};
var _Parser = class __Parser {
  options;
  renderer;
  textRenderer;
  constructor(options2) {
    this.options = options2 || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new _TextRenderer();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        const genericToken = token;
        const ret = this.options.extensions.renderers[genericToken.type].call({
          parser: this
        }, genericToken);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          const headingToken = token;
          out += this.renderer.heading(this.parseInline(headingToken.tokens), headingToken.depth, unescape(this.parseInline(headingToken.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const codeToken = token;
          out += this.renderer.code(codeToken.text, codeToken.lang, !!codeToken.escaped);
          continue;
        }
        case "table": {
          const tableToken = token;
          let header = "";
          let cell = "";
          for (let j = 0; j < tableToken.header.length; j++) {
            cell += this.renderer.tablecell(this.parseInline(tableToken.header[j].tokens), {
              header: true,
              align: tableToken.align[j]
            });
          }
          header += this.renderer.tablerow(cell);
          let body = "";
          for (let j = 0; j < tableToken.rows.length; j++) {
            const row = tableToken.rows[j];
            cell = "";
            for (let k = 0; k < row.length; k++) {
              cell += this.renderer.tablecell(this.parseInline(row[k].tokens), {
                header: false,
                align: tableToken.align[k]
              });
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          const blockquoteToken = token;
          const body = this.parse(blockquoteToken.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          const listToken = token;
          const ordered = listToken.ordered;
          const start = listToken.start;
          const loose = listToken.loose;
          let body = "";
          for (let j = 0; j < listToken.items.length; j++) {
            const item = listToken.items[j];
            const checked = item.checked;
            const task = item.task;
            let itemBody = "";
            if (item.task) {
              const checkbox = this.renderer.checkbox(!!checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox + " "
                  });
                }
              } else {
                itemBody += checkbox + " ";
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, !!checked);
          }
          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case "html": {
          const htmlToken = token;
          out += this.renderer.html(htmlToken.text, htmlToken.block);
          continue;
        }
        case "paragraph": {
          const paragraphToken = token;
          out += this.renderer.paragraph(this.parseInline(paragraphToken.tokens));
          continue;
        }
        case "text": {
          let textToken = token;
          let body = textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text;
          while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            textToken = tokens[++i];
            body += "\n" + (textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        const ret = this.options.extensions.renderers[token.type].call({
          parser: this
        }, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          const escapeToken = token;
          out += renderer.text(escapeToken.text);
          break;
        }
        case "html": {
          const tagToken = token;
          out += renderer.html(tagToken.text);
          break;
        }
        case "link": {
          const linkToken = token;
          out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
          break;
        }
        case "image": {
          const imageToken = token;
          out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
          break;
        }
        case "strong": {
          const strongToken = token;
          out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
          break;
        }
        case "em": {
          const emToken = token;
          out += renderer.em(this.parseInline(emToken.tokens, renderer));
          break;
        }
        case "codespan": {
          const codespanToken = token;
          out += renderer.codespan(codespanToken.text);
          break;
        }
        case "br": {
          out += renderer.br();
          break;
        }
        case "del": {
          const delToken = token;
          out += renderer.del(this.parseInline(delToken.tokens, renderer));
          break;
        }
        case "text": {
          const textToken = token;
          out += renderer.text(textToken.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
var _Hooks = class {
  options;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html2) {
    return html2;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(tokens) {
    return tokens;
  }
};
var Marked = class {
  defaults = _getDefaults();
  options = this.setOptions;
  parse = this.#parseMarkdown(_Lexer.lex, _Parser.parse);
  parseInline = this.#parseMarkdown(_Lexer.lexInline, _Parser.parseInline);
  Parser = _Parser;
  Renderer = _Renderer;
  TextRenderer = _TextRenderer;
  Lexer = _Lexer;
  Tokenizer = _Tokenizer;
  Hooks = _Hooks;
  constructor(...args) {
    this.use(...args);
  }
  /**
   * Run callback for every token
   */
  walkTokens(tokens, callback) {
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(this, token));
      switch (token.type) {
        case "table": {
          const tableToken = token;
          for (const cell of tableToken.header) {
            values = values.concat(this.walkTokens(cell.tokens, callback));
          }
          for (const row of tableToken.rows) {
            for (const cell of row) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          const listToken = token;
          values = values.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          const genericToken = token;
          if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              const tokens2 = genericToken[childTokens].flat(Infinity);
              values = values.concat(this.walkTokens(tokens2, callback));
            });
          } else if (genericToken.tokens) {
            values = values.concat(this.walkTokens(genericToken.tokens, callback));
          }
        }
      }
    }
    return values;
  }
  use(...args) {
    const extensions = this.defaults.extensions || {
      renderers: {},
      childTokens: {}
    };
    args.forEach((pack) => {
      const opts = __spreadValues({}, pack);
      opts.async = this.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if ("renderer" in ext) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            const extLevel = extensions[ext.level];
            if (extLevel) {
              extLevel.unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if ("childTokens" in ext && ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer = this.defaults.renderer || new _Renderer(this.defaults);
        for (const prop in pack.renderer) {
          if (!(prop in renderer)) {
            throw new Error(`renderer '${prop}' does not exist`);
          }
          if (prop === "options") {
            continue;
          }
          const rendererProp = prop;
          const rendererFunc = pack.renderer[rendererProp];
          const prevRenderer = renderer[rendererProp];
          renderer[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args2);
            }
            return ret || "";
          };
        }
        opts.renderer = renderer;
      }
      if (pack.tokenizer) {
        const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (const prop in pack.tokenizer) {
          if (!(prop in tokenizer)) {
            throw new Error(`tokenizer '${prop}' does not exist`);
          }
          if (["options", "rules", "lexer"].includes(prop)) {
            continue;
          }
          const tokenizerProp = prop;
          const tokenizerFunc = pack.tokenizer[tokenizerProp];
          const prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = this.defaults.hooks || new _Hooks();
        for (const prop in pack.hooks) {
          if (!(prop in hooks)) {
            throw new Error(`hook '${prop}' does not exist`);
          }
          if (prop === "options") {
            continue;
          }
          const hooksProp = prop;
          const hooksFunc = pack.hooks[hooksProp];
          const prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop)) {
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async) {
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens2 = this.defaults.walkTokens;
        const packWalktokens = pack.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(packWalktokens.call(this, token));
          if (walkTokens2) {
            values = values.concat(walkTokens2.call(this, token));
          }
          return values;
        };
      }
      this.defaults = __spreadValues(__spreadValues({}, this.defaults), opts);
    });
    return this;
  }
  setOptions(opt) {
    this.defaults = __spreadValues(__spreadValues({}, this.defaults), opt);
    return this;
  }
  lexer(src, options2) {
    return _Lexer.lex(src, options2 ?? this.defaults);
  }
  parser(tokens, options2) {
    return _Parser.parse(tokens, options2 ?? this.defaults);
  }
  #parseMarkdown(lexer2, parser2) {
    return (src, options2) => {
      const origOpt = __spreadValues({}, options2);
      const opt = __spreadValues(__spreadValues({}, this.defaults), origOpt);
      if (this.defaults.async === true && origOpt.async === false) {
        if (!opt.silent) {
          console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.");
        }
        opt.async = true;
      }
      const throwError = this.#onError(!!opt.silent, !!opt.async);
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
      }
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer2(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html2 = parser2(tokens, opt);
        if (opt.hooks) {
          html2 = opt.hooks.postprocess(html2);
        }
        return html2;
      } catch (e) {
        return throwError(e);
      }
    };
  }
  #onError(silent, async) {
    return (e) => {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape$1(e.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e);
      }
      throw e;
    };
  }
};
var markedInstance = new Marked();
function marked(src, opt) {
  return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options2) {
  markedInstance.setOptions(options2);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
  markedInstance.use(...args);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.walkTokens = function(tokens, callback) {
  return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = _Parser.parse;
var lexer = _Lexer.lex;

// node_modules/ngx-markdown/fesm2022/ngx-markdown.mjs
var _c0 = ["*"];
var BUTTON_TEXT_COPY = "Copy";
var BUTTON_TEXT_COPIED = "Copied";
var ClipboardButtonComponent = class _ClipboardButtonComponent {
  constructor() {
    this._buttonClick$ = new Subject();
    this.copied$ = this._buttonClick$.pipe(switchMap(() => merge(of(true), timer(3e3).pipe(mapTo(false)))), distinctUntilChanged(), shareReplay(1));
    this.copiedText$ = this.copied$.pipe(startWith(false), map((copied) => copied ? BUTTON_TEXT_COPIED : BUTTON_TEXT_COPY));
  }
  onCopyToClipboardClick() {
    this._buttonClick$.next();
  }
  static {
    this.\u0275fac = function ClipboardButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ClipboardButtonComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _ClipboardButtonComponent,
      selectors: [["markdown-clipboard"]],
      standalone: true,
      features: [\u0275\u0275StandaloneFeature],
      decls: 4,
      vars: 7,
      consts: [[1, "markdown-clipboard-button", 3, "click"]],
      template: function ClipboardButtonComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "button", 0);
          \u0275\u0275pipe(1, "async");
          \u0275\u0275listener("click", function ClipboardButtonComponent_Template_button_click_0_listener() {
            return ctx.onCopyToClipboardClick();
          });
          \u0275\u0275text(2);
          \u0275\u0275pipe(3, "async");
          \u0275\u0275elementEnd();
        }
        if (rf & 2) {
          \u0275\u0275classProp("copied", \u0275\u0275pipeBind1(1, 3, ctx.copied$));
          \u0275\u0275advance(2);
          \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 5, ctx.copiedText$));
        }
      },
      dependencies: [AsyncPipe],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClipboardButtonComponent, [{
    type: Component,
    args: [{
      selector: "markdown-clipboard",
      template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied$ | async"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText$ | async }}</button>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      imports: [AsyncPipe]
    }]
  }], null, null);
})();
var CLIPBOARD_OPTIONS = new InjectionToken("CLIPBOARD_OPTIONS");
var LanguagePipe = class _LanguagePipe {
  transform(value, language) {
    if (value == null) {
      value = "";
    }
    if (language == null) {
      language = "";
    }
    if (typeof value !== "string") {
      console.error(`LanguagePipe has been invoked with an invalid value type [${typeof value}]`);
      return value;
    }
    if (typeof language !== "string") {
      console.error(`LanguagePipe has been invoked with an invalid parameter [${typeof language}]`);
      return value;
    }
    return "```" + language + "\n" + value + "\n```";
  }
  static {
    this.\u0275fac = function LanguagePipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LanguagePipe)();
    };
  }
  static {
    this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
      name: "language",
      type: _LanguagePipe,
      pure: true,
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LanguagePipe, [{
    type: Pipe,
    args: [{
      name: "language",
      standalone: true
    }]
  }], null, null);
})();
var PrismPlugin;
(function(PrismPlugin2) {
  PrismPlugin2["CommandLine"] = "command-line";
  PrismPlugin2["LineHighlight"] = "line-highlight";
  PrismPlugin2["LineNumbers"] = "line-numbers";
})(PrismPlugin || (PrismPlugin = {}));
var MARKED_EXTENSIONS = new InjectionToken("MARKED_EXTENSIONS");
var MARKED_OPTIONS = new InjectionToken("MARKED_OPTIONS");
var errorJoyPixelsNotLoaded = "[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information";
var errorKatexNotLoaded = "[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information";
var errorMermaidNotLoaded = "[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information";
var errorClipboardNotLoaded = "[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information";
var errorClipboardViewContainerRequired = "[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function";
var errorSrcWithoutHttpClient = "[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information";
var SECURITY_CONTEXT = new InjectionToken("SECURITY_CONTEXT");
var MarkdownService = class _MarkdownService {
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = __spreadValues(__spreadValues({}, this.DEFAULT_MARKED_OPTIONS), value);
  }
  get renderer() {
    return this.options.renderer;
  }
  set renderer(value) {
    this.options.renderer = value;
  }
  constructor(clipboardOptions, extensions, options2, platform, securityContext, http, sanitizer) {
    this.clipboardOptions = clipboardOptions;
    this.extensions = extensions;
    this.platform = platform;
    this.securityContext = securityContext;
    this.http = http;
    this.sanitizer = sanitizer;
    this.DEFAULT_MARKED_OPTIONS = {
      renderer: new _Renderer()
    };
    this.DEFAULT_KATEX_OPTIONS = {
      delimiters: [{
        left: "$$",
        right: "$$",
        display: true
      }, {
        left: "$",
        right: "$",
        display: false
      }, {
        left: "\\(",
        right: "\\)",
        display: false
      }, {
        left: "\\begin{equation}",
        right: "\\end{equation}",
        display: true
      }, {
        left: "\\begin{align}",
        right: "\\end{align}",
        display: true
      }, {
        left: "\\begin{alignat}",
        right: "\\end{alignat}",
        display: true
      }, {
        left: "\\begin{gather}",
        right: "\\end{gather}",
        display: true
      }, {
        left: "\\begin{CD}",
        right: "\\end{CD}",
        display: true
      }, {
        left: "\\[",
        right: "\\]",
        display: true
      }]
    };
    this.DEFAULT_MERMAID_OPTIONS = {
      startOnLoad: false
    };
    this.DEFAULT_CLIPBOARD_OPTIONS = {
      buttonComponent: void 0
    };
    this.DEFAULT_PARSE_OPTIONS = {
      decodeHtml: false,
      inline: false,
      emoji: false,
      mermaid: false,
      markedOptions: void 0,
      disableSanitizer: false
    };
    this.DEFAULT_RENDER_OPTIONS = {
      clipboard: false,
      clipboardOptions: void 0,
      katex: false,
      katexOptions: void 0,
      mermaid: false,
      mermaidOptions: void 0
    };
    this._reload$ = new Subject();
    this.reload$ = this._reload$.asObservable();
    this.options = options2;
  }
  parse(markdown, parseOptions = this.DEFAULT_PARSE_OPTIONS) {
    const {
      decodeHtml,
      inline: inline2,
      emoji,
      mermaid: mermaid2,
      disableSanitizer
    } = parseOptions;
    const markedOptions = __spreadValues(__spreadValues({}, this.options), parseOptions.markedOptions);
    const renderer = markedOptions.renderer || this.renderer || new _Renderer();
    if (this.extensions) {
      this.renderer = this.extendsRendererForExtensions(renderer);
    }
    if (mermaid2) {
      this.renderer = this.extendsRendererForMermaid(renderer);
    }
    const trimmed = this.trimIndentation(markdown);
    const decoded = decodeHtml ? this.decodeHtml(trimmed) : trimmed;
    const emojified = emoji ? this.parseEmoji(decoded) : decoded;
    const marked2 = this.parseMarked(emojified, markedOptions, inline2);
    const sanitized = disableSanitizer ? marked2 : this.sanitizer.sanitize(this.securityContext, marked2);
    return sanitized || "";
  }
  render(element, options2 = this.DEFAULT_RENDER_OPTIONS, viewContainerRef) {
    const {
      clipboard,
      clipboardOptions,
      katex: katex2,
      katexOptions,
      mermaid: mermaid2,
      mermaidOptions
    } = options2;
    if (katex2) {
      this.renderKatex(element, __spreadValues(__spreadValues({}, this.DEFAULT_KATEX_OPTIONS), katexOptions));
    }
    if (mermaid2) {
      this.renderMermaid(element, __spreadValues(__spreadValues({}, this.DEFAULT_MERMAID_OPTIONS), mermaidOptions));
    }
    if (clipboard) {
      this.renderClipboard(element, viewContainerRef, __spreadValues(__spreadValues(__spreadValues({}, this.DEFAULT_CLIPBOARD_OPTIONS), this.clipboardOptions), clipboardOptions));
    }
    this.highlight(element);
  }
  reload() {
    this._reload$.next();
  }
  getSource(src) {
    if (!this.http) {
      throw new Error(errorSrcWithoutHttpClient);
    }
    return this.http.get(src, {
      responseType: "text"
    }).pipe(map((markdown) => this.handleExtension(src, markdown)));
  }
  highlight(element) {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    if (typeof Prism === "undefined" || typeof Prism.highlightAllUnder === "undefined") {
      return;
    }
    if (!element) {
      element = document;
    }
    const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
    Array.prototype.forEach.call(noLanguageElements, (x) => x.classList.add("language-none"));
    Prism.highlightAllUnder(element);
  }
  decodeHtml(html2) {
    if (!isPlatformBrowser(this.platform)) {
      return html2;
    }
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html2;
    return textarea.value;
  }
  extendsRendererForExtensions(renderer) {
    const extendedRenderer = renderer;
    if (extendedRenderer.\u0275NgxMarkdownRendererExtendedForExtensions === true) {
      return renderer;
    }
    if (this.extensions?.length > 0) {
      marked.use(...this.extensions);
    }
    extendedRenderer.\u0275NgxMarkdownRendererExtendedForExtensions = true;
    return renderer;
  }
  extendsRendererForMermaid(renderer) {
    const extendedRenderer = renderer;
    if (extendedRenderer.\u0275NgxMarkdownRendererExtendedForMermaid === true) {
      return renderer;
    }
    const defaultCode = renderer.code;
    renderer.code = function(code, language, isEscaped) {
      return language === "mermaid" ? `<div class="mermaid">${code}</div>` : defaultCode.call(this, code, language, isEscaped);
    };
    extendedRenderer.\u0275NgxMarkdownRendererExtendedForMermaid = true;
    return renderer;
  }
  handleExtension(src, markdown) {
    const urlProtocolIndex = src.lastIndexOf("://");
    const urlWithoutProtocol = urlProtocolIndex > -1 ? src.substring(urlProtocolIndex + 4) : src;
    const lastSlashIndex = urlWithoutProtocol.lastIndexOf("/");
    const lastUrlSegment = lastSlashIndex > -1 ? urlWithoutProtocol.substring(lastSlashIndex + 1).split("?")[0] : "";
    const lastDotIndex = lastUrlSegment.lastIndexOf(".");
    const extension = lastDotIndex > -1 ? lastUrlSegment.substring(lastDotIndex + 1) : "";
    return !!extension && extension !== "md" ? "```" + extension + "\n" + markdown + "\n```" : markdown;
  }
  parseMarked(html2, markedOptions, inline2 = false) {
    if (markedOptions.renderer) {
      const renderer = __spreadValues({}, markedOptions.renderer);
      delete renderer.\u0275NgxMarkdownRendererExtendedForExtensions;
      delete renderer.\u0275NgxMarkdownRendererExtendedForMermaid;
      delete markedOptions.renderer;
      marked.use({
        renderer
      });
    }
    return inline2 ? marked.parseInline(html2, markedOptions) : marked.parse(html2, markedOptions);
  }
  parseEmoji(html2) {
    if (!isPlatformBrowser(this.platform)) {
      return html2;
    }
    if (typeof joypixels === "undefined" || typeof joypixels.shortnameToUnicode === "undefined") {
      throw new Error(errorJoyPixelsNotLoaded);
    }
    return joypixels.shortnameToUnicode(html2);
  }
  renderKatex(element, options2) {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    if (typeof katex === "undefined" || typeof renderMathInElement === "undefined") {
      throw new Error(errorKatexNotLoaded);
    }
    renderMathInElement(element, options2);
  }
  renderClipboard(element, viewContainerRef, options2) {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    if (typeof ClipboardJS === "undefined") {
      throw new Error(errorClipboardNotLoaded);
    }
    if (!viewContainerRef) {
      throw new Error(errorClipboardViewContainerRequired);
    }
    const {
      buttonComponent,
      buttonTemplate
    } = options2;
    const preElements = element.querySelectorAll("pre");
    for (let i = 0; i < preElements.length; i++) {
      const preElement = preElements.item(i);
      const preWrapperElement = document.createElement("div");
      preWrapperElement.style.position = "relative";
      preElement.parentNode.insertBefore(preWrapperElement, preElement);
      preWrapperElement.appendChild(preElement);
      const toolbarWrapperElement = document.createElement("div");
      toolbarWrapperElement.classList.add("markdown-clipboard-toolbar");
      toolbarWrapperElement.style.position = "absolute";
      toolbarWrapperElement.style.top = ".5em";
      toolbarWrapperElement.style.right = ".5em";
      toolbarWrapperElement.style.zIndex = "1";
      preWrapperElement.insertAdjacentElement("beforeend", toolbarWrapperElement);
      preWrapperElement.onmouseenter = () => toolbarWrapperElement.classList.add("hover");
      preWrapperElement.onmouseleave = () => toolbarWrapperElement.classList.remove("hover");
      let embeddedViewRef;
      if (buttonComponent) {
        const componentRef = viewContainerRef.createComponent(buttonComponent);
        embeddedViewRef = componentRef.hostView;
        componentRef.changeDetectorRef.markForCheck();
      } else if (buttonTemplate) {
        embeddedViewRef = viewContainerRef.createEmbeddedView(buttonTemplate);
      } else {
        const componentRef = viewContainerRef.createComponent(ClipboardButtonComponent);
        embeddedViewRef = componentRef.hostView;
        componentRef.changeDetectorRef.markForCheck();
      }
      let clipboardInstance;
      embeddedViewRef.rootNodes.forEach((node) => {
        toolbarWrapperElement.appendChild(node);
        clipboardInstance = new ClipboardJS(node, {
          text: () => preElement.innerText
        });
      });
      embeddedViewRef.onDestroy(() => clipboardInstance.destroy());
    }
  }
  renderMermaid(element, options2 = this.DEFAULT_MERMAID_OPTIONS) {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    if (typeof mermaid === "undefined" || typeof mermaid.initialize === "undefined") {
      throw new Error(errorMermaidNotLoaded);
    }
    const mermaidElements = element.querySelectorAll(".mermaid");
    if (mermaidElements.length === 0) {
      return;
    }
    mermaid.initialize(options2);
    mermaid.run({
      nodes: mermaidElements
    });
  }
  trimIndentation(markdown) {
    if (!markdown) {
      return "";
    }
    let indentStart;
    return markdown.split("\n").map((line) => {
      let lineIdentStart = indentStart;
      if (line.length > 0) {
        lineIdentStart = isNaN(lineIdentStart) ? line.search(/\S|$/) : Math.min(line.search(/\S|$/), lineIdentStart);
      }
      if (isNaN(indentStart)) {
        indentStart = lineIdentStart;
      }
      return lineIdentStart ? line.substring(lineIdentStart) : line;
    }).join("\n");
  }
  static {
    this.\u0275fac = function MarkdownService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MarkdownService)(\u0275\u0275inject(CLIPBOARD_OPTIONS, 8), \u0275\u0275inject(MARKED_EXTENSIONS, 8), \u0275\u0275inject(MARKED_OPTIONS, 8), \u0275\u0275inject(PLATFORM_ID), \u0275\u0275inject(SECURITY_CONTEXT), \u0275\u0275inject(HttpClient, 8), \u0275\u0275inject(DomSanitizer));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _MarkdownService,
      factory: _MarkdownService.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkdownService, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [CLIPBOARD_OPTIONS]
    }, {
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MARKED_EXTENSIONS]
    }, {
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MARKED_OPTIONS]
    }, {
      type: Optional
    }]
  }, {
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: SecurityContext,
    decorators: [{
      type: Inject,
      args: [SECURITY_CONTEXT]
    }]
  }, {
    type: HttpClient,
    decorators: [{
      type: Optional
    }]
  }, {
    type: DomSanitizer
  }], null);
})();
var MarkdownComponent = class _MarkdownComponent {
  get disableSanitizer() {
    return this._disableSanitizer;
  }
  set disableSanitizer(value) {
    this._disableSanitizer = this.coerceBooleanProperty(value);
  }
  get inline() {
    return this._inline;
  }
  set inline(value) {
    this._inline = this.coerceBooleanProperty(value);
  }
  // Plugin - clipboard
  get clipboard() {
    return this._clipboard;
  }
  set clipboard(value) {
    this._clipboard = this.coerceBooleanProperty(value);
  }
  // Plugin - emoji
  get emoji() {
    return this._emoji;
  }
  set emoji(value) {
    this._emoji = this.coerceBooleanProperty(value);
  }
  // Plugin - katex
  get katex() {
    return this._katex;
  }
  set katex(value) {
    this._katex = this.coerceBooleanProperty(value);
  }
  // Plugin - mermaid
  get mermaid() {
    return this._mermaid;
  }
  set mermaid(value) {
    this._mermaid = this.coerceBooleanProperty(value);
  }
  // Plugin - lineHighlight
  get lineHighlight() {
    return this._lineHighlight;
  }
  set lineHighlight(value) {
    this._lineHighlight = this.coerceBooleanProperty(value);
  }
  // Plugin - lineNumbers
  get lineNumbers() {
    return this._lineNumbers;
  }
  set lineNumbers(value) {
    this._lineNumbers = this.coerceBooleanProperty(value);
  }
  // Plugin - commandLine
  get commandLine() {
    return this._commandLine;
  }
  set commandLine(value) {
    this._commandLine = this.coerceBooleanProperty(value);
  }
  constructor(element, markdownService, viewContainerRef) {
    this.element = element;
    this.markdownService = markdownService;
    this.viewContainerRef = viewContainerRef;
    this.error = new EventEmitter();
    this.load = new EventEmitter();
    this.ready = new EventEmitter();
    this._clipboard = false;
    this._commandLine = false;
    this._disableSanitizer = false;
    this._emoji = false;
    this._inline = false;
    this._katex = false;
    this._lineHighlight = false;
    this._lineNumbers = false;
    this._mermaid = false;
    this.destroyed$ = new Subject();
  }
  ngOnChanges() {
    this.loadContent();
  }
  loadContent() {
    if (this.data != null) {
      this.handleData();
      return;
    }
    if (this.src != null) {
      this.handleSrc();
      return;
    }
  }
  ngAfterViewInit() {
    if (!this.data && !this.src) {
      this.handleTransclusion();
    }
    this.markdownService.reload$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.loadContent());
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  render(markdown, decodeHtml = false) {
    return __async(this, null, function* () {
      const parsedOptions = {
        decodeHtml,
        inline: this.inline,
        emoji: this.emoji,
        mermaid: this.mermaid,
        disableSanitizer: this.disableSanitizer
      };
      const renderOptions = {
        clipboard: this.clipboard,
        clipboardOptions: this.getClipboardOptions(),
        katex: this.katex,
        katexOptions: this.katexOptions,
        mermaid: this.mermaid,
        mermaidOptions: this.mermaidOptions
      };
      const parsed = yield this.markdownService.parse(markdown, parsedOptions);
      this.element.nativeElement.innerHTML = parsed;
      this.handlePlugins();
      this.markdownService.render(this.element.nativeElement, renderOptions, this.viewContainerRef);
      this.ready.emit();
    });
  }
  coerceBooleanProperty(value) {
    return value != null && `${String(value)}` !== "false";
  }
  getClipboardOptions() {
    if (this.clipboardButtonComponent || this.clipboardButtonTemplate) {
      return {
        buttonComponent: this.clipboardButtonComponent,
        buttonTemplate: this.clipboardButtonTemplate
      };
    }
    return void 0;
  }
  handleData() {
    this.render(this.data);
  }
  handleSrc() {
    this.markdownService.getSource(this.src).subscribe({
      next: (markdown) => {
        this.render(markdown).then(() => {
          this.load.emit(markdown);
        });
      },
      error: (error) => this.error.emit(error)
    });
  }
  handleTransclusion() {
    this.render(this.element.nativeElement.innerHTML, true);
  }
  handlePlugins() {
    if (this.commandLine) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.CommandLine);
      this.setPluginOptions(this.element.nativeElement, {
        dataFilterOutput: this.filterOutput,
        dataHost: this.host,
        dataPrompt: this.prompt,
        dataOutput: this.output,
        dataUser: this.user
      });
    }
    if (this.lineHighlight) {
      this.setPluginOptions(this.element.nativeElement, {
        dataLine: this.line,
        dataLineOffset: this.lineOffset
      });
    }
    if (this.lineNumbers) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.LineNumbers);
      this.setPluginOptions(this.element.nativeElement, {
        dataStart: this.start
      });
    }
  }
  setPluginClass(element, plugin) {
    const preElements = element.querySelectorAll("pre");
    for (let i = 0; i < preElements.length; i++) {
      const classes = plugin instanceof Array ? plugin : [plugin];
      preElements.item(i).classList.add(...classes);
    }
  }
  setPluginOptions(element, options2) {
    const preElements = element.querySelectorAll("pre");
    for (let i = 0; i < preElements.length; i++) {
      Object.keys(options2).forEach((option) => {
        const attributeValue = options2[option];
        if (attributeValue) {
          const attributeName = this.toLispCase(option);
          preElements.item(i).setAttribute(attributeName, attributeValue.toString());
        }
      });
    }
  }
  toLispCase(value) {
    const upperChars = value.match(/([A-Z])/g);
    if (!upperChars) {
      return value;
    }
    let str = value.toString();
    for (let i = 0, n = upperChars.length; i < n; i++) {
      str = str.replace(new RegExp(upperChars[i]), "-" + upperChars[i].toLowerCase());
    }
    if (str.slice(0, 1) === "-") {
      str = str.slice(1);
    }
    return str;
  }
  static {
    this.\u0275fac = function MarkdownComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MarkdownComponent)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(MarkdownService), \u0275\u0275directiveInject(ViewContainerRef));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MarkdownComponent,
      selectors: [["markdown"], ["", "markdown", ""]],
      inputs: {
        data: "data",
        src: "src",
        disableSanitizer: "disableSanitizer",
        inline: "inline",
        clipboard: "clipboard",
        clipboardButtonComponent: "clipboardButtonComponent",
        clipboardButtonTemplate: "clipboardButtonTemplate",
        emoji: "emoji",
        katex: "katex",
        katexOptions: "katexOptions",
        mermaid: "mermaid",
        mermaidOptions: "mermaidOptions",
        lineHighlight: "lineHighlight",
        line: "line",
        lineOffset: "lineOffset",
        lineNumbers: "lineNumbers",
        start: "start",
        commandLine: "commandLine",
        filterOutput: "filterOutput",
        host: "host",
        prompt: "prompt",
        output: "output",
        user: "user"
      },
      outputs: {
        error: "error",
        load: "load",
        ready: "ready"
      },
      standalone: true,
      features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c0,
      decls: 1,
      vars: 0,
      template: function MarkdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
        }
      },
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkdownComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "markdown, [markdown]",
      template: "<ng-content></ng-content>",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: MarkdownService
  }, {
    type: ViewContainerRef
  }], {
    data: [{
      type: Input
    }],
    src: [{
      type: Input
    }],
    disableSanitizer: [{
      type: Input
    }],
    inline: [{
      type: Input
    }],
    clipboard: [{
      type: Input
    }],
    clipboardButtonComponent: [{
      type: Input
    }],
    clipboardButtonTemplate: [{
      type: Input
    }],
    emoji: [{
      type: Input
    }],
    katex: [{
      type: Input
    }],
    katexOptions: [{
      type: Input
    }],
    mermaid: [{
      type: Input
    }],
    mermaidOptions: [{
      type: Input
    }],
    lineHighlight: [{
      type: Input
    }],
    line: [{
      type: Input
    }],
    lineOffset: [{
      type: Input
    }],
    lineNumbers: [{
      type: Input
    }],
    start: [{
      type: Input
    }],
    commandLine: [{
      type: Input
    }],
    filterOutput: [{
      type: Input
    }],
    host: [{
      type: Input
    }],
    prompt: [{
      type: Input
    }],
    output: [{
      type: Input
    }],
    user: [{
      type: Input
    }],
    error: [{
      type: Output
    }],
    load: [{
      type: Output
    }],
    ready: [{
      type: Output
    }]
  });
})();
var MarkdownPipe = class _MarkdownPipe {
  constructor(domSanitizer, elementRef, markdownService, viewContainerRef, zone) {
    this.domSanitizer = domSanitizer;
    this.elementRef = elementRef;
    this.markdownService = markdownService;
    this.viewContainerRef = viewContainerRef;
    this.zone = zone;
  }
  transform(value, options2) {
    return __async(this, null, function* () {
      if (value == null) {
        return "";
      }
      if (typeof value !== "string") {
        console.error(`MarkdownPipe has been invoked with an invalid value type [${typeof value}]`);
        return value;
      }
      const markdown = yield this.markdownService.parse(value, options2);
      this.zone.onStable.pipe(first()).subscribe(() => this.markdownService.render(this.elementRef.nativeElement, options2, this.viewContainerRef));
      return this.domSanitizer.bypassSecurityTrustHtml(markdown);
    });
  }
  static {
    this.\u0275fac = function MarkdownPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MarkdownPipe)(\u0275\u0275directiveInject(DomSanitizer, 16), \u0275\u0275directiveInject(ElementRef, 16), \u0275\u0275directiveInject(MarkdownService, 16), \u0275\u0275directiveInject(ViewContainerRef, 16), \u0275\u0275directiveInject(NgZone, 16));
    };
  }
  static {
    this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
      name: "markdown",
      type: _MarkdownPipe,
      pure: true,
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkdownPipe, [{
    type: Pipe,
    args: [{
      name: "markdown",
      standalone: true
    }]
  }], () => [{
    type: DomSanitizer
  }, {
    type: ElementRef
  }, {
    type: MarkdownService
  }, {
    type: ViewContainerRef
  }, {
    type: NgZone
  }], null);
})();
function provideMarkdown(markdownModuleConfig) {
  return [MarkdownService, markdownModuleConfig?.loader ?? [], markdownModuleConfig?.clipboardOptions ?? [], markdownModuleConfig?.markedOptions ?? [], {
    provide: MARKED_EXTENSIONS,
    useValue: markdownModuleConfig?.markedExtensions ?? []
  }, {
    provide: SECURITY_CONTEXT,
    useValue: markdownModuleConfig?.sanitize ?? SecurityContext.HTML
  }];
}
var sharedDeclarations = [ClipboardButtonComponent, LanguagePipe, MarkdownComponent, MarkdownPipe];
var MarkdownModule = class _MarkdownModule {
  static forRoot(markdownModuleConfig) {
    return {
      ngModule: _MarkdownModule,
      providers: [provideMarkdown(markdownModuleConfig)]
    };
  }
  static forChild() {
    return {
      ngModule: _MarkdownModule
    };
  }
  static {
    this.\u0275fac = function MarkdownModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MarkdownModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MarkdownModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [CommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkdownModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, ...sharedDeclarations],
      exports: sharedDeclarations
    }]
  }], null, null);
})();
var MermaidAPI;
(function(MermaidAPI2) {
  let SecurityLevel;
  (function(SecurityLevel2) {
    SecurityLevel2["Strict"] = "strict";
    SecurityLevel2["Loose"] = "loose";
    SecurityLevel2["Antiscript"] = "antiscript";
    SecurityLevel2["Sandbox"] = "sandbox";
  })(SecurityLevel = MermaidAPI2.SecurityLevel || (MermaidAPI2.SecurityLevel = {}));
  let Theme;
  (function(Theme2) {
    Theme2["Base"] = "base";
    Theme2["Forest"] = "forest";
    Theme2["Dark"] = "dark";
    Theme2["Default"] = "default";
    Theme2["Neutral"] = "neutral";
  })(Theme = MermaidAPI2.Theme || (MermaidAPI2.Theme = {}));
  let LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["Debug"] = 1] = "Debug";
    LogLevel2[LogLevel2["Info"] = 2] = "Info";
    LogLevel2[LogLevel2["Warn"] = 3] = "Warn";
    LogLevel2[LogLevel2["Error"] = 4] = "Error";
    LogLevel2[LogLevel2["Fatal"] = 5] = "Fatal";
  })(LogLevel = MermaidAPI2.LogLevel || (MermaidAPI2.LogLevel = {}));
})(MermaidAPI || (MermaidAPI = {}));

// node_modules/xlsx/xlsx.mjs
var XLSX = {};
XLSX.version = "0.18.5";
var current_codepage = 1200;
var current_ansi = 1252;
var VALID_ANSI = [874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1e4];
var CS2CP = {
  /*::[*/
  0: 1252,
  /* ANSI */
  /*::[*/
  1: 65001,
  /* DEFAULT */
  /*::[*/
  2: 65001,
  /* SYMBOL */
  /*::[*/
  77: 1e4,
  /* MAC */
  /*::[*/
  128: 932,
  /* SHIFTJIS */
  /*::[*/
  129: 949,
  /* HANGUL */
  /*::[*/
  130: 1361,
  /* JOHAB */
  /*::[*/
  134: 936,
  /* GB2312 */
  /*::[*/
  136: 950,
  /* CHINESEBIG5 */
  /*::[*/
  161: 1253,
  /* GREEK */
  /*::[*/
  162: 1254,
  /* TURKISH */
  /*::[*/
  163: 1258,
  /* VIETNAMESE */
  /*::[*/
  177: 1255,
  /* HEBREW */
  /*::[*/
  178: 1256,
  /* ARABIC */
  /*::[*/
  186: 1257,
  /* BALTIC */
  /*::[*/
  204: 1251,
  /* RUSSIAN */
  /*::[*/
  222: 874,
  /* THAI */
  /*::[*/
  238: 1250,
  /* EASTEUROPE */
  /*::[*/
  255: 1252,
  /* OEM */
  /*::[*/
  69: 6969
  /* MISC */
};
var set_ansi = function(cp) {
  if (VALID_ANSI.indexOf(cp) == -1) return;
  current_ansi = CS2CP[0] = cp;
};
function reset_ansi() {
  set_ansi(1252);
}
var set_cp = function(cp) {
  current_codepage = cp;
  set_ansi(cp);
};
function reset_cp() {
  set_cp(1200);
  reset_ansi();
}
function utf16beread(data) {
  var o = [];
  for (var i = 0; i < data.length >> 1; ++i) o[i] = String.fromCharCode(data.charCodeAt(2 * i + 1) + (data.charCodeAt(2 * i) << 8));
  return o.join("");
}
var _getchar = function _gc1(x) {
  return String.fromCharCode(x);
};
var _getansi = function _ga1(x) {
  return String.fromCharCode(x);
};
var $cptable;
var DENSE = null;
var DIF_XL = true;
var Base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Base64_encode(input) {
  var o = "";
  var c1 = 0, c2 = 0, c3 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0;
  for (var i = 0; i < input.length; ) {
    c1 = input.charCodeAt(i++);
    e1 = c1 >> 2;
    c2 = input.charCodeAt(i++);
    e2 = (c1 & 3) << 4 | c2 >> 4;
    c3 = input.charCodeAt(i++);
    e3 = (c2 & 15) << 2 | c3 >> 6;
    e4 = c3 & 63;
    if (isNaN(c2)) {
      e3 = e4 = 64;
    } else if (isNaN(c3)) {
      e4 = 64;
    }
    o += Base64_map.charAt(e1) + Base64_map.charAt(e2) + Base64_map.charAt(e3) + Base64_map.charAt(e4);
  }
  return o;
}
function Base64_decode(input) {
  var o = "";
  var c1 = 0, c2 = 0, c3 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0;
  input = input.replace(/[^\w\+\/\=]/g, "");
  for (var i = 0; i < input.length; ) {
    e1 = Base64_map.indexOf(input.charAt(i++));
    e2 = Base64_map.indexOf(input.charAt(i++));
    c1 = e1 << 2 | e2 >> 4;
    o += String.fromCharCode(c1);
    e3 = Base64_map.indexOf(input.charAt(i++));
    c2 = (e2 & 15) << 4 | e3 >> 2;
    if (e3 !== 64) {
      o += String.fromCharCode(c2);
    }
    e4 = Base64_map.indexOf(input.charAt(i++));
    c3 = (e3 & 3) << 6 | e4;
    if (e4 !== 64) {
      o += String.fromCharCode(c3);
    }
  }
  return o;
}
var has_buf = /* @__PURE__ */ function() {
  return typeof Buffer !== "undefined" && typeof process !== "undefined" && typeof process.versions !== "undefined" && !!process.versions.node;
}();
var Buffer_from = /* @__PURE__ */ function() {
  if (typeof Buffer !== "undefined") {
    var nbfs = !Buffer.from;
    if (!nbfs) try {
      Buffer.from("foo", "utf8");
    } catch (e) {
      nbfs = true;
    }
    return nbfs ? function(buf, enc) {
      return enc ? new Buffer(buf, enc) : new Buffer(buf);
    } : Buffer.from.bind(Buffer);
  }
  return function() {
  };
}();
function new_raw_buf(len) {
  if (has_buf) return Buffer.alloc ? Buffer.alloc(len) : new Buffer(len);
  return typeof Uint8Array != "undefined" ? new Uint8Array(len) : new Array(len);
}
function new_unsafe_buf(len) {
  if (has_buf) return Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : new Buffer(len);
  return typeof Uint8Array != "undefined" ? new Uint8Array(len) : new Array(len);
}
var s2a = function s2a2(s) {
  if (has_buf) return Buffer_from(s, "binary");
  return s.split("").map(function(x) {
    return x.charCodeAt(0) & 255;
  });
};
function s2ab(s) {
  if (typeof ArrayBuffer === "undefined") return s2a(s);
  var buf = new ArrayBuffer(s.length), view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 255;
  return buf;
}
function a2s(data) {
  if (Array.isArray(data)) return data.map(function(c) {
    return String.fromCharCode(c);
  }).join("");
  var o = [];
  for (var i = 0; i < data.length; ++i) o[i] = String.fromCharCode(data[i]);
  return o.join("");
}
function a2u(data) {
  if (typeof Uint8Array === "undefined") throw new Error("Unsupported");
  return new Uint8Array(data);
}
var bconcat = has_buf ? function(bufs) {
  return Buffer.concat(bufs.map(function(buf) {
    return Buffer.isBuffer(buf) ? buf : Buffer_from(buf);
  }));
} : function(bufs) {
  if (typeof Uint8Array !== "undefined") {
    var i = 0, maxlen = 0;
    for (i = 0; i < bufs.length; ++i) maxlen += bufs[i].length;
    var o = new Uint8Array(maxlen);
    var len = 0;
    for (i = 0, maxlen = 0; i < bufs.length; maxlen += len, ++i) {
      len = bufs[i].length;
      if (bufs[i] instanceof Uint8Array) o.set(bufs[i], maxlen);
      else if (typeof bufs[i] == "string") {
        throw "wtf";
      } else o.set(new Uint8Array(bufs[i]), maxlen);
    }
    return o;
  }
  return [].concat.apply([], bufs.map(function(buf) {
    return Array.isArray(buf) ? buf : [].slice.call(buf);
  }));
};
function utf8decode(content) {
  var out = [], widx = 0, L = content.length + 250;
  var o = new_raw_buf(content.length + 255);
  for (var ridx = 0; ridx < content.length; ++ridx) {
    var c = content.charCodeAt(ridx);
    if (c < 128) o[widx++] = c;
    else if (c < 2048) {
      o[widx++] = 192 | c >> 6 & 31;
      o[widx++] = 128 | c & 63;
    } else if (c >= 55296 && c < 57344) {
      c = (c & 1023) + 64;
      var d = content.charCodeAt(++ridx) & 1023;
      o[widx++] = 240 | c >> 8 & 7;
      o[widx++] = 128 | c >> 2 & 63;
      o[widx++] = 128 | d >> 6 & 15 | (c & 3) << 4;
      o[widx++] = 128 | d & 63;
    } else {
      o[widx++] = 224 | c >> 12 & 15;
      o[widx++] = 128 | c >> 6 & 63;
      o[widx++] = 128 | c & 63;
    }
    if (widx > L) {
      out.push(o.slice(0, widx));
      widx = 0;
      o = new_raw_buf(65535);
      L = 65530;
    }
  }
  out.push(o.slice(0, widx));
  return bconcat(out);
}
var chr0 = /\u0000/g;
var chr1 = /[\u0001-\u0006]/g;
function _strrev(x) {
  var o = "", i = x.length - 1;
  while (i >= 0) o += x.charAt(i--);
  return o;
}
function pad0(v, d) {
  var t = "" + v;
  return t.length >= d ? t : fill("0", d - t.length) + t;
}
function pad_(v, d) {
  var t = "" + v;
  return t.length >= d ? t : fill(" ", d - t.length) + t;
}
function rpad_(v, d) {
  var t = "" + v;
  return t.length >= d ? t : t + fill(" ", d - t.length);
}
function pad0r1(v, d) {
  var t = "" + Math.round(v);
  return t.length >= d ? t : fill("0", d - t.length) + t;
}
function pad0r2(v, d) {
  var t = "" + v;
  return t.length >= d ? t : fill("0", d - t.length) + t;
}
var p2_32 = /* @__PURE__ */ Math.pow(2, 32);
function pad0r(v, d) {
  if (v > p2_32 || v < -p2_32) return pad0r1(v, d);
  var i = Math.round(v);
  return pad0r2(i, d);
}
function SSF_isgeneral(s, i) {
  i = i || 0;
  return s.length >= 7 + i && (s.charCodeAt(i) | 32) === 103 && (s.charCodeAt(i + 1) | 32) === 101 && (s.charCodeAt(i + 2) | 32) === 110 && (s.charCodeAt(i + 3) | 32) === 101 && (s.charCodeAt(i + 4) | 32) === 114 && (s.charCodeAt(i + 5) | 32) === 97 && (s.charCodeAt(i + 6) | 32) === 108;
}
var days = [["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"]];
var months = [["J", "Jan", "January"], ["F", "Feb", "February"], ["M", "Mar", "March"], ["A", "Apr", "April"], ["M", "May", "May"], ["J", "Jun", "June"], ["J", "Jul", "July"], ["A", "Aug", "August"], ["S", "Sep", "September"], ["O", "Oct", "October"], ["N", "Nov", "November"], ["D", "Dec", "December"]];
function SSF_init_table(t) {
  if (!t) t = {};
  t[0] = "General";
  t[1] = "0";
  t[2] = "0.00";
  t[3] = "#,##0";
  t[4] = "#,##0.00";
  t[9] = "0%";
  t[10] = "0.00%";
  t[11] = "0.00E+00";
  t[12] = "# ?/?";
  t[13] = "# ??/??";
  t[14] = "m/d/yy";
  t[15] = "d-mmm-yy";
  t[16] = "d-mmm";
  t[17] = "mmm-yy";
  t[18] = "h:mm AM/PM";
  t[19] = "h:mm:ss AM/PM";
  t[20] = "h:mm";
  t[21] = "h:mm:ss";
  t[22] = "m/d/yy h:mm";
  t[37] = "#,##0 ;(#,##0)";
  t[38] = "#,##0 ;[Red](#,##0)";
  t[39] = "#,##0.00;(#,##0.00)";
  t[40] = "#,##0.00;[Red](#,##0.00)";
  t[45] = "mm:ss";
  t[46] = "[h]:mm:ss";
  t[47] = "mmss.0";
  t[48] = "##0.0E+0";
  t[49] = "@";
  t[56] = '"\u4E0A\u5348/\u4E0B\u5348 "hh"\u6642"mm"\u5206"ss"\u79D2 "';
  return t;
}
var table_fmt = {
  0: "General",
  1: "0",
  2: "0.00",
  3: "#,##0",
  4: "#,##0.00",
  9: "0%",
  10: "0.00%",
  11: "0.00E+00",
  12: "# ?/?",
  13: "# ??/??",
  14: "m/d/yy",
  15: "d-mmm-yy",
  16: "d-mmm",
  17: "mmm-yy",
  18: "h:mm AM/PM",
  19: "h:mm:ss AM/PM",
  20: "h:mm",
  21: "h:mm:ss",
  22: "m/d/yy h:mm",
  37: "#,##0 ;(#,##0)",
  38: "#,##0 ;[Red](#,##0)",
  39: "#,##0.00;(#,##0.00)",
  40: "#,##0.00;[Red](#,##0.00)",
  45: "mm:ss",
  46: "[h]:mm:ss",
  47: "mmss.0",
  48: "##0.0E+0",
  49: "@",
  56: '"\u4E0A\u5348/\u4E0B\u5348 "hh"\u6642"mm"\u5206"ss"\u79D2 "'
};
var SSF_default_map = {
  5: 37,
  6: 38,
  7: 39,
  8: 40,
  //  5 -> 37 ...  8 -> 40
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  // 23 ->  0 ... 26 ->  0
  27: 14,
  28: 14,
  29: 14,
  30: 14,
  31: 14,
  // 27 -> 14 ... 31 -> 14
  50: 14,
  51: 14,
  52: 14,
  53: 14,
  54: 14,
  // 50 -> 14 ... 58 -> 14
  55: 14,
  56: 14,
  57: 14,
  58: 14,
  59: 1,
  60: 2,
  61: 3,
  62: 4,
  // 59 ->  1 ... 62 ->  4
  67: 9,
  68: 10,
  // 67 ->  9 ... 68 -> 10
  69: 12,
  70: 13,
  71: 14,
  // 69 -> 12 ... 71 -> 14
  72: 14,
  73: 15,
  74: 16,
  75: 17,
  // 72 -> 14 ... 75 -> 17
  76: 20,
  77: 21,
  78: 22,
  // 76 -> 20 ... 78 -> 22
  79: 45,
  80: 46,
  81: 47,
  // 79 -> 45 ... 81 -> 47
  82: 0
  // 82 ->  0 ... 65536 -> 0 (omitted)
};
var SSF_default_str = {
  //  5 -- Currency,   0 decimal, black negative
  5: '"$"#,##0_);\\("$"#,##0\\)',
  63: '"$"#,##0_);\\("$"#,##0\\)',
  //  6 -- Currency,   0 decimal, red   negative
  6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  //  7 -- Currency,   2 decimal, black negative
  7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  //  8 -- Currency,   2 decimal, red   negative
  8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  // 41 -- Accounting, 0 decimal, No Symbol
  41: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',
  // 42 -- Accounting, 0 decimal, $  Symbol
  42: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
  // 43 -- Accounting, 2 decimal, No Symbol
  43: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',
  // 44 -- Accounting, 2 decimal, $  Symbol
  44: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)'
};
function SSF_frac(x, D, mixed) {
  var sgn = x < 0 ? -1 : 1;
  var B = x * sgn;
  var P_2 = 0, P_1 = 1, P = 0;
  var Q_2 = 1, Q_1 = 0, Q = 0;
  var A = Math.floor(B);
  while (Q_1 < D) {
    A = Math.floor(B);
    P = A * P_1 + P_2;
    Q = A * Q_1 + Q_2;
    if (B - A < 5e-8) break;
    B = 1 / (B - A);
    P_2 = P_1;
    P_1 = P;
    Q_2 = Q_1;
    Q_1 = Q;
  }
  if (Q > D) {
    if (Q_1 > D) {
      Q = Q_2;
      P = P_2;
    } else {
      Q = Q_1;
      P = P_1;
    }
  }
  if (!mixed) return [0, sgn * P, Q];
  var q = Math.floor(sgn * P / Q);
  return [q, sgn * P - q * Q, Q];
}
function SSF_parse_date_code(v, opts, b2) {
  if (v > 2958465 || v < 0) return null;
  var date = v | 0, time = Math.floor(86400 * (v - date)), dow = 0;
  var dout = [];
  var out = {
    D: date,
    T: time,
    u: 86400 * (v - date) - time,
    y: 0,
    m: 0,
    d: 0,
    H: 0,
    M: 0,
    S: 0,
    q: 0
  };
  if (Math.abs(out.u) < 1e-6) out.u = 0;
  if (opts && opts.date1904) date += 1462;
  if (out.u > 0.9999) {
    out.u = 0;
    if (++time == 86400) {
      out.T = time = 0;
      ++date;
      ++out.D;
    }
  }
  if (date === 60) {
    dout = b2 ? [1317, 10, 29] : [1900, 2, 29];
    dow = 3;
  } else if (date === 0) {
    dout = b2 ? [1317, 8, 29] : [1900, 1, 0];
    dow = 6;
  } else {
    if (date > 60) --date;
    var d = new Date(1900, 0, 1);
    d.setDate(d.getDate() + date - 1);
    dout = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    dow = d.getDay();
    if (date < 60) dow = (dow + 6) % 7;
    if (b2) dow = SSF_fix_hijri(d, dout);
  }
  out.y = dout[0];
  out.m = dout[1];
  out.d = dout[2];
  out.S = time % 60;
  time = Math.floor(time / 60);
  out.M = time % 60;
  time = Math.floor(time / 60);
  out.H = time;
  out.q = dow;
  return out;
}
var SSFbasedate = /* @__PURE__ */ new Date(1899, 11, 31, 0, 0, 0);
var SSFdnthresh = /* @__PURE__ */ SSFbasedate.getTime();
var SSFbase1904 = /* @__PURE__ */ new Date(1900, 2, 1, 0, 0, 0);
function datenum_local(v, date1904) {
  var epoch = /* @__PURE__ */ v.getTime();
  if (date1904) epoch -= 1461 * 24 * 60 * 60 * 1e3;
  else if (v >= SSFbase1904) epoch += 24 * 60 * 60 * 1e3;
  return (epoch - (SSFdnthresh + (/* @__PURE__ */ v.getTimezoneOffset() - /* @__PURE__ */ SSFbasedate.getTimezoneOffset()) * 6e4)) / (24 * 60 * 60 * 1e3);
}
function SSF_strip_decimal(o) {
  return o.indexOf(".") == -1 ? o : o.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}
function SSF_normalize_exp(o) {
  if (o.indexOf("E") == -1) return o;
  return o.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/, "$1E").replace(/(E[+-])(\d)$/, "$10$2");
}
function SSF_small_exp(v) {
  var w = v < 0 ? 12 : 11;
  var o = SSF_strip_decimal(v.toFixed(12));
  if (o.length <= w) return o;
  o = v.toPrecision(10);
  if (o.length <= w) return o;
  return v.toExponential(5);
}
function SSF_large_exp(v) {
  var o = SSF_strip_decimal(v.toFixed(11));
  return o.length > (v < 0 ? 12 : 11) || o === "0" || o === "-0" ? v.toPrecision(6) : o;
}
function SSF_general_num(v) {
  var V = Math.floor(Math.log(Math.abs(v)) * Math.LOG10E), o;
  if (V >= -4 && V <= -1) o = v.toPrecision(10 + V);
  else if (Math.abs(V) <= 9) o = SSF_small_exp(v);
  else if (V === 10) o = v.toFixed(10).substr(0, 12);
  else o = SSF_large_exp(v);
  return SSF_strip_decimal(SSF_normalize_exp(o.toUpperCase()));
}
function SSF_general(v, opts) {
  switch (typeof v) {
    case "string":
      return v;
    case "boolean":
      return v ? "TRUE" : "FALSE";
    case "number":
      return (v | 0) === v ? v.toString(10) : SSF_general_num(v);
    case "undefined":
      return "";
    case "object":
      if (v == null) return "";
      if (v instanceof Date) return SSF_format(14, datenum_local(v, opts && opts.date1904), opts);
  }
  throw new Error("unsupported value in General format: " + v);
}
function SSF_fix_hijri(date, o) {
  o[0] -= 581;
  var dow = date.getDay();
  if (date < 60) dow = (dow + 6) % 7;
  return dow;
}
function SSF_write_date(type, fmt, val, ss0) {
  var o = "", ss = 0, tt = 0, y = val.y, out, outl = 0;
  switch (type) {
    case 98:
      y = val.y + 543;
    case 121:
      switch (fmt.length) {
        case 1:
        case 2:
          out = y % 100;
          outl = 2;
          break;
        default:
          out = y % 1e4;
          outl = 4;
          break;
      }
      break;
    case 109:
      switch (fmt.length) {
        case 1:
        case 2:
          out = val.m;
          outl = fmt.length;
          break;
        case 3:
          return months[val.m - 1][1];
        case 5:
          return months[val.m - 1][0];
        default:
          return months[val.m - 1][2];
      }
      break;
    case 100:
      switch (fmt.length) {
        case 1:
        case 2:
          out = val.d;
          outl = fmt.length;
          break;
        case 3:
          return days[val.q][0];
        default:
          return days[val.q][1];
      }
      break;
    case 104:
      switch (fmt.length) {
        case 1:
        case 2:
          out = 1 + (val.H + 11) % 12;
          outl = fmt.length;
          break;
        default:
          throw "bad hour format: " + fmt;
      }
      break;
    case 72:
      switch (fmt.length) {
        case 1:
        case 2:
          out = val.H;
          outl = fmt.length;
          break;
        default:
          throw "bad hour format: " + fmt;
      }
      break;
    case 77:
      switch (fmt.length) {
        case 1:
        case 2:
          out = val.M;
          outl = fmt.length;
          break;
        default:
          throw "bad minute format: " + fmt;
      }
      break;
    case 115:
      if (fmt != "s" && fmt != "ss" && fmt != ".0" && fmt != ".00" && fmt != ".000") throw "bad second format: " + fmt;
      if (val.u === 0 && (fmt == "s" || fmt == "ss")) return pad0(val.S, fmt.length);
      if (ss0 >= 2) tt = ss0 === 3 ? 1e3 : 100;
      else tt = ss0 === 1 ? 10 : 1;
      ss = Math.round(tt * (val.S + val.u));
      if (ss >= 60 * tt) ss = 0;
      if (fmt === "s") return ss === 0 ? "0" : "" + ss / tt;
      o = pad0(ss, 2 + ss0);
      if (fmt === "ss") return o.substr(0, 2);
      return "." + o.substr(2, fmt.length - 1);
    case 90:
      switch (fmt) {
        case "[h]":
        case "[hh]":
          out = val.D * 24 + val.H;
          break;
        case "[m]":
        case "[mm]":
          out = (val.D * 24 + val.H) * 60 + val.M;
          break;
        case "[s]":
        case "[ss]":
          out = ((val.D * 24 + val.H) * 60 + val.M) * 60 + Math.round(val.S + val.u);
          break;
        default:
          throw "bad abstime format: " + fmt;
      }
      outl = fmt.length === 3 ? 1 : 2;
      break;
    case 101:
      out = y;
      outl = 1;
      break;
  }
  var outstr = outl > 0 ? pad0(out, outl) : "";
  return outstr;
}
function commaify(s) {
  var w = 3;
  if (s.length <= w) return s;
  var j = s.length % w, o = s.substr(0, j);
  for (; j != s.length; j += w) o += (o.length > 0 ? "," : "") + s.substr(j, w);
  return o;
}
var pct1 = /%/g;
function write_num_pct(type, fmt, val) {
  var sfmt = fmt.replace(pct1, ""), mul = fmt.length - sfmt.length;
  return write_num(type, sfmt, val * Math.pow(10, 2 * mul)) + fill("%", mul);
}
function write_num_cm(type, fmt, val) {
  var idx = fmt.length - 1;
  while (fmt.charCodeAt(idx - 1) === 44) --idx;
  return write_num(type, fmt.substr(0, idx), val / Math.pow(10, 3 * (fmt.length - idx)));
}
function write_num_exp(fmt, val) {
  var o;
  var idx = fmt.indexOf("E") - fmt.indexOf(".") - 1;
  if (fmt.match(/^#+0.0E\+0$/)) {
    if (val == 0) return "0.0E+0";
    else if (val < 0) return "-" + write_num_exp(fmt, -val);
    var period = fmt.indexOf(".");
    if (period === -1) period = fmt.indexOf("E");
    var ee = Math.floor(Math.log(val) * Math.LOG10E) % period;
    if (ee < 0) ee += period;
    o = (val / Math.pow(10, ee)).toPrecision(idx + 1 + (period + ee) % period);
    if (o.indexOf("e") === -1) {
      var fakee = Math.floor(Math.log(val) * Math.LOG10E);
      if (o.indexOf(".") === -1) o = o.charAt(0) + "." + o.substr(1) + "E+" + (fakee - o.length + ee);
      else o += "E+" + (fakee - ee);
      while (o.substr(0, 2) === "0.") {
        o = o.charAt(0) + o.substr(2, period) + "." + o.substr(2 + period);
        o = o.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
      }
      o = o.replace(/\+-/, "-");
    }
    o = o.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function($$, $1, $2, $3) {
      return $1 + $2 + $3.substr(0, (period + ee) % period) + "." + $3.substr(ee) + "E";
    });
  } else o = val.toExponential(idx);
  if (fmt.match(/E\+00$/) && o.match(/e[+-]\d$/)) o = o.substr(0, o.length - 1) + "0" + o.charAt(o.length - 1);
  if (fmt.match(/E\-/) && o.match(/e\+/)) o = o.replace(/e\+/, "e");
  return o.replace("e", "E");
}
var frac1 = /# (\?+)( ?)\/( ?)(\d+)/;
function write_num_f1(r, aval, sign) {
  var den = parseInt(r[4], 10), rr = Math.round(aval * den), base = Math.floor(rr / den);
  var myn = rr - base * den, myd = den;
  return sign + (base === 0 ? "" : "" + base) + " " + (myn === 0 ? fill(" ", r[1].length + 1 + r[4].length) : pad_(myn, r[1].length) + r[2] + "/" + r[3] + pad0(myd, r[4].length));
}
function write_num_f2(r, aval, sign) {
  return sign + (aval === 0 ? "" : "" + aval) + fill(" ", r[1].length + 2 + r[4].length);
}
var dec1 = /^#*0*\.([0#]+)/;
var closeparen = /\).*[0#]/;
var phone = /\(###\) ###\\?-####/;
function hashq(str) {
  var o = "", cc;
  for (var i = 0; i != str.length; ++i) switch (cc = str.charCodeAt(i)) {
    case 35:
      break;
    case 63:
      o += " ";
      break;
    case 48:
      o += "0";
      break;
    default:
      o += String.fromCharCode(cc);
  }
  return o;
}
function rnd(val, d) {
  var dd = Math.pow(10, d);
  return "" + Math.round(val * dd) / dd;
}
function dec(val, d) {
  var _frac = val - Math.floor(val), dd = Math.pow(10, d);
  if (d < ("" + Math.round(_frac * dd)).length) return 0;
  return Math.round(_frac * dd);
}
function carry(val, d) {
  if (d < ("" + Math.round((val - Math.floor(val)) * Math.pow(10, d))).length) {
    return 1;
  }
  return 0;
}
function flr(val) {
  if (val < 2147483647 && val > -2147483648) return "" + (val >= 0 ? val | 0 : val - 1 | 0);
  return "" + Math.floor(val);
}
function write_num_flt(type, fmt, val) {
  if (type.charCodeAt(0) === 40 && !fmt.match(closeparen)) {
    var ffmt = fmt.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    if (val >= 0) return write_num_flt("n", ffmt, val);
    return "(" + write_num_flt("n", ffmt, -val) + ")";
  }
  if (fmt.charCodeAt(fmt.length - 1) === 44) return write_num_cm(type, fmt, val);
  if (fmt.indexOf("%") !== -1) return write_num_pct(type, fmt, val);
  if (fmt.indexOf("E") !== -1) return write_num_exp(fmt, val);
  if (fmt.charCodeAt(0) === 36) return "$" + write_num_flt(type, fmt.substr(fmt.charAt(1) == " " ? 2 : 1), val);
  var o;
  var r, ri, ff, aval = Math.abs(val), sign = val < 0 ? "-" : "";
  if (fmt.match(/^00+$/)) return sign + pad0r(aval, fmt.length);
  if (fmt.match(/^[#?]+$/)) {
    o = pad0r(val, 0);
    if (o === "0") o = "";
    return o.length > fmt.length ? o : hashq(fmt.substr(0, fmt.length - o.length)) + o;
  }
  if (r = fmt.match(frac1)) return write_num_f1(r, aval, sign);
  if (fmt.match(/^#+0+$/)) return sign + pad0r(aval, fmt.length - fmt.indexOf("0"));
  if (r = fmt.match(dec1)) {
    o = rnd(val, r[1].length).replace(/^([^\.]+)$/, "$1." + hashq(r[1])).replace(/\.$/, "." + hashq(r[1])).replace(/\.(\d*)$/, function($$, $1) {
      return "." + $1 + fill("0", hashq(
        /*::(*/
        r[1]
      ).length - $1.length);
    });
    return fmt.indexOf("0.") !== -1 ? o : o.replace(/^0\./, ".");
  }
  fmt = fmt.replace(/^#+([0.])/, "$1");
  if (r = fmt.match(/^(0*)\.(#*)$/)) {
    return sign + rnd(aval, r[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, r[1].length ? "0." : ".");
  }
  if (r = fmt.match(/^#{1,3},##0(\.?)$/)) return sign + commaify(pad0r(aval, 0));
  if (r = fmt.match(/^#,##0\.([#0]*0)$/)) {
    return val < 0 ? "-" + write_num_flt(type, fmt, -val) : commaify("" + (Math.floor(val) + carry(val, r[1].length))) + "." + pad0(dec(val, r[1].length), r[1].length);
  }
  if (r = fmt.match(/^#,#*,#0/)) return write_num_flt(type, fmt.replace(/^#,#*,/, ""), val);
  if (r = fmt.match(/^([0#]+)(\\?-([0#]+))+$/)) {
    o = _strrev(write_num_flt(type, fmt.replace(/[\\-]/g, ""), val));
    ri = 0;
    return _strrev(_strrev(fmt.replace(/\\/g, "")).replace(/[0#]/g, function(x2) {
      return ri < o.length ? o.charAt(ri++) : x2 === "0" ? "0" : "";
    }));
  }
  if (fmt.match(phone)) {
    o = write_num_flt(type, "##########", val);
    return "(" + o.substr(0, 3) + ") " + o.substr(3, 3) + "-" + o.substr(6);
  }
  var oa = "";
  if (r = fmt.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) {
    ri = Math.min(
      /*::String(*/
      r[4].length,
      7
    );
    ff = SSF_frac(aval, Math.pow(10, ri) - 1, false);
    o = "" + sign;
    oa = write_num(
      "n",
      /*::String(*/
      r[1],
      ff[1]
    );
    if (oa.charAt(oa.length - 1) == " ") oa = oa.substr(0, oa.length - 1) + "0";
    o += oa + /*::String(*/
    r[2] + "/" + /*::String(*/
    r[3];
    oa = rpad_(ff[2], ri);
    if (oa.length < r[4].length) oa = hashq(r[4].substr(r[4].length - oa.length)) + oa;
    o += oa;
    return o;
  }
  if (r = fmt.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) {
    ri = Math.min(Math.max(r[1].length, r[4].length), 7);
    ff = SSF_frac(aval, Math.pow(10, ri) - 1, true);
    return sign + (ff[0] || (ff[1] ? "" : "0")) + " " + (ff[1] ? pad_(ff[1], ri) + r[2] + "/" + r[3] + rpad_(ff[2], ri) : fill(" ", 2 * ri + 1 + r[2].length + r[3].length));
  }
  if (r = fmt.match(/^[#0?]+$/)) {
    o = pad0r(val, 0);
    if (fmt.length <= o.length) return o;
    return hashq(fmt.substr(0, fmt.length - o.length)) + o;
  }
  if (r = fmt.match(/^([#0?]+)\.([#0]+)$/)) {
    o = "" + val.toFixed(Math.min(r[2].length, 10)).replace(/([^0])0+$/, "$1");
    ri = o.indexOf(".");
    var lres = fmt.indexOf(".") - ri, rres = fmt.length - o.length - lres;
    return hashq(fmt.substr(0, lres) + o + fmt.substr(fmt.length - rres));
  }
  if (r = fmt.match(/^00,000\.([#0]*0)$/)) {
    ri = dec(val, r[1].length);
    return val < 0 ? "-" + write_num_flt(type, fmt, -val) : commaify(flr(val)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function($$) {
      return "00," + ($$.length < 3 ? pad0(0, 3 - $$.length) : "") + $$;
    }) + "." + pad0(ri, r[1].length);
  }
  switch (fmt) {
    case "###,##0.00":
      return write_num_flt(type, "#,##0.00", val);
    case "###,###":
    case "##,###":
    case "#,###":
      var x = commaify(pad0r(aval, 0));
      return x !== "0" ? sign + x : "";
    case "###,###.00":
      return write_num_flt(type, "###,##0.00", val).replace(/^0\./, ".");
    case "#,###.00":
      return write_num_flt(type, "#,##0.00", val).replace(/^0\./, ".");
    default:
  }
  throw new Error("unsupported format |" + fmt + "|");
}
function write_num_cm2(type, fmt, val) {
  var idx = fmt.length - 1;
  while (fmt.charCodeAt(idx - 1) === 44) --idx;
  return write_num(type, fmt.substr(0, idx), val / Math.pow(10, 3 * (fmt.length - idx)));
}
function write_num_pct2(type, fmt, val) {
  var sfmt = fmt.replace(pct1, ""), mul = fmt.length - sfmt.length;
  return write_num(type, sfmt, val * Math.pow(10, 2 * mul)) + fill("%", mul);
}
function write_num_exp2(fmt, val) {
  var o;
  var idx = fmt.indexOf("E") - fmt.indexOf(".") - 1;
  if (fmt.match(/^#+0.0E\+0$/)) {
    if (val == 0) return "0.0E+0";
    else if (val < 0) return "-" + write_num_exp2(fmt, -val);
    var period = fmt.indexOf(".");
    if (period === -1) period = fmt.indexOf("E");
    var ee = Math.floor(Math.log(val) * Math.LOG10E) % period;
    if (ee < 0) ee += period;
    o = (val / Math.pow(10, ee)).toPrecision(idx + 1 + (period + ee) % period);
    if (!o.match(/[Ee]/)) {
      var fakee = Math.floor(Math.log(val) * Math.LOG10E);
      if (o.indexOf(".") === -1) o = o.charAt(0) + "." + o.substr(1) + "E+" + (fakee - o.length + ee);
      else o += "E+" + (fakee - ee);
      o = o.replace(/\+-/, "-");
    }
    o = o.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function($$, $1, $2, $3) {
      return $1 + $2 + $3.substr(0, (period + ee) % period) + "." + $3.substr(ee) + "E";
    });
  } else o = val.toExponential(idx);
  if (fmt.match(/E\+00$/) && o.match(/e[+-]\d$/)) o = o.substr(0, o.length - 1) + "0" + o.charAt(o.length - 1);
  if (fmt.match(/E\-/) && o.match(/e\+/)) o = o.replace(/e\+/, "e");
  return o.replace("e", "E");
}
function write_num_int(type, fmt, val) {
  if (type.charCodeAt(0) === 40 && !fmt.match(closeparen)) {
    var ffmt = fmt.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    if (val >= 0) return write_num_int("n", ffmt, val);
    return "(" + write_num_int("n", ffmt, -val) + ")";
  }
  if (fmt.charCodeAt(fmt.length - 1) === 44) return write_num_cm2(type, fmt, val);
  if (fmt.indexOf("%") !== -1) return write_num_pct2(type, fmt, val);
  if (fmt.indexOf("E") !== -1) return write_num_exp2(fmt, val);
  if (fmt.charCodeAt(0) === 36) return "$" + write_num_int(type, fmt.substr(fmt.charAt(1) == " " ? 2 : 1), val);
  var o;
  var r, ri, ff, aval = Math.abs(val), sign = val < 0 ? "-" : "";
  if (fmt.match(/^00+$/)) return sign + pad0(aval, fmt.length);
  if (fmt.match(/^[#?]+$/)) {
    o = "" + val;
    if (val === 0) o = "";
    return o.length > fmt.length ? o : hashq(fmt.substr(0, fmt.length - o.length)) + o;
  }
  if (r = fmt.match(frac1)) return write_num_f2(r, aval, sign);
  if (fmt.match(/^#+0+$/)) return sign + pad0(aval, fmt.length - fmt.indexOf("0"));
  if (r = fmt.match(dec1)) {
    o = ("" + val).replace(/^([^\.]+)$/, "$1." + hashq(r[1])).replace(/\.$/, "." + hashq(r[1]));
    o = o.replace(/\.(\d*)$/, function($$, $1) {
      return "." + $1 + fill("0", hashq(r[1]).length - $1.length);
    });
    return fmt.indexOf("0.") !== -1 ? o : o.replace(/^0\./, ".");
  }
  fmt = fmt.replace(/^#+([0.])/, "$1");
  if (r = fmt.match(/^(0*)\.(#*)$/)) {
    return sign + ("" + aval).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, r[1].length ? "0." : ".");
  }
  if (r = fmt.match(/^#{1,3},##0(\.?)$/)) return sign + commaify("" + aval);
  if (r = fmt.match(/^#,##0\.([#0]*0)$/)) {
    return val < 0 ? "-" + write_num_int(type, fmt, -val) : commaify("" + val) + "." + fill("0", r[1].length);
  }
  if (r = fmt.match(/^#,#*,#0/)) return write_num_int(type, fmt.replace(/^#,#*,/, ""), val);
  if (r = fmt.match(/^([0#]+)(\\?-([0#]+))+$/)) {
    o = _strrev(write_num_int(type, fmt.replace(/[\\-]/g, ""), val));
    ri = 0;
    return _strrev(_strrev(fmt.replace(/\\/g, "")).replace(/[0#]/g, function(x2) {
      return ri < o.length ? o.charAt(ri++) : x2 === "0" ? "0" : "";
    }));
  }
  if (fmt.match(phone)) {
    o = write_num_int(type, "##########", val);
    return "(" + o.substr(0, 3) + ") " + o.substr(3, 3) + "-" + o.substr(6);
  }
  var oa = "";
  if (r = fmt.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) {
    ri = Math.min(
      /*::String(*/
      r[4].length,
      7
    );
    ff = SSF_frac(aval, Math.pow(10, ri) - 1, false);
    o = "" + sign;
    oa = write_num(
      "n",
      /*::String(*/
      r[1],
      ff[1]
    );
    if (oa.charAt(oa.length - 1) == " ") oa = oa.substr(0, oa.length - 1) + "0";
    o += oa + /*::String(*/
    r[2] + "/" + /*::String(*/
    r[3];
    oa = rpad_(ff[2], ri);
    if (oa.length < r[4].length) oa = hashq(r[4].substr(r[4].length - oa.length)) + oa;
    o += oa;
    return o;
  }
  if (r = fmt.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) {
    ri = Math.min(Math.max(r[1].length, r[4].length), 7);
    ff = SSF_frac(aval, Math.pow(10, ri) - 1, true);
    return sign + (ff[0] || (ff[1] ? "" : "0")) + " " + (ff[1] ? pad_(ff[1], ri) + r[2] + "/" + r[3] + rpad_(ff[2], ri) : fill(" ", 2 * ri + 1 + r[2].length + r[3].length));
  }
  if (r = fmt.match(/^[#0?]+$/)) {
    o = "" + val;
    if (fmt.length <= o.length) return o;
    return hashq(fmt.substr(0, fmt.length - o.length)) + o;
  }
  if (r = fmt.match(/^([#0]+)\.([#0]+)$/)) {
    o = "" + val.toFixed(Math.min(r[2].length, 10)).replace(/([^0])0+$/, "$1");
    ri = o.indexOf(".");
    var lres = fmt.indexOf(".") - ri, rres = fmt.length - o.length - lres;
    return hashq(fmt.substr(0, lres) + o + fmt.substr(fmt.length - rres));
  }
  if (r = fmt.match(/^00,000\.([#0]*0)$/)) {
    return val < 0 ? "-" + write_num_int(type, fmt, -val) : commaify("" + val).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function($$) {
      return "00," + ($$.length < 3 ? pad0(0, 3 - $$.length) : "") + $$;
    }) + "." + pad0(0, r[1].length);
  }
  switch (fmt) {
    case "###,###":
    case "##,###":
    case "#,###":
      var x = commaify("" + aval);
      return x !== "0" ? sign + x : "";
    default:
      if (fmt.match(/\.[0#?]*$/)) return write_num_int(type, fmt.slice(0, fmt.lastIndexOf(".")), val) + hashq(fmt.slice(fmt.lastIndexOf(".")));
  }
  throw new Error("unsupported format |" + fmt + "|");
}
function write_num(type, fmt, val) {
  return (val | 0) === val ? write_num_int(type, fmt, val) : write_num_flt(type, fmt, val);
}
function SSF_split_fmt(fmt) {
  var out = [];
  var in_str = false;
  for (var i = 0, j = 0; i < fmt.length; ++i) switch (
    /*cc=*/
    fmt.charCodeAt(i)
  ) {
    case 34:
      in_str = !in_str;
      break;
    case 95:
    case 42:
    case 92:
      ++i;
      break;
    case 59:
      out[out.length] = fmt.substr(j, i - j);
      j = i + 1;
  }
  out[out.length] = fmt.substr(j);
  if (in_str === true) throw new Error("Format |" + fmt + "| unterminated string ");
  return out;
}
var SSF_abstime = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function fmt_is_date(fmt) {
  var i = 0, c = "", o = "";
  while (i < fmt.length) {
    switch (c = fmt.charAt(i)) {
      case "G":
        if (SSF_isgeneral(fmt, i)) i += 6;
        i++;
        break;
      case '"':
        for (
          ;
          /*cc=*/
          fmt.charCodeAt(++i) !== 34 && i < fmt.length;
        ) {
        }
        ++i;
        break;
      case "\\":
        i += 2;
        break;
      case "_":
        i += 2;
        break;
      case "@":
        ++i;
        break;
      case "B":
      case "b":
        if (fmt.charAt(i + 1) === "1" || fmt.charAt(i + 1) === "2") return true;
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        return true;
      case "A":
      case "a":
      case "\u4E0A":
        if (fmt.substr(i, 3).toUpperCase() === "A/P") return true;
        if (fmt.substr(i, 5).toUpperCase() === "AM/PM") return true;
        if (fmt.substr(i, 5).toUpperCase() === "\u4E0A\u5348/\u4E0B\u5348") return true;
        ++i;
        break;
      case "[":
        o = c;
        while (fmt.charAt(i++) !== "]" && i < fmt.length) o += fmt.charAt(i);
        if (o.match(SSF_abstime)) return true;
        break;
      case ".":
      case "0":
      case "#":
        while (i < fmt.length && ("0#?.,E+-%".indexOf(c = fmt.charAt(++i)) > -1 || c == "\\" && fmt.charAt(i + 1) == "-" && "0#".indexOf(fmt.charAt(i + 2)) > -1)) {
        }
        break;
      case "?":
        while (fmt.charAt(++i) === c) {
        }
        break;
      case "*":
        ++i;
        if (fmt.charAt(i) == " " || fmt.charAt(i) == "*") ++i;
        break;
      case "(":
      case ")":
        ++i;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        while (i < fmt.length && "0123456789".indexOf(fmt.charAt(++i)) > -1) {
        }
        break;
      case " ":
        ++i;
        break;
      default:
        ++i;
        break;
    }
  }
  return false;
}
function eval_fmt(fmt, v, opts, flen) {
  var out = [], o = "", i = 0, c = "", lst = "t", dt, j, cc;
  var hr2 = "H";
  while (i < fmt.length) {
    switch (c = fmt.charAt(i)) {
      case "G":
        if (!SSF_isgeneral(fmt, i)) throw new Error("unrecognized character " + c + " in " + fmt);
        out[out.length] = {
          t: "G",
          v: "General"
        };
        i += 7;
        break;
      case '"':
        for (o = ""; (cc = fmt.charCodeAt(++i)) !== 34 && i < fmt.length; ) o += String.fromCharCode(cc);
        out[out.length] = {
          t: "t",
          v: o
        };
        ++i;
        break;
      case "\\":
        var w = fmt.charAt(++i), t = w === "(" || w === ")" ? w : "t";
        out[out.length] = {
          t,
          v: w
        };
        ++i;
        break;
      case "_":
        out[out.length] = {
          t: "t",
          v: " "
        };
        i += 2;
        break;
      case "@":
        out[out.length] = {
          t: "T",
          v
        };
        ++i;
        break;
      case "B":
      case "b":
        if (fmt.charAt(i + 1) === "1" || fmt.charAt(i + 1) === "2") {
          if (dt == null) {
            dt = SSF_parse_date_code(v, opts, fmt.charAt(i + 1) === "2");
            if (dt == null) return "";
          }
          out[out.length] = {
            t: "X",
            v: fmt.substr(i, 2)
          };
          lst = c;
          i += 2;
          break;
        }
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
        c = c.toLowerCase();
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        if (v < 0) return "";
        if (dt == null) {
          dt = SSF_parse_date_code(v, opts);
          if (dt == null) return "";
        }
        o = c;
        while (++i < fmt.length && fmt.charAt(i).toLowerCase() === c) o += c;
        if (c === "m" && lst.toLowerCase() === "h") c = "M";
        if (c === "h") c = hr2;
        out[out.length] = {
          t: c,
          v: o
        };
        lst = c;
        break;
      case "A":
      case "a":
      case "\u4E0A":
        var q = {
          t: c,
          v: c
        };
        if (dt == null) dt = SSF_parse_date_code(v, opts);
        if (fmt.substr(i, 3).toUpperCase() === "A/P") {
          if (dt != null) q.v = dt.H >= 12 ? "P" : "A";
          q.t = "T";
          hr2 = "h";
          i += 3;
        } else if (fmt.substr(i, 5).toUpperCase() === "AM/PM") {
          if (dt != null) q.v = dt.H >= 12 ? "PM" : "AM";
          q.t = "T";
          i += 5;
          hr2 = "h";
        } else if (fmt.substr(i, 5).toUpperCase() === "\u4E0A\u5348/\u4E0B\u5348") {
          if (dt != null) q.v = dt.H >= 12 ? "\u4E0B\u5348" : "\u4E0A\u5348";
          q.t = "T";
          i += 5;
          hr2 = "h";
        } else {
          q.t = "t";
          ++i;
        }
        if (dt == null && q.t === "T") return "";
        out[out.length] = q;
        lst = c;
        break;
      case "[":
        o = c;
        while (fmt.charAt(i++) !== "]" && i < fmt.length) o += fmt.charAt(i);
        if (o.slice(-1) !== "]") throw 'unterminated "[" block: |' + o + "|";
        if (o.match(SSF_abstime)) {
          if (dt == null) {
            dt = SSF_parse_date_code(v, opts);
            if (dt == null) return "";
          }
          out[out.length] = {
            t: "Z",
            v: o.toLowerCase()
          };
          lst = o.charAt(1);
        } else if (o.indexOf("$") > -1) {
          o = (o.match(/\$([^-\[\]]*)/) || [])[1] || "$";
          if (!fmt_is_date(fmt)) out[out.length] = {
            t: "t",
            v: o
          };
        }
        break;
      case ".":
        if (dt != null) {
          o = c;
          while (++i < fmt.length && (c = fmt.charAt(i)) === "0") o += c;
          out[out.length] = {
            t: "s",
            v: o
          };
          break;
        }
      case "0":
      case "#":
        o = c;
        while (++i < fmt.length && "0#?.,E+-%".indexOf(c = fmt.charAt(i)) > -1) o += c;
        out[out.length] = {
          t: "n",
          v: o
        };
        break;
      case "?":
        o = c;
        while (fmt.charAt(++i) === c) o += c;
        out[out.length] = {
          t: c,
          v: o
        };
        lst = c;
        break;
      case "*":
        ++i;
        if (fmt.charAt(i) == " " || fmt.charAt(i) == "*") ++i;
        break;
      case "(":
      case ")":
        out[out.length] = {
          t: flen === 1 ? "t" : c,
          v: c
        };
        ++i;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        o = c;
        while (i < fmt.length && "0123456789".indexOf(fmt.charAt(++i)) > -1) o += fmt.charAt(i);
        out[out.length] = {
          t: "D",
          v: o
        };
        break;
      case " ":
        out[out.length] = {
          t: c,
          v: c
        };
        ++i;
        break;
      case "$":
        out[out.length] = {
          t: "t",
          v: "$"
        };
        ++i;
        break;
      default:
        if (",$-+/():!^&'~{}<>=\u20ACacfijklopqrtuvwxzP".indexOf(c) === -1) throw new Error("unrecognized character " + c + " in " + fmt);
        out[out.length] = {
          t: "t",
          v: c
        };
        ++i;
        break;
    }
  }
  var bt = 0, ss0 = 0, ssm;
  for (i = out.length - 1, lst = "t"; i >= 0; --i) {
    switch (out[i].t) {
      case "h":
      case "H":
        out[i].t = hr2;
        lst = "h";
        if (bt < 1) bt = 1;
        break;
      case "s":
        if (ssm = out[i].v.match(/\.0+$/)) ss0 = Math.max(ss0, ssm[0].length - 1);
        if (bt < 3) bt = 3;
      case "d":
      case "y":
      case "M":
      case "e":
        lst = out[i].t;
        break;
      case "m":
        if (lst === "s") {
          out[i].t = "M";
          if (bt < 2) bt = 2;
        }
        break;
      case "X":
        break;
      case "Z":
        if (bt < 1 && out[i].v.match(/[Hh]/)) bt = 1;
        if (bt < 2 && out[i].v.match(/[Mm]/)) bt = 2;
        if (bt < 3 && out[i].v.match(/[Ss]/)) bt = 3;
    }
  }
  switch (bt) {
    case 0:
      break;
    case 1:
      if (dt.u >= 0.5) {
        dt.u = 0;
        ++dt.S;
      }
      if (dt.S >= 60) {
        dt.S = 0;
        ++dt.M;
      }
      if (dt.M >= 60) {
        dt.M = 0;
        ++dt.H;
      }
      break;
    case 2:
      if (dt.u >= 0.5) {
        dt.u = 0;
        ++dt.S;
      }
      if (dt.S >= 60) {
        dt.S = 0;
        ++dt.M;
      }
      break;
  }
  var nstr = "", jj;
  for (i = 0; i < out.length; ++i) {
    switch (out[i].t) {
      case "t":
      case "T":
      case " ":
      case "D":
        break;
      case "X":
        out[i].v = "";
        out[i].t = ";";
        break;
      case "d":
      case "m":
      case "y":
      case "h":
      case "H":
      case "M":
      case "s":
      case "e":
      case "b":
      case "Z":
        out[i].v = SSF_write_date(out[i].t.charCodeAt(0), out[i].v, dt, ss0);
        out[i].t = "t";
        break;
      case "n":
      case "?":
        jj = i + 1;
        while (out[jj] != null && ((c = out[jj].t) === "?" || c === "D" || (c === " " || c === "t") && out[jj + 1] != null && (out[jj + 1].t === "?" || out[jj + 1].t === "t" && out[jj + 1].v === "/") || out[i].t === "(" && (c === " " || c === "n" || c === ")") || c === "t" && (out[jj].v === "/" || out[jj].v === " " && out[jj + 1] != null && out[jj + 1].t == "?"))) {
          out[i].v += out[jj].v;
          out[jj] = {
            v: "",
            t: ";"
          };
          ++jj;
        }
        nstr += out[i].v;
        i = jj - 1;
        break;
      case "G":
        out[i].t = "t";
        out[i].v = SSF_general(v, opts);
        break;
    }
  }
  var vv = "", myv, ostr;
  if (nstr.length > 0) {
    if (nstr.charCodeAt(0) == 40) {
      myv = v < 0 && nstr.charCodeAt(0) === 45 ? -v : v;
      ostr = write_num("n", nstr, myv);
    } else {
      myv = v < 0 && flen > 1 ? -v : v;
      ostr = write_num("n", nstr, myv);
      if (myv < 0 && out[0] && out[0].t == "t") {
        ostr = ostr.substr(1);
        out[0].v = "-" + out[0].v;
      }
    }
    jj = ostr.length - 1;
    var decpt = out.length;
    for (i = 0; i < out.length; ++i) if (out[i] != null && out[i].t != "t" && out[i].v.indexOf(".") > -1) {
      decpt = i;
      break;
    }
    var lasti = out.length;
    if (decpt === out.length && ostr.indexOf("E") === -1) {
      for (i = out.length - 1; i >= 0; --i) {
        if (out[i] == null || "n?".indexOf(out[i].t) === -1) continue;
        if (jj >= out[i].v.length - 1) {
          jj -= out[i].v.length;
          out[i].v = ostr.substr(jj + 1, out[i].v.length);
        } else if (jj < 0) out[i].v = "";
        else {
          out[i].v = ostr.substr(0, jj + 1);
          jj = -1;
        }
        out[i].t = "t";
        lasti = i;
      }
      if (jj >= 0 && lasti < out.length) out[lasti].v = ostr.substr(0, jj + 1) + out[lasti].v;
    } else if (decpt !== out.length && ostr.indexOf("E") === -1) {
      jj = ostr.indexOf(".") - 1;
      for (i = decpt; i >= 0; --i) {
        if (out[i] == null || "n?".indexOf(out[i].t) === -1) continue;
        j = out[i].v.indexOf(".") > -1 && i === decpt ? out[i].v.indexOf(".") - 1 : out[i].v.length - 1;
        vv = out[i].v.substr(j + 1);
        for (; j >= 0; --j) {
          if (jj >= 0 && (out[i].v.charAt(j) === "0" || out[i].v.charAt(j) === "#")) vv = ostr.charAt(jj--) + vv;
        }
        out[i].v = vv;
        out[i].t = "t";
        lasti = i;
      }
      if (jj >= 0 && lasti < out.length) out[lasti].v = ostr.substr(0, jj + 1) + out[lasti].v;
      jj = ostr.indexOf(".") + 1;
      for (i = decpt; i < out.length; ++i) {
        if (out[i] == null || "n?(".indexOf(out[i].t) === -1 && i !== decpt) continue;
        j = out[i].v.indexOf(".") > -1 && i === decpt ? out[i].v.indexOf(".") + 1 : 0;
        vv = out[i].v.substr(0, j);
        for (; j < out[i].v.length; ++j) {
          if (jj < ostr.length) vv += ostr.charAt(jj++);
        }
        out[i].v = vv;
        out[i].t = "t";
        lasti = i;
      }
    }
  }
  for (i = 0; i < out.length; ++i) if (out[i] != null && "n?".indexOf(out[i].t) > -1) {
    myv = flen > 1 && v < 0 && i > 0 && out[i - 1].v === "-" ? -v : v;
    out[i].v = write_num(out[i].t, out[i].v, myv);
    out[i].t = "t";
  }
  var retval = "";
  for (i = 0; i !== out.length; ++i) if (out[i] != null) retval += out[i].v;
  return retval;
}
var cfregex2 = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function chkcond(v, rr) {
  if (rr == null) return false;
  var thresh = parseFloat(rr[2]);
  switch (rr[1]) {
    case "=":
      if (v == thresh) return true;
      break;
    case ">":
      if (v > thresh) return true;
      break;
    case "<":
      if (v < thresh) return true;
      break;
    case "<>":
      if (v != thresh) return true;
      break;
    case ">=":
      if (v >= thresh) return true;
      break;
    case "<=":
      if (v <= thresh) return true;
      break;
  }
  return false;
}
function choose_fmt(f, v) {
  var fmt = SSF_split_fmt(f);
  var l = fmt.length, lat = fmt[l - 1].indexOf("@");
  if (l < 4 && lat > -1) --l;
  if (fmt.length > 4) throw new Error("cannot find right format for |" + fmt.join("|") + "|");
  if (typeof v !== "number") return [4, fmt.length === 4 || lat > -1 ? fmt[fmt.length - 1] : "@"];
  switch (fmt.length) {
    case 1:
      fmt = lat > -1 ? ["General", "General", "General", fmt[0]] : [fmt[0], fmt[0], fmt[0], "@"];
      break;
    case 2:
      fmt = lat > -1 ? [fmt[0], fmt[0], fmt[0], fmt[1]] : [fmt[0], fmt[1], fmt[0], "@"];
      break;
    case 3:
      fmt = lat > -1 ? [fmt[0], fmt[1], fmt[0], fmt[2]] : [fmt[0], fmt[1], fmt[2], "@"];
      break;
    case 4:
      break;
  }
  var ff = v > 0 ? fmt[0] : v < 0 ? fmt[1] : fmt[2];
  if (fmt[0].indexOf("[") === -1 && fmt[1].indexOf("[") === -1) return [l, ff];
  if (fmt[0].match(/\[[=<>]/) != null || fmt[1].match(/\[[=<>]/) != null) {
    var m1 = fmt[0].match(cfregex2);
    var m2 = fmt[1].match(cfregex2);
    return chkcond(v, m1) ? [l, fmt[0]] : chkcond(v, m2) ? [l, fmt[1]] : [l, fmt[m1 != null && m2 != null ? 2 : 1]];
  }
  return [l, ff];
}
function SSF_format(fmt, v, o) {
  if (o == null) o = {};
  var sfmt = "";
  switch (typeof fmt) {
    case "string":
      if (fmt == "m/d/yy" && o.dateNF) sfmt = o.dateNF;
      else sfmt = fmt;
      break;
    case "number":
      if (fmt == 14 && o.dateNF) sfmt = o.dateNF;
      else sfmt = (o.table != null ? o.table : table_fmt)[fmt];
      if (sfmt == null) sfmt = o.table && o.table[SSF_default_map[fmt]] || table_fmt[SSF_default_map[fmt]];
      if (sfmt == null) sfmt = SSF_default_str[fmt] || "General";
      break;
  }
  if (SSF_isgeneral(sfmt, 0)) return SSF_general(v, o);
  if (v instanceof Date) v = datenum_local(v, o.date1904);
  var f = choose_fmt(sfmt, v);
  if (SSF_isgeneral(f[1])) return SSF_general(v, o);
  if (v === true) v = "TRUE";
  else if (v === false) v = "FALSE";
  else if (v === "" || v == null) return "";
  return eval_fmt(f[1], v, o, f[0]);
}
function SSF_load(fmt, idx) {
  if (typeof idx != "number") {
    idx = +idx || -1;
    for (var i = 0; i < 392; ++i) {
      if (table_fmt[i] == void 0) {
        if (idx < 0) idx = i;
        continue;
      }
      if (table_fmt[i] == fmt) {
        idx = i;
        break;
      }
    }
    if (idx < 0) idx = 391;
  }
  table_fmt[idx] = fmt;
  return idx;
}
function SSF_load_table(tbl) {
  for (var i = 0; i != 392; ++i) if (tbl[i] !== void 0) SSF_load(tbl[i], i);
}
function make_ssf() {
  table_fmt = SSF_init_table();
}
var dateNFregex = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function dateNF_regex(dateNF) {
  var fmt = typeof dateNF == "number" ? table_fmt[dateNF] : dateNF;
  fmt = fmt.replace(dateNFregex, "(\\d+)");
  return new RegExp("^" + fmt + "$");
}
function dateNF_fix(str, dateNF, match) {
  var Y = -1, m = -1, d = -1, H = -1, M = -1, S = -1;
  (dateNF.match(dateNFregex) || []).forEach(function(n, i) {
    var v = parseInt(match[i + 1], 10);
    switch (n.toLowerCase().charAt(0)) {
      case "y":
        Y = v;
        break;
      case "d":
        d = v;
        break;
      case "h":
        H = v;
        break;
      case "s":
        S = v;
        break;
      case "m":
        if (H >= 0) M = v;
        else m = v;
        break;
    }
  });
  if (S >= 0 && M == -1 && m >= 0) {
    M = m;
    m = -1;
  }
  var datestr = ("" + (Y >= 0 ? Y : (/* @__PURE__ */ new Date()).getFullYear())).slice(-4) + "-" + ("00" + (m >= 1 ? m : 1)).slice(-2) + "-" + ("00" + (d >= 1 ? d : 1)).slice(-2);
  if (datestr.length == 7) datestr = "0" + datestr;
  if (datestr.length == 8) datestr = "20" + datestr;
  var timestr = ("00" + (H >= 0 ? H : 0)).slice(-2) + ":" + ("00" + (M >= 0 ? M : 0)).slice(-2) + ":" + ("00" + (S >= 0 ? S : 0)).slice(-2);
  if (H == -1 && M == -1 && S == -1) return datestr;
  if (Y == -1 && m == -1 && d == -1) return timestr;
  return datestr + "T" + timestr;
}
var CRC32 = /* @__PURE__ */ function() {
  var CRC322 = {};
  CRC322.version = "1.2.0";
  function signed_crc_table() {
    var c = 0, table = new Array(256);
    for (var n = 0; n != 256; ++n) {
      c = n;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
      table[n] = c;
    }
    return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
  }
  var T0 = signed_crc_table();
  function slice_by_16_tables(T) {
    var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
    for (n = 0; n != 256; ++n) table[n] = T[n];
    for (n = 0; n != 256; ++n) {
      v = T[n];
      for (c = 256 + n; c < 4096; c += 256) v = table[c] = v >>> 8 ^ T[v & 255];
    }
    var out = [];
    for (n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
    return out;
  }
  var TT = slice_by_16_tables(T0);
  var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
  var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
  var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
  function crc32_bstr(bstr, seed) {
    var C = seed ^ -1;
    for (var i = 0, L = bstr.length; i < L; ) C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
    return ~C;
  }
  function crc32_buf(B, seed) {
    var C = seed ^ -1, L = B.length - 15, i = 0;
    for (; i < L; ) C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
    L += 15;
    while (i < L) C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
    return ~C;
  }
  function crc32_str(str, seed) {
    var C = seed ^ -1;
    for (var i = 0, L = str.length, c = 0, d = 0; i < L; ) {
      c = str.charCodeAt(i++);
      if (c < 128) {
        C = C >>> 8 ^ T0[(C ^ c) & 255];
      } else if (c < 2048) {
        C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
      } else if (c >= 55296 && c < 57344) {
        c = (c & 1023) + 64;
        d = str.charCodeAt(i++) & 1023;
        C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
      } else {
        C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
        C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
      }
    }
    return ~C;
  }
  CRC322.table = T0;
  CRC322.bstr = crc32_bstr;
  CRC322.buf = crc32_buf;
  CRC322.str = crc32_str;
  return CRC322;
}();
var CFB = /* @__PURE__ */ function _CFB() {
  var exports = {};
  exports.version = "1.2.1";
  function namecmp(l, r) {
    var L = l.split("/"), R = r.split("/");
    for (var i2 = 0, c = 0, Z = Math.min(L.length, R.length); i2 < Z; ++i2) {
      if (c = L[i2].length - R[i2].length) return c;
      if (L[i2] != R[i2]) return L[i2] < R[i2] ? -1 : 1;
    }
    return L.length - R.length;
  }
  function dirname(p) {
    if (p.charAt(p.length - 1) == "/") return p.slice(0, -1).indexOf("/") === -1 ? p : dirname(p.slice(0, -1));
    var c = p.lastIndexOf("/");
    return c === -1 ? p : p.slice(0, c + 1);
  }
  function filename(p) {
    if (p.charAt(p.length - 1) == "/") return filename(p.slice(0, -1));
    var c = p.lastIndexOf("/");
    return c === -1 ? p : p.slice(c + 1);
  }
  function write_dos_date(buf, date) {
    if (typeof date === "string") date = new Date(date);
    var hms = date.getHours();
    hms = hms << 6 | date.getMinutes();
    hms = hms << 5 | date.getSeconds() >>> 1;
    buf.write_shift(2, hms);
    var ymd = date.getFullYear() - 1980;
    ymd = ymd << 4 | date.getMonth() + 1;
    ymd = ymd << 5 | date.getDate();
    buf.write_shift(2, ymd);
  }
  function parse_dos_date(buf) {
    var hms = buf.read_shift(2) & 65535;
    var ymd = buf.read_shift(2) & 65535;
    var val = /* @__PURE__ */ new Date();
    var d = ymd & 31;
    ymd >>>= 5;
    var m = ymd & 15;
    ymd >>>= 4;
    val.setMilliseconds(0);
    val.setFullYear(ymd + 1980);
    val.setMonth(m - 1);
    val.setDate(d);
    var S = hms & 31;
    hms >>>= 5;
    var M = hms & 63;
    hms >>>= 6;
    val.setHours(hms);
    val.setMinutes(M);
    val.setSeconds(S << 1);
    return val;
  }
  function parse_extra_field(blob) {
    prep_blob(blob, 0);
    var o = (
      /*::(*/
      {}
    );
    var flags = 0;
    while (blob.l <= blob.length - 4) {
      var type = blob.read_shift(2);
      var sz = blob.read_shift(2), tgt = blob.l + sz;
      var p = {};
      switch (type) {
        case 21589:
          {
            flags = blob.read_shift(1);
            if (flags & 1) p.mtime = blob.read_shift(4);
            if (sz > 5) {
              if (flags & 2) p.atime = blob.read_shift(4);
              if (flags & 4) p.ctime = blob.read_shift(4);
            }
            if (p.mtime) p.mt = new Date(p.mtime * 1e3);
          }
          break;
      }
      blob.l = tgt;
      o[type] = p;
    }
    return o;
  }
  var fs;
  function get_fs() {
    return fs || (fs = {});
  }
  function parse(file, options2) {
    if (file[0] == 80 && file[1] == 75) return parse_zip(file, options2);
    if ((file[0] | 32) == 109 && (file[1] | 32) == 105) return parse_mad(file, options2);
    if (file.length < 512) throw new Error("CFB file size " + file.length + " < 512");
    var mver = 3;
    var ssz = 512;
    var nmfs = 0;
    var difat_sec_cnt = 0;
    var dir_start = 0;
    var minifat_start = 0;
    var difat_start = 0;
    var fat_addrs = [];
    var blob = (
      /*::(*/
      file.slice(0, 512)
    );
    prep_blob(blob, 0);
    var mv = check_get_mver(blob);
    mver = mv[0];
    switch (mver) {
      case 3:
        ssz = 512;
        break;
      case 4:
        ssz = 4096;
        break;
      case 0:
        if (mv[1] == 0) return parse_zip(file, options2);
      default:
        throw new Error("Major Version: Expected 3 or 4 saw " + mver);
    }
    if (ssz !== 512) {
      blob = /*::(*/
      file.slice(0, ssz);
      prep_blob(
        blob,
        28
        /* blob.l */
      );
    }
    var header = file.slice(0, ssz);
    check_shifts(blob, mver);
    var dir_cnt = blob.read_shift(4, "i");
    if (mver === 3 && dir_cnt !== 0) throw new Error("# Directory Sectors: Expected 0 saw " + dir_cnt);
    blob.l += 4;
    dir_start = blob.read_shift(4, "i");
    blob.l += 4;
    blob.chk("00100000", "Mini Stream Cutoff Size: ");
    minifat_start = blob.read_shift(4, "i");
    nmfs = blob.read_shift(4, "i");
    difat_start = blob.read_shift(4, "i");
    difat_sec_cnt = blob.read_shift(4, "i");
    for (var q2 = -1, j = 0; j < 109; ++j) {
      q2 = blob.read_shift(4, "i");
      if (q2 < 0) break;
      fat_addrs[j] = q2;
    }
    var sectors = sectorify(file, ssz);
    sleuth_fat(difat_start, difat_sec_cnt, sectors, ssz, fat_addrs);
    var sector_list = make_sector_list(sectors, dir_start, fat_addrs, ssz);
    sector_list[dir_start].name = "!Directory";
    if (nmfs > 0 && minifat_start !== ENDOFCHAIN) sector_list[minifat_start].name = "!MiniFAT";
    sector_list[fat_addrs[0]].name = "!FAT";
    sector_list.fat_addrs = fat_addrs;
    sector_list.ssz = ssz;
    var files = {}, Paths = [], FileIndex = [], FullPaths = [];
    read_directory(dir_start, sector_list, sectors, Paths, nmfs, files, FileIndex, minifat_start);
    build_full_paths(FileIndex, FullPaths, Paths);
    Paths.shift();
    var o = {
      FileIndex,
      FullPaths
    };
    if (options2 && options2.raw) o.raw = {
      header,
      sectors
    };
    return o;
  }
  function check_get_mver(blob) {
    if (blob[blob.l] == 80 && blob[blob.l + 1] == 75) return [0, 0];
    blob.chk(HEADER_SIGNATURE, "Header Signature: ");
    blob.l += 16;
    var mver = blob.read_shift(2, "u");
    return [blob.read_shift(2, "u"), mver];
  }
  function check_shifts(blob, mver) {
    var shift = 9;
    blob.l += 2;
    switch (shift = blob.read_shift(2)) {
      case 9:
        if (mver != 3) throw new Error("Sector Shift: Expected 9 saw " + shift);
        break;
      case 12:
        if (mver != 4) throw new Error("Sector Shift: Expected 12 saw " + shift);
        break;
      default:
        throw new Error("Sector Shift: Expected 9 or 12 saw " + shift);
    }
    blob.chk("0600", "Mini Sector Shift: ");
    blob.chk("000000000000", "Reserved: ");
  }
  function sectorify(file, ssz) {
    var nsectors = Math.ceil(file.length / ssz) - 1;
    var sectors = [];
    for (var i2 = 1; i2 < nsectors; ++i2) sectors[i2 - 1] = file.slice(i2 * ssz, (i2 + 1) * ssz);
    sectors[nsectors - 1] = file.slice(nsectors * ssz);
    return sectors;
  }
  function build_full_paths(FI, FP, Paths) {
    var i2 = 0, L = 0, R = 0, C = 0, j = 0, pl = Paths.length;
    var dad = [], q2 = [];
    for (; i2 < pl; ++i2) {
      dad[i2] = q2[i2] = i2;
      FP[i2] = Paths[i2];
    }
    for (; j < q2.length; ++j) {
      i2 = q2[j];
      L = FI[i2].L;
      R = FI[i2].R;
      C = FI[i2].C;
      if (dad[i2] === i2) {
        if (L !== -1 && dad[L] !== L) dad[i2] = dad[L];
        if (R !== -1 && dad[R] !== R) dad[i2] = dad[R];
      }
      if (C !== -1) dad[C] = i2;
      if (L !== -1 && i2 != dad[i2]) {
        dad[L] = dad[i2];
        if (q2.lastIndexOf(L) < j) q2.push(L);
      }
      if (R !== -1 && i2 != dad[i2]) {
        dad[R] = dad[i2];
        if (q2.lastIndexOf(R) < j) q2.push(R);
      }
    }
    for (i2 = 1; i2 < pl; ++i2) if (dad[i2] === i2) {
      if (R !== -1 && dad[R] !== R) dad[i2] = dad[R];
      else if (L !== -1 && dad[L] !== L) dad[i2] = dad[L];
    }
    for (i2 = 1; i2 < pl; ++i2) {
      if (FI[i2].type === 0) continue;
      j = i2;
      if (j != dad[j]) do {
        j = dad[j];
        FP[i2] = FP[j] + "/" + FP[i2];
      } while (j !== 0 && -1 !== dad[j] && j != dad[j]);
      dad[i2] = -1;
    }
    FP[0] += "/";
    for (i2 = 1; i2 < pl; ++i2) {
      if (FI[i2].type !== 2) FP[i2] += "/";
    }
  }
  function get_mfat_entry(entry, payload, mini) {
    var start = entry.start, size = entry.size;
    var o = [];
    var idx = start;
    while (mini && size > 0 && idx >= 0) {
      o.push(payload.slice(idx * MSSZ, idx * MSSZ + MSSZ));
      size -= MSSZ;
      idx = __readInt32LE(mini, idx * 4);
    }
    if (o.length === 0) return new_buf(0);
    return bconcat(o).slice(0, entry.size);
  }
  function sleuth_fat(idx, cnt, sectors, ssz, fat_addrs) {
    var q2 = ENDOFCHAIN;
    if (idx === ENDOFCHAIN) {
      if (cnt !== 0) throw new Error("DIFAT chain shorter than expected");
    } else if (idx !== -1) {
      var sector = sectors[idx], m = (ssz >>> 2) - 1;
      if (!sector) return;
      for (var i2 = 0; i2 < m; ++i2) {
        if ((q2 = __readInt32LE(sector, i2 * 4)) === ENDOFCHAIN) break;
        fat_addrs.push(q2);
      }
      sleuth_fat(__readInt32LE(sector, ssz - 4), cnt - 1, sectors, ssz, fat_addrs);
    }
  }
  function get_sector_list(sectors, start, fat_addrs, ssz, chkd) {
    var buf = [], buf_chain = [];
    if (!chkd) chkd = [];
    var modulus = ssz - 1, j = 0, jj = 0;
    for (j = start; j >= 0; ) {
      chkd[j] = true;
      buf[buf.length] = j;
      buf_chain.push(sectors[j]);
      var addr = fat_addrs[Math.floor(j * 4 / ssz)];
      jj = j * 4 & modulus;
      if (ssz < 4 + jj) throw new Error("FAT boundary crossed: " + j + " 4 " + ssz);
      if (!sectors[addr]) break;
      j = __readInt32LE(sectors[addr], jj);
    }
    return {
      nodes: buf,
      data: __toBuffer([buf_chain])
    };
  }
  function make_sector_list(sectors, dir_start, fat_addrs, ssz) {
    var sl = sectors.length, sector_list = [];
    var chkd = [], buf = [], buf_chain = [];
    var modulus = ssz - 1, i2 = 0, j = 0, k = 0, jj = 0;
    for (i2 = 0; i2 < sl; ++i2) {
      buf = [];
      k = i2 + dir_start;
      if (k >= sl) k -= sl;
      if (chkd[k]) continue;
      buf_chain = [];
      var seen = [];
      for (j = k; j >= 0; ) {
        seen[j] = true;
        chkd[j] = true;
        buf[buf.length] = j;
        buf_chain.push(sectors[j]);
        var addr = fat_addrs[Math.floor(j * 4 / ssz)];
        jj = j * 4 & modulus;
        if (ssz < 4 + jj) throw new Error("FAT boundary crossed: " + j + " 4 " + ssz);
        if (!sectors[addr]) break;
        j = __readInt32LE(sectors[addr], jj);
        if (seen[j]) break;
      }
      sector_list[k] = {
        nodes: buf,
        data: __toBuffer([buf_chain])
      };
    }
    return sector_list;
  }
  function read_directory(dir_start, sector_list, sectors, Paths, nmfs, files, FileIndex, mini) {
    var minifat_store = 0, pl = Paths.length ? 2 : 0;
    var sector = sector_list[dir_start].data;
    var i2 = 0, namelen = 0, name;
    for (; i2 < sector.length; i2 += 128) {
      var blob = (
        /*::(*/
        sector.slice(i2, i2 + 128)
      );
      prep_blob(blob, 64);
      namelen = blob.read_shift(2);
      name = __utf16le(blob, 0, namelen - pl);
      Paths.push(name);
      var o = {
        name,
        type: blob.read_shift(1),
        color: blob.read_shift(1),
        L: blob.read_shift(4, "i"),
        R: blob.read_shift(4, "i"),
        C: blob.read_shift(4, "i"),
        clsid: blob.read_shift(16),
        state: blob.read_shift(4, "i"),
        start: 0,
        size: 0
      };
      var ctime = blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2);
      if (ctime !== 0) o.ct = read_date(blob, blob.l - 8);
      var mtime = blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2);
      if (mtime !== 0) o.mt = read_date(blob, blob.l - 8);
      o.start = blob.read_shift(4, "i");
      o.size = blob.read_shift(4, "i");
      if (o.size < 0 && o.start < 0) {
        o.size = o.type = 0;
        o.start = ENDOFCHAIN;
        o.name = "";
      }
      if (o.type === 5) {
        minifat_store = o.start;
        if (nmfs > 0 && minifat_store !== ENDOFCHAIN) sector_list[minifat_store].name = "!StreamData";
      } else if (o.size >= 4096) {
        o.storage = "fat";
        if (sector_list[o.start] === void 0) sector_list[o.start] = get_sector_list(sectors, o.start, sector_list.fat_addrs, sector_list.ssz);
        sector_list[o.start].name = o.name;
        o.content = sector_list[o.start].data.slice(0, o.size);
      } else {
        o.storage = "minifat";
        if (o.size < 0) o.size = 0;
        else if (minifat_store !== ENDOFCHAIN && o.start !== ENDOFCHAIN && sector_list[minifat_store]) {
          o.content = get_mfat_entry(o, sector_list[minifat_store].data, (sector_list[mini] || {}).data);
        }
      }
      if (o.content) prep_blob(o.content, 0);
      files[name] = o;
      FileIndex.push(o);
    }
  }
  function read_date(blob, offset) {
    return new Date((__readUInt32LE(blob, offset + 4) / 1e7 * Math.pow(2, 32) + __readUInt32LE(blob, offset) / 1e7 - 11644473600) * 1e3);
  }
  function read_file(filename2, options2) {
    get_fs();
    return parse(fs.readFileSync(filename2), options2);
  }
  function read(blob, options2) {
    var type = options2 && options2.type;
    if (!type) {
      if (has_buf && Buffer.isBuffer(blob)) type = "buffer";
    }
    switch (type || "base64") {
      case "file":
        return read_file(blob, options2);
      case "base64":
        return parse(s2a(Base64_decode(blob)), options2);
      case "binary":
        return parse(s2a(blob), options2);
    }
    return parse(
      /*::typeof blob == 'string' ? new Buffer(blob, 'utf-8') : */
      blob,
      options2
    );
  }
  function init_cfb(cfb, opts) {
    var o = opts || {}, root = o.root || "Root Entry";
    if (!cfb.FullPaths) cfb.FullPaths = [];
    if (!cfb.FileIndex) cfb.FileIndex = [];
    if (cfb.FullPaths.length !== cfb.FileIndex.length) throw new Error("inconsistent CFB structure");
    if (cfb.FullPaths.length === 0) {
      cfb.FullPaths[0] = root + "/";
      cfb.FileIndex[0] = {
        name: root,
        type: 5
      };
    }
    if (o.CLSID) cfb.FileIndex[0].clsid = o.CLSID;
    seed_cfb(cfb);
  }
  function seed_cfb(cfb) {
    var nm = "Sh33tJ5";
    if (CFB.find(cfb, "/" + nm)) return;
    var p = new_buf(4);
    p[0] = 55;
    p[1] = p[3] = 50;
    p[2] = 54;
    cfb.FileIndex.push(
      {
        name: nm,
        type: 2,
        content: p,
        size: 4,
        L: 69,
        R: 69,
        C: 69
      }
      /*:any*/
    );
    cfb.FullPaths.push(cfb.FullPaths[0] + nm);
    rebuild_cfb(cfb);
  }
  function rebuild_cfb(cfb, f) {
    init_cfb(cfb);
    var gc = false, s = false;
    for (var i2 = cfb.FullPaths.length - 1; i2 >= 0; --i2) {
      var _file = cfb.FileIndex[i2];
      switch (_file.type) {
        case 0:
          if (s) gc = true;
          else {
            cfb.FileIndex.pop();
            cfb.FullPaths.pop();
          }
          break;
        case 1:
        case 2:
        case 5:
          s = true;
          if (isNaN(_file.R * _file.L * _file.C)) gc = true;
          if (_file.R > -1 && _file.L > -1 && _file.R == _file.L) gc = true;
          break;
        default:
          gc = true;
          break;
      }
    }
    if (!gc && !f) return;
    var now = new Date(1987, 1, 19), j = 0;
    var fullPaths = Object.create ? /* @__PURE__ */ Object.create(null) : {};
    var data = [];
    for (i2 = 0; i2 < cfb.FullPaths.length; ++i2) {
      fullPaths[cfb.FullPaths[i2]] = true;
      if (cfb.FileIndex[i2].type === 0) continue;
      data.push([cfb.FullPaths[i2], cfb.FileIndex[i2]]);
    }
    for (i2 = 0; i2 < data.length; ++i2) {
      var dad = dirname(data[i2][0]);
      s = fullPaths[dad];
      if (!s) {
        data.push([
          dad,
          {
            name: filename(dad).replace("/", ""),
            type: 1,
            clsid: HEADER_CLSID,
            ct: now,
            mt: now,
            content: null
          }
          /*:any*/
        ]);
        fullPaths[dad] = true;
      }
    }
    data.sort(function(x, y) {
      return namecmp(x[0], y[0]);
    });
    cfb.FullPaths = [];
    cfb.FileIndex = [];
    for (i2 = 0; i2 < data.length; ++i2) {
      cfb.FullPaths[i2] = data[i2][0];
      cfb.FileIndex[i2] = data[i2][1];
    }
    for (i2 = 0; i2 < data.length; ++i2) {
      var elt = cfb.FileIndex[i2];
      var nm = cfb.FullPaths[i2];
      elt.name = filename(nm).replace("/", "");
      elt.L = elt.R = elt.C = -(elt.color = 1);
      elt.size = elt.content ? elt.content.length : 0;
      elt.start = 0;
      elt.clsid = elt.clsid || HEADER_CLSID;
      if (i2 === 0) {
        elt.C = data.length > 1 ? 1 : -1;
        elt.size = 0;
        elt.type = 5;
      } else if (nm.slice(-1) == "/") {
        for (j = i2 + 1; j < data.length; ++j) if (dirname(cfb.FullPaths[j]) == nm) break;
        elt.C = j >= data.length ? -1 : j;
        for (j = i2 + 1; j < data.length; ++j) if (dirname(cfb.FullPaths[j]) == dirname(nm)) break;
        elt.R = j >= data.length ? -1 : j;
        elt.type = 1;
      } else {
        if (dirname(cfb.FullPaths[i2 + 1] || "") == dirname(nm)) elt.R = i2 + 1;
        elt.type = 2;
      }
    }
  }
  function _write(cfb, options2) {
    var _opts = options2 || {};
    if (_opts.fileType == "mad") return write_mad(cfb, _opts);
    rebuild_cfb(cfb);
    switch (_opts.fileType) {
      case "zip":
        return write_zip2(cfb, _opts);
    }
    var L = function(cfb2) {
      var mini_size = 0, fat_size = 0;
      for (var i3 = 0; i3 < cfb2.FileIndex.length; ++i3) {
        var file2 = cfb2.FileIndex[i3];
        if (!file2.content) continue;
        var flen2 = file2.content.length;
        if (flen2 > 0) {
          if (flen2 < 4096) mini_size += flen2 + 63 >> 6;
          else fat_size += flen2 + 511 >> 9;
        }
      }
      var dir_cnt = cfb2.FullPaths.length + 3 >> 2;
      var mini_cnt = mini_size + 7 >> 3;
      var mfat_cnt = mini_size + 127 >> 7;
      var fat_base = mini_cnt + fat_size + dir_cnt + mfat_cnt;
      var fat_cnt = fat_base + 127 >> 7;
      var difat_cnt = fat_cnt <= 109 ? 0 : Math.ceil((fat_cnt - 109) / 127);
      while (fat_base + fat_cnt + difat_cnt + 127 >> 7 > fat_cnt) difat_cnt = ++fat_cnt <= 109 ? 0 : Math.ceil((fat_cnt - 109) / 127);
      var L2 = [1, difat_cnt, fat_cnt, mfat_cnt, dir_cnt, fat_size, mini_size, 0];
      cfb2.FileIndex[0].size = mini_size << 6;
      L2[7] = (cfb2.FileIndex[0].start = L2[0] + L2[1] + L2[2] + L2[3] + L2[4] + L2[5]) + (L2[6] + 7 >> 3);
      return L2;
    }(cfb);
    var o = new_buf(L[7] << 9);
    var i2 = 0, T = 0;
    {
      for (i2 = 0; i2 < 8; ++i2) o.write_shift(1, HEADER_SIG[i2]);
      for (i2 = 0; i2 < 8; ++i2) o.write_shift(2, 0);
      o.write_shift(2, 62);
      o.write_shift(2, 3);
      o.write_shift(2, 65534);
      o.write_shift(2, 9);
      o.write_shift(2, 6);
      for (i2 = 0; i2 < 3; ++i2) o.write_shift(2, 0);
      o.write_shift(4, 0);
      o.write_shift(4, L[2]);
      o.write_shift(4, L[0] + L[1] + L[2] + L[3] - 1);
      o.write_shift(4, 0);
      o.write_shift(4, 1 << 12);
      o.write_shift(4, L[3] ? L[0] + L[1] + L[2] - 1 : ENDOFCHAIN);
      o.write_shift(4, L[3]);
      o.write_shift(-4, L[1] ? L[0] - 1 : ENDOFCHAIN);
      o.write_shift(4, L[1]);
      for (i2 = 0; i2 < 109; ++i2) o.write_shift(-4, i2 < L[2] ? L[1] + i2 : -1);
    }
    if (L[1]) {
      for (T = 0; T < L[1]; ++T) {
        for (; i2 < 236 + T * 127; ++i2) o.write_shift(-4, i2 < L[2] ? L[1] + i2 : -1);
        o.write_shift(-4, T === L[1] - 1 ? ENDOFCHAIN : T + 1);
      }
    }
    var chainit = function(w) {
      for (T += w; i2 < T - 1; ++i2) o.write_shift(-4, i2 + 1);
      if (w) {
        ++i2;
        o.write_shift(-4, ENDOFCHAIN);
      }
    };
    T = i2 = 0;
    for (T += L[1]; i2 < T; ++i2) o.write_shift(-4, consts.DIFSECT);
    for (T += L[2]; i2 < T; ++i2) o.write_shift(-4, consts.FATSECT);
    chainit(L[3]);
    chainit(L[4]);
    var j = 0, flen = 0;
    var file = cfb.FileIndex[0];
    for (; j < cfb.FileIndex.length; ++j) {
      file = cfb.FileIndex[j];
      if (!file.content) continue;
      flen = file.content.length;
      if (flen < 4096) continue;
      file.start = T;
      chainit(flen + 511 >> 9);
    }
    chainit(L[6] + 7 >> 3);
    while (o.l & 511) o.write_shift(-4, consts.ENDOFCHAIN);
    T = i2 = 0;
    for (j = 0; j < cfb.FileIndex.length; ++j) {
      file = cfb.FileIndex[j];
      if (!file.content) continue;
      flen = file.content.length;
      if (!flen || flen >= 4096) continue;
      file.start = T;
      chainit(flen + 63 >> 6);
    }
    while (o.l & 511) o.write_shift(-4, consts.ENDOFCHAIN);
    for (i2 = 0; i2 < L[4] << 2; ++i2) {
      var nm = cfb.FullPaths[i2];
      if (!nm || nm.length === 0) {
        for (j = 0; j < 17; ++j) o.write_shift(4, 0);
        for (j = 0; j < 3; ++j) o.write_shift(4, -1);
        for (j = 0; j < 12; ++j) o.write_shift(4, 0);
        continue;
      }
      file = cfb.FileIndex[i2];
      if (i2 === 0) file.start = file.size ? file.start - 1 : ENDOFCHAIN;
      var _nm = i2 === 0 && _opts.root || file.name;
      flen = 2 * (_nm.length + 1);
      o.write_shift(64, _nm, "utf16le");
      o.write_shift(2, flen);
      o.write_shift(1, file.type);
      o.write_shift(1, file.color);
      o.write_shift(-4, file.L);
      o.write_shift(-4, file.R);
      o.write_shift(-4, file.C);
      if (!file.clsid) for (j = 0; j < 4; ++j) o.write_shift(4, 0);
      else o.write_shift(16, file.clsid, "hex");
      o.write_shift(4, file.state || 0);
      o.write_shift(4, 0);
      o.write_shift(4, 0);
      o.write_shift(4, 0);
      o.write_shift(4, 0);
      o.write_shift(4, file.start);
      o.write_shift(4, file.size);
      o.write_shift(4, 0);
    }
    for (i2 = 1; i2 < cfb.FileIndex.length; ++i2) {
      file = cfb.FileIndex[i2];
      if (file.size >= 4096) {
        o.l = file.start + 1 << 9;
        if (has_buf && Buffer.isBuffer(file.content)) {
          file.content.copy(o, o.l, 0, file.size);
          o.l += file.size + 511 & -512;
        } else {
          for (j = 0; j < file.size; ++j) o.write_shift(1, file.content[j]);
          for (; j & 511; ++j) o.write_shift(1, 0);
        }
      }
    }
    for (i2 = 1; i2 < cfb.FileIndex.length; ++i2) {
      file = cfb.FileIndex[i2];
      if (file.size > 0 && file.size < 4096) {
        if (has_buf && Buffer.isBuffer(file.content)) {
          file.content.copy(o, o.l, 0, file.size);
          o.l += file.size + 63 & -64;
        } else {
          for (j = 0; j < file.size; ++j) o.write_shift(1, file.content[j]);
          for (; j & 63; ++j) o.write_shift(1, 0);
        }
      }
    }
    if (has_buf) {
      o.l = o.length;
    } else {
      while (o.l < o.length) o.write_shift(1, 0);
    }
    return o;
  }
  function find(cfb, path) {
    var UCFullPaths = cfb.FullPaths.map(function(x) {
      return x.toUpperCase();
    });
    var UCPaths = UCFullPaths.map(function(x) {
      var y = x.split("/");
      return y[y.length - (x.slice(-1) == "/" ? 2 : 1)];
    });
    var k = false;
    if (path.charCodeAt(0) === 47) {
      k = true;
      path = UCFullPaths[0].slice(0, -1) + path;
    } else k = path.indexOf("/") !== -1;
    var UCPath = path.toUpperCase();
    var w = k === true ? UCFullPaths.indexOf(UCPath) : UCPaths.indexOf(UCPath);
    if (w !== -1) return cfb.FileIndex[w];
    var m = !UCPath.match(chr1);
    UCPath = UCPath.replace(chr0, "");
    if (m) UCPath = UCPath.replace(chr1, "!");
    for (w = 0; w < UCFullPaths.length; ++w) {
      if ((m ? UCFullPaths[w].replace(chr1, "!") : UCFullPaths[w]).replace(chr0, "") == UCPath) return cfb.FileIndex[w];
      if ((m ? UCPaths[w].replace(chr1, "!") : UCPaths[w]).replace(chr0, "") == UCPath) return cfb.FileIndex[w];
    }
    return null;
  }
  var MSSZ = 64;
  var ENDOFCHAIN = -2;
  var HEADER_SIGNATURE = "d0cf11e0a1b11ae1";
  var HEADER_SIG = [208, 207, 17, 224, 161, 177, 26, 225];
  var HEADER_CLSID = "00000000000000000000000000000000";
  var consts = {
    /* 2.1 Compund File Sector Numbers and Types */
    MAXREGSECT: -6,
    DIFSECT: -4,
    FATSECT: -3,
    ENDOFCHAIN,
    FREESECT: -1,
    /* 2.2 Compound File Header */
    HEADER_SIGNATURE,
    HEADER_MINOR_VERSION: "3e00",
    MAXREGSID: -6,
    NOSTREAM: -1,
    HEADER_CLSID,
    /* 2.6.1 Compound File Directory Entry */
    EntryTypes: ["unknown", "storage", "stream", "lockbytes", "property", "root"]
  };
  function write_file(cfb, filename2, options2) {
    get_fs();
    var o = _write(cfb, options2);
    fs.writeFileSync(filename2, o);
  }
  function a2s2(o) {
    var out = new Array(o.length);
    for (var i2 = 0; i2 < o.length; ++i2) out[i2] = String.fromCharCode(o[i2]);
    return out.join("");
  }
  function write(cfb, options2) {
    var o = _write(cfb, options2);
    switch (options2 && options2.type || "buffer") {
      case "file":
        get_fs();
        fs.writeFileSync(
          options2.filename,
          o
          /*:any*/
        );
        return o;
      case "binary":
        return typeof o == "string" ? o : a2s2(o);
      case "base64":
        return Base64_encode(typeof o == "string" ? o : a2s2(o));
      case "buffer":
        if (has_buf) return Buffer.isBuffer(o) ? o : Buffer_from(o);
      case "array":
        return typeof o == "string" ? s2a(o) : o;
    }
    return o;
  }
  var _zlib;
  function use_zlib(zlib) {
    try {
      var InflateRaw = zlib.InflateRaw;
      var InflRaw = new InflateRaw();
      InflRaw._processChunk(new Uint8Array([3, 0]), InflRaw._finishFlushFlag);
      if (InflRaw.bytesRead) _zlib = zlib;
      else throw new Error("zlib does not expose bytesRead");
    } catch (e) {
      console.error("cannot use native zlib: " + (e.message || e));
    }
  }
  function _inflateRawSync(payload, usz) {
    if (!_zlib) return _inflate(payload, usz);
    var InflateRaw = _zlib.InflateRaw;
    var InflRaw = new InflateRaw();
    var out = InflRaw._processChunk(payload.slice(payload.l), InflRaw._finishFlushFlag);
    payload.l += InflRaw.bytesRead;
    return out;
  }
  function _deflateRawSync(payload) {
    return _zlib ? _zlib.deflateRawSync(payload) : _deflate(payload);
  }
  var CLEN_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var LEN_LN = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var DST_LN = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  function bit_swap_8(n) {
    var t = (n << 1 | n << 11) & 139536 | (n << 5 | n << 15) & 558144;
    return (t >> 16 | t >> 8 | t) & 255;
  }
  var use_typed_arrays = typeof Uint8Array !== "undefined";
  var bitswap8 = use_typed_arrays ? new Uint8Array(1 << 8) : [];
  for (var q = 0; q < 1 << 8; ++q) bitswap8[q] = bit_swap_8(q);
  function bit_swap_n(n, b) {
    var rev = bitswap8[n & 255];
    if (b <= 8) return rev >>> 8 - b;
    rev = rev << 8 | bitswap8[n >> 8 & 255];
    if (b <= 16) return rev >>> 16 - b;
    rev = rev << 8 | bitswap8[n >> 16 & 255];
    return rev >>> 24 - b;
  }
  function read_bits_2(buf, bl) {
    var w = bl & 7, h = bl >>> 3;
    return (buf[h] | (w <= 6 ? 0 : buf[h + 1] << 8)) >>> w & 3;
  }
  function read_bits_3(buf, bl) {
    var w = bl & 7, h = bl >>> 3;
    return (buf[h] | (w <= 5 ? 0 : buf[h + 1] << 8)) >>> w & 7;
  }
  function read_bits_4(buf, bl) {
    var w = bl & 7, h = bl >>> 3;
    return (buf[h] | (w <= 4 ? 0 : buf[h + 1] << 8)) >>> w & 15;
  }
  function read_bits_5(buf, bl) {
    var w = bl & 7, h = bl >>> 3;
    return (buf[h] | (w <= 3 ? 0 : buf[h + 1] << 8)) >>> w & 31;
  }
  function read_bits_7(buf, bl) {
    var w = bl & 7, h = bl >>> 3;
    return (buf[h] | (w <= 1 ? 0 : buf[h + 1] << 8)) >>> w & 127;
  }
  function read_bits_n(buf, bl, n) {
    var w = bl & 7, h = bl >>> 3, f = (1 << n) - 1;
    var v = buf[h] >>> w;
    if (n < 8 - w) return v & f;
    v |= buf[h + 1] << 8 - w;
    if (n < 16 - w) return v & f;
    v |= buf[h + 2] << 16 - w;
    if (n < 24 - w) return v & f;
    v |= buf[h + 3] << 24 - w;
    return v & f;
  }
  function write_bits_3(buf, bl, v) {
    var w = bl & 7, h = bl >>> 3;
    if (w <= 5) buf[h] |= (v & 7) << w;
    else {
      buf[h] |= v << w & 255;
      buf[h + 1] = (v & 7) >> 8 - w;
    }
    return bl + 3;
  }
  function write_bits_1(buf, bl, v) {
    var w = bl & 7, h = bl >>> 3;
    v = (v & 1) << w;
    buf[h] |= v;
    return bl + 1;
  }
  function write_bits_8(buf, bl, v) {
    var w = bl & 7, h = bl >>> 3;
    v <<= w;
    buf[h] |= v & 255;
    v >>>= 8;
    buf[h + 1] = v;
    return bl + 8;
  }
  function write_bits_16(buf, bl, v) {
    var w = bl & 7, h = bl >>> 3;
    v <<= w;
    buf[h] |= v & 255;
    v >>>= 8;
    buf[h + 1] = v & 255;
    buf[h + 2] = v >>> 8;
    return bl + 16;
  }
  function realloc(b, sz) {
    var L = b.length, M = 2 * L > sz ? 2 * L : sz + 5, i2 = 0;
    if (L >= sz) return b;
    if (has_buf) {
      var o = new_unsafe_buf(M);
      if (b.copy) b.copy(o);
      else for (; i2 < b.length; ++i2) o[i2] = b[i2];
      return o;
    } else if (use_typed_arrays) {
      var a = new Uint8Array(M);
      if (a.set) a.set(b);
      else for (; i2 < L; ++i2) a[i2] = b[i2];
      return a;
    }
    b.length = M;
    return b;
  }
  function zero_fill_array(n) {
    var o = new Array(n);
    for (var i2 = 0; i2 < n; ++i2) o[i2] = 0;
    return o;
  }
  function build_tree(clens, cmap, MAX) {
    var maxlen = 1, w = 0, i2 = 0, j = 0, ccode = 0, L = clens.length;
    var bl_count = use_typed_arrays ? new Uint16Array(32) : zero_fill_array(32);
    for (i2 = 0; i2 < 32; ++i2) bl_count[i2] = 0;
    for (i2 = L; i2 < MAX; ++i2) clens[i2] = 0;
    L = clens.length;
    var ctree = use_typed_arrays ? new Uint16Array(L) : zero_fill_array(L);
    for (i2 = 0; i2 < L; ++i2) {
      bl_count[w = clens[i2]]++;
      if (maxlen < w) maxlen = w;
      ctree[i2] = 0;
    }
    bl_count[0] = 0;
    for (i2 = 1; i2 <= maxlen; ++i2) bl_count[i2 + 16] = ccode = ccode + bl_count[i2 - 1] << 1;
    for (i2 = 0; i2 < L; ++i2) {
      ccode = clens[i2];
      if (ccode != 0) ctree[i2] = bl_count[ccode + 16]++;
    }
    var cleni = 0;
    for (i2 = 0; i2 < L; ++i2) {
      cleni = clens[i2];
      if (cleni != 0) {
        ccode = bit_swap_n(ctree[i2], maxlen) >> maxlen - cleni;
        for (j = (1 << maxlen + 4 - cleni) - 1; j >= 0; --j) cmap[ccode | j << cleni] = cleni & 15 | i2 << 4;
      }
    }
    return maxlen;
  }
  var fix_lmap = use_typed_arrays ? new Uint16Array(512) : zero_fill_array(512);
  var fix_dmap = use_typed_arrays ? new Uint16Array(32) : zero_fill_array(32);
  if (!use_typed_arrays) {
    for (var i = 0; i < 512; ++i) fix_lmap[i] = 0;
    for (i = 0; i < 32; ++i) fix_dmap[i] = 0;
  }
  (function() {
    var dlens = [];
    var i2 = 0;
    for (; i2 < 32; i2++) dlens.push(5);
    build_tree(dlens, fix_dmap, 32);
    var clens = [];
    i2 = 0;
    for (; i2 <= 143; i2++) clens.push(8);
    for (; i2 <= 255; i2++) clens.push(9);
    for (; i2 <= 279; i2++) clens.push(7);
    for (; i2 <= 287; i2++) clens.push(8);
    build_tree(clens, fix_lmap, 288);
  })();
  var _deflateRaw = /* @__PURE__ */ function _deflateRawIIFE() {
    var DST_LN_RE = use_typed_arrays ? new Uint8Array(32768) : [];
    var j = 0, k = 0;
    for (; j < DST_LN.length - 1; ++j) {
      for (; k < DST_LN[j + 1]; ++k) DST_LN_RE[k] = j;
    }
    for (; k < 32768; ++k) DST_LN_RE[k] = 29;
    var LEN_LN_RE = use_typed_arrays ? new Uint8Array(259) : [];
    for (j = 0, k = 0; j < LEN_LN.length - 1; ++j) {
      for (; k < LEN_LN[j + 1]; ++k) LEN_LN_RE[k] = j;
    }
    function write_stored(data, out) {
      var boff = 0;
      while (boff < data.length) {
        var L = Math.min(65535, data.length - boff);
        var h = boff + L == data.length;
        out.write_shift(1, +h);
        out.write_shift(2, L);
        out.write_shift(2, ~L & 65535);
        while (L-- > 0) out[out.l++] = data[boff++];
      }
      return out.l;
    }
    function write_huff_fixed(data, out) {
      var bl = 0;
      var boff = 0;
      var addrs = use_typed_arrays ? new Uint16Array(32768) : [];
      while (boff < data.length) {
        var L = (
          /* data.length - boff; */
          Math.min(65535, data.length - boff)
        );
        if (L < 10) {
          bl = write_bits_3(out, bl, +!!(boff + L == data.length));
          if (bl & 7) bl += 8 - (bl & 7);
          out.l = bl / 8 | 0;
          out.write_shift(2, L);
          out.write_shift(2, ~L & 65535);
          while (L-- > 0) out[out.l++] = data[boff++];
          bl = out.l * 8;
          continue;
        }
        bl = write_bits_3(out, bl, +!!(boff + L == data.length) + 2);
        var hash = 0;
        while (L-- > 0) {
          var d = data[boff];
          hash = (hash << 5 ^ d) & 32767;
          var match = -1, mlen = 0;
          if (match = addrs[hash]) {
            match |= boff & ~32767;
            if (match > boff) match -= 32768;
            if (match < boff) while (data[match + mlen] == data[boff + mlen] && mlen < 250) ++mlen;
          }
          if (mlen > 2) {
            d = LEN_LN_RE[mlen];
            if (d <= 22) bl = write_bits_8(out, bl, bitswap8[d + 1] >> 1) - 1;
            else {
              write_bits_8(out, bl, 3);
              bl += 5;
              write_bits_8(out, bl, bitswap8[d - 23] >> 5);
              bl += 3;
            }
            var len_eb = d < 8 ? 0 : d - 4 >> 2;
            if (len_eb > 0) {
              write_bits_16(out, bl, mlen - LEN_LN[d]);
              bl += len_eb;
            }
            d = DST_LN_RE[boff - match];
            bl = write_bits_8(out, bl, bitswap8[d] >> 3);
            bl -= 3;
            var dst_eb = d < 4 ? 0 : d - 2 >> 1;
            if (dst_eb > 0) {
              write_bits_16(out, bl, boff - match - DST_LN[d]);
              bl += dst_eb;
            }
            for (var q2 = 0; q2 < mlen; ++q2) {
              addrs[hash] = boff & 32767;
              hash = (hash << 5 ^ data[boff]) & 32767;
              ++boff;
            }
            L -= mlen - 1;
          } else {
            if (d <= 143) d = d + 48;
            else bl = write_bits_1(out, bl, 1);
            bl = write_bits_8(out, bl, bitswap8[d]);
            addrs[hash] = boff & 32767;
            ++boff;
          }
        }
        bl = write_bits_8(out, bl, 0) - 1;
      }
      out.l = (bl + 7) / 8 | 0;
      return out.l;
    }
    return function _deflateRaw2(data, out) {
      if (data.length < 8) return write_stored(data, out);
      return write_huff_fixed(data, out);
    };
  }();
  function _deflate(data) {
    var buf = new_buf(50 + Math.floor(data.length * 1.1));
    var off = _deflateRaw(data, buf);
    return buf.slice(0, off);
  }
  var dyn_lmap = use_typed_arrays ? new Uint16Array(32768) : zero_fill_array(32768);
  var dyn_dmap = use_typed_arrays ? new Uint16Array(32768) : zero_fill_array(32768);
  var dyn_cmap = use_typed_arrays ? new Uint16Array(128) : zero_fill_array(128);
  var dyn_len_1 = 1, dyn_len_2 = 1;
  function dyn(data, boff) {
    var _HLIT = read_bits_5(data, boff) + 257;
    boff += 5;
    var _HDIST = read_bits_5(data, boff) + 1;
    boff += 5;
    var _HCLEN = read_bits_4(data, boff) + 4;
    boff += 4;
    var w = 0;
    var clens = use_typed_arrays ? new Uint8Array(19) : zero_fill_array(19);
    var ctree = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var maxlen = 1;
    var bl_count = use_typed_arrays ? new Uint8Array(8) : zero_fill_array(8);
    var next_code = use_typed_arrays ? new Uint8Array(8) : zero_fill_array(8);
    var L = clens.length;
    for (var i2 = 0; i2 < _HCLEN; ++i2) {
      clens[CLEN_ORDER[i2]] = w = read_bits_3(data, boff);
      if (maxlen < w) maxlen = w;
      bl_count[w]++;
      boff += 3;
    }
    var ccode = 0;
    bl_count[0] = 0;
    for (i2 = 1; i2 <= maxlen; ++i2) next_code[i2] = ccode = ccode + bl_count[i2 - 1] << 1;
    for (i2 = 0; i2 < L; ++i2) if ((ccode = clens[i2]) != 0) ctree[i2] = next_code[ccode]++;
    var cleni = 0;
    for (i2 = 0; i2 < L; ++i2) {
      cleni = clens[i2];
      if (cleni != 0) {
        ccode = bitswap8[ctree[i2]] >> 8 - cleni;
        for (var j = (1 << 7 - cleni) - 1; j >= 0; --j) dyn_cmap[ccode | j << cleni] = cleni & 7 | i2 << 3;
      }
    }
    var hcodes = [];
    maxlen = 1;
    for (; hcodes.length < _HLIT + _HDIST; ) {
      ccode = dyn_cmap[read_bits_7(data, boff)];
      boff += ccode & 7;
      switch (ccode >>>= 3) {
        case 16:
          w = 3 + read_bits_2(data, boff);
          boff += 2;
          ccode = hcodes[hcodes.length - 1];
          while (w-- > 0) hcodes.push(ccode);
          break;
        case 17:
          w = 3 + read_bits_3(data, boff);
          boff += 3;
          while (w-- > 0) hcodes.push(0);
          break;
        case 18:
          w = 11 + read_bits_7(data, boff);
          boff += 7;
          while (w-- > 0) hcodes.push(0);
          break;
        default:
          hcodes.push(ccode);
          if (maxlen < ccode) maxlen = ccode;
          break;
      }
    }
    var h1 = hcodes.slice(0, _HLIT), h2 = hcodes.slice(_HLIT);
    for (i2 = _HLIT; i2 < 286; ++i2) h1[i2] = 0;
    for (i2 = _HDIST; i2 < 30; ++i2) h2[i2] = 0;
    dyn_len_1 = build_tree(h1, dyn_lmap, 286);
    dyn_len_2 = build_tree(h2, dyn_dmap, 30);
    return boff;
  }
  function inflate(data, usz) {
    if (data[0] == 3 && !(data[1] & 3)) {
      return [new_raw_buf(usz), 2];
    }
    var boff = 0;
    var header = 0;
    var outbuf = new_unsafe_buf(usz ? usz : 1 << 18);
    var woff = 0;
    var OL = outbuf.length >>> 0;
    var max_len_1 = 0, max_len_2 = 0;
    while ((header & 1) == 0) {
      header = read_bits_3(data, boff);
      boff += 3;
      if (header >>> 1 == 0) {
        if (boff & 7) boff += 8 - (boff & 7);
        var sz = data[boff >>> 3] | data[(boff >>> 3) + 1] << 8;
        boff += 32;
        if (sz > 0) {
          if (!usz && OL < woff + sz) {
            outbuf = realloc(outbuf, woff + sz);
            OL = outbuf.length;
          }
          while (sz-- > 0) {
            outbuf[woff++] = data[boff >>> 3];
            boff += 8;
          }
        }
        continue;
      } else if (header >> 1 == 1) {
        max_len_1 = 9;
        max_len_2 = 5;
      } else {
        boff = dyn(data, boff);
        max_len_1 = dyn_len_1;
        max_len_2 = dyn_len_2;
      }
      for (; ; ) {
        if (!usz && OL < woff + 32767) {
          outbuf = realloc(outbuf, woff + 32767);
          OL = outbuf.length;
        }
        var bits = read_bits_n(data, boff, max_len_1);
        var code = header >>> 1 == 1 ? fix_lmap[bits] : dyn_lmap[bits];
        boff += code & 15;
        code >>>= 4;
        if ((code >>> 8 & 255) === 0) outbuf[woff++] = code;
        else if (code == 256) break;
        else {
          code -= 257;
          var len_eb = code < 8 ? 0 : code - 4 >> 2;
          if (len_eb > 5) len_eb = 0;
          var tgt = woff + LEN_LN[code];
          if (len_eb > 0) {
            tgt += read_bits_n(data, boff, len_eb);
            boff += len_eb;
          }
          bits = read_bits_n(data, boff, max_len_2);
          code = header >>> 1 == 1 ? fix_dmap[bits] : dyn_dmap[bits];
          boff += code & 15;
          code >>>= 4;
          var dst_eb = code < 4 ? 0 : code - 2 >> 1;
          var dst = DST_LN[code];
          if (dst_eb > 0) {
            dst += read_bits_n(data, boff, dst_eb);
            boff += dst_eb;
          }
          if (!usz && OL < tgt) {
            outbuf = realloc(outbuf, tgt + 100);
            OL = outbuf.length;
          }
          while (woff < tgt) {
            outbuf[woff] = outbuf[woff - dst];
            ++woff;
          }
        }
      }
    }
    if (usz) return [outbuf, boff + 7 >>> 3];
    return [outbuf.slice(0, woff), boff + 7 >>> 3];
  }
  function _inflate(payload, usz) {
    var data = payload.slice(payload.l || 0);
    var out = inflate(data, usz);
    payload.l += out[1];
    return out[0];
  }
  function warn_or_throw(wrn, msg) {
    if (wrn) {
      if (typeof console !== "undefined") console.error(msg);
    } else throw new Error(msg);
  }
  function parse_zip(file, options2) {
    var blob = (
      /*::(*/
      file
    );
    prep_blob(blob, 0);
    var FileIndex = [], FullPaths = [];
    var o = {
      FileIndex,
      FullPaths
    };
    init_cfb(o, {
      root: options2.root
    });
    var i2 = blob.length - 4;
    while ((blob[i2] != 80 || blob[i2 + 1] != 75 || blob[i2 + 2] != 5 || blob[i2 + 3] != 6) && i2 >= 0) --i2;
    blob.l = i2 + 4;
    blob.l += 4;
    var fcnt = blob.read_shift(2);
    blob.l += 6;
    var start_cd = blob.read_shift(4);
    blob.l = start_cd;
    for (i2 = 0; i2 < fcnt; ++i2) {
      blob.l += 20;
      var csz = blob.read_shift(4);
      var usz = blob.read_shift(4);
      var namelen = blob.read_shift(2);
      var efsz = blob.read_shift(2);
      var fcsz = blob.read_shift(2);
      blob.l += 8;
      var offset = blob.read_shift(4);
      var EF = parse_extra_field(
        /*::(*/
        blob.slice(blob.l + namelen, blob.l + namelen + efsz)
        /*:: :any)*/
      );
      blob.l += namelen + efsz + fcsz;
      var L = blob.l;
      blob.l = offset + 4;
      parse_local_file(blob, csz, usz, o, EF);
      blob.l = L;
    }
    return o;
  }
  function parse_local_file(blob, csz, usz, o, EF) {
    blob.l += 2;
    var flags = blob.read_shift(2);
    var meth = blob.read_shift(2);
    var date = parse_dos_date(blob);
    if (flags & 8257) throw new Error("Unsupported ZIP encryption");
    var crc32 = blob.read_shift(4);
    var _csz = blob.read_shift(4);
    var _usz = blob.read_shift(4);
    var namelen = blob.read_shift(2);
    var efsz = blob.read_shift(2);
    var name = "";
    for (var i2 = 0; i2 < namelen; ++i2) name += String.fromCharCode(blob[blob.l++]);
    if (efsz) {
      var ef = parse_extra_field(
        /*::(*/
        blob.slice(blob.l, blob.l + efsz)
        /*:: :any)*/
      );
      if ((ef[21589] || {}).mt) date = ef[21589].mt;
      if (((EF || {})[21589] || {}).mt) date = EF[21589].mt;
    }
    blob.l += efsz;
    var data = blob.slice(blob.l, blob.l + _csz);
    switch (meth) {
      case 8:
        data = _inflateRawSync(blob, _usz);
        break;
      case 0:
        break;
      default:
        throw new Error("Unsupported ZIP Compression method " + meth);
    }
    var wrn = false;
    if (flags & 8) {
      crc32 = blob.read_shift(4);
      if (crc32 == 134695760) {
        crc32 = blob.read_shift(4);
        wrn = true;
      }
      _csz = blob.read_shift(4);
      _usz = blob.read_shift(4);
    }
    if (_csz != csz) warn_or_throw(wrn, "Bad compressed size: " + csz + " != " + _csz);
    if (_usz != usz) warn_or_throw(wrn, "Bad uncompressed size: " + usz + " != " + _usz);
    cfb_add(o, name, data, {
      unsafe: true,
      mt: date
    });
  }
  function write_zip2(cfb, options2) {
    var _opts = options2 || {};
    var out = [], cdirs = [];
    var o = new_buf(1);
    var method = _opts.compression ? 8 : 0, flags = 0;
    var desc = false;
    if (desc) flags |= 8;
    var i2 = 0, j = 0;
    var start_cd = 0, fcnt = 0;
    var root = cfb.FullPaths[0], fp = root, fi = cfb.FileIndex[0];
    var crcs = [];
    var sz_cd = 0;
    for (i2 = 1; i2 < cfb.FullPaths.length; ++i2) {
      fp = cfb.FullPaths[i2].slice(root.length);
      fi = cfb.FileIndex[i2];
      if (!fi.size || !fi.content || fp == "Sh33tJ5") continue;
      var start = start_cd;
      var namebuf = new_buf(fp.length);
      for (j = 0; j < fp.length; ++j) namebuf.write_shift(1, fp.charCodeAt(j) & 127);
      namebuf = namebuf.slice(0, namebuf.l);
      crcs[fcnt] = CRC32.buf(
        /*::((*/
        fi.content,
        0
      );
      var outbuf = fi.content;
      if (method == 8) outbuf = _deflateRawSync(outbuf);
      o = new_buf(30);
      o.write_shift(4, 67324752);
      o.write_shift(2, 20);
      o.write_shift(2, flags);
      o.write_shift(2, method);
      if (fi.mt) write_dos_date(o, fi.mt);
      else o.write_shift(4, 0);
      o.write_shift(-4, flags & 8 ? 0 : crcs[fcnt]);
      o.write_shift(4, flags & 8 ? 0 : outbuf.length);
      o.write_shift(4, flags & 8 ? 0 : (
        /*::(*/
        fi.content.length
      ));
      o.write_shift(2, namebuf.length);
      o.write_shift(2, 0);
      start_cd += o.length;
      out.push(o);
      start_cd += namebuf.length;
      out.push(namebuf);
      start_cd += outbuf.length;
      out.push(outbuf);
      if (flags & 8) {
        o = new_buf(12);
        o.write_shift(-4, crcs[fcnt]);
        o.write_shift(4, outbuf.length);
        o.write_shift(
          4,
          /*::(*/
          fi.content.length
        );
        start_cd += o.l;
        out.push(o);
      }
      o = new_buf(46);
      o.write_shift(4, 33639248);
      o.write_shift(2, 0);
      o.write_shift(2, 20);
      o.write_shift(2, flags);
      o.write_shift(2, method);
      o.write_shift(4, 0);
      o.write_shift(-4, crcs[fcnt]);
      o.write_shift(4, outbuf.length);
      o.write_shift(
        4,
        /*::(*/
        fi.content.length
      );
      o.write_shift(2, namebuf.length);
      o.write_shift(2, 0);
      o.write_shift(2, 0);
      o.write_shift(2, 0);
      o.write_shift(2, 0);
      o.write_shift(4, 0);
      o.write_shift(4, start);
      sz_cd += o.l;
      cdirs.push(o);
      sz_cd += namebuf.length;
      cdirs.push(namebuf);
      ++fcnt;
    }
    o = new_buf(22);
    o.write_shift(4, 101010256);
    o.write_shift(2, 0);
    o.write_shift(2, 0);
    o.write_shift(2, fcnt);
    o.write_shift(2, fcnt);
    o.write_shift(4, sz_cd);
    o.write_shift(4, start_cd);
    o.write_shift(2, 0);
    return bconcat(
      [bconcat(
        out
        /*:any*/
      ), bconcat(cdirs), o]
      /*:any*/
    );
  }
  var ContentTypeMap = {
    "htm": "text/html",
    "xml": "text/xml",
    "gif": "image/gif",
    "jpg": "image/jpeg",
    "png": "image/png",
    "mso": "application/x-mso",
    "thmx": "application/vnd.ms-officetheme",
    "sh33tj5": "application/octet-stream"
  };
  function get_content_type(fi, fp) {
    if (fi.ctype) return fi.ctype;
    var ext = fi.name || "", m = ext.match(/\.([^\.]+)$/);
    if (m && ContentTypeMap[m[1]]) return ContentTypeMap[m[1]];
    if (fp) {
      m = (ext = fp).match(/[\.\\]([^\.\\])+$/);
      if (m && ContentTypeMap[m[1]]) return ContentTypeMap[m[1]];
    }
    return "application/octet-stream";
  }
  function write_base64_76(bstr) {
    var data = Base64_encode(bstr);
    var o = [];
    for (var i2 = 0; i2 < data.length; i2 += 76) o.push(data.slice(i2, i2 + 76));
    return o.join("\r\n") + "\r\n";
  }
  function write_quoted_printable(text) {
    var encoded = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function(c) {
      var w = c.charCodeAt(0).toString(16).toUpperCase();
      return "=" + (w.length == 1 ? "0" + w : w);
    });
    encoded = encoded.replace(/ $/mg, "=20").replace(/\t$/mg, "=09");
    if (encoded.charAt(0) == "\n") encoded = "=0D" + encoded.slice(1);
    encoded = encoded.replace(/\r(?!\n)/mg, "=0D").replace(/\n\n/mg, "\n=0A").replace(/([^\r\n])\n/mg, "$1=0A");
    var o = [], split = encoded.split("\r\n");
    for (var si = 0; si < split.length; ++si) {
      var str = split[si];
      if (str.length == 0) {
        o.push("");
        continue;
      }
      for (var i2 = 0; i2 < str.length; ) {
        var end = 76;
        var tmp = str.slice(i2, i2 + end);
        if (tmp.charAt(end - 1) == "=") end--;
        else if (tmp.charAt(end - 2) == "=") end -= 2;
        else if (tmp.charAt(end - 3) == "=") end -= 3;
        tmp = str.slice(i2, i2 + end);
        i2 += end;
        if (i2 < str.length) tmp += "=";
        o.push(tmp);
      }
    }
    return o.join("\r\n");
  }
  function parse_quoted_printable(data) {
    var o = [];
    for (var di = 0; di < data.length; ++di) {
      var line = data[di];
      while (di <= data.length && line.charAt(line.length - 1) == "=") line = line.slice(0, line.length - 1) + data[++di];
      o.push(line);
    }
    for (var oi = 0; oi < o.length; ++oi) o[oi] = o[oi].replace(/[=][0-9A-Fa-f]{2}/g, function($$) {
      return String.fromCharCode(parseInt($$.slice(1), 16));
    });
    return s2a(o.join("\r\n"));
  }
  function parse_mime(cfb, data, root) {
    var fname = "", cte = "", ctype = "", fdata;
    var di = 0;
    for (; di < 10; ++di) {
      var line = data[di];
      if (!line || line.match(/^\s*$/)) break;
      var m = line.match(/^(.*?):\s*([^\s].*)$/);
      if (m) switch (m[1].toLowerCase()) {
        case "content-location":
          fname = m[2].trim();
          break;
        case "content-type":
          ctype = m[2].trim();
          break;
        case "content-transfer-encoding":
          cte = m[2].trim();
          break;
      }
    }
    ++di;
    switch (cte.toLowerCase()) {
      case "base64":
        fdata = s2a(Base64_decode(data.slice(di).join("")));
        break;
      case "quoted-printable":
        fdata = parse_quoted_printable(data.slice(di));
        break;
      default:
        throw new Error("Unsupported Content-Transfer-Encoding " + cte);
    }
    var file = cfb_add(cfb, fname.slice(root.length), fdata, {
      unsafe: true
    });
    if (ctype) file.ctype = ctype;
  }
  function parse_mad(file, options2) {
    if (a2s2(file.slice(0, 13)).toLowerCase() != "mime-version:") throw new Error("Unsupported MAD header");
    var root = options2 && options2.root || "";
    var data = (has_buf && Buffer.isBuffer(file) ? file.toString("binary") : a2s2(file)).split("\r\n");
    var di = 0, row = "";
    for (di = 0; di < data.length; ++di) {
      row = data[di];
      if (!/^Content-Location:/i.test(row)) continue;
      row = row.slice(row.indexOf("file"));
      if (!root) root = row.slice(0, row.lastIndexOf("/") + 1);
      if (row.slice(0, root.length) == root) continue;
      while (root.length > 0) {
        root = root.slice(0, root.length - 1);
        root = root.slice(0, root.lastIndexOf("/") + 1);
        if (row.slice(0, root.length) == root) break;
      }
    }
    var mboundary = (data[1] || "").match(/boundary="(.*?)"/);
    if (!mboundary) throw new Error("MAD cannot find boundary");
    var boundary = "--" + (mboundary[1] || "");
    var FileIndex = [], FullPaths = [];
    var o = {
      FileIndex,
      FullPaths
    };
    init_cfb(o);
    var start_di, fcnt = 0;
    for (di = 0; di < data.length; ++di) {
      var line = data[di];
      if (line !== boundary && line !== boundary + "--") continue;
      if (fcnt++) parse_mime(o, data.slice(start_di, di), root);
      start_di = di;
    }
    return o;
  }
  function write_mad(cfb, options2) {
    var opts = options2 || {};
    var boundary = opts.boundary || "SheetJS";
    boundary = "------=" + boundary;
    var out = ["MIME-Version: 1.0", 'Content-Type: multipart/related; boundary="' + boundary.slice(2) + '"', "", "", ""];
    var root = cfb.FullPaths[0], fp = root, fi = cfb.FileIndex[0];
    for (var i2 = 1; i2 < cfb.FullPaths.length; ++i2) {
      fp = cfb.FullPaths[i2].slice(root.length);
      fi = cfb.FileIndex[i2];
      if (!fi.size || !fi.content || fp == "Sh33tJ5") continue;
      fp = fp.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function(c) {
        return "_x" + c.charCodeAt(0).toString(16) + "_";
      }).replace(/[\u0080-\uFFFF]/g, function(u) {
        return "_u" + u.charCodeAt(0).toString(16) + "_";
      });
      var ca = fi.content;
      var cstr = has_buf && Buffer.isBuffer(ca) ? ca.toString("binary") : a2s2(ca);
      var dispcnt = 0, L = Math.min(1024, cstr.length), cc = 0;
      for (var csl = 0; csl <= L; ++csl) if ((cc = cstr.charCodeAt(csl)) >= 32 && cc < 128) ++dispcnt;
      var qp = dispcnt >= L * 4 / 5;
      out.push(boundary);
      out.push("Content-Location: " + (opts.root || "file:///C:/SheetJS/") + fp);
      out.push("Content-Transfer-Encoding: " + (qp ? "quoted-printable" : "base64"));
      out.push("Content-Type: " + get_content_type(fi, fp));
      out.push("");
      out.push(qp ? write_quoted_printable(cstr) : write_base64_76(cstr));
    }
    out.push(boundary + "--\r\n");
    return out.join("\r\n");
  }
  function cfb_new(opts) {
    var o = {};
    init_cfb(o, opts);
    return o;
  }
  function cfb_add(cfb, name, content, opts) {
    var unsafe = opts && opts.unsafe;
    if (!unsafe) init_cfb(cfb);
    var file = !unsafe && CFB.find(cfb, name);
    if (!file) {
      var fpath = cfb.FullPaths[0];
      if (name.slice(0, fpath.length) == fpath) fpath = name;
      else {
        if (fpath.slice(-1) != "/") fpath += "/";
        fpath = (fpath + name).replace("//", "/");
      }
      file = {
        name: filename(name),
        type: 2
      };
      cfb.FileIndex.push(file);
      cfb.FullPaths.push(fpath);
      if (!unsafe) CFB.utils.cfb_gc(cfb);
    }
    file.content = content;
    file.size = content ? content.length : 0;
    if (opts) {
      if (opts.CLSID) file.clsid = opts.CLSID;
      if (opts.mt) file.mt = opts.mt;
      if (opts.ct) file.ct = opts.ct;
    }
    return file;
  }
  function cfb_del(cfb, name) {
    init_cfb(cfb);
    var file = CFB.find(cfb, name);
    if (file) {
      for (var j = 0; j < cfb.FileIndex.length; ++j) if (cfb.FileIndex[j] == file) {
        cfb.FileIndex.splice(j, 1);
        cfb.FullPaths.splice(j, 1);
        return true;
      }
    }
    return false;
  }
  function cfb_mov(cfb, old_name, new_name) {
    init_cfb(cfb);
    var file = CFB.find(cfb, old_name);
    if (file) {
      for (var j = 0; j < cfb.FileIndex.length; ++j) if (cfb.FileIndex[j] == file) {
        cfb.FileIndex[j].name = filename(new_name);
        cfb.FullPaths[j] = new_name;
        return true;
      }
    }
    return false;
  }
  function cfb_gc(cfb) {
    rebuild_cfb(cfb, true);
  }
  exports.find = find;
  exports.read = read;
  exports.parse = parse;
  exports.write = write;
  exports.writeFile = write_file;
  exports.utils = {
    cfb_new,
    cfb_add,
    cfb_del,
    cfb_mov,
    cfb_gc,
    ReadShift,
    CheckField,
    prep_blob,
    bconcat,
    use_zlib,
    _deflateRaw: _deflate,
    _inflateRaw: _inflate,
    consts
  };
  return exports;
}();
var _fs = void 0;
function blobify(data) {
  if (typeof data === "string") return s2ab(data);
  if (Array.isArray(data)) return a2u(data);
  return data;
}
function write_dl(fname, payload, enc) {
  if (typeof _fs !== "undefined" && _fs.writeFileSync) return enc ? _fs.writeFileSync(fname, payload, enc) : _fs.writeFileSync(fname, payload);
  if (typeof Deno !== "undefined") {
    if (enc && typeof payload == "string") switch (enc) {
      case "utf8":
        payload = new TextEncoder(enc).encode(payload);
        break;
      case "binary":
        payload = s2ab(payload);
        break;
      default:
        throw new Error("Unsupported encoding " + enc);
    }
    return Deno.writeFileSync(fname, payload);
  }
  var data = enc == "utf8" ? utf8write(payload) : payload;
  if (typeof IE_SaveFile !== "undefined") return IE_SaveFile(data, fname);
  if (typeof Blob !== "undefined") {
    var blob = new Blob([blobify(data)], {
      type: "application/octet-stream"
    });
    if (typeof navigator !== "undefined" && navigator.msSaveBlob) return navigator.msSaveBlob(blob, fname);
    if (typeof saveAs !== "undefined") return saveAs(blob, fname);
    if (typeof URL !== "undefined" && typeof document !== "undefined" && document.createElement && URL.createObjectURL) {
      var url = URL.createObjectURL(blob);
      if (typeof chrome === "object" && typeof (chrome.downloads || {}).download == "function") {
        if (URL.revokeObjectURL && typeof setTimeout !== "undefined") setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 6e4);
        return chrome.downloads.download({
          url,
          filename: fname,
          saveAs: true
        });
      }
      var a = document.createElement("a");
      if (a.download != null) {
        a.download = fname;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (URL.revokeObjectURL && typeof setTimeout !== "undefined") setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 6e4);
        return url;
      }
    }
  }
  if (typeof $ !== "undefined" && typeof File !== "undefined" && typeof Folder !== "undefined") try {
    var out = File(fname);
    out.open("w");
    out.encoding = "binary";
    if (Array.isArray(payload)) payload = a2s(payload);
    out.write(payload);
    out.close();
    return payload;
  } catch (e) {
    if (!e.message || !e.message.match(/onstruct/)) throw e;
  }
  throw new Error("cannot save file " + fname);
}
function keys(o) {
  var ks = Object.keys(o), o2 = [];
  for (var i = 0; i < ks.length; ++i) if (Object.prototype.hasOwnProperty.call(o, ks[i])) o2.push(ks[i]);
  return o2;
}
function evert_key(obj, key) {
  var o = [], K = keys(obj);
  for (var i = 0; i !== K.length; ++i) if (o[obj[K[i]][key]] == null) o[obj[K[i]][key]] = K[i];
  return o;
}
function evert(obj) {
  var o = [], K = keys(obj);
  for (var i = 0; i !== K.length; ++i) o[obj[K[i]]] = K[i];
  return o;
}
function evert_num(obj) {
  var o = [], K = keys(obj);
  for (var i = 0; i !== K.length; ++i) o[obj[K[i]]] = parseInt(K[i], 10);
  return o;
}
function evert_arr(obj) {
  var o = [], K = keys(obj);
  for (var i = 0; i !== K.length; ++i) {
    if (o[obj[K[i]]] == null) o[obj[K[i]]] = [];
    o[obj[K[i]]].push(K[i]);
  }
  return o;
}
var basedate = /* @__PURE__ */ new Date(1899, 11, 30, 0, 0, 0);
function datenum(v, date1904) {
  var epoch = /* @__PURE__ */ v.getTime();
  if (date1904) epoch -= 1462 * 24 * 60 * 60 * 1e3;
  var dnthresh2 = /* @__PURE__ */ basedate.getTime() + (/* @__PURE__ */ v.getTimezoneOffset() - /* @__PURE__ */ basedate.getTimezoneOffset()) * 6e4;
  return (epoch - dnthresh2) / (24 * 60 * 60 * 1e3);
}
var refdate = /* @__PURE__ */ new Date();
var dnthresh = /* @__PURE__ */ basedate.getTime() + (/* @__PURE__ */ refdate.getTimezoneOffset() - /* @__PURE__ */ basedate.getTimezoneOffset()) * 6e4;
var refoffset = /* @__PURE__ */ refdate.getTimezoneOffset();
function numdate(v) {
  var out = /* @__PURE__ */ new Date();
  out.setTime(v * 24 * 60 * 60 * 1e3 + dnthresh);
  if (out.getTimezoneOffset() !== refoffset) {
    out.setTime(out.getTime() + (out.getTimezoneOffset() - refoffset) * 6e4);
  }
  return out;
}
var good_pd_date_1 = /* @__PURE__ */ new Date("2017-02-19T19:06:09.000Z");
var good_pd_date = /* @__PURE__ */ isNaN(/* @__PURE__ */ good_pd_date_1.getFullYear()) ? /* @__PURE__ */ new Date("2/19/17") : good_pd_date_1;
var good_pd = /* @__PURE__ */ good_pd_date.getFullYear() == 2017;
function parseDate(str, fixdate) {
  var d = new Date(str);
  if (good_pd) {
    if (fixdate > 0) d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1e3);
    else if (fixdate < 0) d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1e3);
    return d;
  }
  if (str instanceof Date) return str;
  if (good_pd_date.getFullYear() == 1917 && !isNaN(d.getFullYear())) {
    var s = d.getFullYear();
    if (str.indexOf("" + s) > -1) return d;
    d.setFullYear(d.getFullYear() + 100);
    return d;
  }
  var n = str.match(/\d+/g) || ["2017", "2", "19", "0", "0", "0"];
  var out = new Date(+n[0], +n[1] - 1, +n[2], +n[3] || 0, +n[4] || 0, +n[5] || 0);
  if (str.indexOf("Z") > -1) out = new Date(out.getTime() - out.getTimezoneOffset() * 60 * 1e3);
  return out;
}
function cc2str(arr, debomit) {
  if (has_buf && Buffer.isBuffer(arr)) {
    if (debomit) {
      if (arr[0] == 255 && arr[1] == 254) return utf8write(arr.slice(2).toString("utf16le"));
      if (arr[1] == 254 && arr[2] == 255) return utf8write(utf16beread(arr.slice(2).toString("binary")));
    }
    return arr.toString("binary");
  }
  if (typeof TextDecoder !== "undefined") try {
    if (debomit) {
      if (arr[0] == 255 && arr[1] == 254) return utf8write(new TextDecoder("utf-16le").decode(arr.slice(2)));
      if (arr[0] == 254 && arr[1] == 255) return utf8write(new TextDecoder("utf-16be").decode(arr.slice(2)));
    }
    var rev = {
      "\u20AC": "\x80",
      "\u201A": "\x82",
      "\u0192": "\x83",
      "\u201E": "\x84",
      "\u2026": "\x85",
      "\u2020": "\x86",
      "\u2021": "\x87",
      "\u02C6": "\x88",
      "\u2030": "\x89",
      "\u0160": "\x8A",
      "\u2039": "\x8B",
      "\u0152": "\x8C",
      "\u017D": "\x8E",
      "\u2018": "\x91",
      "\u2019": "\x92",
      "\u201C": "\x93",
      "\u201D": "\x94",
      "\u2022": "\x95",
      "\u2013": "\x96",
      "\u2014": "\x97",
      "\u02DC": "\x98",
      "\u2122": "\x99",
      "\u0161": "\x9A",
      "\u203A": "\x9B",
      "\u0153": "\x9C",
      "\u017E": "\x9E",
      "\u0178": "\x9F"
    };
    if (Array.isArray(arr)) arr = new Uint8Array(arr);
    return new TextDecoder("latin1").decode(arr).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(c) {
      return rev[c] || c;
    });
  } catch (e) {
  }
  var o = [];
  for (var i = 0; i != arr.length; ++i) o.push(String.fromCharCode(arr[i]));
  return o.join("");
}
function dup(o) {
  if (typeof JSON != "undefined" && !Array.isArray(o)) return JSON.parse(JSON.stringify(o));
  if (typeof o != "object" || o == null) return o;
  if (o instanceof Date) return new Date(o.getTime());
  var out = {};
  for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = dup(o[k]);
  return out;
}
function fill(c, l) {
  var o = "";
  while (o.length < l) o += c;
  return o;
}
function fuzzynum(s) {
  var v = Number(s);
  if (!isNaN(v)) return isFinite(v) ? v : NaN;
  if (!/\d/.test(s)) return v;
  var wt = 1;
  var ss = s.replace(/([\d]),([\d])/g, "$1$2").replace(/[$]/g, "").replace(/[%]/g, function() {
    wt *= 100;
    return "";
  });
  if (!isNaN(v = Number(ss))) return v / wt;
  ss = ss.replace(/[(](.*)[)]/, function($$, $1) {
    wt = -wt;
    return $1;
  });
  if (!isNaN(v = Number(ss))) return v / wt;
  return v;
}
var lower_months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function fuzzydate(s) {
  var o = new Date(s), n = /* @__PURE__ */ new Date(NaN);
  var y = o.getYear(), m = o.getMonth(), d = o.getDate();
  if (isNaN(d)) return n;
  var lower = s.toLowerCase();
  if (lower.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
    lower = lower.replace(/[^a-z]/g, "").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/, "");
    if (lower.length > 3 && lower_months.indexOf(lower) == -1) return n;
  } else if (lower.match(/[a-z]/)) return n;
  if (y < 0 || y > 8099) return n;
  if ((m > 0 || d > 1) && y != 101) return o;
  if (s.match(/[^-0-9:,\/\\]/)) return n;
  return o;
}
function zip_add_file(zip, path, content) {
  if (zip.FullPaths) {
    if (typeof content == "string") {
      var res;
      if (has_buf) res = Buffer_from(content);
      else res = utf8decode(content);
      return CFB.utils.cfb_add(zip, path, res);
    }
    CFB.utils.cfb_add(zip, path, content);
  } else zip.file(path, content);
}
function zip_new() {
  return CFB.utils.cfb_new();
}
var XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
var encodings = {
  "&quot;": '"',
  "&apos;": "'",
  "&gt;": ">",
  "&lt;": "<",
  "&amp;": "&"
};
var rencoding = /* @__PURE__ */ evert(encodings);
var decregex = /[&<>'"]/g;
var charegex = /[\u0000-\u0008\u000b-\u001f]/g;
function escapexml(text) {
  var s = text + "";
  return s.replace(decregex, function(y) {
    return rencoding[y];
  }).replace(charegex, function(s2) {
    return "_x" + ("000" + s2.charCodeAt(0).toString(16)).slice(-4) + "_";
  });
}
function escapexmltag(text) {
  return escapexml(text).replace(/ /g, "_x0020_");
}
var htmlcharegex = /[\u0000-\u001f]/g;
function escapehtml(text) {
  var s = text + "";
  return s.replace(decregex, function(y) {
    return rencoding[y];
  }).replace(/\n/g, "<br/>").replace(htmlcharegex, function(s2) {
    return "&#x" + ("000" + s2.charCodeAt(0).toString(16)).slice(-4) + ";";
  });
}
function escapexlml(text) {
  var s = text + "";
  return s.replace(decregex, function(y) {
    return rencoding[y];
  }).replace(htmlcharegex, function(s2) {
    return "&#x" + s2.charCodeAt(0).toString(16).toUpperCase() + ";";
  });
}
function xlml_unfixstr(str) {
  return str.replace(/(\r\n|[\r\n])/g, "&#10;");
}
function parsexmlbool(value) {
  switch (value) {
    case 1:
    case true:
    case "1":
    case "true":
    case "TRUE":
      return true;
    default:
      return false;
  }
}
function utf8reada(orig) {
  var out = "", i = 0, c = 0, d = 0, e = 0, f = 0, w = 0;
  while (i < orig.length) {
    c = orig.charCodeAt(i++);
    if (c < 128) {
      out += String.fromCharCode(c);
      continue;
    }
    d = orig.charCodeAt(i++);
    if (c > 191 && c < 224) {
      f = (c & 31) << 6;
      f |= d & 63;
      out += String.fromCharCode(f);
      continue;
    }
    e = orig.charCodeAt(i++);
    if (c < 240) {
      out += String.fromCharCode((c & 15) << 12 | (d & 63) << 6 | e & 63);
      continue;
    }
    f = orig.charCodeAt(i++);
    w = ((c & 7) << 18 | (d & 63) << 12 | (e & 63) << 6 | f & 63) - 65536;
    out += String.fromCharCode(55296 + (w >>> 10 & 1023));
    out += String.fromCharCode(56320 + (w & 1023));
  }
  return out;
}
function utf8readb(data) {
  var out = new_raw_buf(2 * data.length), w, i, j = 1, k = 0, ww = 0, c;
  for (i = 0; i < data.length; i += j) {
    j = 1;
    if ((c = data.charCodeAt(i)) < 128) w = c;
    else if (c < 224) {
      w = (c & 31) * 64 + (data.charCodeAt(i + 1) & 63);
      j = 2;
    } else if (c < 240) {
      w = (c & 15) * 4096 + (data.charCodeAt(i + 1) & 63) * 64 + (data.charCodeAt(i + 2) & 63);
      j = 3;
    } else {
      j = 4;
      w = (c & 7) * 262144 + (data.charCodeAt(i + 1) & 63) * 4096 + (data.charCodeAt(i + 2) & 63) * 64 + (data.charCodeAt(i + 3) & 63);
      w -= 65536;
      ww = 55296 + (w >>> 10 & 1023);
      w = 56320 + (w & 1023);
    }
    if (ww !== 0) {
      out[k++] = ww & 255;
      out[k++] = ww >>> 8;
      ww = 0;
    }
    out[k++] = w % 256;
    out[k++] = w >>> 8;
  }
  return out.slice(0, k).toString("ucs2");
}
function utf8readc(data) {
  return Buffer_from(data, "binary").toString("utf8");
}
var utf8corpus = "foo bar baz\xE2\x98\x83\xF0\x9F\x8D\xA3";
var utf8read = has_buf && (/* @__PURE__ */ utf8readc(utf8corpus) == /* @__PURE__ */ utf8reada(utf8corpus) && utf8readc || /* @__PURE__ */ utf8readb(utf8corpus) == /* @__PURE__ */ utf8reada(utf8corpus) && utf8readb) || utf8reada;
var utf8write = has_buf ? function(data) {
  return Buffer_from(data, "utf8").toString("binary");
} : function(orig) {
  var out = [], i = 0, c = 0, d = 0;
  while (i < orig.length) {
    c = orig.charCodeAt(i++);
    switch (true) {
      case c < 128:
        out.push(String.fromCharCode(c));
        break;
      case c < 2048:
        out.push(String.fromCharCode(192 + (c >> 6)));
        out.push(String.fromCharCode(128 + (c & 63)));
        break;
      case (c >= 55296 && c < 57344):
        c -= 55296;
        d = orig.charCodeAt(i++) - 56320 + (c << 10);
        out.push(String.fromCharCode(240 + (d >> 18 & 7)));
        out.push(String.fromCharCode(144 + (d >> 12 & 63)));
        out.push(String.fromCharCode(128 + (d >> 6 & 63)));
        out.push(String.fromCharCode(128 + (d & 63)));
        break;
      default:
        out.push(String.fromCharCode(224 + (c >> 12)));
        out.push(String.fromCharCode(128 + (c >> 6 & 63)));
        out.push(String.fromCharCode(128 + (c & 63)));
    }
  }
  return out.join("");
};
var htmldecode = /* @__PURE__ */ function() {
  var entities = [["nbsp", " "], ["middot", "\xB7"], ["quot", '"'], ["apos", "'"], ["gt", ">"], ["lt", "<"], ["amp", "&"]].map(function(x) {
    return [new RegExp("&" + x[0] + ";", "ig"), x[1]];
  });
  return function htmldecode2(str) {
    var o = str.replace(/^[\t\n\r ]+/, "").replace(/[\t\n\r ]+$/, "").replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/[\t\n\r ]+/g, " ").replace(/<\s*[bB][rR]\s*\/?>/g, "\n").replace(/<[^>]*>/g, "");
    for (var i = 0; i < entities.length; ++i) o = o.replace(entities[i][0], entities[i][1]);
    return o;
  };
}();
var wtregex = /(^\s|\s$|\n)/;
function writetag(f, g) {
  return "<" + f + (g.match(wtregex) ? ' xml:space="preserve"' : "") + ">" + g + "</" + f + ">";
}
function wxt_helper(h) {
  return keys(h).map(function(k) {
    return " " + k + '="' + h[k] + '"';
  }).join("");
}
function writextag(f, g, h) {
  return "<" + f + (h != null ? wxt_helper(h) : "") + (g != null ? (g.match(wtregex) ? ' xml:space="preserve"' : "") + ">" + g + "</" + f : "/") + ">";
}
function write_w3cdtf(d, t) {
  try {
    return d.toISOString().replace(/\.\d*/, "");
  } catch (e) {
    if (t) throw e;
  }
  return "";
}
function write_vt(s, xlsx) {
  switch (typeof s) {
    case "string":
      var o = writextag("vt:lpwstr", escapexml(s));
      if (xlsx) o = o.replace(/&quot;/g, "_x0022_");
      return o;
    case "number":
      return writextag((s | 0) == s ? "vt:i4" : "vt:r8", escapexml(String(s)));
    case "boolean":
      return writextag("vt:bool", s ? "true" : "false");
  }
  if (s instanceof Date) return writextag("vt:filetime", write_w3cdtf(s));
  throw new Error("Unable to serialize " + s);
}
var XMLNS = {
  CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
  CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
  EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
  CT: "http://schemas.openxmlformats.org/package/2006/content-types",
  RELS: "http://schemas.openxmlformats.org/package/2006/relationships",
  TCMNT: "http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments",
  "dc": "http://purl.org/dc/elements/1.1/",
  "dcterms": "http://purl.org/dc/terms/",
  "dcmitype": "http://purl.org/dc/dcmitype/",
  "mx": "http://schemas.microsoft.com/office/mac/excel/2008/main",
  "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  "sjs": "http://schemas.openxmlformats.org/package/2006/sheetjs/core-properties",
  "vt": "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
  "xsi": "http://www.w3.org/2001/XMLSchema-instance",
  "xsd": "http://www.w3.org/2001/XMLSchema"
};
var XMLNS_main = ["http://schemas.openxmlformats.org/spreadsheetml/2006/main", "http://purl.oclc.org/ooxml/spreadsheetml/main", "http://schemas.microsoft.com/office/excel/2006/main", "http://schemas.microsoft.com/office/excel/2006/2"];
var XLMLNS = {
  "o": "urn:schemas-microsoft-com:office:office",
  "x": "urn:schemas-microsoft-com:office:excel",
  "ss": "urn:schemas-microsoft-com:office:spreadsheet",
  "dt": "uuid:C2F41010-65B3-11d1-A29F-00AA00C14882",
  "mv": "http://macVmlSchemaUri",
  "v": "urn:schemas-microsoft-com:vml",
  "html": "http://www.w3.org/TR/REC-html40"
};
function read_double_le(b, idx) {
  var s = 1 - 2 * (b[idx + 7] >>> 7);
  var e = ((b[idx + 7] & 127) << 4) + (b[idx + 6] >>> 4 & 15);
  var m = b[idx + 6] & 15;
  for (var i = 5; i >= 0; --i) m = m * 256 + b[idx + i];
  if (e == 2047) return m == 0 ? s * Infinity : NaN;
  if (e == 0) e = -1022;
  else {
    e -= 1023;
    m += Math.pow(2, 52);
  }
  return s * Math.pow(2, e - 52) * m;
}
function write_double_le(b, v, idx) {
  var bs = (v < 0 || 1 / v == -Infinity ? 1 : 0) << 7, e = 0, m = 0;
  var av = bs ? -v : v;
  if (!isFinite(av)) {
    e = 2047;
    m = isNaN(v) ? 26985 : 0;
  } else if (av == 0) e = m = 0;
  else {
    e = Math.floor(Math.log(av) / Math.LN2);
    m = av * Math.pow(2, 52 - e);
    if (e <= -1023 && (!isFinite(m) || m < Math.pow(2, 52))) {
      e = -1022;
    } else {
      m -= Math.pow(2, 52);
      e += 1023;
    }
  }
  for (var i = 0; i <= 5; ++i, m /= 256) b[idx + i] = m & 255;
  b[idx + 6] = (e & 15) << 4 | m & 15;
  b[idx + 7] = e >> 4 | bs;
}
var ___toBuffer = function(bufs) {
  var x = [], w = 10240;
  for (var i = 0; i < bufs[0].length; ++i) if (bufs[0][i]) for (var j = 0, L = bufs[0][i].length; j < L; j += w) x.push.apply(x, bufs[0][i].slice(j, j + w));
  return x;
};
var __toBuffer = has_buf ? function(bufs) {
  return bufs[0].length > 0 && Buffer.isBuffer(bufs[0][0]) ? Buffer.concat(bufs[0].map(function(x) {
    return Buffer.isBuffer(x) ? x : Buffer_from(x);
  })) : ___toBuffer(bufs);
} : ___toBuffer;
var ___utf16le = function(b, s, e) {
  var ss = [];
  for (var i = s; i < e; i += 2) ss.push(String.fromCharCode(__readUInt16LE(b, i)));
  return ss.join("").replace(chr0, "");
};
var __utf16le = has_buf ? function(b, s, e) {
  if (!Buffer.isBuffer(b)) return ___utf16le(b, s, e);
  return b.toString("utf16le", s, e).replace(chr0, "");
} : ___utf16le;
var ___hexlify = function(b, s, l) {
  var ss = [];
  for (var i = s; i < s + l; ++i) ss.push(("0" + b[i].toString(16)).slice(-2));
  return ss.join("");
};
var __hexlify = has_buf ? function(b, s, l) {
  return Buffer.isBuffer(b) ? b.toString("hex", s, s + l) : ___hexlify(b, s, l);
} : ___hexlify;
var ___utf8 = function(b, s, e) {
  var ss = [];
  for (var i = s; i < e; i++) ss.push(String.fromCharCode(__readUInt8(b, i)));
  return ss.join("");
};
var __utf8 = has_buf ? function utf8_b(b, s, e) {
  return Buffer.isBuffer(b) ? b.toString("utf8", s, e) : ___utf8(b, s, e);
} : ___utf8;
var ___lpstr = function(b, i) {
  var len = __readUInt32LE(b, i);
  return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
};
var __lpstr = ___lpstr;
var ___cpstr = function(b, i) {
  var len = __readUInt32LE(b, i);
  return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
};
var __cpstr = ___cpstr;
var ___lpwstr = function(b, i) {
  var len = 2 * __readUInt32LE(b, i);
  return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
};
var __lpwstr = ___lpwstr;
var ___lpp4 = function lpp4_(b, i) {
  var len = __readUInt32LE(b, i);
  return len > 0 ? __utf16le(b, i + 4, i + 4 + len) : "";
};
var __lpp4 = ___lpp4;
var ___8lpp4 = function(b, i) {
  var len = __readUInt32LE(b, i);
  return len > 0 ? __utf8(b, i + 4, i + 4 + len) : "";
};
var __8lpp4 = ___8lpp4;
var ___double = function(b, idx) {
  return read_double_le(b, idx);
};
var __double = ___double;
var is_buf = function is_buf_a(a) {
  return Array.isArray(a) || typeof Uint8Array !== "undefined" && a instanceof Uint8Array;
};
if (has_buf) {
  __lpstr = function lpstr_b(b, i) {
    if (!Buffer.isBuffer(b)) return ___lpstr(b, i);
    var len = b.readUInt32LE(i);
    return len > 0 ? b.toString("utf8", i + 4, i + 4 + len - 1) : "";
  };
  __cpstr = function cpstr_b(b, i) {
    if (!Buffer.isBuffer(b)) return ___cpstr(b, i);
    var len = b.readUInt32LE(i);
    return len > 0 ? b.toString("utf8", i + 4, i + 4 + len - 1) : "";
  };
  __lpwstr = function lpwstr_b(b, i) {
    if (!Buffer.isBuffer(b)) return ___lpwstr(b, i);
    var len = 2 * b.readUInt32LE(i);
    return b.toString("utf16le", i + 4, i + 4 + len - 1);
  };
  __lpp4 = function lpp4_b(b, i) {
    if (!Buffer.isBuffer(b)) return ___lpp4(b, i);
    var len = b.readUInt32LE(i);
    return b.toString("utf16le", i + 4, i + 4 + len);
  };
  __8lpp4 = function lpp4_8b(b, i) {
    if (!Buffer.isBuffer(b)) return ___8lpp4(b, i);
    var len = b.readUInt32LE(i);
    return b.toString("utf8", i + 4, i + 4 + len);
  };
  __double = function double_(b, i) {
    if (Buffer.isBuffer(b)) return b.readDoubleLE(i);
    return ___double(b, i);
  };
  is_buf = function is_buf_b(a) {
    return Buffer.isBuffer(a) || Array.isArray(a) || typeof Uint8Array !== "undefined" && a instanceof Uint8Array;
  };
}
function cpdoit() {
  __utf16le = function(b, s, e) {
    return $cptable.utils.decode(1200, b.slice(s, e)).replace(chr0, "");
  };
  __utf8 = function(b, s, e) {
    return $cptable.utils.decode(65001, b.slice(s, e));
  };
  __lpstr = function(b, i) {
    var len = __readUInt32LE(b, i);
    return len > 0 ? $cptable.utils.decode(current_ansi, b.slice(i + 4, i + 4 + len - 1)) : "";
  };
  __cpstr = function(b, i) {
    var len = __readUInt32LE(b, i);
    return len > 0 ? $cptable.utils.decode(current_codepage, b.slice(i + 4, i + 4 + len - 1)) : "";
  };
  __lpwstr = function(b, i) {
    var len = 2 * __readUInt32LE(b, i);
    return len > 0 ? $cptable.utils.decode(1200, b.slice(i + 4, i + 4 + len - 1)) : "";
  };
  __lpp4 = function(b, i) {
    var len = __readUInt32LE(b, i);
    return len > 0 ? $cptable.utils.decode(1200, b.slice(i + 4, i + 4 + len)) : "";
  };
  __8lpp4 = function(b, i) {
    var len = __readUInt32LE(b, i);
    return len > 0 ? $cptable.utils.decode(65001, b.slice(i + 4, i + 4 + len)) : "";
  };
}
if (typeof $cptable !== "undefined") cpdoit();
var __readUInt8 = function(b, idx) {
  return b[idx];
};
var __readUInt16LE = function(b, idx) {
  return b[idx + 1] * (1 << 8) + b[idx];
};
var __readInt16LE = function(b, idx) {
  var u = b[idx + 1] * (1 << 8) + b[idx];
  return u < 32768 ? u : (65535 - u + 1) * -1;
};
var __readUInt32LE = function(b, idx) {
  return b[idx + 3] * (1 << 24) + (b[idx + 2] << 16) + (b[idx + 1] << 8) + b[idx];
};
var __readInt32LE = function(b, idx) {
  return b[idx + 3] << 24 | b[idx + 2] << 16 | b[idx + 1] << 8 | b[idx];
};
var __readInt32BE = function(b, idx) {
  return b[idx] << 24 | b[idx + 1] << 16 | b[idx + 2] << 8 | b[idx + 3];
};
function ReadShift(size, t) {
  var o = "", oI, oR, oo = [], w, vv, i, loc;
  switch (t) {
    case "dbcs":
      loc = this.l;
      if (has_buf && Buffer.isBuffer(this)) o = this.slice(this.l, this.l + 2 * size).toString("utf16le");
      else for (i = 0; i < size; ++i) {
        o += String.fromCharCode(__readUInt16LE(this, loc));
        loc += 2;
      }
      size *= 2;
      break;
    case "utf8":
      o = __utf8(this, this.l, this.l + size);
      break;
    case "utf16le":
      size *= 2;
      o = __utf16le(this, this.l, this.l + size);
      break;
    case "wstr":
      if (typeof $cptable !== "undefined") o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l + 2 * size));
      else return ReadShift.call(this, size, "dbcs");
      size = 2 * size;
      break;
    case "lpstr-ansi":
      o = __lpstr(this, this.l);
      size = 4 + __readUInt32LE(this, this.l);
      break;
    case "lpstr-cp":
      o = __cpstr(this, this.l);
      size = 4 + __readUInt32LE(this, this.l);
      break;
    case "lpwstr":
      o = __lpwstr(this, this.l);
      size = 4 + 2 * __readUInt32LE(this, this.l);
      break;
    case "lpp4":
      size = 4 + __readUInt32LE(this, this.l);
      o = __lpp4(this, this.l);
      if (size & 2) size += 2;
      break;
    case "8lpp4":
      size = 4 + __readUInt32LE(this, this.l);
      o = __8lpp4(this, this.l);
      if (size & 3) size += 4 - (size & 3);
      break;
    case "cstr":
      size = 0;
      o = "";
      while ((w = __readUInt8(this, this.l + size++)) !== 0) oo.push(_getchar(w));
      o = oo.join("");
      break;
    case "_wstr":
      size = 0;
      o = "";
      while ((w = __readUInt16LE(this, this.l + size)) !== 0) {
        oo.push(_getchar(w));
        size += 2;
      }
      size += 2;
      o = oo.join("");
      break;
    case "dbcs-cont":
      o = "";
      loc = this.l;
      for (i = 0; i < size; ++i) {
        if (this.lens && this.lens.indexOf(loc) !== -1) {
          w = __readUInt8(this, loc);
          this.l = loc + 1;
          vv = ReadShift.call(this, size - i, w ? "dbcs-cont" : "sbcs-cont");
          return oo.join("") + vv;
        }
        oo.push(_getchar(__readUInt16LE(this, loc)));
        loc += 2;
      }
      o = oo.join("");
      size *= 2;
      break;
    case "cpstr":
      if (typeof $cptable !== "undefined") {
        o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l + size));
        break;
      }
    case "sbcs-cont":
      o = "";
      loc = this.l;
      for (i = 0; i != size; ++i) {
        if (this.lens && this.lens.indexOf(loc) !== -1) {
          w = __readUInt8(this, loc);
          this.l = loc + 1;
          vv = ReadShift.call(this, size - i, w ? "dbcs-cont" : "sbcs-cont");
          return oo.join("") + vv;
        }
        oo.push(_getchar(__readUInt8(this, loc)));
        loc += 1;
      }
      o = oo.join("");
      break;
    default:
      switch (size) {
        case 1:
          oI = __readUInt8(this, this.l);
          this.l++;
          return oI;
        case 2:
          oI = (t === "i" ? __readInt16LE : __readUInt16LE)(this, this.l);
          this.l += 2;
          return oI;
        case 4:
        case -4:
          if (t === "i" || (this[this.l + 3] & 128) === 0) {
            oI = (size > 0 ? __readInt32LE : __readInt32BE)(this, this.l);
            this.l += 4;
            return oI;
          } else {
            oR = __readUInt32LE(this, this.l);
            this.l += 4;
          }
          return oR;
        case 8:
        case -8:
          if (t === "f") {
            if (size == 8) oR = __double(this, this.l);
            else oR = __double([this[this.l + 7], this[this.l + 6], this[this.l + 5], this[this.l + 4], this[this.l + 3], this[this.l + 2], this[this.l + 1], this[this.l + 0]], 0);
            this.l += 8;
            return oR;
          } else size = 8;
        case 16:
          o = __hexlify(this, this.l, size);
          break;
      }
  }
  this.l += size;
  return o;
}
var __writeUInt32LE = function(b, val, idx) {
  b[idx] = val & 255;
  b[idx + 1] = val >>> 8 & 255;
  b[idx + 2] = val >>> 16 & 255;
  b[idx + 3] = val >>> 24 & 255;
};
var __writeInt32LE = function(b, val, idx) {
  b[idx] = val & 255;
  b[idx + 1] = val >> 8 & 255;
  b[idx + 2] = val >> 16 & 255;
  b[idx + 3] = val >> 24 & 255;
};
var __writeUInt16LE = function(b, val, idx) {
  b[idx] = val & 255;
  b[idx + 1] = val >>> 8 & 255;
};
function WriteShift(t, val, f) {
  var size = 0, i = 0;
  if (f === "dbcs") {
    for (i = 0; i != val.length; ++i) __writeUInt16LE(this, val.charCodeAt(i), this.l + 2 * i);
    size = 2 * val.length;
  } else if (f === "sbcs") {
    if (typeof $cptable !== "undefined" && current_ansi == 874) {
      for (i = 0; i != val.length; ++i) {
        var cppayload = $cptable.utils.encode(current_ansi, val.charAt(i));
        this[this.l + i] = cppayload[0];
      }
    } else {
      val = val.replace(/[^\x00-\x7F]/g, "_");
      for (i = 0; i != val.length; ++i) this[this.l + i] = val.charCodeAt(i) & 255;
    }
    size = val.length;
  } else if (f === "hex") {
    for (; i < t; ++i) {
      this[this.l++] = parseInt(val.slice(2 * i, 2 * i + 2), 16) || 0;
    }
    return this;
  } else if (f === "utf16le") {
    var end = Math.min(this.l + t, this.length);
    for (i = 0; i < Math.min(val.length, t); ++i) {
      var cc = val.charCodeAt(i);
      this[this.l++] = cc & 255;
      this[this.l++] = cc >> 8;
    }
    while (this.l < end) this[this.l++] = 0;
    return this;
  } else switch (t) {
    case 1:
      size = 1;
      this[this.l] = val & 255;
      break;
    case 2:
      size = 2;
      this[this.l] = val & 255;
      val >>>= 8;
      this[this.l + 1] = val & 255;
      break;
    case 3:
      size = 3;
      this[this.l] = val & 255;
      val >>>= 8;
      this[this.l + 1] = val & 255;
      val >>>= 8;
      this[this.l + 2] = val & 255;
      break;
    case 4:
      size = 4;
      __writeUInt32LE(this, val, this.l);
      break;
    case 8:
      size = 8;
      if (f === "f") {
        write_double_le(this, val, this.l);
        break;
      }
    case 16:
      break;
    case -4:
      size = 4;
      __writeInt32LE(this, val, this.l);
      break;
  }
  this.l += size;
  return this;
}
function CheckField(hexstr, fld) {
  var m = __hexlify(this, this.l, hexstr.length >> 1);
  if (m !== hexstr) throw new Error(fld + "Expected " + hexstr + " saw " + m);
  this.l += hexstr.length >> 1;
}
function prep_blob(blob, pos) {
  blob.l = pos;
  blob.read_shift = /*::(*/
  ReadShift;
  blob.chk = CheckField;
  blob.write_shift = WriteShift;
}
function parsenoop(blob, length) {
  blob.l += length;
}
function new_buf(sz) {
  var o = new_raw_buf(sz);
  prep_blob(o, 0);
  return o;
}
function buf_array() {
  var bufs = [], blksz = has_buf ? 256 : 2048;
  var newblk = function ba_newblk(sz) {
    var o = new_buf(sz);
    prep_blob(o, 0);
    return o;
  };
  var curbuf = newblk(blksz);
  var endbuf = function ba_endbuf() {
    if (!curbuf) return;
    if (curbuf.length > curbuf.l) {
      curbuf = curbuf.slice(0, curbuf.l);
      curbuf.l = curbuf.length;
    }
    if (curbuf.length > 0) bufs.push(curbuf);
    curbuf = null;
  };
  var next = function ba_next(sz) {
    if (curbuf && sz < curbuf.length - curbuf.l) return curbuf;
    endbuf();
    return curbuf = newblk(Math.max(sz + 1, blksz));
  };
  var end = function ba_end() {
    endbuf();
    return bconcat(bufs);
  };
  var push = function ba_push(buf) {
    endbuf();
    curbuf = buf;
    if (curbuf.l == null) curbuf.l = curbuf.length;
    next(blksz);
  };
  return {
    next,
    push,
    end,
    _bufs: bufs
  };
}
function write_record(ba, type, payload, length) {
  var t = +type, l;
  if (isNaN(t)) return;
  if (!length) length = XLSBRecordEnum[t].p || (payload || []).length || 0;
  l = 1 + (t >= 128 ? 1 : 0) + 1;
  if (length >= 128) ++l;
  if (length >= 16384) ++l;
  if (length >= 2097152) ++l;
  var o = ba.next(l);
  if (t <= 127) o.write_shift(1, t);
  else {
    o.write_shift(1, (t & 127) + 128);
    o.write_shift(1, t >> 7);
  }
  for (var i = 0; i != 4; ++i) {
    if (length >= 128) {
      o.write_shift(1, (length & 127) + 128);
      length >>= 7;
    } else {
      o.write_shift(1, length);
      break;
    }
  }
  if (
    /*:: length != null &&*/
    length > 0 && is_buf(payload)
  ) ba.push(payload);
}
function shift_cell_xls(cell, tgt, opts) {
  var out = dup(cell);
  if (tgt.s) {
    if (out.cRel) out.c += tgt.s.c;
    if (out.rRel) out.r += tgt.s.r;
  } else {
    if (out.cRel) out.c += tgt.c;
    if (out.rRel) out.r += tgt.r;
  }
  if (!opts || opts.biff < 12) {
    while (out.c >= 256) out.c -= 256;
    while (out.r >= 65536) out.r -= 65536;
  }
  return out;
}
function shift_range_xls(cell, range, opts) {
  var out = dup(cell);
  out.s = shift_cell_xls(out.s, range.s, opts);
  out.e = shift_cell_xls(out.e, range.s, opts);
  return out;
}
function encode_cell_xls(c, biff) {
  if (c.cRel && c.c < 0) {
    c = dup(c);
    while (c.c < 0) c.c += biff > 8 ? 16384 : 256;
  }
  if (c.rRel && c.r < 0) {
    c = dup(c);
    while (c.r < 0) c.r += biff > 8 ? 1048576 : biff > 5 ? 65536 : 16384;
  }
  var s = encode_cell(c);
  if (!c.cRel && c.cRel != null) s = fix_col(s);
  if (!c.rRel && c.rRel != null) s = fix_row(s);
  return s;
}
function encode_range_xls(r, opts) {
  if (r.s.r == 0 && !r.s.rRel) {
    if (r.e.r == (opts.biff >= 12 ? 1048575 : opts.biff >= 8 ? 65536 : 16384) && !r.e.rRel) {
      return (r.s.cRel ? "" : "$") + encode_col(r.s.c) + ":" + (r.e.cRel ? "" : "$") + encode_col(r.e.c);
    }
  }
  if (r.s.c == 0 && !r.s.cRel) {
    if (r.e.c == (opts.biff >= 12 ? 16383 : 255) && !r.e.cRel) {
      return (r.s.rRel ? "" : "$") + encode_row(r.s.r) + ":" + (r.e.rRel ? "" : "$") + encode_row(r.e.r);
    }
  }
  return encode_cell_xls(r.s, opts.biff) + ":" + encode_cell_xls(r.e, opts.biff);
}
function decode_row(rowstr) {
  return parseInt(unfix_row(rowstr), 10) - 1;
}
function encode_row(row) {
  return "" + (row + 1);
}
function fix_row(cstr) {
  return cstr.replace(/([A-Z]|^)(\d+)$/, "$1$$$2");
}
function unfix_row(cstr) {
  return cstr.replace(/\$(\d+)$/, "$1");
}
function decode_col(colstr) {
  var c = unfix_col(colstr), d = 0, i = 0;
  for (; i !== c.length; ++i) d = 26 * d + c.charCodeAt(i) - 64;
  return d - 1;
}
function encode_col(col) {
  if (col < 0) throw new Error("invalid column " + col);
  var s = "";
  for (++col; col; col = Math.floor((col - 1) / 26)) s = String.fromCharCode((col - 1) % 26 + 65) + s;
  return s;
}
function fix_col(cstr) {
  return cstr.replace(/^([A-Z])/, "$$$1");
}
function unfix_col(cstr) {
  return cstr.replace(/^\$([A-Z])/, "$1");
}
function split_cell(cstr) {
  return cstr.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",");
}
function decode_cell(cstr) {
  var R = 0, C = 0;
  for (var i = 0; i < cstr.length; ++i) {
    var cc = cstr.charCodeAt(i);
    if (cc >= 48 && cc <= 57) R = 10 * R + (cc - 48);
    else if (cc >= 65 && cc <= 90) C = 26 * C + (cc - 64);
  }
  return {
    c: C - 1,
    r: R - 1
  };
}
function encode_cell(cell) {
  var col = cell.c + 1;
  var s = "";
  for (; col; col = (col - 1) / 26 | 0) s = String.fromCharCode((col - 1) % 26 + 65) + s;
  return s + (cell.r + 1);
}
function decode_range(range) {
  var idx = range.indexOf(":");
  if (idx == -1) return {
    s: decode_cell(range),
    e: decode_cell(range)
  };
  return {
    s: decode_cell(range.slice(0, idx)),
    e: decode_cell(range.slice(idx + 1))
  };
}
function encode_range(cs, ce) {
  if (typeof ce === "undefined" || typeof ce === "number") {
    return encode_range(cs.s, cs.e);
  }
  if (typeof cs !== "string") cs = encode_cell(
    cs
    /*:any*/
  );
  if (typeof ce !== "string") ce = encode_cell(
    ce
    /*:any*/
  );
  return cs == ce ? cs : cs + ":" + ce;
}
function safe_decode_range(range) {
  var o = {
    s: {
      c: 0,
      r: 0
    },
    e: {
      c: 0,
      r: 0
    }
  };
  var idx = 0, i = 0, cc = 0;
  var len = range.length;
  for (idx = 0; i < len; ++i) {
    if ((cc = range.charCodeAt(i) - 64) < 1 || cc > 26) break;
    idx = 26 * idx + cc;
  }
  o.s.c = --idx;
  for (idx = 0; i < len; ++i) {
    if ((cc = range.charCodeAt(i) - 48) < 0 || cc > 9) break;
    idx = 10 * idx + cc;
  }
  o.s.r = --idx;
  if (i === len || cc != 10) {
    o.e.c = o.s.c;
    o.e.r = o.s.r;
    return o;
  }
  ++i;
  for (idx = 0; i != len; ++i) {
    if ((cc = range.charCodeAt(i) - 64) < 1 || cc > 26) break;
    idx = 26 * idx + cc;
  }
  o.e.c = --idx;
  for (idx = 0; i != len; ++i) {
    if ((cc = range.charCodeAt(i) - 48) < 0 || cc > 9) break;
    idx = 10 * idx + cc;
  }
  o.e.r = --idx;
  return o;
}
function safe_format_cell(cell, v) {
  var q = cell.t == "d" && v instanceof Date;
  if (cell.z != null) try {
    return cell.w = SSF_format(cell.z, q ? datenum(v) : v);
  } catch (e) {
  }
  try {
    return cell.w = SSF_format((cell.XF || {}).numFmtId || (q ? 14 : 0), q ? datenum(v) : v);
  } catch (e) {
    return "" + v;
  }
}
function format_cell(cell, v, o) {
  if (cell == null || cell.t == null || cell.t == "z") return "";
  if (cell.w !== void 0) return cell.w;
  if (cell.t == "d" && !cell.z && o && o.dateNF) cell.z = o.dateNF;
  if (cell.t == "e") return BErr[cell.v] || cell.v;
  if (v == void 0) return safe_format_cell(cell, cell.v);
  return safe_format_cell(cell, v);
}
function sheet_to_workbook(sheet, opts) {
  var n = opts && opts.sheet ? opts.sheet : "Sheet1";
  var sheets = {};
  sheets[n] = sheet;
  return {
    SheetNames: [n],
    Sheets: sheets
  };
}
function sheet_add_aoa(_ws, data, opts) {
  var o = opts || {};
  var dense = _ws ? Array.isArray(_ws) : o.dense;
  if (DENSE != null && dense == null) dense = DENSE;
  var ws = _ws || (dense ? [] : {});
  var _R = 0, _C = 0;
  if (ws && o.origin != null) {
    if (typeof o.origin == "number") _R = o.origin;
    else {
      var _origin = typeof o.origin == "string" ? decode_cell(o.origin) : o.origin;
      _R = _origin.r;
      _C = _origin.c;
    }
    if (!ws["!ref"]) ws["!ref"] = "A1:A1";
  }
  var range = {
    s: {
      c: 1e7,
      r: 1e7
    },
    e: {
      c: 0,
      r: 0
    }
  };
  if (ws["!ref"]) {
    var _range = safe_decode_range(ws["!ref"]);
    range.s.c = _range.s.c;
    range.s.r = _range.s.r;
    range.e.c = Math.max(range.e.c, _range.e.c);
    range.e.r = Math.max(range.e.r, _range.e.r);
    if (_R == -1) range.e.r = _R = _range.e.r + 1;
  }
  for (var R = 0; R != data.length; ++R) {
    if (!data[R]) continue;
    if (!Array.isArray(data[R])) throw new Error("aoa_to_sheet expects an array of arrays");
    for (var C = 0; C != data[R].length; ++C) {
      if (typeof data[R][C] === "undefined") continue;
      var cell = {
        v: data[R][C]
      };
      var __R = _R + R, __C = _C + C;
      if (range.s.r > __R) range.s.r = __R;
      if (range.s.c > __C) range.s.c = __C;
      if (range.e.r < __R) range.e.r = __R;
      if (range.e.c < __C) range.e.c = __C;
      if (data[R][C] && typeof data[R][C] === "object" && !Array.isArray(data[R][C]) && !(data[R][C] instanceof Date)) cell = data[R][C];
      else {
        if (Array.isArray(cell.v)) {
          cell.f = data[R][C][1];
          cell.v = cell.v[0];
        }
        if (cell.v === null) {
          if (cell.f) cell.t = "n";
          else if (o.nullError) {
            cell.t = "e";
            cell.v = 0;
          } else if (!o.sheetStubs) continue;
          else cell.t = "z";
        } else if (typeof cell.v === "number") cell.t = "n";
        else if (typeof cell.v === "boolean") cell.t = "b";
        else if (cell.v instanceof Date) {
          cell.z = o.dateNF || table_fmt[14];
          if (o.cellDates) {
            cell.t = "d";
            cell.w = SSF_format(cell.z, datenum(cell.v));
          } else {
            cell.t = "n";
            cell.v = datenum(cell.v);
            cell.w = SSF_format(cell.z, cell.v);
          }
        } else cell.t = "s";
      }
      if (dense) {
        if (!ws[__R]) ws[__R] = [];
        if (ws[__R][__C] && ws[__R][__C].z) cell.z = ws[__R][__C].z;
        ws[__R][__C] = cell;
      } else {
        var cell_ref = encode_cell(
          {
            c: __C,
            r: __R
          }
          /*:any*/
        );
        if (ws[cell_ref] && ws[cell_ref].z) cell.z = ws[cell_ref].z;
        ws[cell_ref] = cell;
      }
    }
  }
  if (range.s.c < 1e7) ws["!ref"] = encode_range(range);
  return ws;
}
function aoa_to_sheet(data, opts) {
  return sheet_add_aoa(null, data, opts);
}
function parse_Int32LE(data) {
  return data.read_shift(4, "i");
}
function write_UInt32LE(x, o) {
  if (!o) o = new_buf(4);
  o.write_shift(4, x);
  return o;
}
function parse_XLWideString(data) {
  var cchCharacters = data.read_shift(4);
  return cchCharacters === 0 ? "" : data.read_shift(cchCharacters, "dbcs");
}
function write_XLWideString(data, o) {
  var _null = false;
  if (o == null) {
    _null = true;
    o = new_buf(4 + 2 * data.length);
  }
  o.write_shift(4, data.length);
  if (data.length > 0) o.write_shift(0, data, "dbcs");
  return _null ? o.slice(0, o.l) : o;
}
function parse_StrRun(data) {
  return {
    ich: data.read_shift(2),
    ifnt: data.read_shift(2)
  };
}
function write_StrRun(run, o) {
  if (!o) o = new_buf(4);
  o.write_shift(2, run.ich || 0);
  o.write_shift(2, run.ifnt || 0);
  return o;
}
function parse_RichStr(data, length) {
  var start = data.l;
  var flags = data.read_shift(1);
  var str = parse_XLWideString(data);
  var rgsStrRun = [];
  var z = {
    t: str,
    h: str
  };
  if ((flags & 1) !== 0) {
    var dwSizeStrRun = data.read_shift(4);
    for (var i = 0; i != dwSizeStrRun; ++i) rgsStrRun.push(parse_StrRun(data));
    z.r = rgsStrRun;
  } else z.r = [{
    ich: 0,
    ifnt: 0
  }];
  data.l = start + length;
  return z;
}
function write_RichStr(str, o) {
  var _null = false;
  if (o == null) {
    _null = true;
    o = new_buf(15 + 4 * str.t.length);
  }
  o.write_shift(1, 0);
  write_XLWideString(str.t, o);
  return _null ? o.slice(0, o.l) : o;
}
var parse_BrtCommentText = parse_RichStr;
function write_BrtCommentText(str, o) {
  var _null = false;
  if (o == null) {
    _null = true;
    o = new_buf(23 + 4 * str.t.length);
  }
  o.write_shift(1, 1);
  write_XLWideString(str.t, o);
  o.write_shift(4, 1);
  write_StrRun({
    ich: 0,
    ifnt: 0
  }, o);
  return _null ? o.slice(0, o.l) : o;
}
function parse_XLSBCell(data) {
  var col = data.read_shift(4);
  var iStyleRef = data.read_shift(2);
  iStyleRef += data.read_shift(1) << 16;
  data.l++;
  return {
    c: col,
    iStyleRef
  };
}
function write_XLSBCell(cell, o) {
  if (o == null) o = new_buf(8);
  o.write_shift(-4, cell.c);
  o.write_shift(3, cell.iStyleRef || cell.s);
  o.write_shift(1, 0);
  return o;
}
function parse_XLSBShortCell(data) {
  var iStyleRef = data.read_shift(2);
  iStyleRef += data.read_shift(1) << 16;
  data.l++;
  return {
    c: -1,
    iStyleRef
  };
}
function write_XLSBShortCell(cell, o) {
  if (o == null) o = new_buf(4);
  o.write_shift(3, cell.iStyleRef || cell.s);
  o.write_shift(1, 0);
  return o;
}
var parse_XLSBCodeName = parse_XLWideString;
var write_XLSBCodeName = write_XLWideString;
function parse_XLNullableWideString(data) {
  var cchCharacters = data.read_shift(4);
  return cchCharacters === 0 || cchCharacters === 4294967295 ? "" : data.read_shift(cchCharacters, "dbcs");
}
function write_XLNullableWideString(data, o) {
  var _null = false;
  if (o == null) {
    _null = true;
    o = new_buf(127);
  }
  o.write_shift(4, data.length > 0 ? data.length : 4294967295);
  if (data.length > 0) o.write_shift(0, data, "dbcs");
  return _null ? o.slice(0, o.l) : o;
}
var parse_XLNameWideString = parse_XLWideString;
var parse_RelID = parse_XLNullableWideString;
var write_RelID = write_XLNullableWideString;
function parse_RkNumber(data) {
  var b = data.slice(data.l, data.l + 4);
  var fX100 = b[0] & 1, fInt = b[0] & 2;
  data.l += 4;
  var RK = fInt === 0 ? __double([0, 0, 0, 0, b[0] & 252, b[1], b[2], b[3]], 0) : __readInt32LE(b, 0) >> 2;
  return fX100 ? RK / 100 : RK;
}
function write_RkNumber(data, o) {
  if (o == null) o = new_buf(4);
  var fX100 = 0, fInt = 0, d100 = data * 100;
  if (data == (data | 0) && data >= -(1 << 29) && data < 1 << 29) {
    fInt = 1;
  } else if (d100 == (d100 | 0) && d100 >= -(1 << 29) && d100 < 1 << 29) {
    fInt = 1;
    fX100 = 1;
  }
  if (fInt) o.write_shift(-4, ((fX100 ? d100 : data) << 2) + (fX100 + 2));
  else throw new Error("unsupported RkNumber " + data);
}
function parse_RfX(data) {
  var cell = {
    s: {},
    e: {}
  };
  cell.s.r = data.read_shift(4);
  cell.e.r = data.read_shift(4);
  cell.s.c = data.read_shift(4);
  cell.e.c = data.read_shift(4);
  return cell;
}
function write_RfX(r, o) {
  if (!o) o = new_buf(16);
  o.write_shift(4, r.s.r);
  o.write_shift(4, r.e.r);
  o.write_shift(4, r.s.c);
  o.write_shift(4, r.e.c);
  return o;
}
var parse_UncheckedRfX = parse_RfX;
var write_UncheckedRfX = write_RfX;
function parse_Xnum(data) {
  if (data.length - data.l < 8) throw "XLS Xnum Buffer underflow";
  return data.read_shift(8, "f");
}
function write_Xnum(data, o) {
  return (o || new_buf(8)).write_shift(8, data, "f");
}
function parse_BrtColor(data) {
  var out = {};
  var d = data.read_shift(1);
  var xColorType = d >>> 1;
  var index = data.read_shift(1);
  var nTS = data.read_shift(2, "i");
  var bR = data.read_shift(1);
  var bG = data.read_shift(1);
  var bB = data.read_shift(1);
  data.l++;
  switch (xColorType) {
    case 0:
      out.auto = 1;
      break;
    case 1:
      out.index = index;
      var icv = XLSIcv[index];
      if (icv) out.rgb = rgb2Hex(icv);
      break;
    case 2:
      out.rgb = rgb2Hex([bR, bG, bB]);
      break;
    case 3:
      out.theme = index;
      break;
  }
  if (nTS != 0) out.tint = nTS > 0 ? nTS / 32767 : nTS / 32768;
  return out;
}
function write_BrtColor(color, o) {
  if (!o) o = new_buf(8);
  if (!color || color.auto) {
    o.write_shift(4, 0);
    o.write_shift(4, 0);
    return o;
  }
  if (color.index != null) {
    o.write_shift(1, 2);
    o.write_shift(1, color.index);
  } else if (color.theme != null) {
    o.write_shift(1, 6);
    o.write_shift(1, color.theme);
  } else {
    o.write_shift(1, 5);
    o.write_shift(1, 0);
  }
  var nTS = color.tint || 0;
  if (nTS > 0) nTS *= 32767;
  else if (nTS < 0) nTS *= 32768;
  o.write_shift(2, nTS);
  if (!color.rgb || color.theme != null) {
    o.write_shift(2, 0);
    o.write_shift(1, 0);
    o.write_shift(1, 0);
  } else {
    var rgb = color.rgb || "FFFFFF";
    if (typeof rgb == "number") rgb = ("000000" + rgb.toString(16)).slice(-6);
    o.write_shift(1, parseInt(rgb.slice(0, 2), 16));
    o.write_shift(1, parseInt(rgb.slice(2, 4), 16));
    o.write_shift(1, parseInt(rgb.slice(4, 6), 16));
    o.write_shift(1, 255);
  }
  return o;
}
function parse_FontFlags(data) {
  var d = data.read_shift(1);
  data.l++;
  var out = {
    fBold: d & 1,
    fItalic: d & 2,
    fUnderline: d & 4,
    fStrikeout: d & 8,
    fOutline: d & 16,
    fShadow: d & 32,
    fCondense: d & 64,
    fExtend: d & 128
  };
  return out;
}
function write_FontFlags(font, o) {
  if (!o) o = new_buf(2);
  var grbit = (font.italic ? 2 : 0) | (font.strike ? 8 : 0) | (font.outline ? 16 : 0) | (font.shadow ? 32 : 0) | (font.condense ? 64 : 0) | (font.extend ? 128 : 0);
  o.write_shift(1, grbit);
  o.write_shift(1, 0);
  return o;
}
var VT_I2 = 2;
var VT_I4 = 3;
var VT_BOOL = 11;
var VT_UI4 = 19;
var VT_FILETIME = 64;
var VT_BLOB = 65;
var VT_CF = 71;
var VT_VECTOR_VARIANT = 4108;
var VT_VECTOR_LPSTR = 4126;
var VT_STRING = 80;
var DocSummaryPIDDSI = {
  /*::[*/
  1: {
    n: "CodePage",
    t: VT_I2
  },
  /*::[*/
  2: {
    n: "Category",
    t: VT_STRING
  },
  /*::[*/
  3: {
    n: "PresentationFormat",
    t: VT_STRING
  },
  /*::[*/
  4: {
    n: "ByteCount",
    t: VT_I4
  },
  /*::[*/
  5: {
    n: "LineCount",
    t: VT_I4
  },
  /*::[*/
  6: {
    n: "ParagraphCount",
    t: VT_I4
  },
  /*::[*/
  7: {
    n: "SlideCount",
    t: VT_I4
  },
  /*::[*/
  8: {
    n: "NoteCount",
    t: VT_I4
  },
  /*::[*/
  9: {
    n: "HiddenCount",
    t: VT_I4
  },
  /*::[*/
  10: {
    n: "MultimediaClipCount",
    t: VT_I4
  },
  /*::[*/
  11: {
    n: "ScaleCrop",
    t: VT_BOOL
  },
  /*::[*/
  12: {
    n: "HeadingPairs",
    t: VT_VECTOR_VARIANT
    /* VT_VECTOR | VT_VARIANT */
  },
  /*::[*/
  13: {
    n: "TitlesOfParts",
    t: VT_VECTOR_LPSTR
    /* VT_VECTOR | VT_LPSTR */
  },
  /*::[*/
  14: {
    n: "Manager",
    t: VT_STRING
  },
  /*::[*/
  15: {
    n: "Company",
    t: VT_STRING
  },
  /*::[*/
  16: {
    n: "LinksUpToDate",
    t: VT_BOOL
  },
  /*::[*/
  17: {
    n: "CharacterCount",
    t: VT_I4
  },
  /*::[*/
  19: {
    n: "SharedDoc",
    t: VT_BOOL
  },
  /*::[*/
  22: {
    n: "HyperlinksChanged",
    t: VT_BOOL
  },
  /*::[*/
  23: {
    n: "AppVersion",
    t: VT_I4,
    p: "version"
  },
  /*::[*/
  24: {
    n: "DigSig",
    t: VT_BLOB
  },
  /*::[*/
  26: {
    n: "ContentType",
    t: VT_STRING
  },
  /*::[*/
  27: {
    n: "ContentStatus",
    t: VT_STRING
  },
  /*::[*/
  28: {
    n: "Language",
    t: VT_STRING
  },
  /*::[*/
  29: {
    n: "Version",
    t: VT_STRING
  },
  /*::[*/
  255: {},
  /* [MS-OLEPS] 2.18 */
  /*::[*/
  2147483648: {
    n: "Locale",
    t: VT_UI4
  },
  /*::[*/
  2147483651: {
    n: "Behavior",
    t: VT_UI4
  },
  /*::[*/
  1919054434: {}
};
var SummaryPIDSI = {
  /*::[*/
  1: {
    n: "CodePage",
    t: VT_I2
  },
  /*::[*/
  2: {
    n: "Title",
    t: VT_STRING
  },
  /*::[*/
  3: {
    n: "Subject",
    t: VT_STRING
  },
  /*::[*/
  4: {
    n: "Author",
    t: VT_STRING
  },
  /*::[*/
  5: {
    n: "Keywords",
    t: VT_STRING
  },
  /*::[*/
  6: {
    n: "Comments",
    t: VT_STRING
  },
  /*::[*/
  7: {
    n: "Template",
    t: VT_STRING
  },
  /*::[*/
  8: {
    n: "LastAuthor",
    t: VT_STRING
  },
  /*::[*/
  9: {
    n: "RevNumber",
    t: VT_STRING
  },
  /*::[*/
  10: {
    n: "EditTime",
    t: VT_FILETIME
  },
  /*::[*/
  11: {
    n: "LastPrinted",
    t: VT_FILETIME
  },
  /*::[*/
  12: {
    n: "CreatedDate",
    t: VT_FILETIME
  },
  /*::[*/
  13: {
    n: "ModifiedDate",
    t: VT_FILETIME
  },
  /*::[*/
  14: {
    n: "PageCount",
    t: VT_I4
  },
  /*::[*/
  15: {
    n: "WordCount",
    t: VT_I4
  },
  /*::[*/
  16: {
    n: "CharCount",
    t: VT_I4
  },
  /*::[*/
  17: {
    n: "Thumbnail",
    t: VT_CF
  },
  /*::[*/
  18: {
    n: "Application",
    t: VT_STRING
  },
  /*::[*/
  19: {
    n: "DocSecurity",
    t: VT_I4
  },
  /*::[*/
  255: {},
  /* [MS-OLEPS] 2.18 */
  /*::[*/
  2147483648: {
    n: "Locale",
    t: VT_UI4
  },
  /*::[*/
  2147483651: {
    n: "Behavior",
    t: VT_UI4
  },
  /*::[*/
  1919054434: {}
};
function rgbify(arr) {
  return arr.map(function(x) {
    return [x >> 16 & 255, x >> 8 & 255, x & 255];
  });
}
var _XLSIcv = /* @__PURE__ */ rgbify([
  /* Color Constants */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  /* Overridable Defaults */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  8388608,
  32768,
  128,
  8421376,
  8388736,
  32896,
  12632256,
  8421504,
  10066431,
  10040166,
  16777164,
  13434879,
  6684774,
  16744576,
  26316,
  13421823,
  128,
  16711935,
  16776960,
  65535,
  8388736,
  8388608,
  32896,
  255,
  52479,
  13434879,
  13434828,
  16777113,
  10079487,
  16751052,
  13408767,
  16764057,
  3368703,
  3394764,
  10079232,
  16763904,
  16750848,
  16737792,
  6710937,
  9868950,
  13158,
  3381606,
  13056,
  3355392,
  10040064,
  10040166,
  3355545,
  3355443,
  /* Other entries to appease BIFF8/12 */
  16777215,
  /* 0x40 icvForeground ?? */
  0,
  /* 0x41 icvBackground ?? */
  0,
  /* 0x42 icvFrame ?? */
  0,
  /* 0x43 icv3D ?? */
  0,
  /* 0x44 icv3DText ?? */
  0,
  /* 0x45 icv3DHilite ?? */
  0,
  /* 0x46 icv3DShadow ?? */
  0,
  /* 0x47 icvHilite ?? */
  0,
  /* 0x48 icvCtlText ?? */
  0,
  /* 0x49 icvCtlScrl ?? */
  0,
  /* 0x4A icvCtlInv ?? */
  0,
  /* 0x4B icvCtlBody ?? */
  0,
  /* 0x4C icvCtlFrame ?? */
  0,
  /* 0x4D icvCtlFore ?? */
  0,
  /* 0x4E icvCtlBack ?? */
  0,
  /* 0x4F icvCtlNeutral */
  0,
  /* 0x50 icvInfoBk ?? */
  0
  /* 0x51 icvInfoText ?? */
]);
var XLSIcv = /* @__PURE__ */ dup(_XLSIcv);
var BErr = {
  /*::[*/
  0: "#NULL!",
  /*::[*/
  7: "#DIV/0!",
  /*::[*/
  15: "#VALUE!",
  /*::[*/
  23: "#REF!",
  /*::[*/
  29: "#NAME?",
  /*::[*/
  36: "#NUM!",
  /*::[*/
  42: "#N/A",
  /*::[*/
  43: "#GETTING_DATA",
  /*::[*/
  255: "#WTF?"
};
var ct2type = {
  /* Workbook */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
  "application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",
  /* Worksheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
  "application/vnd.ms-excel.worksheet": "sheets",
  "application/vnd.ms-excel.binIndexWs": "TODO",
  /* Binary Index */
  /* Chartsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
  "application/vnd.ms-excel.chartsheet": "charts",
  /* Macrosheet */
  "application/vnd.ms-excel.macrosheet+xml": "macros",
  "application/vnd.ms-excel.macrosheet": "macros",
  "application/vnd.ms-excel.intlmacrosheet": "TODO",
  "application/vnd.ms-excel.binIndexMs": "TODO",
  /* Binary Index */
  /* Dialogsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
  "application/vnd.ms-excel.dialogsheet": "dialogs",
  /* Shared Strings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
  "application/vnd.ms-excel.sharedStrings": "strs",
  /* Styles */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
  "application/vnd.ms-excel.styles": "styles",
  /* File Properties */
  "application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
  /* Custom Data Properties */
  "application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
  /* Comments */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
  "application/vnd.ms-excel.comments": "comments",
  "application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
  "application/vnd.ms-excel.person+xml": "people",
  /* Metadata (Stock/Geography and Dynamic Array) */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
  "application/vnd.ms-excel.sheetMetadata": "metadata",
  /* PivotTable */
  "application/vnd.ms-excel.pivotTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
  /* Chart Objects */
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
  /* Chart Colors */
  "application/vnd.ms-office.chartcolorstyle+xml": "TODO",
  /* Chart Style */
  "application/vnd.ms-office.chartstyle+xml": "TODO",
  /* Chart Advanced */
  "application/vnd.ms-office.chartex+xml": "TODO",
  /* Calculation Chain */
  "application/vnd.ms-excel.calcChain": "calcchains",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
  /* Printer Settings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
  /* ActiveX */
  "application/vnd.ms-office.activeX": "TODO",
  "application/vnd.ms-office.activeX+xml": "TODO",
  /* Custom Toolbars */
  "application/vnd.ms-excel.attachedToolbars": "TODO",
  /* External Data Connections */
  "application/vnd.ms-excel.connections": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
  /* External Links */
  "application/vnd.ms-excel.externalLink": "links",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
  /* PivotCache */
  "application/vnd.ms-excel.pivotCacheDefinition": "TODO",
  "application/vnd.ms-excel.pivotCacheRecords": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
  /* Query Table */
  "application/vnd.ms-excel.queryTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
  /* Shared Workbook */
  "application/vnd.ms-excel.userNames": "TODO",
  "application/vnd.ms-excel.revisionHeaders": "TODO",
  "application/vnd.ms-excel.revisionLog": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
  /* Single Cell Table */
  "application/vnd.ms-excel.tableSingleCells": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
  /* Slicer */
  "application/vnd.ms-excel.slicer": "TODO",
  "application/vnd.ms-excel.slicerCache": "TODO",
  "application/vnd.ms-excel.slicer+xml": "TODO",
  "application/vnd.ms-excel.slicerCache+xml": "TODO",
  /* Sort Map */
  "application/vnd.ms-excel.wsSortMap": "TODO",
  /* Table */
  "application/vnd.ms-excel.table": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
  /* Themes */
  "application/vnd.openxmlformats-officedocument.theme+xml": "themes",
  /* Theme Override */
  "application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
  /* Timeline */
  "application/vnd.ms-excel.Timeline+xml": "TODO",
  /* verify */
  "application/vnd.ms-excel.TimelineCache+xml": "TODO",
  /* verify */
  /* VBA */
  "application/vnd.ms-office.vbaProject": "vba",
  "application/vnd.ms-office.vbaProjectSignature": "TODO",
  /* Volatile Dependencies */
  "application/vnd.ms-office.volatileDependencies": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
  /* Control Properties */
  "application/vnd.ms-excel.controlproperties+xml": "TODO",
  /* Data Model */
  "application/vnd.openxmlformats-officedocument.model+data": "TODO",
  /* Survey */
  "application/vnd.ms-excel.Survey+xml": "TODO",
  /* Drawing */
  "application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
  /* VML */
  "application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
  "application/vnd.openxmlformats-package.relationships+xml": "rels",
  "application/vnd.openxmlformats-officedocument.oleObject": "TODO",
  /* Image */
  "image/png": "TODO",
  "sheet": "js"
};
var CT_LIST = {
  workbooks: {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml"
  },
  strs: {
    /* Shared Strings */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
    xlsb: "application/vnd.ms-excel.sharedStrings"
  },
  comments: {
    /* Comments */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
    xlsb: "application/vnd.ms-excel.comments"
  },
  sheets: {
    /* Worksheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
    xlsb: "application/vnd.ms-excel.worksheet"
  },
  charts: {
    /* Chartsheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
    xlsb: "application/vnd.ms-excel.chartsheet"
  },
  dialogs: {
    /* Dialogsheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
    xlsb: "application/vnd.ms-excel.dialogsheet"
  },
  macros: {
    /* Macrosheet (Excel 4.0 Macros) */
    xlsx: "application/vnd.ms-excel.macrosheet+xml",
    xlsb: "application/vnd.ms-excel.macrosheet"
  },
  metadata: {
    /* Metadata (Stock/Geography and Dynamic Array) */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
    xlsb: "application/vnd.ms-excel.sheetMetadata"
  },
  styles: {
    /* Styles */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
    xlsb: "application/vnd.ms-excel.styles"
  }
};
function new_ct() {
  return {
    workbooks: [],
    sheets: [],
    charts: [],
    dialogs: [],
    macros: [],
    rels: [],
    strs: [],
    comments: [],
    threadedcomments: [],
    links: [],
    coreprops: [],
    extprops: [],
    custprops: [],
    themes: [],
    styles: [],
    calcchains: [],
    vba: [],
    drawings: [],
    metadata: [],
    people: [],
    TODO: [],
    xmlns: ""
  };
}
function write_ct(ct, opts) {
  var type2ct = evert_arr(ct2type);
  var o = [], v;
  o[o.length] = XML_HEADER;
  o[o.length] = writextag("Types", null, {
    "xmlns": XMLNS.CT,
    "xmlns:xsd": XMLNS.xsd,
    "xmlns:xsi": XMLNS.xsi
  });
  o = o.concat([
    ["xml", "application/xml"],
    ["bin", "application/vnd.ms-excel.sheet.binary.macroEnabled.main"],
    ["vml", "application/vnd.openxmlformats-officedocument.vmlDrawing"],
    ["data", "application/vnd.openxmlformats-officedocument.model+data"],
    /* from test files */
    ["bmp", "image/bmp"],
    ["png", "image/png"],
    ["gif", "image/gif"],
    ["emf", "image/x-emf"],
    ["wmf", "image/x-wmf"],
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["tif", "image/tiff"],
    ["tiff", "image/tiff"],
    ["pdf", "application/pdf"],
    ["rels", "application/vnd.openxmlformats-package.relationships+xml"]
  ].map(function(x) {
    return writextag("Default", null, {
      "Extension": x[0],
      "ContentType": x[1]
    });
  }));
  var f1 = function(w) {
    if (ct[w] && ct[w].length > 0) {
      v = ct[w][0];
      o[o.length] = writextag("Override", null, {
        "PartName": (v[0] == "/" ? "" : "/") + v,
        "ContentType": CT_LIST[w][opts.bookType] || CT_LIST[w]["xlsx"]
      });
    }
  };
  var f2 = function(w) {
    (ct[w] || []).forEach(function(v2) {
      o[o.length] = writextag("Override", null, {
        "PartName": (v2[0] == "/" ? "" : "/") + v2,
        "ContentType": CT_LIST[w][opts.bookType] || CT_LIST[w]["xlsx"]
      });
    });
  };
  var f3 = function(t) {
    (ct[t] || []).forEach(function(v2) {
      o[o.length] = writextag("Override", null, {
        "PartName": (v2[0] == "/" ? "" : "/") + v2,
        "ContentType": type2ct[t][0]
      });
    });
  };
  f1("workbooks");
  f2("sheets");
  f2("charts");
  f3("themes");
  ["strs", "styles"].forEach(f1);
  ["coreprops", "extprops", "custprops"].forEach(f3);
  f3("vba");
  f3("comments");
  f3("threadedcomments");
  f3("drawings");
  f2("metadata");
  f3("people");
  if (o.length > 2) {
    o[o.length] = "</Types>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
var RELS = {
  WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
  VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
  XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
  XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
  XLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
  CXML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
  CXMLP: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
  CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
  CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
  EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
  CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
  SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
  STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
  THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
  CHART: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
  CHARTEX: "http://schemas.microsoft.com/office/2014/relationships/chartEx",
  CS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
  WS: ["http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet", "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"],
  DS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
  MS: "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet",
  IMG: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
  DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
  XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
  TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
  PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
  VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
};
function get_rels_path(file) {
  var n = file.lastIndexOf("/");
  return file.slice(0, n + 1) + "_rels/" + file.slice(n + 1) + ".rels";
}
function write_rels(rels) {
  var o = [XML_HEADER, writextag("Relationships", null, {
    //'xmlns:ns0': XMLNS.RELS,
    "xmlns": XMLNS.RELS
  })];
  keys(rels["!id"]).forEach(function(rid) {
    o[o.length] = writextag("Relationship", null, rels["!id"][rid]);
  });
  if (o.length > 2) {
    o[o.length] = "</Relationships>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function add_rels(rels, rId, f, type, relobj, targetmode) {
  if (!relobj) relobj = {};
  if (!rels["!id"]) rels["!id"] = {};
  if (!rels["!idx"]) rels["!idx"] = 1;
  if (rId < 0) for (rId = rels["!idx"]; rels["!id"]["rId" + rId]; ++rId) {
  }
  rels["!idx"] = rId + 1;
  relobj.Id = "rId" + rId;
  relobj.Type = type;
  relobj.Target = f;
  if (targetmode) relobj.TargetMode = targetmode;
  else if ([RELS.HLINK, RELS.XPATH, RELS.XMISS].indexOf(relobj.Type) > -1) relobj.TargetMode = "External";
  if (rels["!id"][relobj.Id]) throw new Error("Cannot rewrite rId " + rId);
  rels["!id"][relobj.Id] = relobj;
  rels[("/" + relobj.Target).replace("//", "/")] = relobj;
  return rId;
}
function write_manifest(manifest) {
  var o = [XML_HEADER];
  o.push('<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">\n');
  o.push('  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>\n');
  for (var i = 0; i < manifest.length; ++i) o.push('  <manifest:file-entry manifest:full-path="' + manifest[i][0] + '" manifest:media-type="' + manifest[i][1] + '"/>\n');
  o.push("</manifest:manifest>");
  return o.join("");
}
function write_rdf_type(file, res, tag2) {
  return ['  <rdf:Description rdf:about="' + file + '">\n', '    <rdf:type rdf:resource="http://docs.oasis-open.org/ns/office/1.2/meta/' + (tag2 || "odf") + "#" + res + '"/>\n', "  </rdf:Description>\n"].join("");
}
function write_rdf_has(base, file) {
  return ['  <rdf:Description rdf:about="' + base + '">\n', '    <ns0:hasPart xmlns:ns0="http://docs.oasis-open.org/ns/office/1.2/meta/pkg#" rdf:resource="' + file + '"/>\n', "  </rdf:Description>\n"].join("");
}
function write_rdf(rdf) {
  var o = [XML_HEADER];
  o.push('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n');
  for (var i = 0; i != rdf.length; ++i) {
    o.push(write_rdf_type(rdf[i][0], rdf[i][1]));
    o.push(write_rdf_has("", rdf[i][0]));
  }
  o.push(write_rdf_type("", "Document", "pkg"));
  o.push("</rdf:RDF>");
  return o.join("");
}
function write_meta_ods() {
  return '<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"><office:meta><meta:generator>SheetJS ' + XLSX.version + "</meta:generator></office:meta></office:document-meta>";
}
var CORE_PROPS = [["cp:category", "Category"], ["cp:contentStatus", "ContentStatus"], ["cp:keywords", "Keywords"], ["cp:lastModifiedBy", "LastAuthor"], ["cp:lastPrinted", "LastPrinted"], ["cp:revision", "RevNumber"], ["cp:version", "Version"], ["dc:creator", "Author"], ["dc:description", "Comments"], ["dc:identifier", "Identifier"], ["dc:language", "Language"], ["dc:subject", "Subject"], ["dc:title", "Title"], ["dcterms:created", "CreatedDate", "date"], ["dcterms:modified", "ModifiedDate", "date"]];
function cp_doit(f, g, h, o, p) {
  if (p[f] != null || g == null || g === "") return;
  p[f] = g;
  g = escapexml(g);
  o[o.length] = h ? writextag(f, g, h) : writetag(f, g);
}
function write_core_props(cp, _opts) {
  var opts = _opts || {};
  var o = [XML_HEADER, writextag("cp:coreProperties", null, {
    //'xmlns': XMLNS.CORE_PROPS,
    "xmlns:cp": XMLNS.CORE_PROPS,
    "xmlns:dc": XMLNS.dc,
    "xmlns:dcterms": XMLNS.dcterms,
    "xmlns:dcmitype": XMLNS.dcmitype,
    "xmlns:xsi": XMLNS.xsi
  })], p = {};
  if (!cp && !opts.Props) return o.join("");
  if (cp) {
    if (cp.CreatedDate != null) cp_doit("dcterms:created", typeof cp.CreatedDate === "string" ? cp.CreatedDate : write_w3cdtf(cp.CreatedDate, opts.WTF), {
      "xsi:type": "dcterms:W3CDTF"
    }, o, p);
    if (cp.ModifiedDate != null) cp_doit("dcterms:modified", typeof cp.ModifiedDate === "string" ? cp.ModifiedDate : write_w3cdtf(cp.ModifiedDate, opts.WTF), {
      "xsi:type": "dcterms:W3CDTF"
    }, o, p);
  }
  for (var i = 0; i != CORE_PROPS.length; ++i) {
    var f = CORE_PROPS[i];
    var v = opts.Props && opts.Props[f[1]] != null ? opts.Props[f[1]] : cp ? cp[f[1]] : null;
    if (v === true) v = "1";
    else if (v === false) v = "0";
    else if (typeof v == "number") v = String(v);
    if (v != null) cp_doit(f[0], v, null, o, p);
  }
  if (o.length > 2) {
    o[o.length] = "</cp:coreProperties>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
var EXT_PROPS = [["Application", "Application", "string"], ["AppVersion", "AppVersion", "string"], ["Company", "Company", "string"], ["DocSecurity", "DocSecurity", "string"], ["Manager", "Manager", "string"], ["HyperlinksChanged", "HyperlinksChanged", "bool"], ["SharedDoc", "SharedDoc", "bool"], ["LinksUpToDate", "LinksUpToDate", "bool"], ["ScaleCrop", "ScaleCrop", "bool"], ["HeadingPairs", "HeadingPairs", "raw"], ["TitlesOfParts", "TitlesOfParts", "raw"]];
var PseudoPropsPairs = ["Worksheets", "SheetNames", "NamedRanges", "DefinedNames", "Chartsheets", "ChartNames"];
function write_ext_props(cp) {
  var o = [], W = writextag;
  if (!cp) cp = {};
  cp.Application = "SheetJS";
  o[o.length] = XML_HEADER;
  o[o.length] = writextag("Properties", null, {
    "xmlns": XMLNS.EXT_PROPS,
    "xmlns:vt": XMLNS.vt
  });
  EXT_PROPS.forEach(function(f) {
    if (cp[f[1]] === void 0) return;
    var v;
    switch (f[2]) {
      case "string":
        v = escapexml(String(cp[f[1]]));
        break;
      case "bool":
        v = cp[f[1]] ? "true" : "false";
        break;
    }
    if (v !== void 0) o[o.length] = W(f[0], v);
  });
  o[o.length] = W("HeadingPairs", W("vt:vector", W("vt:variant", "<vt:lpstr>Worksheets</vt:lpstr>") + W("vt:variant", W("vt:i4", String(cp.Worksheets))), {
    size: 2,
    baseType: "variant"
  }));
  o[o.length] = W("TitlesOfParts", W("vt:vector", cp.SheetNames.map(function(s) {
    return "<vt:lpstr>" + escapexml(s) + "</vt:lpstr>";
  }).join(""), {
    size: cp.Worksheets,
    baseType: "lpstr"
  }));
  if (o.length > 2) {
    o[o.length] = "</Properties>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function write_cust_props(cp) {
  var o = [XML_HEADER, writextag("Properties", null, {
    "xmlns": XMLNS.CUST_PROPS,
    "xmlns:vt": XMLNS.vt
  })];
  if (!cp) return o.join("");
  var pid = 1;
  keys(cp).forEach(function custprop(k) {
    ++pid;
    o[o.length] = writextag("property", write_vt(cp[k], true), {
      "fmtid": "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
      "pid": pid,
      "name": escapexml(k)
    });
  });
  if (o.length > 2) {
    o[o.length] = "</Properties>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
var XLMLDocPropsMap = {
  Title: "Title",
  Subject: "Subject",
  Author: "Author",
  Keywords: "Keywords",
  Comments: "Description",
  LastAuthor: "LastAuthor",
  RevNumber: "Revision",
  Application: "AppName",
  /* TotalTime: 'TotalTime', */
  LastPrinted: "LastPrinted",
  CreatedDate: "Created",
  ModifiedDate: "LastSaved",
  /* Pages */
  /* Words */
  /* Characters */
  Category: "Category",
  /* PresentationFormat */
  Manager: "Manager",
  Company: "Company",
  /* Guid */
  /* HyperlinkBase */
  /* Bytes */
  /* Lines */
  /* Paragraphs */
  /* CharactersWithSpaces */
  AppVersion: "Version",
  ContentStatus: "ContentStatus",
  /* NOTE: missing from schema */
  Identifier: "Identifier",
  /* NOTE: missing from schema */
  Language: "Language"
  /* NOTE: missing from schema */
};
function xlml_write_docprops(Props, opts) {
  var o = [];
  keys(XLMLDocPropsMap).map(function(m) {
    for (var i = 0; i < CORE_PROPS.length; ++i) if (CORE_PROPS[i][1] == m) return CORE_PROPS[i];
    for (i = 0; i < EXT_PROPS.length; ++i) if (EXT_PROPS[i][1] == m) return EXT_PROPS[i];
    throw m;
  }).forEach(function(p) {
    if (Props[p[1]] == null) return;
    var m = opts && opts.Props && opts.Props[p[1]] != null ? opts.Props[p[1]] : Props[p[1]];
    switch (p[2]) {
      case "date":
        m = new Date(m).toISOString().replace(/\.\d*Z/, "Z");
        break;
    }
    if (typeof m == "number") m = String(m);
    else if (m === true || m === false) {
      m = m ? "1" : "0";
    } else if (m instanceof Date) m = new Date(m).toISOString().replace(/\.\d*Z/, "");
    o.push(writetag(XLMLDocPropsMap[p[1]] || p[1], m));
  });
  return writextag("DocumentProperties", o.join(""), {
    xmlns: XLMLNS.o
  });
}
function xlml_write_custprops(Props, Custprops) {
  var BLACKLIST = ["Worksheets", "SheetNames"];
  var T = "CustomDocumentProperties";
  var o = [];
  if (Props) keys(Props).forEach(function(k) {
    if (!Object.prototype.hasOwnProperty.call(Props, k)) return;
    for (var i = 0; i < CORE_PROPS.length; ++i) if (k == CORE_PROPS[i][1]) return;
    for (i = 0; i < EXT_PROPS.length; ++i) if (k == EXT_PROPS[i][1]) return;
    for (i = 0; i < BLACKLIST.length; ++i) if (k == BLACKLIST[i]) return;
    var m = Props[k];
    var t = "string";
    if (typeof m == "number") {
      t = "float";
      m = String(m);
    } else if (m === true || m === false) {
      t = "boolean";
      m = m ? "1" : "0";
    } else m = String(m);
    o.push(writextag(escapexmltag(k), m, {
      "dt:dt": t
    }));
  });
  if (Custprops) keys(Custprops).forEach(function(k) {
    if (!Object.prototype.hasOwnProperty.call(Custprops, k)) return;
    if (Props && Object.prototype.hasOwnProperty.call(Props, k)) return;
    var m = Custprops[k];
    var t = "string";
    if (typeof m == "number") {
      t = "float";
      m = String(m);
    } else if (m === true || m === false) {
      t = "boolean";
      m = m ? "1" : "0";
    } else if (m instanceof Date) {
      t = "dateTime.tz";
      m = m.toISOString();
    } else m = String(m);
    o.push(writextag(escapexmltag(k), m, {
      "dt:dt": t
    }));
  });
  return "<" + T + ' xmlns="' + XLMLNS.o + '">' + o.join("") + "</" + T + ">";
}
function write_FILETIME(time) {
  var date = typeof time == "string" ? new Date(Date.parse(time)) : time;
  var t = date.getTime() / 1e3 + 11644473600;
  var l = t % Math.pow(2, 32), h = (t - l) / Math.pow(2, 32);
  l *= 1e7;
  h *= 1e7;
  var w = l / Math.pow(2, 32) | 0;
  if (w > 0) {
    l = l % Math.pow(2, 32);
    h += w;
  }
  var o = new_buf(8);
  o.write_shift(4, l);
  o.write_shift(4, h);
  return o;
}
function write_TypedPropertyValue(type, value) {
  var o = new_buf(4), p = new_buf(4);
  o.write_shift(4, type == 80 ? 31 : type);
  switch (type) {
    case 3:
      p.write_shift(-4, value);
      break;
    case 5:
      p = new_buf(8);
      p.write_shift(8, value, "f");
      break;
    case 11:
      p.write_shift(4, value ? 1 : 0);
      break;
    case 64:
      p = write_FILETIME(value);
      break;
    case 31:
    case 80:
      p = new_buf(4 + 2 * (value.length + 1) + (value.length % 2 ? 0 : 2));
      p.write_shift(4, value.length + 1);
      p.write_shift(0, value, "dbcs");
      while (p.l != p.length) p.write_shift(1, 0);
      break;
    default:
      throw new Error("TypedPropertyValue unrecognized type " + type + " " + value);
  }
  return bconcat([o, p]);
}
var XLSPSSkip = ["CodePage", "Thumbnail", "_PID_LINKBASE", "_PID_HLINKS", "SystemIdentifier", "FMTID"];
function guess_property_type(val) {
  switch (typeof val) {
    case "boolean":
      return 11;
    case "number":
      return (val | 0) == val ? 3 : 5;
    case "string":
      return 31;
    case "object":
      if (val instanceof Date) return 64;
      break;
  }
  return -1;
}
function write_PropertySet(entries, RE, PIDSI) {
  var hdr = new_buf(8), piao = [], prop = [];
  var sz = 8, i = 0;
  var pr = new_buf(8), pio = new_buf(8);
  pr.write_shift(4, 2);
  pr.write_shift(4, 1200);
  pio.write_shift(4, 1);
  prop.push(pr);
  piao.push(pio);
  sz += 8 + pr.length;
  if (!RE) {
    pio = new_buf(8);
    pio.write_shift(4, 0);
    piao.unshift(pio);
    var bufs = [new_buf(4)];
    bufs[0].write_shift(4, entries.length);
    for (i = 0; i < entries.length; ++i) {
      var value = entries[i][0];
      pr = new_buf(4 + 4 + 2 * (value.length + 1) + (value.length % 2 ? 0 : 2));
      pr.write_shift(4, i + 2);
      pr.write_shift(4, value.length + 1);
      pr.write_shift(0, value, "dbcs");
      while (pr.l != pr.length) pr.write_shift(1, 0);
      bufs.push(pr);
    }
    pr = bconcat(bufs);
    prop.unshift(pr);
    sz += 8 + pr.length;
  }
  for (i = 0; i < entries.length; ++i) {
    if (RE && !RE[entries[i][0]]) continue;
    if (XLSPSSkip.indexOf(entries[i][0]) > -1 || PseudoPropsPairs.indexOf(entries[i][0]) > -1) continue;
    if (entries[i][1] == null) continue;
    var val = entries[i][1], idx = 0;
    if (RE) {
      idx = +RE[entries[i][0]];
      var pinfo = PIDSI[idx];
      if (pinfo.p == "version" && typeof val == "string") {
        var arr = val.split(".");
        val = (+arr[0] << 16) + (+arr[1] || 0);
      }
      pr = write_TypedPropertyValue(pinfo.t, val);
    } else {
      var T = guess_property_type(val);
      if (T == -1) {
        T = 31;
        val = String(val);
      }
      pr = write_TypedPropertyValue(T, val);
    }
    prop.push(pr);
    pio = new_buf(8);
    pio.write_shift(4, !RE ? 2 + i : idx);
    piao.push(pio);
    sz += 8 + pr.length;
  }
  var w = 8 * (prop.length + 1);
  for (i = 0; i < prop.length; ++i) {
    piao[i].write_shift(4, w);
    w += prop[i].length;
  }
  hdr.write_shift(4, sz);
  hdr.write_shift(4, prop.length);
  return bconcat([hdr].concat(piao).concat(prop));
}
function write_PropertySetStream(entries, clsid, RE, PIDSI, entries2, clsid2) {
  var hdr = new_buf(entries2 ? 68 : 48);
  var bufs = [hdr];
  hdr.write_shift(2, 65534);
  hdr.write_shift(2, 0);
  hdr.write_shift(4, 842412599);
  hdr.write_shift(16, CFB.utils.consts.HEADER_CLSID, "hex");
  hdr.write_shift(4, entries2 ? 2 : 1);
  hdr.write_shift(16, clsid, "hex");
  hdr.write_shift(4, entries2 ? 68 : 48);
  var ps0 = write_PropertySet(entries, RE, PIDSI);
  bufs.push(ps0);
  if (entries2) {
    var ps1 = write_PropertySet(entries2, null, null);
    hdr.write_shift(16, clsid2, "hex");
    hdr.write_shift(4, 68 + ps0.length);
    bufs.push(ps1);
  }
  return bconcat(bufs);
}
function writezeroes(n, o) {
  if (!o) o = new_buf(n);
  for (var j = 0; j < n; ++j) o.write_shift(1, 0);
  return o;
}
function parsebool(blob, length) {
  return blob.read_shift(length) === 1;
}
function writebool(v, o) {
  if (!o) o = new_buf(2);
  o.write_shift(2, +!!v);
  return o;
}
function parseuint16(blob) {
  return blob.read_shift(2, "u");
}
function writeuint16(v, o) {
  if (!o) o = new_buf(2);
  o.write_shift(2, v);
  return o;
}
function write_Bes(v, t, o) {
  if (!o) o = new_buf(2);
  o.write_shift(1, t == "e" ? +v : +!!v);
  o.write_shift(1, t == "e" ? 1 : 0);
  return o;
}
function parse_ShortXLUnicodeString(blob, length, opts) {
  var cch = blob.read_shift(opts && opts.biff >= 12 ? 2 : 1);
  var encoding = "sbcs-cont";
  var cp = current_codepage;
  if (opts && opts.biff >= 8) current_codepage = 1200;
  if (!opts || opts.biff == 8) {
    var fHighByte = blob.read_shift(1);
    if (fHighByte) {
      encoding = "dbcs-cont";
    }
  } else if (opts.biff == 12) {
    encoding = "wstr";
  }
  if (opts.biff >= 2 && opts.biff <= 5) encoding = "cpstr";
  var o = cch ? blob.read_shift(cch, encoding) : "";
  current_codepage = cp;
  return o;
}
function write_XLUnicodeRichExtendedString(xlstr) {
  var str = xlstr.t || "", nfmts = 1;
  var hdr = new_buf(3 + (nfmts > 1 ? 2 : 0));
  hdr.write_shift(2, str.length);
  hdr.write_shift(1, (nfmts > 1 ? 8 : 0) | 1);
  if (nfmts > 1) hdr.write_shift(2, nfmts);
  var otext = new_buf(2 * str.length);
  otext.write_shift(2 * str.length, str, "utf16le");
  var out = [hdr, otext];
  return bconcat(out);
}
function parse_XLUnicodeStringNoCch(blob, cch, opts) {
  var retval;
  if (opts) {
    if (opts.biff >= 2 && opts.biff <= 5) return blob.read_shift(cch, "cpstr");
    if (opts.biff >= 12) return blob.read_shift(cch, "dbcs-cont");
  }
  var fHighByte = blob.read_shift(1);
  if (fHighByte === 0) {
    retval = blob.read_shift(cch, "sbcs-cont");
  } else {
    retval = blob.read_shift(cch, "dbcs-cont");
  }
  return retval;
}
function parse_XLUnicodeString(blob, length, opts) {
  var cch = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
  if (cch === 0) {
    blob.l++;
    return "";
  }
  return parse_XLUnicodeStringNoCch(blob, cch, opts);
}
function parse_XLUnicodeString2(blob, length, opts) {
  if (opts.biff > 5) return parse_XLUnicodeString(blob, length, opts);
  var cch = blob.read_shift(1);
  if (cch === 0) {
    blob.l++;
    return "";
  }
  return blob.read_shift(cch, opts.biff <= 4 || !blob.lens ? "cpstr" : "sbcs-cont");
}
function write_XLUnicodeString(str, opts, o) {
  if (!o) o = new_buf(3 + 2 * str.length);
  o.write_shift(2, str.length);
  o.write_shift(1, 1);
  o.write_shift(31, str, "utf16le");
  return o;
}
function write_HyperlinkString(str, o) {
  if (!o) o = new_buf(6 + str.length * 2);
  o.write_shift(4, 1 + str.length);
  for (var i = 0; i < str.length; ++i) o.write_shift(2, str.charCodeAt(i));
  o.write_shift(2, 0);
  return o;
}
function write_Hyperlink(hl) {
  var out = new_buf(512), i = 0;
  var Target = hl.Target;
  if (Target.slice(0, 7) == "file://") Target = Target.slice(7);
  var hashidx = Target.indexOf("#");
  var F = hashidx > -1 ? 31 : 23;
  switch (Target.charAt(0)) {
    case "#":
      F = 28;
      break;
    case ".":
      F &= ~2;
      break;
  }
  out.write_shift(4, 2);
  out.write_shift(4, F);
  var data = [8, 6815827, 6619237, 4849780, 83];
  for (i = 0; i < data.length; ++i) out.write_shift(4, data[i]);
  if (F == 28) {
    Target = Target.slice(1);
    write_HyperlinkString(Target, out);
  } else if (F & 2) {
    data = "e0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" ");
    for (i = 0; i < data.length; ++i) out.write_shift(1, parseInt(data[i], 16));
    var Pretarget = hashidx > -1 ? Target.slice(0, hashidx) : Target;
    out.write_shift(4, 2 * (Pretarget.length + 1));
    for (i = 0; i < Pretarget.length; ++i) out.write_shift(2, Pretarget.charCodeAt(i));
    out.write_shift(2, 0);
    if (F & 8) write_HyperlinkString(hashidx > -1 ? Target.slice(hashidx + 1) : "", out);
  } else {
    data = "03 03 00 00 00 00 00 00 c0 00 00 00 00 00 00 46".split(" ");
    for (i = 0; i < data.length; ++i) out.write_shift(1, parseInt(data[i], 16));
    var P = 0;
    while (Target.slice(P * 3, P * 3 + 3) == "../" || Target.slice(P * 3, P * 3 + 3) == "..\\") ++P;
    out.write_shift(2, P);
    out.write_shift(4, Target.length - 3 * P + 1);
    for (i = 0; i < Target.length - 3 * P; ++i) out.write_shift(1, Target.charCodeAt(i + 3 * P) & 255);
    out.write_shift(1, 0);
    out.write_shift(2, 65535);
    out.write_shift(2, 57005);
    for (i = 0; i < 6; ++i) out.write_shift(4, 0);
  }
  return out.slice(0, out.l);
}
function write_XLSCell(R, C, ixfe, o) {
  if (!o) o = new_buf(6);
  o.write_shift(2, R);
  o.write_shift(2, C);
  o.write_shift(2, ixfe || 0);
  return o;
}
function parse_XTI(blob, length, opts) {
  var w = opts.biff > 8 ? 4 : 2;
  var iSupBook = blob.read_shift(w), itabFirst = blob.read_shift(w, "i"), itabLast = blob.read_shift(w, "i");
  return [iSupBook, itabFirst, itabLast];
}
function parse_Ref8U(blob) {
  var rwFirst = blob.read_shift(2);
  var rwLast = blob.read_shift(2);
  var colFirst = blob.read_shift(2);
  var colLast = blob.read_shift(2);
  return {
    s: {
      c: colFirst,
      r: rwFirst
    },
    e: {
      c: colLast,
      r: rwLast
    }
  };
}
function write_Ref8U(r, o) {
  if (!o) o = new_buf(8);
  o.write_shift(2, r.s.r);
  o.write_shift(2, r.e.r);
  o.write_shift(2, r.s.c);
  o.write_shift(2, r.e.c);
  return o;
}
function write_BOF(wb, t, o) {
  var h = 1536, w = 16;
  switch (o.bookType) {
    case "biff8":
      break;
    case "biff5":
      h = 1280;
      w = 8;
      break;
    case "biff4":
      h = 4;
      w = 6;
      break;
    case "biff3":
      h = 3;
      w = 6;
      break;
    case "biff2":
      h = 2;
      w = 4;
      break;
    case "xla":
      break;
    default:
      throw new Error("unsupported BIFF version");
  }
  var out = new_buf(w);
  out.write_shift(2, h);
  out.write_shift(2, t);
  if (w > 4) out.write_shift(2, 29282);
  if (w > 6) out.write_shift(2, 1997);
  if (w > 8) {
    out.write_shift(2, 49161);
    out.write_shift(2, 1);
    out.write_shift(2, 1798);
    out.write_shift(2, 0);
  }
  return out;
}
function write_WriteAccess(s, opts) {
  var b8 = !opts || opts.biff == 8;
  var o = new_buf(b8 ? 112 : 54);
  o.write_shift(opts.biff == 8 ? 2 : 1, 7);
  if (b8) o.write_shift(1, 0);
  o.write_shift(4, 859007059);
  o.write_shift(4, 5458548 | (b8 ? 0 : 536870912));
  while (o.l < o.length) o.write_shift(1, b8 ? 0 : 32);
  return o;
}
function write_BoundSheet8(data, opts) {
  var w = !opts || opts.biff >= 8 ? 2 : 1;
  var o = new_buf(8 + w * data.name.length);
  o.write_shift(4, data.pos);
  o.write_shift(1, data.hs || 0);
  o.write_shift(1, data.dt);
  o.write_shift(1, data.name.length);
  if (opts.biff >= 8) o.write_shift(1, 1);
  o.write_shift(w * data.name.length, data.name, opts.biff < 8 ? "sbcs" : "utf16le");
  var out = o.slice(0, o.l);
  out.l = o.l;
  return out;
}
function write_SST(sst, opts) {
  var header = new_buf(8);
  header.write_shift(4, sst.Count);
  header.write_shift(4, sst.Unique);
  var strs = [];
  for (var j = 0; j < sst.length; ++j) strs[j] = write_XLUnicodeRichExtendedString(sst[j], opts);
  var o = bconcat([header].concat(strs));
  o.parts = [header.length].concat(strs.map(function(str) {
    return str.length;
  }));
  return o;
}
function write_Window1() {
  var o = new_buf(18);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(2, 29280);
  o.write_shift(2, 17600);
  o.write_shift(2, 56);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(2, 1);
  o.write_shift(2, 500);
  return o;
}
function write_Window2(view) {
  var o = new_buf(18), f = 1718;
  if (view && view.RTL) f |= 64;
  o.write_shift(2, f);
  o.write_shift(4, 0);
  o.write_shift(4, 64);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  return o;
}
function write_Font(data, opts) {
  var name = data.name || "Arial";
  var b5 = opts && opts.biff == 5, w = b5 ? 15 + name.length : 16 + 2 * name.length;
  var o = new_buf(w);
  o.write_shift(2, (data.sz || 12) * 20);
  o.write_shift(4, 0);
  o.write_shift(2, 400);
  o.write_shift(4, 0);
  o.write_shift(2, 0);
  o.write_shift(1, name.length);
  if (!b5) o.write_shift(1, 1);
  o.write_shift((b5 ? 1 : 2) * name.length, name, b5 ? "sbcs" : "utf16le");
  return o;
}
function write_LabelSst(R, C, v, os) {
  var o = new_buf(10);
  write_XLSCell(R, C, os, o);
  o.write_shift(4, v);
  return o;
}
function write_Label(R, C, v, os, opts) {
  var b8 = !opts || opts.biff == 8;
  var o = new_buf(6 + 2 + +b8 + (1 + b8) * v.length);
  write_XLSCell(R, C, os, o);
  o.write_shift(2, v.length);
  if (b8) o.write_shift(1, 1);
  o.write_shift((1 + b8) * v.length, v, b8 ? "utf16le" : "sbcs");
  return o;
}
function write_Format(i, f, opts, o) {
  var b5 = opts && opts.biff == 5;
  if (!o) o = new_buf(b5 ? 3 + f.length : 5 + 2 * f.length);
  o.write_shift(2, i);
  o.write_shift(b5 ? 1 : 2, f.length);
  if (!b5) o.write_shift(1, 1);
  o.write_shift((b5 ? 1 : 2) * f.length, f, b5 ? "sbcs" : "utf16le");
  var out = o.length > o.l ? o.slice(0, o.l) : o;
  if (out.l == null) out.l = out.length;
  return out;
}
function write_Dimensions(range, opts) {
  var w = opts.biff == 8 || !opts.biff ? 4 : 2;
  var o = new_buf(2 * w + 6);
  o.write_shift(w, range.s.r);
  o.write_shift(w, range.e.r + 1);
  o.write_shift(2, range.s.c);
  o.write_shift(2, range.e.c + 1);
  o.write_shift(2, 0);
  return o;
}
function write_XF(data, ixfeP, opts, o) {
  var b5 = opts && opts.biff == 5;
  if (!o) o = new_buf(b5 ? 16 : 20);
  o.write_shift(2, 0);
  if (data.style) {
    o.write_shift(2, data.numFmtId || 0);
    o.write_shift(2, 65524);
  } else {
    o.write_shift(2, data.numFmtId || 0);
    o.write_shift(2, ixfeP << 4);
  }
  var f = 0;
  if (data.numFmtId > 0 && b5) f |= 1024;
  o.write_shift(4, f);
  o.write_shift(4, 0);
  if (!b5) o.write_shift(4, 0);
  o.write_shift(2, 0);
  return o;
}
function write_Guts(guts) {
  var o = new_buf(8);
  o.write_shift(4, 0);
  o.write_shift(2, guts[0] ? guts[0] + 1 : 0);
  o.write_shift(2, guts[1] ? guts[1] + 1 : 0);
  return o;
}
function write_BoolErr(R, C, v, os, opts, t) {
  var o = new_buf(8);
  write_XLSCell(R, C, os, o);
  write_Bes(v, t, o);
  return o;
}
function write_Number(R, C, v, os) {
  var o = new_buf(14);
  write_XLSCell(R, C, os, o);
  write_Xnum(v, o);
  return o;
}
function parse_ExternSheet(blob, length, opts) {
  if (opts.biff < 8) return parse_BIFF5ExternSheet(blob, length, opts);
  var o = [], target = blob.l + length, len = blob.read_shift(opts.biff > 8 ? 4 : 2);
  while (len-- !== 0) o.push(parse_XTI(blob, opts.biff > 8 ? 12 : 6, opts));
  if (blob.l != target) throw new Error("Bad ExternSheet: " + blob.l + " != " + target);
  return o;
}
function parse_BIFF5ExternSheet(blob, length, opts) {
  if (blob[blob.l + 1] == 3) blob[blob.l]++;
  var o = parse_ShortXLUnicodeString(blob, length, opts);
  return o.charCodeAt(0) == 3 ? o.slice(1) : o;
}
function write_MergeCells(merges) {
  var o = new_buf(2 + merges.length * 8);
  o.write_shift(2, merges.length);
  for (var i = 0; i < merges.length; ++i) write_Ref8U(merges[i], o);
  return o;
}
function write_HLink(hl) {
  var O = new_buf(24);
  var ref = decode_cell(hl[0]);
  O.write_shift(2, ref.r);
  O.write_shift(2, ref.r);
  O.write_shift(2, ref.c);
  O.write_shift(2, ref.c);
  var clsid = "d0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" ");
  for (var i = 0; i < 16; ++i) O.write_shift(1, parseInt(clsid[i], 16));
  return bconcat([O, write_Hyperlink(hl[1])]);
}
function write_HLinkTooltip(hl) {
  var TT = hl[1].Tooltip;
  var O = new_buf(10 + 2 * (TT.length + 1));
  O.write_shift(2, 2048);
  var ref = decode_cell(hl[0]);
  O.write_shift(2, ref.r);
  O.write_shift(2, ref.r);
  O.write_shift(2, ref.c);
  O.write_shift(2, ref.c);
  for (var i = 0; i < TT.length; ++i) O.write_shift(2, TT.charCodeAt(i));
  O.write_shift(2, 0);
  return O;
}
function write_Country(o) {
  if (!o) o = new_buf(4);
  o.write_shift(2, 1);
  o.write_shift(2, 1);
  return o;
}
function parse_ColInfo(blob, length, opts) {
  if (!opts.cellStyles) return parsenoop(blob, length);
  var w = opts && opts.biff >= 12 ? 4 : 2;
  var colFirst = blob.read_shift(w);
  var colLast = blob.read_shift(w);
  var coldx = blob.read_shift(w);
  var ixfe = blob.read_shift(w);
  var flags = blob.read_shift(2);
  if (w == 2) blob.l += 2;
  var o = {
    s: colFirst,
    e: colLast,
    w: coldx,
    ixfe,
    flags
  };
  if (opts.biff >= 5 || !opts.biff) o.level = flags >> 8 & 7;
  return o;
}
function write_ColInfo(col, idx) {
  var o = new_buf(12);
  o.write_shift(2, idx);
  o.write_shift(2, idx);
  o.write_shift(2, col.width * 256);
  o.write_shift(2, 0);
  var f = 0;
  if (col.hidden) f |= 1;
  o.write_shift(1, f);
  f = col.level || 0;
  o.write_shift(1, f);
  o.write_shift(2, 0);
  return o;
}
function write_RRTabId(n) {
  var out = new_buf(2 * n);
  for (var i = 0; i < n; ++i) out.write_shift(2, i + 1);
  return out;
}
function write_BIFF2NUM(r, c, val) {
  var out = new_buf(15);
  write_BIFF2Cell(out, r, c);
  out.write_shift(8, val, "f");
  return out;
}
function write_BIFF2INT(r, c, val) {
  var out = new_buf(9);
  write_BIFF2Cell(out, r, c);
  out.write_shift(2, val);
  return out;
}
var DBF = /* @__PURE__ */ function() {
  var dbf_codepage_map = {
    /* Code Pages Supported by Visual FoxPro */
    /*::[*/
    1: 437,
    /*::[*/
    2: 850,
    /*::[*/
    3: 1252,
    /*::[*/
    4: 1e4,
    /*::[*/
    100: 852,
    /*::[*/
    101: 866,
    /*::[*/
    102: 865,
    /*::[*/
    103: 861,
    /*::[*/
    104: 895,
    /*::[*/
    105: 620,
    /*::[*/
    106: 737,
    /*::[*/
    107: 857,
    /*::[*/
    120: 950,
    /*::[*/
    121: 949,
    /*::[*/
    122: 936,
    /*::[*/
    123: 932,
    /*::[*/
    124: 874,
    /*::[*/
    125: 1255,
    /*::[*/
    126: 1256,
    /*::[*/
    150: 10007,
    /*::[*/
    151: 10029,
    /*::[*/
    152: 10006,
    /*::[*/
    200: 1250,
    /*::[*/
    201: 1251,
    /*::[*/
    202: 1254,
    /*::[*/
    203: 1253,
    /* shapefile DBF extension */
    /*::[*/
    0: 20127,
    /*::[*/
    8: 865,
    /*::[*/
    9: 437,
    /*::[*/
    10: 850,
    /*::[*/
    11: 437,
    /*::[*/
    13: 437,
    /*::[*/
    14: 850,
    /*::[*/
    15: 437,
    /*::[*/
    16: 850,
    /*::[*/
    17: 437,
    /*::[*/
    18: 850,
    /*::[*/
    19: 932,
    /*::[*/
    20: 850,
    /*::[*/
    21: 437,
    /*::[*/
    22: 850,
    /*::[*/
    23: 865,
    /*::[*/
    24: 437,
    /*::[*/
    25: 437,
    /*::[*/
    26: 850,
    /*::[*/
    27: 437,
    /*::[*/
    28: 863,
    /*::[*/
    29: 850,
    /*::[*/
    31: 852,
    /*::[*/
    34: 852,
    /*::[*/
    35: 852,
    /*::[*/
    36: 860,
    /*::[*/
    37: 850,
    /*::[*/
    38: 866,
    /*::[*/
    55: 850,
    /*::[*/
    64: 852,
    /*::[*/
    77: 936,
    /*::[*/
    78: 949,
    /*::[*/
    79: 950,
    /*::[*/
    80: 874,
    /*::[*/
    87: 1252,
    /*::[*/
    88: 1252,
    /*::[*/
    89: 1252,
    /*::[*/
    108: 863,
    /*::[*/
    134: 737,
    /*::[*/
    135: 852,
    /*::[*/
    136: 857,
    /*::[*/
    204: 1257,
    /*::[*/
    255: 16969
  };
  var dbf_reverse_map = evert({
    /*::[*/
    1: 437,
    /*::[*/
    2: 850,
    /*::[*/
    3: 1252,
    /*::[*/
    4: 1e4,
    /*::[*/
    100: 852,
    /*::[*/
    101: 866,
    /*::[*/
    102: 865,
    /*::[*/
    103: 861,
    /*::[*/
    104: 895,
    /*::[*/
    105: 620,
    /*::[*/
    106: 737,
    /*::[*/
    107: 857,
    /*::[*/
    120: 950,
    /*::[*/
    121: 949,
    /*::[*/
    122: 936,
    /*::[*/
    123: 932,
    /*::[*/
    124: 874,
    /*::[*/
    125: 1255,
    /*::[*/
    126: 1256,
    /*::[*/
    150: 10007,
    /*::[*/
    151: 10029,
    /*::[*/
    152: 10006,
    /*::[*/
    200: 1250,
    /*::[*/
    201: 1251,
    /*::[*/
    202: 1254,
    /*::[*/
    203: 1253,
    /*::[*/
    0: 20127
  });
  function dbf_to_aoa(buf, opts) {
    var out = [];
    var d = new_raw_buf(1);
    switch (opts.type) {
      case "base64":
        d = s2a(Base64_decode(buf));
        break;
      case "binary":
        d = s2a(buf);
        break;
      case "buffer":
      case "array":
        d = buf;
        break;
    }
    prep_blob(d, 0);
    var ft = d.read_shift(1);
    var memo = !!(ft & 136);
    var vfp = false, l7 = false;
    switch (ft) {
      case 2:
        break;
      case 3:
        break;
      case 48:
        vfp = true;
        memo = true;
        break;
      case 49:
        vfp = true;
        memo = true;
        break;
      case 131:
        break;
      case 139:
        break;
      case 140:
        l7 = true;
        break;
      case 245:
        break;
      default:
        throw new Error("DBF Unsupported Version: " + ft.toString(16));
    }
    var nrow = 0, fpos = 521;
    if (ft == 2) nrow = d.read_shift(2);
    d.l += 3;
    if (ft != 2) nrow = d.read_shift(4);
    if (nrow > 1048576) nrow = 1e6;
    if (ft != 2) fpos = d.read_shift(2);
    var rlen = d.read_shift(2);
    var current_cp = opts.codepage || 1252;
    if (ft != 2) {
      d.l += 16;
      d.read_shift(1);
      if (d[d.l] !== 0) current_cp = dbf_codepage_map[d[d.l]];
      d.l += 1;
      d.l += 2;
    }
    if (l7) d.l += 36;
    var fields = [], field = {};
    var hend = Math.min(d.length, ft == 2 ? 521 : fpos - 10 - (vfp ? 264 : 0));
    var ww = l7 ? 32 : 11;
    while (d.l < hend && d[d.l] != 13) {
      field = {};
      field.name = $cptable.utils.decode(current_cp, d.slice(d.l, d.l + ww)).replace(/[\u0000\r\n].*$/g, "");
      d.l += ww;
      field.type = String.fromCharCode(d.read_shift(1));
      if (ft != 2 && !l7) field.offset = d.read_shift(4);
      field.len = d.read_shift(1);
      if (ft == 2) field.offset = d.read_shift(2);
      field.dec = d.read_shift(1);
      if (field.name.length) fields.push(field);
      if (ft != 2) d.l += l7 ? 13 : 14;
      switch (field.type) {
        case "B":
          if ((!vfp || field.len != 8) && opts.WTF) console.log("Skipping " + field.name + ":" + field.type);
          break;
        case "G":
        case "P":
          if (opts.WTF) console.log("Skipping " + field.name + ":" + field.type);
          break;
        case "+":
        case "0":
        case "@":
        case "C":
        case "D":
        case "F":
        case "I":
        case "L":
        case "M":
        case "N":
        case "O":
        case "T":
        case "Y":
          break;
        default:
          throw new Error("Unknown Field Type: " + field.type);
      }
    }
    if (d[d.l] !== 13) d.l = fpos - 1;
    if (d.read_shift(1) !== 13) throw new Error("DBF Terminator not found " + d.l + " " + d[d.l]);
    d.l = fpos;
    var R = 0, C = 0;
    out[0] = [];
    for (C = 0; C != fields.length; ++C) out[0][C] = fields[C].name;
    while (nrow-- > 0) {
      if (d[d.l] === 42) {
        d.l += rlen;
        continue;
      }
      ++d.l;
      out[++R] = [];
      C = 0;
      for (C = 0; C != fields.length; ++C) {
        var dd = d.slice(d.l, d.l + fields[C].len);
        d.l += fields[C].len;
        prep_blob(dd, 0);
        var s = $cptable.utils.decode(current_cp, dd);
        switch (fields[C].type) {
          case "C":
            if (s.trim().length) out[R][C] = s.replace(/\s+$/, "");
            break;
          case "D":
            if (s.length === 8) out[R][C] = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
            else out[R][C] = s;
            break;
          case "F":
            out[R][C] = parseFloat(s.trim());
            break;
          case "+":
          case "I":
            out[R][C] = l7 ? dd.read_shift(-4, "i") ^ 2147483648 : dd.read_shift(4, "i");
            break;
          case "L":
            switch (s.trim().toUpperCase()) {
              case "Y":
              case "T":
                out[R][C] = true;
                break;
              case "N":
              case "F":
                out[R][C] = false;
                break;
              case "":
              case "?":
                break;
              default:
                throw new Error("DBF Unrecognized L:|" + s + "|");
            }
            break;
          case "M":
            if (!memo) throw new Error("DBF Unexpected MEMO for type " + ft.toString(16));
            out[R][C] = "##MEMO##" + (l7 ? parseInt(s.trim(), 10) : dd.read_shift(4));
            break;
          case "N":
            s = s.replace(/\u0000/g, "").trim();
            if (s && s != ".") out[R][C] = +s || 0;
            break;
          case "@":
            out[R][C] = new Date(dd.read_shift(-8, "f") - 621356832e5);
            break;
          case "T":
            out[R][C] = new Date((dd.read_shift(4) - 2440588) * 864e5 + dd.read_shift(4));
            break;
          case "Y":
            out[R][C] = dd.read_shift(4, "i") / 1e4 + dd.read_shift(4, "i") / 1e4 * Math.pow(2, 32);
            break;
          case "O":
            out[R][C] = -dd.read_shift(-8, "f");
            break;
          case "B":
            if (vfp && fields[C].len == 8) {
              out[R][C] = dd.read_shift(8, "f");
              break;
            }
          case "G":
          case "P":
            dd.l += fields[C].len;
            break;
          case "0":
            if (fields[C].name === "_NullFlags") break;
          default:
            throw new Error("DBF Unsupported data type " + fields[C].type);
        }
      }
    }
    if (ft != 2) {
      if (d.l < d.length && d[d.l++] != 26) throw new Error("DBF EOF Marker missing " + (d.l - 1) + " of " + d.length + " " + d[d.l - 1].toString(16));
    }
    if (opts && opts.sheetRows) out = out.slice(0, opts.sheetRows);
    opts.DBF = fields;
    return out;
  }
  function dbf_to_sheet(buf, opts) {
    var o = opts || {};
    if (!o.dateNF) o.dateNF = "yyyymmdd";
    var ws = aoa_to_sheet(dbf_to_aoa(buf, o), o);
    ws["!cols"] = o.DBF.map(function(field) {
      return {
        wch: field.len,
        DBF: field
      };
    });
    delete o.DBF;
    return ws;
  }
  function dbf_to_workbook(buf, opts) {
    try {
      return sheet_to_workbook(dbf_to_sheet(buf, opts), opts);
    } catch (e) {
      if (opts && opts.WTF) throw e;
    }
    return {
      SheetNames: [],
      Sheets: {}
    };
  }
  var _RLEN = {
    "B": 8,
    "C": 250,
    "L": 1,
    "D": 8,
    "?": 0,
    "": 0
  };
  function sheet_to_dbf(ws, opts) {
    var o = opts || {};
    if (+o.codepage >= 0) set_cp(+o.codepage);
    if (o.type == "string") throw new Error("Cannot write DBF to JS string");
    var ba = buf_array();
    var aoa = sheet_to_json(ws, {
      header: 1,
      raw: true,
      cellDates: true
    });
    var headers = aoa[0], data = aoa.slice(1), cols = ws["!cols"] || [];
    var i = 0, j = 0, hcnt = 0, rlen = 1;
    for (i = 0; i < headers.length; ++i) {
      if (((cols[i] || {}).DBF || {}).name) {
        headers[i] = cols[i].DBF.name;
        ++hcnt;
        continue;
      }
      if (headers[i] == null) continue;
      ++hcnt;
      if (typeof headers[i] === "number") headers[i] = headers[i].toString(10);
      if (typeof headers[i] !== "string") throw new Error("DBF Invalid column name " + headers[i] + " |" + typeof headers[i] + "|");
      if (headers.indexOf(headers[i]) !== i) {
        for (j = 0; j < 1024; ++j) if (headers.indexOf(headers[i] + "_" + j) == -1) {
          headers[i] += "_" + j;
          break;
        }
      }
    }
    var range = safe_decode_range(ws["!ref"]);
    var coltypes = [];
    var colwidths = [];
    var coldecimals = [];
    for (i = 0; i <= range.e.c - range.s.c; ++i) {
      var guess = "", _guess = "", maxlen = 0;
      var col = [];
      for (j = 0; j < data.length; ++j) {
        if (data[j][i] != null) col.push(data[j][i]);
      }
      if (col.length == 0 || headers[i] == null) {
        coltypes[i] = "?";
        continue;
      }
      for (j = 0; j < col.length; ++j) {
        switch (typeof col[j]) {
          case "number":
            _guess = "B";
            break;
          case "string":
            _guess = "C";
            break;
          case "boolean":
            _guess = "L";
            break;
          case "object":
            _guess = col[j] instanceof Date ? "D" : "C";
            break;
          default:
            _guess = "C";
        }
        maxlen = Math.max(maxlen, String(col[j]).length);
        guess = guess && guess != _guess ? "C" : _guess;
      }
      if (maxlen > 250) maxlen = 250;
      _guess = ((cols[i] || {}).DBF || {}).type;
      if (_guess == "C") {
        if (cols[i].DBF.len > maxlen) maxlen = cols[i].DBF.len;
      }
      if (guess == "B" && _guess == "N") {
        guess = "N";
        coldecimals[i] = cols[i].DBF.dec;
        maxlen = cols[i].DBF.len;
      }
      colwidths[i] = guess == "C" || _guess == "N" ? maxlen : _RLEN[guess] || 0;
      rlen += colwidths[i];
      coltypes[i] = guess;
    }
    var h = ba.next(32);
    h.write_shift(4, 318902576);
    h.write_shift(4, data.length);
    h.write_shift(2, 296 + 32 * hcnt);
    h.write_shift(2, rlen);
    for (i = 0; i < 4; ++i) h.write_shift(4, 0);
    h.write_shift(4, 0 | (+dbf_reverse_map[
      /*::String(*/
      current_ansi
      /*::)*/
    ] || 3) << 8);
    for (i = 0, j = 0; i < headers.length; ++i) {
      if (headers[i] == null) continue;
      var hf = ba.next(32);
      var _f = (headers[i].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
      hf.write_shift(1, _f, "sbcs");
      hf.write_shift(1, coltypes[i] == "?" ? "C" : coltypes[i], "sbcs");
      hf.write_shift(4, j);
      hf.write_shift(1, colwidths[i] || _RLEN[coltypes[i]] || 0);
      hf.write_shift(1, coldecimals[i] || 0);
      hf.write_shift(1, 2);
      hf.write_shift(4, 0);
      hf.write_shift(1, 0);
      hf.write_shift(4, 0);
      hf.write_shift(4, 0);
      j += colwidths[i] || _RLEN[coltypes[i]] || 0;
    }
    var hb = ba.next(264);
    hb.write_shift(4, 13);
    for (i = 0; i < 65; ++i) hb.write_shift(4, 0);
    for (i = 0; i < data.length; ++i) {
      var rout = ba.next(rlen);
      rout.write_shift(1, 0);
      for (j = 0; j < headers.length; ++j) {
        if (headers[j] == null) continue;
        switch (coltypes[j]) {
          case "L":
            rout.write_shift(1, data[i][j] == null ? 63 : data[i][j] ? 84 : 70);
            break;
          case "B":
            rout.write_shift(8, data[i][j] || 0, "f");
            break;
          case "N":
            var _n = "0";
            if (typeof data[i][j] == "number") _n = data[i][j].toFixed(coldecimals[j] || 0);
            for (hcnt = 0; hcnt < colwidths[j] - _n.length; ++hcnt) rout.write_shift(1, 32);
            rout.write_shift(1, _n, "sbcs");
            break;
          case "D":
            if (!data[i][j]) rout.write_shift(8, "00000000", "sbcs");
            else {
              rout.write_shift(4, ("0000" + data[i][j].getFullYear()).slice(-4), "sbcs");
              rout.write_shift(2, ("00" + (data[i][j].getMonth() + 1)).slice(-2), "sbcs");
              rout.write_shift(2, ("00" + data[i][j].getDate()).slice(-2), "sbcs");
            }
            break;
          case "C":
            var _s = String(data[i][j] != null ? data[i][j] : "").slice(0, colwidths[j]);
            rout.write_shift(1, _s, "sbcs");
            for (hcnt = 0; hcnt < colwidths[j] - _s.length; ++hcnt) rout.write_shift(1, 32);
            break;
        }
      }
    }
    ba.next(1).write_shift(1, 26);
    return ba.end();
  }
  return {
    to_workbook: dbf_to_workbook,
    to_sheet: dbf_to_sheet,
    from_sheet: sheet_to_dbf
  };
}();
var SYLK = /* @__PURE__ */ function() {
  var sylk_escapes = {
    AA: "\xC0",
    BA: "\xC1",
    CA: "\xC2",
    DA: 195,
    HA: "\xC4",
    JA: 197,
    AE: "\xC8",
    BE: "\xC9",
    CE: "\xCA",
    HE: "\xCB",
    AI: "\xCC",
    BI: "\xCD",
    CI: "\xCE",
    HI: "\xCF",
    AO: "\xD2",
    BO: "\xD3",
    CO: "\xD4",
    DO: 213,
    HO: "\xD6",
    AU: "\xD9",
    BU: "\xDA",
    CU: "\xDB",
    HU: "\xDC",
    Aa: "\xE0",
    Ba: "\xE1",
    Ca: "\xE2",
    Da: 227,
    Ha: "\xE4",
    Ja: 229,
    Ae: "\xE8",
    Be: "\xE9",
    Ce: "\xEA",
    He: "\xEB",
    Ai: "\xEC",
    Bi: "\xED",
    Ci: "\xEE",
    Hi: "\xEF",
    Ao: "\xF2",
    Bo: "\xF3",
    Co: "\xF4",
    Do: 245,
    Ho: "\xF6",
    Au: "\xF9",
    Bu: "\xFA",
    Cu: "\xFB",
    Hu: "\xFC",
    KC: "\xC7",
    Kc: "\xE7",
    q: "\xE6",
    z: "\u0153",
    a: "\xC6",
    j: "\u0152",
    DN: 209,
    Dn: 241,
    Hy: 255,
    S: 169,
    c: 170,
    R: 174,
    "B ": 180,
    /*::[*/
    0: 176,
    /*::[*/
    1: 177,
    /*::[*/
    2: 178,
    /*::[*/
    3: 179,
    /*::[*/
    5: 181,
    /*::[*/
    6: 182,
    /*::[*/
    7: 183,
    Q: 185,
    k: 186,
    b: 208,
    i: 216,
    l: 222,
    s: 240,
    y: 248,
    "!": 161,
    '"': 162,
    "#": 163,
    "(": 164,
    "%": 165,
    "'": 167,
    "H ": 168,
    "+": 171,
    ";": 187,
    "<": 188,
    "=": 189,
    ">": 190,
    "?": 191,
    "{": 223
  };
  var sylk_char_regex = new RegExp("\x1BN(" + keys(sylk_escapes).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g, "\\$1") + "|\\|)", "gm");
  var sylk_char_fn = function(_, $1) {
    var o = sylk_escapes[$1];
    return typeof o == "number" ? _getansi(o) : o;
  };
  var decode_sylk_char = function($$, $1, $2) {
    var newcc = $1.charCodeAt(0) - 32 << 4 | $2.charCodeAt(0) - 48;
    return newcc == 59 ? $$ : _getansi(newcc);
  };
  sylk_escapes["|"] = 254;
  function sylk_to_aoa(d, opts) {
    switch (opts.type) {
      case "base64":
        return sylk_to_aoa_str(Base64_decode(d), opts);
      case "binary":
        return sylk_to_aoa_str(d, opts);
      case "buffer":
        return sylk_to_aoa_str(has_buf && Buffer.isBuffer(d) ? d.toString("binary") : a2s(d), opts);
      case "array":
        return sylk_to_aoa_str(cc2str(d), opts);
    }
    throw new Error("Unrecognized type " + opts.type);
  }
  function sylk_to_aoa_str(str, opts) {
    var records = str.split(/[\n\r]+/), R = -1, C = -1, ri = 0, rj = 0, arr = [];
    var formats = [];
    var next_cell_format = null;
    var sht = {}, rowinfo = [], colinfo = [], cw = [];
    var Mval = 0, j;
    if (+opts.codepage >= 0) set_cp(+opts.codepage);
    for (; ri !== records.length; ++ri) {
      Mval = 0;
      var rstr = records[ri].trim().replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, decode_sylk_char).replace(sylk_char_regex, sylk_char_fn);
      var record = rstr.replace(/;;/g, "\0").split(";").map(function(x) {
        return x.replace(/\u0000/g, ";");
      });
      var RT = record[0], val;
      if (rstr.length > 0) switch (RT) {
        case "ID":
          break;
        case "E":
          break;
        case "B":
          break;
        case "O":
          break;
        case "W":
          break;
        case "P":
          if (record[1].charAt(0) == "P") formats.push(rstr.slice(3).replace(/;;/g, ";"));
          break;
        case "C":
          var C_seen_K = false, C_seen_X = false, C_seen_S = false, C_seen_E = false, _R = -1, _C = -1;
          for (rj = 1; rj < record.length; ++rj) switch (record[rj].charAt(0)) {
            case "A":
              break;
            case "X":
              C = parseInt(record[rj].slice(1)) - 1;
              C_seen_X = true;
              break;
            case "Y":
              R = parseInt(record[rj].slice(1)) - 1;
              if (!C_seen_X) C = 0;
              for (j = arr.length; j <= R; ++j) arr[j] = [];
              break;
            case "K":
              val = record[rj].slice(1);
              if (val.charAt(0) === '"') val = val.slice(1, val.length - 1);
              else if (val === "TRUE") val = true;
              else if (val === "FALSE") val = false;
              else if (!isNaN(fuzzynum(val))) {
                val = fuzzynum(val);
                if (next_cell_format !== null && fmt_is_date(next_cell_format)) val = numdate(val);
              } else if (!isNaN(fuzzydate(val).getDate())) {
                val = parseDate(val);
              }
              if (typeof $cptable !== "undefined" && typeof val == "string" && (opts || {}).type != "string" && (opts || {}).codepage) val = $cptable.utils.decode(opts.codepage, val);
              C_seen_K = true;
              break;
            case "E":
              C_seen_E = true;
              var formula = rc_to_a1(record[rj].slice(1), {
                r: R,
                c: C
              });
              arr[R][C] = [arr[R][C], formula];
              break;
            case "S":
              C_seen_S = true;
              arr[R][C] = [arr[R][C], "S5S"];
              break;
            case "G":
              break;
            case "R":
              _R = parseInt(record[rj].slice(1)) - 1;
              break;
            case "C":
              _C = parseInt(record[rj].slice(1)) - 1;
              break;
            default:
              if (opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
          }
          if (C_seen_K) {
            if (arr[R][C] && arr[R][C].length == 2) arr[R][C][0] = val;
            else arr[R][C] = val;
            next_cell_format = null;
          }
          if (C_seen_S) {
            if (C_seen_E) throw new Error("SYLK shared formula cannot have own formula");
            var shrbase = _R > -1 && arr[_R][_C];
            if (!shrbase || !shrbase[1]) throw new Error("SYLK shared formula cannot find base");
            arr[R][C][1] = shift_formula_str(shrbase[1], {
              r: R - _R,
              c: C - _C
            });
          }
          break;
        case "F":
          var F_seen = 0;
          for (rj = 1; rj < record.length; ++rj) switch (record[rj].charAt(0)) {
            case "X":
              C = parseInt(record[rj].slice(1)) - 1;
              ++F_seen;
              break;
            case "Y":
              R = parseInt(record[rj].slice(1)) - 1;
              for (j = arr.length; j <= R; ++j) arr[j] = [];
              break;
            case "M":
              Mval = parseInt(record[rj].slice(1)) / 20;
              break;
            case "F":
              break;
            case "G":
              break;
            case "P":
              next_cell_format = formats[parseInt(record[rj].slice(1))];
              break;
            case "S":
              break;
            case "D":
              break;
            case "N":
              break;
            case "W":
              cw = record[rj].slice(1).split(" ");
              for (j = parseInt(cw[0], 10); j <= parseInt(cw[1], 10); ++j) {
                Mval = parseInt(cw[2], 10);
                colinfo[j - 1] = Mval === 0 ? {
                  hidden: true
                } : {
                  wch: Mval
                };
                process_col(colinfo[j - 1]);
              }
              break;
            case "C":
              C = parseInt(record[rj].slice(1)) - 1;
              if (!colinfo[C]) colinfo[C] = {};
              break;
            case "R":
              R = parseInt(record[rj].slice(1)) - 1;
              if (!rowinfo[R]) rowinfo[R] = {};
              if (Mval > 0) {
                rowinfo[R].hpt = Mval;
                rowinfo[R].hpx = pt2px(Mval);
              } else if (Mval === 0) rowinfo[R].hidden = true;
              break;
            default:
              if (opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
          }
          if (F_seen < 1) next_cell_format = null;
          break;
        default:
          if (opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
      }
    }
    if (rowinfo.length > 0) sht["!rows"] = rowinfo;
    if (colinfo.length > 0) sht["!cols"] = colinfo;
    if (opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
    return [arr, sht];
  }
  function sylk_to_sheet(d, opts) {
    var aoasht = sylk_to_aoa(d, opts);
    var aoa = aoasht[0], ws = aoasht[1];
    var o = aoa_to_sheet(aoa, opts);
    keys(ws).forEach(function(k) {
      o[k] = ws[k];
    });
    return o;
  }
  function sylk_to_workbook(d, opts) {
    return sheet_to_workbook(sylk_to_sheet(d, opts), opts);
  }
  function write_ws_cell_sylk(cell, ws, R, C) {
    var o = "C;Y" + (R + 1) + ";X" + (C + 1) + ";K";
    switch (cell.t) {
      case "n":
        o += cell.v || 0;
        if (cell.f && !cell.F) o += ";E" + a1_to_rc(cell.f, {
          r: R,
          c: C
        });
        break;
      case "b":
        o += cell.v ? "TRUE" : "FALSE";
        break;
      case "e":
        o += cell.w || cell.v;
        break;
      case "d":
        o += '"' + (cell.w || cell.v) + '"';
        break;
      case "s":
        o += '"' + cell.v.replace(/"/g, "").replace(/;/g, ";;") + '"';
        break;
    }
    return o;
  }
  function write_ws_cols_sylk(out, cols) {
    cols.forEach(function(col, i) {
      var rec = "F;W" + (i + 1) + " " + (i + 1) + " ";
      if (col.hidden) rec += "0";
      else {
        if (typeof col.width == "number" && !col.wpx) col.wpx = width2px(col.width);
        if (typeof col.wpx == "number" && !col.wch) col.wch = px2char(col.wpx);
        if (typeof col.wch == "number") rec += Math.round(col.wch);
      }
      if (rec.charAt(rec.length - 1) != " ") out.push(rec);
    });
  }
  function write_ws_rows_sylk(out, rows) {
    rows.forEach(function(row, i) {
      var rec = "F;";
      if (row.hidden) rec += "M0;";
      else if (row.hpt) rec += "M" + 20 * row.hpt + ";";
      else if (row.hpx) rec += "M" + 20 * px2pt(row.hpx) + ";";
      if (rec.length > 2) out.push(rec + "R" + (i + 1));
    });
  }
  function sheet_to_sylk(ws, opts) {
    var preamble = ["ID;PWXL;N;E"], o = [];
    var r = safe_decode_range(ws["!ref"]), cell;
    var dense = Array.isArray(ws);
    var RS = "\r\n";
    preamble.push("P;PGeneral");
    preamble.push("F;P0;DG0G8;M255");
    if (ws["!cols"]) write_ws_cols_sylk(preamble, ws["!cols"]);
    if (ws["!rows"]) write_ws_rows_sylk(preamble, ws["!rows"]);
    preamble.push("B;Y" + (r.e.r - r.s.r + 1) + ";X" + (r.e.c - r.s.c + 1) + ";D" + [r.s.c, r.s.r, r.e.c, r.e.r].join(" "));
    for (var R = r.s.r; R <= r.e.r; ++R) {
      for (var C = r.s.c; C <= r.e.c; ++C) {
        var coord = encode_cell({
          r: R,
          c: C
        });
        cell = dense ? (ws[R] || [])[C] : ws[coord];
        if (!cell || cell.v == null && (!cell.f || cell.F)) continue;
        o.push(write_ws_cell_sylk(cell, ws, R, C, opts));
      }
    }
    return preamble.join(RS) + RS + o.join(RS) + RS + "E" + RS;
  }
  return {
    to_workbook: sylk_to_workbook,
    to_sheet: sylk_to_sheet,
    from_sheet: sheet_to_sylk
  };
}();
var DIF = /* @__PURE__ */ function() {
  function dif_to_aoa(d, opts) {
    switch (opts.type) {
      case "base64":
        return dif_to_aoa_str(Base64_decode(d), opts);
      case "binary":
        return dif_to_aoa_str(d, opts);
      case "buffer":
        return dif_to_aoa_str(has_buf && Buffer.isBuffer(d) ? d.toString("binary") : a2s(d), opts);
      case "array":
        return dif_to_aoa_str(cc2str(d), opts);
    }
    throw new Error("Unrecognized type " + opts.type);
  }
  function dif_to_aoa_str(str, opts) {
    var records = str.split("\n"), R = -1, C = -1, ri = 0, arr = [];
    for (; ri !== records.length; ++ri) {
      if (records[ri].trim() === "BOT") {
        arr[++R] = [];
        C = 0;
        continue;
      }
      if (R < 0) continue;
      var metadata = records[ri].trim().split(",");
      var type = metadata[0], value = metadata[1];
      ++ri;
      var data = records[ri] || "";
      while ((data.match(/["]/g) || []).length & 1 && ri < records.length - 1) data += "\n" + records[++ri];
      data = data.trim();
      switch (+type) {
        case -1:
          if (data === "BOT") {
            arr[++R] = [];
            C = 0;
            continue;
          } else if (data !== "EOD") throw new Error("Unrecognized DIF special command " + data);
          break;
        case 0:
          if (data === "TRUE") arr[R][C] = true;
          else if (data === "FALSE") arr[R][C] = false;
          else if (!isNaN(fuzzynum(value))) arr[R][C] = fuzzynum(value);
          else if (!isNaN(fuzzydate(value).getDate())) arr[R][C] = parseDate(value);
          else arr[R][C] = value;
          ++C;
          break;
        case 1:
          data = data.slice(1, data.length - 1);
          data = data.replace(/""/g, '"');
          if (DIF_XL && data && data.match(/^=".*"$/)) data = data.slice(2, -1);
          arr[R][C++] = data !== "" ? data : null;
          break;
      }
      if (data === "EOD") break;
    }
    if (opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
    return arr;
  }
  function dif_to_sheet(str, opts) {
    return aoa_to_sheet(dif_to_aoa(str, opts), opts);
  }
  function dif_to_workbook(str, opts) {
    return sheet_to_workbook(dif_to_sheet(str, opts), opts);
  }
  var sheet_to_dif = /* @__PURE__ */ function() {
    var push_field = function pf(o, topic, v, n, s) {
      o.push(topic);
      o.push(v + "," + n);
      o.push('"' + s.replace(/"/g, '""') + '"');
    };
    var push_value = function po(o, type, v, s) {
      o.push(type + "," + v);
      o.push(type == 1 ? '"' + s.replace(/"/g, '""') + '"' : s);
    };
    return function sheet_to_dif2(ws) {
      var o = [];
      var r = safe_decode_range(ws["!ref"]), cell;
      var dense = Array.isArray(ws);
      push_field(o, "TABLE", 0, 1, "sheetjs");
      push_field(o, "VECTORS", 0, r.e.r - r.s.r + 1, "");
      push_field(o, "TUPLES", 0, r.e.c - r.s.c + 1, "");
      push_field(o, "DATA", 0, 0, "");
      for (var R = r.s.r; R <= r.e.r; ++R) {
        push_value(o, -1, 0, "BOT");
        for (var C = r.s.c; C <= r.e.c; ++C) {
          var coord = encode_cell({
            r: R,
            c: C
          });
          cell = dense ? (ws[R] || [])[C] : ws[coord];
          if (!cell) {
            push_value(o, 1, 0, "");
            continue;
          }
          switch (cell.t) {
            case "n":
              var val = DIF_XL ? cell.w : cell.v;
              if (!val && cell.v != null) val = cell.v;
              if (val == null) {
                if (DIF_XL && cell.f && !cell.F) push_value(o, 1, 0, "=" + cell.f);
                else push_value(o, 1, 0, "");
              } else push_value(o, 0, val, "V");
              break;
            case "b":
              push_value(o, 0, cell.v ? 1 : 0, cell.v ? "TRUE" : "FALSE");
              break;
            case "s":
              push_value(o, 1, 0, !DIF_XL || isNaN(cell.v) ? cell.v : '="' + cell.v + '"');
              break;
            case "d":
              if (!cell.w) cell.w = SSF_format(cell.z || table_fmt[14], datenum(parseDate(cell.v)));
              if (DIF_XL) push_value(o, 0, cell.w, "V");
              else push_value(o, 1, 0, cell.w);
              break;
            default:
              push_value(o, 1, 0, "");
          }
        }
      }
      push_value(o, -1, 0, "EOD");
      var RS = "\r\n";
      var oo = o.join(RS);
      return oo;
    };
  }();
  return {
    to_workbook: dif_to_workbook,
    to_sheet: dif_to_sheet,
    from_sheet: sheet_to_dif
  };
}();
var ETH = /* @__PURE__ */ function() {
  function decode(s) {
    return s.replace(/\\b/g, "\\").replace(/\\c/g, ":").replace(/\\n/g, "\n");
  }
  function encode(s) {
    return s.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n");
  }
  function eth_to_aoa(str, opts) {
    var records = str.split("\n"), R = -1, C = -1, ri = 0, arr = [];
    for (; ri !== records.length; ++ri) {
      var record = records[ri].trim().split(":");
      if (record[0] !== "cell") continue;
      var addr = decode_cell(record[1]);
      if (arr.length <= addr.r) {
        for (R = arr.length; R <= addr.r; ++R) if (!arr[R]) arr[R] = [];
      }
      R = addr.r;
      C = addr.c;
      switch (record[2]) {
        case "t":
          arr[R][C] = decode(record[3]);
          break;
        case "v":
          arr[R][C] = +record[3];
          break;
        case "vtf":
          var _f = record[record.length - 1];
        case "vtc":
          switch (record[3]) {
            case "nl":
              arr[R][C] = +record[4] ? true : false;
              break;
            default:
              arr[R][C] = +record[4];
              break;
          }
          if (record[2] == "vtf") arr[R][C] = [arr[R][C], _f];
      }
    }
    if (opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
    return arr;
  }
  function eth_to_sheet(d, opts) {
    return aoa_to_sheet(eth_to_aoa(d, opts), opts);
  }
  function eth_to_workbook(d, opts) {
    return sheet_to_workbook(eth_to_sheet(d, opts), opts);
  }
  var header = ["socialcalc:version:1.5", "MIME-Version: 1.0", "Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"].join("\n");
  var sep = ["--SocialCalcSpreadsheetControlSave", "Content-type: text/plain; charset=UTF-8"].join("\n") + "\n";
  var meta = ["# SocialCalc Spreadsheet Control Save", "part:sheet"].join("\n");
  var end = "--SocialCalcSpreadsheetControlSave--";
  function sheet_to_eth_data(ws) {
    if (!ws || !ws["!ref"]) return "";
    var o = [], oo = [], cell, coord = "";
    var r = decode_range(ws["!ref"]);
    var dense = Array.isArray(ws);
    for (var R = r.s.r; R <= r.e.r; ++R) {
      for (var C = r.s.c; C <= r.e.c; ++C) {
        coord = encode_cell({
          r: R,
          c: C
        });
        cell = dense ? (ws[R] || [])[C] : ws[coord];
        if (!cell || cell.v == null || cell.t === "z") continue;
        oo = ["cell", coord, "t"];
        switch (cell.t) {
          case "s":
          case "str":
            oo.push(encode(cell.v));
            break;
          case "n":
            if (!cell.f) {
              oo[2] = "v";
              oo[3] = cell.v;
            } else {
              oo[2] = "vtf";
              oo[3] = "n";
              oo[4] = cell.v;
              oo[5] = encode(cell.f);
            }
            break;
          case "b":
            oo[2] = "vt" + (cell.f ? "f" : "c");
            oo[3] = "nl";
            oo[4] = cell.v ? "1" : "0";
            oo[5] = encode(cell.f || (cell.v ? "TRUE" : "FALSE"));
            break;
          case "d":
            var t = datenum(parseDate(cell.v));
            oo[2] = "vtc";
            oo[3] = "nd";
            oo[4] = "" + t;
            oo[5] = cell.w || SSF_format(cell.z || table_fmt[14], t);
            break;
          case "e":
            continue;
        }
        o.push(oo.join(":"));
      }
    }
    o.push("sheet:c:" + (r.e.c - r.s.c + 1) + ":r:" + (r.e.r - r.s.r + 1) + ":tvf:1");
    o.push("valueformat:1:text-wiki");
    return o.join("\n");
  }
  function sheet_to_eth(ws) {
    return [header, sep, meta, sep, sheet_to_eth_data(ws), end].join("\n");
  }
  return {
    to_workbook: eth_to_workbook,
    to_sheet: eth_to_sheet,
    from_sheet: sheet_to_eth
  };
}();
var PRN = /* @__PURE__ */ function() {
  function set_text_arr(data, arr, R, C, o) {
    if (o.raw) arr[R][C] = data;
    else if (data === "") {
    } else if (data === "TRUE") arr[R][C] = true;
    else if (data === "FALSE") arr[R][C] = false;
    else if (!isNaN(fuzzynum(data))) arr[R][C] = fuzzynum(data);
    else if (!isNaN(fuzzydate(data).getDate())) arr[R][C] = parseDate(data);
    else arr[R][C] = data;
  }
  function prn_to_aoa_str(f, opts) {
    var o = opts || {};
    var arr = [];
    if (!f || f.length === 0) return arr;
    var lines = f.split(/[\r\n]/);
    var L = lines.length - 1;
    while (L >= 0 && lines[L].length === 0) --L;
    var start = 10, idx = 0;
    var R = 0;
    for (; R <= L; ++R) {
      idx = lines[R].indexOf(" ");
      if (idx == -1) idx = lines[R].length;
      else idx++;
      start = Math.max(start, idx);
    }
    for (R = 0; R <= L; ++R) {
      arr[R] = [];
      var C = 0;
      set_text_arr(lines[R].slice(0, start).trim(), arr, R, C, o);
      for (C = 1; C <= (lines[R].length - start) / 10 + 1; ++C) set_text_arr(lines[R].slice(start + (C - 1) * 10, start + C * 10).trim(), arr, R, C, o);
    }
    if (o.sheetRows) arr = arr.slice(0, o.sheetRows);
    return arr;
  }
  var guess_seps = {
    /*::[*/
    44: ",",
    /*::[*/
    9: "	",
    /*::[*/
    59: ";",
    /*::[*/
    124: "|"
  };
  var guess_sep_weights = {
    /*::[*/
    44: 3,
    /*::[*/
    9: 2,
    /*::[*/
    59: 1,
    /*::[*/
    124: 0
  };
  function guess_sep(str) {
    var cnt = {}, instr = false, end = 0, cc = 0;
    for (; end < str.length; ++end) {
      if ((cc = str.charCodeAt(end)) == 34) instr = !instr;
      else if (!instr && cc in guess_seps) cnt[cc] = (cnt[cc] || 0) + 1;
    }
    cc = [];
    for (end in cnt) if (Object.prototype.hasOwnProperty.call(cnt, end)) {
      cc.push([cnt[end], end]);
    }
    if (!cc.length) {
      cnt = guess_sep_weights;
      for (end in cnt) if (Object.prototype.hasOwnProperty.call(cnt, end)) {
        cc.push([cnt[end], end]);
      }
    }
    cc.sort(function(a, b) {
      return a[0] - b[0] || guess_sep_weights[a[1]] - guess_sep_weights[b[1]];
    });
    return guess_seps[cc.pop()[1]] || 44;
  }
  function dsv_to_sheet_str(str, opts) {
    var o = opts || {};
    var sep = "";
    if (DENSE != null && o.dense == null) o.dense = DENSE;
    var ws = o.dense ? [] : {};
    var range = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    };
    if (str.slice(0, 4) == "sep=") {
      if (str.charCodeAt(5) == 13 && str.charCodeAt(6) == 10) {
        sep = str.charAt(4);
        str = str.slice(7);
      } else if (str.charCodeAt(5) == 13 || str.charCodeAt(5) == 10) {
        sep = str.charAt(4);
        str = str.slice(6);
      } else sep = guess_sep(str.slice(0, 1024));
    } else if (o && o.FS) sep = o.FS;
    else sep = guess_sep(str.slice(0, 1024));
    var R = 0, C = 0, v = 0;
    var start = 0, end = 0, sepcc = sep.charCodeAt(0), instr = false, cc = 0, startcc = str.charCodeAt(0);
    str = str.replace(/\r\n/mg, "\n");
    var _re = o.dateNF != null ? dateNF_regex(o.dateNF) : null;
    function finish_cell() {
      var s = str.slice(start, end);
      var cell = {};
      if (s.charAt(0) == '"' && s.charAt(s.length - 1) == '"') s = s.slice(1, -1).replace(/""/g, '"');
      if (s.length === 0) cell.t = "z";
      else if (o.raw) {
        cell.t = "s";
        cell.v = s;
      } else if (s.trim().length === 0) {
        cell.t = "s";
        cell.v = s;
      } else if (s.charCodeAt(0) == 61) {
        if (s.charCodeAt(1) == 34 && s.charCodeAt(s.length - 1) == 34) {
          cell.t = "s";
          cell.v = s.slice(2, -1).replace(/""/g, '"');
        } else if (fuzzyfmla(s)) {
          cell.t = "n";
          cell.f = s.slice(1);
        } else {
          cell.t = "s";
          cell.v = s;
        }
      } else if (s == "TRUE") {
        cell.t = "b";
        cell.v = true;
      } else if (s == "FALSE") {
        cell.t = "b";
        cell.v = false;
      } else if (!isNaN(v = fuzzynum(s))) {
        cell.t = "n";
        if (o.cellText !== false) cell.w = s;
        cell.v = v;
      } else if (!isNaN(fuzzydate(s).getDate()) || _re && s.match(_re)) {
        cell.z = o.dateNF || table_fmt[14];
        var k = 0;
        if (_re && s.match(_re)) {
          s = dateNF_fix(s, o.dateNF, s.match(_re) || []);
          k = 1;
        }
        if (o.cellDates) {
          cell.t = "d";
          cell.v = parseDate(s, k);
        } else {
          cell.t = "n";
          cell.v = datenum(parseDate(s, k));
        }
        if (o.cellText !== false) cell.w = SSF_format(cell.z, cell.v instanceof Date ? datenum(cell.v) : cell.v);
        if (!o.cellNF) delete cell.z;
      } else {
        cell.t = "s";
        cell.v = s;
      }
      if (cell.t == "z") {
      } else if (o.dense) {
        if (!ws[R]) ws[R] = [];
        ws[R][C] = cell;
      } else ws[encode_cell({
        c: C,
        r: R
      })] = cell;
      start = end + 1;
      startcc = str.charCodeAt(start);
      if (range.e.c < C) range.e.c = C;
      if (range.e.r < R) range.e.r = R;
      if (cc == sepcc) ++C;
      else {
        C = 0;
        ++R;
        if (o.sheetRows && o.sheetRows <= R) return true;
      }
    }
    outer: for (; end < str.length; ++end) switch (cc = str.charCodeAt(end)) {
      case 34:
        if (startcc === 34) instr = !instr;
        break;
      case sepcc:
      case 10:
      case 13:
        if (!instr && finish_cell()) break outer;
        break;
      default:
        break;
    }
    if (end - start > 0) finish_cell();
    ws["!ref"] = encode_range(range);
    return ws;
  }
  function prn_to_sheet_str(str, opts) {
    if (!(opts && opts.PRN)) return dsv_to_sheet_str(str, opts);
    if (opts.FS) return dsv_to_sheet_str(str, opts);
    if (str.slice(0, 4) == "sep=") return dsv_to_sheet_str(str, opts);
    if (str.indexOf("	") >= 0 || str.indexOf(",") >= 0 || str.indexOf(";") >= 0) return dsv_to_sheet_str(str, opts);
    return aoa_to_sheet(prn_to_aoa_str(str, opts), opts);
  }
  function prn_to_sheet(d, opts) {
    var str = "", bytes = opts.type == "string" ? [0, 0, 0, 0] : firstbyte(d, opts);
    switch (opts.type) {
      case "base64":
        str = Base64_decode(d);
        break;
      case "binary":
        str = d;
        break;
      case "buffer":
        if (opts.codepage == 65001) str = d.toString("utf8");
        else if (opts.codepage && typeof $cptable !== "undefined") str = $cptable.utils.decode(opts.codepage, d);
        else str = has_buf && Buffer.isBuffer(d) ? d.toString("binary") : a2s(d);
        break;
      case "array":
        str = cc2str(d);
        break;
      case "string":
        str = d;
        break;
      default:
        throw new Error("Unrecognized type " + opts.type);
    }
    if (bytes[0] == 239 && bytes[1] == 187 && bytes[2] == 191) str = utf8read(str.slice(3));
    else if (opts.type != "string" && opts.type != "buffer" && opts.codepage == 65001) str = utf8read(str);
    else if (opts.type == "binary" && typeof $cptable !== "undefined" && opts.codepage) str = $cptable.utils.decode(opts.codepage, $cptable.utils.encode(28591, str));
    if (str.slice(0, 19) == "socialcalc:version:") return ETH.to_sheet(opts.type == "string" ? str : utf8read(str), opts);
    return prn_to_sheet_str(str, opts);
  }
  function prn_to_workbook(d, opts) {
    return sheet_to_workbook(prn_to_sheet(d, opts), opts);
  }
  function sheet_to_prn(ws) {
    var o = [];
    var r = safe_decode_range(ws["!ref"]), cell;
    var dense = Array.isArray(ws);
    for (var R = r.s.r; R <= r.e.r; ++R) {
      var oo = [];
      for (var C = r.s.c; C <= r.e.c; ++C) {
        var coord = encode_cell({
          r: R,
          c: C
        });
        cell = dense ? (ws[R] || [])[C] : ws[coord];
        if (!cell || cell.v == null) {
          oo.push("          ");
          continue;
        }
        var w = (cell.w || (format_cell(cell), cell.w) || "").slice(0, 10);
        while (w.length < 10) w += " ";
        oo.push(w + (C === 0 ? " " : ""));
      }
      o.push(oo.join(""));
    }
    return o.join("\n");
  }
  return {
    to_workbook: prn_to_workbook,
    to_sheet: prn_to_sheet,
    from_sheet: sheet_to_prn
  };
}();
var WK_ = /* @__PURE__ */ function() {
  function lotushopper(data, cb, opts) {
    if (!data) return;
    prep_blob(data, data.l || 0);
    var Enum = opts.Enum || WK1Enum;
    while (data.l < data.length) {
      var RT = data.read_shift(2);
      var R = Enum[RT] || Enum[65535];
      var length = data.read_shift(2);
      var tgt = data.l + length;
      var d = R.f && R.f(data, length, opts);
      data.l = tgt;
      if (cb(d, R, RT)) return;
    }
  }
  function lotus_to_workbook(d, opts) {
    switch (opts.type) {
      case "base64":
        return lotus_to_workbook_buf(s2a(Base64_decode(d)), opts);
      case "binary":
        return lotus_to_workbook_buf(s2a(d), opts);
      case "buffer":
      case "array":
        return lotus_to_workbook_buf(d, opts);
    }
    throw "Unsupported type " + opts.type;
  }
  function lotus_to_workbook_buf(d, opts) {
    if (!d) return d;
    var o = opts || {};
    if (DENSE != null && o.dense == null) o.dense = DENSE;
    var s = o.dense ? [] : {}, n = "Sheet1", next_n = "", sidx = 0;
    var sheets = {}, snames = [], realnames = [];
    var refguess = {
      s: {
        r: 0,
        c: 0
      },
      e: {
        r: 0,
        c: 0
      }
    };
    var sheetRows = o.sheetRows || 0;
    if (d[2] == 0) {
      if (d[3] == 8 || d[3] == 9) {
        if (d.length >= 16 && d[14] == 5 && d[15] === 108) throw new Error("Unsupported Works 3 for Mac file");
      }
    }
    if (d[2] == 2) {
      o.Enum = WK1Enum;
      lotushopper(d, function(val, R, RT) {
        switch (RT) {
          case 0:
            o.vers = val;
            if (val >= 4096) o.qpro = true;
            break;
          case 6:
            refguess = val;
            break;
          case 204:
            if (val) next_n = val;
            break;
          case 222:
            next_n = val;
            break;
          case 15:
          case 51:
            if (!o.qpro) val[1].v = val[1].v.slice(1);
          case 13:
          case 14:
          case 16:
            if (RT == 14 && (val[2] & 112) == 112 && (val[2] & 15) > 1 && (val[2] & 15) < 15) {
              val[1].z = o.dateNF || table_fmt[14];
              if (o.cellDates) {
                val[1].t = "d";
                val[1].v = numdate(val[1].v);
              }
            }
            if (o.qpro) {
              if (val[3] > sidx) {
                s["!ref"] = encode_range(refguess);
                sheets[n] = s;
                snames.push(n);
                s = o.dense ? [] : {};
                refguess = {
                  s: {
                    r: 0,
                    c: 0
                  },
                  e: {
                    r: 0,
                    c: 0
                  }
                };
                sidx = val[3];
                n = next_n || "Sheet" + (sidx + 1);
                next_n = "";
              }
            }
            var tmpcell = o.dense ? (s[val[0].r] || [])[val[0].c] : s[encode_cell(val[0])];
            if (tmpcell) {
              tmpcell.t = val[1].t;
              tmpcell.v = val[1].v;
              if (val[1].z != null) tmpcell.z = val[1].z;
              if (val[1].f != null) tmpcell.f = val[1].f;
              break;
            }
            if (o.dense) {
              if (!s[val[0].r]) s[val[0].r] = [];
              s[val[0].r][val[0].c] = val[1];
            } else s[encode_cell(val[0])] = val[1];
            break;
          default:
        }
      }, o);
    } else if (d[2] == 26 || d[2] == 14) {
      o.Enum = WK3Enum;
      if (d[2] == 14) {
        o.qpro = true;
        d.l = 0;
      }
      lotushopper(d, function(val, R, RT) {
        switch (RT) {
          case 204:
            n = val;
            break;
          case 22:
            val[1].v = val[1].v.slice(1);
          case 23:
          case 24:
          case 25:
          case 37:
          case 39:
          case 40:
            if (val[3] > sidx) {
              s["!ref"] = encode_range(refguess);
              sheets[n] = s;
              snames.push(n);
              s = o.dense ? [] : {};
              refguess = {
                s: {
                  r: 0,
                  c: 0
                },
                e: {
                  r: 0,
                  c: 0
                }
              };
              sidx = val[3];
              n = "Sheet" + (sidx + 1);
            }
            if (sheetRows > 0 && val[0].r >= sheetRows) break;
            if (o.dense) {
              if (!s[val[0].r]) s[val[0].r] = [];
              s[val[0].r][val[0].c] = val[1];
            } else s[encode_cell(val[0])] = val[1];
            if (refguess.e.c < val[0].c) refguess.e.c = val[0].c;
            if (refguess.e.r < val[0].r) refguess.e.r = val[0].r;
            break;
          case 27:
            if (val[14e3]) realnames[val[14e3][0]] = val[14e3][1];
            break;
          case 1537:
            realnames[val[0]] = val[1];
            if (val[0] == sidx) n = val[1];
            break;
          default:
            break;
        }
      }, o);
    } else throw new Error("Unrecognized LOTUS BOF " + d[2]);
    s["!ref"] = encode_range(refguess);
    sheets[next_n || n] = s;
    snames.push(next_n || n);
    if (!realnames.length) return {
      SheetNames: snames,
      Sheets: sheets
    };
    var osheets = {}, rnames = [];
    for (var i = 0; i < realnames.length; ++i) if (sheets[snames[i]]) {
      rnames.push(realnames[i] || snames[i]);
      osheets[realnames[i]] = sheets[realnames[i]] || sheets[snames[i]];
    } else {
      rnames.push(realnames[i]);
      osheets[realnames[i]] = {
        "!ref": "A1"
      };
    }
    return {
      SheetNames: rnames,
      Sheets: osheets
    };
  }
  function sheet_to_wk1(ws, opts) {
    var o = opts || {};
    if (+o.codepage >= 0) set_cp(+o.codepage);
    if (o.type == "string") throw new Error("Cannot write WK1 to JS string");
    var ba = buf_array();
    var range = safe_decode_range(ws["!ref"]);
    var dense = Array.isArray(ws);
    var cols = [];
    write_biff_rec(ba, 0, write_BOF_WK1(1030));
    write_biff_rec(ba, 6, write_RANGE(range));
    var max_R = Math.min(range.e.r, 8191);
    for (var R = range.s.r; R <= max_R; ++R) {
      var rr = encode_row(R);
      for (var C = range.s.c; C <= range.e.c; ++C) {
        if (R === range.s.r) cols[C] = encode_col(C);
        var ref = cols[C] + rr;
        var cell = dense ? (ws[R] || [])[C] : ws[ref];
        if (!cell || cell.t == "z") continue;
        if (cell.t == "n") {
          if ((cell.v | 0) == cell.v && cell.v >= -32768 && cell.v <= 32767) write_biff_rec(ba, 13, write_INTEGER(R, C, cell.v));
          else write_biff_rec(ba, 14, write_NUMBER(R, C, cell.v));
        } else {
          var str = format_cell(cell);
          write_biff_rec(ba, 15, write_LABEL(R, C, str.slice(0, 239)));
        }
      }
    }
    write_biff_rec(ba, 1);
    return ba.end();
  }
  function book_to_wk3(wb, opts) {
    var o = opts || {};
    if (+o.codepage >= 0) set_cp(+o.codepage);
    if (o.type == "string") throw new Error("Cannot write WK3 to JS string");
    var ba = buf_array();
    write_biff_rec(ba, 0, write_BOF_WK3(wb));
    for (var i = 0, cnt = 0; i < wb.SheetNames.length; ++i) if ((wb.Sheets[wb.SheetNames[i]] || {})["!ref"]) write_biff_rec(ba, 27, write_XFORMAT_SHEETNAME(wb.SheetNames[i], cnt++));
    var wsidx = 0;
    for (i = 0; i < wb.SheetNames.length; ++i) {
      var ws = wb.Sheets[wb.SheetNames[i]];
      if (!ws || !ws["!ref"]) continue;
      var range = safe_decode_range(ws["!ref"]);
      var dense = Array.isArray(ws);
      var cols = [];
      var max_R = Math.min(range.e.r, 8191);
      for (var R = range.s.r; R <= max_R; ++R) {
        var rr = encode_row(R);
        for (var C = range.s.c; C <= range.e.c; ++C) {
          if (R === range.s.r) cols[C] = encode_col(C);
          var ref = cols[C] + rr;
          var cell = dense ? (ws[R] || [])[C] : ws[ref];
          if (!cell || cell.t == "z") continue;
          if (cell.t == "n") {
            write_biff_rec(ba, 23, write_NUMBER_17(R, C, wsidx, cell.v));
          } else {
            var str = format_cell(cell);
            write_biff_rec(ba, 22, write_LABEL_16(R, C, wsidx, str.slice(0, 239)));
          }
        }
      }
      ++wsidx;
    }
    write_biff_rec(ba, 1);
    return ba.end();
  }
  function write_BOF_WK1(v) {
    var out = new_buf(2);
    out.write_shift(2, v);
    return out;
  }
  function write_BOF_WK3(wb) {
    var out = new_buf(26);
    out.write_shift(2, 4096);
    out.write_shift(2, 4);
    out.write_shift(4, 0);
    var rows = 0, cols = 0, wscnt = 0;
    for (var i = 0; i < wb.SheetNames.length; ++i) {
      var name = wb.SheetNames[i];
      var ws = wb.Sheets[name];
      if (!ws || !ws["!ref"]) continue;
      ++wscnt;
      var range = decode_range(ws["!ref"]);
      if (rows < range.e.r) rows = range.e.r;
      if (cols < range.e.c) cols = range.e.c;
    }
    if (rows > 8191) rows = 8191;
    out.write_shift(2, rows);
    out.write_shift(1, wscnt);
    out.write_shift(1, cols);
    out.write_shift(2, 0);
    out.write_shift(2, 0);
    out.write_shift(1, 1);
    out.write_shift(1, 2);
    out.write_shift(4, 0);
    out.write_shift(4, 0);
    return out;
  }
  function parse_RANGE(blob, length, opts) {
    var o = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    };
    if (length == 8 && opts.qpro) {
      o.s.c = blob.read_shift(1);
      blob.l++;
      o.s.r = blob.read_shift(2);
      o.e.c = blob.read_shift(1);
      blob.l++;
      o.e.r = blob.read_shift(2);
      return o;
    }
    o.s.c = blob.read_shift(2);
    o.s.r = blob.read_shift(2);
    if (length == 12 && opts.qpro) blob.l += 2;
    o.e.c = blob.read_shift(2);
    o.e.r = blob.read_shift(2);
    if (length == 12 && opts.qpro) blob.l += 2;
    if (o.s.c == 65535) o.s.c = o.e.c = o.s.r = o.e.r = 0;
    return o;
  }
  function write_RANGE(range) {
    var out = new_buf(8);
    out.write_shift(2, range.s.c);
    out.write_shift(2, range.s.r);
    out.write_shift(2, range.e.c);
    out.write_shift(2, range.e.r);
    return out;
  }
  function parse_cell(blob, length, opts) {
    var o = [{
      c: 0,
      r: 0
    }, {
      t: "n",
      v: 0
    }, 0, 0];
    if (opts.qpro && opts.vers != 20768) {
      o[0].c = blob.read_shift(1);
      o[3] = blob.read_shift(1);
      o[0].r = blob.read_shift(2);
      blob.l += 2;
    } else {
      o[2] = blob.read_shift(1);
      o[0].c = blob.read_shift(2);
      o[0].r = blob.read_shift(2);
    }
    return o;
  }
  function parse_LABEL(blob, length, opts) {
    var tgt = blob.l + length;
    var o = parse_cell(blob, length, opts);
    o[1].t = "s";
    if (opts.vers == 20768) {
      blob.l++;
      var len = blob.read_shift(1);
      o[1].v = blob.read_shift(len, "utf8");
      return o;
    }
    if (opts.qpro) blob.l++;
    o[1].v = blob.read_shift(tgt - blob.l, "cstr");
    return o;
  }
  function write_LABEL(R, C, s) {
    var o = new_buf(7 + s.length);
    o.write_shift(1, 255);
    o.write_shift(2, C);
    o.write_shift(2, R);
    o.write_shift(1, 39);
    for (var i = 0; i < o.length; ++i) {
      var cc = s.charCodeAt(i);
      o.write_shift(1, cc >= 128 ? 95 : cc);
    }
    o.write_shift(1, 0);
    return o;
  }
  function parse_INTEGER(blob, length, opts) {
    var o = parse_cell(blob, length, opts);
    o[1].v = blob.read_shift(2, "i");
    return o;
  }
  function write_INTEGER(R, C, v) {
    var o = new_buf(7);
    o.write_shift(1, 255);
    o.write_shift(2, C);
    o.write_shift(2, R);
    o.write_shift(2, v, "i");
    return o;
  }
  function parse_NUMBER(blob, length, opts) {
    var o = parse_cell(blob, length, opts);
    o[1].v = blob.read_shift(8, "f");
    return o;
  }
  function write_NUMBER(R, C, v) {
    var o = new_buf(13);
    o.write_shift(1, 255);
    o.write_shift(2, C);
    o.write_shift(2, R);
    o.write_shift(8, v, "f");
    return o;
  }
  function parse_FORMULA(blob, length, opts) {
    var tgt = blob.l + length;
    var o = parse_cell(blob, length, opts);
    o[1].v = blob.read_shift(8, "f");
    if (opts.qpro) blob.l = tgt;
    else {
      var flen = blob.read_shift(2);
      wk1_fmla_to_csf(blob.slice(blob.l, blob.l + flen), o);
      blob.l += flen;
    }
    return o;
  }
  function wk1_parse_rc(B, V, col) {
    var rel = V & 32768;
    V &= ~32768;
    V = (rel ? B : 0) + (V >= 8192 ? V - 16384 : V);
    return (rel ? "" : "$") + (col ? encode_col(V) : encode_row(V));
  }
  var FuncTab = {
    51: ["FALSE", 0],
    52: ["TRUE", 0],
    70: ["LEN", 1],
    80: ["SUM", 69],
    81: ["AVERAGEA", 69],
    82: ["COUNTA", 69],
    83: ["MINA", 69],
    84: ["MAXA", 69],
    111: ["T", 1]
  };
  var BinOpTab = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "",
    "+",
    "-",
    "*",
    "/",
    "^",
    "=",
    "<>",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "<=",
    ">=",
    "<",
    ">",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "&",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
    // eslint-disable-line no-mixed-spaces-and-tabs
  ];
  function wk1_fmla_to_csf(blob, o) {
    prep_blob(blob, 0);
    var out = [], argc = 0, R = "", C = "", argL = "", argR = "";
    while (blob.l < blob.length) {
      var cc = blob[blob.l++];
      switch (cc) {
        case 0:
          out.push(blob.read_shift(8, "f"));
          break;
        case 1:
          {
            C = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
            R = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
            out.push(C + R);
          }
          break;
        case 2:
          {
            var c = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
            var r = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
            C = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
            R = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
            out.push(c + r + ":" + C + R);
          }
          break;
        case 3:
          if (blob.l < blob.length) {
            console.error("WK1 premature formula end");
            return;
          }
          break;
        case 4:
          out.push("(" + out.pop() + ")");
          break;
        case 5:
          out.push(blob.read_shift(2));
          break;
        case 6:
          {
            var Z = "";
            while (cc = blob[blob.l++]) Z += String.fromCharCode(cc);
            out.push('"' + Z.replace(/"/g, '""') + '"');
          }
          break;
        case 8:
          out.push("-" + out.pop());
          break;
        case 23:
          out.push("+" + out.pop());
          break;
        case 22:
          out.push("NOT(" + out.pop() + ")");
          break;
        case 20:
        case 21:
          {
            argR = out.pop();
            argL = out.pop();
            out.push(["AND", "OR"][cc - 20] + "(" + argL + "," + argR + ")");
          }
          break;
        default:
          if (cc < 32 && BinOpTab[cc]) {
            argR = out.pop();
            argL = out.pop();
            out.push(argL + BinOpTab[cc] + argR);
          } else if (FuncTab[cc]) {
            argc = FuncTab[cc][1];
            if (argc == 69) argc = blob[blob.l++];
            if (argc > out.length) {
              console.error("WK1 bad formula parse 0x" + cc.toString(16) + ":|" + out.join("|") + "|");
              return;
            }
            var args = out.slice(-argc);
            out.length -= argc;
            out.push(FuncTab[cc][0] + "(" + args.join(",") + ")");
          } else if (cc <= 7) return console.error("WK1 invalid opcode " + cc.toString(16));
          else if (cc <= 24) return console.error("WK1 unsupported op " + cc.toString(16));
          else if (cc <= 30) return console.error("WK1 invalid opcode " + cc.toString(16));
          else if (cc <= 115) return console.error("WK1 unsupported function opcode " + cc.toString(16));
          else return console.error("WK1 unrecognized opcode " + cc.toString(16));
      }
    }
    if (out.length == 1) o[1].f = "" + out[0];
    else console.error("WK1 bad formula parse |" + out.join("|") + "|");
  }
  function parse_cell_3(blob) {
    var o = [{
      c: 0,
      r: 0
    }, {
      t: "n",
      v: 0
    }, 0];
    o[0].r = blob.read_shift(2);
    o[3] = blob[blob.l++];
    o[0].c = blob[blob.l++];
    return o;
  }
  function parse_LABEL_16(blob, length) {
    var o = parse_cell_3(blob, length);
    o[1].t = "s";
    o[1].v = blob.read_shift(length - 4, "cstr");
    return o;
  }
  function write_LABEL_16(R, C, wsidx, s) {
    var o = new_buf(6 + s.length);
    o.write_shift(2, R);
    o.write_shift(1, wsidx);
    o.write_shift(1, C);
    o.write_shift(1, 39);
    for (var i = 0; i < s.length; ++i) {
      var cc = s.charCodeAt(i);
      o.write_shift(1, cc >= 128 ? 95 : cc);
    }
    o.write_shift(1, 0);
    return o;
  }
  function parse_NUMBER_18(blob, length) {
    var o = parse_cell_3(blob, length);
    o[1].v = blob.read_shift(2);
    var v = o[1].v >> 1;
    if (o[1].v & 1) {
      switch (v & 7) {
        case 0:
          v = (v >> 3) * 5e3;
          break;
        case 1:
          v = (v >> 3) * 500;
          break;
        case 2:
          v = (v >> 3) / 20;
          break;
        case 3:
          v = (v >> 3) / 200;
          break;
        case 4:
          v = (v >> 3) / 2e3;
          break;
        case 5:
          v = (v >> 3) / 2e4;
          break;
        case 6:
          v = (v >> 3) / 16;
          break;
        case 7:
          v = (v >> 3) / 64;
          break;
      }
    }
    o[1].v = v;
    return o;
  }
  function parse_NUMBER_17(blob, length) {
    var o = parse_cell_3(blob, length);
    var v1 = blob.read_shift(4);
    var v2 = blob.read_shift(4);
    var e = blob.read_shift(2);
    if (e == 65535) {
      if (v1 === 0 && v2 === 3221225472) {
        o[1].t = "e";
        o[1].v = 15;
      } else if (v1 === 0 && v2 === 3489660928) {
        o[1].t = "e";
        o[1].v = 42;
      } else o[1].v = 0;
      return o;
    }
    var s = e & 32768;
    e = (e & 32767) - 16446;
    o[1].v = (1 - s * 2) * (v2 * Math.pow(2, e + 32) + v1 * Math.pow(2, e));
    return o;
  }
  function write_NUMBER_17(R, C, wsidx, v) {
    var o = new_buf(14);
    o.write_shift(2, R);
    o.write_shift(1, wsidx);
    o.write_shift(1, C);
    if (v == 0) {
      o.write_shift(4, 0);
      o.write_shift(4, 0);
      o.write_shift(2, 65535);
      return o;
    }
    var s = 0, e = 0, v1 = 0, v2 = 0;
    if (v < 0) {
      s = 1;
      v = -v;
    }
    e = Math.log2(v) | 0;
    v /= Math.pow(2, e - 31);
    v2 = v >>> 0;
    if ((v2 & 2147483648) == 0) {
      v /= 2;
      ++e;
      v2 = v >>> 0;
    }
    v -= v2;
    v2 |= 2147483648;
    v2 >>>= 0;
    v *= Math.pow(2, 32);
    v1 = v >>> 0;
    o.write_shift(4, v1);
    o.write_shift(4, v2);
    e += 16383 + (s ? 32768 : 0);
    o.write_shift(2, e);
    return o;
  }
  function parse_FORMULA_19(blob, length) {
    var o = parse_NUMBER_17(blob, 14);
    blob.l += length - 14;
    return o;
  }
  function parse_NUMBER_25(blob, length) {
    var o = parse_cell_3(blob, length);
    var v1 = blob.read_shift(4);
    o[1].v = v1 >> 6;
    return o;
  }
  function parse_NUMBER_27(blob, length) {
    var o = parse_cell_3(blob, length);
    var v1 = blob.read_shift(8, "f");
    o[1].v = v1;
    return o;
  }
  function parse_FORMULA_28(blob, length) {
    var o = parse_NUMBER_27(blob, 14);
    blob.l += length - 10;
    return o;
  }
  function parse_SHEETNAMECS(blob, length) {
    return blob[blob.l + length - 1] == 0 ? blob.read_shift(length, "cstr") : "";
  }
  function parse_SHEETNAMELP(blob, length) {
    var len = blob[blob.l++];
    if (len > length - 1) len = length - 1;
    var o = "";
    while (o.length < len) o += String.fromCharCode(blob[blob.l++]);
    return o;
  }
  function parse_SHEETINFOQP(blob, length, opts) {
    if (!opts.qpro || length < 21) return;
    var id = blob.read_shift(1);
    blob.l += 17;
    blob.l += 1;
    blob.l += 2;
    var nm = blob.read_shift(length - 21, "cstr");
    return [id, nm];
  }
  function parse_XFORMAT(blob, length) {
    var o = {}, tgt = blob.l + length;
    while (blob.l < tgt) {
      var dt = blob.read_shift(2);
      if (dt == 14e3) {
        o[dt] = [0, ""];
        o[dt][0] = blob.read_shift(2);
        while (blob[blob.l]) {
          o[dt][1] += String.fromCharCode(blob[blob.l]);
          blob.l++;
        }
        blob.l++;
      }
    }
    return o;
  }
  function write_XFORMAT_SHEETNAME(name, wsidx) {
    var out = new_buf(5 + name.length);
    out.write_shift(2, 14e3);
    out.write_shift(2, wsidx);
    for (var i = 0; i < name.length; ++i) {
      var cc = name.charCodeAt(i);
      out[out.l++] = cc > 127 ? 95 : cc;
    }
    out[out.l++] = 0;
    return out;
  }
  var WK1Enum = {
    /*::[*/
    0: {
      n: "BOF",
      f: parseuint16
    },
    /*::[*/
    1: {
      n: "EOF"
    },
    /*::[*/
    2: {
      n: "CALCMODE"
    },
    /*::[*/
    3: {
      n: "CALCORDER"
    },
    /*::[*/
    4: {
      n: "SPLIT"
    },
    /*::[*/
    5: {
      n: "SYNC"
    },
    /*::[*/
    6: {
      n: "RANGE",
      f: parse_RANGE
    },
    /*::[*/
    7: {
      n: "WINDOW1"
    },
    /*::[*/
    8: {
      n: "COLW1"
    },
    /*::[*/
    9: {
      n: "WINTWO"
    },
    /*::[*/
    10: {
      n: "COLW2"
    },
    /*::[*/
    11: {
      n: "NAME"
    },
    /*::[*/
    12: {
      n: "BLANK"
    },
    /*::[*/
    13: {
      n: "INTEGER",
      f: parse_INTEGER
    },
    /*::[*/
    14: {
      n: "NUMBER",
      f: parse_NUMBER
    },
    /*::[*/
    15: {
      n: "LABEL",
      f: parse_LABEL
    },
    /*::[*/
    16: {
      n: "FORMULA",
      f: parse_FORMULA
    },
    /*::[*/
    24: {
      n: "TABLE"
    },
    /*::[*/
    25: {
      n: "ORANGE"
    },
    /*::[*/
    26: {
      n: "PRANGE"
    },
    /*::[*/
    27: {
      n: "SRANGE"
    },
    /*::[*/
    28: {
      n: "FRANGE"
    },
    /*::[*/
    29: {
      n: "KRANGE1"
    },
    /*::[*/
    32: {
      n: "HRANGE"
    },
    /*::[*/
    35: {
      n: "KRANGE2"
    },
    /*::[*/
    36: {
      n: "PROTEC"
    },
    /*::[*/
    37: {
      n: "FOOTER"
    },
    /*::[*/
    38: {
      n: "HEADER"
    },
    /*::[*/
    39: {
      n: "SETUP"
    },
    /*::[*/
    40: {
      n: "MARGINS"
    },
    /*::[*/
    41: {
      n: "LABELFMT"
    },
    /*::[*/
    42: {
      n: "TITLES"
    },
    /*::[*/
    43: {
      n: "SHEETJS"
    },
    /*::[*/
    45: {
      n: "GRAPH"
    },
    /*::[*/
    46: {
      n: "NGRAPH"
    },
    /*::[*/
    47: {
      n: "CALCCOUNT"
    },
    /*::[*/
    48: {
      n: "UNFORMATTED"
    },
    /*::[*/
    49: {
      n: "CURSORW12"
    },
    /*::[*/
    50: {
      n: "WINDOW"
    },
    /*::[*/
    51: {
      n: "STRING",
      f: parse_LABEL
    },
    /*::[*/
    55: {
      n: "PASSWORD"
    },
    /*::[*/
    56: {
      n: "LOCKED"
    },
    /*::[*/
    60: {
      n: "QUERY"
    },
    /*::[*/
    61: {
      n: "QUERYNAME"
    },
    /*::[*/
    62: {
      n: "PRINT"
    },
    /*::[*/
    63: {
      n: "PRINTNAME"
    },
    /*::[*/
    64: {
      n: "GRAPH2"
    },
    /*::[*/
    65: {
      n: "GRAPHNAME"
    },
    /*::[*/
    66: {
      n: "ZOOM"
    },
    /*::[*/
    67: {
      n: "SYMSPLIT"
    },
    /*::[*/
    68: {
      n: "NSROWS"
    },
    /*::[*/
    69: {
      n: "NSCOLS"
    },
    /*::[*/
    70: {
      n: "RULER"
    },
    /*::[*/
    71: {
      n: "NNAME"
    },
    /*::[*/
    72: {
      n: "ACOMM"
    },
    /*::[*/
    73: {
      n: "AMACRO"
    },
    /*::[*/
    74: {
      n: "PARSE"
    },
    /*::[*/
    102: {
      n: "PRANGES??"
    },
    /*::[*/
    103: {
      n: "RRANGES??"
    },
    /*::[*/
    104: {
      n: "FNAME??"
    },
    /*::[*/
    105: {
      n: "MRANGES??"
    },
    /*::[*/
    204: {
      n: "SHEETNAMECS",
      f: parse_SHEETNAMECS
    },
    /*::[*/
    222: {
      n: "SHEETNAMELP",
      f: parse_SHEETNAMELP
    },
    /*::[*/
    65535: {
      n: ""
    }
  };
  var WK3Enum = {
    /*::[*/
    0: {
      n: "BOF"
    },
    /*::[*/
    1: {
      n: "EOF"
    },
    /*::[*/
    2: {
      n: "PASSWORD"
    },
    /*::[*/
    3: {
      n: "CALCSET"
    },
    /*::[*/
    4: {
      n: "WINDOWSET"
    },
    /*::[*/
    5: {
      n: "SHEETCELLPTR"
    },
    /*::[*/
    6: {
      n: "SHEETLAYOUT"
    },
    /*::[*/
    7: {
      n: "COLUMNWIDTH"
    },
    /*::[*/
    8: {
      n: "HIDDENCOLUMN"
    },
    /*::[*/
    9: {
      n: "USERRANGE"
    },
    /*::[*/
    10: {
      n: "SYSTEMRANGE"
    },
    /*::[*/
    11: {
      n: "ZEROFORCE"
    },
    /*::[*/
    12: {
      n: "SORTKEYDIR"
    },
    /*::[*/
    13: {
      n: "FILESEAL"
    },
    /*::[*/
    14: {
      n: "DATAFILLNUMS"
    },
    /*::[*/
    15: {
      n: "PRINTMAIN"
    },
    /*::[*/
    16: {
      n: "PRINTSTRING"
    },
    /*::[*/
    17: {
      n: "GRAPHMAIN"
    },
    /*::[*/
    18: {
      n: "GRAPHSTRING"
    },
    /*::[*/
    19: {
      n: "??"
    },
    /*::[*/
    20: {
      n: "ERRCELL"
    },
    /*::[*/
    21: {
      n: "NACELL"
    },
    /*::[*/
    22: {
      n: "LABEL16",
      f: parse_LABEL_16
    },
    /*::[*/
    23: {
      n: "NUMBER17",
      f: parse_NUMBER_17
    },
    /*::[*/
    24: {
      n: "NUMBER18",
      f: parse_NUMBER_18
    },
    /*::[*/
    25: {
      n: "FORMULA19",
      f: parse_FORMULA_19
    },
    /*::[*/
    26: {
      n: "FORMULA1A"
    },
    /*::[*/
    27: {
      n: "XFORMAT",
      f: parse_XFORMAT
    },
    /*::[*/
    28: {
      n: "DTLABELMISC"
    },
    /*::[*/
    29: {
      n: "DTLABELCELL"
    },
    /*::[*/
    30: {
      n: "GRAPHWINDOW"
    },
    /*::[*/
    31: {
      n: "CPA"
    },
    /*::[*/
    32: {
      n: "LPLAUTO"
    },
    /*::[*/
    33: {
      n: "QUERY"
    },
    /*::[*/
    34: {
      n: "HIDDENSHEET"
    },
    /*::[*/
    35: {
      n: "??"
    },
    /*::[*/
    37: {
      n: "NUMBER25",
      f: parse_NUMBER_25
    },
    /*::[*/
    38: {
      n: "??"
    },
    /*::[*/
    39: {
      n: "NUMBER27",
      f: parse_NUMBER_27
    },
    /*::[*/
    40: {
      n: "FORMULA28",
      f: parse_FORMULA_28
    },
    /*::[*/
    142: {
      n: "??"
    },
    /*::[*/
    147: {
      n: "??"
    },
    /*::[*/
    150: {
      n: "??"
    },
    /*::[*/
    151: {
      n: "??"
    },
    /*::[*/
    152: {
      n: "??"
    },
    /*::[*/
    153: {
      n: "??"
    },
    /*::[*/
    154: {
      n: "??"
    },
    /*::[*/
    155: {
      n: "??"
    },
    /*::[*/
    156: {
      n: "??"
    },
    /*::[*/
    163: {
      n: "??"
    },
    /*::[*/
    174: {
      n: "??"
    },
    /*::[*/
    175: {
      n: "??"
    },
    /*::[*/
    176: {
      n: "??"
    },
    /*::[*/
    177: {
      n: "??"
    },
    /*::[*/
    184: {
      n: "??"
    },
    /*::[*/
    185: {
      n: "??"
    },
    /*::[*/
    186: {
      n: "??"
    },
    /*::[*/
    187: {
      n: "??"
    },
    /*::[*/
    188: {
      n: "??"
    },
    /*::[*/
    195: {
      n: "??"
    },
    /*::[*/
    201: {
      n: "??"
    },
    /*::[*/
    204: {
      n: "SHEETNAMECS",
      f: parse_SHEETNAMECS
    },
    /*::[*/
    205: {
      n: "??"
    },
    /*::[*/
    206: {
      n: "??"
    },
    /*::[*/
    207: {
      n: "??"
    },
    /*::[*/
    208: {
      n: "??"
    },
    /*::[*/
    256: {
      n: "??"
    },
    /*::[*/
    259: {
      n: "??"
    },
    /*::[*/
    260: {
      n: "??"
    },
    /*::[*/
    261: {
      n: "??"
    },
    /*::[*/
    262: {
      n: "??"
    },
    /*::[*/
    263: {
      n: "??"
    },
    /*::[*/
    265: {
      n: "??"
    },
    /*::[*/
    266: {
      n: "??"
    },
    /*::[*/
    267: {
      n: "??"
    },
    /*::[*/
    268: {
      n: "??"
    },
    /*::[*/
    270: {
      n: "??"
    },
    /*::[*/
    271: {
      n: "??"
    },
    /*::[*/
    384: {
      n: "??"
    },
    /*::[*/
    389: {
      n: "??"
    },
    /*::[*/
    390: {
      n: "??"
    },
    /*::[*/
    393: {
      n: "??"
    },
    /*::[*/
    396: {
      n: "??"
    },
    /*::[*/
    512: {
      n: "??"
    },
    /*::[*/
    514: {
      n: "??"
    },
    /*::[*/
    513: {
      n: "??"
    },
    /*::[*/
    516: {
      n: "??"
    },
    /*::[*/
    517: {
      n: "??"
    },
    /*::[*/
    640: {
      n: "??"
    },
    /*::[*/
    641: {
      n: "??"
    },
    /*::[*/
    642: {
      n: "??"
    },
    /*::[*/
    643: {
      n: "??"
    },
    /*::[*/
    644: {
      n: "??"
    },
    /*::[*/
    645: {
      n: "??"
    },
    /*::[*/
    646: {
      n: "??"
    },
    /*::[*/
    647: {
      n: "??"
    },
    /*::[*/
    648: {
      n: "??"
    },
    /*::[*/
    658: {
      n: "??"
    },
    /*::[*/
    659: {
      n: "??"
    },
    /*::[*/
    660: {
      n: "??"
    },
    /*::[*/
    661: {
      n: "??"
    },
    /*::[*/
    662: {
      n: "??"
    },
    /*::[*/
    665: {
      n: "??"
    },
    /*::[*/
    666: {
      n: "??"
    },
    /*::[*/
    768: {
      n: "??"
    },
    /*::[*/
    772: {
      n: "??"
    },
    /*::[*/
    1537: {
      n: "SHEETINFOQP",
      f: parse_SHEETINFOQP
    },
    /*::[*/
    1600: {
      n: "??"
    },
    /*::[*/
    1602: {
      n: "??"
    },
    /*::[*/
    1793: {
      n: "??"
    },
    /*::[*/
    1794: {
      n: "??"
    },
    /*::[*/
    1795: {
      n: "??"
    },
    /*::[*/
    1796: {
      n: "??"
    },
    /*::[*/
    1920: {
      n: "??"
    },
    /*::[*/
    2048: {
      n: "??"
    },
    /*::[*/
    2049: {
      n: "??"
    },
    /*::[*/
    2052: {
      n: "??"
    },
    /*::[*/
    2688: {
      n: "??"
    },
    /*::[*/
    10998: {
      n: "??"
    },
    /*::[*/
    12849: {
      n: "??"
    },
    /*::[*/
    28233: {
      n: "??"
    },
    /*::[*/
    28484: {
      n: "??"
    },
    /*::[*/
    65535: {
      n: ""
    }
  };
  return {
    sheet_to_wk1,
    book_to_wk3,
    to_workbook: lotus_to_workbook
  };
}();
var straywsregex = /^\s|\s$|[\t\n\r]/;
function write_sst_xml(sst, opts) {
  if (!opts.bookSST) return "";
  var o = [XML_HEADER];
  o[o.length] = writextag("sst", null, {
    xmlns: XMLNS_main[0],
    count: sst.Count,
    uniqueCount: sst.Unique
  });
  for (var i = 0; i != sst.length; ++i) {
    if (sst[i] == null) continue;
    var s = sst[i];
    var sitag = "<si>";
    if (s.r) sitag += s.r;
    else {
      sitag += "<t";
      if (!s.t) s.t = "";
      if (s.t.match(straywsregex)) sitag += ' xml:space="preserve"';
      sitag += ">" + escapexml(s.t) + "</t>";
    }
    sitag += "</si>";
    o[o.length] = sitag;
  }
  if (o.length > 2) {
    o[o.length] = "</sst>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function parse_BrtBeginSst(data) {
  return [data.read_shift(4), data.read_shift(4)];
}
function write_BrtBeginSst(sst, o) {
  if (!o) o = new_buf(8);
  o.write_shift(4, sst.Count);
  o.write_shift(4, sst.Unique);
  return o;
}
var write_BrtSSTItem = write_RichStr;
function write_sst_bin(sst) {
  var ba = buf_array();
  write_record(ba, 159, write_BrtBeginSst(sst));
  for (var i = 0; i < sst.length; ++i) write_record(ba, 19, write_BrtSSTItem(sst[i]));
  write_record(
    ba,
    160
    /* BrtEndSst */
  );
  return ba.end();
}
function _JS2ANSI(str) {
  if (typeof $cptable !== "undefined") return $cptable.utils.encode(current_ansi, str);
  var o = [], oo = str.split("");
  for (var i = 0; i < oo.length; ++i) o[i] = oo[i].charCodeAt(0);
  return o;
}
function crypto_CreatePasswordVerifier_Method1(Password) {
  var Verifier = 0, PasswordArray;
  var PasswordDecoded = _JS2ANSI(Password);
  var len = PasswordDecoded.length + 1, i, PasswordByte;
  var Intermediate1, Intermediate2, Intermediate3;
  PasswordArray = new_raw_buf(len);
  PasswordArray[0] = PasswordDecoded.length;
  for (i = 1; i != len; ++i) PasswordArray[i] = PasswordDecoded[i - 1];
  for (i = len - 1; i >= 0; --i) {
    PasswordByte = PasswordArray[i];
    Intermediate1 = (Verifier & 16384) === 0 ? 0 : 1;
    Intermediate2 = Verifier << 1 & 32767;
    Intermediate3 = Intermediate1 | Intermediate2;
    Verifier = Intermediate3 ^ PasswordByte;
  }
  return Verifier ^ 52811;
}
var RTF = /* @__PURE__ */ function() {
  function rtf_to_sheet(d, opts) {
    switch (opts.type) {
      case "base64":
        return rtf_to_sheet_str(Base64_decode(d), opts);
      case "binary":
        return rtf_to_sheet_str(d, opts);
      case "buffer":
        return rtf_to_sheet_str(has_buf && Buffer.isBuffer(d) ? d.toString("binary") : a2s(d), opts);
      case "array":
        return rtf_to_sheet_str(cc2str(d), opts);
    }
    throw new Error("Unrecognized type " + opts.type);
  }
  function rtf_to_sheet_str(str, opts) {
    var o = opts || {};
    var ws = o.dense ? [] : {};
    var rows = str.match(/\\trowd.*?\\row\b/g);
    if (!rows.length) throw new Error("RTF missing table");
    var range = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: rows.length - 1
      }
    };
    rows.forEach(function(rowtf, R) {
      if (Array.isArray(ws)) ws[R] = [];
      var rtfre = /\\\w+\b/g;
      var last_index = 0;
      var res;
      var C = -1;
      while (res = rtfre.exec(rowtf)) {
        switch (res[0]) {
          case "\\cell":
            var data = rowtf.slice(last_index, rtfre.lastIndex - res[0].length);
            if (data[0] == " ") data = data.slice(1);
            ++C;
            if (data.length) {
              var cell = {
                v: data,
                t: "s"
              };
              if (Array.isArray(ws)) ws[R][C] = cell;
              else ws[encode_cell({
                r: R,
                c: C
              })] = cell;
            }
            break;
        }
        last_index = rtfre.lastIndex;
      }
      if (C > range.e.c) range.e.c = C;
    });
    ws["!ref"] = encode_range(range);
    return ws;
  }
  function rtf_to_workbook(d, opts) {
    return sheet_to_workbook(rtf_to_sheet(d, opts), opts);
  }
  function sheet_to_rtf(ws) {
    var o = ["{\\rtf1\\ansi"];
    var r = safe_decode_range(ws["!ref"]), cell;
    var dense = Array.isArray(ws);
    for (var R = r.s.r; R <= r.e.r; ++R) {
      o.push("\\trowd\\trautofit1");
      for (var C = r.s.c; C <= r.e.c; ++C) o.push("\\cellx" + (C + 1));
      o.push("\\pard\\intbl");
      for (C = r.s.c; C <= r.e.c; ++C) {
        var coord = encode_cell({
          r: R,
          c: C
        });
        cell = dense ? (ws[R] || [])[C] : ws[coord];
        if (!cell || cell.v == null && (!cell.f || cell.F)) continue;
        o.push(" " + (cell.w || (format_cell(cell), cell.w)));
        o.push("\\cell");
      }
      o.push("\\pard\\intbl\\row");
    }
    return o.join("") + "}";
  }
  return {
    to_workbook: rtf_to_workbook,
    to_sheet: rtf_to_sheet,
    from_sheet: sheet_to_rtf
  };
}();
function rgb2Hex(rgb) {
  for (var i = 0, o = 1; i != 3; ++i) o = o * 256 + (rgb[i] > 255 ? 255 : rgb[i] < 0 ? 0 : rgb[i]);
  return o.toString(16).toUpperCase().slice(1);
}
var DEF_MDW = 6;
var MDW = DEF_MDW;
function width2px(width) {
  return Math.floor((width + Math.round(128 / MDW) / 256) * MDW);
}
function px2char(px) {
  return Math.floor((px - 5) / MDW * 100 + 0.5) / 100;
}
function char2width(chr) {
  return Math.round((chr * MDW + 5) / MDW * 256) / 256;
}
function process_col(coll) {
  if (coll.width) {
    coll.wpx = width2px(coll.width);
    coll.wch = px2char(coll.wpx);
    coll.MDW = MDW;
  } else if (coll.wpx) {
    coll.wch = px2char(coll.wpx);
    coll.width = char2width(coll.wch);
    coll.MDW = MDW;
  } else if (typeof coll.wch == "number") {
    coll.width = char2width(coll.wch);
    coll.wpx = width2px(coll.width);
    coll.MDW = MDW;
  }
  if (coll.customWidth) delete coll.customWidth;
}
var DEF_PPI = 96;
var PPI = DEF_PPI;
function px2pt(px) {
  return px * 96 / PPI;
}
function pt2px(pt) {
  return pt * PPI / 96;
}
function write_numFmts(NF) {
  var o = ["<numFmts>"];
  [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(r) {
    for (var i = r[0]; i <= r[1]; ++i) if (NF[i] != null) o[o.length] = writextag("numFmt", null, {
      numFmtId: i,
      formatCode: escapexml(NF[i])
    });
  });
  if (o.length === 1) return "";
  o[o.length] = "</numFmts>";
  o[0] = writextag("numFmts", null, {
    count: o.length - 2
  }).replace("/>", ">");
  return o.join("");
}
function write_cellXfs(cellXfs) {
  var o = [];
  o[o.length] = writextag("cellXfs", null);
  cellXfs.forEach(function(c) {
    o[o.length] = writextag("xf", null, c);
  });
  o[o.length] = "</cellXfs>";
  if (o.length === 2) return "";
  o[0] = writextag("cellXfs", null, {
    count: o.length - 2
  }).replace("/>", ">");
  return o.join("");
}
function write_sty_xml(wb, opts) {
  var o = [XML_HEADER, writextag("styleSheet", null, {
    "xmlns": XMLNS_main[0],
    "xmlns:vt": XMLNS.vt
  })], w;
  if (wb.SSF && (w = write_numFmts(wb.SSF)) != null) o[o.length] = w;
  o[o.length] = '<fonts count="1"><font><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>';
  o[o.length] = '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>';
  o[o.length] = '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>';
  o[o.length] = '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
  if (w = write_cellXfs(opts.cellXfs)) o[o.length] = w;
  o[o.length] = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>';
  o[o.length] = '<dxfs count="0"/>';
  o[o.length] = '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4"/>';
  if (o.length > 2) {
    o[o.length] = "</styleSheet>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function parse_BrtFmt(data, length) {
  var numFmtId = data.read_shift(2);
  var stFmtCode = parse_XLWideString(data, length - 2);
  return [numFmtId, stFmtCode];
}
function write_BrtFmt(i, f, o) {
  if (!o) o = new_buf(6 + 4 * f.length);
  o.write_shift(2, i);
  write_XLWideString(f, o);
  var out = o.length > o.l ? o.slice(0, o.l) : o;
  if (o.l == null) o.l = o.length;
  return out;
}
function parse_BrtFont(data, length, opts) {
  var out = {};
  out.sz = data.read_shift(2) / 20;
  var grbit = parse_FontFlags(data, 2, opts);
  if (grbit.fItalic) out.italic = 1;
  if (grbit.fCondense) out.condense = 1;
  if (grbit.fExtend) out.extend = 1;
  if (grbit.fShadow) out.shadow = 1;
  if (grbit.fOutline) out.outline = 1;
  if (grbit.fStrikeout) out.strike = 1;
  var bls = data.read_shift(2);
  if (bls === 700) out.bold = 1;
  switch (data.read_shift(2)) {
    case 1:
      out.vertAlign = "superscript";
      break;
    case 2:
      out.vertAlign = "subscript";
      break;
  }
  var underline = data.read_shift(1);
  if (underline != 0) out.underline = underline;
  var family = data.read_shift(1);
  if (family > 0) out.family = family;
  var bCharSet = data.read_shift(1);
  if (bCharSet > 0) out.charset = bCharSet;
  data.l++;
  out.color = parse_BrtColor(data, 8);
  switch (data.read_shift(1)) {
    case 1:
      out.scheme = "major";
      break;
    case 2:
      out.scheme = "minor";
      break;
  }
  out.name = parse_XLWideString(data, length - 21);
  return out;
}
function write_BrtFont(font, o) {
  if (!o) o = new_buf(25 + 4 * 32);
  o.write_shift(2, font.sz * 20);
  write_FontFlags(font, o);
  o.write_shift(2, font.bold ? 700 : 400);
  var sss = 0;
  if (font.vertAlign == "superscript") sss = 1;
  else if (font.vertAlign == "subscript") sss = 2;
  o.write_shift(2, sss);
  o.write_shift(1, font.underline || 0);
  o.write_shift(1, font.family || 0);
  o.write_shift(1, font.charset || 0);
  o.write_shift(1, 0);
  write_BrtColor(font.color, o);
  var scheme = 0;
  if (font.scheme == "major") scheme = 1;
  if (font.scheme == "minor") scheme = 2;
  o.write_shift(1, scheme);
  write_XLWideString(font.name, o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
var XLSBFillPTNames = ["none", "solid", "mediumGray", "darkGray", "lightGray", "darkHorizontal", "darkVertical", "darkDown", "darkUp", "darkGrid", "darkTrellis", "lightHorizontal", "lightVertical", "lightDown", "lightUp", "lightGrid", "lightTrellis", "gray125", "gray0625"];
var rev_XLSBFillPTNames;
var parse_BrtFill = parsenoop;
function write_BrtFill(fill2, o) {
  if (!o) o = new_buf(4 * 3 + 8 * 7 + 16 * 1);
  if (!rev_XLSBFillPTNames) rev_XLSBFillPTNames = evert(XLSBFillPTNames);
  var fls = rev_XLSBFillPTNames[fill2.patternType];
  if (fls == null) fls = 40;
  o.write_shift(4, fls);
  var j = 0;
  if (fls != 40) {
    write_BrtColor({
      auto: 1
    }, o);
    write_BrtColor({
      auto: 1
    }, o);
    for (; j < 12; ++j) o.write_shift(4, 0);
  } else {
    for (; j < 4; ++j) o.write_shift(4, 0);
    for (; j < 12; ++j) o.write_shift(4, 0);
  }
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function parse_BrtXF(data, length) {
  var tgt = data.l + length;
  var ixfeParent = data.read_shift(2);
  var ifmt = data.read_shift(2);
  data.l = tgt;
  return {
    ixfe: ixfeParent,
    numFmtId: ifmt
  };
}
function write_BrtXF(data, ixfeP, o) {
  if (!o) o = new_buf(16);
  o.write_shift(2, ixfeP || 0);
  o.write_shift(2, data.numFmtId || 0);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(1, 0);
  o.write_shift(1, 0);
  var flow = 0;
  o.write_shift(1, flow);
  o.write_shift(1, 0);
  o.write_shift(1, 0);
  o.write_shift(1, 0);
  return o;
}
function write_Blxf(data, o) {
  if (!o) o = new_buf(10);
  o.write_shift(1, 0);
  o.write_shift(1, 0);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  return o;
}
var parse_BrtBorder = parsenoop;
function write_BrtBorder(border, o) {
  if (!o) o = new_buf(51);
  o.write_shift(1, 0);
  write_Blxf(null, o);
  write_Blxf(null, o);
  write_Blxf(null, o);
  write_Blxf(null, o);
  write_Blxf(null, o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_BrtStyle(style, o) {
  if (!o) o = new_buf(12 + 4 * 10);
  o.write_shift(4, style.xfId);
  o.write_shift(2, 1);
  o.write_shift(1, +style.builtinId);
  o.write_shift(1, 0);
  write_XLNullableWideString(style.name || "", o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_BrtBeginTableStyles(cnt, defTableStyle, defPivotStyle) {
  var o = new_buf(4 + 256 * 2 * 4);
  o.write_shift(4, cnt);
  write_XLNullableWideString(defTableStyle, o);
  write_XLNullableWideString(defPivotStyle, o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_FMTS_bin(ba, NF) {
  if (!NF) return;
  var cnt = 0;
  [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(r) {
    for (var i = r[0]; i <= r[1]; ++i) if (NF[i] != null) ++cnt;
  });
  if (cnt == 0) return;
  write_record(ba, 615, write_UInt32LE(cnt));
  [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(r) {
    for (var i = r[0]; i <= r[1]; ++i) if (NF[i] != null) write_record(ba, 44, write_BrtFmt(i, NF[i]));
  });
  write_record(
    ba,
    616
    /* BrtEndFmts */
  );
}
function write_FONTS_bin(ba) {
  var cnt = 1;
  if (cnt == 0) return;
  write_record(ba, 611, write_UInt32LE(cnt));
  write_record(ba, 43, write_BrtFont({
    sz: 12,
    color: {
      theme: 1
    },
    name: "Calibri",
    family: 2,
    scheme: "minor"
  }));
  write_record(
    ba,
    612
    /* BrtEndFonts */
  );
}
function write_FILLS_bin(ba) {
  var cnt = 2;
  if (cnt == 0) return;
  write_record(ba, 603, write_UInt32LE(cnt));
  write_record(ba, 45, write_BrtFill({
    patternType: "none"
  }));
  write_record(ba, 45, write_BrtFill({
    patternType: "gray125"
  }));
  write_record(
    ba,
    604
    /* BrtEndFills */
  );
}
function write_BORDERS_bin(ba) {
  var cnt = 1;
  if (cnt == 0) return;
  write_record(ba, 613, write_UInt32LE(cnt));
  write_record(ba, 46, write_BrtBorder({}));
  write_record(
    ba,
    614
    /* BrtEndBorders */
  );
}
function write_CELLSTYLEXFS_bin(ba) {
  var cnt = 1;
  write_record(ba, 626, write_UInt32LE(cnt));
  write_record(ba, 47, write_BrtXF({
    numFmtId: 0,
    fontId: 0,
    fillId: 0,
    borderId: 0
  }, 65535));
  write_record(
    ba,
    627
    /* BrtEndCellStyleXFs */
  );
}
function write_CELLXFS_bin(ba, data) {
  write_record(ba, 617, write_UInt32LE(data.length));
  data.forEach(function(c) {
    write_record(ba, 47, write_BrtXF(c, 0));
  });
  write_record(
    ba,
    618
    /* BrtEndCellXFs */
  );
}
function write_STYLES_bin(ba) {
  var cnt = 1;
  write_record(ba, 619, write_UInt32LE(cnt));
  write_record(ba, 48, write_BrtStyle({
    xfId: 0,
    builtinId: 0,
    name: "Normal"
  }));
  write_record(
    ba,
    620
    /* BrtEndStyles */
  );
}
function write_DXFS_bin(ba) {
  var cnt = 0;
  write_record(ba, 505, write_UInt32LE(cnt));
  write_record(
    ba,
    506
    /* BrtEndDXFs */
  );
}
function write_TABLESTYLES_bin(ba) {
  var cnt = 0;
  write_record(ba, 508, write_BrtBeginTableStyles(cnt, "TableStyleMedium9", "PivotStyleMedium4"));
  write_record(
    ba,
    509
    /* BrtEndTableStyles */
  );
}
function write_COLORPALETTE_bin() {
  return;
}
function write_sty_bin(wb, opts) {
  var ba = buf_array();
  write_record(
    ba,
    278
    /* BrtBeginStyleSheet */
  );
  write_FMTS_bin(ba, wb.SSF);
  write_FONTS_bin(ba, wb);
  write_FILLS_bin(ba, wb);
  write_BORDERS_bin(ba, wb);
  write_CELLSTYLEXFS_bin(ba, wb);
  write_CELLXFS_bin(ba, opts.cellXfs);
  write_STYLES_bin(ba, wb);
  write_DXFS_bin(ba, wb);
  write_TABLESTYLES_bin(ba, wb);
  write_COLORPALETTE_bin(ba, wb);
  write_record(
    ba,
    279
    /* BrtEndStyleSheet */
  );
  return ba.end();
}
function write_theme(Themes, opts) {
  if (opts && opts.themeXLSX) return opts.themeXLSX;
  if (Themes && typeof Themes.raw == "string") return Themes.raw;
  var o = [XML_HEADER];
  o[o.length] = '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">';
  o[o.length] = "<a:themeElements>";
  o[o.length] = '<a:clrScheme name="Office">';
  o[o.length] = '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>';
  o[o.length] = '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>';
  o[o.length] = '<a:dk2><a:srgbClr val="1F497D"/></a:dk2>';
  o[o.length] = '<a:lt2><a:srgbClr val="EEECE1"/></a:lt2>';
  o[o.length] = '<a:accent1><a:srgbClr val="4F81BD"/></a:accent1>';
  o[o.length] = '<a:accent2><a:srgbClr val="C0504D"/></a:accent2>';
  o[o.length] = '<a:accent3><a:srgbClr val="9BBB59"/></a:accent3>';
  o[o.length] = '<a:accent4><a:srgbClr val="8064A2"/></a:accent4>';
  o[o.length] = '<a:accent5><a:srgbClr val="4BACC6"/></a:accent5>';
  o[o.length] = '<a:accent6><a:srgbClr val="F79646"/></a:accent6>';
  o[o.length] = '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>';
  o[o.length] = '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>';
  o[o.length] = "</a:clrScheme>";
  o[o.length] = '<a:fontScheme name="Office">';
  o[o.length] = "<a:majorFont>";
  o[o.length] = '<a:latin typeface="Cambria"/>';
  o[o.length] = '<a:ea typeface=""/>';
  o[o.length] = '<a:cs typeface=""/>';
  o[o.length] = '<a:font script="Jpan" typeface="\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF"/>';
  o[o.length] = '<a:font script="Hang" typeface="\uB9D1\uC740 \uACE0\uB515"/>';
  o[o.length] = '<a:font script="Hans" typeface="\u5B8B\u4F53"/>';
  o[o.length] = '<a:font script="Hant" typeface="\u65B0\u7D30\u660E\u9AD4"/>';
  o[o.length] = '<a:font script="Arab" typeface="Times New Roman"/>';
  o[o.length] = '<a:font script="Hebr" typeface="Times New Roman"/>';
  o[o.length] = '<a:font script="Thai" typeface="Tahoma"/>';
  o[o.length] = '<a:font script="Ethi" typeface="Nyala"/>';
  o[o.length] = '<a:font script="Beng" typeface="Vrinda"/>';
  o[o.length] = '<a:font script="Gujr" typeface="Shruti"/>';
  o[o.length] = '<a:font script="Khmr" typeface="MoolBoran"/>';
  o[o.length] = '<a:font script="Knda" typeface="Tunga"/>';
  o[o.length] = '<a:font script="Guru" typeface="Raavi"/>';
  o[o.length] = '<a:font script="Cans" typeface="Euphemia"/>';
  o[o.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>';
  o[o.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>';
  o[o.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>';
  o[o.length] = '<a:font script="Thaa" typeface="MV Boli"/>';
  o[o.length] = '<a:font script="Deva" typeface="Mangal"/>';
  o[o.length] = '<a:font script="Telu" typeface="Gautami"/>';
  o[o.length] = '<a:font script="Taml" typeface="Latha"/>';
  o[o.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>';
  o[o.length] = '<a:font script="Orya" typeface="Kalinga"/>';
  o[o.length] = '<a:font script="Mlym" typeface="Kartika"/>';
  o[o.length] = '<a:font script="Laoo" typeface="DokChampa"/>';
  o[o.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>';
  o[o.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>';
  o[o.length] = '<a:font script="Viet" typeface="Times New Roman"/>';
  o[o.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>';
  o[o.length] = '<a:font script="Geor" typeface="Sylfaen"/>';
  o[o.length] = "</a:majorFont>";
  o[o.length] = "<a:minorFont>";
  o[o.length] = '<a:latin typeface="Calibri"/>';
  o[o.length] = '<a:ea typeface=""/>';
  o[o.length] = '<a:cs typeface=""/>';
  o[o.length] = '<a:font script="Jpan" typeface="\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF"/>';
  o[o.length] = '<a:font script="Hang" typeface="\uB9D1\uC740 \uACE0\uB515"/>';
  o[o.length] = '<a:font script="Hans" typeface="\u5B8B\u4F53"/>';
  o[o.length] = '<a:font script="Hant" typeface="\u65B0\u7D30\u660E\u9AD4"/>';
  o[o.length] = '<a:font script="Arab" typeface="Arial"/>';
  o[o.length] = '<a:font script="Hebr" typeface="Arial"/>';
  o[o.length] = '<a:font script="Thai" typeface="Tahoma"/>';
  o[o.length] = '<a:font script="Ethi" typeface="Nyala"/>';
  o[o.length] = '<a:font script="Beng" typeface="Vrinda"/>';
  o[o.length] = '<a:font script="Gujr" typeface="Shruti"/>';
  o[o.length] = '<a:font script="Khmr" typeface="DaunPenh"/>';
  o[o.length] = '<a:font script="Knda" typeface="Tunga"/>';
  o[o.length] = '<a:font script="Guru" typeface="Raavi"/>';
  o[o.length] = '<a:font script="Cans" typeface="Euphemia"/>';
  o[o.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>';
  o[o.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>';
  o[o.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>';
  o[o.length] = '<a:font script="Thaa" typeface="MV Boli"/>';
  o[o.length] = '<a:font script="Deva" typeface="Mangal"/>';
  o[o.length] = '<a:font script="Telu" typeface="Gautami"/>';
  o[o.length] = '<a:font script="Taml" typeface="Latha"/>';
  o[o.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>';
  o[o.length] = '<a:font script="Orya" typeface="Kalinga"/>';
  o[o.length] = '<a:font script="Mlym" typeface="Kartika"/>';
  o[o.length] = '<a:font script="Laoo" typeface="DokChampa"/>';
  o[o.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>';
  o[o.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>';
  o[o.length] = '<a:font script="Viet" typeface="Arial"/>';
  o[o.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>';
  o[o.length] = '<a:font script="Geor" typeface="Sylfaen"/>';
  o[o.length] = "</a:minorFont>";
  o[o.length] = "</a:fontScheme>";
  o[o.length] = '<a:fmtScheme name="Office">';
  o[o.length] = "<a:fillStyleLst>";
  o[o.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
  o[o.length] = '<a:gradFill rotWithShape="1">';
  o[o.length] = "<a:gsLst>";
  o[o.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs>';
  o[o.length] = "</a:gsLst>";
  o[o.length] = '<a:lin ang="16200000" scaled="1"/>';
  o[o.length] = "</a:gradFill>";
  o[o.length] = '<a:gradFill rotWithShape="1">';
  o[o.length] = "<a:gsLst>";
  o[o.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>';
  o[o.length] = "</a:gsLst>";
  o[o.length] = '<a:lin ang="16200000" scaled="0"/>';
  o[o.length] = "</a:gradFill>";
  o[o.length] = "</a:fillStyleLst>";
  o[o.length] = "<a:lnStyleLst>";
  o[o.length] = '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln>';
  o[o.length] = '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>';
  o[o.length] = '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>';
  o[o.length] = "</a:lnStyleLst>";
  o[o.length] = "<a:effectStyleLst>";
  o[o.length] = "<a:effectStyle>";
  o[o.length] = "<a:effectLst>";
  o[o.length] = '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw>';
  o[o.length] = "</a:effectLst>";
  o[o.length] = "</a:effectStyle>";
  o[o.length] = "<a:effectStyle>";
  o[o.length] = "<a:effectLst>";
  o[o.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>';
  o[o.length] = "</a:effectLst>";
  o[o.length] = "</a:effectStyle>";
  o[o.length] = "<a:effectStyle>";
  o[o.length] = "<a:effectLst>";
  o[o.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>';
  o[o.length] = "</a:effectLst>";
  o[o.length] = '<a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d>';
  o[o.length] = '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>';
  o[o.length] = "</a:effectStyle>";
  o[o.length] = "</a:effectStyleLst>";
  o[o.length] = "<a:bgFillStyleLst>";
  o[o.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
  o[o.length] = '<a:gradFill rotWithShape="1">';
  o[o.length] = "<a:gsLst>";
  o[o.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs>';
  o[o.length] = "</a:gsLst>";
  o[o.length] = '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>';
  o[o.length] = "</a:gradFill>";
  o[o.length] = '<a:gradFill rotWithShape="1">';
  o[o.length] = "<a:gsLst>";
  o[o.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs>';
  o[o.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs>';
  o[o.length] = "</a:gsLst>";
  o[o.length] = '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>';
  o[o.length] = "</a:gradFill>";
  o[o.length] = "</a:bgFillStyleLst>";
  o[o.length] = "</a:fmtScheme>";
  o[o.length] = "</a:themeElements>";
  o[o.length] = "<a:objectDefaults>";
  o[o.length] = "<a:spDef>";
  o[o.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style>';
  o[o.length] = "</a:spDef>";
  o[o.length] = "<a:lnDef>";
  o[o.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style>';
  o[o.length] = "</a:lnDef>";
  o[o.length] = "</a:objectDefaults>";
  o[o.length] = "<a:extraClrSchemeLst/>";
  o[o.length] = "</a:theme>";
  return o.join("");
}
function parse_BrtMdtinfo(data, length) {
  return {
    flags: data.read_shift(4),
    version: data.read_shift(4),
    name: parse_XLWideString(data, length - 8)
  };
}
function write_BrtMdtinfo(data) {
  var o = new_buf(12 + 2 * data.name.length);
  o.write_shift(4, data.flags);
  o.write_shift(4, data.version);
  write_XLWideString(data.name, o);
  return o.slice(0, o.l);
}
function parse_BrtMdb(data) {
  var out = [];
  var cnt = data.read_shift(4);
  while (cnt-- > 0) out.push([data.read_shift(4), data.read_shift(4)]);
  return out;
}
function write_BrtMdb(mdb) {
  var o = new_buf(4 + 8 * mdb.length);
  o.write_shift(4, mdb.length);
  for (var i = 0; i < mdb.length; ++i) {
    o.write_shift(4, mdb[i][0]);
    o.write_shift(4, mdb[i][1]);
  }
  return o;
}
function write_BrtBeginEsfmd(cnt, name) {
  var o = new_buf(8 + 2 * name.length);
  o.write_shift(4, cnt);
  write_XLWideString(name, o);
  return o.slice(0, o.l);
}
function parse_BrtBeginEsmdb(data) {
  data.l += 4;
  return data.read_shift(4) != 0;
}
function write_BrtBeginEsmdb(cnt, cm) {
  var o = new_buf(8);
  o.write_shift(4, cnt);
  o.write_shift(4, cm ? 1 : 0);
  return o;
}
function write_xlmeta_bin() {
  var ba = buf_array();
  write_record(ba, 332);
  write_record(ba, 334, write_UInt32LE(1));
  write_record(ba, 335, write_BrtMdtinfo({
    name: "XLDAPR",
    version: 12e4,
    flags: 3496657072
  }));
  write_record(ba, 336);
  write_record(ba, 339, write_BrtBeginEsfmd(1, "XLDAPR"));
  write_record(ba, 52);
  write_record(ba, 35, write_UInt32LE(514));
  write_record(ba, 4096, write_UInt32LE(0));
  write_record(ba, 4097, writeuint16(1));
  write_record(ba, 36);
  write_record(ba, 53);
  write_record(ba, 340);
  write_record(ba, 337, write_BrtBeginEsmdb(1, true));
  write_record(ba, 51, write_BrtMdb([[1, 0]]));
  write_record(ba, 338);
  write_record(ba, 333);
  return ba.end();
}
function write_xlmeta_xml() {
  var o = [XML_HEADER];
  o.push('<metadata xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:xlrd="http://schemas.microsoft.com/office/spreadsheetml/2017/richdata" xmlns:xda="http://schemas.microsoft.com/office/spreadsheetml/2017/dynamicarray">\n  <metadataTypes count="1">\n    <metadataType name="XLDAPR" minSupportedVersion="120000" copy="1" pasteAll="1" pasteValues="1" merge="1" splitFirst="1" rowColShift="1" clearFormats="1" clearComments="1" assign="1" coerce="1" cellMeta="1"/>\n  </metadataTypes>\n  <futureMetadata name="XLDAPR" count="1">\n    <bk>\n      <extLst>\n        <ext uri="{bdbb8cdc-fa1e-496e-a857-3c3f30c029c3}">\n          <xda:dynamicArrayProperties fDynamic="1" fCollapsed="0"/>\n        </ext>\n      </extLst>\n    </bk>\n  </futureMetadata>\n  <cellMetadata count="1">\n    <bk>\n      <rc t="1" v="0"/>\n    </bk>\n  </cellMetadata>\n</metadata>');
  return o.join("");
}
function parse_BrtCalcChainItem$(data) {
  var out = {};
  out.i = data.read_shift(4);
  var cell = {};
  cell.r = data.read_shift(4);
  cell.c = data.read_shift(4);
  out.r = encode_cell(cell);
  var flags = data.read_shift(1);
  if (flags & 2) out.l = "1";
  if (flags & 8) out.a = "1";
  return out;
}
var _shapeid = 1024;
function write_comments_vml(rId, comments) {
  var csize = [21600, 21600];
  var bbox = ["m0,0l0", csize[1], csize[0], csize[1], csize[0], "0xe"].join(",");
  var o = [writextag("xml", null, {
    "xmlns:v": XLMLNS.v,
    "xmlns:o": XLMLNS.o,
    "xmlns:x": XLMLNS.x,
    "xmlns:mv": XLMLNS.mv
  }).replace(/\/>/, ">"), writextag("o:shapelayout", writextag("o:idmap", null, {
    "v:ext": "edit",
    "data": rId
  }), {
    "v:ext": "edit"
  }), writextag("v:shapetype", [writextag("v:stroke", null, {
    joinstyle: "miter"
  }), writextag("v:path", null, {
    gradientshapeok: "t",
    "o:connecttype": "rect"
  })].join(""), {
    id: "_x0000_t202",
    "o:spt": 202,
    coordsize: csize.join(","),
    path: bbox
  })];
  while (_shapeid < rId * 1e3) _shapeid += 1e3;
  comments.forEach(function(x) {
    var c = decode_cell(x[0]);
    var fillopts = (
      /*::(*/
      {
        "color2": "#BEFF82",
        "type": "gradient"
      }
    );
    if (fillopts.type == "gradient") fillopts.angle = "-180";
    var fillparm = fillopts.type == "gradient" ? writextag("o:fill", null, {
      type: "gradientUnscaled",
      "v:ext": "view"
    }) : null;
    var fillxml = writextag("v:fill", fillparm, fillopts);
    var shadata = {
      on: "t",
      "obscured": "t"
    };
    ++_shapeid;
    o = o.concat([
      "<v:shape" + wxt_helper({
        id: "_x0000_s" + _shapeid,
        type: "#_x0000_t202",
        style: "position:absolute; margin-left:80pt;margin-top:5pt;width:104pt;height:64pt;z-index:10" + (x[1].hidden ? ";visibility:hidden" : ""),
        fillcolor: "#ECFAD4",
        strokecolor: "#edeaa1"
      }) + ">",
      fillxml,
      writextag("v:shadow", null, shadata),
      writextag("v:path", null, {
        "o:connecttype": "none"
      }),
      '<v:textbox><div style="text-align:left"></div></v:textbox>',
      '<x:ClientData ObjectType="Note">',
      "<x:MoveWithCells/>",
      "<x:SizeWithCells/>",
      /* Part 4 19.4.2.3 Anchor (Anchor) */
      writetag("x:Anchor", [c.c + 1, 0, c.r + 1, 0, c.c + 3, 20, c.r + 5, 20].join(",")),
      writetag("x:AutoFill", "False"),
      writetag("x:Row", String(c.r)),
      writetag("x:Column", String(c.c)),
      x[1].hidden ? "" : "<x:Visible/>",
      "</x:ClientData>",
      "</v:shape>"
    ]);
  });
  o.push("</xml>");
  return o.join("");
}
function write_comments_xml(data) {
  var o = [XML_HEADER, writextag("comments", null, {
    "xmlns": XMLNS_main[0]
  })];
  var iauthor = [];
  o.push("<authors>");
  data.forEach(function(x) {
    x[1].forEach(function(w) {
      var a = escapexml(w.a);
      if (iauthor.indexOf(a) == -1) {
        iauthor.push(a);
        o.push("<author>" + a + "</author>");
      }
      if (w.T && w.ID && iauthor.indexOf("tc=" + w.ID) == -1) {
        iauthor.push("tc=" + w.ID);
        o.push("<author>tc=" + w.ID + "</author>");
      }
    });
  });
  if (iauthor.length == 0) {
    iauthor.push("SheetJ5");
    o.push("<author>SheetJ5</author>");
  }
  o.push("</authors>");
  o.push("<commentList>");
  data.forEach(function(d) {
    var lastauthor = 0, ts = [];
    if (d[1][0] && d[1][0].T && d[1][0].ID) lastauthor = iauthor.indexOf("tc=" + d[1][0].ID);
    else d[1].forEach(function(c) {
      if (c.a) lastauthor = iauthor.indexOf(escapexml(c.a));
      ts.push(c.t || "");
    });
    o.push('<comment ref="' + d[0] + '" authorId="' + lastauthor + '"><text>');
    if (ts.length <= 1) o.push(writetag("t", escapexml(ts[0] || "")));
    else {
      var t = "Comment:\n    " + ts[0] + "\n";
      for (var i = 1; i < ts.length; ++i) t += "Reply:\n    " + ts[i] + "\n";
      o.push(writetag("t", escapexml(t)));
    }
    o.push("</text></comment>");
  });
  o.push("</commentList>");
  if (o.length > 2) {
    o[o.length] = "</comments>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function write_tcmnt_xml(comments, people, opts) {
  var o = [XML_HEADER, writextag("ThreadedComments", null, {
    "xmlns": XMLNS.TCMNT
  }).replace(/[\/]>/, ">")];
  comments.forEach(function(carr) {
    var rootid = "";
    (carr[1] || []).forEach(function(c, idx) {
      if (!c.T) {
        delete c.ID;
        return;
      }
      if (c.a && people.indexOf(c.a) == -1) people.push(c.a);
      var tcopts = {
        ref: carr[0],
        id: "{54EE7951-7262-4200-6969-" + ("000000000000" + opts.tcid++).slice(-12) + "}"
      };
      if (idx == 0) rootid = tcopts.id;
      else tcopts.parentId = rootid;
      c.ID = tcopts.id;
      if (c.a) tcopts.personId = "{54EE7950-7262-4200-6969-" + ("000000000000" + people.indexOf(c.a)).slice(-12) + "}";
      o.push(writextag("threadedComment", writetag("text", c.t || ""), tcopts));
    });
  });
  o.push("</ThreadedComments>");
  return o.join("");
}
function write_people_xml(people) {
  var o = [XML_HEADER, writextag("personList", null, {
    "xmlns": XMLNS.TCMNT,
    "xmlns:x": XMLNS_main[0]
  }).replace(/[\/]>/, ">")];
  people.forEach(function(person, idx) {
    o.push(writextag("person", null, {
      displayName: person,
      id: "{54EE7950-7262-4200-6969-" + ("000000000000" + idx).slice(-12) + "}",
      userId: person,
      providerId: "None"
    }));
  });
  o.push("</personList>");
  return o.join("");
}
function parse_BrtBeginComment(data) {
  var out = {};
  out.iauthor = data.read_shift(4);
  var rfx = parse_UncheckedRfX(data, 16);
  out.rfx = rfx.s;
  out.ref = encode_cell(rfx.s);
  data.l += 16;
  return out;
}
function write_BrtBeginComment(data, o) {
  if (o == null) o = new_buf(36);
  o.write_shift(4, data[1].iauthor);
  write_UncheckedRfX(data[0], o);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  return o;
}
var parse_BrtCommentAuthor = parse_XLWideString;
function write_BrtCommentAuthor(data) {
  return write_XLWideString(data.slice(0, 54));
}
function write_comments_bin(data) {
  var ba = buf_array();
  var iauthor = [];
  write_record(
    ba,
    628
    /* BrtBeginComments */
  );
  write_record(
    ba,
    630
    /* BrtBeginCommentAuthors */
  );
  data.forEach(function(comment) {
    comment[1].forEach(function(c) {
      if (iauthor.indexOf(c.a) > -1) return;
      iauthor.push(c.a.slice(0, 54));
      write_record(ba, 632, write_BrtCommentAuthor(c.a));
    });
  });
  write_record(
    ba,
    631
    /* BrtEndCommentAuthors */
  );
  write_record(
    ba,
    633
    /* BrtBeginCommentList */
  );
  data.forEach(function(comment) {
    comment[1].forEach(function(c) {
      c.iauthor = iauthor.indexOf(c.a);
      var range = {
        s: decode_cell(comment[0]),
        e: decode_cell(comment[0])
      };
      write_record(ba, 635, write_BrtBeginComment([range, c]));
      if (c.t && c.t.length > 0) write_record(ba, 637, write_BrtCommentText(c));
      write_record(
        ba,
        636
        /* BrtEndComment */
      );
      delete c.iauthor;
    });
  });
  write_record(
    ba,
    634
    /* BrtEndCommentList */
  );
  write_record(
    ba,
    629
    /* BrtEndComments */
  );
  return ba.end();
}
function fill_vba_xls(cfb, vba) {
  vba.FullPaths.forEach(function(p, i) {
    if (i == 0) return;
    var newpath = p.replace(/[^\/]*[\/]/, "/_VBA_PROJECT_CUR/");
    if (newpath.slice(-1) !== "/") CFB.utils.cfb_add(cfb, newpath, vba.FileIndex[i].content);
  });
}
var VBAFMTS = ["xlsb", "xlsm", "xlam", "biff8", "xla"];
var rc_to_a1 = /* @__PURE__ */ function() {
  var rcregex = /(^|[^A-Za-z_])R(\[?-?\d+\]|[1-9]\d*|)C(\[?-?\d+\]|[1-9]\d*|)(?![A-Za-z0-9_])/g;
  var rcbase = {
    r: 0,
    c: 0
  };
  function rcfunc($$, $1, $2, $3) {
    var cRel = false, rRel = false;
    if ($2.length == 0) rRel = true;
    else if ($2.charAt(0) == "[") {
      rRel = true;
      $2 = $2.slice(1, -1);
    }
    if ($3.length == 0) cRel = true;
    else if ($3.charAt(0) == "[") {
      cRel = true;
      $3 = $3.slice(1, -1);
    }
    var R = $2.length > 0 ? parseInt($2, 10) | 0 : 0, C = $3.length > 0 ? parseInt($3, 10) | 0 : 0;
    if (cRel) C += rcbase.c;
    else --C;
    if (rRel) R += rcbase.r;
    else --R;
    return $1 + (cRel ? "" : "$") + encode_col(C) + (rRel ? "" : "$") + encode_row(R);
  }
  return function rc_to_a12(fstr, base) {
    rcbase = base;
    return fstr.replace(rcregex, rcfunc);
  };
}();
var crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})(?![_.\(A-Za-z0-9])/g;
var a1_to_rc = /* @__PURE__ */ function() {
  return function a1_to_rc2(fstr, base) {
    return fstr.replace(crefregex, function($0, $1, $2, $3, $4, $5) {
      var c = decode_col($3) - ($2 ? 0 : base.c);
      var r = decode_row($5) - ($4 ? 0 : base.r);
      var R = r == 0 ? "" : !$4 ? "[" + r + "]" : r + 1;
      var C = c == 0 ? "" : !$2 ? "[" + c + "]" : c + 1;
      return $1 + "R" + R + "C" + C;
    });
  };
}();
function shift_formula_str(f, delta) {
  return f.replace(crefregex, function($0, $1, $2, $3, $4, $5) {
    return $1 + ($2 == "$" ? $2 + $3 : encode_col(decode_col($3) + delta.c)) + ($4 == "$" ? $4 + $5 : encode_row(decode_row($5) + delta.r));
  });
}
function fuzzyfmla(f) {
  if (f.length == 1) return false;
  return true;
}
function parseread1(blob) {
  blob.l += 1;
  return;
}
function parse_ColRelU(blob, length) {
  var c = blob.read_shift(length == 1 ? 1 : 2);
  return [c & 16383, c >> 14 & 1, c >> 15 & 1];
}
function parse_RgceArea(blob, length, opts) {
  var w = 2;
  if (opts) {
    if (opts.biff >= 2 && opts.biff <= 5) return parse_RgceArea_BIFF2(blob, length, opts);
    else if (opts.biff == 12) w = 4;
  }
  var r = blob.read_shift(w), R = blob.read_shift(w);
  var c = parse_ColRelU(blob, 2);
  var C = parse_ColRelU(blob, 2);
  return {
    s: {
      r,
      c: c[0],
      cRel: c[1],
      rRel: c[2]
    },
    e: {
      r: R,
      c: C[0],
      cRel: C[1],
      rRel: C[2]
    }
  };
}
function parse_RgceArea_BIFF2(blob) {
  var r = parse_ColRelU(blob, 2), R = parse_ColRelU(blob, 2);
  var c = blob.read_shift(1);
  var C = blob.read_shift(1);
  return {
    s: {
      r: r[0],
      c,
      cRel: r[1],
      rRel: r[2]
    },
    e: {
      r: R[0],
      c: C,
      cRel: R[1],
      rRel: R[2]
    }
  };
}
function parse_RgceAreaRel(blob, length, opts) {
  if (opts.biff < 8) return parse_RgceArea_BIFF2(blob, length, opts);
  var r = blob.read_shift(opts.biff == 12 ? 4 : 2), R = blob.read_shift(opts.biff == 12 ? 4 : 2);
  var c = parse_ColRelU(blob, 2);
  var C = parse_ColRelU(blob, 2);
  return {
    s: {
      r,
      c: c[0],
      cRel: c[1],
      rRel: c[2]
    },
    e: {
      r: R,
      c: C[0],
      cRel: C[1],
      rRel: C[2]
    }
  };
}
function parse_RgceLoc(blob, length, opts) {
  if (opts && opts.biff >= 2 && opts.biff <= 5) return parse_RgceLoc_BIFF2(blob, length, opts);
  var r = blob.read_shift(opts && opts.biff == 12 ? 4 : 2);
  var c = parse_ColRelU(blob, 2);
  return {
    r,
    c: c[0],
    cRel: c[1],
    rRel: c[2]
  };
}
function parse_RgceLoc_BIFF2(blob) {
  var r = parse_ColRelU(blob, 2);
  var c = blob.read_shift(1);
  return {
    r: r[0],
    c,
    cRel: r[1],
    rRel: r[2]
  };
}
function parse_RgceElfLoc(blob) {
  var r = blob.read_shift(2);
  var c = blob.read_shift(2);
  return {
    r,
    c: c & 255,
    fQuoted: !!(c & 16384),
    cRel: c >> 15,
    rRel: c >> 15
  };
}
function parse_RgceLocRel(blob, length, opts) {
  var biff = opts && opts.biff ? opts.biff : 8;
  if (biff >= 2 && biff <= 5) return parse_RgceLocRel_BIFF2(blob, length, opts);
  var r = blob.read_shift(biff >= 12 ? 4 : 2);
  var cl = blob.read_shift(2);
  var cRel = (cl & 16384) >> 14, rRel = (cl & 32768) >> 15;
  cl &= 16383;
  if (rRel == 1) while (r > 524287) r -= 1048576;
  if (cRel == 1) while (cl > 8191) cl = cl - 16384;
  return {
    r,
    c: cl,
    cRel,
    rRel
  };
}
function parse_RgceLocRel_BIFF2(blob) {
  var rl = blob.read_shift(2);
  var c = blob.read_shift(1);
  var rRel = (rl & 32768) >> 15, cRel = (rl & 16384) >> 14;
  rl &= 16383;
  if (rRel == 1 && rl >= 8192) rl = rl - 16384;
  if (cRel == 1 && c >= 128) c = c - 256;
  return {
    r: rl,
    c,
    cRel,
    rRel
  };
}
function parse_PtgArea(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  var area = parse_RgceArea(blob, opts.biff >= 2 && opts.biff <= 5 ? 6 : 8, opts);
  return [type, area];
}
function parse_PtgArea3d(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  var ixti = blob.read_shift(2, "i");
  var w = 8;
  if (opts) switch (opts.biff) {
    case 5:
      blob.l += 12;
      w = 6;
      break;
    case 12:
      w = 12;
      break;
  }
  var area = parse_RgceArea(blob, w, opts);
  return [type, ixti, area];
}
function parse_PtgAreaErr(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  blob.l += opts && opts.biff > 8 ? 12 : opts.biff < 8 ? 6 : 8;
  return [type];
}
function parse_PtgAreaErr3d(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  var ixti = blob.read_shift(2);
  var w = 8;
  if (opts) switch (opts.biff) {
    case 5:
      blob.l += 12;
      w = 6;
      break;
    case 12:
      w = 12;
      break;
  }
  blob.l += w;
  return [type, ixti];
}
function parse_PtgAreaN(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  var area = parse_RgceAreaRel(blob, length - 1, opts);
  return [type, area];
}
function parse_PtgArray(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  blob.l += opts.biff == 2 ? 6 : opts.biff == 12 ? 14 : 7;
  return [type];
}
function parse_PtgAttrBaxcel(blob) {
  var bitSemi = blob[blob.l + 1] & 1;
  var bitBaxcel = 1;
  blob.l += 4;
  return [bitSemi, bitBaxcel];
}
function parse_PtgAttrChoose(blob, length, opts) {
  blob.l += 2;
  var offset = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
  var o = [];
  for (var i = 0; i <= offset; ++i) o.push(blob.read_shift(opts && opts.biff == 2 ? 1 : 2));
  return o;
}
function parse_PtgAttrGoto(blob, length, opts) {
  var bitGoto = blob[blob.l + 1] & 255 ? 1 : 0;
  blob.l += 2;
  return [bitGoto, blob.read_shift(opts && opts.biff == 2 ? 1 : 2)];
}
function parse_PtgAttrIf(blob, length, opts) {
  var bitIf = blob[blob.l + 1] & 255 ? 1 : 0;
  blob.l += 2;
  return [bitIf, blob.read_shift(opts && opts.biff == 2 ? 1 : 2)];
}
function parse_PtgAttrIfError(blob) {
  var bitIf = blob[blob.l + 1] & 255 ? 1 : 0;
  blob.l += 2;
  return [bitIf, blob.read_shift(2)];
}
function parse_PtgAttrSemi(blob, length, opts) {
  var bitSemi = blob[blob.l + 1] & 255 ? 1 : 0;
  blob.l += opts && opts.biff == 2 ? 3 : 4;
  return [bitSemi];
}
function parse_PtgAttrSpaceType(blob) {
  var type = blob.read_shift(1), cch = blob.read_shift(1);
  return [type, cch];
}
function parse_PtgAttrSpace(blob) {
  blob.read_shift(2);
  return parse_PtgAttrSpaceType(blob, 2);
}
function parse_PtgAttrSpaceSemi(blob) {
  blob.read_shift(2);
  return parse_PtgAttrSpaceType(blob, 2);
}
function parse_PtgRef(blob, length, opts) {
  var type = (blob[blob.l] & 96) >> 5;
  blob.l += 1;
  var loc = parse_RgceLoc(blob, 0, opts);
  return [type, loc];
}
function parse_PtgRefN(blob, length, opts) {
  var type = (blob[blob.l] & 96) >> 5;
  blob.l += 1;
  var loc = parse_RgceLocRel(blob, 0, opts);
  return [type, loc];
}
function parse_PtgRef3d(blob, length, opts) {
  var type = (blob[blob.l] & 96) >> 5;
  blob.l += 1;
  var ixti = blob.read_shift(2);
  if (opts && opts.biff == 5) blob.l += 12;
  var loc = parse_RgceLoc(blob, 0, opts);
  return [type, ixti, loc];
}
function parse_PtgFunc(blob, length, opts) {
  var type = (blob[blob.l] & 96) >> 5;
  blob.l += 1;
  var iftab = blob.read_shift(opts && opts.biff <= 3 ? 1 : 2);
  return [FtabArgc[iftab], Ftab[iftab], type];
}
function parse_PtgFuncVar(blob, length, opts) {
  var type = blob[blob.l++];
  var cparams = blob.read_shift(1), tab = opts && opts.biff <= 3 ? [type == 88 ? -1 : 0, blob.read_shift(1)] : parsetab(blob);
  return [cparams, (tab[0] === 0 ? Ftab : Cetab)[tab[1]]];
}
function parsetab(blob) {
  return [blob[blob.l + 1] >> 7, blob.read_shift(2) & 32767];
}
function parse_PtgAttrSum(blob, length, opts) {
  blob.l += opts && opts.biff == 2 ? 3 : 4;
  return;
}
function parse_PtgExp(blob, length, opts) {
  blob.l++;
  if (opts && opts.biff == 12) return [blob.read_shift(4, "i"), 0];
  var row = blob.read_shift(2);
  var col = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
  return [row, col];
}
function parse_PtgErr(blob) {
  blob.l++;
  return BErr[blob.read_shift(1)];
}
function parse_PtgInt(blob) {
  blob.l++;
  return blob.read_shift(2);
}
function parse_PtgBool(blob) {
  blob.l++;
  return blob.read_shift(1) !== 0;
}
function parse_PtgNum(blob) {
  blob.l++;
  return parse_Xnum(blob, 8);
}
function parse_PtgStr(blob, length, opts) {
  blob.l++;
  return parse_ShortXLUnicodeString(blob, length - 1, opts);
}
function parse_SerAr(blob, biff) {
  var val = [blob.read_shift(1)];
  if (biff == 12) switch (val[0]) {
    case 2:
      val[0] = 4;
      break;
    case 4:
      val[0] = 16;
      break;
    case 0:
      val[0] = 1;
      break;
    case 1:
      val[0] = 2;
      break;
  }
  switch (val[0]) {
    case 4:
      val[1] = parsebool(blob, 1) ? "TRUE" : "FALSE";
      if (biff != 12) blob.l += 7;
      break;
    case 37:
    case 16:
      val[1] = BErr[blob[blob.l]];
      blob.l += biff == 12 ? 4 : 8;
      break;
    case 0:
      blob.l += 8;
      break;
    case 1:
      val[1] = parse_Xnum(blob, 8);
      break;
    case 2:
      val[1] = parse_XLUnicodeString2(blob, 0, {
        biff: biff > 0 && biff < 8 ? 2 : biff
      });
      break;
    default:
      throw new Error("Bad SerAr: " + val[0]);
  }
  return val;
}
function parse_PtgExtraMem(blob, cce, opts) {
  var count = blob.read_shift(opts.biff == 12 ? 4 : 2);
  var out = [];
  for (var i = 0; i != count; ++i) out.push((opts.biff == 12 ? parse_UncheckedRfX : parse_Ref8U)(blob, 8));
  return out;
}
function parse_PtgExtraArray(blob, length, opts) {
  var rows = 0, cols = 0;
  if (opts.biff == 12) {
    rows = blob.read_shift(4);
    cols = blob.read_shift(4);
  } else {
    cols = 1 + blob.read_shift(1);
    rows = 1 + blob.read_shift(2);
  }
  if (opts.biff >= 2 && opts.biff < 8) {
    --rows;
    if (--cols == 0) cols = 256;
  }
  for (var i = 0, o = []; i != rows && (o[i] = []); ++i) for (var j = 0; j != cols; ++j) o[i][j] = parse_SerAr(blob, opts.biff);
  return o;
}
function parse_PtgName(blob, length, opts) {
  var type = blob.read_shift(1) >>> 5 & 3;
  var w = !opts || opts.biff >= 8 ? 4 : 2;
  var nameindex = blob.read_shift(w);
  switch (opts.biff) {
    case 2:
      blob.l += 5;
      break;
    case 3:
    case 4:
      blob.l += 8;
      break;
    case 5:
      blob.l += 12;
      break;
  }
  return [type, 0, nameindex];
}
function parse_PtgNameX(blob, length, opts) {
  if (opts.biff == 5) return parse_PtgNameX_BIFF5(blob, length, opts);
  var type = blob.read_shift(1) >>> 5 & 3;
  var ixti = blob.read_shift(2);
  var nameindex = blob.read_shift(4);
  return [type, ixti, nameindex];
}
function parse_PtgNameX_BIFF5(blob) {
  var type = blob.read_shift(1) >>> 5 & 3;
  var ixti = blob.read_shift(2, "i");
  blob.l += 8;
  var nameindex = blob.read_shift(2);
  blob.l += 12;
  return [type, ixti, nameindex];
}
function parse_PtgMemArea(blob, length, opts) {
  var type = blob.read_shift(1) >>> 5 & 3;
  blob.l += opts && opts.biff == 2 ? 3 : 4;
  var cce = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
  return [type, cce];
}
function parse_PtgMemFunc(blob, length, opts) {
  var type = blob.read_shift(1) >>> 5 & 3;
  var cce = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
  return [type, cce];
}
function parse_PtgRefErr(blob, length, opts) {
  var type = blob.read_shift(1) >>> 5 & 3;
  blob.l += 4;
  if (opts.biff < 8) blob.l--;
  if (opts.biff == 12) blob.l += 2;
  return [type];
}
function parse_PtgRefErr3d(blob, length, opts) {
  var type = (blob[blob.l++] & 96) >> 5;
  var ixti = blob.read_shift(2);
  var w = 4;
  if (opts) switch (opts.biff) {
    case 5:
      w = 15;
      break;
    case 12:
      w = 6;
      break;
  }
  blob.l += w;
  return [type, ixti];
}
var parse_PtgMemErr = parsenoop;
var parse_PtgMemNoMem = parsenoop;
var parse_PtgTbl = parsenoop;
function parse_PtgElfLoc(blob, length, opts) {
  blob.l += 2;
  return [parse_RgceElfLoc(blob, 4, opts)];
}
function parse_PtgElfNoop(blob) {
  blob.l += 6;
  return [];
}
var parse_PtgElfCol = parse_PtgElfLoc;
var parse_PtgElfColS = parse_PtgElfNoop;
var parse_PtgElfColSV = parse_PtgElfNoop;
var parse_PtgElfColV = parse_PtgElfLoc;
function parse_PtgElfLel(blob) {
  blob.l += 2;
  return [parseuint16(blob), blob.read_shift(2) & 1];
}
var parse_PtgElfRadical = parse_PtgElfLoc;
var parse_PtgElfRadicalLel = parse_PtgElfLel;
var parse_PtgElfRadicalS = parse_PtgElfNoop;
var parse_PtgElfRw = parse_PtgElfLoc;
var parse_PtgElfRwV = parse_PtgElfLoc;
var PtgListRT = ["Data", "All", "Headers", "??", "?Data2", "??", "?DataHeaders", "??", "Totals", "??", "??", "??", "?DataTotals", "??", "??", "??", "?Current"];
function parse_PtgList(blob) {
  blob.l += 2;
  var ixti = blob.read_shift(2);
  var flags = blob.read_shift(2);
  var idx = blob.read_shift(4);
  var c = blob.read_shift(2);
  var C = blob.read_shift(2);
  var rt = PtgListRT[flags >> 2 & 31];
  return {
    ixti,
    coltype: flags & 3,
    rt,
    idx,
    c,
    C
  };
}
function parse_PtgSxName(blob) {
  blob.l += 2;
  return [blob.read_shift(4)];
}
function parse_PtgSheet(blob, length, opts) {
  blob.l += 5;
  blob.l += 2;
  blob.l += opts.biff == 2 ? 1 : 4;
  return ["PTGSHEET"];
}
function parse_PtgEndSheet(blob, length, opts) {
  blob.l += opts.biff == 2 ? 4 : 5;
  return ["PTGENDSHEET"];
}
function parse_PtgMemAreaN(blob) {
  var type = blob.read_shift(1) >>> 5 & 3;
  var cce = blob.read_shift(2);
  return [type, cce];
}
function parse_PtgMemNoMemN(blob) {
  var type = blob.read_shift(1) >>> 5 & 3;
  var cce = blob.read_shift(2);
  return [type, cce];
}
function parse_PtgAttrNoop(blob) {
  blob.l += 4;
  return [0, 0];
}
var PtgTypes = {
  /*::[*/
  1: {
    n: "PtgExp",
    f: parse_PtgExp
  },
  /*::[*/
  2: {
    n: "PtgTbl",
    f: parse_PtgTbl
  },
  /*::[*/
  3: {
    n: "PtgAdd",
    f: parseread1
  },
  /*::[*/
  4: {
    n: "PtgSub",
    f: parseread1
  },
  /*::[*/
  5: {
    n: "PtgMul",
    f: parseread1
  },
  /*::[*/
  6: {
    n: "PtgDiv",
    f: parseread1
  },
  /*::[*/
  7: {
    n: "PtgPower",
    f: parseread1
  },
  /*::[*/
  8: {
    n: "PtgConcat",
    f: parseread1
  },
  /*::[*/
  9: {
    n: "PtgLt",
    f: parseread1
  },
  /*::[*/
  10: {
    n: "PtgLe",
    f: parseread1
  },
  /*::[*/
  11: {
    n: "PtgEq",
    f: parseread1
  },
  /*::[*/
  12: {
    n: "PtgGe",
    f: parseread1
  },
  /*::[*/
  13: {
    n: "PtgGt",
    f: parseread1
  },
  /*::[*/
  14: {
    n: "PtgNe",
    f: parseread1
  },
  /*::[*/
  15: {
    n: "PtgIsect",
    f: parseread1
  },
  /*::[*/
  16: {
    n: "PtgUnion",
    f: parseread1
  },
  /*::[*/
  17: {
    n: "PtgRange",
    f: parseread1
  },
  /*::[*/
  18: {
    n: "PtgUplus",
    f: parseread1
  },
  /*::[*/
  19: {
    n: "PtgUminus",
    f: parseread1
  },
  /*::[*/
  20: {
    n: "PtgPercent",
    f: parseread1
  },
  /*::[*/
  21: {
    n: "PtgParen",
    f: parseread1
  },
  /*::[*/
  22: {
    n: "PtgMissArg",
    f: parseread1
  },
  /*::[*/
  23: {
    n: "PtgStr",
    f: parse_PtgStr
  },
  /*::[*/
  26: {
    n: "PtgSheet",
    f: parse_PtgSheet
  },
  /*::[*/
  27: {
    n: "PtgEndSheet",
    f: parse_PtgEndSheet
  },
  /*::[*/
  28: {
    n: "PtgErr",
    f: parse_PtgErr
  },
  /*::[*/
  29: {
    n: "PtgBool",
    f: parse_PtgBool
  },
  /*::[*/
  30: {
    n: "PtgInt",
    f: parse_PtgInt
  },
  /*::[*/
  31: {
    n: "PtgNum",
    f: parse_PtgNum
  },
  /*::[*/
  32: {
    n: "PtgArray",
    f: parse_PtgArray
  },
  /*::[*/
  33: {
    n: "PtgFunc",
    f: parse_PtgFunc
  },
  /*::[*/
  34: {
    n: "PtgFuncVar",
    f: parse_PtgFuncVar
  },
  /*::[*/
  35: {
    n: "PtgName",
    f: parse_PtgName
  },
  /*::[*/
  36: {
    n: "PtgRef",
    f: parse_PtgRef
  },
  /*::[*/
  37: {
    n: "PtgArea",
    f: parse_PtgArea
  },
  /*::[*/
  38: {
    n: "PtgMemArea",
    f: parse_PtgMemArea
  },
  /*::[*/
  39: {
    n: "PtgMemErr",
    f: parse_PtgMemErr
  },
  /*::[*/
  40: {
    n: "PtgMemNoMem",
    f: parse_PtgMemNoMem
  },
  /*::[*/
  41: {
    n: "PtgMemFunc",
    f: parse_PtgMemFunc
  },
  /*::[*/
  42: {
    n: "PtgRefErr",
    f: parse_PtgRefErr
  },
  /*::[*/
  43: {
    n: "PtgAreaErr",
    f: parse_PtgAreaErr
  },
  /*::[*/
  44: {
    n: "PtgRefN",
    f: parse_PtgRefN
  },
  /*::[*/
  45: {
    n: "PtgAreaN",
    f: parse_PtgAreaN
  },
  /*::[*/
  46: {
    n: "PtgMemAreaN",
    f: parse_PtgMemAreaN
  },
  /*::[*/
  47: {
    n: "PtgMemNoMemN",
    f: parse_PtgMemNoMemN
  },
  /*::[*/
  57: {
    n: "PtgNameX",
    f: parse_PtgNameX
  },
  /*::[*/
  58: {
    n: "PtgRef3d",
    f: parse_PtgRef3d
  },
  /*::[*/
  59: {
    n: "PtgArea3d",
    f: parse_PtgArea3d
  },
  /*::[*/
  60: {
    n: "PtgRefErr3d",
    f: parse_PtgRefErr3d
  },
  /*::[*/
  61: {
    n: "PtgAreaErr3d",
    f: parse_PtgAreaErr3d
  },
  /*::[*/
  255: {}
};
var PtgDupes = {
  /*::[*/
  64: 32,
  /*::[*/
  96: 32,
  /*::[*/
  65: 33,
  /*::[*/
  97: 33,
  /*::[*/
  66: 34,
  /*::[*/
  98: 34,
  /*::[*/
  67: 35,
  /*::[*/
  99: 35,
  /*::[*/
  68: 36,
  /*::[*/
  100: 36,
  /*::[*/
  69: 37,
  /*::[*/
  101: 37,
  /*::[*/
  70: 38,
  /*::[*/
  102: 38,
  /*::[*/
  71: 39,
  /*::[*/
  103: 39,
  /*::[*/
  72: 40,
  /*::[*/
  104: 40,
  /*::[*/
  73: 41,
  /*::[*/
  105: 41,
  /*::[*/
  74: 42,
  /*::[*/
  106: 42,
  /*::[*/
  75: 43,
  /*::[*/
  107: 43,
  /*::[*/
  76: 44,
  /*::[*/
  108: 44,
  /*::[*/
  77: 45,
  /*::[*/
  109: 45,
  /*::[*/
  78: 46,
  /*::[*/
  110: 46,
  /*::[*/
  79: 47,
  /*::[*/
  111: 47,
  /*::[*/
  88: 34,
  /*::[*/
  120: 34,
  /*::[*/
  89: 57,
  /*::[*/
  121: 57,
  /*::[*/
  90: 58,
  /*::[*/
  122: 58,
  /*::[*/
  91: 59,
  /*::[*/
  123: 59,
  /*::[*/
  92: 60,
  /*::[*/
  124: 60,
  /*::[*/
  93: 61,
  /*::[*/
  125: 61
};
var Ptg18 = {
  /*::[*/
  1: {
    n: "PtgElfLel",
    f: parse_PtgElfLel
  },
  /*::[*/
  2: {
    n: "PtgElfRw",
    f: parse_PtgElfRw
  },
  /*::[*/
  3: {
    n: "PtgElfCol",
    f: parse_PtgElfCol
  },
  /*::[*/
  6: {
    n: "PtgElfRwV",
    f: parse_PtgElfRwV
  },
  /*::[*/
  7: {
    n: "PtgElfColV",
    f: parse_PtgElfColV
  },
  /*::[*/
  10: {
    n: "PtgElfRadical",
    f: parse_PtgElfRadical
  },
  /*::[*/
  11: {
    n: "PtgElfRadicalS",
    f: parse_PtgElfRadicalS
  },
  /*::[*/
  13: {
    n: "PtgElfColS",
    f: parse_PtgElfColS
  },
  /*::[*/
  15: {
    n: "PtgElfColSV",
    f: parse_PtgElfColSV
  },
  /*::[*/
  16: {
    n: "PtgElfRadicalLel",
    f: parse_PtgElfRadicalLel
  },
  /*::[*/
  25: {
    n: "PtgList",
    f: parse_PtgList
  },
  /*::[*/
  29: {
    n: "PtgSxName",
    f: parse_PtgSxName
  },
  /*::[*/
  255: {}
};
var Ptg19 = {
  /*::[*/
  0: {
    n: "PtgAttrNoop",
    f: parse_PtgAttrNoop
  },
  /*::[*/
  1: {
    n: "PtgAttrSemi",
    f: parse_PtgAttrSemi
  },
  /*::[*/
  2: {
    n: "PtgAttrIf",
    f: parse_PtgAttrIf
  },
  /*::[*/
  4: {
    n: "PtgAttrChoose",
    f: parse_PtgAttrChoose
  },
  /*::[*/
  8: {
    n: "PtgAttrGoto",
    f: parse_PtgAttrGoto
  },
  /*::[*/
  16: {
    n: "PtgAttrSum",
    f: parse_PtgAttrSum
  },
  /*::[*/
  32: {
    n: "PtgAttrBaxcel",
    f: parse_PtgAttrBaxcel
  },
  /*::[*/
  33: {
    n: "PtgAttrBaxcel",
    f: parse_PtgAttrBaxcel
  },
  /*::[*/
  64: {
    n: "PtgAttrSpace",
    f: parse_PtgAttrSpace
  },
  /*::[*/
  65: {
    n: "PtgAttrSpaceSemi",
    f: parse_PtgAttrSpaceSemi
  },
  /*::[*/
  128: {
    n: "PtgAttrIfError",
    f: parse_PtgAttrIfError
  },
  /*::[*/
  255: {}
};
function parse_RgbExtra(blob, length, rgce, opts) {
  if (opts.biff < 8) return parsenoop(blob, length);
  var target = blob.l + length;
  var o = [];
  for (var i = 0; i !== rgce.length; ++i) {
    switch (rgce[i][0]) {
      case "PtgArray":
        rgce[i][1] = parse_PtgExtraArray(blob, 0, opts);
        o.push(rgce[i][1]);
        break;
      case "PtgMemArea":
        rgce[i][2] = parse_PtgExtraMem(blob, rgce[i][1], opts);
        o.push(rgce[i][2]);
        break;
      case "PtgExp":
        if (opts && opts.biff == 12) {
          rgce[i][1][1] = blob.read_shift(4);
          o.push(rgce[i][1]);
        }
        break;
      case "PtgList":
      case "PtgElfRadicalS":
      case "PtgElfColS":
      case "PtgElfColSV":
        throw "Unsupported " + rgce[i][0];
      default:
        break;
    }
  }
  length = target - blob.l;
  if (length !== 0) o.push(parsenoop(blob, length));
  return o;
}
function parse_Rgce(blob, length, opts) {
  var target = blob.l + length;
  var R, id, ptgs = [];
  while (target != blob.l) {
    length = target - blob.l;
    id = blob[blob.l];
    R = PtgTypes[id] || PtgTypes[PtgDupes[id]];
    if (id === 24 || id === 25) R = (id === 24 ? Ptg18 : Ptg19)[blob[blob.l + 1]];
    if (!R || !R.f) {
      parsenoop(blob, length);
    } else {
      ptgs.push([R.n, R.f(blob, length, opts)]);
    }
  }
  return ptgs;
}
function stringify_array(f) {
  var o = [];
  for (var i = 0; i < f.length; ++i) {
    var x = f[i], r = [];
    for (var j = 0; j < x.length; ++j) {
      var y = x[j];
      if (y) switch (y[0]) {
        case 2:
          r.push('"' + y[1].replace(/"/g, '""') + '"');
          break;
        default:
          r.push(y[1]);
      }
      else r.push("");
    }
    o.push(r.join(","));
  }
  return o.join(";");
}
var PtgBinOp = {
  PtgAdd: "+",
  PtgConcat: "&",
  PtgDiv: "/",
  PtgEq: "=",
  PtgGe: ">=",
  PtgGt: ">",
  PtgLe: "<=",
  PtgLt: "<",
  PtgMul: "*",
  PtgNe: "<>",
  PtgPower: "^",
  PtgSub: "-"
};
function formula_quote_sheet_name(sname, opts) {
  if (!sname && !(opts && opts.biff <= 5 && opts.biff >= 2)) throw new Error("empty sheet name");
  if (/[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(sname)) return "'" + sname + "'";
  return sname;
}
function get_ixti_raw(supbooks, ixti, opts) {
  if (!supbooks) return "SH33TJSERR0";
  if (opts.biff > 8 && (!supbooks.XTI || !supbooks.XTI[ixti])) return supbooks.SheetNames[ixti];
  if (!supbooks.XTI) return "SH33TJSERR6";
  var XTI = supbooks.XTI[ixti];
  if (opts.biff < 8) {
    if (ixti > 1e4) ixti -= 65536;
    if (ixti < 0) ixti = -ixti;
    return ixti == 0 ? "" : supbooks.XTI[ixti - 1];
  }
  if (!XTI) return "SH33TJSERR1";
  var o = "";
  if (opts.biff > 8) switch (supbooks[XTI[0]][0]) {
    case 357:
      o = XTI[1] == -1 ? "#REF" : supbooks.SheetNames[XTI[1]];
      return XTI[1] == XTI[2] ? o : o + ":" + supbooks.SheetNames[XTI[2]];
    case 358:
      if (opts.SID != null) return supbooks.SheetNames[opts.SID];
      return "SH33TJSSAME" + supbooks[XTI[0]][0];
    case 355:
    default:
      return "SH33TJSSRC" + supbooks[XTI[0]][0];
  }
  switch (supbooks[XTI[0]][0][0]) {
    case 1025:
      o = XTI[1] == -1 ? "#REF" : supbooks.SheetNames[XTI[1]] || "SH33TJSERR3";
      return XTI[1] == XTI[2] ? o : o + ":" + supbooks.SheetNames[XTI[2]];
    case 14849:
      return supbooks[XTI[0]].slice(1).map(function(name) {
        return name.Name;
      }).join(";;");
    default:
      if (!supbooks[XTI[0]][0][3]) return "SH33TJSERR2";
      o = XTI[1] == -1 ? "#REF" : supbooks[XTI[0]][0][3][XTI[1]] || "SH33TJSERR4";
      return XTI[1] == XTI[2] ? o : o + ":" + supbooks[XTI[0]][0][3][XTI[2]];
  }
}
function get_ixti(supbooks, ixti, opts) {
  var ixtiraw = get_ixti_raw(supbooks, ixti, opts);
  return ixtiraw == "#REF" ? ixtiraw : formula_quote_sheet_name(ixtiraw, opts);
}
function stringify_formula(formula, range, cell, supbooks, opts) {
  var biff = opts && opts.biff || 8;
  var _range = (
    /*range != null ? range :*/
    {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    }
  );
  var stack = [], e1, e2, c, ixti = 0, nameidx = 0, r, sname = "";
  if (!formula[0] || !formula[0][0]) return "";
  var last_sp = -1, sp = "";
  for (var ff = 0, fflen = formula[0].length; ff < fflen; ++ff) {
    var f = formula[0][ff];
    switch (f[0]) {
      case "PtgUminus":
        stack.push("-" + stack.pop());
        break;
      case "PtgUplus":
        stack.push("+" + stack.pop());
        break;
      case "PtgPercent":
        stack.push(stack.pop() + "%");
        break;
      case "PtgAdd":
      case "PtgConcat":
      case "PtgDiv":
      case "PtgEq":
      case "PtgGe":
      case "PtgGt":
      case "PtgLe":
      case "PtgLt":
      case "PtgMul":
      case "PtgNe":
      case "PtgPower":
      case "PtgSub":
        e1 = stack.pop();
        e2 = stack.pop();
        if (last_sp >= 0) {
          switch (formula[0][last_sp][1][0]) {
            case 0:
              sp = fill(" ", formula[0][last_sp][1][1]);
              break;
            case 1:
              sp = fill("\r", formula[0][last_sp][1][1]);
              break;
            default:
              sp = "";
              if (opts.WTF) throw new Error("Unexpected PtgAttrSpaceType " + formula[0][last_sp][1][0]);
          }
          e2 = e2 + sp;
          last_sp = -1;
        }
        stack.push(e2 + PtgBinOp[f[0]] + e1);
        break;
      case "PtgIsect":
        e1 = stack.pop();
        e2 = stack.pop();
        stack.push(e2 + " " + e1);
        break;
      case "PtgUnion":
        e1 = stack.pop();
        e2 = stack.pop();
        stack.push(e2 + "," + e1);
        break;
      case "PtgRange":
        e1 = stack.pop();
        e2 = stack.pop();
        stack.push(e2 + ":" + e1);
        break;
      case "PtgAttrChoose":
        break;
      case "PtgAttrGoto":
        break;
      case "PtgAttrIf":
        break;
      case "PtgAttrIfError":
        break;
      case "PtgRef":
        c = shift_cell_xls(f[1][1], _range, opts);
        stack.push(encode_cell_xls(c, biff));
        break;
      case "PtgRefN":
        c = cell ? shift_cell_xls(f[1][1], cell, opts) : f[1][1];
        stack.push(encode_cell_xls(c, biff));
        break;
      case "PtgRef3d":
        ixti = /*::Number(*/
        f[1][1];
        c = shift_cell_xls(f[1][2], _range, opts);
        sname = get_ixti(supbooks, ixti, opts);
        var w = sname;
        stack.push(sname + "!" + encode_cell_xls(c, biff));
        break;
      case "PtgFunc":
      case "PtgFuncVar":
        var argc = f[1][0], func = f[1][1];
        if (!argc) argc = 0;
        argc &= 127;
        var args = argc == 0 ? [] : stack.slice(-argc);
        stack.length -= argc;
        if (func === "User") func = args.shift();
        stack.push(func + "(" + args.join(",") + ")");
        break;
      case "PtgBool":
        stack.push(f[1] ? "TRUE" : "FALSE");
        break;
      case "PtgInt":
        stack.push(
          /*::String(*/
          f[1]
          /*::)*/
        );
        break;
      case "PtgNum":
        stack.push(String(f[1]));
        break;
      case "PtgStr":
        stack.push('"' + f[1].replace(/"/g, '""') + '"');
        break;
      case "PtgErr":
        stack.push(
          /*::String(*/
          f[1]
          /*::)*/
        );
        break;
      case "PtgAreaN":
        r = shift_range_xls(f[1][1], cell ? {
          s: cell
        } : _range, opts);
        stack.push(encode_range_xls(r, opts));
        break;
      case "PtgArea":
        r = shift_range_xls(f[1][1], _range, opts);
        stack.push(encode_range_xls(r, opts));
        break;
      case "PtgArea3d":
        ixti = /*::Number(*/
        f[1][1];
        r = f[1][2];
        sname = get_ixti(supbooks, ixti, opts);
        stack.push(sname + "!" + encode_range_xls(r, opts));
        break;
      case "PtgAttrSum":
        stack.push("SUM(" + stack.pop() + ")");
        break;
      case "PtgAttrBaxcel":
      case "PtgAttrSemi":
        break;
      case "PtgName":
        nameidx = f[1][2];
        var lbl = (supbooks.names || [])[nameidx - 1] || (supbooks[0] || [])[nameidx];
        var name = lbl ? lbl.Name : "SH33TJSNAME" + String(nameidx);
        if (name && name.slice(0, 6) == "_xlfn." && !opts.xlfn) name = name.slice(6);
        stack.push(name);
        break;
      case "PtgNameX":
        var bookidx = f[1][1];
        nameidx = f[1][2];
        var externbook;
        if (opts.biff <= 5) {
          if (bookidx < 0) bookidx = -bookidx;
          if (supbooks[bookidx]) externbook = supbooks[bookidx][nameidx];
        } else {
          var o = "";
          if (((supbooks[bookidx] || [])[0] || [])[0] == 14849) {
          } else if (((supbooks[bookidx] || [])[0] || [])[0] == 1025) {
            if (supbooks[bookidx][nameidx] && supbooks[bookidx][nameidx].itab > 0) {
              o = supbooks.SheetNames[supbooks[bookidx][nameidx].itab - 1] + "!";
            }
          } else o = supbooks.SheetNames[nameidx - 1] + "!";
          if (supbooks[bookidx] && supbooks[bookidx][nameidx]) o += supbooks[bookidx][nameidx].Name;
          else if (supbooks[0] && supbooks[0][nameidx]) o += supbooks[0][nameidx].Name;
          else {
            var ixtidata = (get_ixti_raw(supbooks, bookidx, opts) || "").split(";;");
            if (ixtidata[nameidx - 1]) o = ixtidata[nameidx - 1];
            else o += "SH33TJSERRX";
          }
          stack.push(o);
          break;
        }
        if (!externbook) externbook = {
          Name: "SH33TJSERRY"
        };
        stack.push(externbook.Name);
        break;
      case "PtgParen":
        var lp = "(", rp = ")";
        if (last_sp >= 0) {
          sp = "";
          switch (formula[0][last_sp][1][0]) {
            case 2:
              lp = fill(" ", formula[0][last_sp][1][1]) + lp;
              break;
            case 3:
              lp = fill("\r", formula[0][last_sp][1][1]) + lp;
              break;
            case 4:
              rp = fill(" ", formula[0][last_sp][1][1]) + rp;
              break;
            case 5:
              rp = fill("\r", formula[0][last_sp][1][1]) + rp;
              break;
            default:
              if (opts.WTF) throw new Error("Unexpected PtgAttrSpaceType " + formula[0][last_sp][1][0]);
          }
          last_sp = -1;
        }
        stack.push(lp + stack.pop() + rp);
        break;
      case "PtgRefErr":
        stack.push("#REF!");
        break;
      case "PtgRefErr3d":
        stack.push("#REF!");
        break;
      case "PtgExp":
        c = {
          c: f[1][1],
          r: f[1][0]
          /*:any*/
        };
        var q = {
          c: cell.c,
          r: cell.r
        };
        if (supbooks.sharedf[encode_cell(c)]) {
          var parsedf = supbooks.sharedf[encode_cell(c)];
          stack.push(stringify_formula(parsedf, _range, q, supbooks, opts));
        } else {
          var fnd = false;
          for (e1 = 0; e1 != supbooks.arrayf.length; ++e1) {
            e2 = supbooks.arrayf[e1];
            if (c.c < e2[0].s.c || c.c > e2[0].e.c) continue;
            if (c.r < e2[0].s.r || c.r > e2[0].e.r) continue;
            stack.push(stringify_formula(e2[1], _range, q, supbooks, opts));
            fnd = true;
            break;
          }
          if (!fnd) stack.push(
            /*::String(*/
            f[1]
            /*::)*/
          );
        }
        break;
      case "PtgArray":
        stack.push("{" + stringify_array(
          /*::(*/
          f[1]
          /*:: :any)*/
        ) + "}");
        break;
      case "PtgMemArea":
        break;
      case "PtgAttrSpace":
      case "PtgAttrSpaceSemi":
        last_sp = ff;
        break;
      case "PtgTbl":
        break;
      case "PtgMemErr":
        break;
      case "PtgMissArg":
        stack.push("");
        break;
      case "PtgAreaErr":
        stack.push("#REF!");
        break;
      case "PtgAreaErr3d":
        stack.push("#REF!");
        break;
      case "PtgList":
        stack.push("Table" + f[1].idx + "[#" + f[1].rt + "]");
        break;
      case "PtgMemAreaN":
      case "PtgMemNoMemN":
      case "PtgAttrNoop":
      case "PtgSheet":
      case "PtgEndSheet":
        break;
      case "PtgMemFunc":
        break;
      case "PtgMemNoMem":
        break;
      case "PtgElfCol":
      case "PtgElfColS":
      case "PtgElfColSV":
      case "PtgElfColV":
      case "PtgElfLel":
      case "PtgElfRadical":
      case "PtgElfRadicalLel":
      case "PtgElfRadicalS":
      case "PtgElfRw":
      case "PtgElfRwV":
        throw new Error("Unsupported ELFs");
      case "PtgSxName":
        throw new Error("Unrecognized Formula Token: " + String(f));
      default:
        throw new Error("Unrecognized Formula Token: " + String(f));
    }
    var PtgNonDisp = ["PtgAttrSpace", "PtgAttrSpaceSemi", "PtgAttrGoto"];
    if (opts.biff != 3) {
      if (last_sp >= 0 && PtgNonDisp.indexOf(formula[0][ff][0]) == -1) {
        f = formula[0][last_sp];
        var _left = true;
        switch (f[1][0]) {
          case 4:
            _left = false;
          case 0:
            sp = fill(" ", f[1][1]);
            break;
          case 5:
            _left = false;
          case 1:
            sp = fill("\r", f[1][1]);
            break;
          default:
            sp = "";
            if (opts.WTF) throw new Error("Unexpected PtgAttrSpaceType " + f[1][0]);
        }
        stack.push((_left ? sp : "") + stack.pop() + (_left ? "" : sp));
        last_sp = -1;
      }
    }
  }
  if (stack.length > 1 && opts.WTF) throw new Error("bad formula stack");
  return stack[0];
}
function write_FormulaValue(value) {
  if (value == null) {
    var o = new_buf(8);
    o.write_shift(1, 3);
    o.write_shift(1, 0);
    o.write_shift(2, 0);
    o.write_shift(2, 0);
    o.write_shift(2, 65535);
    return o;
  } else if (typeof value == "number") return write_Xnum(value);
  return write_Xnum(0);
}
function write_Formula(cell, R, C, opts, os) {
  var o1 = write_XLSCell(R, C, os);
  var o2 = write_FormulaValue(cell.v);
  var o3 = new_buf(6);
  var flags = 1 | 32;
  o3.write_shift(2, flags);
  o3.write_shift(4, 0);
  var bf = new_buf(cell.bf.length);
  for (var i = 0; i < cell.bf.length; ++i) bf[i] = cell.bf[i];
  var out = bconcat([o1, o2, o3, bf]);
  return out;
}
function parse_XLSBParsedFormula(data, length, opts) {
  var cce = data.read_shift(4);
  var rgce = parse_Rgce(data, cce, opts);
  var cb = data.read_shift(4);
  var rgcb = cb > 0 ? parse_RgbExtra(data, cb, rgce, opts) : null;
  return [rgce, rgcb];
}
var parse_XLSBArrayParsedFormula = parse_XLSBParsedFormula;
var parse_XLSBCellParsedFormula = parse_XLSBParsedFormula;
var parse_XLSBNameParsedFormula = parse_XLSBParsedFormula;
var parse_XLSBSharedParsedFormula = parse_XLSBParsedFormula;
var Cetab = {
  0: "BEEP",
  1: "OPEN",
  2: "OPEN.LINKS",
  3: "CLOSE.ALL",
  4: "SAVE",
  5: "SAVE.AS",
  6: "FILE.DELETE",
  7: "PAGE.SETUP",
  8: "PRINT",
  9: "PRINTER.SETUP",
  10: "QUIT",
  11: "NEW.WINDOW",
  12: "ARRANGE.ALL",
  13: "WINDOW.SIZE",
  14: "WINDOW.MOVE",
  15: "FULL",
  16: "CLOSE",
  17: "RUN",
  22: "SET.PRINT.AREA",
  23: "SET.PRINT.TITLES",
  24: "SET.PAGE.BREAK",
  25: "REMOVE.PAGE.BREAK",
  26: "FONT",
  27: "DISPLAY",
  28: "PROTECT.DOCUMENT",
  29: "PRECISION",
  30: "A1.R1C1",
  31: "CALCULATE.NOW",
  32: "CALCULATION",
  34: "DATA.FIND",
  35: "EXTRACT",
  36: "DATA.DELETE",
  37: "SET.DATABASE",
  38: "SET.CRITERIA",
  39: "SORT",
  40: "DATA.SERIES",
  41: "TABLE",
  42: "FORMAT.NUMBER",
  43: "ALIGNMENT",
  44: "STYLE",
  45: "BORDER",
  46: "CELL.PROTECTION",
  47: "COLUMN.WIDTH",
  48: "UNDO",
  49: "CUT",
  50: "COPY",
  51: "PASTE",
  52: "CLEAR",
  53: "PASTE.SPECIAL",
  54: "EDIT.DELETE",
  55: "INSERT",
  56: "FILL.RIGHT",
  57: "FILL.DOWN",
  61: "DEFINE.NAME",
  62: "CREATE.NAMES",
  63: "FORMULA.GOTO",
  64: "FORMULA.FIND",
  65: "SELECT.LAST.CELL",
  66: "SHOW.ACTIVE.CELL",
  67: "GALLERY.AREA",
  68: "GALLERY.BAR",
  69: "GALLERY.COLUMN",
  70: "GALLERY.LINE",
  71: "GALLERY.PIE",
  72: "GALLERY.SCATTER",
  73: "COMBINATION",
  74: "PREFERRED",
  75: "ADD.OVERLAY",
  76: "GRIDLINES",
  77: "SET.PREFERRED",
  78: "AXES",
  79: "LEGEND",
  80: "ATTACH.TEXT",
  81: "ADD.ARROW",
  82: "SELECT.CHART",
  83: "SELECT.PLOT.AREA",
  84: "PATTERNS",
  85: "MAIN.CHART",
  86: "OVERLAY",
  87: "SCALE",
  88: "FORMAT.LEGEND",
  89: "FORMAT.TEXT",
  90: "EDIT.REPEAT",
  91: "PARSE",
  92: "JUSTIFY",
  93: "HIDE",
  94: "UNHIDE",
  95: "WORKSPACE",
  96: "FORMULA",
  97: "FORMULA.FILL",
  98: "FORMULA.ARRAY",
  99: "DATA.FIND.NEXT",
  100: "DATA.FIND.PREV",
  101: "FORMULA.FIND.NEXT",
  102: "FORMULA.FIND.PREV",
  103: "ACTIVATE",
  104: "ACTIVATE.NEXT",
  105: "ACTIVATE.PREV",
  106: "UNLOCKED.NEXT",
  107: "UNLOCKED.PREV",
  108: "COPY.PICTURE",
  109: "SELECT",
  110: "DELETE.NAME",
  111: "DELETE.FORMAT",
  112: "VLINE",
  113: "HLINE",
  114: "VPAGE",
  115: "HPAGE",
  116: "VSCROLL",
  117: "HSCROLL",
  118: "ALERT",
  119: "NEW",
  120: "CANCEL.COPY",
  121: "SHOW.CLIPBOARD",
  122: "MESSAGE",
  124: "PASTE.LINK",
  125: "APP.ACTIVATE",
  126: "DELETE.ARROW",
  127: "ROW.HEIGHT",
  128: "FORMAT.MOVE",
  129: "FORMAT.SIZE",
  130: "FORMULA.REPLACE",
  131: "SEND.KEYS",
  132: "SELECT.SPECIAL",
  133: "APPLY.NAMES",
  134: "REPLACE.FONT",
  135: "FREEZE.PANES",
  136: "SHOW.INFO",
  137: "SPLIT",
  138: "ON.WINDOW",
  139: "ON.DATA",
  140: "DISABLE.INPUT",
  142: "OUTLINE",
  143: "LIST.NAMES",
  144: "FILE.CLOSE",
  145: "SAVE.WORKBOOK",
  146: "DATA.FORM",
  147: "COPY.CHART",
  148: "ON.TIME",
  149: "WAIT",
  150: "FORMAT.FONT",
  151: "FILL.UP",
  152: "FILL.LEFT",
  153: "DELETE.OVERLAY",
  155: "SHORT.MENUS",
  159: "SET.UPDATE.STATUS",
  161: "COLOR.PALETTE",
  162: "DELETE.STYLE",
  163: "WINDOW.RESTORE",
  164: "WINDOW.MAXIMIZE",
  166: "CHANGE.LINK",
  167: "CALCULATE.DOCUMENT",
  168: "ON.KEY",
  169: "APP.RESTORE",
  170: "APP.MOVE",
  171: "APP.SIZE",
  172: "APP.MINIMIZE",
  173: "APP.MAXIMIZE",
  174: "BRING.TO.FRONT",
  175: "SEND.TO.BACK",
  185: "MAIN.CHART.TYPE",
  186: "OVERLAY.CHART.TYPE",
  187: "SELECT.END",
  188: "OPEN.MAIL",
  189: "SEND.MAIL",
  190: "STANDARD.FONT",
  191: "CONSOLIDATE",
  192: "SORT.SPECIAL",
  193: "GALLERY.3D.AREA",
  194: "GALLERY.3D.COLUMN",
  195: "GALLERY.3D.LINE",
  196: "GALLERY.3D.PIE",
  197: "VIEW.3D",
  198: "GOAL.SEEK",
  199: "WORKGROUP",
  200: "FILL.GROUP",
  201: "UPDATE.LINK",
  202: "PROMOTE",
  203: "DEMOTE",
  204: "SHOW.DETAIL",
  206: "UNGROUP",
  207: "OBJECT.PROPERTIES",
  208: "SAVE.NEW.OBJECT",
  209: "SHARE",
  210: "SHARE.NAME",
  211: "DUPLICATE",
  212: "APPLY.STYLE",
  213: "ASSIGN.TO.OBJECT",
  214: "OBJECT.PROTECTION",
  215: "HIDE.OBJECT",
  216: "SET.EXTRACT",
  217: "CREATE.PUBLISHER",
  218: "SUBSCRIBE.TO",
  219: "ATTRIBUTES",
  220: "SHOW.TOOLBAR",
  222: "PRINT.PREVIEW",
  223: "EDIT.COLOR",
  224: "SHOW.LEVELS",
  225: "FORMAT.MAIN",
  226: "FORMAT.OVERLAY",
  227: "ON.RECALC",
  228: "EDIT.SERIES",
  229: "DEFINE.STYLE",
  240: "LINE.PRINT",
  243: "ENTER.DATA",
  249: "GALLERY.RADAR",
  250: "MERGE.STYLES",
  251: "EDITION.OPTIONS",
  252: "PASTE.PICTURE",
  253: "PASTE.PICTURE.LINK",
  254: "SPELLING",
  256: "ZOOM",
  259: "INSERT.OBJECT",
  260: "WINDOW.MINIMIZE",
  265: "SOUND.NOTE",
  266: "SOUND.PLAY",
  267: "FORMAT.SHAPE",
  268: "EXTEND.POLYGON",
  269: "FORMAT.AUTO",
  272: "GALLERY.3D.BAR",
  273: "GALLERY.3D.SURFACE",
  274: "FILL.AUTO",
  276: "CUSTOMIZE.TOOLBAR",
  277: "ADD.TOOL",
  278: "EDIT.OBJECT",
  279: "ON.DOUBLECLICK",
  280: "ON.ENTRY",
  281: "WORKBOOK.ADD",
  282: "WORKBOOK.MOVE",
  283: "WORKBOOK.COPY",
  284: "WORKBOOK.OPTIONS",
  285: "SAVE.WORKSPACE",
  288: "CHART.WIZARD",
  289: "DELETE.TOOL",
  290: "MOVE.TOOL",
  291: "WORKBOOK.SELECT",
  292: "WORKBOOK.ACTIVATE",
  293: "ASSIGN.TO.TOOL",
  295: "COPY.TOOL",
  296: "RESET.TOOL",
  297: "CONSTRAIN.NUMERIC",
  298: "PASTE.TOOL",
  302: "WORKBOOK.NEW",
  305: "SCENARIO.CELLS",
  306: "SCENARIO.DELETE",
  307: "SCENARIO.ADD",
  308: "SCENARIO.EDIT",
  309: "SCENARIO.SHOW",
  310: "SCENARIO.SHOW.NEXT",
  311: "SCENARIO.SUMMARY",
  312: "PIVOT.TABLE.WIZARD",
  313: "PIVOT.FIELD.PROPERTIES",
  314: "PIVOT.FIELD",
  315: "PIVOT.ITEM",
  316: "PIVOT.ADD.FIELDS",
  318: "OPTIONS.CALCULATION",
  319: "OPTIONS.EDIT",
  320: "OPTIONS.VIEW",
  321: "ADDIN.MANAGER",
  322: "MENU.EDITOR",
  323: "ATTACH.TOOLBARS",
  324: "VBAActivate",
  325: "OPTIONS.CHART",
  328: "VBA.INSERT.FILE",
  330: "VBA.PROCEDURE.DEFINITION",
  336: "ROUTING.SLIP",
  338: "ROUTE.DOCUMENT",
  339: "MAIL.LOGON",
  342: "INSERT.PICTURE",
  343: "EDIT.TOOL",
  344: "GALLERY.DOUGHNUT",
  350: "CHART.TREND",
  352: "PIVOT.ITEM.PROPERTIES",
  354: "WORKBOOK.INSERT",
  355: "OPTIONS.TRANSITION",
  356: "OPTIONS.GENERAL",
  370: "FILTER.ADVANCED",
  373: "MAIL.ADD.MAILER",
  374: "MAIL.DELETE.MAILER",
  375: "MAIL.REPLY",
  376: "MAIL.REPLY.ALL",
  377: "MAIL.FORWARD",
  378: "MAIL.NEXT.LETTER",
  379: "DATA.LABEL",
  380: "INSERT.TITLE",
  381: "FONT.PROPERTIES",
  382: "MACRO.OPTIONS",
  383: "WORKBOOK.HIDE",
  384: "WORKBOOK.UNHIDE",
  385: "WORKBOOK.DELETE",
  386: "WORKBOOK.NAME",
  388: "GALLERY.CUSTOM",
  390: "ADD.CHART.AUTOFORMAT",
  391: "DELETE.CHART.AUTOFORMAT",
  392: "CHART.ADD.DATA",
  393: "AUTO.OUTLINE",
  394: "TAB.ORDER",
  395: "SHOW.DIALOG",
  396: "SELECT.ALL",
  397: "UNGROUP.SHEETS",
  398: "SUBTOTAL.CREATE",
  399: "SUBTOTAL.REMOVE",
  400: "RENAME.OBJECT",
  412: "WORKBOOK.SCROLL",
  413: "WORKBOOK.NEXT",
  414: "WORKBOOK.PREV",
  415: "WORKBOOK.TAB.SPLIT",
  416: "FULL.SCREEN",
  417: "WORKBOOK.PROTECT",
  420: "SCROLLBAR.PROPERTIES",
  421: "PIVOT.SHOW.PAGES",
  422: "TEXT.TO.COLUMNS",
  423: "FORMAT.CHARTTYPE",
  424: "LINK.FORMAT",
  425: "TRACER.DISPLAY",
  430: "TRACER.NAVIGATE",
  431: "TRACER.CLEAR",
  432: "TRACER.ERROR",
  433: "PIVOT.FIELD.GROUP",
  434: "PIVOT.FIELD.UNGROUP",
  435: "CHECKBOX.PROPERTIES",
  436: "LABEL.PROPERTIES",
  437: "LISTBOX.PROPERTIES",
  438: "EDITBOX.PROPERTIES",
  439: "PIVOT.REFRESH",
  440: "LINK.COMBO",
  441: "OPEN.TEXT",
  442: "HIDE.DIALOG",
  443: "SET.DIALOG.FOCUS",
  444: "ENABLE.OBJECT",
  445: "PUSHBUTTON.PROPERTIES",
  446: "SET.DIALOG.DEFAULT",
  447: "FILTER",
  448: "FILTER.SHOW.ALL",
  449: "CLEAR.OUTLINE",
  450: "FUNCTION.WIZARD",
  451: "ADD.LIST.ITEM",
  452: "SET.LIST.ITEM",
  453: "REMOVE.LIST.ITEM",
  454: "SELECT.LIST.ITEM",
  455: "SET.CONTROL.VALUE",
  456: "SAVE.COPY.AS",
  458: "OPTIONS.LISTS.ADD",
  459: "OPTIONS.LISTS.DELETE",
  460: "SERIES.AXES",
  461: "SERIES.X",
  462: "SERIES.Y",
  463: "ERRORBAR.X",
  464: "ERRORBAR.Y",
  465: "FORMAT.CHART",
  466: "SERIES.ORDER",
  467: "MAIL.LOGOFF",
  468: "CLEAR.ROUTING.SLIP",
  469: "APP.ACTIVATE.MICROSOFT",
  470: "MAIL.EDIT.MAILER",
  471: "ON.SHEET",
  472: "STANDARD.WIDTH",
  473: "SCENARIO.MERGE",
  474: "SUMMARY.INFO",
  475: "FIND.FILE",
  476: "ACTIVE.CELL.FONT",
  477: "ENABLE.TIPWIZARD",
  478: "VBA.MAKE.ADDIN",
  480: "INSERTDATATABLE",
  481: "WORKGROUP.OPTIONS",
  482: "MAIL.SEND.MAILER",
  485: "AUTOCORRECT",
  489: "POST.DOCUMENT",
  491: "PICKLIST",
  493: "VIEW.SHOW",
  494: "VIEW.DEFINE",
  495: "VIEW.DELETE",
  509: "SHEET.BACKGROUND",
  510: "INSERT.MAP.OBJECT",
  511: "OPTIONS.MENONO",
  517: "MSOCHECKS",
  518: "NORMAL",
  519: "LAYOUT",
  520: "RM.PRINT.AREA",
  521: "CLEAR.PRINT.AREA",
  522: "ADD.PRINT.AREA",
  523: "MOVE.BRK",
  545: "HIDECURR.NOTE",
  546: "HIDEALL.NOTES",
  547: "DELETE.NOTE",
  548: "TRAVERSE.NOTES",
  549: "ACTIVATE.NOTES",
  620: "PROTECT.REVISIONS",
  621: "UNPROTECT.REVISIONS",
  647: "OPTIONS.ME",
  653: "WEB.PUBLISH",
  667: "NEWWEBQUERY",
  673: "PIVOT.TABLE.CHART",
  753: "OPTIONS.SAVE",
  755: "OPTIONS.SPELL",
  808: "HIDEALL.INKANNOTS"
};
var Ftab = {
  0: "COUNT",
  1: "IF",
  2: "ISNA",
  3: "ISERROR",
  4: "SUM",
  5: "AVERAGE",
  6: "MIN",
  7: "MAX",
  8: "ROW",
  9: "COLUMN",
  10: "NA",
  11: "NPV",
  12: "STDEV",
  13: "DOLLAR",
  14: "FIXED",
  15: "SIN",
  16: "COS",
  17: "TAN",
  18: "ATAN",
  19: "PI",
  20: "SQRT",
  21: "EXP",
  22: "LN",
  23: "LOG10",
  24: "ABS",
  25: "INT",
  26: "SIGN",
  27: "ROUND",
  28: "LOOKUP",
  29: "INDEX",
  30: "REPT",
  31: "MID",
  32: "LEN",
  33: "VALUE",
  34: "TRUE",
  35: "FALSE",
  36: "AND",
  37: "OR",
  38: "NOT",
  39: "MOD",
  40: "DCOUNT",
  41: "DSUM",
  42: "DAVERAGE",
  43: "DMIN",
  44: "DMAX",
  45: "DSTDEV",
  46: "VAR",
  47: "DVAR",
  48: "TEXT",
  49: "LINEST",
  50: "TREND",
  51: "LOGEST",
  52: "GROWTH",
  53: "GOTO",
  54: "HALT",
  55: "RETURN",
  56: "PV",
  57: "FV",
  58: "NPER",
  59: "PMT",
  60: "RATE",
  61: "MIRR",
  62: "IRR",
  63: "RAND",
  64: "MATCH",
  65: "DATE",
  66: "TIME",
  67: "DAY",
  68: "MONTH",
  69: "YEAR",
  70: "WEEKDAY",
  71: "HOUR",
  72: "MINUTE",
  73: "SECOND",
  74: "NOW",
  75: "AREAS",
  76: "ROWS",
  77: "COLUMNS",
  78: "OFFSET",
  79: "ABSREF",
  80: "RELREF",
  81: "ARGUMENT",
  82: "SEARCH",
  83: "TRANSPOSE",
  84: "ERROR",
  85: "STEP",
  86: "TYPE",
  87: "ECHO",
  88: "SET.NAME",
  89: "CALLER",
  90: "DEREF",
  91: "WINDOWS",
  92: "SERIES",
  93: "DOCUMENTS",
  94: "ACTIVE.CELL",
  95: "SELECTION",
  96: "RESULT",
  97: "ATAN2",
  98: "ASIN",
  99: "ACOS",
  100: "CHOOSE",
  101: "HLOOKUP",
  102: "VLOOKUP",
  103: "LINKS",
  104: "INPUT",
  105: "ISREF",
  106: "GET.FORMULA",
  107: "GET.NAME",
  108: "SET.VALUE",
  109: "LOG",
  110: "EXEC",
  111: "CHAR",
  112: "LOWER",
  113: "UPPER",
  114: "PROPER",
  115: "LEFT",
  116: "RIGHT",
  117: "EXACT",
  118: "TRIM",
  119: "REPLACE",
  120: "SUBSTITUTE",
  121: "CODE",
  122: "NAMES",
  123: "DIRECTORY",
  124: "FIND",
  125: "CELL",
  126: "ISERR",
  127: "ISTEXT",
  128: "ISNUMBER",
  129: "ISBLANK",
  130: "T",
  131: "N",
  132: "FOPEN",
  133: "FCLOSE",
  134: "FSIZE",
  135: "FREADLN",
  136: "FREAD",
  137: "FWRITELN",
  138: "FWRITE",
  139: "FPOS",
  140: "DATEVALUE",
  141: "TIMEVALUE",
  142: "SLN",
  143: "SYD",
  144: "DDB",
  145: "GET.DEF",
  146: "REFTEXT",
  147: "TEXTREF",
  148: "INDIRECT",
  149: "REGISTER",
  150: "CALL",
  151: "ADD.BAR",
  152: "ADD.MENU",
  153: "ADD.COMMAND",
  154: "ENABLE.COMMAND",
  155: "CHECK.COMMAND",
  156: "RENAME.COMMAND",
  157: "SHOW.BAR",
  158: "DELETE.MENU",
  159: "DELETE.COMMAND",
  160: "GET.CHART.ITEM",
  161: "DIALOG.BOX",
  162: "CLEAN",
  163: "MDETERM",
  164: "MINVERSE",
  165: "MMULT",
  166: "FILES",
  167: "IPMT",
  168: "PPMT",
  169: "COUNTA",
  170: "CANCEL.KEY",
  171: "FOR",
  172: "WHILE",
  173: "BREAK",
  174: "NEXT",
  175: "INITIATE",
  176: "REQUEST",
  177: "POKE",
  178: "EXECUTE",
  179: "TERMINATE",
  180: "RESTART",
  181: "HELP",
  182: "GET.BAR",
  183: "PRODUCT",
  184: "FACT",
  185: "GET.CELL",
  186: "GET.WORKSPACE",
  187: "GET.WINDOW",
  188: "GET.DOCUMENT",
  189: "DPRODUCT",
  190: "ISNONTEXT",
  191: "GET.NOTE",
  192: "NOTE",
  193: "STDEVP",
  194: "VARP",
  195: "DSTDEVP",
  196: "DVARP",
  197: "TRUNC",
  198: "ISLOGICAL",
  199: "DCOUNTA",
  200: "DELETE.BAR",
  201: "UNREGISTER",
  204: "USDOLLAR",
  205: "FINDB",
  206: "SEARCHB",
  207: "REPLACEB",
  208: "LEFTB",
  209: "RIGHTB",
  210: "MIDB",
  211: "LENB",
  212: "ROUNDUP",
  213: "ROUNDDOWN",
  214: "ASC",
  215: "DBCS",
  216: "RANK",
  219: "ADDRESS",
  220: "DAYS360",
  221: "TODAY",
  222: "VDB",
  223: "ELSE",
  224: "ELSE.IF",
  225: "END.IF",
  226: "FOR.CELL",
  227: "MEDIAN",
  228: "SUMPRODUCT",
  229: "SINH",
  230: "COSH",
  231: "TANH",
  232: "ASINH",
  233: "ACOSH",
  234: "ATANH",
  235: "DGET",
  236: "CREATE.OBJECT",
  237: "VOLATILE",
  238: "LAST.ERROR",
  239: "CUSTOM.UNDO",
  240: "CUSTOM.REPEAT",
  241: "FORMULA.CONVERT",
  242: "GET.LINK.INFO",
  243: "TEXT.BOX",
  244: "INFO",
  245: "GROUP",
  246: "GET.OBJECT",
  247: "DB",
  248: "PAUSE",
  251: "RESUME",
  252: "FREQUENCY",
  253: "ADD.TOOLBAR",
  254: "DELETE.TOOLBAR",
  255: "User",
  256: "RESET.TOOLBAR",
  257: "EVALUATE",
  258: "GET.TOOLBAR",
  259: "GET.TOOL",
  260: "SPELLING.CHECK",
  261: "ERROR.TYPE",
  262: "APP.TITLE",
  263: "WINDOW.TITLE",
  264: "SAVE.TOOLBAR",
  265: "ENABLE.TOOL",
  266: "PRESS.TOOL",
  267: "REGISTER.ID",
  268: "GET.WORKBOOK",
  269: "AVEDEV",
  270: "BETADIST",
  271: "GAMMALN",
  272: "BETAINV",
  273: "BINOMDIST",
  274: "CHIDIST",
  275: "CHIINV",
  276: "COMBIN",
  277: "CONFIDENCE",
  278: "CRITBINOM",
  279: "EVEN",
  280: "EXPONDIST",
  281: "FDIST",
  282: "FINV",
  283: "FISHER",
  284: "FISHERINV",
  285: "FLOOR",
  286: "GAMMADIST",
  287: "GAMMAINV",
  288: "CEILING",
  289: "HYPGEOMDIST",
  290: "LOGNORMDIST",
  291: "LOGINV",
  292: "NEGBINOMDIST",
  293: "NORMDIST",
  294: "NORMSDIST",
  295: "NORMINV",
  296: "NORMSINV",
  297: "STANDARDIZE",
  298: "ODD",
  299: "PERMUT",
  300: "POISSON",
  301: "TDIST",
  302: "WEIBULL",
  303: "SUMXMY2",
  304: "SUMX2MY2",
  305: "SUMX2PY2",
  306: "CHITEST",
  307: "CORREL",
  308: "COVAR",
  309: "FORECAST",
  310: "FTEST",
  311: "INTERCEPT",
  312: "PEARSON",
  313: "RSQ",
  314: "STEYX",
  315: "SLOPE",
  316: "TTEST",
  317: "PROB",
  318: "DEVSQ",
  319: "GEOMEAN",
  320: "HARMEAN",
  321: "SUMSQ",
  322: "KURT",
  323: "SKEW",
  324: "ZTEST",
  325: "LARGE",
  326: "SMALL",
  327: "QUARTILE",
  328: "PERCENTILE",
  329: "PERCENTRANK",
  330: "MODE",
  331: "TRIMMEAN",
  332: "TINV",
  334: "MOVIE.COMMAND",
  335: "GET.MOVIE",
  336: "CONCATENATE",
  337: "POWER",
  338: "PIVOT.ADD.DATA",
  339: "GET.PIVOT.TABLE",
  340: "GET.PIVOT.FIELD",
  341: "GET.PIVOT.ITEM",
  342: "RADIANS",
  343: "DEGREES",
  344: "SUBTOTAL",
  345: "SUMIF",
  346: "COUNTIF",
  347: "COUNTBLANK",
  348: "SCENARIO.GET",
  349: "OPTIONS.LISTS.GET",
  350: "ISPMT",
  351: "DATEDIF",
  352: "DATESTRING",
  353: "NUMBERSTRING",
  354: "ROMAN",
  355: "OPEN.DIALOG",
  356: "SAVE.DIALOG",
  357: "VIEW.GET",
  358: "GETPIVOTDATA",
  359: "HYPERLINK",
  360: "PHONETIC",
  361: "AVERAGEA",
  362: "MAXA",
  363: "MINA",
  364: "STDEVPA",
  365: "VARPA",
  366: "STDEVA",
  367: "VARA",
  368: "BAHTTEXT",
  369: "THAIDAYOFWEEK",
  370: "THAIDIGIT",
  371: "THAIMONTHOFYEAR",
  372: "THAINUMSOUND",
  373: "THAINUMSTRING",
  374: "THAISTRINGLENGTH",
  375: "ISTHAIDIGIT",
  376: "ROUNDBAHTDOWN",
  377: "ROUNDBAHTUP",
  378: "THAIYEAR",
  379: "RTD",
  380: "CUBEVALUE",
  381: "CUBEMEMBER",
  382: "CUBEMEMBERPROPERTY",
  383: "CUBERANKEDMEMBER",
  384: "HEX2BIN",
  385: "HEX2DEC",
  386: "HEX2OCT",
  387: "DEC2BIN",
  388: "DEC2HEX",
  389: "DEC2OCT",
  390: "OCT2BIN",
  391: "OCT2HEX",
  392: "OCT2DEC",
  393: "BIN2DEC",
  394: "BIN2OCT",
  395: "BIN2HEX",
  396: "IMSUB",
  397: "IMDIV",
  398: "IMPOWER",
  399: "IMABS",
  400: "IMSQRT",
  401: "IMLN",
  402: "IMLOG2",
  403: "IMLOG10",
  404: "IMSIN",
  405: "IMCOS",
  406: "IMEXP",
  407: "IMARGUMENT",
  408: "IMCONJUGATE",
  409: "IMAGINARY",
  410: "IMREAL",
  411: "COMPLEX",
  412: "IMSUM",
  413: "IMPRODUCT",
  414: "SERIESSUM",
  415: "FACTDOUBLE",
  416: "SQRTPI",
  417: "QUOTIENT",
  418: "DELTA",
  419: "GESTEP",
  420: "ISEVEN",
  421: "ISODD",
  422: "MROUND",
  423: "ERF",
  424: "ERFC",
  425: "BESSELJ",
  426: "BESSELK",
  427: "BESSELY",
  428: "BESSELI",
  429: "XIRR",
  430: "XNPV",
  431: "PRICEMAT",
  432: "YIELDMAT",
  433: "INTRATE",
  434: "RECEIVED",
  435: "DISC",
  436: "PRICEDISC",
  437: "YIELDDISC",
  438: "TBILLEQ",
  439: "TBILLPRICE",
  440: "TBILLYIELD",
  441: "PRICE",
  442: "YIELD",
  443: "DOLLARDE",
  444: "DOLLARFR",
  445: "NOMINAL",
  446: "EFFECT",
  447: "CUMPRINC",
  448: "CUMIPMT",
  449: "EDATE",
  450: "EOMONTH",
  451: "YEARFRAC",
  452: "COUPDAYBS",
  453: "COUPDAYS",
  454: "COUPDAYSNC",
  455: "COUPNCD",
  456: "COUPNUM",
  457: "COUPPCD",
  458: "DURATION",
  459: "MDURATION",
  460: "ODDLPRICE",
  461: "ODDLYIELD",
  462: "ODDFPRICE",
  463: "ODDFYIELD",
  464: "RANDBETWEEN",
  465: "WEEKNUM",
  466: "AMORDEGRC",
  467: "AMORLINC",
  468: "CONVERT",
  724: "SHEETJS",
  469: "ACCRINT",
  470: "ACCRINTM",
  471: "WORKDAY",
  472: "NETWORKDAYS",
  473: "GCD",
  474: "MULTINOMIAL",
  475: "LCM",
  476: "FVSCHEDULE",
  477: "CUBEKPIMEMBER",
  478: "CUBESET",
  479: "CUBESETCOUNT",
  480: "IFERROR",
  481: "COUNTIFS",
  482: "SUMIFS",
  483: "AVERAGEIF",
  484: "AVERAGEIFS"
};
var FtabArgc = {
  2: 1,
  3: 1,
  10: 0,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 0,
  20: 1,
  21: 1,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 2,
  30: 2,
  31: 3,
  32: 1,
  33: 1,
  34: 0,
  35: 0,
  38: 1,
  39: 2,
  40: 3,
  41: 3,
  42: 3,
  43: 3,
  44: 3,
  45: 3,
  47: 3,
  48: 2,
  53: 1,
  61: 3,
  63: 0,
  65: 3,
  66: 3,
  67: 1,
  68: 1,
  69: 1,
  70: 1,
  71: 1,
  72: 1,
  73: 1,
  74: 0,
  75: 1,
  76: 1,
  77: 1,
  79: 2,
  80: 2,
  83: 1,
  85: 0,
  86: 1,
  89: 0,
  90: 1,
  94: 0,
  95: 0,
  97: 2,
  98: 1,
  99: 1,
  101: 3,
  102: 3,
  105: 1,
  106: 1,
  108: 2,
  111: 1,
  112: 1,
  113: 1,
  114: 1,
  117: 2,
  118: 1,
  119: 4,
  121: 1,
  126: 1,
  127: 1,
  128: 1,
  129: 1,
  130: 1,
  131: 1,
  133: 1,
  134: 1,
  135: 1,
  136: 2,
  137: 2,
  138: 2,
  140: 1,
  141: 1,
  142: 3,
  143: 4,
  144: 4,
  161: 1,
  162: 1,
  163: 1,
  164: 1,
  165: 2,
  172: 1,
  175: 2,
  176: 2,
  177: 3,
  178: 2,
  179: 1,
  184: 1,
  186: 1,
  189: 3,
  190: 1,
  195: 3,
  196: 3,
  197: 1,
  198: 1,
  199: 3,
  201: 1,
  207: 4,
  210: 3,
  211: 1,
  212: 2,
  213: 2,
  214: 1,
  215: 1,
  225: 0,
  229: 1,
  230: 1,
  231: 1,
  232: 1,
  233: 1,
  234: 1,
  235: 3,
  244: 1,
  247: 4,
  252: 2,
  257: 1,
  261: 1,
  271: 1,
  273: 4,
  274: 2,
  275: 2,
  276: 2,
  277: 3,
  278: 3,
  279: 1,
  280: 3,
  281: 3,
  282: 3,
  283: 1,
  284: 1,
  285: 2,
  286: 4,
  287: 3,
  288: 2,
  289: 4,
  290: 3,
  291: 3,
  292: 3,
  293: 4,
  294: 1,
  295: 3,
  296: 1,
  297: 3,
  298: 1,
  299: 2,
  300: 3,
  301: 3,
  302: 4,
  303: 2,
  304: 2,
  305: 2,
  306: 2,
  307: 2,
  308: 2,
  309: 3,
  310: 2,
  311: 2,
  312: 2,
  313: 2,
  314: 2,
  315: 2,
  316: 4,
  325: 2,
  326: 2,
  327: 2,
  328: 2,
  331: 2,
  332: 2,
  337: 2,
  342: 1,
  343: 1,
  346: 2,
  347: 1,
  350: 4,
  351: 3,
  352: 1,
  353: 2,
  360: 1,
  368: 1,
  369: 1,
  370: 1,
  371: 1,
  372: 1,
  373: 1,
  374: 1,
  375: 1,
  376: 1,
  377: 1,
  378: 1,
  382: 3,
  385: 1,
  392: 1,
  393: 1,
  396: 2,
  397: 2,
  398: 2,
  399: 1,
  400: 1,
  401: 1,
  402: 1,
  403: 1,
  404: 1,
  405: 1,
  406: 1,
  407: 1,
  408: 1,
  409: 1,
  410: 1,
  414: 4,
  415: 1,
  416: 1,
  417: 2,
  420: 1,
  421: 1,
  422: 2,
  424: 1,
  425: 2,
  426: 2,
  427: 2,
  428: 2,
  430: 3,
  438: 3,
  439: 3,
  440: 3,
  443: 2,
  444: 2,
  445: 2,
  446: 2,
  447: 6,
  448: 6,
  449: 2,
  450: 2,
  464: 2,
  468: 3,
  476: 2,
  479: 1,
  480: 2,
  65535: 0
};
function csf_to_ods_formula(f) {
  var o = "of:=" + f.replace(crefregex, "$1[.$2$3$4$5]").replace(/\]:\[/g, ":");
  return o.replace(/;/g, "|").replace(/,/g, ";");
}
function csf_to_ods_3D(r) {
  return r.replace(/\./, "!");
}
var browser_has_Map = typeof Map !== "undefined";
function get_sst_id(sst, str, rev) {
  var i = 0, len = sst.length;
  if (rev) {
    if (browser_has_Map ? rev.has(str) : Object.prototype.hasOwnProperty.call(rev, str)) {
      var revarr = browser_has_Map ? rev.get(str) : rev[str];
      for (; i < revarr.length; ++i) {
        if (sst[revarr[i]].t === str) {
          sst.Count++;
          return revarr[i];
        }
      }
    }
  } else for (; i < len; ++i) {
    if (sst[i].t === str) {
      sst.Count++;
      return i;
    }
  }
  sst[len] = {
    t: str
  };
  sst.Count++;
  sst.Unique++;
  if (rev) {
    if (browser_has_Map) {
      if (!rev.has(str)) rev.set(str, []);
      rev.get(str).push(len);
    } else {
      if (!Object.prototype.hasOwnProperty.call(rev, str)) rev[str] = [];
      rev[str].push(len);
    }
  }
  return len;
}
function col_obj_w(C, col) {
  var p = {
    min: C + 1,
    max: C + 1
  };
  var wch = -1;
  if (col.MDW) MDW = col.MDW;
  if (col.width != null) p.customWidth = 1;
  else if (col.wpx != null) wch = px2char(col.wpx);
  else if (col.wch != null) wch = col.wch;
  if (wch > -1) {
    p.width = char2width(wch);
    p.customWidth = 1;
  } else if (col.width != null) p.width = col.width;
  if (col.hidden) p.hidden = true;
  if (col.level != null) {
    p.outlineLevel = p.level = col.level;
  }
  return p;
}
function default_margins(margins, mode) {
  if (!margins) return;
  var defs = [0.7, 0.7, 0.75, 0.75, 0.3, 0.3];
  if (mode == "xlml") defs = [1, 1, 1, 1, 0.5, 0.5];
  if (margins.left == null) margins.left = defs[0];
  if (margins.right == null) margins.right = defs[1];
  if (margins.top == null) margins.top = defs[2];
  if (margins.bottom == null) margins.bottom = defs[3];
  if (margins.header == null) margins.header = defs[4];
  if (margins.footer == null) margins.footer = defs[5];
}
function get_cell_style(styles, cell, opts) {
  var z = opts.revssf[cell.z != null ? cell.z : "General"];
  var i = 60, len = styles.length;
  if (z == null && opts.ssf) {
    for (; i < 392; ++i) if (opts.ssf[i] == null) {
      SSF_load(cell.z, i);
      opts.ssf[i] = cell.z;
      opts.revssf[cell.z] = z = i;
      break;
    }
  }
  for (i = 0; i != len; ++i) if (styles[i].numFmtId === z) return i;
  styles[len] = {
    numFmtId: z,
    fontId: 0,
    fillId: 0,
    borderId: 0,
    xfId: 0,
    applyNumberFormat: 1
  };
  return len;
}
function check_ws(ws, sname, i) {
  if (ws && ws["!ref"]) {
    var range = safe_decode_range(ws["!ref"]);
    if (range.e.c < range.s.c || range.e.r < range.s.r) throw new Error("Bad range (" + i + "): " + ws["!ref"]);
  }
}
function write_ws_xml_merges(merges) {
  if (merges.length === 0) return "";
  var o = '<mergeCells count="' + merges.length + '">';
  for (var i = 0; i != merges.length; ++i) o += '<mergeCell ref="' + encode_range(merges[i]) + '"/>';
  return o + "</mergeCells>";
}
function write_ws_xml_sheetpr(ws, wb, idx, opts, o) {
  var needed = false;
  var props = {}, payload = null;
  if (opts.bookType !== "xlsx" && wb.vbaraw) {
    var cname = wb.SheetNames[idx];
    try {
      if (wb.Workbook) cname = wb.Workbook.Sheets[idx].CodeName || cname;
    } catch (e) {
    }
    needed = true;
    props.codeName = utf8write(escapexml(cname));
  }
  if (ws && ws["!outline"]) {
    var outlineprops = {
      summaryBelow: 1,
      summaryRight: 1
    };
    if (ws["!outline"].above) outlineprops.summaryBelow = 0;
    if (ws["!outline"].left) outlineprops.summaryRight = 0;
    payload = (payload || "") + writextag("outlinePr", null, outlineprops);
  }
  if (!needed && !payload) return;
  o[o.length] = writextag("sheetPr", payload, props);
}
var sheetprot_deffalse = ["objects", "scenarios", "selectLockedCells", "selectUnlockedCells"];
var sheetprot_deftrue = ["formatColumns", "formatRows", "formatCells", "insertColumns", "insertRows", "insertHyperlinks", "deleteColumns", "deleteRows", "sort", "autoFilter", "pivotTables"];
function write_ws_xml_protection(sp) {
  var o = {
    sheet: 1
  };
  sheetprot_deffalse.forEach(function(n) {
    if (sp[n] != null && sp[n]) o[n] = "1";
  });
  sheetprot_deftrue.forEach(function(n) {
    if (sp[n] != null && !sp[n]) o[n] = "0";
  });
  if (sp.password) o.password = crypto_CreatePasswordVerifier_Method1(sp.password).toString(16).toUpperCase();
  return writextag("sheetProtection", null, o);
}
function write_ws_xml_margins(margin) {
  default_margins(margin);
  return writextag("pageMargins", null, margin);
}
function write_ws_xml_cols(ws, cols) {
  var o = ["<cols>"], col;
  for (var i = 0; i != cols.length; ++i) {
    if (!(col = cols[i])) continue;
    o[o.length] = writextag("col", null, col_obj_w(i, col));
  }
  o[o.length] = "</cols>";
  return o.join("");
}
function write_ws_xml_autofilter(data, ws, wb, idx) {
  var ref = typeof data.ref == "string" ? data.ref : encode_range(data.ref);
  if (!wb.Workbook) wb.Workbook = {
    Sheets: []
  };
  if (!wb.Workbook.Names) wb.Workbook.Names = [];
  var names = wb.Workbook.Names;
  var range = decode_range(ref);
  if (range.s.r == range.e.r) {
    range.e.r = decode_range(ws["!ref"]).e.r;
    ref = encode_range(range);
  }
  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    if (name.Name != "_xlnm._FilterDatabase") continue;
    if (name.Sheet != idx) continue;
    name.Ref = "'" + wb.SheetNames[idx] + "'!" + ref;
    break;
  }
  if (i == names.length) names.push({
    Name: "_xlnm._FilterDatabase",
    Sheet: idx,
    Ref: "'" + wb.SheetNames[idx] + "'!" + ref
  });
  return writextag("autoFilter", null, {
    ref
  });
}
function write_ws_xml_sheetviews(ws, opts, idx, wb) {
  var sview = {
    workbookViewId: "0"
  };
  if ((((wb || {}).Workbook || {}).Views || [])[0]) sview.rightToLeft = wb.Workbook.Views[0].RTL ? "1" : "0";
  return writextag("sheetViews", writextag("sheetView", null, sview), {});
}
function write_ws_xml_cell(cell, ref, ws, opts) {
  if (cell.c) ws["!comments"].push([ref, cell.c]);
  if (cell.v === void 0 && typeof cell.f !== "string" || cell.t === "z" && !cell.f) return "";
  var vv = "";
  var oldt = cell.t, oldv = cell.v;
  if (cell.t !== "z") switch (cell.t) {
    case "b":
      vv = cell.v ? "1" : "0";
      break;
    case "n":
      vv = "" + cell.v;
      break;
    case "e":
      vv = BErr[cell.v];
      break;
    case "d":
      if (opts && opts.cellDates) vv = parseDate(cell.v, -1).toISOString();
      else {
        cell = dup(cell);
        cell.t = "n";
        vv = "" + (cell.v = datenum(parseDate(cell.v)));
      }
      if (typeof cell.z === "undefined") cell.z = table_fmt[14];
      break;
    default:
      vv = cell.v;
      break;
  }
  var v = writetag("v", escapexml(vv)), o = {
    r: ref
  };
  var os = get_cell_style(opts.cellXfs, cell, opts);
  if (os !== 0) o.s = os;
  switch (cell.t) {
    case "n":
      break;
    case "d":
      o.t = "d";
      break;
    case "b":
      o.t = "b";
      break;
    case "e":
      o.t = "e";
      break;
    case "z":
      break;
    default:
      if (cell.v == null) {
        delete cell.t;
        break;
      }
      if (cell.v.length > 32767) throw new Error("Text length must not exceed 32767 characters");
      if (opts && opts.bookSST) {
        v = writetag("v", "" + get_sst_id(opts.Strings, cell.v, opts.revStrings));
        o.t = "s";
        break;
      }
      o.t = "str";
      break;
  }
  if (cell.t != oldt) {
    cell.t = oldt;
    cell.v = oldv;
  }
  if (typeof cell.f == "string" && cell.f) {
    var ff = cell.F && cell.F.slice(0, ref.length) == ref ? {
      t: "array",
      ref: cell.F
    } : null;
    v = writextag("f", escapexml(cell.f), ff) + (cell.v != null ? v : "");
  }
  if (cell.l) ws["!links"].push([ref, cell.l]);
  if (cell.D) o.cm = 1;
  return writextag("c", v, o);
}
function write_ws_xml_data(ws, opts, idx, wb) {
  var o = [], r = [], range = safe_decode_range(ws["!ref"]), cell = "", ref, rr = "", cols = [], R = 0, C = 0, rows = ws["!rows"];
  var dense = Array.isArray(ws);
  var params = {
    r: rr
  }, row, height = -1;
  for (C = range.s.c; C <= range.e.c; ++C) cols[C] = encode_col(C);
  for (R = range.s.r; R <= range.e.r; ++R) {
    r = [];
    rr = encode_row(R);
    for (C = range.s.c; C <= range.e.c; ++C) {
      ref = cols[C] + rr;
      var _cell = dense ? (ws[R] || [])[C] : ws[ref];
      if (_cell === void 0) continue;
      if ((cell = write_ws_xml_cell(_cell, ref, ws, opts, idx, wb)) != null) r.push(cell);
    }
    if (r.length > 0 || rows && rows[R]) {
      params = {
        r: rr
      };
      if (rows && rows[R]) {
        row = rows[R];
        if (row.hidden) params.hidden = 1;
        height = -1;
        if (row.hpx) height = px2pt(row.hpx);
        else if (row.hpt) height = row.hpt;
        if (height > -1) {
          params.ht = height;
          params.customHeight = 1;
        }
        if (row.level) {
          params.outlineLevel = row.level;
        }
      }
      o[o.length] = writextag("row", r.join(""), params);
    }
  }
  if (rows) for (; R < rows.length; ++R) {
    if (rows && rows[R]) {
      params = {
        r: R + 1
      };
      row = rows[R];
      if (row.hidden) params.hidden = 1;
      height = -1;
      if (row.hpx) height = px2pt(row.hpx);
      else if (row.hpt) height = row.hpt;
      if (height > -1) {
        params.ht = height;
        params.customHeight = 1;
      }
      if (row.level) {
        params.outlineLevel = row.level;
      }
      o[o.length] = writextag("row", "", params);
    }
  }
  return o.join("");
}
function write_ws_xml(idx, opts, wb, rels) {
  var o = [XML_HEADER, writextag("worksheet", null, {
    "xmlns": XMLNS_main[0],
    "xmlns:r": XMLNS.r
  })];
  var s = wb.SheetNames[idx], sidx = 0, rdata = "";
  var ws = wb.Sheets[s];
  if (ws == null) ws = {};
  var ref = ws["!ref"] || "A1";
  var range = safe_decode_range(ref);
  if (range.e.c > 16383 || range.e.r > 1048575) {
    if (opts.WTF) throw new Error("Range " + ref + " exceeds format limit A1:XFD1048576");
    range.e.c = Math.min(range.e.c, 16383);
    range.e.r = Math.min(range.e.c, 1048575);
    ref = encode_range(range);
  }
  if (!rels) rels = {};
  ws["!comments"] = [];
  var _drawing = [];
  write_ws_xml_sheetpr(ws, wb, idx, opts, o);
  o[o.length] = writextag("dimension", null, {
    "ref": ref
  });
  o[o.length] = write_ws_xml_sheetviews(ws, opts, idx, wb);
  if (opts.sheetFormat) o[o.length] = writextag("sheetFormatPr", null, {
    defaultRowHeight: opts.sheetFormat.defaultRowHeight || "16",
    baseColWidth: opts.sheetFormat.baseColWidth || "10",
    outlineLevelRow: opts.sheetFormat.outlineLevelRow || "7"
  });
  if (ws["!cols"] != null && ws["!cols"].length > 0) o[o.length] = write_ws_xml_cols(ws, ws["!cols"]);
  o[sidx = o.length] = "<sheetData/>";
  ws["!links"] = [];
  if (ws["!ref"] != null) {
    rdata = write_ws_xml_data(ws, opts, idx, wb, rels);
    if (rdata.length > 0) o[o.length] = rdata;
  }
  if (o.length > sidx + 1) {
    o[o.length] = "</sheetData>";
    o[sidx] = o[sidx].replace("/>", ">");
  }
  if (ws["!protect"]) o[o.length] = write_ws_xml_protection(ws["!protect"]);
  if (ws["!autofilter"] != null) o[o.length] = write_ws_xml_autofilter(ws["!autofilter"], ws, wb, idx);
  if (ws["!merges"] != null && ws["!merges"].length > 0) o[o.length] = write_ws_xml_merges(ws["!merges"]);
  var relc = -1, rel, rId = -1;
  if (
    /*::(*/
    ws["!links"].length > 0
  ) {
    o[o.length] = "<hyperlinks>";
    ws["!links"].forEach(function(l) {
      if (!l[1].Target) return;
      rel = {
        "ref": l[0]
      };
      if (l[1].Target.charAt(0) != "#") {
        rId = add_rels(rels, -1, escapexml(l[1].Target).replace(/#.*$/, ""), RELS.HLINK);
        rel["r:id"] = "rId" + rId;
      }
      if ((relc = l[1].Target.indexOf("#")) > -1) rel.location = escapexml(l[1].Target.slice(relc + 1));
      if (l[1].Tooltip) rel.tooltip = escapexml(l[1].Tooltip);
      o[o.length] = writextag("hyperlink", null, rel);
    });
    o[o.length] = "</hyperlinks>";
  }
  delete ws["!links"];
  if (ws["!margins"] != null) o[o.length] = write_ws_xml_margins(ws["!margins"]);
  if (!opts || opts.ignoreEC || opts.ignoreEC == void 0) o[o.length] = writetag("ignoredErrors", writextag("ignoredError", null, {
    numberStoredAsText: 1,
    sqref: ref
  }));
  if (_drawing.length > 0) {
    rId = add_rels(rels, -1, "../drawings/drawing" + (idx + 1) + ".xml", RELS.DRAW);
    o[o.length] = writextag("drawing", null, {
      "r:id": "rId" + rId
    });
    ws["!drawing"] = _drawing;
  }
  if (ws["!comments"].length > 0) {
    rId = add_rels(rels, -1, "../drawings/vmlDrawing" + (idx + 1) + ".vml", RELS.VML);
    o[o.length] = writextag("legacyDrawing", null, {
      "r:id": "rId" + rId
    });
    ws["!legacy"] = rId;
  }
  if (o.length > 1) {
    o[o.length] = "</worksheet>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function parse_BrtRowHdr(data, length) {
  var z = {};
  var tgt = data.l + length;
  z.r = data.read_shift(4);
  data.l += 4;
  var miyRw = data.read_shift(2);
  data.l += 1;
  var flags = data.read_shift(1);
  data.l = tgt;
  if (flags & 7) z.level = flags & 7;
  if (flags & 16) z.hidden = true;
  if (flags & 32) z.hpt = miyRw / 20;
  return z;
}
function write_BrtRowHdr(R, range, ws) {
  var o = new_buf(17 + 8 * 16);
  var row = (ws["!rows"] || [])[R] || {};
  o.write_shift(4, R);
  o.write_shift(4, 0);
  var miyRw = 320;
  if (row.hpx) miyRw = px2pt(row.hpx) * 20;
  else if (row.hpt) miyRw = row.hpt * 20;
  o.write_shift(2, miyRw);
  o.write_shift(1, 0);
  var flags = 0;
  if (row.level) flags |= row.level;
  if (row.hidden) flags |= 16;
  if (row.hpx || row.hpt) flags |= 32;
  o.write_shift(1, flags);
  o.write_shift(1, 0);
  var ncolspan = 0, lcs = o.l;
  o.l += 4;
  var caddr = {
    r: R,
    c: 0
  };
  for (var i = 0; i < 16; ++i) {
    if (range.s.c > i + 1 << 10 || range.e.c < i << 10) continue;
    var first2 = -1, last = -1;
    for (var j = i << 10; j < i + 1 << 10; ++j) {
      caddr.c = j;
      var cell = Array.isArray(ws) ? (ws[caddr.r] || [])[caddr.c] : ws[encode_cell(caddr)];
      if (cell) {
        if (first2 < 0) first2 = j;
        last = j;
      }
    }
    if (first2 < 0) continue;
    ++ncolspan;
    o.write_shift(4, first2);
    o.write_shift(4, last);
  }
  var l = o.l;
  o.l = lcs;
  o.write_shift(4, ncolspan);
  o.l = l;
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_row_header(ba, ws, range, R) {
  var o = write_BrtRowHdr(R, range, ws);
  if (o.length > 17 || (ws["!rows"] || [])[R]) write_record(ba, 0, o);
}
var parse_BrtWsDim = parse_UncheckedRfX;
var write_BrtWsDim = write_UncheckedRfX;
function parse_BrtWsFmtInfo() {
}
function parse_BrtWsProp(data, length) {
  var z = {};
  var f = data[data.l];
  ++data.l;
  z.above = !(f & 64);
  z.left = !(f & 128);
  data.l += 18;
  z.name = parse_XLSBCodeName(data, length - 19);
  return z;
}
function write_BrtWsProp(str, outl, o) {
  if (o == null) o = new_buf(84 + 4 * str.length);
  var f = 192;
  if (outl) {
    if (outl.above) f &= ~64;
    if (outl.left) f &= ~128;
  }
  o.write_shift(1, f);
  for (var i = 1; i < 3; ++i) o.write_shift(1, 0);
  write_BrtColor({
    auto: 1
  }, o);
  o.write_shift(-4, -1);
  o.write_shift(-4, -1);
  write_XLSBCodeName(str, o);
  return o.slice(0, o.l);
}
function parse_BrtCellBlank(data) {
  var cell = parse_XLSBCell(data);
  return [cell];
}
function write_BrtCellBlank(cell, ncell, o) {
  if (o == null) o = new_buf(8);
  return write_XLSBCell(ncell, o);
}
function parse_BrtShortBlank(data) {
  var cell = parse_XLSBShortCell(data);
  return [cell];
}
function write_BrtShortBlank(cell, ncell, o) {
  if (o == null) o = new_buf(4);
  return write_XLSBShortCell(ncell, o);
}
function parse_BrtCellBool(data) {
  var cell = parse_XLSBCell(data);
  var fBool = data.read_shift(1);
  return [cell, fBool, "b"];
}
function write_BrtCellBool(cell, ncell, o) {
  if (o == null) o = new_buf(9);
  write_XLSBCell(ncell, o);
  o.write_shift(1, cell.v ? 1 : 0);
  return o;
}
function parse_BrtShortBool(data) {
  var cell = parse_XLSBShortCell(data);
  var fBool = data.read_shift(1);
  return [cell, fBool, "b"];
}
function write_BrtShortBool(cell, ncell, o) {
  if (o == null) o = new_buf(5);
  write_XLSBShortCell(ncell, o);
  o.write_shift(1, cell.v ? 1 : 0);
  return o;
}
function parse_BrtCellError(data) {
  var cell = parse_XLSBCell(data);
  var bError = data.read_shift(1);
  return [cell, bError, "e"];
}
function write_BrtCellError(cell, ncell, o) {
  if (o == null) o = new_buf(9);
  write_XLSBCell(ncell, o);
  o.write_shift(1, cell.v);
  return o;
}
function parse_BrtShortError(data) {
  var cell = parse_XLSBShortCell(data);
  var bError = data.read_shift(1);
  return [cell, bError, "e"];
}
function write_BrtShortError(cell, ncell, o) {
  if (o == null) o = new_buf(8);
  write_XLSBShortCell(ncell, o);
  o.write_shift(1, cell.v);
  o.write_shift(2, 0);
  o.write_shift(1, 0);
  return o;
}
function parse_BrtCellIsst(data) {
  var cell = parse_XLSBCell(data);
  var isst = data.read_shift(4);
  return [cell, isst, "s"];
}
function write_BrtCellIsst(cell, ncell, o) {
  if (o == null) o = new_buf(12);
  write_XLSBCell(ncell, o);
  o.write_shift(4, ncell.v);
  return o;
}
function parse_BrtShortIsst(data) {
  var cell = parse_XLSBShortCell(data);
  var isst = data.read_shift(4);
  return [cell, isst, "s"];
}
function write_BrtShortIsst(cell, ncell, o) {
  if (o == null) o = new_buf(8);
  write_XLSBShortCell(ncell, o);
  o.write_shift(4, ncell.v);
  return o;
}
function parse_BrtCellReal(data) {
  var cell = parse_XLSBCell(data);
  var value = parse_Xnum(data);
  return [cell, value, "n"];
}
function write_BrtCellReal(cell, ncell, o) {
  if (o == null) o = new_buf(16);
  write_XLSBCell(ncell, o);
  write_Xnum(cell.v, o);
  return o;
}
function parse_BrtShortReal(data) {
  var cell = parse_XLSBShortCell(data);
  var value = parse_Xnum(data);
  return [cell, value, "n"];
}
function write_BrtShortReal(cell, ncell, o) {
  if (o == null) o = new_buf(12);
  write_XLSBShortCell(ncell, o);
  write_Xnum(cell.v, o);
  return o;
}
function parse_BrtCellRk(data) {
  var cell = parse_XLSBCell(data);
  var value = parse_RkNumber(data);
  return [cell, value, "n"];
}
function write_BrtCellRk(cell, ncell, o) {
  if (o == null) o = new_buf(12);
  write_XLSBCell(ncell, o);
  write_RkNumber(cell.v, o);
  return o;
}
function parse_BrtShortRk(data) {
  var cell = parse_XLSBShortCell(data);
  var value = parse_RkNumber(data);
  return [cell, value, "n"];
}
function write_BrtShortRk(cell, ncell, o) {
  if (o == null) o = new_buf(8);
  write_XLSBShortCell(ncell, o);
  write_RkNumber(cell.v, o);
  return o;
}
function parse_BrtCellRString(data) {
  var cell = parse_XLSBCell(data);
  var value = parse_RichStr(data);
  return [cell, value, "is"];
}
function parse_BrtCellSt(data) {
  var cell = parse_XLSBCell(data);
  var value = parse_XLWideString(data);
  return [cell, value, "str"];
}
function write_BrtCellSt(cell, ncell, o) {
  if (o == null) o = new_buf(12 + 4 * cell.v.length);
  write_XLSBCell(ncell, o);
  write_XLWideString(cell.v, o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function parse_BrtShortSt(data) {
  var cell = parse_XLSBShortCell(data);
  var value = parse_XLWideString(data);
  return [cell, value, "str"];
}
function write_BrtShortSt(cell, ncell, o) {
  if (o == null) o = new_buf(8 + 4 * cell.v.length);
  write_XLSBShortCell(ncell, o);
  write_XLWideString(cell.v, o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function parse_BrtFmlaBool(data, length, opts) {
  var end = data.l + length;
  var cell = parse_XLSBCell(data);
  cell.r = opts["!row"];
  var value = data.read_shift(1);
  var o = [cell, value, "b"];
  if (opts.cellFormula) {
    data.l += 2;
    var formula = parse_XLSBCellParsedFormula(data, end - data.l, opts);
    o[3] = stringify_formula(formula, null, cell, opts.supbooks, opts);
  } else data.l = end;
  return o;
}
function parse_BrtFmlaError(data, length, opts) {
  var end = data.l + length;
  var cell = parse_XLSBCell(data);
  cell.r = opts["!row"];
  var value = data.read_shift(1);
  var o = [cell, value, "e"];
  if (opts.cellFormula) {
    data.l += 2;
    var formula = parse_XLSBCellParsedFormula(data, end - data.l, opts);
    o[3] = stringify_formula(formula, null, cell, opts.supbooks, opts);
  } else data.l = end;
  return o;
}
function parse_BrtFmlaNum(data, length, opts) {
  var end = data.l + length;
  var cell = parse_XLSBCell(data);
  cell.r = opts["!row"];
  var value = parse_Xnum(data);
  var o = [cell, value, "n"];
  if (opts.cellFormula) {
    data.l += 2;
    var formula = parse_XLSBCellParsedFormula(data, end - data.l, opts);
    o[3] = stringify_formula(formula, null, cell, opts.supbooks, opts);
  } else data.l = end;
  return o;
}
function parse_BrtFmlaString(data, length, opts) {
  var end = data.l + length;
  var cell = parse_XLSBCell(data);
  cell.r = opts["!row"];
  var value = parse_XLWideString(data);
  var o = [cell, value, "str"];
  if (opts.cellFormula) {
    data.l += 2;
    var formula = parse_XLSBCellParsedFormula(data, end - data.l, opts);
    o[3] = stringify_formula(formula, null, cell, opts.supbooks, opts);
  } else data.l = end;
  return o;
}
var parse_BrtMergeCell = parse_UncheckedRfX;
var write_BrtMergeCell = write_UncheckedRfX;
function write_BrtBeginMergeCells(cnt, o) {
  if (o == null) o = new_buf(4);
  o.write_shift(4, cnt);
  return o;
}
function parse_BrtHLink(data, length) {
  var end = data.l + length;
  var rfx = parse_UncheckedRfX(data, 16);
  var relId = parse_XLNullableWideString(data);
  var loc = parse_XLWideString(data);
  var tooltip = parse_XLWideString(data);
  var display = parse_XLWideString(data);
  data.l = end;
  var o = {
    rfx,
    relId,
    loc,
    display
  };
  if (tooltip) o.Tooltip = tooltip;
  return o;
}
function write_BrtHLink(l, rId) {
  var o = new_buf(50 + 4 * (l[1].Target.length + (l[1].Tooltip || "").length));
  write_UncheckedRfX({
    s: decode_cell(l[0]),
    e: decode_cell(l[0])
  }, o);
  write_RelID("rId" + rId, o);
  var locidx = l[1].Target.indexOf("#");
  var loc = locidx == -1 ? "" : l[1].Target.slice(locidx + 1);
  write_XLWideString(loc || "", o);
  write_XLWideString(l[1].Tooltip || "", o);
  write_XLWideString("", o);
  return o.slice(0, o.l);
}
function parse_BrtPane() {
}
function parse_BrtArrFmla(data, length, opts) {
  var end = data.l + length;
  var rfx = parse_RfX(data, 16);
  var fAlwaysCalc = data.read_shift(1);
  var o = [rfx];
  o[2] = fAlwaysCalc;
  if (opts.cellFormula) {
    var formula = parse_XLSBArrayParsedFormula(data, end - data.l, opts);
    o[1] = formula;
  } else data.l = end;
  return o;
}
function parse_BrtShrFmla(data, length, opts) {
  var end = data.l + length;
  var rfx = parse_UncheckedRfX(data, 16);
  var o = [rfx];
  if (opts.cellFormula) {
    var formula = parse_XLSBSharedParsedFormula(data, end - data.l, opts);
    o[1] = formula;
    data.l = end;
  } else data.l = end;
  return o;
}
function write_BrtColInfo(C, col, o) {
  if (o == null) o = new_buf(18);
  var p = col_obj_w(C, col);
  o.write_shift(-4, C);
  o.write_shift(-4, C);
  o.write_shift(4, (p.width || 10) * 256);
  o.write_shift(
    4,
    0
    /*ixfe*/
  );
  var flags = 0;
  if (col.hidden) flags |= 1;
  if (typeof p.width == "number") flags |= 2;
  if (col.level) flags |= col.level << 8;
  o.write_shift(2, flags);
  return o;
}
var BrtMarginKeys = ["left", "right", "top", "bottom", "header", "footer"];
function parse_BrtMargins(data) {
  var margins = {};
  BrtMarginKeys.forEach(function(k) {
    margins[k] = parse_Xnum(data, 8);
  });
  return margins;
}
function write_BrtMargins(margins, o) {
  if (o == null) o = new_buf(6 * 8);
  default_margins(margins);
  BrtMarginKeys.forEach(function(k) {
    write_Xnum(margins[k], o);
  });
  return o;
}
function parse_BrtBeginWsView(data) {
  var f = data.read_shift(2);
  data.l += 28;
  return {
    RTL: f & 32
  };
}
function write_BrtBeginWsView(ws, Workbook, o) {
  if (o == null) o = new_buf(30);
  var f = 924;
  if ((((Workbook || {}).Views || [])[0] || {}).RTL) f |= 32;
  o.write_shift(2, f);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(1, 0);
  o.write_shift(1, 0);
  o.write_shift(2, 0);
  o.write_shift(2, 100);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(2, 0);
  o.write_shift(4, 0);
  return o;
}
function write_BrtCellIgnoreEC(ref) {
  var o = new_buf(24);
  o.write_shift(4, 4);
  o.write_shift(4, 1);
  write_UncheckedRfX(ref, o);
  return o;
}
function write_BrtSheetProtection(sp, o) {
  if (o == null) o = new_buf(16 * 4 + 2);
  o.write_shift(2, sp.password ? crypto_CreatePasswordVerifier_Method1(sp.password) : 0);
  o.write_shift(4, 1);
  [
    ["objects", false],
    // fObjects
    ["scenarios", false],
    // fScenarios
    ["formatCells", true],
    // fFormatCells
    ["formatColumns", true],
    // fFormatColumns
    ["formatRows", true],
    // fFormatRows
    ["insertColumns", true],
    // fInsertColumns
    ["insertRows", true],
    // fInsertRows
    ["insertHyperlinks", true],
    // fInsertHyperlinks
    ["deleteColumns", true],
    // fDeleteColumns
    ["deleteRows", true],
    // fDeleteRows
    ["selectLockedCells", false],
    // fSelLockedCells
    ["sort", true],
    // fSort
    ["autoFilter", true],
    // fAutoFilter
    ["pivotTables", true],
    // fPivotTables
    ["selectUnlockedCells", false]
    // fSelUnlockedCells
  ].forEach(function(n) {
    if (n[1]) o.write_shift(4, sp[n[0]] != null && !sp[n[0]] ? 1 : 0);
    else o.write_shift(4, sp[n[0]] != null && sp[n[0]] ? 0 : 1);
  });
  return o;
}
function parse_BrtDVal() {
}
function parse_BrtDVal14() {
}
function write_ws_bin_cell(ba, cell, R, C, opts, ws, last_seen) {
  if (cell.v === void 0) return false;
  var vv = "";
  switch (cell.t) {
    case "b":
      vv = cell.v ? "1" : "0";
      break;
    case "d":
      cell = dup(cell);
      cell.z = cell.z || table_fmt[14];
      cell.v = datenum(parseDate(cell.v));
      cell.t = "n";
      break;
    case "n":
    case "e":
      vv = "" + cell.v;
      break;
    default:
      vv = cell.v;
      break;
  }
  var o = {
    r: R,
    c: C
  };
  o.s = get_cell_style(opts.cellXfs, cell, opts);
  if (cell.l) ws["!links"].push([encode_cell(o), cell.l]);
  if (cell.c) ws["!comments"].push([encode_cell(o), cell.c]);
  switch (cell.t) {
    case "s":
    case "str":
      if (opts.bookSST) {
        vv = get_sst_id(opts.Strings, cell.v, opts.revStrings);
        o.t = "s";
        o.v = vv;
        if (last_seen) write_record(ba, 18, write_BrtShortIsst(cell, o));
        else write_record(ba, 7, write_BrtCellIsst(cell, o));
      } else {
        o.t = "str";
        if (last_seen) write_record(ba, 17, write_BrtShortSt(cell, o));
        else write_record(ba, 6, write_BrtCellSt(cell, o));
      }
      return true;
    case "n":
      if (cell.v == (cell.v | 0) && cell.v > -1e3 && cell.v < 1e3) {
        if (last_seen) write_record(ba, 13, write_BrtShortRk(cell, o));
        else write_record(ba, 2, write_BrtCellRk(cell, o));
      } else {
        if (last_seen) write_record(ba, 16, write_BrtShortReal(cell, o));
        else write_record(ba, 5, write_BrtCellReal(cell, o));
      }
      return true;
    case "b":
      o.t = "b";
      if (last_seen) write_record(ba, 15, write_BrtShortBool(cell, o));
      else write_record(ba, 4, write_BrtCellBool(cell, o));
      return true;
    case "e":
      o.t = "e";
      if (last_seen) write_record(ba, 14, write_BrtShortError(cell, o));
      else write_record(ba, 3, write_BrtCellError(cell, o));
      return true;
  }
  if (last_seen) write_record(ba, 12, write_BrtShortBlank(cell, o));
  else write_record(ba, 1, write_BrtCellBlank(cell, o));
  return true;
}
function write_CELLTABLE(ba, ws, idx, opts) {
  var range = safe_decode_range(ws["!ref"] || "A1"), ref, rr = "", cols = [];
  write_record(
    ba,
    145
    /* BrtBeginSheetData */
  );
  var dense = Array.isArray(ws);
  var cap = range.e.r;
  if (ws["!rows"]) cap = Math.max(range.e.r, ws["!rows"].length - 1);
  for (var R = range.s.r; R <= cap; ++R) {
    rr = encode_row(R);
    write_row_header(ba, ws, range, R);
    var last_seen = false;
    if (R <= range.e.r) for (var C = range.s.c; C <= range.e.c; ++C) {
      if (R === range.s.r) cols[C] = encode_col(C);
      ref = cols[C] + rr;
      var cell = dense ? (ws[R] || [])[C] : ws[ref];
      if (!cell) {
        last_seen = false;
        continue;
      }
      last_seen = write_ws_bin_cell(ba, cell, R, C, opts, ws, last_seen);
    }
  }
  write_record(
    ba,
    146
    /* BrtEndSheetData */
  );
}
function write_MERGECELLS(ba, ws) {
  if (!ws || !ws["!merges"]) return;
  write_record(ba, 177, write_BrtBeginMergeCells(ws["!merges"].length));
  ws["!merges"].forEach(function(m) {
    write_record(ba, 176, write_BrtMergeCell(m));
  });
  write_record(
    ba,
    178
    /* BrtEndMergeCells */
  );
}
function write_COLINFOS(ba, ws) {
  if (!ws || !ws["!cols"]) return;
  write_record(
    ba,
    390
    /* BrtBeginColInfos */
  );
  ws["!cols"].forEach(function(m, i) {
    if (m) write_record(ba, 60, write_BrtColInfo(i, m));
  });
  write_record(
    ba,
    391
    /* BrtEndColInfos */
  );
}
function write_IGNOREECS(ba, ws) {
  if (!ws || !ws["!ref"]) return;
  write_record(
    ba,
    648
    /* BrtBeginCellIgnoreECs */
  );
  write_record(ba, 649, write_BrtCellIgnoreEC(safe_decode_range(ws["!ref"])));
  write_record(
    ba,
    650
    /* BrtEndCellIgnoreECs */
  );
}
function write_HLINKS(ba, ws, rels) {
  ws["!links"].forEach(function(l) {
    if (!l[1].Target) return;
    var rId = add_rels(rels, -1, l[1].Target.replace(/#.*$/, ""), RELS.HLINK);
    write_record(ba, 494, write_BrtHLink(l, rId));
  });
  delete ws["!links"];
}
function write_LEGACYDRAWING(ba, ws, idx, rels) {
  if (ws["!comments"].length > 0) {
    var rId = add_rels(rels, -1, "../drawings/vmlDrawing" + (idx + 1) + ".vml", RELS.VML);
    write_record(ba, 551, write_RelID("rId" + rId));
    ws["!legacy"] = rId;
  }
}
function write_AUTOFILTER(ba, ws, wb, idx) {
  if (!ws["!autofilter"]) return;
  var data = ws["!autofilter"];
  var ref = typeof data.ref === "string" ? data.ref : encode_range(data.ref);
  if (!wb.Workbook) wb.Workbook = {
    Sheets: []
  };
  if (!wb.Workbook.Names) wb.Workbook.Names = [];
  var names = wb.Workbook.Names;
  var range = decode_range(ref);
  if (range.s.r == range.e.r) {
    range.e.r = decode_range(ws["!ref"]).e.r;
    ref = encode_range(range);
  }
  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    if (name.Name != "_xlnm._FilterDatabase") continue;
    if (name.Sheet != idx) continue;
    name.Ref = "'" + wb.SheetNames[idx] + "'!" + ref;
    break;
  }
  if (i == names.length) names.push({
    Name: "_xlnm._FilterDatabase",
    Sheet: idx,
    Ref: "'" + wb.SheetNames[idx] + "'!" + ref
  });
  write_record(ba, 161, write_UncheckedRfX(safe_decode_range(ref)));
  write_record(
    ba,
    162
    /* BrtEndAFilter */
  );
}
function write_WSVIEWS2(ba, ws, Workbook) {
  write_record(
    ba,
    133
    /* BrtBeginWsViews */
  );
  {
    write_record(ba, 137, write_BrtBeginWsView(ws, Workbook));
    write_record(
      ba,
      138
      /* BrtEndWsView */
    );
  }
  write_record(
    ba,
    134
    /* BrtEndWsViews */
  );
}
function write_WSFMTINFO() {
}
function write_SHEETPROTECT(ba, ws) {
  if (!ws["!protect"]) return;
  write_record(ba, 535, write_BrtSheetProtection(ws["!protect"]));
}
function write_ws_bin(idx, opts, wb, rels) {
  var ba = buf_array();
  var s = wb.SheetNames[idx], ws = wb.Sheets[s] || {};
  var c = s;
  try {
    if (wb && wb.Workbook) c = wb.Workbook.Sheets[idx].CodeName || c;
  } catch (e) {
  }
  var r = safe_decode_range(ws["!ref"] || "A1");
  if (r.e.c > 16383 || r.e.r > 1048575) {
    if (opts.WTF) throw new Error("Range " + (ws["!ref"] || "A1") + " exceeds format limit A1:XFD1048576");
    r.e.c = Math.min(r.e.c, 16383);
    r.e.r = Math.min(r.e.c, 1048575);
  }
  ws["!links"] = [];
  ws["!comments"] = [];
  write_record(
    ba,
    129
    /* BrtBeginSheet */
  );
  if (wb.vbaraw || ws["!outline"]) write_record(ba, 147, write_BrtWsProp(c, ws["!outline"]));
  write_record(ba, 148, write_BrtWsDim(r));
  write_WSVIEWS2(ba, ws, wb.Workbook);
  write_WSFMTINFO(ba, ws);
  write_COLINFOS(ba, ws, idx, opts, wb);
  write_CELLTABLE(ba, ws, idx, opts, wb);
  write_SHEETPROTECT(ba, ws);
  write_AUTOFILTER(ba, ws, wb, idx);
  write_MERGECELLS(ba, ws);
  write_HLINKS(ba, ws, rels);
  if (ws["!margins"]) write_record(ba, 476, write_BrtMargins(ws["!margins"]));
  if (!opts || opts.ignoreEC || opts.ignoreEC == void 0) write_IGNOREECS(ba, ws);
  write_LEGACYDRAWING(ba, ws, idx, rels);
  write_record(
    ba,
    130
    /* BrtEndSheet */
  );
  return ba.end();
}
function parse_BrtCsProp(data, length) {
  data.l += 10;
  var name = parse_XLWideString(data, length - 10);
  return {
    name
  };
}
var WBPropsDef = [["allowRefreshQuery", false, "bool"], ["autoCompressPictures", true, "bool"], ["backupFile", false, "bool"], ["checkCompatibility", false, "bool"], ["CodeName", ""], ["date1904", false, "bool"], ["defaultThemeVersion", 0, "int"], ["filterPrivacy", false, "bool"], ["hidePivotFieldList", false, "bool"], ["promptedSolutions", false, "bool"], ["publishItems", false, "bool"], ["refreshAllConnections", false, "bool"], ["saveExternalLinkValues", true, "bool"], ["showBorderUnselectedTables", true, "bool"], ["showInkAnnotation", true, "bool"], ["showObjects", "all"], ["showPivotChartFilter", false, "bool"], ["updateLinks", "userSet"]];
function safe1904(wb) {
  if (!wb.Workbook) return "false";
  if (!wb.Workbook.WBProps) return "false";
  return parsexmlbool(wb.Workbook.WBProps.date1904) ? "true" : "false";
}
var badchars = /* @__PURE__ */ "][*?/\\".split("");
function check_ws_name(n, safe) {
  if (n.length > 31) {
    if (safe) return false;
    throw new Error("Sheet names cannot exceed 31 chars");
  }
  var _good = true;
  badchars.forEach(function(c) {
    if (n.indexOf(c) == -1) return;
    if (!safe) throw new Error("Sheet name cannot contain : \\ / ? * [ ]");
    _good = false;
  });
  return _good;
}
function check_wb_names(N, S, codes) {
  N.forEach(function(n, i) {
    check_ws_name(n);
    for (var j = 0; j < i; ++j) if (n == N[j]) throw new Error("Duplicate Sheet Name: " + n);
    if (codes) {
      var cn = S && S[i] && S[i].CodeName || n;
      if (cn.charCodeAt(0) == 95 && cn.length > 22) throw new Error("Bad Code Name: Worksheet" + cn);
    }
  });
}
function check_wb(wb) {
  if (!wb || !wb.SheetNames || !wb.Sheets) throw new Error("Invalid Workbook");
  if (!wb.SheetNames.length) throw new Error("Workbook is empty");
  var Sheets = wb.Workbook && wb.Workbook.Sheets || [];
  check_wb_names(wb.SheetNames, Sheets, !!wb.vbaraw);
  for (var i = 0; i < wb.SheetNames.length; ++i) check_ws(wb.Sheets[wb.SheetNames[i]], wb.SheetNames[i], i);
}
function write_wb_xml(wb) {
  var o = [XML_HEADER];
  o[o.length] = writextag("workbook", null, {
    "xmlns": XMLNS_main[0],
    //'xmlns:mx': XMLNS.mx,
    //'xmlns:s': XMLNS_main[0],
    "xmlns:r": XMLNS.r
  });
  var write_names = wb.Workbook && (wb.Workbook.Names || []).length > 0;
  var workbookPr = {
    codeName: "ThisWorkbook"
  };
  if (wb.Workbook && wb.Workbook.WBProps) {
    WBPropsDef.forEach(function(x) {
      if (wb.Workbook.WBProps[x[0]] == null) return;
      if (wb.Workbook.WBProps[x[0]] == x[1]) return;
      workbookPr[x[0]] = wb.Workbook.WBProps[x[0]];
    });
    if (wb.Workbook.WBProps.CodeName) {
      workbookPr.codeName = wb.Workbook.WBProps.CodeName;
      delete workbookPr.CodeName;
    }
  }
  o[o.length] = writextag("workbookPr", null, workbookPr);
  var sheets = wb.Workbook && wb.Workbook.Sheets || [];
  var i = 0;
  if (sheets && sheets[0] && !!sheets[0].Hidden) {
    o[o.length] = "<bookViews>";
    for (i = 0; i != wb.SheetNames.length; ++i) {
      if (!sheets[i]) break;
      if (!sheets[i].Hidden) break;
    }
    if (i == wb.SheetNames.length) i = 0;
    o[o.length] = '<workbookView firstSheet="' + i + '" activeTab="' + i + '"/>';
    o[o.length] = "</bookViews>";
  }
  o[o.length] = "<sheets>";
  for (i = 0; i != wb.SheetNames.length; ++i) {
    var sht = {
      name: escapexml(wb.SheetNames[i].slice(0, 31))
    };
    sht.sheetId = "" + (i + 1);
    sht["r:id"] = "rId" + (i + 1);
    if (sheets[i]) switch (sheets[i].Hidden) {
      case 1:
        sht.state = "hidden";
        break;
      case 2:
        sht.state = "veryHidden";
        break;
    }
    o[o.length] = writextag("sheet", null, sht);
  }
  o[o.length] = "</sheets>";
  if (write_names) {
    o[o.length] = "<definedNames>";
    if (wb.Workbook && wb.Workbook.Names) wb.Workbook.Names.forEach(function(n) {
      var d = {
        name: n.Name
      };
      if (n.Comment) d.comment = n.Comment;
      if (n.Sheet != null) d.localSheetId = "" + n.Sheet;
      if (n.Hidden) d.hidden = "1";
      if (!n.Ref) return;
      o[o.length] = writextag("definedName", escapexml(n.Ref), d);
    });
    o[o.length] = "</definedNames>";
  }
  if (o.length > 2) {
    o[o.length] = "</workbook>";
    o[1] = o[1].replace("/>", ">");
  }
  return o.join("");
}
function parse_BrtBundleSh(data, length) {
  var z = {};
  z.Hidden = data.read_shift(4);
  z.iTabID = data.read_shift(4);
  z.strRelID = parse_RelID(data, length - 8);
  z.name = parse_XLWideString(data);
  return z;
}
function write_BrtBundleSh(data, o) {
  if (!o) o = new_buf(127);
  o.write_shift(4, data.Hidden);
  o.write_shift(4, data.iTabID);
  write_RelID(data.strRelID, o);
  write_XLWideString(data.name.slice(0, 31), o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function parse_BrtWbProp(data, length) {
  var o = {};
  var flags = data.read_shift(4);
  o.defaultThemeVersion = data.read_shift(4);
  var strName = length > 8 ? parse_XLWideString(data) : "";
  if (strName.length > 0) o.CodeName = strName;
  o.autoCompressPictures = !!(flags & 65536);
  o.backupFile = !!(flags & 64);
  o.checkCompatibility = !!(flags & 4096);
  o.date1904 = !!(flags & 1);
  o.filterPrivacy = !!(flags & 8);
  o.hidePivotFieldList = !!(flags & 1024);
  o.promptedSolutions = !!(flags & 16);
  o.publishItems = !!(flags & 2048);
  o.refreshAllConnections = !!(flags & 262144);
  o.saveExternalLinkValues = !!(flags & 128);
  o.showBorderUnselectedTables = !!(flags & 4);
  o.showInkAnnotation = !!(flags & 32);
  o.showObjects = ["all", "placeholders", "none"][flags >> 13 & 3];
  o.showPivotChartFilter = !!(flags & 32768);
  o.updateLinks = ["userSet", "never", "always"][flags >> 8 & 3];
  return o;
}
function write_BrtWbProp(data, o) {
  if (!o) o = new_buf(72);
  var flags = 0;
  if (data) {
    if (data.filterPrivacy) flags |= 8;
  }
  o.write_shift(4, flags);
  o.write_shift(4, 0);
  write_XLSBCodeName(data && data.CodeName || "ThisWorkbook", o);
  return o.slice(0, o.l);
}
function parse_BrtName(data, length, opts) {
  var end = data.l + length;
  data.l += 4;
  data.l += 1;
  var itab = data.read_shift(4);
  var name = parse_XLNameWideString(data);
  var formula = parse_XLSBNameParsedFormula(data, 0, opts);
  var comment = parse_XLNullableWideString(data);
  data.l = end;
  var out = {
    Name: name,
    Ptg: formula
  };
  if (itab < 268435455) out.Sheet = itab;
  if (comment) out.Comment = comment;
  return out;
}
function write_BUNDLESHS(ba, wb) {
  write_record(
    ba,
    143
    /* BrtBeginBundleShs */
  );
  for (var idx = 0; idx != wb.SheetNames.length; ++idx) {
    var viz = wb.Workbook && wb.Workbook.Sheets && wb.Workbook.Sheets[idx] && wb.Workbook.Sheets[idx].Hidden || 0;
    var d = {
      Hidden: viz,
      iTabID: idx + 1,
      strRelID: "rId" + (idx + 1),
      name: wb.SheetNames[idx]
    };
    write_record(ba, 156, write_BrtBundleSh(d));
  }
  write_record(
    ba,
    144
    /* BrtEndBundleShs */
  );
}
function write_BrtFileVersion(data, o) {
  if (!o) o = new_buf(127);
  for (var i = 0; i != 4; ++i) o.write_shift(4, 0);
  write_XLWideString("SheetJS", o);
  write_XLWideString(XLSX.version, o);
  write_XLWideString(XLSX.version, o);
  write_XLWideString("7262", o);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_BrtBookView(idx, o) {
  if (!o) o = new_buf(29);
  o.write_shift(-4, 0);
  o.write_shift(-4, 460);
  o.write_shift(4, 28800);
  o.write_shift(4, 17600);
  o.write_shift(4, 500);
  o.write_shift(4, idx);
  o.write_shift(4, idx);
  var flags = 120;
  o.write_shift(1, flags);
  return o.length > o.l ? o.slice(0, o.l) : o;
}
function write_BOOKVIEWS(ba, wb) {
  if (!wb.Workbook || !wb.Workbook.Sheets) return;
  var sheets = wb.Workbook.Sheets;
  var i = 0, vistab = -1, hidden = -1;
  for (; i < sheets.length; ++i) {
    if (!sheets[i] || !sheets[i].Hidden && vistab == -1) vistab = i;
    else if (sheets[i].Hidden == 1 && hidden == -1) hidden = i;
  }
  if (hidden > vistab) return;
  write_record(
    ba,
    135
    /* BrtBeginBookViews */
  );
  write_record(ba, 158, write_BrtBookView(vistab));
  write_record(
    ba,
    136
    /* BrtEndBookViews */
  );
}
function write_wb_bin(wb, opts) {
  var ba = buf_array();
  write_record(
    ba,
    131
    /* BrtBeginBook */
  );
  write_record(ba, 128, write_BrtFileVersion());
  write_record(ba, 153, write_BrtWbProp(wb.Workbook && wb.Workbook.WBProps || null));
  write_BOOKVIEWS(ba, wb, opts);
  write_BUNDLESHS(ba, wb, opts);
  write_record(
    ba,
    132
    /* BrtEndBook */
  );
  return ba.end();
}
function write_wb(wb, name, opts) {
  return (name.slice(-4) === ".bin" ? write_wb_bin : write_wb_xml)(wb, opts);
}
function write_ws(data, name, opts, wb, rels) {
  return (name.slice(-4) === ".bin" ? write_ws_bin : write_ws_xml)(data, opts, wb, rels);
}
function write_sty(data, name, opts) {
  return (name.slice(-4) === ".bin" ? write_sty_bin : write_sty_xml)(data, opts);
}
function write_sst(data, name, opts) {
  return (name.slice(-4) === ".bin" ? write_sst_bin : write_sst_xml)(data, opts);
}
function write_cmnt(data, name, opts) {
  return (name.slice(-4) === ".bin" ? write_comments_bin : write_comments_xml)(data, opts);
}
function write_xlmeta(name) {
  return (name.slice(-4) === ".bin" ? write_xlmeta_bin : write_xlmeta_xml)();
}
function write_props_xlml(wb, opts) {
  var o = [];
  if (wb.Props) o.push(xlml_write_docprops(wb.Props, opts));
  if (wb.Custprops) o.push(xlml_write_custprops(wb.Props, wb.Custprops, opts));
  return o.join("");
}
function write_wb_xlml() {
  return "";
}
function write_sty_xlml(wb, opts) {
  var styles = ['<Style ss:ID="Default" ss:Name="Normal"><NumberFormat/></Style>'];
  opts.cellXfs.forEach(function(xf, id) {
    var payload = [];
    payload.push(writextag("NumberFormat", null, {
      "ss:Format": escapexml(table_fmt[xf.numFmtId])
    }));
    var o = (
      /*::(*/
      {
        "ss:ID": "s" + (21 + id)
      }
    );
    styles.push(writextag("Style", payload.join(""), o));
  });
  return writextag("Styles", styles.join(""));
}
function write_name_xlml(n) {
  return writextag("NamedRange", null, {
    "ss:Name": n.Name,
    "ss:RefersTo": "=" + a1_to_rc(n.Ref, {
      r: 0,
      c: 0
    })
  });
}
function write_names_xlml(wb) {
  if (!((wb || {}).Workbook || {}).Names) return "";
  var names = wb.Workbook.Names;
  var out = [];
  for (var i = 0; i < names.length; ++i) {
    var n = names[i];
    if (n.Sheet != null) continue;
    if (n.Name.match(/^_xlfn\./)) continue;
    out.push(write_name_xlml(n));
  }
  return writextag("Names", out.join(""));
}
function write_ws_xlml_names(ws, opts, idx, wb) {
  if (!ws) return "";
  if (!((wb || {}).Workbook || {}).Names) return "";
  var names = wb.Workbook.Names;
  var out = [];
  for (var i = 0; i < names.length; ++i) {
    var n = names[i];
    if (n.Sheet != idx) continue;
    if (n.Name.match(/^_xlfn\./)) continue;
    out.push(write_name_xlml(n));
  }
  return out.join("");
}
function write_ws_xlml_wsopts(ws, opts, idx, wb) {
  if (!ws) return "";
  var o = [];
  if (ws["!margins"]) {
    o.push("<PageSetup>");
    if (ws["!margins"].header) o.push(writextag("Header", null, {
      "x:Margin": ws["!margins"].header
    }));
    if (ws["!margins"].footer) o.push(writextag("Footer", null, {
      "x:Margin": ws["!margins"].footer
    }));
    o.push(writextag("PageMargins", null, {
      "x:Bottom": ws["!margins"].bottom || "0.75",
      "x:Left": ws["!margins"].left || "0.7",
      "x:Right": ws["!margins"].right || "0.7",
      "x:Top": ws["!margins"].top || "0.75"
    }));
    o.push("</PageSetup>");
  }
  if (wb && wb.Workbook && wb.Workbook.Sheets && wb.Workbook.Sheets[idx]) {
    if (wb.Workbook.Sheets[idx].Hidden) o.push(writextag("Visible", wb.Workbook.Sheets[idx].Hidden == 1 ? "SheetHidden" : "SheetVeryHidden", {}));
    else {
      for (var i = 0; i < idx; ++i) if (wb.Workbook.Sheets[i] && !wb.Workbook.Sheets[i].Hidden) break;
      if (i == idx) o.push("<Selected/>");
    }
  }
  if (((((wb || {}).Workbook || {}).Views || [])[0] || {}).RTL) o.push("<DisplayRightToLeft/>");
  if (ws["!protect"]) {
    o.push(writetag("ProtectContents", "True"));
    if (ws["!protect"].objects) o.push(writetag("ProtectObjects", "True"));
    if (ws["!protect"].scenarios) o.push(writetag("ProtectScenarios", "True"));
    if (ws["!protect"].selectLockedCells != null && !ws["!protect"].selectLockedCells) o.push(writetag("EnableSelection", "NoSelection"));
    else if (ws["!protect"].selectUnlockedCells != null && !ws["!protect"].selectUnlockedCells) o.push(writetag("EnableSelection", "UnlockedCells"));
    [["formatCells", "AllowFormatCells"], ["formatColumns", "AllowSizeCols"], ["formatRows", "AllowSizeRows"], ["insertColumns", "AllowInsertCols"], ["insertRows", "AllowInsertRows"], ["insertHyperlinks", "AllowInsertHyperlinks"], ["deleteColumns", "AllowDeleteCols"], ["deleteRows", "AllowDeleteRows"], ["sort", "AllowSort"], ["autoFilter", "AllowFilter"], ["pivotTables", "AllowUsePivotTables"]].forEach(function(x) {
      if (ws["!protect"][x[0]]) o.push("<" + x[1] + "/>");
    });
  }
  if (o.length == 0) return "";
  return writextag("WorksheetOptions", o.join(""), {
    xmlns: XLMLNS.x
  });
}
function write_ws_xlml_comment(comments) {
  return comments.map(function(c) {
    var t = xlml_unfixstr(c.t || "");
    var d = writextag("ss:Data", t, {
      "xmlns": "http://www.w3.org/TR/REC-html40"
    });
    return writextag("Comment", d, {
      "ss:Author": c.a
    });
  }).join("");
}
function write_ws_xlml_cell(cell, ref, ws, opts, idx, wb, addr) {
  if (!cell || cell.v == void 0 && cell.f == void 0) return "";
  var attr = {};
  if (cell.f) attr["ss:Formula"] = "=" + escapexml(a1_to_rc(cell.f, addr));
  if (cell.F && cell.F.slice(0, ref.length) == ref) {
    var end = decode_cell(cell.F.slice(ref.length + 1));
    attr["ss:ArrayRange"] = "RC:R" + (end.r == addr.r ? "" : "[" + (end.r - addr.r) + "]") + "C" + (end.c == addr.c ? "" : "[" + (end.c - addr.c) + "]");
  }
  if (cell.l && cell.l.Target) {
    attr["ss:HRef"] = escapexml(cell.l.Target);
    if (cell.l.Tooltip) attr["x:HRefScreenTip"] = escapexml(cell.l.Tooltip);
  }
  if (ws["!merges"]) {
    var marr = ws["!merges"];
    for (var mi = 0; mi != marr.length; ++mi) {
      if (marr[mi].s.c != addr.c || marr[mi].s.r != addr.r) continue;
      if (marr[mi].e.c > marr[mi].s.c) attr["ss:MergeAcross"] = marr[mi].e.c - marr[mi].s.c;
      if (marr[mi].e.r > marr[mi].s.r) attr["ss:MergeDown"] = marr[mi].e.r - marr[mi].s.r;
    }
  }
  var t = "", p = "";
  switch (cell.t) {
    case "z":
      if (!opts.sheetStubs) return "";
      break;
    case "n":
      t = "Number";
      p = String(cell.v);
      break;
    case "b":
      t = "Boolean";
      p = cell.v ? "1" : "0";
      break;
    case "e":
      t = "Error";
      p = BErr[cell.v];
      break;
    case "d":
      t = "DateTime";
      p = new Date(cell.v).toISOString();
      if (cell.z == null) cell.z = cell.z || table_fmt[14];
      break;
    case "s":
      t = "String";
      p = escapexlml(cell.v || "");
      break;
  }
  var os = get_cell_style(opts.cellXfs, cell, opts);
  attr["ss:StyleID"] = "s" + (21 + os);
  attr["ss:Index"] = addr.c + 1;
  var _v = cell.v != null ? p : "";
  var m = cell.t == "z" ? "" : '<Data ss:Type="' + t + '">' + _v + "</Data>";
  if ((cell.c || []).length > 0) m += write_ws_xlml_comment(cell.c);
  return writextag("Cell", m, attr);
}
function write_ws_xlml_row(R, row) {
  var o = '<Row ss:Index="' + (R + 1) + '"';
  if (row) {
    if (row.hpt && !row.hpx) row.hpx = pt2px(row.hpt);
    if (row.hpx) o += ' ss:AutoFitHeight="0" ss:Height="' + row.hpx + '"';
    if (row.hidden) o += ' ss:Hidden="1"';
  }
  return o + ">";
}
function write_ws_xlml_table(ws, opts, idx, wb) {
  if (!ws["!ref"]) return "";
  var range = safe_decode_range(ws["!ref"]);
  var marr = ws["!merges"] || [], mi = 0;
  var o = [];
  if (ws["!cols"]) ws["!cols"].forEach(function(n, i) {
    process_col(n);
    var w = !!n.width;
    var p = col_obj_w(i, n);
    var k = {
      "ss:Index": i + 1
    };
    if (w) k["ss:Width"] = width2px(p.width);
    if (n.hidden) k["ss:Hidden"] = "1";
    o.push(writextag("Column", null, k));
  });
  var dense = Array.isArray(ws);
  for (var R = range.s.r; R <= range.e.r; ++R) {
    var row = [write_ws_xlml_row(R, (ws["!rows"] || [])[R])];
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var skip = false;
      for (mi = 0; mi != marr.length; ++mi) {
        if (marr[mi].s.c > C) continue;
        if (marr[mi].s.r > R) continue;
        if (marr[mi].e.c < C) continue;
        if (marr[mi].e.r < R) continue;
        if (marr[mi].s.c != C || marr[mi].s.r != R) skip = true;
        break;
      }
      if (skip) continue;
      var addr = {
        r: R,
        c: C
      };
      var ref = encode_cell(addr), cell = dense ? (ws[R] || [])[C] : ws[ref];
      row.push(write_ws_xlml_cell(cell, ref, ws, opts, idx, wb, addr));
    }
    row.push("</Row>");
    if (row.length > 2) o.push(row.join(""));
  }
  return o.join("");
}
function write_ws_xlml(idx, opts, wb) {
  var o = [];
  var s = wb.SheetNames[idx];
  var ws = wb.Sheets[s];
  var t = ws ? write_ws_xlml_names(ws, opts, idx, wb) : "";
  if (t.length > 0) o.push("<Names>" + t + "</Names>");
  t = ws ? write_ws_xlml_table(ws, opts, idx, wb) : "";
  if (t.length > 0) o.push("<Table>" + t + "</Table>");
  o.push(write_ws_xlml_wsopts(ws, opts, idx, wb));
  return o.join("");
}
function write_xlml(wb, opts) {
  if (!opts) opts = {};
  if (!wb.SSF) wb.SSF = dup(table_fmt);
  if (wb.SSF) {
    make_ssf();
    SSF_load_table(wb.SSF);
    opts.revssf = evert_num(wb.SSF);
    opts.revssf[wb.SSF[65535]] = 0;
    opts.ssf = wb.SSF;
    opts.cellXfs = [];
    get_cell_style(opts.cellXfs, {}, {
      revssf: {
        "General": 0
      }
    });
  }
  var d = [];
  d.push(write_props_xlml(wb, opts));
  d.push(write_wb_xlml(wb, opts));
  d.push("");
  d.push("");
  for (var i = 0; i < wb.SheetNames.length; ++i) d.push(writextag("Worksheet", write_ws_xlml(i, opts, wb), {
    "ss:Name": escapexml(wb.SheetNames[i])
  }));
  d[2] = write_sty_xlml(wb, opts);
  d[3] = write_names_xlml(wb, opts);
  return XML_HEADER + writextag("Workbook", d.join(""), {
    "xmlns": XLMLNS.ss,
    "xmlns:o": XLMLNS.o,
    "xmlns:x": XLMLNS.x,
    "xmlns:ss": XLMLNS.ss,
    "xmlns:dt": XLMLNS.dt,
    "xmlns:html": XLMLNS.html
  });
}
var PSCLSID = {
  SI: "e0859ff2f94f6810ab9108002b27b3d9",
  DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
  UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
};
function write_xls_props(wb, cfb) {
  var DSEntries = [], SEntries = [], CEntries = [];
  var i = 0, Keys;
  var DocSummaryRE = evert_key(DocSummaryPIDDSI, "n");
  var SummaryRE = evert_key(SummaryPIDSI, "n");
  if (wb.Props) {
    Keys = keys(wb.Props);
    for (i = 0; i < Keys.length; ++i) (Object.prototype.hasOwnProperty.call(DocSummaryRE, Keys[i]) ? DSEntries : Object.prototype.hasOwnProperty.call(SummaryRE, Keys[i]) ? SEntries : CEntries).push([Keys[i], wb.Props[Keys[i]]]);
  }
  if (wb.Custprops) {
    Keys = keys(wb.Custprops);
    for (i = 0; i < Keys.length; ++i) if (!Object.prototype.hasOwnProperty.call(wb.Props || {}, Keys[i])) (Object.prototype.hasOwnProperty.call(DocSummaryRE, Keys[i]) ? DSEntries : Object.prototype.hasOwnProperty.call(SummaryRE, Keys[i]) ? SEntries : CEntries).push([Keys[i], wb.Custprops[Keys[i]]]);
  }
  var CEntries2 = [];
  for (i = 0; i < CEntries.length; ++i) {
    if (XLSPSSkip.indexOf(CEntries[i][0]) > -1 || PseudoPropsPairs.indexOf(CEntries[i][0]) > -1) continue;
    if (CEntries[i][1] == null) continue;
    CEntries2.push(CEntries[i]);
  }
  if (SEntries.length) CFB.utils.cfb_add(cfb, "/SummaryInformation", write_PropertySetStream(SEntries, PSCLSID.SI, SummaryRE, SummaryPIDSI));
  if (DSEntries.length || CEntries2.length) CFB.utils.cfb_add(cfb, "/DocumentSummaryInformation", write_PropertySetStream(DSEntries, PSCLSID.DSI, DocSummaryRE, DocSummaryPIDDSI, CEntries2.length ? CEntries2 : null, PSCLSID.UDI));
}
function write_xlscfb(wb, opts) {
  var o = opts || {};
  var cfb = CFB.utils.cfb_new({
    root: "R"
  });
  var wbpath = "/Workbook";
  switch (o.bookType || "xls") {
    case "xls":
      o.bookType = "biff8";
    case "xla":
      if (!o.bookType) o.bookType = "xla";
    case "biff8":
      wbpath = "/Workbook";
      o.biff = 8;
      break;
    case "biff5":
      wbpath = "/Book";
      o.biff = 5;
      break;
    default:
      throw new Error("invalid type " + o.bookType + " for XLS CFB");
  }
  CFB.utils.cfb_add(cfb, wbpath, write_biff_buf(wb, o));
  if (o.biff == 8 && (wb.Props || wb.Custprops)) write_xls_props(wb, cfb);
  if (o.biff == 8 && wb.vbaraw) fill_vba_xls(cfb, CFB.read(wb.vbaraw, {
    type: typeof wb.vbaraw == "string" ? "binary" : "buffer"
  }));
  return cfb;
}
var XLSBRecordEnum = {
  /*::[*/
  0: {
    /* n:"BrtRowHdr", */
    f: parse_BrtRowHdr
  },
  /*::[*/
  1: {
    /* n:"BrtCellBlank", */
    f: parse_BrtCellBlank
  },
  /*::[*/
  2: {
    /* n:"BrtCellRk", */
    f: parse_BrtCellRk
  },
  /*::[*/
  3: {
    /* n:"BrtCellError", */
    f: parse_BrtCellError
  },
  /*::[*/
  4: {
    /* n:"BrtCellBool", */
    f: parse_BrtCellBool
  },
  /*::[*/
  5: {
    /* n:"BrtCellReal", */
    f: parse_BrtCellReal
  },
  /*::[*/
  6: {
    /* n:"BrtCellSt", */
    f: parse_BrtCellSt
  },
  /*::[*/
  7: {
    /* n:"BrtCellIsst", */
    f: parse_BrtCellIsst
  },
  /*::[*/
  8: {
    /* n:"BrtFmlaString", */
    f: parse_BrtFmlaString
  },
  /*::[*/
  9: {
    /* n:"BrtFmlaNum", */
    f: parse_BrtFmlaNum
  },
  /*::[*/
  10: {
    /* n:"BrtFmlaBool", */
    f: parse_BrtFmlaBool
  },
  /*::[*/
  11: {
    /* n:"BrtFmlaError", */
    f: parse_BrtFmlaError
  },
  /*::[*/
  12: {
    /* n:"BrtShortBlank", */
    f: parse_BrtShortBlank
  },
  /*::[*/
  13: {
    /* n:"BrtShortRk", */
    f: parse_BrtShortRk
  },
  /*::[*/
  14: {
    /* n:"BrtShortError", */
    f: parse_BrtShortError
  },
  /*::[*/
  15: {
    /* n:"BrtShortBool", */
    f: parse_BrtShortBool
  },
  /*::[*/
  16: {
    /* n:"BrtShortReal", */
    f: parse_BrtShortReal
  },
  /*::[*/
  17: {
    /* n:"BrtShortSt", */
    f: parse_BrtShortSt
  },
  /*::[*/
  18: {
    /* n:"BrtShortIsst", */
    f: parse_BrtShortIsst
  },
  /*::[*/
  19: {
    /* n:"BrtSSTItem", */
    f: parse_RichStr
  },
  /*::[*/
  20: {
    /* n:"BrtPCDIMissing" */
  },
  /*::[*/
  21: {
    /* n:"BrtPCDINumber" */
  },
  /*::[*/
  22: {
    /* n:"BrtPCDIBoolean" */
  },
  /*::[*/
  23: {
    /* n:"BrtPCDIError" */
  },
  /*::[*/
  24: {
    /* n:"BrtPCDIString" */
  },
  /*::[*/
  25: {
    /* n:"BrtPCDIDatetime" */
  },
  /*::[*/
  26: {
    /* n:"BrtPCDIIndex" */
  },
  /*::[*/
  27: {
    /* n:"BrtPCDIAMissing" */
  },
  /*::[*/
  28: {
    /* n:"BrtPCDIANumber" */
  },
  /*::[*/
  29: {
    /* n:"BrtPCDIABoolean" */
  },
  /*::[*/
  30: {
    /* n:"BrtPCDIAError" */
  },
  /*::[*/
  31: {
    /* n:"BrtPCDIAString" */
  },
  /*::[*/
  32: {
    /* n:"BrtPCDIADatetime" */
  },
  /*::[*/
  33: {
    /* n:"BrtPCRRecord" */
  },
  /*::[*/
  34: {
    /* n:"BrtPCRRecordDt" */
  },
  /*::[*/
  35: {
    /* n:"BrtFRTBegin", */
    T: 1
  },
  /*::[*/
  36: {
    /* n:"BrtFRTEnd", */
    T: -1
  },
  /*::[*/
  37: {
    /* n:"BrtACBegin", */
    T: 1
  },
  /*::[*/
  38: {
    /* n:"BrtACEnd", */
    T: -1
  },
  /*::[*/
  39: {
    /* n:"BrtName", */
    f: parse_BrtName
  },
  /*::[*/
  40: {
    /* n:"BrtIndexRowBlock" */
  },
  /*::[*/
  42: {
    /* n:"BrtIndexBlock" */
  },
  /*::[*/
  43: {
    /* n:"BrtFont", */
    f: parse_BrtFont
  },
  /*::[*/
  44: {
    /* n:"BrtFmt", */
    f: parse_BrtFmt
  },
  /*::[*/
  45: {
    /* n:"BrtFill", */
    f: parse_BrtFill
  },
  /*::[*/
  46: {
    /* n:"BrtBorder", */
    f: parse_BrtBorder
  },
  /*::[*/
  47: {
    /* n:"BrtXF", */
    f: parse_BrtXF
  },
  /*::[*/
  48: {
    /* n:"BrtStyle" */
  },
  /*::[*/
  49: {
    /* n:"BrtCellMeta", */
    f: parse_Int32LE
  },
  /*::[*/
  50: {
    /* n:"BrtValueMeta" */
  },
  /*::[*/
  51: {
    /* n:"BrtMdb" */
    f: parse_BrtMdb
  },
  /*::[*/
  52: {
    /* n:"BrtBeginFmd", */
    T: 1
  },
  /*::[*/
  53: {
    /* n:"BrtEndFmd", */
    T: -1
  },
  /*::[*/
  54: {
    /* n:"BrtBeginMdx", */
    T: 1
  },
  /*::[*/
  55: {
    /* n:"BrtEndMdx", */
    T: -1
  },
  /*::[*/
  56: {
    /* n:"BrtBeginMdxTuple", */
    T: 1
  },
  /*::[*/
  57: {
    /* n:"BrtEndMdxTuple", */
    T: -1
  },
  /*::[*/
  58: {
    /* n:"BrtMdxMbrIstr" */
  },
  /*::[*/
  59: {
    /* n:"BrtStr" */
  },
  /*::[*/
  60: {
    /* n:"BrtColInfo", */
    f: parse_ColInfo
  },
  /*::[*/
  62: {
    /* n:"BrtCellRString", */
    f: parse_BrtCellRString
  },
  /*::[*/
  63: {
    /* n:"BrtCalcChainItem$", */
    f: parse_BrtCalcChainItem$
  },
  /*::[*/
  64: {
    /* n:"BrtDVal", */
    f: parse_BrtDVal
  },
  /*::[*/
  65: {
    /* n:"BrtSxvcellNum" */
  },
  /*::[*/
  66: {
    /* n:"BrtSxvcellStr" */
  },
  /*::[*/
  67: {
    /* n:"BrtSxvcellBool" */
  },
  /*::[*/
  68: {
    /* n:"BrtSxvcellErr" */
  },
  /*::[*/
  69: {
    /* n:"BrtSxvcellDate" */
  },
  /*::[*/
  70: {
    /* n:"BrtSxvcellNil" */
  },
  /*::[*/
  128: {
    /* n:"BrtFileVersion" */
  },
  /*::[*/
  129: {
    /* n:"BrtBeginSheet", */
    T: 1
  },
  /*::[*/
  130: {
    /* n:"BrtEndSheet", */
    T: -1
  },
  /*::[*/
  131: {
    /* n:"BrtBeginBook", */
    T: 1,
    f: parsenoop,
    p: 0
  },
  /*::[*/
  132: {
    /* n:"BrtEndBook", */
    T: -1
  },
  /*::[*/
  133: {
    /* n:"BrtBeginWsViews", */
    T: 1
  },
  /*::[*/
  134: {
    /* n:"BrtEndWsViews", */
    T: -1
  },
  /*::[*/
  135: {
    /* n:"BrtBeginBookViews", */
    T: 1
  },
  /*::[*/
  136: {
    /* n:"BrtEndBookViews", */
    T: -1
  },
  /*::[*/
  137: {
    /* n:"BrtBeginWsView", */
    T: 1,
    f: parse_BrtBeginWsView
  },
  /*::[*/
  138: {
    /* n:"BrtEndWsView", */
    T: -1
  },
  /*::[*/
  139: {
    /* n:"BrtBeginCsViews", */
    T: 1
  },
  /*::[*/
  140: {
    /* n:"BrtEndCsViews", */
    T: -1
  },
  /*::[*/
  141: {
    /* n:"BrtBeginCsView", */
    T: 1
  },
  /*::[*/
  142: {
    /* n:"BrtEndCsView", */
    T: -1
  },
  /*::[*/
  143: {
    /* n:"BrtBeginBundleShs", */
    T: 1
  },
  /*::[*/
  144: {
    /* n:"BrtEndBundleShs", */
    T: -1
  },
  /*::[*/
  145: {
    /* n:"BrtBeginSheetData", */
    T: 1
  },
  /*::[*/
  146: {
    /* n:"BrtEndSheetData", */
    T: -1
  },
  /*::[*/
  147: {
    /* n:"BrtWsProp", */
    f: parse_BrtWsProp
  },
  /*::[*/
  148: {
    /* n:"BrtWsDim", */
    f: parse_BrtWsDim,
    p: 16
  },
  /*::[*/
  151: {
    /* n:"BrtPane", */
    f: parse_BrtPane
  },
  /*::[*/
  152: {
    /* n:"BrtSel" */
  },
  /*::[*/
  153: {
    /* n:"BrtWbProp", */
    f: parse_BrtWbProp
  },
  /*::[*/
  154: {
    /* n:"BrtWbFactoid" */
  },
  /*::[*/
  155: {
    /* n:"BrtFileRecover" */
  },
  /*::[*/
  156: {
    /* n:"BrtBundleSh", */
    f: parse_BrtBundleSh
  },
  /*::[*/
  157: {
    /* n:"BrtCalcProp" */
  },
  /*::[*/
  158: {
    /* n:"BrtBookView" */
  },
  /*::[*/
  159: {
    /* n:"BrtBeginSst", */
    T: 1,
    f: parse_BrtBeginSst
  },
  /*::[*/
  160: {
    /* n:"BrtEndSst", */
    T: -1
  },
  /*::[*/
  161: {
    /* n:"BrtBeginAFilter", */
    T: 1,
    f: parse_UncheckedRfX
  },
  /*::[*/
  162: {
    /* n:"BrtEndAFilter", */
    T: -1
  },
  /*::[*/
  163: {
    /* n:"BrtBeginFilterColumn", */
    T: 1
  },
  /*::[*/
  164: {
    /* n:"BrtEndFilterColumn", */
    T: -1
  },
  /*::[*/
  165: {
    /* n:"BrtBeginFilters", */
    T: 1
  },
  /*::[*/
  166: {
    /* n:"BrtEndFilters", */
    T: -1
  },
  /*::[*/
  167: {
    /* n:"BrtFilter" */
  },
  /*::[*/
  168: {
    /* n:"BrtColorFilter" */
  },
  /*::[*/
  169: {
    /* n:"BrtIconFilter" */
  },
  /*::[*/
  170: {
    /* n:"BrtTop10Filter" */
  },
  /*::[*/
  171: {
    /* n:"BrtDynamicFilter" */
  },
  /*::[*/
  172: {
    /* n:"BrtBeginCustomFilters", */
    T: 1
  },
  /*::[*/
  173: {
    /* n:"BrtEndCustomFilters", */
    T: -1
  },
  /*::[*/
  174: {
    /* n:"BrtCustomFilter" */
  },
  /*::[*/
  175: {
    /* n:"BrtAFilterDateGroupItem" */
  },
  /*::[*/
  176: {
    /* n:"BrtMergeCell", */
    f: parse_BrtMergeCell
  },
  /*::[*/
  177: {
    /* n:"BrtBeginMergeCells", */
    T: 1
  },
  /*::[*/
  178: {
    /* n:"BrtEndMergeCells", */
    T: -1
  },
  /*::[*/
  179: {
    /* n:"BrtBeginPivotCacheDef", */
    T: 1
  },
  /*::[*/
  180: {
    /* n:"BrtEndPivotCacheDef", */
    T: -1
  },
  /*::[*/
  181: {
    /* n:"BrtBeginPCDFields", */
    T: 1
  },
  /*::[*/
  182: {
    /* n:"BrtEndPCDFields", */
    T: -1
  },
  /*::[*/
  183: {
    /* n:"BrtBeginPCDField", */
    T: 1
  },
  /*::[*/
  184: {
    /* n:"BrtEndPCDField", */
    T: -1
  },
  /*::[*/
  185: {
    /* n:"BrtBeginPCDSource", */
    T: 1
  },
  /*::[*/
  186: {
    /* n:"BrtEndPCDSource", */
    T: -1
  },
  /*::[*/
  187: {
    /* n:"BrtBeginPCDSRange", */
    T: 1
  },
  /*::[*/
  188: {
    /* n:"BrtEndPCDSRange", */
    T: -1
  },
  /*::[*/
  189: {
    /* n:"BrtBeginPCDFAtbl", */
    T: 1
  },
  /*::[*/
  190: {
    /* n:"BrtEndPCDFAtbl", */
    T: -1
  },
  /*::[*/
  191: {
    /* n:"BrtBeginPCDIRun", */
    T: 1
  },
  /*::[*/
  192: {
    /* n:"BrtEndPCDIRun", */
    T: -1
  },
  /*::[*/
  193: {
    /* n:"BrtBeginPivotCacheRecords", */
    T: 1
  },
  /*::[*/
  194: {
    /* n:"BrtEndPivotCacheRecords", */
    T: -1
  },
  /*::[*/
  195: {
    /* n:"BrtBeginPCDHierarchies", */
    T: 1
  },
  /*::[*/
  196: {
    /* n:"BrtEndPCDHierarchies", */
    T: -1
  },
  /*::[*/
  197: {
    /* n:"BrtBeginPCDHierarchy", */
    T: 1
  },
  /*::[*/
  198: {
    /* n:"BrtEndPCDHierarchy", */
    T: -1
  },
  /*::[*/
  199: {
    /* n:"BrtBeginPCDHFieldsUsage", */
    T: 1
  },
  /*::[*/
  200: {
    /* n:"BrtEndPCDHFieldsUsage", */
    T: -1
  },
  /*::[*/
  201: {
    /* n:"BrtBeginExtConnection", */
    T: 1
  },
  /*::[*/
  202: {
    /* n:"BrtEndExtConnection", */
    T: -1
  },
  /*::[*/
  203: {
    /* n:"BrtBeginECDbProps", */
    T: 1
  },
  /*::[*/
  204: {
    /* n:"BrtEndECDbProps", */
    T: -1
  },
  /*::[*/
  205: {
    /* n:"BrtBeginECOlapProps", */
    T: 1
  },
  /*::[*/
  206: {
    /* n:"BrtEndECOlapProps", */
    T: -1
  },
  /*::[*/
  207: {
    /* n:"BrtBeginPCDSConsol", */
    T: 1
  },
  /*::[*/
  208: {
    /* n:"BrtEndPCDSConsol", */
    T: -1
  },
  /*::[*/
  209: {
    /* n:"BrtBeginPCDSCPages", */
    T: 1
  },
  /*::[*/
  210: {
    /* n:"BrtEndPCDSCPages", */
    T: -1
  },
  /*::[*/
  211: {
    /* n:"BrtBeginPCDSCPage", */
    T: 1
  },
  /*::[*/
  212: {
    /* n:"BrtEndPCDSCPage", */
    T: -1
  },
  /*::[*/
  213: {
    /* n:"BrtBeginPCDSCPItem", */
    T: 1
  },
  /*::[*/
  214: {
    /* n:"BrtEndPCDSCPItem", */
    T: -1
  },
  /*::[*/
  215: {
    /* n:"BrtBeginPCDSCSets", */
    T: 1
  },
  /*::[*/
  216: {
    /* n:"BrtEndPCDSCSets", */
    T: -1
  },
  /*::[*/
  217: {
    /* n:"BrtBeginPCDSCSet", */
    T: 1
  },
  /*::[*/
  218: {
    /* n:"BrtEndPCDSCSet", */
    T: -1
  },
  /*::[*/
  219: {
    /* n:"BrtBeginPCDFGroup", */
    T: 1
  },
  /*::[*/
  220: {
    /* n:"BrtEndPCDFGroup", */
    T: -1
  },
  /*::[*/
  221: {
    /* n:"BrtBeginPCDFGItems", */
    T: 1
  },
  /*::[*/
  222: {
    /* n:"BrtEndPCDFGItems", */
    T: -1
  },
  /*::[*/
  223: {
    /* n:"BrtBeginPCDFGRange", */
    T: 1
  },
  /*::[*/
  224: {
    /* n:"BrtEndPCDFGRange", */
    T: -1
  },
  /*::[*/
  225: {
    /* n:"BrtBeginPCDFGDiscrete", */
    T: 1
  },
  /*::[*/
  226: {
    /* n:"BrtEndPCDFGDiscrete", */
    T: -1
  },
  /*::[*/
  227: {
    /* n:"BrtBeginPCDSDTupleCache", */
    T: 1
  },
  /*::[*/
  228: {
    /* n:"BrtEndPCDSDTupleCache", */
    T: -1
  },
  /*::[*/
  229: {
    /* n:"BrtBeginPCDSDTCEntries", */
    T: 1
  },
  /*::[*/
  230: {
    /* n:"BrtEndPCDSDTCEntries", */
    T: -1
  },
  /*::[*/
  231: {
    /* n:"BrtBeginPCDSDTCEMembers", */
    T: 1
  },
  /*::[*/
  232: {
    /* n:"BrtEndPCDSDTCEMembers", */
    T: -1
  },
  /*::[*/
  233: {
    /* n:"BrtBeginPCDSDTCEMember", */
    T: 1
  },
  /*::[*/
  234: {
    /* n:"BrtEndPCDSDTCEMember", */
    T: -1
  },
  /*::[*/
  235: {
    /* n:"BrtBeginPCDSDTCQueries", */
    T: 1
  },
  /*::[*/
  236: {
    /* n:"BrtEndPCDSDTCQueries", */
    T: -1
  },
  /*::[*/
  237: {
    /* n:"BrtBeginPCDSDTCQuery", */
    T: 1
  },
  /*::[*/
  238: {
    /* n:"BrtEndPCDSDTCQuery", */
    T: -1
  },
  /*::[*/
  239: {
    /* n:"BrtBeginPCDSDTCSets", */
    T: 1
  },
  /*::[*/
  240: {
    /* n:"BrtEndPCDSDTCSets", */
    T: -1
  },
  /*::[*/
  241: {
    /* n:"BrtBeginPCDSDTCSet", */
    T: 1
  },
  /*::[*/
  242: {
    /* n:"BrtEndPCDSDTCSet", */
    T: -1
  },
  /*::[*/
  243: {
    /* n:"BrtBeginPCDCalcItems", */
    T: 1
  },
  /*::[*/
  244: {
    /* n:"BrtEndPCDCalcItems", */
    T: -1
  },
  /*::[*/
  245: {
    /* n:"BrtBeginPCDCalcItem", */
    T: 1
  },
  /*::[*/
  246: {
    /* n:"BrtEndPCDCalcItem", */
    T: -1
  },
  /*::[*/
  247: {
    /* n:"BrtBeginPRule", */
    T: 1
  },
  /*::[*/
  248: {
    /* n:"BrtEndPRule", */
    T: -1
  },
  /*::[*/
  249: {
    /* n:"BrtBeginPRFilters", */
    T: 1
  },
  /*::[*/
  250: {
    /* n:"BrtEndPRFilters", */
    T: -1
  },
  /*::[*/
  251: {
    /* n:"BrtBeginPRFilter", */
    T: 1
  },
  /*::[*/
  252: {
    /* n:"BrtEndPRFilter", */
    T: -1
  },
  /*::[*/
  253: {
    /* n:"BrtBeginPNames", */
    T: 1
  },
  /*::[*/
  254: {
    /* n:"BrtEndPNames", */
    T: -1
  },
  /*::[*/
  255: {
    /* n:"BrtBeginPName", */
    T: 1
  },
  /*::[*/
  256: {
    /* n:"BrtEndPName", */
    T: -1
  },
  /*::[*/
  257: {
    /* n:"BrtBeginPNPairs", */
    T: 1
  },
  /*::[*/
  258: {
    /* n:"BrtEndPNPairs", */
    T: -1
  },
  /*::[*/
  259: {
    /* n:"BrtBeginPNPair", */
    T: 1
  },
  /*::[*/
  260: {
    /* n:"BrtEndPNPair", */
    T: -1
  },
  /*::[*/
  261: {
    /* n:"BrtBeginECWebProps", */
    T: 1
  },
  /*::[*/
  262: {
    /* n:"BrtEndECWebProps", */
    T: -1
  },
  /*::[*/
  263: {
    /* n:"BrtBeginEcWpTables", */
    T: 1
  },
  /*::[*/
  264: {
    /* n:"BrtEndECWPTables", */
    T: -1
  },
  /*::[*/
  265: {
    /* n:"BrtBeginECParams", */
    T: 1
  },
  /*::[*/
  266: {
    /* n:"BrtEndECParams", */
    T: -1
  },
  /*::[*/
  267: {
    /* n:"BrtBeginECParam", */
    T: 1
  },
  /*::[*/
  268: {
    /* n:"BrtEndECParam", */
    T: -1
  },
  /*::[*/
  269: {
    /* n:"BrtBeginPCDKPIs", */
    T: 1
  },
  /*::[*/
  270: {
    /* n:"BrtEndPCDKPIs", */
    T: -1
  },
  /*::[*/
  271: {
    /* n:"BrtBeginPCDKPI", */
    T: 1
  },
  /*::[*/
  272: {
    /* n:"BrtEndPCDKPI", */
    T: -1
  },
  /*::[*/
  273: {
    /* n:"BrtBeginDims", */
    T: 1
  },
  /*::[*/
  274: {
    /* n:"BrtEndDims", */
    T: -1
  },
  /*::[*/
  275: {
    /* n:"BrtBeginDim", */
    T: 1
  },
  /*::[*/
  276: {
    /* n:"BrtEndDim", */
    T: -1
  },
  /*::[*/
  277: {
    /* n:"BrtIndexPartEnd" */
  },
  /*::[*/
  278: {
    /* n:"BrtBeginStyleSheet", */
    T: 1
  },
  /*::[*/
  279: {
    /* n:"BrtEndStyleSheet", */
    T: -1
  },
  /*::[*/
  280: {
    /* n:"BrtBeginSXView", */
    T: 1
  },
  /*::[*/
  281: {
    /* n:"BrtEndSXVI", */
    T: -1
  },
  /*::[*/
  282: {
    /* n:"BrtBeginSXVI", */
    T: 1
  },
  /*::[*/
  283: {
    /* n:"BrtBeginSXVIs", */
    T: 1
  },
  /*::[*/
  284: {
    /* n:"BrtEndSXVIs", */
    T: -1
  },
  /*::[*/
  285: {
    /* n:"BrtBeginSXVD", */
    T: 1
  },
  /*::[*/
  286: {
    /* n:"BrtEndSXVD", */
    T: -1
  },
  /*::[*/
  287: {
    /* n:"BrtBeginSXVDs", */
    T: 1
  },
  /*::[*/
  288: {
    /* n:"BrtEndSXVDs", */
    T: -1
  },
  /*::[*/
  289: {
    /* n:"BrtBeginSXPI", */
    T: 1
  },
  /*::[*/
  290: {
    /* n:"BrtEndSXPI", */
    T: -1
  },
  /*::[*/
  291: {
    /* n:"BrtBeginSXPIs", */
    T: 1
  },
  /*::[*/
  292: {
    /* n:"BrtEndSXPIs", */
    T: -1
  },
  /*::[*/
  293: {
    /* n:"BrtBeginSXDI", */
    T: 1
  },
  /*::[*/
  294: {
    /* n:"BrtEndSXDI", */
    T: -1
  },
  /*::[*/
  295: {
    /* n:"BrtBeginSXDIs", */
    T: 1
  },
  /*::[*/
  296: {
    /* n:"BrtEndSXDIs", */
    T: -1
  },
  /*::[*/
  297: {
    /* n:"BrtBeginSXLI", */
    T: 1
  },
  /*::[*/
  298: {
    /* n:"BrtEndSXLI", */
    T: -1
  },
  /*::[*/
  299: {
    /* n:"BrtBeginSXLIRws", */
    T: 1
  },
  /*::[*/
  300: {
    /* n:"BrtEndSXLIRws", */
    T: -1
  },
  /*::[*/
  301: {
    /* n:"BrtBeginSXLICols", */
    T: 1
  },
  /*::[*/
  302: {
    /* n:"BrtEndSXLICols", */
    T: -1
  },
  /*::[*/
  303: {
    /* n:"BrtBeginSXFormat", */
    T: 1
  },
  /*::[*/
  304: {
    /* n:"BrtEndSXFormat", */
    T: -1
  },
  /*::[*/
  305: {
    /* n:"BrtBeginSXFormats", */
    T: 1
  },
  /*::[*/
  306: {
    /* n:"BrtEndSxFormats", */
    T: -1
  },
  /*::[*/
  307: {
    /* n:"BrtBeginSxSelect", */
    T: 1
  },
  /*::[*/
  308: {
    /* n:"BrtEndSxSelect", */
    T: -1
  },
  /*::[*/
  309: {
    /* n:"BrtBeginISXVDRws", */
    T: 1
  },
  /*::[*/
  310: {
    /* n:"BrtEndISXVDRws", */
    T: -1
  },
  /*::[*/
  311: {
    /* n:"BrtBeginISXVDCols", */
    T: 1
  },
  /*::[*/
  312: {
    /* n:"BrtEndISXVDCols", */
    T: -1
  },
  /*::[*/
  313: {
    /* n:"BrtEndSXLocation", */
    T: -1
  },
  /*::[*/
  314: {
    /* n:"BrtBeginSXLocation", */
    T: 1
  },
  /*::[*/
  315: {
    /* n:"BrtEndSXView", */
    T: -1
  },
  /*::[*/
  316: {
    /* n:"BrtBeginSXTHs", */
    T: 1
  },
  /*::[*/
  317: {
    /* n:"BrtEndSXTHs", */
    T: -1
  },
  /*::[*/
  318: {
    /* n:"BrtBeginSXTH", */
    T: 1
  },
  /*::[*/
  319: {
    /* n:"BrtEndSXTH", */
    T: -1
  },
  /*::[*/
  320: {
    /* n:"BrtBeginISXTHRws", */
    T: 1
  },
  /*::[*/
  321: {
    /* n:"BrtEndISXTHRws", */
    T: -1
  },
  /*::[*/
  322: {
    /* n:"BrtBeginISXTHCols", */
    T: 1
  },
  /*::[*/
  323: {
    /* n:"BrtEndISXTHCols", */
    T: -1
  },
  /*::[*/
  324: {
    /* n:"BrtBeginSXTDMPS", */
    T: 1
  },
  /*::[*/
  325: {
    /* n:"BrtEndSXTDMPs", */
    T: -1
  },
  /*::[*/
  326: {
    /* n:"BrtBeginSXTDMP", */
    T: 1
  },
  /*::[*/
  327: {
    /* n:"BrtEndSXTDMP", */
    T: -1
  },
  /*::[*/
  328: {
    /* n:"BrtBeginSXTHItems", */
    T: 1
  },
  /*::[*/
  329: {
    /* n:"BrtEndSXTHItems", */
    T: -1
  },
  /*::[*/
  330: {
    /* n:"BrtBeginSXTHItem", */
    T: 1
  },
  /*::[*/
  331: {
    /* n:"BrtEndSXTHItem", */
    T: -1
  },
  /*::[*/
  332: {
    /* n:"BrtBeginMetadata", */
    T: 1
  },
  /*::[*/
  333: {
    /* n:"BrtEndMetadata", */
    T: -1
  },
  /*::[*/
  334: {
    /* n:"BrtBeginEsmdtinfo", */
    T: 1
  },
  /*::[*/
  335: {
    /* n:"BrtMdtinfo", */
    f: parse_BrtMdtinfo
  },
  /*::[*/
  336: {
    /* n:"BrtEndEsmdtinfo", */
    T: -1
  },
  /*::[*/
  337: {
    /* n:"BrtBeginEsmdb", */
    f: parse_BrtBeginEsmdb,
    T: 1
  },
  /*::[*/
  338: {
    /* n:"BrtEndEsmdb", */
    T: -1
  },
  /*::[*/
  339: {
    /* n:"BrtBeginEsfmd", */
    T: 1
  },
  /*::[*/
  340: {
    /* n:"BrtEndEsfmd", */
    T: -1
  },
  /*::[*/
  341: {
    /* n:"BrtBeginSingleCells", */
    T: 1
  },
  /*::[*/
  342: {
    /* n:"BrtEndSingleCells", */
    T: -1
  },
  /*::[*/
  343: {
    /* n:"BrtBeginList", */
    T: 1
  },
  /*::[*/
  344: {
    /* n:"BrtEndList", */
    T: -1
  },
  /*::[*/
  345: {
    /* n:"BrtBeginListCols", */
    T: 1
  },
  /*::[*/
  346: {
    /* n:"BrtEndListCols", */
    T: -1
  },
  /*::[*/
  347: {
    /* n:"BrtBeginListCol", */
    T: 1
  },
  /*::[*/
  348: {
    /* n:"BrtEndListCol", */
    T: -1
  },
  /*::[*/
  349: {
    /* n:"BrtBeginListXmlCPr", */
    T: 1
  },
  /*::[*/
  350: {
    /* n:"BrtEndListXmlCPr", */
    T: -1
  },
  /*::[*/
  351: {
    /* n:"BrtListCCFmla" */
  },
  /*::[*/
  352: {
    /* n:"BrtListTrFmla" */
  },
  /*::[*/
  353: {
    /* n:"BrtBeginExternals", */
    T: 1
  },
  /*::[*/
  354: {
    /* n:"BrtEndExternals", */
    T: -1
  },
  /*::[*/
  355: {
    /* n:"BrtSupBookSrc", */
    f: parse_RelID
  },
  /*::[*/
  357: {
    /* n:"BrtSupSelf" */
  },
  /*::[*/
  358: {
    /* n:"BrtSupSame" */
  },
  /*::[*/
  359: {
    /* n:"BrtSupTabs" */
  },
  /*::[*/
  360: {
    /* n:"BrtBeginSupBook", */
    T: 1
  },
  /*::[*/
  361: {
    /* n:"BrtPlaceholderName" */
  },
  /*::[*/
  362: {
    /* n:"BrtExternSheet", */
    f: parse_ExternSheet
  },
  /*::[*/
  363: {
    /* n:"BrtExternTableStart" */
  },
  /*::[*/
  364: {
    /* n:"BrtExternTableEnd" */
  },
  /*::[*/
  366: {
    /* n:"BrtExternRowHdr" */
  },
  /*::[*/
  367: {
    /* n:"BrtExternCellBlank" */
  },
  /*::[*/
  368: {
    /* n:"BrtExternCellReal" */
  },
  /*::[*/
  369: {
    /* n:"BrtExternCellBool" */
  },
  /*::[*/
  370: {
    /* n:"BrtExternCellError" */
  },
  /*::[*/
  371: {
    /* n:"BrtExternCellString" */
  },
  /*::[*/
  372: {
    /* n:"BrtBeginEsmdx", */
    T: 1
  },
  /*::[*/
  373: {
    /* n:"BrtEndEsmdx", */
    T: -1
  },
  /*::[*/
  374: {
    /* n:"BrtBeginMdxSet", */
    T: 1
  },
  /*::[*/
  375: {
    /* n:"BrtEndMdxSet", */
    T: -1
  },
  /*::[*/
  376: {
    /* n:"BrtBeginMdxMbrProp", */
    T: 1
  },
  /*::[*/
  377: {
    /* n:"BrtEndMdxMbrProp", */
    T: -1
  },
  /*::[*/
  378: {
    /* n:"BrtBeginMdxKPI", */
    T: 1
  },
  /*::[*/
  379: {
    /* n:"BrtEndMdxKPI", */
    T: -1
  },
  /*::[*/
  380: {
    /* n:"BrtBeginEsstr", */
    T: 1
  },
  /*::[*/
  381: {
    /* n:"BrtEndEsstr", */
    T: -1
  },
  /*::[*/
  382: {
    /* n:"BrtBeginPRFItem", */
    T: 1
  },
  /*::[*/
  383: {
    /* n:"BrtEndPRFItem", */
    T: -1
  },
  /*::[*/
  384: {
    /* n:"BrtBeginPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  385: {
    /* n:"BrtEndPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  386: {
    /* n:"BrtBeginPivotCacheID", */
    T: 1
  },
  /*::[*/
  387: {
    /* n:"BrtEndPivotCacheID", */
    T: -1
  },
  /*::[*/
  388: {
    /* n:"BrtBeginISXVIs", */
    T: 1
  },
  /*::[*/
  389: {
    /* n:"BrtEndISXVIs", */
    T: -1
  },
  /*::[*/
  390: {
    /* n:"BrtBeginColInfos", */
    T: 1
  },
  /*::[*/
  391: {
    /* n:"BrtEndColInfos", */
    T: -1
  },
  /*::[*/
  392: {
    /* n:"BrtBeginRwBrk", */
    T: 1
  },
  /*::[*/
  393: {
    /* n:"BrtEndRwBrk", */
    T: -1
  },
  /*::[*/
  394: {
    /* n:"BrtBeginColBrk", */
    T: 1
  },
  /*::[*/
  395: {
    /* n:"BrtEndColBrk", */
    T: -1
  },
  /*::[*/
  396: {
    /* n:"BrtBrk" */
  },
  /*::[*/
  397: {
    /* n:"BrtUserBookView" */
  },
  /*::[*/
  398: {
    /* n:"BrtInfo" */
  },
  /*::[*/
  399: {
    /* n:"BrtCUsr" */
  },
  /*::[*/
  400: {
    /* n:"BrtUsr" */
  },
  /*::[*/
  401: {
    /* n:"BrtBeginUsers", */
    T: 1
  },
  /*::[*/
  403: {
    /* n:"BrtEOF" */
  },
  /*::[*/
  404: {
    /* n:"BrtUCR" */
  },
  /*::[*/
  405: {
    /* n:"BrtRRInsDel" */
  },
  /*::[*/
  406: {
    /* n:"BrtRREndInsDel" */
  },
  /*::[*/
  407: {
    /* n:"BrtRRMove" */
  },
  /*::[*/
  408: {
    /* n:"BrtRREndMove" */
  },
  /*::[*/
  409: {
    /* n:"BrtRRChgCell" */
  },
  /*::[*/
  410: {
    /* n:"BrtRREndChgCell" */
  },
  /*::[*/
  411: {
    /* n:"BrtRRHeader" */
  },
  /*::[*/
  412: {
    /* n:"BrtRRUserView" */
  },
  /*::[*/
  413: {
    /* n:"BrtRRRenSheet" */
  },
  /*::[*/
  414: {
    /* n:"BrtRRInsertSh" */
  },
  /*::[*/
  415: {
    /* n:"BrtRRDefName" */
  },
  /*::[*/
  416: {
    /* n:"BrtRRNote" */
  },
  /*::[*/
  417: {
    /* n:"BrtRRConflict" */
  },
  /*::[*/
  418: {
    /* n:"BrtRRTQSIF" */
  },
  /*::[*/
  419: {
    /* n:"BrtRRFormat" */
  },
  /*::[*/
  420: {
    /* n:"BrtRREndFormat" */
  },
  /*::[*/
  421: {
    /* n:"BrtRRAutoFmt" */
  },
  /*::[*/
  422: {
    /* n:"BrtBeginUserShViews", */
    T: 1
  },
  /*::[*/
  423: {
    /* n:"BrtBeginUserShView", */
    T: 1
  },
  /*::[*/
  424: {
    /* n:"BrtEndUserShView", */
    T: -1
  },
  /*::[*/
  425: {
    /* n:"BrtEndUserShViews", */
    T: -1
  },
  /*::[*/
  426: {
    /* n:"BrtArrFmla", */
    f: parse_BrtArrFmla
  },
  /*::[*/
  427: {
    /* n:"BrtShrFmla", */
    f: parse_BrtShrFmla
  },
  /*::[*/
  428: {
    /* n:"BrtTable" */
  },
  /*::[*/
  429: {
    /* n:"BrtBeginExtConnections", */
    T: 1
  },
  /*::[*/
  430: {
    /* n:"BrtEndExtConnections", */
    T: -1
  },
  /*::[*/
  431: {
    /* n:"BrtBeginPCDCalcMems", */
    T: 1
  },
  /*::[*/
  432: {
    /* n:"BrtEndPCDCalcMems", */
    T: -1
  },
  /*::[*/
  433: {
    /* n:"BrtBeginPCDCalcMem", */
    T: 1
  },
  /*::[*/
  434: {
    /* n:"BrtEndPCDCalcMem", */
    T: -1
  },
  /*::[*/
  435: {
    /* n:"BrtBeginPCDHGLevels", */
    T: 1
  },
  /*::[*/
  436: {
    /* n:"BrtEndPCDHGLevels", */
    T: -1
  },
  /*::[*/
  437: {
    /* n:"BrtBeginPCDHGLevel", */
    T: 1
  },
  /*::[*/
  438: {
    /* n:"BrtEndPCDHGLevel", */
    T: -1
  },
  /*::[*/
  439: {
    /* n:"BrtBeginPCDHGLGroups", */
    T: 1
  },
  /*::[*/
  440: {
    /* n:"BrtEndPCDHGLGroups", */
    T: -1
  },
  /*::[*/
  441: {
    /* n:"BrtBeginPCDHGLGroup", */
    T: 1
  },
  /*::[*/
  442: {
    /* n:"BrtEndPCDHGLGroup", */
    T: -1
  },
  /*::[*/
  443: {
    /* n:"BrtBeginPCDHGLGMembers", */
    T: 1
  },
  /*::[*/
  444: {
    /* n:"BrtEndPCDHGLGMembers", */
    T: -1
  },
  /*::[*/
  445: {
    /* n:"BrtBeginPCDHGLGMember", */
    T: 1
  },
  /*::[*/
  446: {
    /* n:"BrtEndPCDHGLGMember", */
    T: -1
  },
  /*::[*/
  447: {
    /* n:"BrtBeginQSI", */
    T: 1
  },
  /*::[*/
  448: {
    /* n:"BrtEndQSI", */
    T: -1
  },
  /*::[*/
  449: {
    /* n:"BrtBeginQSIR", */
    T: 1
  },
  /*::[*/
  450: {
    /* n:"BrtEndQSIR", */
    T: -1
  },
  /*::[*/
  451: {
    /* n:"BrtBeginDeletedNames", */
    T: 1
  },
  /*::[*/
  452: {
    /* n:"BrtEndDeletedNames", */
    T: -1
  },
  /*::[*/
  453: {
    /* n:"BrtBeginDeletedName", */
    T: 1
  },
  /*::[*/
  454: {
    /* n:"BrtEndDeletedName", */
    T: -1
  },
  /*::[*/
  455: {
    /* n:"BrtBeginQSIFs", */
    T: 1
  },
  /*::[*/
  456: {
    /* n:"BrtEndQSIFs", */
    T: -1
  },
  /*::[*/
  457: {
    /* n:"BrtBeginQSIF", */
    T: 1
  },
  /*::[*/
  458: {
    /* n:"BrtEndQSIF", */
    T: -1
  },
  /*::[*/
  459: {
    /* n:"BrtBeginAutoSortScope", */
    T: 1
  },
  /*::[*/
  460: {
    /* n:"BrtEndAutoSortScope", */
    T: -1
  },
  /*::[*/
  461: {
    /* n:"BrtBeginConditionalFormatting", */
    T: 1
  },
  /*::[*/
  462: {
    /* n:"BrtEndConditionalFormatting", */
    T: -1
  },
  /*::[*/
  463: {
    /* n:"BrtBeginCFRule", */
    T: 1
  },
  /*::[*/
  464: {
    /* n:"BrtEndCFRule", */
    T: -1
  },
  /*::[*/
  465: {
    /* n:"BrtBeginIconSet", */
    T: 1
  },
  /*::[*/
  466: {
    /* n:"BrtEndIconSet", */
    T: -1
  },
  /*::[*/
  467: {
    /* n:"BrtBeginDatabar", */
    T: 1
  },
  /*::[*/
  468: {
    /* n:"BrtEndDatabar", */
    T: -1
  },
  /*::[*/
  469: {
    /* n:"BrtBeginColorScale", */
    T: 1
  },
  /*::[*/
  470: {
    /* n:"BrtEndColorScale", */
    T: -1
  },
  /*::[*/
  471: {
    /* n:"BrtCFVO" */
  },
  /*::[*/
  472: {
    /* n:"BrtExternValueMeta" */
  },
  /*::[*/
  473: {
    /* n:"BrtBeginColorPalette", */
    T: 1
  },
  /*::[*/
  474: {
    /* n:"BrtEndColorPalette", */
    T: -1
  },
  /*::[*/
  475: {
    /* n:"BrtIndexedColor" */
  },
  /*::[*/
  476: {
    /* n:"BrtMargins", */
    f: parse_BrtMargins
  },
  /*::[*/
  477: {
    /* n:"BrtPrintOptions" */
  },
  /*::[*/
  478: {
    /* n:"BrtPageSetup" */
  },
  /*::[*/
  479: {
    /* n:"BrtBeginHeaderFooter", */
    T: 1
  },
  /*::[*/
  480: {
    /* n:"BrtEndHeaderFooter", */
    T: -1
  },
  /*::[*/
  481: {
    /* n:"BrtBeginSXCrtFormat", */
    T: 1
  },
  /*::[*/
  482: {
    /* n:"BrtEndSXCrtFormat", */
    T: -1
  },
  /*::[*/
  483: {
    /* n:"BrtBeginSXCrtFormats", */
    T: 1
  },
  /*::[*/
  484: {
    /* n:"BrtEndSXCrtFormats", */
    T: -1
  },
  /*::[*/
  485: {
    /* n:"BrtWsFmtInfo", */
    f: parse_BrtWsFmtInfo
  },
  /*::[*/
  486: {
    /* n:"BrtBeginMgs", */
    T: 1
  },
  /*::[*/
  487: {
    /* n:"BrtEndMGs", */
    T: -1
  },
  /*::[*/
  488: {
    /* n:"BrtBeginMGMaps", */
    T: 1
  },
  /*::[*/
  489: {
    /* n:"BrtEndMGMaps", */
    T: -1
  },
  /*::[*/
  490: {
    /* n:"BrtBeginMG", */
    T: 1
  },
  /*::[*/
  491: {
    /* n:"BrtEndMG", */
    T: -1
  },
  /*::[*/
  492: {
    /* n:"BrtBeginMap", */
    T: 1
  },
  /*::[*/
  493: {
    /* n:"BrtEndMap", */
    T: -1
  },
  /*::[*/
  494: {
    /* n:"BrtHLink", */
    f: parse_BrtHLink
  },
  /*::[*/
  495: {
    /* n:"BrtBeginDCon", */
    T: 1
  },
  /*::[*/
  496: {
    /* n:"BrtEndDCon", */
    T: -1
  },
  /*::[*/
  497: {
    /* n:"BrtBeginDRefs", */
    T: 1
  },
  /*::[*/
  498: {
    /* n:"BrtEndDRefs", */
    T: -1
  },
  /*::[*/
  499: {
    /* n:"BrtDRef" */
  },
  /*::[*/
  500: {
    /* n:"BrtBeginScenMan", */
    T: 1
  },
  /*::[*/
  501: {
    /* n:"BrtEndScenMan", */
    T: -1
  },
  /*::[*/
  502: {
    /* n:"BrtBeginSct", */
    T: 1
  },
  /*::[*/
  503: {
    /* n:"BrtEndSct", */
    T: -1
  },
  /*::[*/
  504: {
    /* n:"BrtSlc" */
  },
  /*::[*/
  505: {
    /* n:"BrtBeginDXFs", */
    T: 1
  },
  /*::[*/
  506: {
    /* n:"BrtEndDXFs", */
    T: -1
  },
  /*::[*/
  507: {
    /* n:"BrtDXF" */
  },
  /*::[*/
  508: {
    /* n:"BrtBeginTableStyles", */
    T: 1
  },
  /*::[*/
  509: {
    /* n:"BrtEndTableStyles", */
    T: -1
  },
  /*::[*/
  510: {
    /* n:"BrtBeginTableStyle", */
    T: 1
  },
  /*::[*/
  511: {
    /* n:"BrtEndTableStyle", */
    T: -1
  },
  /*::[*/
  512: {
    /* n:"BrtTableStyleElement" */
  },
  /*::[*/
  513: {
    /* n:"BrtTableStyleClient" */
  },
  /*::[*/
  514: {
    /* n:"BrtBeginVolDeps", */
    T: 1
  },
  /*::[*/
  515: {
    /* n:"BrtEndVolDeps", */
    T: -1
  },
  /*::[*/
  516: {
    /* n:"BrtBeginVolType", */
    T: 1
  },
  /*::[*/
  517: {
    /* n:"BrtEndVolType", */
    T: -1
  },
  /*::[*/
  518: {
    /* n:"BrtBeginVolMain", */
    T: 1
  },
  /*::[*/
  519: {
    /* n:"BrtEndVolMain", */
    T: -1
  },
  /*::[*/
  520: {
    /* n:"BrtBeginVolTopic", */
    T: 1
  },
  /*::[*/
  521: {
    /* n:"BrtEndVolTopic", */
    T: -1
  },
  /*::[*/
  522: {
    /* n:"BrtVolSubtopic" */
  },
  /*::[*/
  523: {
    /* n:"BrtVolRef" */
  },
  /*::[*/
  524: {
    /* n:"BrtVolNum" */
  },
  /*::[*/
  525: {
    /* n:"BrtVolErr" */
  },
  /*::[*/
  526: {
    /* n:"BrtVolStr" */
  },
  /*::[*/
  527: {
    /* n:"BrtVolBool" */
  },
  /*::[*/
  528: {
    /* n:"BrtBeginCalcChain$", */
    T: 1
  },
  /*::[*/
  529: {
    /* n:"BrtEndCalcChain$", */
    T: -1
  },
  /*::[*/
  530: {
    /* n:"BrtBeginSortState", */
    T: 1
  },
  /*::[*/
  531: {
    /* n:"BrtEndSortState", */
    T: -1
  },
  /*::[*/
  532: {
    /* n:"BrtBeginSortCond", */
    T: 1
  },
  /*::[*/
  533: {
    /* n:"BrtEndSortCond", */
    T: -1
  },
  /*::[*/
  534: {
    /* n:"BrtBookProtection" */
  },
  /*::[*/
  535: {
    /* n:"BrtSheetProtection" */
  },
  /*::[*/
  536: {
    /* n:"BrtRangeProtection" */
  },
  /*::[*/
  537: {
    /* n:"BrtPhoneticInfo" */
  },
  /*::[*/
  538: {
    /* n:"BrtBeginECTxtWiz", */
    T: 1
  },
  /*::[*/
  539: {
    /* n:"BrtEndECTxtWiz", */
    T: -1
  },
  /*::[*/
  540: {
    /* n:"BrtBeginECTWFldInfoLst", */
    T: 1
  },
  /*::[*/
  541: {
    /* n:"BrtEndECTWFldInfoLst", */
    T: -1
  },
  /*::[*/
  542: {
    /* n:"BrtBeginECTwFldInfo", */
    T: 1
  },
  /*::[*/
  548: {
    /* n:"BrtFileSharing" */
  },
  /*::[*/
  549: {
    /* n:"BrtOleSize" */
  },
  /*::[*/
  550: {
    /* n:"BrtDrawing", */
    f: parse_RelID
  },
  /*::[*/
  551: {
    /* n:"BrtLegacyDrawing" */
  },
  /*::[*/
  552: {
    /* n:"BrtLegacyDrawingHF" */
  },
  /*::[*/
  553: {
    /* n:"BrtWebOpt" */
  },
  /*::[*/
  554: {
    /* n:"BrtBeginWebPubItems", */
    T: 1
  },
  /*::[*/
  555: {
    /* n:"BrtEndWebPubItems", */
    T: -1
  },
  /*::[*/
  556: {
    /* n:"BrtBeginWebPubItem", */
    T: 1
  },
  /*::[*/
  557: {
    /* n:"BrtEndWebPubItem", */
    T: -1
  },
  /*::[*/
  558: {
    /* n:"BrtBeginSXCondFmt", */
    T: 1
  },
  /*::[*/
  559: {
    /* n:"BrtEndSXCondFmt", */
    T: -1
  },
  /*::[*/
  560: {
    /* n:"BrtBeginSXCondFmts", */
    T: 1
  },
  /*::[*/
  561: {
    /* n:"BrtEndSXCondFmts", */
    T: -1
  },
  /*::[*/
  562: {
    /* n:"BrtBkHim" */
  },
  /*::[*/
  564: {
    /* n:"BrtColor" */
  },
  /*::[*/
  565: {
    /* n:"BrtBeginIndexedColors", */
    T: 1
  },
  /*::[*/
  566: {
    /* n:"BrtEndIndexedColors", */
    T: -1
  },
  /*::[*/
  569: {
    /* n:"BrtBeginMRUColors", */
    T: 1
  },
  /*::[*/
  570: {
    /* n:"BrtEndMRUColors", */
    T: -1
  },
  /*::[*/
  572: {
    /* n:"BrtMRUColor" */
  },
  /*::[*/
  573: {
    /* n:"BrtBeginDVals", */
    T: 1
  },
  /*::[*/
  574: {
    /* n:"BrtEndDVals", */
    T: -1
  },
  /*::[*/
  577: {
    /* n:"BrtSupNameStart" */
  },
  /*::[*/
  578: {
    /* n:"BrtSupNameValueStart" */
  },
  /*::[*/
  579: {
    /* n:"BrtSupNameValueEnd" */
  },
  /*::[*/
  580: {
    /* n:"BrtSupNameNum" */
  },
  /*::[*/
  581: {
    /* n:"BrtSupNameErr" */
  },
  /*::[*/
  582: {
    /* n:"BrtSupNameSt" */
  },
  /*::[*/
  583: {
    /* n:"BrtSupNameNil" */
  },
  /*::[*/
  584: {
    /* n:"BrtSupNameBool" */
  },
  /*::[*/
  585: {
    /* n:"BrtSupNameFmla" */
  },
  /*::[*/
  586: {
    /* n:"BrtSupNameBits" */
  },
  /*::[*/
  587: {
    /* n:"BrtSupNameEnd" */
  },
  /*::[*/
  588: {
    /* n:"BrtEndSupBook", */
    T: -1
  },
  /*::[*/
  589: {
    /* n:"BrtCellSmartTagProperty" */
  },
  /*::[*/
  590: {
    /* n:"BrtBeginCellSmartTag", */
    T: 1
  },
  /*::[*/
  591: {
    /* n:"BrtEndCellSmartTag", */
    T: -1
  },
  /*::[*/
  592: {
    /* n:"BrtBeginCellSmartTags", */
    T: 1
  },
  /*::[*/
  593: {
    /* n:"BrtEndCellSmartTags", */
    T: -1
  },
  /*::[*/
  594: {
    /* n:"BrtBeginSmartTags", */
    T: 1
  },
  /*::[*/
  595: {
    /* n:"BrtEndSmartTags", */
    T: -1
  },
  /*::[*/
  596: {
    /* n:"BrtSmartTagType" */
  },
  /*::[*/
  597: {
    /* n:"BrtBeginSmartTagTypes", */
    T: 1
  },
  /*::[*/
  598: {
    /* n:"BrtEndSmartTagTypes", */
    T: -1
  },
  /*::[*/
  599: {
    /* n:"BrtBeginSXFilters", */
    T: 1
  },
  /*::[*/
  600: {
    /* n:"BrtEndSXFilters", */
    T: -1
  },
  /*::[*/
  601: {
    /* n:"BrtBeginSXFILTER", */
    T: 1
  },
  /*::[*/
  602: {
    /* n:"BrtEndSXFilter", */
    T: -1
  },
  /*::[*/
  603: {
    /* n:"BrtBeginFills", */
    T: 1
  },
  /*::[*/
  604: {
    /* n:"BrtEndFills", */
    T: -1
  },
  /*::[*/
  605: {
    /* n:"BrtBeginCellWatches", */
    T: 1
  },
  /*::[*/
  606: {
    /* n:"BrtEndCellWatches", */
    T: -1
  },
  /*::[*/
  607: {
    /* n:"BrtCellWatch" */
  },
  /*::[*/
  608: {
    /* n:"BrtBeginCRErrs", */
    T: 1
  },
  /*::[*/
  609: {
    /* n:"BrtEndCRErrs", */
    T: -1
  },
  /*::[*/
  610: {
    /* n:"BrtCrashRecErr" */
  },
  /*::[*/
  611: {
    /* n:"BrtBeginFonts", */
    T: 1
  },
  /*::[*/
  612: {
    /* n:"BrtEndFonts", */
    T: -1
  },
  /*::[*/
  613: {
    /* n:"BrtBeginBorders", */
    T: 1
  },
  /*::[*/
  614: {
    /* n:"BrtEndBorders", */
    T: -1
  },
  /*::[*/
  615: {
    /* n:"BrtBeginFmts", */
    T: 1
  },
  /*::[*/
  616: {
    /* n:"BrtEndFmts", */
    T: -1
  },
  /*::[*/
  617: {
    /* n:"BrtBeginCellXFs", */
    T: 1
  },
  /*::[*/
  618: {
    /* n:"BrtEndCellXFs", */
    T: -1
  },
  /*::[*/
  619: {
    /* n:"BrtBeginStyles", */
    T: 1
  },
  /*::[*/
  620: {
    /* n:"BrtEndStyles", */
    T: -1
  },
  /*::[*/
  625: {
    /* n:"BrtBigName" */
  },
  /*::[*/
  626: {
    /* n:"BrtBeginCellStyleXFs", */
    T: 1
  },
  /*::[*/
  627: {
    /* n:"BrtEndCellStyleXFs", */
    T: -1
  },
  /*::[*/
  628: {
    /* n:"BrtBeginComments", */
    T: 1
  },
  /*::[*/
  629: {
    /* n:"BrtEndComments", */
    T: -1
  },
  /*::[*/
  630: {
    /* n:"BrtBeginCommentAuthors", */
    T: 1
  },
  /*::[*/
  631: {
    /* n:"BrtEndCommentAuthors", */
    T: -1
  },
  /*::[*/
  632: {
    /* n:"BrtCommentAuthor", */
    f: parse_BrtCommentAuthor
  },
  /*::[*/
  633: {
    /* n:"BrtBeginCommentList", */
    T: 1
  },
  /*::[*/
  634: {
    /* n:"BrtEndCommentList", */
    T: -1
  },
  /*::[*/
  635: {
    /* n:"BrtBeginComment", */
    T: 1,
    f: parse_BrtBeginComment
  },
  /*::[*/
  636: {
    /* n:"BrtEndComment", */
    T: -1
  },
  /*::[*/
  637: {
    /* n:"BrtCommentText", */
    f: parse_BrtCommentText
  },
  /*::[*/
  638: {
    /* n:"BrtBeginOleObjects", */
    T: 1
  },
  /*::[*/
  639: {
    /* n:"BrtOleObject" */
  },
  /*::[*/
  640: {
    /* n:"BrtEndOleObjects", */
    T: -1
  },
  /*::[*/
  641: {
    /* n:"BrtBeginSxrules", */
    T: 1
  },
  /*::[*/
  642: {
    /* n:"BrtEndSxRules", */
    T: -1
  },
  /*::[*/
  643: {
    /* n:"BrtBeginActiveXControls", */
    T: 1
  },
  /*::[*/
  644: {
    /* n:"BrtActiveX" */
  },
  /*::[*/
  645: {
    /* n:"BrtEndActiveXControls", */
    T: -1
  },
  /*::[*/
  646: {
    /* n:"BrtBeginPCDSDTCEMembersSortBy", */
    T: 1
  },
  /*::[*/
  648: {
    /* n:"BrtBeginCellIgnoreECs", */
    T: 1
  },
  /*::[*/
  649: {
    /* n:"BrtCellIgnoreEC" */
  },
  /*::[*/
  650: {
    /* n:"BrtEndCellIgnoreECs", */
    T: -1
  },
  /*::[*/
  651: {
    /* n:"BrtCsProp", */
    f: parse_BrtCsProp
  },
  /*::[*/
  652: {
    /* n:"BrtCsPageSetup" */
  },
  /*::[*/
  653: {
    /* n:"BrtBeginUserCsViews", */
    T: 1
  },
  /*::[*/
  654: {
    /* n:"BrtEndUserCsViews", */
    T: -1
  },
  /*::[*/
  655: {
    /* n:"BrtBeginUserCsView", */
    T: 1
  },
  /*::[*/
  656: {
    /* n:"BrtEndUserCsView", */
    T: -1
  },
  /*::[*/
  657: {
    /* n:"BrtBeginPcdSFCIEntries", */
    T: 1
  },
  /*::[*/
  658: {
    /* n:"BrtEndPCDSFCIEntries", */
    T: -1
  },
  /*::[*/
  659: {
    /* n:"BrtPCDSFCIEntry" */
  },
  /*::[*/
  660: {
    /* n:"BrtBeginListParts", */
    T: 1
  },
  /*::[*/
  661: {
    /* n:"BrtListPart" */
  },
  /*::[*/
  662: {
    /* n:"BrtEndListParts", */
    T: -1
  },
  /*::[*/
  663: {
    /* n:"BrtSheetCalcProp" */
  },
  /*::[*/
  664: {
    /* n:"BrtBeginFnGroup", */
    T: 1
  },
  /*::[*/
  665: {
    /* n:"BrtFnGroup" */
  },
  /*::[*/
  666: {
    /* n:"BrtEndFnGroup", */
    T: -1
  },
  /*::[*/
  667: {
    /* n:"BrtSupAddin" */
  },
  /*::[*/
  668: {
    /* n:"BrtSXTDMPOrder" */
  },
  /*::[*/
  669: {
    /* n:"BrtCsProtection" */
  },
  /*::[*/
  671: {
    /* n:"BrtBeginWsSortMap", */
    T: 1
  },
  /*::[*/
  672: {
    /* n:"BrtEndWsSortMap", */
    T: -1
  },
  /*::[*/
  673: {
    /* n:"BrtBeginRRSort", */
    T: 1
  },
  /*::[*/
  674: {
    /* n:"BrtEndRRSort", */
    T: -1
  },
  /*::[*/
  675: {
    /* n:"BrtRRSortItem" */
  },
  /*::[*/
  676: {
    /* n:"BrtFileSharingIso" */
  },
  /*::[*/
  677: {
    /* n:"BrtBookProtectionIso" */
  },
  /*::[*/
  678: {
    /* n:"BrtSheetProtectionIso" */
  },
  /*::[*/
  679: {
    /* n:"BrtCsProtectionIso" */
  },
  /*::[*/
  680: {
    /* n:"BrtRangeProtectionIso" */
  },
  /*::[*/
  681: {
    /* n:"BrtDValList" */
  },
  /*::[*/
  1024: {
    /* n:"BrtRwDescent" */
  },
  /*::[*/
  1025: {
    /* n:"BrtKnownFonts" */
  },
  /*::[*/
  1026: {
    /* n:"BrtBeginSXTupleSet", */
    T: 1
  },
  /*::[*/
  1027: {
    /* n:"BrtEndSXTupleSet", */
    T: -1
  },
  /*::[*/
  1028: {
    /* n:"BrtBeginSXTupleSetHeader", */
    T: 1
  },
  /*::[*/
  1029: {
    /* n:"BrtEndSXTupleSetHeader", */
    T: -1
  },
  /*::[*/
  1030: {
    /* n:"BrtSXTupleSetHeaderItem" */
  },
  /*::[*/
  1031: {
    /* n:"BrtBeginSXTupleSetData", */
    T: 1
  },
  /*::[*/
  1032: {
    /* n:"BrtEndSXTupleSetData", */
    T: -1
  },
  /*::[*/
  1033: {
    /* n:"BrtBeginSXTupleSetRow", */
    T: 1
  },
  /*::[*/
  1034: {
    /* n:"BrtEndSXTupleSetRow", */
    T: -1
  },
  /*::[*/
  1035: {
    /* n:"BrtSXTupleSetRowItem" */
  },
  /*::[*/
  1036: {
    /* n:"BrtNameExt" */
  },
  /*::[*/
  1037: {
    /* n:"BrtPCDH14" */
  },
  /*::[*/
  1038: {
    /* n:"BrtBeginPCDCalcMem14", */
    T: 1
  },
  /*::[*/
  1039: {
    /* n:"BrtEndPCDCalcMem14", */
    T: -1
  },
  /*::[*/
  1040: {
    /* n:"BrtSXTH14" */
  },
  /*::[*/
  1041: {
    /* n:"BrtBeginSparklineGroup", */
    T: 1
  },
  /*::[*/
  1042: {
    /* n:"BrtEndSparklineGroup", */
    T: -1
  },
  /*::[*/
  1043: {
    /* n:"BrtSparkline" */
  },
  /*::[*/
  1044: {
    /* n:"BrtSXDI14" */
  },
  /*::[*/
  1045: {
    /* n:"BrtWsFmtInfoEx14" */
  },
  /*::[*/
  1046: {
    /* n:"BrtBeginConditionalFormatting14", */
    T: 1
  },
  /*::[*/
  1047: {
    /* n:"BrtEndConditionalFormatting14", */
    T: -1
  },
  /*::[*/
  1048: {
    /* n:"BrtBeginCFRule14", */
    T: 1
  },
  /*::[*/
  1049: {
    /* n:"BrtEndCFRule14", */
    T: -1
  },
  /*::[*/
  1050: {
    /* n:"BrtCFVO14" */
  },
  /*::[*/
  1051: {
    /* n:"BrtBeginDatabar14", */
    T: 1
  },
  /*::[*/
  1052: {
    /* n:"BrtBeginIconSet14", */
    T: 1
  },
  /*::[*/
  1053: {
    /* n:"BrtDVal14", */
    f: parse_BrtDVal14
  },
  /*::[*/
  1054: {
    /* n:"BrtBeginDVals14", */
    T: 1
  },
  /*::[*/
  1055: {
    /* n:"BrtColor14" */
  },
  /*::[*/
  1056: {
    /* n:"BrtBeginSparklines", */
    T: 1
  },
  /*::[*/
  1057: {
    /* n:"BrtEndSparklines", */
    T: -1
  },
  /*::[*/
  1058: {
    /* n:"BrtBeginSparklineGroups", */
    T: 1
  },
  /*::[*/
  1059: {
    /* n:"BrtEndSparklineGroups", */
    T: -1
  },
  /*::[*/
  1061: {
    /* n:"BrtSXVD14" */
  },
  /*::[*/
  1062: {
    /* n:"BrtBeginSXView14", */
    T: 1
  },
  /*::[*/
  1063: {
    /* n:"BrtEndSXView14", */
    T: -1
  },
  /*::[*/
  1064: {
    /* n:"BrtBeginSXView16", */
    T: 1
  },
  /*::[*/
  1065: {
    /* n:"BrtEndSXView16", */
    T: -1
  },
  /*::[*/
  1066: {
    /* n:"BrtBeginPCD14", */
    T: 1
  },
  /*::[*/
  1067: {
    /* n:"BrtEndPCD14", */
    T: -1
  },
  /*::[*/
  1068: {
    /* n:"BrtBeginExtConn14", */
    T: 1
  },
  /*::[*/
  1069: {
    /* n:"BrtEndExtConn14", */
    T: -1
  },
  /*::[*/
  1070: {
    /* n:"BrtBeginSlicerCacheIDs", */
    T: 1
  },
  /*::[*/
  1071: {
    /* n:"BrtEndSlicerCacheIDs", */
    T: -1
  },
  /*::[*/
  1072: {
    /* n:"BrtBeginSlicerCacheID", */
    T: 1
  },
  /*::[*/
  1073: {
    /* n:"BrtEndSlicerCacheID", */
    T: -1
  },
  /*::[*/
  1075: {
    /* n:"BrtBeginSlicerCache", */
    T: 1
  },
  /*::[*/
  1076: {
    /* n:"BrtEndSlicerCache", */
    T: -1
  },
  /*::[*/
  1077: {
    /* n:"BrtBeginSlicerCacheDef", */
    T: 1
  },
  /*::[*/
  1078: {
    /* n:"BrtEndSlicerCacheDef", */
    T: -1
  },
  /*::[*/
  1079: {
    /* n:"BrtBeginSlicersEx", */
    T: 1
  },
  /*::[*/
  1080: {
    /* n:"BrtEndSlicersEx", */
    T: -1
  },
  /*::[*/
  1081: {
    /* n:"BrtBeginSlicerEx", */
    T: 1
  },
  /*::[*/
  1082: {
    /* n:"BrtEndSlicerEx", */
    T: -1
  },
  /*::[*/
  1083: {
    /* n:"BrtBeginSlicer", */
    T: 1
  },
  /*::[*/
  1084: {
    /* n:"BrtEndSlicer", */
    T: -1
  },
  /*::[*/
  1085: {
    /* n:"BrtSlicerCachePivotTables" */
  },
  /*::[*/
  1086: {
    /* n:"BrtBeginSlicerCacheOlapImpl", */
    T: 1
  },
  /*::[*/
  1087: {
    /* n:"BrtEndSlicerCacheOlapImpl", */
    T: -1
  },
  /*::[*/
  1088: {
    /* n:"BrtBeginSlicerCacheLevelsData", */
    T: 1
  },
  /*::[*/
  1089: {
    /* n:"BrtEndSlicerCacheLevelsData", */
    T: -1
  },
  /*::[*/
  1090: {
    /* n:"BrtBeginSlicerCacheLevelData", */
    T: 1
  },
  /*::[*/
  1091: {
    /* n:"BrtEndSlicerCacheLevelData", */
    T: -1
  },
  /*::[*/
  1092: {
    /* n:"BrtBeginSlicerCacheSiRanges", */
    T: 1
  },
  /*::[*/
  1093: {
    /* n:"BrtEndSlicerCacheSiRanges", */
    T: -1
  },
  /*::[*/
  1094: {
    /* n:"BrtBeginSlicerCacheSiRange", */
    T: 1
  },
  /*::[*/
  1095: {
    /* n:"BrtEndSlicerCacheSiRange", */
    T: -1
  },
  /*::[*/
  1096: {
    /* n:"BrtSlicerCacheOlapItem" */
  },
  /*::[*/
  1097: {
    /* n:"BrtBeginSlicerCacheSelections", */
    T: 1
  },
  /*::[*/
  1098: {
    /* n:"BrtSlicerCacheSelection" */
  },
  /*::[*/
  1099: {
    /* n:"BrtEndSlicerCacheSelections", */
    T: -1
  },
  /*::[*/
  1100: {
    /* n:"BrtBeginSlicerCacheNative", */
    T: 1
  },
  /*::[*/
  1101: {
    /* n:"BrtEndSlicerCacheNative", */
    T: -1
  },
  /*::[*/
  1102: {
    /* n:"BrtSlicerCacheNativeItem" */
  },
  /*::[*/
  1103: {
    /* n:"BrtRangeProtection14" */
  },
  /*::[*/
  1104: {
    /* n:"BrtRangeProtectionIso14" */
  },
  /*::[*/
  1105: {
    /* n:"BrtCellIgnoreEC14" */
  },
  /*::[*/
  1111: {
    /* n:"BrtList14" */
  },
  /*::[*/
  1112: {
    /* n:"BrtCFIcon" */
  },
  /*::[*/
  1113: {
    /* n:"BrtBeginSlicerCachesPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  1114: {
    /* n:"BrtEndSlicerCachesPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  1115: {
    /* n:"BrtBeginSlicers", */
    T: 1
  },
  /*::[*/
  1116: {
    /* n:"BrtEndSlicers", */
    T: -1
  },
  /*::[*/
  1117: {
    /* n:"BrtWbProp14" */
  },
  /*::[*/
  1118: {
    /* n:"BrtBeginSXEdit", */
    T: 1
  },
  /*::[*/
  1119: {
    /* n:"BrtEndSXEdit", */
    T: -1
  },
  /*::[*/
  1120: {
    /* n:"BrtBeginSXEdits", */
    T: 1
  },
  /*::[*/
  1121: {
    /* n:"BrtEndSXEdits", */
    T: -1
  },
  /*::[*/
  1122: {
    /* n:"BrtBeginSXChange", */
    T: 1
  },
  /*::[*/
  1123: {
    /* n:"BrtEndSXChange", */
    T: -1
  },
  /*::[*/
  1124: {
    /* n:"BrtBeginSXChanges", */
    T: 1
  },
  /*::[*/
  1125: {
    /* n:"BrtEndSXChanges", */
    T: -1
  },
  /*::[*/
  1126: {
    /* n:"BrtSXTupleItems" */
  },
  /*::[*/
  1128: {
    /* n:"BrtBeginSlicerStyle", */
    T: 1
  },
  /*::[*/
  1129: {
    /* n:"BrtEndSlicerStyle", */
    T: -1
  },
  /*::[*/
  1130: {
    /* n:"BrtSlicerStyleElement" */
  },
  /*::[*/
  1131: {
    /* n:"BrtBeginStyleSheetExt14", */
    T: 1
  },
  /*::[*/
  1132: {
    /* n:"BrtEndStyleSheetExt14", */
    T: -1
  },
  /*::[*/
  1133: {
    /* n:"BrtBeginSlicerCachesPivotCacheID", */
    T: 1
  },
  /*::[*/
  1134: {
    /* n:"BrtEndSlicerCachesPivotCacheID", */
    T: -1
  },
  /*::[*/
  1135: {
    /* n:"BrtBeginConditionalFormattings", */
    T: 1
  },
  /*::[*/
  1136: {
    /* n:"BrtEndConditionalFormattings", */
    T: -1
  },
  /*::[*/
  1137: {
    /* n:"BrtBeginPCDCalcMemExt", */
    T: 1
  },
  /*::[*/
  1138: {
    /* n:"BrtEndPCDCalcMemExt", */
    T: -1
  },
  /*::[*/
  1139: {
    /* n:"BrtBeginPCDCalcMemsExt", */
    T: 1
  },
  /*::[*/
  1140: {
    /* n:"BrtEndPCDCalcMemsExt", */
    T: -1
  },
  /*::[*/
  1141: {
    /* n:"BrtPCDField14" */
  },
  /*::[*/
  1142: {
    /* n:"BrtBeginSlicerStyles", */
    T: 1
  },
  /*::[*/
  1143: {
    /* n:"BrtEndSlicerStyles", */
    T: -1
  },
  /*::[*/
  1144: {
    /* n:"BrtBeginSlicerStyleElements", */
    T: 1
  },
  /*::[*/
  1145: {
    /* n:"BrtEndSlicerStyleElements", */
    T: -1
  },
  /*::[*/
  1146: {
    /* n:"BrtCFRuleExt" */
  },
  /*::[*/
  1147: {
    /* n:"BrtBeginSXCondFmt14", */
    T: 1
  },
  /*::[*/
  1148: {
    /* n:"BrtEndSXCondFmt14", */
    T: -1
  },
  /*::[*/
  1149: {
    /* n:"BrtBeginSXCondFmts14", */
    T: 1
  },
  /*::[*/
  1150: {
    /* n:"BrtEndSXCondFmts14", */
    T: -1
  },
  /*::[*/
  1152: {
    /* n:"BrtBeginSortCond14", */
    T: 1
  },
  /*::[*/
  1153: {
    /* n:"BrtEndSortCond14", */
    T: -1
  },
  /*::[*/
  1154: {
    /* n:"BrtEndDVals14", */
    T: -1
  },
  /*::[*/
  1155: {
    /* n:"BrtEndIconSet14", */
    T: -1
  },
  /*::[*/
  1156: {
    /* n:"BrtEndDatabar14", */
    T: -1
  },
  /*::[*/
  1157: {
    /* n:"BrtBeginColorScale14", */
    T: 1
  },
  /*::[*/
  1158: {
    /* n:"BrtEndColorScale14", */
    T: -1
  },
  /*::[*/
  1159: {
    /* n:"BrtBeginSxrules14", */
    T: 1
  },
  /*::[*/
  1160: {
    /* n:"BrtEndSxrules14", */
    T: -1
  },
  /*::[*/
  1161: {
    /* n:"BrtBeginPRule14", */
    T: 1
  },
  /*::[*/
  1162: {
    /* n:"BrtEndPRule14", */
    T: -1
  },
  /*::[*/
  1163: {
    /* n:"BrtBeginPRFilters14", */
    T: 1
  },
  /*::[*/
  1164: {
    /* n:"BrtEndPRFilters14", */
    T: -1
  },
  /*::[*/
  1165: {
    /* n:"BrtBeginPRFilter14", */
    T: 1
  },
  /*::[*/
  1166: {
    /* n:"BrtEndPRFilter14", */
    T: -1
  },
  /*::[*/
  1167: {
    /* n:"BrtBeginPRFItem14", */
    T: 1
  },
  /*::[*/
  1168: {
    /* n:"BrtEndPRFItem14", */
    T: -1
  },
  /*::[*/
  1169: {
    /* n:"BrtBeginCellIgnoreECs14", */
    T: 1
  },
  /*::[*/
  1170: {
    /* n:"BrtEndCellIgnoreECs14", */
    T: -1
  },
  /*::[*/
  1171: {
    /* n:"BrtDxf14" */
  },
  /*::[*/
  1172: {
    /* n:"BrtBeginDxF14s", */
    T: 1
  },
  /*::[*/
  1173: {
    /* n:"BrtEndDxf14s", */
    T: -1
  },
  /*::[*/
  1177: {
    /* n:"BrtFilter14" */
  },
  /*::[*/
  1178: {
    /* n:"BrtBeginCustomFilters14", */
    T: 1
  },
  /*::[*/
  1180: {
    /* n:"BrtCustomFilter14" */
  },
  /*::[*/
  1181: {
    /* n:"BrtIconFilter14" */
  },
  /*::[*/
  1182: {
    /* n:"BrtPivotCacheConnectionName" */
  },
  /*::[*/
  2048: {
    /* n:"BrtBeginDecoupledPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  2049: {
    /* n:"BrtEndDecoupledPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  2050: {
    /* n:"BrtDecoupledPivotCacheID" */
  },
  /*::[*/
  2051: {
    /* n:"BrtBeginPivotTableRefs", */
    T: 1
  },
  /*::[*/
  2052: {
    /* n:"BrtEndPivotTableRefs", */
    T: -1
  },
  /*::[*/
  2053: {
    /* n:"BrtPivotTableRef" */
  },
  /*::[*/
  2054: {
    /* n:"BrtSlicerCacheBookPivotTables" */
  },
  /*::[*/
  2055: {
    /* n:"BrtBeginSxvcells", */
    T: 1
  },
  /*::[*/
  2056: {
    /* n:"BrtEndSxvcells", */
    T: -1
  },
  /*::[*/
  2057: {
    /* n:"BrtBeginSxRow", */
    T: 1
  },
  /*::[*/
  2058: {
    /* n:"BrtEndSxRow", */
    T: -1
  },
  /*::[*/
  2060: {
    /* n:"BrtPcdCalcMem15" */
  },
  /*::[*/
  2067: {
    /* n:"BrtQsi15" */
  },
  /*::[*/
  2068: {
    /* n:"BrtBeginWebExtensions", */
    T: 1
  },
  /*::[*/
  2069: {
    /* n:"BrtEndWebExtensions", */
    T: -1
  },
  /*::[*/
  2070: {
    /* n:"BrtWebExtension" */
  },
  /*::[*/
  2071: {
    /* n:"BrtAbsPath15" */
  },
  /*::[*/
  2072: {
    /* n:"BrtBeginPivotTableUISettings", */
    T: 1
  },
  /*::[*/
  2073: {
    /* n:"BrtEndPivotTableUISettings", */
    T: -1
  },
  /*::[*/
  2075: {
    /* n:"BrtTableSlicerCacheIDs" */
  },
  /*::[*/
  2076: {
    /* n:"BrtTableSlicerCacheID" */
  },
  /*::[*/
  2077: {
    /* n:"BrtBeginTableSlicerCache", */
    T: 1
  },
  /*::[*/
  2078: {
    /* n:"BrtEndTableSlicerCache", */
    T: -1
  },
  /*::[*/
  2079: {
    /* n:"BrtSxFilter15" */
  },
  /*::[*/
  2080: {
    /* n:"BrtBeginTimelineCachePivotCacheIDs", */
    T: 1
  },
  /*::[*/
  2081: {
    /* n:"BrtEndTimelineCachePivotCacheIDs", */
    T: -1
  },
  /*::[*/
  2082: {
    /* n:"BrtTimelineCachePivotCacheID" */
  },
  /*::[*/
  2083: {
    /* n:"BrtBeginTimelineCacheIDs", */
    T: 1
  },
  /*::[*/
  2084: {
    /* n:"BrtEndTimelineCacheIDs", */
    T: -1
  },
  /*::[*/
  2085: {
    /* n:"BrtBeginTimelineCacheID", */
    T: 1
  },
  /*::[*/
  2086: {
    /* n:"BrtEndTimelineCacheID", */
    T: -1
  },
  /*::[*/
  2087: {
    /* n:"BrtBeginTimelinesEx", */
    T: 1
  },
  /*::[*/
  2088: {
    /* n:"BrtEndTimelinesEx", */
    T: -1
  },
  /*::[*/
  2089: {
    /* n:"BrtBeginTimelineEx", */
    T: 1
  },
  /*::[*/
  2090: {
    /* n:"BrtEndTimelineEx", */
    T: -1
  },
  /*::[*/
  2091: {
    /* n:"BrtWorkBookPr15" */
  },
  /*::[*/
  2092: {
    /* n:"BrtPCDH15" */
  },
  /*::[*/
  2093: {
    /* n:"BrtBeginTimelineStyle", */
    T: 1
  },
  /*::[*/
  2094: {
    /* n:"BrtEndTimelineStyle", */
    T: -1
  },
  /*::[*/
  2095: {
    /* n:"BrtTimelineStyleElement" */
  },
  /*::[*/
  2096: {
    /* n:"BrtBeginTimelineStylesheetExt15", */
    T: 1
  },
  /*::[*/
  2097: {
    /* n:"BrtEndTimelineStylesheetExt15", */
    T: -1
  },
  /*::[*/
  2098: {
    /* n:"BrtBeginTimelineStyles", */
    T: 1
  },
  /*::[*/
  2099: {
    /* n:"BrtEndTimelineStyles", */
    T: -1
  },
  /*::[*/
  2100: {
    /* n:"BrtBeginTimelineStyleElements", */
    T: 1
  },
  /*::[*/
  2101: {
    /* n:"BrtEndTimelineStyleElements", */
    T: -1
  },
  /*::[*/
  2102: {
    /* n:"BrtDxf15" */
  },
  /*::[*/
  2103: {
    /* n:"BrtBeginDxfs15", */
    T: 1
  },
  /*::[*/
  2104: {
    /* n:"BrtEndDxfs15", */
    T: -1
  },
  /*::[*/
  2105: {
    /* n:"BrtSlicerCacheHideItemsWithNoData" */
  },
  /*::[*/
  2106: {
    /* n:"BrtBeginItemUniqueNames", */
    T: 1
  },
  /*::[*/
  2107: {
    /* n:"BrtEndItemUniqueNames", */
    T: -1
  },
  /*::[*/
  2108: {
    /* n:"BrtItemUniqueName" */
  },
  /*::[*/
  2109: {
    /* n:"BrtBeginExtConn15", */
    T: 1
  },
  /*::[*/
  2110: {
    /* n:"BrtEndExtConn15", */
    T: -1
  },
  /*::[*/
  2111: {
    /* n:"BrtBeginOledbPr15", */
    T: 1
  },
  /*::[*/
  2112: {
    /* n:"BrtEndOledbPr15", */
    T: -1
  },
  /*::[*/
  2113: {
    /* n:"BrtBeginDataFeedPr15", */
    T: 1
  },
  /*::[*/
  2114: {
    /* n:"BrtEndDataFeedPr15", */
    T: -1
  },
  /*::[*/
  2115: {
    /* n:"BrtTextPr15" */
  },
  /*::[*/
  2116: {
    /* n:"BrtRangePr15" */
  },
  /*::[*/
  2117: {
    /* n:"BrtDbCommand15" */
  },
  /*::[*/
  2118: {
    /* n:"BrtBeginDbTables15", */
    T: 1
  },
  /*::[*/
  2119: {
    /* n:"BrtEndDbTables15", */
    T: -1
  },
  /*::[*/
  2120: {
    /* n:"BrtDbTable15" */
  },
  /*::[*/
  2121: {
    /* n:"BrtBeginDataModel", */
    T: 1
  },
  /*::[*/
  2122: {
    /* n:"BrtEndDataModel", */
    T: -1
  },
  /*::[*/
  2123: {
    /* n:"BrtBeginModelTables", */
    T: 1
  },
  /*::[*/
  2124: {
    /* n:"BrtEndModelTables", */
    T: -1
  },
  /*::[*/
  2125: {
    /* n:"BrtModelTable" */
  },
  /*::[*/
  2126: {
    /* n:"BrtBeginModelRelationships", */
    T: 1
  },
  /*::[*/
  2127: {
    /* n:"BrtEndModelRelationships", */
    T: -1
  },
  /*::[*/
  2128: {
    /* n:"BrtModelRelationship" */
  },
  /*::[*/
  2129: {
    /* n:"BrtBeginECTxtWiz15", */
    T: 1
  },
  /*::[*/
  2130: {
    /* n:"BrtEndECTxtWiz15", */
    T: -1
  },
  /*::[*/
  2131: {
    /* n:"BrtBeginECTWFldInfoLst15", */
    T: 1
  },
  /*::[*/
  2132: {
    /* n:"BrtEndECTWFldInfoLst15", */
    T: -1
  },
  /*::[*/
  2133: {
    /* n:"BrtBeginECTWFldInfo15", */
    T: 1
  },
  /*::[*/
  2134: {
    /* n:"BrtFieldListActiveItem" */
  },
  /*::[*/
  2135: {
    /* n:"BrtPivotCacheIdVersion" */
  },
  /*::[*/
  2136: {
    /* n:"BrtSXDI15" */
  },
  /*::[*/
  2137: {
    /* n:"BrtBeginModelTimeGroupings", */
    T: 1
  },
  /*::[*/
  2138: {
    /* n:"BrtEndModelTimeGroupings", */
    T: -1
  },
  /*::[*/
  2139: {
    /* n:"BrtBeginModelTimeGrouping", */
    T: 1
  },
  /*::[*/
  2140: {
    /* n:"BrtEndModelTimeGrouping", */
    T: -1
  },
  /*::[*/
  2141: {
    /* n:"BrtModelTimeGroupingCalcCol" */
  },
  /*::[*/
  3072: {
    /* n:"BrtUid" */
  },
  /*::[*/
  3073: {
    /* n:"BrtRevisionPtr" */
  },
  /*::[*/
  4096: {
    /* n:"BrtBeginDynamicArrayPr", */
    T: 1
  },
  /*::[*/
  4097: {
    /* n:"BrtEndDynamicArrayPr", */
    T: -1
  },
  /*::[*/
  5002: {
    /* n:"BrtBeginRichValueBlock", */
    T: 1
  },
  /*::[*/
  5003: {
    /* n:"BrtEndRichValueBlock", */
    T: -1
  },
  /*::[*/
  5081: {
    /* n:"BrtBeginRichFilters", */
    T: 1
  },
  /*::[*/
  5082: {
    /* n:"BrtEndRichFilters", */
    T: -1
  },
  /*::[*/
  5083: {
    /* n:"BrtRichFilter" */
  },
  /*::[*/
  5084: {
    /* n:"BrtBeginRichFilterColumn", */
    T: 1
  },
  /*::[*/
  5085: {
    /* n:"BrtEndRichFilterColumn", */
    T: -1
  },
  /*::[*/
  5086: {
    /* n:"BrtBeginCustomRichFilters", */
    T: 1
  },
  /*::[*/
  5087: {
    /* n:"BrtEndCustomRichFilters", */
    T: -1
  },
  /*::[*/
  5088: {
    /* n:"BrtCustomRichFilter" */
  },
  /*::[*/
  5089: {
    /* n:"BrtTop10RichFilter" */
  },
  /*::[*/
  5090: {
    /* n:"BrtDynamicRichFilter" */
  },
  /*::[*/
  5092: {
    /* n:"BrtBeginRichSortCondition", */
    T: 1
  },
  /*::[*/
  5093: {
    /* n:"BrtEndRichSortCondition", */
    T: -1
  },
  /*::[*/
  5094: {
    /* n:"BrtRichFilterDateGroupItem" */
  },
  /*::[*/
  5095: {
    /* n:"BrtBeginCalcFeatures", */
    T: 1
  },
  /*::[*/
  5096: {
    /* n:"BrtEndCalcFeatures", */
    T: -1
  },
  /*::[*/
  5097: {
    /* n:"BrtCalcFeature" */
  },
  /*::[*/
  5099: {
    /* n:"BrtExternalLinksPr" */
  },
  /*::[*/
  65535: {
    n: ""
  }
};
function write_biff_rec(ba, type, payload, length) {
  var t = type;
  if (isNaN(t)) return;
  var len = length || (payload || []).length || 0;
  var o = ba.next(4);
  o.write_shift(2, t);
  o.write_shift(2, len);
  if (
    /*:: len != null &&*/
    len > 0 && is_buf(payload)
  ) ba.push(payload);
}
function write_biff_continue(ba, type, payload, length) {
  var len = length || (payload || []).length || 0;
  if (len <= 8224) return write_biff_rec(ba, type, payload, len);
  var t = type;
  if (isNaN(t)) return;
  var parts = payload.parts || [], sidx = 0;
  var i = 0, w = 0;
  while (w + (parts[sidx] || 8224) <= 8224) {
    w += parts[sidx] || 8224;
    sidx++;
  }
  var o = ba.next(4);
  o.write_shift(2, t);
  o.write_shift(2, w);
  ba.push(payload.slice(i, i + w));
  i += w;
  while (i < len) {
    o = ba.next(4);
    o.write_shift(2, 60);
    w = 0;
    while (w + (parts[sidx] || 8224) <= 8224) {
      w += parts[sidx] || 8224;
      sidx++;
    }
    o.write_shift(2, w);
    ba.push(payload.slice(i, i + w));
    i += w;
  }
}
function write_BIFF2Cell(out, r, c) {
  if (!out) out = new_buf(7);
  out.write_shift(2, r);
  out.write_shift(2, c);
  out.write_shift(2, 0);
  out.write_shift(1, 0);
  return out;
}
function write_BIFF2BERR(r, c, val, t) {
  var out = new_buf(9);
  write_BIFF2Cell(out, r, c);
  write_Bes(val, t || "b", out);
  return out;
}
function write_BIFF2LABEL(r, c, val) {
  var out = new_buf(8 + 2 * val.length);
  write_BIFF2Cell(out, r, c);
  out.write_shift(1, val.length);
  out.write_shift(val.length, val, "sbcs");
  return out.l < out.length ? out.slice(0, out.l) : out;
}
function write_ws_biff2_cell(ba, cell, R, C) {
  if (cell.v != null) switch (cell.t) {
    case "d":
    case "n":
      var v = cell.t == "d" ? datenum(parseDate(cell.v)) : cell.v;
      if (v == (v | 0) && v >= 0 && v < 65536) write_biff_rec(ba, 2, write_BIFF2INT(R, C, v));
      else write_biff_rec(ba, 3, write_BIFF2NUM(R, C, v));
      return;
    case "b":
    case "e":
      write_biff_rec(ba, 5, write_BIFF2BERR(R, C, cell.v, cell.t));
      return;
    case "s":
    case "str":
      write_biff_rec(ba, 4, write_BIFF2LABEL(R, C, (cell.v || "").slice(0, 255)));
      return;
  }
  write_biff_rec(ba, 1, write_BIFF2Cell(null, R, C));
}
function write_ws_biff2(ba, ws, idx, opts) {
  var dense = Array.isArray(ws);
  var range = safe_decode_range(ws["!ref"] || "A1"), ref, rr = "", cols = [];
  if (range.e.c > 255 || range.e.r > 16383) {
    if (opts.WTF) throw new Error("Range " + (ws["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    range.e.c = Math.min(range.e.c, 255);
    range.e.r = Math.min(range.e.c, 16383);
    ref = encode_range(range);
  }
  for (var R = range.s.r; R <= range.e.r; ++R) {
    rr = encode_row(R);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      if (R === range.s.r) cols[C] = encode_col(C);
      ref = cols[C] + rr;
      var cell = dense ? (ws[R] || [])[C] : ws[ref];
      if (!cell) continue;
      write_ws_biff2_cell(ba, cell, R, C, opts);
    }
  }
}
function write_biff2_buf(wb, opts) {
  var o = opts || {};
  if (DENSE != null && o.dense == null) o.dense = DENSE;
  var ba = buf_array();
  var idx = 0;
  for (var i = 0; i < wb.SheetNames.length; ++i) if (wb.SheetNames[i] == o.sheet) idx = i;
  if (idx == 0 && !!o.sheet && wb.SheetNames[0] != o.sheet) throw new Error("Sheet not found: " + o.sheet);
  write_biff_rec(ba, o.biff == 4 ? 1033 : o.biff == 3 ? 521 : 9, write_BOF(wb, 16, o));
  write_ws_biff2(ba, wb.Sheets[wb.SheetNames[idx]], idx, o, wb);
  write_biff_rec(ba, 10);
  return ba.end();
}
function write_FONTS_biff8(ba, data, opts) {
  write_biff_rec(ba, 49, write_Font({
    sz: 12,
    color: {
      theme: 1
    },
    name: "Arial",
    family: 2,
    scheme: "minor"
  }, opts));
}
function write_FMTS_biff8(ba, NF, opts) {
  if (!NF) return;
  [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(r) {
    for (var i = r[0]; i <= r[1]; ++i) if (NF[i] != null) write_biff_rec(ba, 1054, write_Format(i, NF[i], opts));
  });
}
function write_FEAT(ba, ws) {
  var o = new_buf(19);
  o.write_shift(4, 2151);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(2, 3);
  o.write_shift(1, 1);
  o.write_shift(4, 0);
  write_biff_rec(ba, 2151, o);
  o = new_buf(39);
  o.write_shift(4, 2152);
  o.write_shift(4, 0);
  o.write_shift(4, 0);
  o.write_shift(2, 3);
  o.write_shift(1, 0);
  o.write_shift(4, 0);
  o.write_shift(2, 1);
  o.write_shift(4, 4);
  o.write_shift(2, 0);
  write_Ref8U(safe_decode_range(ws["!ref"] || "A1"), o);
  o.write_shift(4, 4);
  write_biff_rec(ba, 2152, o);
}
function write_CELLXFS_biff8(ba, opts) {
  for (var i = 0; i < 16; ++i) write_biff_rec(ba, 224, write_XF({
    numFmtId: 0,
    style: true
  }, 0, opts));
  opts.cellXfs.forEach(function(c) {
    write_biff_rec(ba, 224, write_XF(c, 0, opts));
  });
}
function write_ws_biff8_hlinks(ba, ws) {
  for (var R = 0; R < ws["!links"].length; ++R) {
    var HL = ws["!links"][R];
    write_biff_rec(ba, 440, write_HLink(HL));
    if (HL[1].Tooltip) write_biff_rec(ba, 2048, write_HLinkTooltip(HL));
  }
  delete ws["!links"];
}
function write_ws_cols_biff8(ba, cols) {
  if (!cols) return;
  var cnt = 0;
  cols.forEach(function(col, idx) {
    if (++cnt <= 256 && col) {
      write_biff_rec(ba, 125, write_ColInfo(col_obj_w(idx, col), idx));
    }
  });
}
function write_ws_biff8_cell(ba, cell, R, C, opts) {
  var os = 16 + get_cell_style(opts.cellXfs, cell, opts);
  if (cell.v == null && !cell.bf) {
    write_biff_rec(ba, 513, write_XLSCell(R, C, os));
    return;
  }
  if (cell.bf) write_biff_rec(ba, 6, write_Formula(cell, R, C, opts, os));
  else switch (cell.t) {
    case "d":
    case "n":
      var v = cell.t == "d" ? datenum(parseDate(cell.v)) : cell.v;
      write_biff_rec(ba, 515, write_Number(R, C, v, os, opts));
      break;
    case "b":
    case "e":
      write_biff_rec(ba, 517, write_BoolErr(R, C, cell.v, os, opts, cell.t));
      break;
    case "s":
    case "str":
      if (opts.bookSST) {
        var isst = get_sst_id(opts.Strings, cell.v, opts.revStrings);
        write_biff_rec(ba, 253, write_LabelSst(R, C, isst, os, opts));
      } else write_biff_rec(ba, 516, write_Label(R, C, (cell.v || "").slice(0, 255), os, opts));
      break;
    default:
      write_biff_rec(ba, 513, write_XLSCell(R, C, os));
  }
}
function write_ws_biff8(idx, opts, wb) {
  var ba = buf_array();
  var s = wb.SheetNames[idx], ws = wb.Sheets[s] || {};
  var _WB = (wb || {}).Workbook || {};
  var _sheet = (_WB.Sheets || [])[idx] || {};
  var dense = Array.isArray(ws);
  var b8 = opts.biff == 8;
  var ref, rr = "", cols = [];
  var range = safe_decode_range(ws["!ref"] || "A1");
  var MAX_ROWS = b8 ? 65536 : 16384;
  if (range.e.c > 255 || range.e.r >= MAX_ROWS) {
    if (opts.WTF) throw new Error("Range " + (ws["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    range.e.c = Math.min(range.e.c, 255);
    range.e.r = Math.min(range.e.c, MAX_ROWS - 1);
  }
  write_biff_rec(ba, 2057, write_BOF(wb, 16, opts));
  write_biff_rec(ba, 13, writeuint16(1));
  write_biff_rec(ba, 12, writeuint16(100));
  write_biff_rec(ba, 15, writebool(true));
  write_biff_rec(ba, 17, writebool(false));
  write_biff_rec(ba, 16, write_Xnum(1e-3));
  write_biff_rec(ba, 95, writebool(true));
  write_biff_rec(ba, 42, writebool(false));
  write_biff_rec(ba, 43, writebool(false));
  write_biff_rec(ba, 130, writeuint16(1));
  write_biff_rec(ba, 128, write_Guts([0, 0]));
  write_biff_rec(ba, 131, writebool(false));
  write_biff_rec(ba, 132, writebool(false));
  if (b8) write_ws_cols_biff8(ba, ws["!cols"]);
  write_biff_rec(ba, 512, write_Dimensions(range, opts));
  if (b8) ws["!links"] = [];
  for (var R = range.s.r; R <= range.e.r; ++R) {
    rr = encode_row(R);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      if (R === range.s.r) cols[C] = encode_col(C);
      ref = cols[C] + rr;
      var cell = dense ? (ws[R] || [])[C] : ws[ref];
      if (!cell) continue;
      write_ws_biff8_cell(ba, cell, R, C, opts);
      if (b8 && cell.l) ws["!links"].push([ref, cell.l]);
    }
  }
  var cname = _sheet.CodeName || _sheet.name || s;
  if (b8) write_biff_rec(ba, 574, write_Window2((_WB.Views || [])[0]));
  if (b8 && (ws["!merges"] || []).length) write_biff_rec(ba, 229, write_MergeCells(ws["!merges"]));
  if (b8) write_ws_biff8_hlinks(ba, ws);
  write_biff_rec(ba, 442, write_XLUnicodeString(cname, opts));
  if (b8) write_FEAT(ba, ws);
  write_biff_rec(
    ba,
    10
    /* EOF */
  );
  return ba.end();
}
function write_biff8_global(wb, bufs, opts) {
  var A = buf_array();
  var _WB = (wb || {}).Workbook || {};
  var _sheets = _WB.Sheets || [];
  var _wb = (
    /*::((*/
    _WB.WBProps || {
      /*::CodeName:"ThisWorkbook"*/
    }
  );
  var b8 = opts.biff == 8, b5 = opts.biff == 5;
  write_biff_rec(A, 2057, write_BOF(wb, 5, opts));
  if (opts.bookType == "xla") write_biff_rec(
    A,
    135
    /* Addin */
  );
  write_biff_rec(A, 225, b8 ? writeuint16(1200) : null);
  write_biff_rec(A, 193, writezeroes(2));
  if (b5) write_biff_rec(
    A,
    191
    /* ToolbarHdr */
  );
  if (b5) write_biff_rec(
    A,
    192
    /* ToolbarEnd */
  );
  write_biff_rec(
    A,
    226
    /* InterfaceEnd */
  );
  write_biff_rec(A, 92, write_WriteAccess("SheetJS", opts));
  write_biff_rec(A, 66, writeuint16(b8 ? 1200 : 1252));
  if (b8) write_biff_rec(A, 353, writeuint16(0));
  if (b8) write_biff_rec(
    A,
    448
    /* Excel9File */
  );
  write_biff_rec(A, 317, write_RRTabId(wb.SheetNames.length));
  if (b8 && wb.vbaraw) write_biff_rec(
    A,
    211
    /* ObProj */
  );
  if (b8 && wb.vbaraw) {
    var cname = _wb.CodeName || "ThisWorkbook";
    write_biff_rec(A, 442, write_XLUnicodeString(cname, opts));
  }
  write_biff_rec(A, 156, writeuint16(17));
  write_biff_rec(A, 25, writebool(false));
  write_biff_rec(A, 18, writebool(false));
  write_biff_rec(A, 19, writeuint16(0));
  if (b8) write_biff_rec(A, 431, writebool(false));
  if (b8) write_biff_rec(A, 444, writeuint16(0));
  write_biff_rec(A, 61, write_Window1(opts));
  write_biff_rec(A, 64, writebool(false));
  write_biff_rec(A, 141, writeuint16(0));
  write_biff_rec(A, 34, writebool(safe1904(wb) == "true"));
  write_biff_rec(A, 14, writebool(true));
  if (b8) write_biff_rec(A, 439, writebool(false));
  write_biff_rec(A, 218, writeuint16(0));
  write_FONTS_biff8(A, wb, opts);
  write_FMTS_biff8(A, wb.SSF, opts);
  write_CELLXFS_biff8(A, opts);
  if (b8) write_biff_rec(A, 352, writebool(false));
  var a = A.end();
  var C = buf_array();
  if (b8) write_biff_rec(C, 140, write_Country());
  if (b8 && opts.Strings) write_biff_continue(C, 252, write_SST(opts.Strings, opts));
  write_biff_rec(
    C,
    10
    /* EOF */
  );
  var c = C.end();
  var B = buf_array();
  var blen = 0, j = 0;
  for (j = 0; j < wb.SheetNames.length; ++j) blen += (b8 ? 12 : 11) + (b8 ? 2 : 1) * wb.SheetNames[j].length;
  var start = a.length + blen + c.length;
  for (j = 0; j < wb.SheetNames.length; ++j) {
    var _sheet = _sheets[j] || {};
    write_biff_rec(B, 133, write_BoundSheet8({
      pos: start,
      hs: _sheet.Hidden || 0,
      dt: 0,
      name: wb.SheetNames[j]
    }, opts));
    start += bufs[j].length;
  }
  var b = B.end();
  if (blen != b.length) throw new Error("BS8 " + blen + " != " + b.length);
  var out = [];
  if (a.length) out.push(a);
  if (b.length) out.push(b);
  if (c.length) out.push(c);
  return bconcat(out);
}
function write_biff8_buf(wb, opts) {
  var o = opts || {};
  var bufs = [];
  if (wb && !wb.SSF) {
    wb.SSF = dup(table_fmt);
  }
  if (wb && wb.SSF) {
    make_ssf();
    SSF_load_table(wb.SSF);
    o.revssf = evert_num(wb.SSF);
    o.revssf[wb.SSF[65535]] = 0;
    o.ssf = wb.SSF;
  }
  o.Strings = /*::((*/
  [];
  o.Strings.Count = 0;
  o.Strings.Unique = 0;
  fix_write_opts(o);
  o.cellXfs = [];
  get_cell_style(o.cellXfs, {}, {
    revssf: {
      "General": 0
    }
  });
  if (!wb.Props) wb.Props = {};
  for (var i = 0; i < wb.SheetNames.length; ++i) bufs[bufs.length] = write_ws_biff8(i, o, wb);
  bufs.unshift(write_biff8_global(wb, bufs, o));
  return bconcat(bufs);
}
function write_biff_buf(wb, opts) {
  for (var i = 0; i <= wb.SheetNames.length; ++i) {
    var ws = wb.Sheets[wb.SheetNames[i]];
    if (!ws || !ws["!ref"]) continue;
    var range = decode_range(ws["!ref"]);
    if (range.e.c > 255) {
      if (typeof console != "undefined" && console.error) console.error("Worksheet '" + wb.SheetNames[i] + "' extends beyond column IV (255).  Data may be lost.");
    }
  }
  var o = opts || {};
  switch (o.biff || 2) {
    case 8:
    case 5:
      return write_biff8_buf(wb, opts);
    case 4:
    case 3:
    case 2:
      return write_biff2_buf(wb, opts);
  }
  throw new Error("invalid type " + o.bookType + " for BIFF");
}
function make_html_row(ws, r, R, o) {
  var M = ws["!merges"] || [];
  var oo = [];
  for (var C = r.s.c; C <= r.e.c; ++C) {
    var RS = 0, CS = 0;
    for (var j = 0; j < M.length; ++j) {
      if (M[j].s.r > R || M[j].s.c > C) continue;
      if (M[j].e.r < R || M[j].e.c < C) continue;
      if (M[j].s.r < R || M[j].s.c < C) {
        RS = -1;
        break;
      }
      RS = M[j].e.r - M[j].s.r + 1;
      CS = M[j].e.c - M[j].s.c + 1;
      break;
    }
    if (RS < 0) continue;
    var coord = encode_cell({
      r: R,
      c: C
    });
    var cell = o.dense ? (ws[R] || [])[C] : ws[coord];
    var w = cell && cell.v != null && (cell.h || escapehtml(cell.w || (format_cell(cell), cell.w) || "")) || "";
    var sp = {};
    if (RS > 1) sp.rowspan = RS;
    if (CS > 1) sp.colspan = CS;
    if (o.editable) w = '<span contenteditable="true">' + w + "</span>";
    else if (cell) {
      sp["data-t"] = cell && cell.t || "z";
      if (cell.v != null) sp["data-v"] = cell.v;
      if (cell.z != null) sp["data-z"] = cell.z;
      if (cell.l && (cell.l.Target || "#").charAt(0) != "#") w = '<a href="' + cell.l.Target + '">' + w + "</a>";
    }
    sp.id = (o.id || "sjs") + "-" + coord;
    oo.push(writextag("td", w, sp));
  }
  var preamble = "<tr>";
  return preamble + oo.join("") + "</tr>";
}
var HTML_BEGIN = '<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body>';
var HTML_END = "</body></html>";
function make_html_preamble(ws, R, o) {
  var out = [];
  return out.join("") + "<table" + (o && o.id ? ' id="' + o.id + '"' : "") + ">";
}
function sheet_to_html(ws, opts) {
  var o = opts || {};
  var header = o.header != null ? o.header : HTML_BEGIN;
  var footer = o.footer != null ? o.footer : HTML_END;
  var out = [header];
  var r = decode_range(ws["!ref"]);
  o.dense = Array.isArray(ws);
  out.push(make_html_preamble(ws, r, o));
  for (var R = r.s.r; R <= r.e.r; ++R) out.push(make_html_row(ws, r, R, o));
  out.push("</table>" + footer);
  return out.join("");
}
function sheet_add_dom(ws, table, _opts) {
  var opts = _opts || {};
  if (DENSE != null) opts.dense = DENSE;
  var or_R = 0, or_C = 0;
  if (opts.origin != null) {
    if (typeof opts.origin == "number") or_R = opts.origin;
    else {
      var _origin = typeof opts.origin == "string" ? decode_cell(opts.origin) : opts.origin;
      or_R = _origin.r;
      or_C = _origin.c;
    }
  }
  var rows = table.getElementsByTagName("tr");
  var sheetRows = Math.min(opts.sheetRows || 1e7, rows.length);
  var range = {
    s: {
      r: 0,
      c: 0
    },
    e: {
      r: or_R,
      c: or_C
    }
  };
  if (ws["!ref"]) {
    var _range = decode_range(ws["!ref"]);
    range.s.r = Math.min(range.s.r, _range.s.r);
    range.s.c = Math.min(range.s.c, _range.s.c);
    range.e.r = Math.max(range.e.r, _range.e.r);
    range.e.c = Math.max(range.e.c, _range.e.c);
    if (or_R == -1) range.e.r = or_R = _range.e.r + 1;
  }
  var merges = [], midx = 0;
  var rowinfo = ws["!rows"] || (ws["!rows"] = []);
  var _R = 0, R = 0, _C = 0, C = 0, RS = 0, CS = 0;
  if (!ws["!cols"]) ws["!cols"] = [];
  for (; _R < rows.length && R < sheetRows; ++_R) {
    var row = rows[_R];
    if (is_dom_element_hidden(row)) {
      if (opts.display) continue;
      rowinfo[R] = {
        hidden: true
      };
    }
    var elts = row.children;
    for (_C = C = 0; _C < elts.length; ++_C) {
      var elt = elts[_C];
      if (opts.display && is_dom_element_hidden(elt)) continue;
      var v = elt.hasAttribute("data-v") ? elt.getAttribute("data-v") : elt.hasAttribute("v") ? elt.getAttribute("v") : htmldecode(elt.innerHTML);
      var z = elt.getAttribute("data-z") || elt.getAttribute("z");
      for (midx = 0; midx < merges.length; ++midx) {
        var m = merges[midx];
        if (m.s.c == C + or_C && m.s.r < R + or_R && R + or_R <= m.e.r) {
          C = m.e.c + 1 - or_C;
          midx = -1;
        }
      }
      CS = +elt.getAttribute("colspan") || 1;
      if ((RS = +elt.getAttribute("rowspan") || 1) > 1 || CS > 1) merges.push({
        s: {
          r: R + or_R,
          c: C + or_C
        },
        e: {
          r: R + or_R + (RS || 1) - 1,
          c: C + or_C + (CS || 1) - 1
        }
      });
      var o = {
        t: "s",
        v
      };
      var _t = elt.getAttribute("data-t") || elt.getAttribute("t") || "";
      if (v != null) {
        if (v.length == 0) o.t = _t || "z";
        else if (opts.raw || v.trim().length == 0 || _t == "s") {
        } else if (v === "TRUE") o = {
          t: "b",
          v: true
        };
        else if (v === "FALSE") o = {
          t: "b",
          v: false
        };
        else if (!isNaN(fuzzynum(v))) o = {
          t: "n",
          v: fuzzynum(v)
        };
        else if (!isNaN(fuzzydate(v).getDate())) {
          o = {
            t: "d",
            v: parseDate(v)
          };
          if (!opts.cellDates) o = {
            t: "n",
            v: datenum(o.v)
          };
          o.z = opts.dateNF || table_fmt[14];
        }
      }
      if (o.z === void 0 && z != null) o.z = z;
      var l = "", Aelts = elt.getElementsByTagName("A");
      if (Aelts && Aelts.length) {
        for (var Aelti = 0; Aelti < Aelts.length; ++Aelti) if (Aelts[Aelti].hasAttribute("href")) {
          l = Aelts[Aelti].getAttribute("href");
          if (l.charAt(0) != "#") break;
        }
      }
      if (l && l.charAt(0) != "#") o.l = {
        Target: l
      };
      if (opts.dense) {
        if (!ws[R + or_R]) ws[R + or_R] = [];
        ws[R + or_R][C + or_C] = o;
      } else ws[encode_cell({
        c: C + or_C,
        r: R + or_R
      })] = o;
      if (range.e.c < C + or_C) range.e.c = C + or_C;
      C += CS;
    }
    ++R;
  }
  if (merges.length) ws["!merges"] = (ws["!merges"] || []).concat(merges);
  range.e.r = Math.max(range.e.r, R - 1 + or_R);
  ws["!ref"] = encode_range(range);
  if (R >= sheetRows) ws["!fullref"] = encode_range((range.e.r = rows.length - _R + R - 1 + or_R, range));
  return ws;
}
function parse_dom_table(table, _opts) {
  var opts = _opts || {};
  var ws = opts.dense ? [] : {};
  return sheet_add_dom(ws, table, _opts);
}
function table_to_book(table, opts) {
  return sheet_to_workbook(parse_dom_table(table, opts), opts);
}
function is_dom_element_hidden(element) {
  var display = "";
  var get_computed_style = get_get_computed_style_function(element);
  if (get_computed_style) display = get_computed_style(element).getPropertyValue("display");
  if (!display) display = element.style && element.style.display;
  return display === "none";
}
function get_get_computed_style_function(element) {
  if (element.ownerDocument.defaultView && typeof element.ownerDocument.defaultView.getComputedStyle === "function") return element.ownerDocument.defaultView.getComputedStyle;
  if (typeof getComputedStyle === "function") return getComputedStyle;
  return null;
}
var write_styles_ods = /* @__PURE__ */ function() {
  var master_styles = ["<office:master-styles>", '<style:master-page style:name="mp1" style:page-layout-name="mp1">', "<style:header/>", '<style:header-left style:display="false"/>', "<style:footer/>", '<style:footer-left style:display="false"/>', "</style:master-page>", "</office:master-styles>"].join("");
  var payload = "<office:document-styles " + wxt_helper({
    "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
    "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
    "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
    "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
    "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "xmlns:dc": "http://purl.org/dc/elements/1.1/",
    "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
    "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
    "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
    "office:version": "1.2"
  }) + ">" + master_styles + "</office:document-styles>";
  return function wso() {
    return XML_HEADER + payload;
  };
}();
var write_content_ods = /* @__PURE__ */ function() {
  var write_text_p = function(text) {
    return escapexml(text).replace(/  +/g, function($$) {
      return '<text:s text:c="' + $$.length + '"/>';
    }).replace(/\t/g, "<text:tab/>").replace(/\n/g, "</text:p><text:p>").replace(/^ /, "<text:s/>").replace(/ $/, "<text:s/>");
  };
  var null_cell_xml = "          <table:table-cell />\n";
  var covered_cell_xml = "          <table:covered-table-cell/>\n";
  var write_ws2 = function(ws, wb, i) {
    var o = [];
    o.push('      <table:table table:name="' + escapexml(wb.SheetNames[i]) + '" table:style-name="ta1">\n');
    var R = 0, C = 0, range = decode_range(ws["!ref"] || "A1");
    var marr = ws["!merges"] || [], mi = 0;
    var dense = Array.isArray(ws);
    if (ws["!cols"]) {
      for (C = 0; C <= range.e.c; ++C) o.push("        <table:table-column" + (ws["!cols"][C] ? ' table:style-name="co' + ws["!cols"][C].ods + '"' : "") + "></table:table-column>\n");
    }
    var H = "", ROWS = ws["!rows"] || [];
    for (R = 0; R < range.s.r; ++R) {
      H = ROWS[R] ? ' table:style-name="ro' + ROWS[R].ods + '"' : "";
      o.push("        <table:table-row" + H + "></table:table-row>\n");
    }
    for (; R <= range.e.r; ++R) {
      H = ROWS[R] ? ' table:style-name="ro' + ROWS[R].ods + '"' : "";
      o.push("        <table:table-row" + H + ">\n");
      for (C = 0; C < range.s.c; ++C) o.push(null_cell_xml);
      for (; C <= range.e.c; ++C) {
        var skip = false, ct = {}, textp = "";
        for (mi = 0; mi != marr.length; ++mi) {
          if (marr[mi].s.c > C) continue;
          if (marr[mi].s.r > R) continue;
          if (marr[mi].e.c < C) continue;
          if (marr[mi].e.r < R) continue;
          if (marr[mi].s.c != C || marr[mi].s.r != R) skip = true;
          ct["table:number-columns-spanned"] = marr[mi].e.c - marr[mi].s.c + 1;
          ct["table:number-rows-spanned"] = marr[mi].e.r - marr[mi].s.r + 1;
          break;
        }
        if (skip) {
          o.push(covered_cell_xml);
          continue;
        }
        var ref = encode_cell({
          r: R,
          c: C
        }), cell = dense ? (ws[R] || [])[C] : ws[ref];
        if (cell && cell.f) {
          ct["table:formula"] = escapexml(csf_to_ods_formula(cell.f));
          if (cell.F) {
            if (cell.F.slice(0, ref.length) == ref) {
              var _Fref = decode_range(cell.F);
              ct["table:number-matrix-columns-spanned"] = _Fref.e.c - _Fref.s.c + 1;
              ct["table:number-matrix-rows-spanned"] = _Fref.e.r - _Fref.s.r + 1;
            }
          }
        }
        if (!cell) {
          o.push(null_cell_xml);
          continue;
        }
        switch (cell.t) {
          case "b":
            textp = cell.v ? "TRUE" : "FALSE";
            ct["office:value-type"] = "boolean";
            ct["office:boolean-value"] = cell.v ? "true" : "false";
            break;
          case "n":
            textp = cell.w || String(cell.v || 0);
            ct["office:value-type"] = "float";
            ct["office:value"] = cell.v || 0;
            break;
          case "s":
          case "str":
            textp = cell.v == null ? "" : cell.v;
            ct["office:value-type"] = "string";
            break;
          case "d":
            textp = cell.w || parseDate(cell.v).toISOString();
            ct["office:value-type"] = "date";
            ct["office:date-value"] = parseDate(cell.v).toISOString();
            ct["table:style-name"] = "ce1";
            break;
          default:
            o.push(null_cell_xml);
            continue;
        }
        var text_p = write_text_p(textp);
        if (cell.l && cell.l.Target) {
          var _tgt = cell.l.Target;
          _tgt = _tgt.charAt(0) == "#" ? "#" + csf_to_ods_3D(_tgt.slice(1)) : _tgt;
          if (_tgt.charAt(0) != "#" && !_tgt.match(/^\w+:/)) _tgt = "../" + _tgt;
          text_p = writextag("text:a", text_p, {
            "xlink:href": _tgt.replace(/&/g, "&amp;")
          });
        }
        o.push("          " + writextag("table:table-cell", writextag("text:p", text_p, {}), ct) + "\n");
      }
      o.push("        </table:table-row>\n");
    }
    o.push("      </table:table>\n");
    return o.join("");
  };
  var write_automatic_styles_ods = function(o, wb) {
    o.push(" <office:automatic-styles>\n");
    o.push('  <number:date-style style:name="N37" number:automatic-order="true">\n');
    o.push('   <number:month number:style="long"/>\n');
    o.push("   <number:text>/</number:text>\n");
    o.push('   <number:day number:style="long"/>\n');
    o.push("   <number:text>/</number:text>\n");
    o.push("   <number:year/>\n");
    o.push("  </number:date-style>\n");
    var cidx = 0;
    wb.SheetNames.map(function(n) {
      return wb.Sheets[n];
    }).forEach(function(ws) {
      if (!ws) return;
      if (ws["!cols"]) {
        for (var C = 0; C < ws["!cols"].length; ++C) if (ws["!cols"][C]) {
          var colobj = ws["!cols"][C];
          if (colobj.width == null && colobj.wpx == null && colobj.wch == null) continue;
          process_col(colobj);
          colobj.ods = cidx;
          var w = ws["!cols"][C].wpx + "px";
          o.push('  <style:style style:name="co' + cidx + '" style:family="table-column">\n');
          o.push('   <style:table-column-properties fo:break-before="auto" style:column-width="' + w + '"/>\n');
          o.push("  </style:style>\n");
          ++cidx;
        }
      }
    });
    var ridx = 0;
    wb.SheetNames.map(function(n) {
      return wb.Sheets[n];
    }).forEach(function(ws) {
      if (!ws) return;
      if (ws["!rows"]) {
        for (var R = 0; R < ws["!rows"].length; ++R) if (ws["!rows"][R]) {
          ws["!rows"][R].ods = ridx;
          var h = ws["!rows"][R].hpx + "px";
          o.push('  <style:style style:name="ro' + ridx + '" style:family="table-row">\n');
          o.push('   <style:table-row-properties fo:break-before="auto" style:row-height="' + h + '"/>\n');
          o.push("  </style:style>\n");
          ++ridx;
        }
      }
    });
    o.push('  <style:style style:name="ta1" style:family="table" style:master-page-name="mp1">\n');
    o.push('   <style:table-properties table:display="true" style:writing-mode="lr-tb"/>\n');
    o.push("  </style:style>\n");
    o.push('  <style:style style:name="ce1" style:family="table-cell" style:parent-style-name="Default" style:data-style-name="N37"/>\n');
    o.push(" </office:automatic-styles>\n");
  };
  return function wcx(wb, opts) {
    var o = [XML_HEADER];
    var attr = wxt_helper({
      "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
      "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
      "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
      "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
      "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
      "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
      "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
      "xmlns:presentation": "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
      "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
      "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
      "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
      "xmlns:math": "http://www.w3.org/1998/Math/MathML",
      "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
      "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
      "xmlns:ooo": "http://openoffice.org/2004/office",
      "xmlns:ooow": "http://openoffice.org/2004/writer",
      "xmlns:oooc": "http://openoffice.org/2004/calc",
      "xmlns:dom": "http://www.w3.org/2001/xml-events",
      "xmlns:xforms": "http://www.w3.org/2002/xforms",
      "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
      "xmlns:rpt": "http://openoffice.org/2005/report",
      "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
      "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
      "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
      "xmlns:tableooo": "http://openoffice.org/2009/table",
      "xmlns:drawooo": "http://openoffice.org/2010/draw",
      "xmlns:calcext": "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
      "xmlns:loext": "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
      "xmlns:field": "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
      "xmlns:formx": "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
      "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
      "office:version": "1.2"
    });
    var fods = wxt_helper({
      "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
      "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet"
    });
    if (opts.bookType == "fods") {
      o.push("<office:document" + attr + fods + ">\n");
      o.push(write_meta_ods().replace(/office:document-meta/g, "office:meta"));
    } else o.push("<office:document-content" + attr + ">\n");
    write_automatic_styles_ods(o, wb);
    o.push("  <office:body>\n");
    o.push("    <office:spreadsheet>\n");
    for (var i = 0; i != wb.SheetNames.length; ++i) o.push(write_ws2(wb.Sheets[wb.SheetNames[i]], wb, i, opts));
    o.push("    </office:spreadsheet>\n");
    o.push("  </office:body>\n");
    if (opts.bookType == "fods") o.push("</office:document>");
    else o.push("</office:document-content>");
    return o.join("");
  };
}();
function write_ods(wb, opts) {
  if (opts.bookType == "fods") return write_content_ods(wb, opts);
  var zip = zip_new();
  var f = "";
  var manifest = [];
  var rdf = [];
  f = "mimetype";
  zip_add_file(zip, f, "application/vnd.oasis.opendocument.spreadsheet");
  f = "content.xml";
  zip_add_file(zip, f, write_content_ods(wb, opts));
  manifest.push([f, "text/xml"]);
  rdf.push([f, "ContentFile"]);
  f = "styles.xml";
  zip_add_file(zip, f, write_styles_ods(wb, opts));
  manifest.push([f, "text/xml"]);
  rdf.push([f, "StylesFile"]);
  f = "meta.xml";
  zip_add_file(zip, f, XML_HEADER + write_meta_ods(
    /*::wb, opts*/
  ));
  manifest.push([f, "text/xml"]);
  rdf.push([f, "MetadataFile"]);
  f = "manifest.rdf";
  zip_add_file(zip, f, write_rdf(
    rdf
    /*, opts*/
  ));
  manifest.push([f, "application/rdf+xml"]);
  f = "META-INF/manifest.xml";
  zip_add_file(zip, f, write_manifest(
    manifest
    /*, opts*/
  ));
  return zip;
}
function u8_to_dataview(array) {
  return new DataView(array.buffer, array.byteOffset, array.byteLength);
}
function stru8(str) {
  return typeof TextEncoder != "undefined" ? new TextEncoder().encode(str) : s2a(utf8write(str));
}
function u8contains(body, search) {
  outer: for (var L = 0; L <= body.length - search.length; ++L) {
    for (var j = 0; j < search.length; ++j) if (body[L + j] != search[j]) continue outer;
    return true;
  }
  return false;
}
function u8concat(u8a) {
  var len = u8a.reduce(function(acc, x) {
    return acc + x.length;
  }, 0);
  var out = new Uint8Array(len);
  var off = 0;
  u8a.forEach(function(u8) {
    out.set(u8, off);
    off += u8.length;
  });
  return out;
}
function writeDecimal128LE(buf, offset, value) {
  var exp = Math.floor(value == 0 ? 0 : Math.LOG10E * Math.log(Math.abs(value))) + 6176 - 20;
  var mantissa = value / Math.pow(10, exp - 6176);
  buf[offset + 15] |= exp >> 7;
  buf[offset + 14] |= (exp & 127) << 1;
  for (var i = 0; mantissa >= 1; ++i, mantissa /= 256) buf[offset + i] = mantissa & 255;
  buf[offset + 15] |= value >= 0 ? 0 : 128;
}
function parse_varint49(buf, ptr) {
  var l = ptr ? ptr[0] : 0;
  var usz = buf[l] & 127;
  varint: if (buf[l++] >= 128) {
    usz |= (buf[l] & 127) << 7;
    if (buf[l++] < 128) break varint;
    usz |= (buf[l] & 127) << 14;
    if (buf[l++] < 128) break varint;
    usz |= (buf[l] & 127) << 21;
    if (buf[l++] < 128) break varint;
    usz += (buf[l] & 127) * Math.pow(2, 28);
    ++l;
    if (buf[l++] < 128) break varint;
    usz += (buf[l] & 127) * Math.pow(2, 35);
    ++l;
    if (buf[l++] < 128) break varint;
    usz += (buf[l] & 127) * Math.pow(2, 42);
    ++l;
    if (buf[l++] < 128) break varint;
  }
  if (ptr) ptr[0] = l;
  return usz;
}
function write_varint49(v) {
  var usz = new Uint8Array(7);
  usz[0] = v & 127;
  var L = 1;
  sz: if (v > 127) {
    usz[L - 1] |= 128;
    usz[L] = v >> 7 & 127;
    ++L;
    if (v <= 16383) break sz;
    usz[L - 1] |= 128;
    usz[L] = v >> 14 & 127;
    ++L;
    if (v <= 2097151) break sz;
    usz[L - 1] |= 128;
    usz[L] = v >> 21 & 127;
    ++L;
    if (v <= 268435455) break sz;
    usz[L - 1] |= 128;
    usz[L] = v / 256 >>> 21 & 127;
    ++L;
    if (v <= 34359738367) break sz;
    usz[L - 1] |= 128;
    usz[L] = v / 65536 >>> 21 & 127;
    ++L;
    if (v <= 4398046511103) break sz;
    usz[L - 1] |= 128;
    usz[L] = v / 16777216 >>> 21 & 127;
    ++L;
  }
  return usz.slice(0, L);
}
function varint_to_i32(buf) {
  var l = 0, i32 = buf[l] & 127;
  varint: if (buf[l++] >= 128) {
    i32 |= (buf[l] & 127) << 7;
    if (buf[l++] < 128) break varint;
    i32 |= (buf[l] & 127) << 14;
    if (buf[l++] < 128) break varint;
    i32 |= (buf[l] & 127) << 21;
    if (buf[l++] < 128) break varint;
    i32 |= (buf[l] & 127) << 28;
  }
  return i32;
}
function parse_shallow(buf) {
  var out = [], ptr = [0];
  while (ptr[0] < buf.length) {
    var off = ptr[0];
    var num = parse_varint49(buf, ptr);
    var type = num & 7;
    num = Math.floor(num / 8);
    var len = 0;
    var res;
    if (num == 0) break;
    switch (type) {
      case 0:
        {
          var l = ptr[0];
          while (buf[ptr[0]++] >= 128) ;
          res = buf.slice(l, ptr[0]);
        }
        break;
      case 5:
        len = 4;
        res = buf.slice(ptr[0], ptr[0] + len);
        ptr[0] += len;
        break;
      case 1:
        len = 8;
        res = buf.slice(ptr[0], ptr[0] + len);
        ptr[0] += len;
        break;
      case 2:
        len = parse_varint49(buf, ptr);
        res = buf.slice(ptr[0], ptr[0] + len);
        ptr[0] += len;
        break;
      case 3:
      case 4:
      default:
        throw new Error("PB Type ".concat(type, " for Field ").concat(num, " at offset ").concat(off));
    }
    var v = {
      data: res,
      type
    };
    if (out[num] == null) out[num] = [v];
    else out[num].push(v);
  }
  return out;
}
function write_shallow(proto) {
  var out = [];
  proto.forEach(function(field, idx) {
    field.forEach(function(item) {
      if (!item.data) return;
      out.push(write_varint49(idx * 8 + item.type));
      if (item.type == 2) out.push(write_varint49(item.data.length));
      out.push(item.data);
    });
  });
  return u8concat(out);
}
function parse_iwa_file(buf) {
  var _a;
  var out = [], ptr = [0];
  while (ptr[0] < buf.length) {
    var len = parse_varint49(buf, ptr);
    var ai = parse_shallow(buf.slice(ptr[0], ptr[0] + len));
    ptr[0] += len;
    var res = {
      id: varint_to_i32(ai[1][0].data),
      messages: []
    };
    ai[2].forEach(function(b) {
      var mi = parse_shallow(b.data);
      var fl = varint_to_i32(mi[3][0].data);
      res.messages.push({
        meta: mi,
        data: buf.slice(ptr[0], ptr[0] + fl)
      });
      ptr[0] += fl;
    });
    if ((_a = ai[3]) == null ? void 0 : _a[0]) res.merge = varint_to_i32(ai[3][0].data) >>> 0 > 0;
    out.push(res);
  }
  return out;
}
function write_iwa_file(ias) {
  var bufs = [];
  ias.forEach(function(ia) {
    var ai = [];
    ai[1] = [{
      data: write_varint49(ia.id),
      type: 0
    }];
    ai[2] = [];
    if (ia.merge != null) ai[3] = [{
      data: write_varint49(+!!ia.merge),
      type: 0
    }];
    var midata = [];
    ia.messages.forEach(function(mi) {
      midata.push(mi.data);
      mi.meta[3] = [{
        type: 0,
        data: write_varint49(mi.data.length)
      }];
      ai[2].push({
        data: write_shallow(mi.meta),
        type: 2
      });
    });
    var aipayload = write_shallow(ai);
    bufs.push(write_varint49(aipayload.length));
    bufs.push(aipayload);
    midata.forEach(function(mid) {
      return bufs.push(mid);
    });
  });
  return u8concat(bufs);
}
function parse_snappy_chunk(type, buf) {
  if (type != 0) throw new Error("Unexpected Snappy chunk type ".concat(type));
  var ptr = [0];
  var usz = parse_varint49(buf, ptr);
  var chunks = [];
  while (ptr[0] < buf.length) {
    var tag2 = buf[ptr[0]] & 3;
    if (tag2 == 0) {
      var len = buf[ptr[0]++] >> 2;
      if (len < 60) ++len;
      else {
        var c = len - 59;
        len = buf[ptr[0]];
        if (c > 1) len |= buf[ptr[0] + 1] << 8;
        if (c > 2) len |= buf[ptr[0] + 2] << 16;
        if (c > 3) len |= buf[ptr[0] + 3] << 24;
        len >>>= 0;
        len++;
        ptr[0] += c;
      }
      chunks.push(buf.slice(ptr[0], ptr[0] + len));
      ptr[0] += len;
      continue;
    } else {
      var offset = 0, length = 0;
      if (tag2 == 1) {
        length = (buf[ptr[0]] >> 2 & 7) + 4;
        offset = (buf[ptr[0]++] & 224) << 3;
        offset |= buf[ptr[0]++];
      } else {
        length = (buf[ptr[0]++] >> 2) + 1;
        if (tag2 == 2) {
          offset = buf[ptr[0]] | buf[ptr[0] + 1] << 8;
          ptr[0] += 2;
        } else {
          offset = (buf[ptr[0]] | buf[ptr[0] + 1] << 8 | buf[ptr[0] + 2] << 16 | buf[ptr[0] + 3] << 24) >>> 0;
          ptr[0] += 4;
        }
      }
      chunks = [u8concat(chunks)];
      if (offset == 0) throw new Error("Invalid offset 0");
      if (offset > chunks[0].length) throw new Error("Invalid offset beyond length");
      if (length >= offset) {
        chunks.push(chunks[0].slice(-offset));
        length -= offset;
        while (length >= chunks[chunks.length - 1].length) {
          chunks.push(chunks[chunks.length - 1]);
          length -= chunks[chunks.length - 1].length;
        }
      }
      chunks.push(chunks[0].slice(-offset, -offset + length));
    }
  }
  var o = u8concat(chunks);
  if (o.length != usz) throw new Error("Unexpected length: ".concat(o.length, " != ").concat(usz));
  return o;
}
function decompress_iwa_file(buf) {
  var out = [];
  var l = 0;
  while (l < buf.length) {
    var t = buf[l++];
    var len = buf[l] | buf[l + 1] << 8 | buf[l + 2] << 16;
    l += 3;
    out.push(parse_snappy_chunk(t, buf.slice(l, l + len)));
    l += len;
  }
  if (l !== buf.length) throw new Error("data is not a valid framed stream!");
  return u8concat(out);
}
function compress_iwa_file(buf) {
  var out = [];
  var l = 0;
  while (l < buf.length) {
    var c = Math.min(buf.length - l, 268435455);
    var frame = new Uint8Array(4);
    out.push(frame);
    var usz = write_varint49(c);
    var L = usz.length;
    out.push(usz);
    if (c <= 60) {
      L++;
      out.push(new Uint8Array([c - 1 << 2]));
    } else if (c <= 256) {
      L += 2;
      out.push(new Uint8Array([240, c - 1 & 255]));
    } else if (c <= 65536) {
      L += 3;
      out.push(new Uint8Array([244, c - 1 & 255, c - 1 >> 8 & 255]));
    } else if (c <= 16777216) {
      L += 4;
      out.push(new Uint8Array([248, c - 1 & 255, c - 1 >> 8 & 255, c - 1 >> 16 & 255]));
    } else if (c <= 4294967296) {
      L += 5;
      out.push(new Uint8Array([252, c - 1 & 255, c - 1 >> 8 & 255, c - 1 >> 16 & 255, c - 1 >>> 24 & 255]));
    }
    out.push(buf.slice(l, l + c));
    L += c;
    frame[0] = 0;
    frame[1] = L & 255;
    frame[2] = L >> 8 & 255;
    frame[3] = L >> 16 & 255;
    l += c;
  }
  return u8concat(out);
}
function write_new_storage(cell, sst) {
  var out = new Uint8Array(32), dv = u8_to_dataview(out), l = 12, flags = 0;
  out[0] = 5;
  switch (cell.t) {
    case "n":
      out[1] = 2;
      writeDecimal128LE(out, l, cell.v);
      flags |= 1;
      l += 16;
      break;
    case "b":
      out[1] = 6;
      dv.setFloat64(l, cell.v ? 1 : 0, true);
      flags |= 2;
      l += 8;
      break;
    case "s":
      if (sst.indexOf(cell.v) == -1) throw new Error("Value ".concat(cell.v, " missing from SST!"));
      out[1] = 3;
      dv.setUint32(l, sst.indexOf(cell.v), true);
      flags |= 8;
      l += 4;
      break;
    default:
      throw "unsupported cell type " + cell.t;
  }
  dv.setUint32(8, flags, true);
  return out.slice(0, l);
}
function write_old_storage(cell, sst) {
  var out = new Uint8Array(32), dv = u8_to_dataview(out), l = 12, flags = 0;
  out[0] = 3;
  switch (cell.t) {
    case "n":
      out[2] = 2;
      dv.setFloat64(l, cell.v, true);
      flags |= 32;
      l += 8;
      break;
    case "b":
      out[2] = 6;
      dv.setFloat64(l, cell.v ? 1 : 0, true);
      flags |= 32;
      l += 8;
      break;
    case "s":
      if (sst.indexOf(cell.v) == -1) throw new Error("Value ".concat(cell.v, " missing from SST!"));
      out[2] = 3;
      dv.setUint32(l, sst.indexOf(cell.v), true);
      flags |= 16;
      l += 4;
      break;
    default:
      throw "unsupported cell type " + cell.t;
  }
  dv.setUint32(4, flags, true);
  return out.slice(0, l);
}
function parse_TSP_Reference(buf) {
  var pb = parse_shallow(buf);
  return parse_varint49(pb[1][0].data);
}
function write_tile_row(tri, data, SST) {
  var _a, _b, _c, _d;
  if (!((_a = tri[6]) == null ? void 0 : _a[0]) || !((_b = tri[7]) == null ? void 0 : _b[0])) throw "Mutation only works on post-BNC storages!";
  var wide_offsets = ((_d = (_c = tri[8]) == null ? void 0 : _c[0]) == null ? void 0 : _d.data) && varint_to_i32(tri[8][0].data) > 0 || false;
  if (wide_offsets) throw "Math only works with normal offsets";
  var cnt = 0;
  var dv = u8_to_dataview(tri[7][0].data), last_offset = 0, cell_storage = [];
  var _dv = u8_to_dataview(tri[4][0].data), _last_offset = 0, _cell_storage = [];
  for (var C = 0; C < data.length; ++C) {
    if (data[C] == null) {
      dv.setUint16(C * 2, 65535, true);
      _dv.setUint16(C * 2, 65535);
      continue;
    }
    dv.setUint16(C * 2, last_offset, true);
    _dv.setUint16(C * 2, _last_offset, true);
    var celload, _celload;
    switch (typeof data[C]) {
      case "string":
        celload = write_new_storage({
          t: "s",
          v: data[C]
        }, SST);
        _celload = write_old_storage({
          t: "s",
          v: data[C]
        }, SST);
        break;
      case "number":
        celload = write_new_storage({
          t: "n",
          v: data[C]
        }, SST);
        _celload = write_old_storage({
          t: "n",
          v: data[C]
        }, SST);
        break;
      case "boolean":
        celload = write_new_storage({
          t: "b",
          v: data[C]
        }, SST);
        _celload = write_old_storage({
          t: "b",
          v: data[C]
        }, SST);
        break;
      default:
        throw new Error("Unsupported value " + data[C]);
    }
    cell_storage.push(celload);
    last_offset += celload.length;
    _cell_storage.push(_celload);
    _last_offset += _celload.length;
    ++cnt;
  }
  tri[2][0].data = write_varint49(cnt);
  for (; C < tri[7][0].data.length / 2; ++C) {
    dv.setUint16(C * 2, 65535, true);
    _dv.setUint16(C * 2, 65535, true);
  }
  tri[6][0].data = u8concat(cell_storage);
  tri[3][0].data = u8concat(_cell_storage);
  return cnt;
}
function write_numbers_iwa(wb, opts) {
  if (!opts || !opts.numbers) throw new Error("Must pass a `numbers` option -- check the README");
  var ws = wb.Sheets[wb.SheetNames[0]];
  if (wb.SheetNames.length > 1) console.error("The Numbers writer currently writes only the first table");
  var range = decode_range(ws["!ref"]);
  range.s.r = range.s.c = 0;
  var trunc = false;
  if (range.e.c > 9) {
    trunc = true;
    range.e.c = 9;
  }
  if (range.e.r > 49) {
    trunc = true;
    range.e.r = 49;
  }
  if (trunc) console.error("The Numbers writer is currently limited to ".concat(encode_range(range)));
  var data = sheet_to_json(ws, {
    range,
    header: 1
  });
  var SST = ["~Sh33tJ5~"];
  data.forEach(function(row) {
    return row.forEach(function(cell) {
      if (typeof cell == "string") SST.push(cell);
    });
  });
  var dependents = {};
  var indices = [];
  var cfb = CFB.read(opts.numbers, {
    type: "base64"
  });
  cfb.FileIndex.map(function(fi, idx) {
    return [fi, cfb.FullPaths[idx]];
  }).forEach(function(row) {
    var fi = row[0], fp = row[1];
    if (fi.type != 2) return;
    if (!fi.name.match(/\.iwa/)) return;
    var old_content = fi.content;
    var raw1 = decompress_iwa_file(old_content);
    var x2 = parse_iwa_file(raw1);
    x2.forEach(function(packet2) {
      indices.push(packet2.id);
      dependents[packet2.id] = {
        deps: [],
        location: fp,
        type: varint_to_i32(packet2.messages[0].meta[1][0].data)
      };
    });
  });
  indices.sort(function(x2, y2) {
    return x2 - y2;
  });
  var indices_varint = indices.filter(function(x2) {
    return x2 > 1;
  }).map(function(x2) {
    return [x2, write_varint49(x2)];
  });
  cfb.FileIndex.map(function(fi, idx) {
    return [fi, cfb.FullPaths[idx]];
  }).forEach(function(row) {
    var fi = row[0], fp = row[1];
    if (!fi.name.match(/\.iwa/)) return;
    var x2 = parse_iwa_file(decompress_iwa_file(fi.content));
    x2.forEach(function(ia) {
      ia.messages.forEach(function(m) {
        indices_varint.forEach(function(ivi) {
          if (ia.messages.some(function(mess) {
            return varint_to_i32(mess.meta[1][0].data) != 11006 && u8contains(mess.data, ivi[1]);
          })) {
            dependents[ivi[0]].deps.push(ia.id);
          }
        });
      });
    });
  });
  function get_unique_msgid() {
    for (var i = 927262; i < 2e6; ++i) if (!dependents[i]) return i;
    throw new Error("Too many messages");
  }
  var entry = CFB.find(cfb, dependents[1].location);
  var x = parse_iwa_file(decompress_iwa_file(entry.content));
  var docroot;
  for (var xi = 0; xi < x.length; ++xi) {
    var packet = x[xi];
    if (packet.id == 1) docroot = packet;
  }
  var sheetrootref = parse_TSP_Reference(parse_shallow(docroot.messages[0].data)[1][0].data);
  entry = CFB.find(cfb, dependents[sheetrootref].location);
  x = parse_iwa_file(decompress_iwa_file(entry.content));
  for (xi = 0; xi < x.length; ++xi) {
    packet = x[xi];
    if (packet.id == sheetrootref) docroot = packet;
  }
  sheetrootref = parse_TSP_Reference(parse_shallow(docroot.messages[0].data)[2][0].data);
  entry = CFB.find(cfb, dependents[sheetrootref].location);
  x = parse_iwa_file(decompress_iwa_file(entry.content));
  for (xi = 0; xi < x.length; ++xi) {
    packet = x[xi];
    if (packet.id == sheetrootref) docroot = packet;
  }
  sheetrootref = parse_TSP_Reference(parse_shallow(docroot.messages[0].data)[2][0].data);
  entry = CFB.find(cfb, dependents[sheetrootref].location);
  x = parse_iwa_file(decompress_iwa_file(entry.content));
  for (xi = 0; xi < x.length; ++xi) {
    packet = x[xi];
    if (packet.id == sheetrootref) docroot = packet;
  }
  var pb = parse_shallow(docroot.messages[0].data);
  {
    pb[6][0].data = write_varint49(range.e.r + 1);
    pb[7][0].data = write_varint49(range.e.c + 1);
    var cruidsref = parse_TSP_Reference(pb[46][0].data);
    var oldbucket = CFB.find(cfb, dependents[cruidsref].location);
    var _x = parse_iwa_file(decompress_iwa_file(oldbucket.content));
    {
      for (var j = 0; j < _x.length; ++j) {
        if (_x[j].id == cruidsref) break;
      }
      if (_x[j].id != cruidsref) throw "Bad ColumnRowUIDMapArchive";
      var cruids = parse_shallow(_x[j].messages[0].data);
      cruids[1] = [];
      cruids[2] = [], cruids[3] = [];
      for (var C = 0; C <= range.e.c; ++C) {
        var uuid = [];
        uuid[1] = uuid[2] = [{
          type: 0,
          data: write_varint49(C + 420690)
        }];
        cruids[1].push({
          type: 2,
          data: write_shallow(uuid)
        });
        cruids[2].push({
          type: 0,
          data: write_varint49(C)
        });
        cruids[3].push({
          type: 0,
          data: write_varint49(C)
        });
      }
      cruids[4] = [];
      cruids[5] = [], cruids[6] = [];
      for (var R = 0; R <= range.e.r; ++R) {
        uuid = [];
        uuid[1] = uuid[2] = [{
          type: 0,
          data: write_varint49(R + 726270)
        }];
        cruids[4].push({
          type: 2,
          data: write_shallow(uuid)
        });
        cruids[5].push({
          type: 0,
          data: write_varint49(R)
        });
        cruids[6].push({
          type: 0,
          data: write_varint49(R)
        });
      }
      _x[j].messages[0].data = write_shallow(cruids);
    }
    oldbucket.content = compress_iwa_file(write_iwa_file(_x));
    oldbucket.size = oldbucket.content.length;
    delete pb[46];
    var store = parse_shallow(pb[4][0].data);
    {
      store[7][0].data = write_varint49(range.e.r + 1);
      var row_headers = parse_shallow(store[1][0].data);
      var row_header_ref = parse_TSP_Reference(row_headers[2][0].data);
      oldbucket = CFB.find(cfb, dependents[row_header_ref].location);
      _x = parse_iwa_file(decompress_iwa_file(oldbucket.content));
      {
        if (_x[0].id != row_header_ref) throw "Bad HeaderStorageBucket";
        var base_bucket = parse_shallow(_x[0].messages[0].data);
        for (R = 0; R < data.length; ++R) {
          var _bucket = parse_shallow(base_bucket[2][0].data);
          _bucket[1][0].data = write_varint49(R);
          _bucket[4][0].data = write_varint49(data[R].length);
          base_bucket[2][R] = {
            type: base_bucket[2][0].type,
            data: write_shallow(_bucket)
          };
        }
        _x[0].messages[0].data = write_shallow(base_bucket);
      }
      oldbucket.content = compress_iwa_file(write_iwa_file(_x));
      oldbucket.size = oldbucket.content.length;
      var col_header_ref = parse_TSP_Reference(store[2][0].data);
      oldbucket = CFB.find(cfb, dependents[col_header_ref].location);
      _x = parse_iwa_file(decompress_iwa_file(oldbucket.content));
      {
        if (_x[0].id != col_header_ref) throw "Bad HeaderStorageBucket";
        base_bucket = parse_shallow(_x[0].messages[0].data);
        for (C = 0; C <= range.e.c; ++C) {
          _bucket = parse_shallow(base_bucket[2][0].data);
          _bucket[1][0].data = write_varint49(C);
          _bucket[4][0].data = write_varint49(range.e.r + 1);
          base_bucket[2][C] = {
            type: base_bucket[2][0].type,
            data: write_shallow(_bucket)
          };
        }
        _x[0].messages[0].data = write_shallow(base_bucket);
      }
      oldbucket.content = compress_iwa_file(write_iwa_file(_x));
      oldbucket.size = oldbucket.content.length;
      var sstref = parse_TSP_Reference(store[4][0].data);
      (function() {
        var sentry = CFB.find(cfb, dependents[sstref].location);
        var sx = parse_iwa_file(decompress_iwa_file(sentry.content));
        var sstroot;
        for (var sxi = 0; sxi < sx.length; ++sxi) {
          var packet2 = sx[sxi];
          if (packet2.id == sstref) sstroot = packet2;
        }
        var sstdata = parse_shallow(sstroot.messages[0].data);
        {
          sstdata[3] = [];
          var newsst = [];
          SST.forEach(function(str, i) {
            newsst[1] = [{
              type: 0,
              data: write_varint49(i)
            }];
            newsst[2] = [{
              type: 0,
              data: write_varint49(1)
            }];
            newsst[3] = [{
              type: 2,
              data: stru8(str)
            }];
            sstdata[3].push({
              type: 2,
              data: write_shallow(newsst)
            });
          });
        }
        sstroot.messages[0].data = write_shallow(sstdata);
        var sy = write_iwa_file(sx);
        var raw32 = compress_iwa_file(sy);
        sentry.content = raw32;
        sentry.size = sentry.content.length;
      })();
      var tile = parse_shallow(store[3][0].data);
      {
        var t = tile[1][0];
        delete tile[2];
        var tl = parse_shallow(t.data);
        {
          var tileref = parse_TSP_Reference(tl[2][0].data);
          (function() {
            var tentry = CFB.find(cfb, dependents[tileref].location);
            var tx = parse_iwa_file(decompress_iwa_file(tentry.content));
            var tileroot;
            for (var sxi = 0; sxi < tx.length; ++sxi) {
              var packet2 = tx[sxi];
              if (packet2.id == tileref) tileroot = packet2;
            }
            var tiledata = parse_shallow(tileroot.messages[0].data);
            {
              delete tiledata[6];
              delete tile[7];
              var rowload = new Uint8Array(tiledata[5][0].data);
              tiledata[5] = [];
              var cnt = 0;
              for (var R2 = 0; R2 <= range.e.r; ++R2) {
                var tilerow = parse_shallow(rowload);
                cnt += write_tile_row(tilerow, data[R2], SST);
                tilerow[1][0].data = write_varint49(R2);
                tiledata[5].push({
                  data: write_shallow(tilerow),
                  type: 2
                });
              }
              tiledata[1] = [{
                type: 0,
                data: write_varint49(range.e.c + 1)
              }];
              tiledata[2] = [{
                type: 0,
                data: write_varint49(range.e.r + 1)
              }];
              tiledata[3] = [{
                type: 0,
                data: write_varint49(cnt)
              }];
              tiledata[4] = [{
                type: 0,
                data: write_varint49(range.e.r + 1)
              }];
            }
            tileroot.messages[0].data = write_shallow(tiledata);
            var ty = write_iwa_file(tx);
            var raw32 = compress_iwa_file(ty);
            tentry.content = raw32;
            tentry.size = tentry.content.length;
          })();
        }
        t.data = write_shallow(tl);
      }
      store[3][0].data = write_shallow(tile);
    }
    pb[4][0].data = write_shallow(store);
  }
  docroot.messages[0].data = write_shallow(pb);
  var y = write_iwa_file(x);
  var raw3 = compress_iwa_file(y);
  entry.content = raw3;
  entry.size = entry.content.length;
  return cfb;
}
function fix_opts_func(defaults) {
  return function fix_opts(opts) {
    for (var i = 0; i != defaults.length; ++i) {
      var d = defaults[i];
      if (opts[d[0]] === void 0) opts[d[0]] = d[1];
      if (d[2] === "n") opts[d[0]] = Number(opts[d[0]]);
    }
  };
}
function fix_write_opts(opts) {
  fix_opts_func([
    ["cellDates", false],
    /* write date cells with type `d` */
    ["bookSST", false],
    /* Generate Shared String Table */
    ["bookType", "xlsx"],
    /* Type of workbook (xlsx/m/b) */
    ["compression", false],
    /* Use file compression */
    ["WTF", false]
    /* WTF mode (throws errors) */
  ])(opts);
}
function write_zip(wb, opts) {
  if (opts.bookType == "ods") return write_ods(wb, opts);
  if (opts.bookType == "numbers") return write_numbers_iwa(wb, opts);
  if (opts.bookType == "xlsb") return write_zip_xlsxb(wb, opts);
  return write_zip_xlsx(wb, opts);
}
function write_zip_xlsxb(wb, opts) {
  _shapeid = 1024;
  if (wb && !wb.SSF) {
    wb.SSF = dup(table_fmt);
  }
  if (wb && wb.SSF) {
    make_ssf();
    SSF_load_table(wb.SSF);
    opts.revssf = evert_num(wb.SSF);
    opts.revssf[wb.SSF[65535]] = 0;
    opts.ssf = wb.SSF;
  }
  opts.rels = {};
  opts.wbrels = {};
  opts.Strings = /*::((*/
  [];
  opts.Strings.Count = 0;
  opts.Strings.Unique = 0;
  if (browser_has_Map) opts.revStrings = /* @__PURE__ */ new Map();
  else {
    opts.revStrings = {};
    opts.revStrings.foo = [];
    delete opts.revStrings.foo;
  }
  var wbext = opts.bookType == "xlsb" ? "bin" : "xml";
  var vbafmt = VBAFMTS.indexOf(opts.bookType) > -1;
  var ct = new_ct();
  fix_write_opts(opts = opts || {});
  var zip = zip_new();
  var f = "", rId = 0;
  opts.cellXfs = [];
  get_cell_style(opts.cellXfs, {}, {
    revssf: {
      "General": 0
    }
  });
  if (!wb.Props) wb.Props = {};
  f = "docProps/core.xml";
  zip_add_file(zip, f, write_core_props(wb.Props, opts));
  ct.coreprops.push(f);
  add_rels(opts.rels, 2, f, RELS.CORE_PROPS);
  f = "docProps/app.xml";
  if (wb.Props && wb.Props.SheetNames) {
  } else if (!wb.Workbook || !wb.Workbook.Sheets) wb.Props.SheetNames = wb.SheetNames;
  else {
    var _sn = [];
    for (var _i = 0; _i < wb.SheetNames.length; ++_i) if ((wb.Workbook.Sheets[_i] || {}).Hidden != 2) _sn.push(wb.SheetNames[_i]);
    wb.Props.SheetNames = _sn;
  }
  wb.Props.Worksheets = wb.Props.SheetNames.length;
  zip_add_file(zip, f, write_ext_props(wb.Props, opts));
  ct.extprops.push(f);
  add_rels(opts.rels, 3, f, RELS.EXT_PROPS);
  if (wb.Custprops !== wb.Props && keys(wb.Custprops || {}).length > 0) {
    f = "docProps/custom.xml";
    zip_add_file(zip, f, write_cust_props(wb.Custprops, opts));
    ct.custprops.push(f);
    add_rels(opts.rels, 4, f, RELS.CUST_PROPS);
  }
  for (rId = 1; rId <= wb.SheetNames.length; ++rId) {
    var wsrels = {
      "!id": {}
    };
    var ws = wb.Sheets[wb.SheetNames[rId - 1]];
    var _type = (ws || {})["!type"] || "sheet";
    switch (_type) {
      case "chart":
      default:
        f = "xl/worksheets/sheet" + rId + "." + wbext;
        zip_add_file(zip, f, write_ws(rId - 1, f, opts, wb, wsrels));
        ct.sheets.push(f);
        add_rels(opts.wbrels, -1, "worksheets/sheet" + rId + "." + wbext, RELS.WS[0]);
    }
    if (ws) {
      var comments = ws["!comments"];
      var need_vml = false;
      var cf = "";
      if (comments && comments.length > 0) {
        cf = "xl/comments" + rId + "." + wbext;
        zip_add_file(zip, cf, write_cmnt(comments, cf, opts));
        ct.comments.push(cf);
        add_rels(wsrels, -1, "../comments" + rId + "." + wbext, RELS.CMNT);
        need_vml = true;
      }
      if (ws["!legacy"]) {
        if (need_vml) zip_add_file(zip, "xl/drawings/vmlDrawing" + rId + ".vml", write_comments_vml(rId, ws["!comments"]));
      }
      delete ws["!comments"];
      delete ws["!legacy"];
    }
    if (wsrels["!id"].rId1) zip_add_file(zip, get_rels_path(f), write_rels(wsrels));
  }
  if (opts.Strings != null && opts.Strings.length > 0) {
    f = "xl/sharedStrings." + wbext;
    zip_add_file(zip, f, write_sst(opts.Strings, f, opts));
    ct.strs.push(f);
    add_rels(opts.wbrels, -1, "sharedStrings." + wbext, RELS.SST);
  }
  f = "xl/workbook." + wbext;
  zip_add_file(zip, f, write_wb(wb, f, opts));
  ct.workbooks.push(f);
  add_rels(opts.rels, 1, f, RELS.WB);
  f = "xl/theme/theme1.xml";
  zip_add_file(zip, f, write_theme(wb.Themes, opts));
  ct.themes.push(f);
  add_rels(opts.wbrels, -1, "theme/theme1.xml", RELS.THEME);
  f = "xl/styles." + wbext;
  zip_add_file(zip, f, write_sty(wb, f, opts));
  ct.styles.push(f);
  add_rels(opts.wbrels, -1, "styles." + wbext, RELS.STY);
  if (wb.vbaraw && vbafmt) {
    f = "xl/vbaProject.bin";
    zip_add_file(zip, f, wb.vbaraw);
    ct.vba.push(f);
    add_rels(opts.wbrels, -1, "vbaProject.bin", RELS.VBA);
  }
  f = "xl/metadata." + wbext;
  zip_add_file(zip, f, write_xlmeta(f));
  ct.metadata.push(f);
  add_rels(opts.wbrels, -1, "metadata." + wbext, RELS.XLMETA);
  zip_add_file(zip, "[Content_Types].xml", write_ct(ct, opts));
  zip_add_file(zip, "_rels/.rels", write_rels(opts.rels));
  zip_add_file(zip, "xl/_rels/workbook." + wbext + ".rels", write_rels(opts.wbrels));
  delete opts.revssf;
  delete opts.ssf;
  return zip;
}
function write_zip_xlsx(wb, opts) {
  _shapeid = 1024;
  if (wb && !wb.SSF) {
    wb.SSF = dup(table_fmt);
  }
  if (wb && wb.SSF) {
    make_ssf();
    SSF_load_table(wb.SSF);
    opts.revssf = evert_num(wb.SSF);
    opts.revssf[wb.SSF[65535]] = 0;
    opts.ssf = wb.SSF;
  }
  opts.rels = {};
  opts.wbrels = {};
  opts.Strings = /*::((*/
  [];
  opts.Strings.Count = 0;
  opts.Strings.Unique = 0;
  if (browser_has_Map) opts.revStrings = /* @__PURE__ */ new Map();
  else {
    opts.revStrings = {};
    opts.revStrings.foo = [];
    delete opts.revStrings.foo;
  }
  var wbext = "xml";
  var vbafmt = VBAFMTS.indexOf(opts.bookType) > -1;
  var ct = new_ct();
  fix_write_opts(opts = opts || {});
  var zip = zip_new();
  var f = "", rId = 0;
  opts.cellXfs = [];
  get_cell_style(opts.cellXfs, {}, {
    revssf: {
      "General": 0
    }
  });
  if (!wb.Props) wb.Props = {};
  f = "docProps/core.xml";
  zip_add_file(zip, f, write_core_props(wb.Props, opts));
  ct.coreprops.push(f);
  add_rels(opts.rels, 2, f, RELS.CORE_PROPS);
  f = "docProps/app.xml";
  if (wb.Props && wb.Props.SheetNames) {
  } else if (!wb.Workbook || !wb.Workbook.Sheets) wb.Props.SheetNames = wb.SheetNames;
  else {
    var _sn = [];
    for (var _i = 0; _i < wb.SheetNames.length; ++_i) if ((wb.Workbook.Sheets[_i] || {}).Hidden != 2) _sn.push(wb.SheetNames[_i]);
    wb.Props.SheetNames = _sn;
  }
  wb.Props.Worksheets = wb.Props.SheetNames.length;
  zip_add_file(zip, f, write_ext_props(wb.Props, opts));
  ct.extprops.push(f);
  add_rels(opts.rels, 3, f, RELS.EXT_PROPS);
  if (wb.Custprops !== wb.Props && keys(wb.Custprops || {}).length > 0) {
    f = "docProps/custom.xml";
    zip_add_file(zip, f, write_cust_props(wb.Custprops, opts));
    ct.custprops.push(f);
    add_rels(opts.rels, 4, f, RELS.CUST_PROPS);
  }
  var people = ["SheetJ5"];
  opts.tcid = 0;
  for (rId = 1; rId <= wb.SheetNames.length; ++rId) {
    var wsrels = {
      "!id": {}
    };
    var ws = wb.Sheets[wb.SheetNames[rId - 1]];
    var _type = (ws || {})["!type"] || "sheet";
    switch (_type) {
      case "chart":
      default:
        f = "xl/worksheets/sheet" + rId + "." + wbext;
        zip_add_file(zip, f, write_ws_xml(rId - 1, opts, wb, wsrels));
        ct.sheets.push(f);
        add_rels(opts.wbrels, -1, "worksheets/sheet" + rId + "." + wbext, RELS.WS[0]);
    }
    if (ws) {
      var comments = ws["!comments"];
      var need_vml = false;
      var cf = "";
      if (comments && comments.length > 0) {
        var needtc = false;
        comments.forEach(function(carr) {
          carr[1].forEach(function(c) {
            if (c.T == true) needtc = true;
          });
        });
        if (needtc) {
          cf = "xl/threadedComments/threadedComment" + rId + "." + wbext;
          zip_add_file(zip, cf, write_tcmnt_xml(comments, people, opts));
          ct.threadedcomments.push(cf);
          add_rels(wsrels, -1, "../threadedComments/threadedComment" + rId + "." + wbext, RELS.TCMNT);
        }
        cf = "xl/comments" + rId + "." + wbext;
        zip_add_file(zip, cf, write_comments_xml(comments, opts));
        ct.comments.push(cf);
        add_rels(wsrels, -1, "../comments" + rId + "." + wbext, RELS.CMNT);
        need_vml = true;
      }
      if (ws["!legacy"]) {
        if (need_vml) zip_add_file(zip, "xl/drawings/vmlDrawing" + rId + ".vml", write_comments_vml(rId, ws["!comments"]));
      }
      delete ws["!comments"];
      delete ws["!legacy"];
    }
    if (wsrels["!id"].rId1) zip_add_file(zip, get_rels_path(f), write_rels(wsrels));
  }
  if (opts.Strings != null && opts.Strings.length > 0) {
    f = "xl/sharedStrings." + wbext;
    zip_add_file(zip, f, write_sst_xml(opts.Strings, opts));
    ct.strs.push(f);
    add_rels(opts.wbrels, -1, "sharedStrings." + wbext, RELS.SST);
  }
  f = "xl/workbook." + wbext;
  zip_add_file(zip, f, write_wb_xml(wb, opts));
  ct.workbooks.push(f);
  add_rels(opts.rels, 1, f, RELS.WB);
  f = "xl/theme/theme1.xml";
  zip_add_file(zip, f, write_theme(wb.Themes, opts));
  ct.themes.push(f);
  add_rels(opts.wbrels, -1, "theme/theme1.xml", RELS.THEME);
  f = "xl/styles." + wbext;
  zip_add_file(zip, f, write_sty_xml(wb, opts));
  ct.styles.push(f);
  add_rels(opts.wbrels, -1, "styles." + wbext, RELS.STY);
  if (wb.vbaraw && vbafmt) {
    f = "xl/vbaProject.bin";
    zip_add_file(zip, f, wb.vbaraw);
    ct.vba.push(f);
    add_rels(opts.wbrels, -1, "vbaProject.bin", RELS.VBA);
  }
  f = "xl/metadata." + wbext;
  zip_add_file(zip, f, write_xlmeta_xml());
  ct.metadata.push(f);
  add_rels(opts.wbrels, -1, "metadata." + wbext, RELS.XLMETA);
  if (people.length > 1) {
    f = "xl/persons/person.xml";
    zip_add_file(zip, f, write_people_xml(people, opts));
    ct.people.push(f);
    add_rels(opts.wbrels, -1, "persons/person.xml", RELS.PEOPLE);
  }
  zip_add_file(zip, "[Content_Types].xml", write_ct(ct, opts));
  zip_add_file(zip, "_rels/.rels", write_rels(opts.rels));
  zip_add_file(zip, "xl/_rels/workbook." + wbext + ".rels", write_rels(opts.wbrels));
  delete opts.revssf;
  delete opts.ssf;
  return zip;
}
function firstbyte(f, o) {
  var x = "";
  switch ((o || {}).type || "base64") {
    case "buffer":
      return [f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]];
    case "base64":
      x = Base64_decode(f.slice(0, 12));
      break;
    case "binary":
      x = f;
      break;
    case "array":
      return [f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]];
    default:
      throw new Error("Unrecognized type " + (o && o.type || "undefined"));
  }
  return [x.charCodeAt(0), x.charCodeAt(1), x.charCodeAt(2), x.charCodeAt(3), x.charCodeAt(4), x.charCodeAt(5), x.charCodeAt(6), x.charCodeAt(7)];
}
function write_cfb_ctr(cfb, o) {
  switch (o.type) {
    case "base64":
    case "binary":
      break;
    case "buffer":
    case "array":
      o.type = "";
      break;
    case "file":
      return write_dl(o.file, CFB.write(cfb, {
        type: has_buf ? "buffer" : ""
      }));
    case "string":
      throw new Error("'string' output type invalid for '" + o.bookType + "' files");
    default:
      throw new Error("Unrecognized type " + o.type);
  }
  return CFB.write(cfb, o);
}
function write_zip_type(wb, opts) {
  var o = dup(opts || {});
  var z = write_zip(wb, o);
  return write_zip_denouement(z, o);
}
function write_zip_denouement(z, o) {
  var oopts = {};
  var ftype = has_buf ? "nodebuffer" : typeof Uint8Array !== "undefined" ? "array" : "string";
  if (o.compression) oopts.compression = "DEFLATE";
  if (o.password) oopts.type = ftype;
  else switch (o.type) {
    case "base64":
      oopts.type = "base64";
      break;
    case "binary":
      oopts.type = "string";
      break;
    case "string":
      throw new Error("'string' output type invalid for '" + o.bookType + "' files");
    case "buffer":
    case "file":
      oopts.type = ftype;
      break;
    default:
      throw new Error("Unrecognized type " + o.type);
  }
  var out = z.FullPaths ? CFB.write(z, {
    fileType: "zip",
    type: (
      /*::(*/
      {
        "nodebuffer": "buffer",
        "string": "binary"
      }[oopts.type] || oopts.type
    ),
    compression: !!o.compression
  }) : z.generate(oopts);
  if (typeof Deno !== "undefined") {
    if (typeof out == "string") {
      if (o.type == "binary" || o.type == "base64") return out;
      out = new Uint8Array(s2ab(out));
    }
  }
  if (o.password && typeof encrypt_agile !== "undefined") return write_cfb_ctr(encrypt_agile(out, o.password), o);
  if (o.type === "file") return write_dl(o.file, out);
  return o.type == "string" ? utf8read(
    /*::(*/
    out
    /*:: :any)*/
  ) : out;
}
function write_cfb_type(wb, opts) {
  var o = opts || {};
  var cfb = write_xlscfb(wb, o);
  return write_cfb_ctr(cfb, o);
}
function write_string_type(out, opts, bom) {
  if (!bom) bom = "";
  var o = bom + out;
  switch (opts.type) {
    case "base64":
      return Base64_encode(utf8write(o));
    case "binary":
      return utf8write(o);
    case "string":
      return out;
    case "file":
      return write_dl(opts.file, o, "utf8");
    case "buffer": {
      if (has_buf) return Buffer_from(o, "utf8");
      else if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(o);
      else return write_string_type(o, {
        type: "binary"
      }).split("").map(function(c) {
        return c.charCodeAt(0);
      });
    }
  }
  throw new Error("Unrecognized type " + opts.type);
}
function write_stxt_type(out, opts) {
  switch (opts.type) {
    case "base64":
      return Base64_encode(out);
    case "binary":
      return out;
    case "string":
      return out;
    case "file":
      return write_dl(opts.file, out, "binary");
    case "buffer": {
      if (has_buf) return Buffer_from(out, "binary");
      else return out.split("").map(function(c) {
        return c.charCodeAt(0);
      });
    }
  }
  throw new Error("Unrecognized type " + opts.type);
}
function write_binary_type(out, opts) {
  switch (opts.type) {
    case "string":
    case "base64":
    case "binary":
      var bstr = "";
      for (var i = 0; i < out.length; ++i) bstr += String.fromCharCode(out[i]);
      return opts.type == "base64" ? Base64_encode(bstr) : opts.type == "string" ? utf8read(bstr) : bstr;
    case "file":
      return write_dl(opts.file, out);
    case "buffer":
      return out;
    default:
      throw new Error("Unrecognized type " + opts.type);
  }
}
function writeSync(wb, opts) {
  reset_cp();
  check_wb(wb);
  var o = dup(opts || {});
  if (o.cellStyles) {
    o.cellNF = true;
    o.sheetStubs = true;
  }
  if (o.type == "array") {
    o.type = "binary";
    var out = writeSync(wb, o);
    o.type = "array";
    return s2ab(out);
  }
  var idx = 0;
  if (o.sheet) {
    if (typeof o.sheet == "number") idx = o.sheet;
    else idx = wb.SheetNames.indexOf(o.sheet);
    if (!wb.SheetNames[idx]) throw new Error("Sheet not found: " + o.sheet + " : " + typeof o.sheet);
  }
  switch (o.bookType || "xlsb") {
    case "xml":
    case "xlml":
      return write_string_type(write_xlml(wb, o), o);
    case "slk":
    case "sylk":
      return write_string_type(SYLK.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "htm":
    case "html":
      return write_string_type(sheet_to_html(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "txt":
      return write_stxt_type(sheet_to_txt(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "csv":
      return write_string_type(sheet_to_csv(wb.Sheets[wb.SheetNames[idx]], o), o, "\uFEFF");
    case "dif":
      return write_string_type(DIF.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "dbf":
      return write_binary_type(DBF.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "prn":
      return write_string_type(PRN.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "rtf":
      return write_string_type(RTF.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "eth":
      return write_string_type(ETH.from_sheet(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "fods":
      return write_string_type(write_ods(wb, o), o);
    case "wk1":
      return write_binary_type(WK_.sheet_to_wk1(wb.Sheets[wb.SheetNames[idx]], o), o);
    case "wk3":
      return write_binary_type(WK_.book_to_wk3(wb, o), o);
    case "biff2":
      if (!o.biff) o.biff = 2;
    case "biff3":
      if (!o.biff) o.biff = 3;
    case "biff4":
      if (!o.biff) o.biff = 4;
      return write_binary_type(write_biff_buf(wb, o), o);
    case "biff5":
      if (!o.biff) o.biff = 5;
    case "biff8":
    case "xla":
    case "xls":
      if (!o.biff) o.biff = 8;
      return write_cfb_type(wb, o);
    case "xlsx":
    case "xlsm":
    case "xlam":
    case "xlsb":
    case "numbers":
    case "ods":
      return write_zip_type(wb, o);
    default:
      throw new Error("Unrecognized bookType |" + o.bookType + "|");
  }
}
function resolve_book_type(o) {
  if (o.bookType) return;
  var _BT = {
    "xls": "biff8",
    "htm": "html",
    "slk": "sylk",
    "socialcalc": "eth",
    "Sh33tJS": "WTF"
  };
  var ext = o.file.slice(o.file.lastIndexOf(".")).toLowerCase();
  if (ext.match(/^\.[a-z]+$/)) o.bookType = ext.slice(1);
  o.bookType = _BT[o.bookType] || o.bookType;
}
function writeFileSync(wb, filename, opts) {
  var o = opts || {};
  o.type = "file";
  o.file = filename;
  resolve_book_type(o);
  return writeSync(wb, o);
}
function make_json_row(sheet, r, R, cols, header, hdr, dense, o) {
  var rr = encode_row(R);
  var defval = o.defval, raw = o.raw || !Object.prototype.hasOwnProperty.call(o, "raw");
  var isempty = true;
  var row = header === 1 ? [] : {};
  if (header !== 1) {
    if (Object.defineProperty) try {
      Object.defineProperty(row, "__rowNum__", {
        value: R,
        enumerable: false
      });
    } catch (e) {
      row.__rowNum__ = R;
    }
    else row.__rowNum__ = R;
  }
  if (!dense || sheet[R]) for (var C = r.s.c; C <= r.e.c; ++C) {
    var val = dense ? sheet[R][C] : sheet[cols[C] + rr];
    if (val === void 0 || val.t === void 0) {
      if (defval === void 0) continue;
      if (hdr[C] != null) {
        row[hdr[C]] = defval;
      }
      continue;
    }
    var v = val.v;
    switch (val.t) {
      case "z":
        if (v == null) break;
        continue;
      case "e":
        v = v == 0 ? null : void 0;
        break;
      case "s":
      case "d":
      case "b":
      case "n":
        break;
      default:
        throw new Error("unrecognized type " + val.t);
    }
    if (hdr[C] != null) {
      if (v == null) {
        if (val.t == "e" && v === null) row[hdr[C]] = null;
        else if (defval !== void 0) row[hdr[C]] = defval;
        else if (raw && v === null) row[hdr[C]] = null;
        else continue;
      } else {
        row[hdr[C]] = raw && (val.t !== "n" || val.t === "n" && o.rawNumbers !== false) ? v : format_cell(val, v, o);
      }
      if (v != null) isempty = false;
    }
  }
  return {
    row,
    isempty
  };
}
function sheet_to_json(sheet, opts) {
  if (sheet == null || sheet["!ref"] == null) return [];
  var val = {
    t: "n",
    v: 0
  }, header = 0, offset = 1, hdr = [], v = 0, vv = "";
  var r = {
    s: {
      r: 0,
      c: 0
    },
    e: {
      r: 0,
      c: 0
    }
  };
  var o = opts || {};
  var range = o.range != null ? o.range : sheet["!ref"];
  if (o.header === 1) header = 1;
  else if (o.header === "A") header = 2;
  else if (Array.isArray(o.header)) header = 3;
  else if (o.header == null) header = 0;
  switch (typeof range) {
    case "string":
      r = safe_decode_range(range);
      break;
    case "number":
      r = safe_decode_range(sheet["!ref"]);
      r.s.r = range;
      break;
    default:
      r = range;
  }
  if (header > 0) offset = 0;
  var rr = encode_row(r.s.r);
  var cols = [];
  var out = [];
  var outi = 0, counter = 0;
  var dense = Array.isArray(sheet);
  var R = r.s.r, C = 0;
  var header_cnt = {};
  if (dense && !sheet[R]) sheet[R] = [];
  var colinfo = o.skipHidden && sheet["!cols"] || [];
  var rowinfo = o.skipHidden && sheet["!rows"] || [];
  for (C = r.s.c; C <= r.e.c; ++C) {
    if ((colinfo[C] || {}).hidden) continue;
    cols[C] = encode_col(C);
    val = dense ? sheet[R][C] : sheet[cols[C] + rr];
    switch (header) {
      case 1:
        hdr[C] = C - r.s.c;
        break;
      case 2:
        hdr[C] = cols[C];
        break;
      case 3:
        hdr[C] = o.header[C - r.s.c];
        break;
      default:
        if (val == null) val = {
          w: "__EMPTY",
          t: "s"
        };
        vv = v = format_cell(val, null, o);
        counter = header_cnt[v] || 0;
        if (!counter) header_cnt[v] = 1;
        else {
          do {
            vv = v + "_" + counter++;
          } while (header_cnt[vv]);
          header_cnt[v] = counter;
          header_cnt[vv] = 1;
        }
        hdr[C] = vv;
    }
  }
  for (R = r.s.r + offset; R <= r.e.r; ++R) {
    if ((rowinfo[R] || {}).hidden) continue;
    var row = make_json_row(sheet, r, R, cols, header, hdr, dense, o);
    if (row.isempty === false || (header === 1 ? o.blankrows !== false : !!o.blankrows)) out[outi++] = row.row;
  }
  out.length = outi;
  return out;
}
var qreg = /"/g;
function make_csv_row(sheet, r, R, cols, fs, rs, FS, o) {
  var isempty = true;
  var row = [], txt = "", rr = encode_row(R);
  for (var C = r.s.c; C <= r.e.c; ++C) {
    if (!cols[C]) continue;
    var val = o.dense ? (sheet[R] || [])[C] : sheet[cols[C] + rr];
    if (val == null) txt = "";
    else if (val.v != null) {
      isempty = false;
      txt = "" + (o.rawNumbers && val.t == "n" ? val.v : format_cell(val, null, o));
      for (var i = 0, cc = 0; i !== txt.length; ++i) if ((cc = txt.charCodeAt(i)) === fs || cc === rs || cc === 34 || o.forceQuotes) {
        txt = '"' + txt.replace(qreg, '""') + '"';
        break;
      }
      if (txt == "ID") txt = '"ID"';
    } else if (val.f != null && !val.F) {
      isempty = false;
      txt = "=" + val.f;
      if (txt.indexOf(",") >= 0) txt = '"' + txt.replace(qreg, '""') + '"';
    } else txt = "";
    row.push(txt);
  }
  if (o.blankrows === false && isempty) return null;
  return row.join(FS);
}
function sheet_to_csv(sheet, opts) {
  var out = [];
  var o = opts == null ? {} : opts;
  if (sheet == null || sheet["!ref"] == null) return "";
  var r = safe_decode_range(sheet["!ref"]);
  var FS = o.FS !== void 0 ? o.FS : ",", fs = FS.charCodeAt(0);
  var RS = o.RS !== void 0 ? o.RS : "\n", rs = RS.charCodeAt(0);
  var endregex = new RegExp((FS == "|" ? "\\|" : FS) + "+$");
  var row = "", cols = [];
  o.dense = Array.isArray(sheet);
  var colinfo = o.skipHidden && sheet["!cols"] || [];
  var rowinfo = o.skipHidden && sheet["!rows"] || [];
  for (var C = r.s.c; C <= r.e.c; ++C) if (!(colinfo[C] || {}).hidden) cols[C] = encode_col(C);
  var w = 0;
  for (var R = r.s.r; R <= r.e.r; ++R) {
    if ((rowinfo[R] || {}).hidden) continue;
    row = make_csv_row(sheet, r, R, cols, fs, rs, FS, o);
    if (row == null) {
      continue;
    }
    if (o.strip) row = row.replace(endregex, "");
    if (row || o.blankrows !== false) out.push((w++ ? RS : "") + row);
  }
  delete o.dense;
  return out.join("");
}
function sheet_to_txt(sheet, opts) {
  if (!opts) opts = {};
  opts.FS = "	";
  opts.RS = "\n";
  var s = sheet_to_csv(sheet, opts);
  if (typeof $cptable == "undefined" || opts.type == "string") return s;
  var o = $cptable.utils.encode(1200, s, "str");
  return String.fromCharCode(255) + String.fromCharCode(254) + o;
}
function sheet_to_formulae(sheet) {
  var y = "", x, val = "";
  if (sheet == null || sheet["!ref"] == null) return [];
  var r = safe_decode_range(sheet["!ref"]), rr = "", cols = [], C;
  var cmds = [];
  var dense = Array.isArray(sheet);
  for (C = r.s.c; C <= r.e.c; ++C) cols[C] = encode_col(C);
  for (var R = r.s.r; R <= r.e.r; ++R) {
    rr = encode_row(R);
    for (C = r.s.c; C <= r.e.c; ++C) {
      y = cols[C] + rr;
      x = dense ? (sheet[R] || [])[C] : sheet[y];
      val = "";
      if (x === void 0) continue;
      else if (x.F != null) {
        y = x.F;
        if (!x.f) continue;
        val = x.f;
        if (y.indexOf(":") == -1) y = y + ":" + y;
      }
      if (x.f != null) val = x.f;
      else if (x.t == "z") continue;
      else if (x.t == "n" && x.v != null) val = "" + x.v;
      else if (x.t == "b") val = x.v ? "TRUE" : "FALSE";
      else if (x.w !== void 0) val = "'" + x.w;
      else if (x.v === void 0) continue;
      else if (x.t == "s") val = "'" + x.v;
      else val = "" + x.v;
      cmds[cmds.length] = y + "=" + val;
    }
  }
  return cmds;
}
function sheet_add_json(_ws, js, opts) {
  var o = opts || {};
  var offset = +!o.skipHeader;
  var ws = _ws || {};
  var _R = 0, _C = 0;
  if (ws && o.origin != null) {
    if (typeof o.origin == "number") _R = o.origin;
    else {
      var _origin = typeof o.origin == "string" ? decode_cell(o.origin) : o.origin;
      _R = _origin.r;
      _C = _origin.c;
    }
  }
  var cell;
  var range = {
    s: {
      c: 0,
      r: 0
    },
    e: {
      c: _C,
      r: _R + js.length - 1 + offset
    }
  };
  if (ws["!ref"]) {
    var _range = safe_decode_range(ws["!ref"]);
    range.e.c = Math.max(range.e.c, _range.e.c);
    range.e.r = Math.max(range.e.r, _range.e.r);
    if (_R == -1) {
      _R = _range.e.r + 1;
      range.e.r = _R + js.length - 1 + offset;
    }
  } else {
    if (_R == -1) {
      _R = 0;
      range.e.r = js.length - 1 + offset;
    }
  }
  var hdr = o.header || [], C = 0;
  js.forEach(function(JS, R) {
    keys(JS).forEach(function(k) {
      if ((C = hdr.indexOf(k)) == -1) hdr[C = hdr.length] = k;
      var v = JS[k];
      var t = "z";
      var z = "";
      var ref = encode_cell({
        c: _C + C,
        r: _R + R + offset
      });
      cell = ws_get_cell_stub(ws, ref);
      if (v && typeof v === "object" && !(v instanceof Date)) {
        ws[ref] = v;
      } else {
        if (typeof v == "number") t = "n";
        else if (typeof v == "boolean") t = "b";
        else if (typeof v == "string") t = "s";
        else if (v instanceof Date) {
          t = "d";
          if (!o.cellDates) {
            t = "n";
            v = datenum(v);
          }
          z = o.dateNF || table_fmt[14];
        } else if (v === null && o.nullError) {
          t = "e";
          v = 0;
        }
        if (!cell) ws[ref] = cell = {
          t,
          v
        };
        else {
          cell.t = t;
          cell.v = v;
          delete cell.w;
          delete cell.R;
          if (z) cell.z = z;
        }
        if (z) cell.z = z;
      }
    });
  });
  range.e.c = Math.max(range.e.c, _C + hdr.length - 1);
  var __R = encode_row(_R);
  if (offset) for (C = 0; C < hdr.length; ++C) ws[encode_col(C + _C) + __R] = {
    t: "s",
    v: hdr[C]
  };
  ws["!ref"] = encode_range(range);
  return ws;
}
function json_to_sheet(js, opts) {
  return sheet_add_json(null, js, opts);
}
function ws_get_cell_stub(ws, R, C) {
  if (typeof R == "string") {
    if (Array.isArray(ws)) {
      var RC = decode_cell(R);
      if (!ws[RC.r]) ws[RC.r] = [];
      return ws[RC.r][RC.c] || (ws[RC.r][RC.c] = {
        t: "z"
      });
    }
    return ws[R] || (ws[R] = {
      t: "z"
    });
  }
  if (typeof R != "number") return ws_get_cell_stub(ws, encode_cell(R));
  return ws_get_cell_stub(ws, encode_cell({
    r: R,
    c: C || 0
  }));
}
function wb_sheet_idx(wb, sh) {
  if (typeof sh == "number") {
    if (sh >= 0 && wb.SheetNames.length > sh) return sh;
    throw new Error("Cannot find sheet # " + sh);
  } else if (typeof sh == "string") {
    var idx = wb.SheetNames.indexOf(sh);
    if (idx > -1) return idx;
    throw new Error("Cannot find sheet name |" + sh + "|");
  } else throw new Error("Cannot find sheet |" + sh + "|");
}
function book_new() {
  return {
    SheetNames: [],
    Sheets: {}
  };
}
function book_append_sheet(wb, ws, name, roll) {
  var i = 1;
  if (!name) {
    for (; i <= 65535; ++i, name = void 0) if (wb.SheetNames.indexOf(name = "Sheet" + i) == -1) break;
  }
  if (!name || wb.SheetNames.length >= 65535) throw new Error("Too many worksheets");
  if (roll && wb.SheetNames.indexOf(name) >= 0) {
    var m = name.match(/(^.*?)(\d+)$/);
    i = m && +m[2] || 0;
    var root = m && m[1] || name;
    for (++i; i <= 65535; ++i) if (wb.SheetNames.indexOf(name = root + i) == -1) break;
  }
  check_ws_name(name);
  if (wb.SheetNames.indexOf(name) >= 0) throw new Error("Worksheet with name |" + name + "| already exists!");
  wb.SheetNames.push(name);
  wb.Sheets[name] = ws;
  return name;
}
function book_set_sheet_visibility(wb, sh, vis) {
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Sheets) wb.Workbook.Sheets = [];
  var idx = wb_sheet_idx(wb, sh);
  if (!wb.Workbook.Sheets[idx]) wb.Workbook.Sheets[idx] = {};
  switch (vis) {
    case 0:
    case 1:
    case 2:
      break;
    default:
      throw new Error("Bad sheet visibility setting " + vis);
  }
  wb.Workbook.Sheets[idx].Hidden = vis;
}
function cell_set_number_format(cell, fmt) {
  cell.z = fmt;
  return cell;
}
function cell_set_hyperlink(cell, target, tooltip) {
  if (!target) {
    delete cell.l;
  } else {
    cell.l = {
      Target: target
    };
    if (tooltip) cell.l.Tooltip = tooltip;
  }
  return cell;
}
function cell_set_internal_link(cell, range, tooltip) {
  return cell_set_hyperlink(cell, "#" + range, tooltip);
}
function cell_add_comment(cell, text, author) {
  if (!cell.c) cell.c = [];
  cell.c.push({
    t: text,
    a: author || "SheetJS"
  });
}
function sheet_set_array_formula(ws, range, formula, dynamic) {
  var rng = typeof range != "string" ? range : safe_decode_range(range);
  var rngstr = typeof range == "string" ? range : encode_range(range);
  for (var R = rng.s.r; R <= rng.e.r; ++R) for (var C = rng.s.c; C <= rng.e.c; ++C) {
    var cell = ws_get_cell_stub(ws, R, C);
    cell.t = "n";
    cell.F = rngstr;
    delete cell.v;
    if (R == rng.s.r && C == rng.s.c) {
      cell.f = formula;
      if (dynamic) cell.D = true;
    }
  }
  return ws;
}
var utils = {
  encode_col,
  encode_row,
  encode_cell,
  encode_range,
  decode_col,
  decode_row,
  split_cell,
  decode_cell,
  decode_range,
  format_cell,
  sheet_add_aoa,
  sheet_add_json,
  sheet_add_dom,
  aoa_to_sheet,
  json_to_sheet,
  table_to_sheet: parse_dom_table,
  table_to_book,
  sheet_to_csv,
  sheet_to_txt,
  sheet_to_json,
  sheet_to_html,
  sheet_to_formulae,
  sheet_to_row_object_array: sheet_to_json,
  sheet_get_cell: ws_get_cell_stub,
  book_new,
  book_append_sheet,
  book_set_sheet_visibility,
  cell_set_number_format,
  cell_set_hyperlink,
  cell_set_internal_link,
  cell_add_comment,
  sheet_set_array_formula,
  consts: {
    SHEET_VISIBLE: 0,
    SHEET_HIDDEN: 1,
    SHEET_VERY_HIDDEN: 2
  }
};
var version = XLSX.version;

export {
  MarkdownComponent,
  provideMarkdown,
  MarkdownModule,
  writeFileSync,
  utils
};
/*! Bundled license information:

xlsx/xlsx.mjs:
  (*! xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com *)

xlsx/xlsx.mjs:
  (*! sheetjs (C) 2013-present SheetJS -- http://sheetjs.com *)
*/
//# sourceMappingURL=chunk-OYEOMEKY.js.map
