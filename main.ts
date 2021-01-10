import { tokenizer } from './tokenizer';
import { parser } from './parser';

export function compiler(code: string) {
  const tokens = tokenizer(code);
  const ast = parser(tokens);
  return ast;
}
