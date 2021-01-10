const isWhiteSpace = (char: string) => /\s/.test(char);
const isNumber = (char: string) => /[0-9]/.test(char);
const isLetter = (char: string) => /[a-z]/i.test(char);
const isOperator = (char: string) => /[+\-*/]/.test(char);
const isSeperator = (char: string) => /\./.test(char);
const isPunctuation = (char: string) => /,/.test(char);

export interface Token {
  type: 'number' | 'paren' | 'name' | 'operator' | 'seperator' | 'punct';
  value: string;
}

export function tokenizer(code: string) {
  let current = 0;
  const tokens: Token[] = [];
  while (current < code.length) {
    let char = code[current];

    if (char == '(') {
      tokens.push({ type: 'paren', value: char });
      current++;
      continue;
    } else if (char == ')') {
      tokens.push({ type: 'paren', value: char });
      current++;
      continue;
    } else if (isPunctuation(char)) {
      tokens.push({ type: 'punct', value: char });
      current++;
      continue;
    } else if (isOperator(char)) {
      tokens.push({ type: 'operator', value: char });
      current++;
      continue;
    } else if (isWhiteSpace(char)) {
      current++;
      continue;
    } else if (isSeperator(char)) {
      tokens.push({ type: 'seperator', value: char });
      current++;
      continue;
    } else if (isNumber(char)) {
      let value = '';

      while (isNumber(char)) {
        value += char;
        char = code[++current];
      }

      tokens.push({ type: 'number', value });
      continue;
    } else if (isLetter(char)) {
      let value = '';

      while (isLetter(char)) {
        value += char;
        char = code[++current];
      }

      tokens.push({ type: 'name', value });
      continue;
    } else {
      throw new TypeError(`error at character: ${current}, invalid token: ${char}`);
    }
  }

  return tokens;
}
