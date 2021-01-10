import { Token } from './tokenizer';

export type CallExpression = {
  type: 'CallExpression';
  name: string;
  params: Ast['body'][number][];
};

export type GroupExpression = {
  type: 'GroupExpression';
  params: Ast['body'][number][];
};

export type SimpleExperssion = {
  type: 'IntegerLiteral' | 'FloatLiteral' | 'Operator';
  value: string;
};

export type Expression = SimpleExperssion | CallExpression | GroupExpression;

export type Ast = {
  type: 'Program';
  body: Expression[];
};

const actions = {
  createAST: (): Ast => ({
    type: 'Program',
    body: [],
  }),
  createCallExpression: (value: string): CallExpression => ({
    type: 'CallExpression',
    name: value,
    params: [],
  }),
  createGroupExpression: (): GroupExpression => ({
    type: 'GroupExpression',
    params: [],
  }),
  createSimpleExpression: (type: SimpleExperssion['type'], value: string): SimpleExperssion => ({
    type,
    value,
  }),
};

const isFloatExpression = (token: Token, cursorPosition: number, tokens: Token[]) => {
  return (
    token.type == 'number' &&
    tokens[cursorPosition + 1] &&
    tokens[cursorPosition + 1].type == 'seperator' &&
    tokens[cursorPosition + 2] &&
    tokens[cursorPosition + 2].type == 'number'
  );
};

export function parser(tokens: Token[]) {
  let currentCursorPosition = 0;

  const walk: () => Expression = () => {
    let token = tokens[currentCursorPosition];

    if (token.type == 'operator') {
      currentCursorPosition++;
      return actions.createSimpleExpression('Operator', token.value);
    } else if (isFloatExpression(token, currentCursorPosition, tokens)) {
      currentCursorPosition += 3;
      return actions.createSimpleExpression(
        'FloatLiteral',
        `${token.value}.${tokens[currentCursorPosition - 1].value}`
      );
    } else if (token.type == 'number') {
      currentCursorPosition++;
      return actions.createSimpleExpression('IntegerLiteral', token.value);
    } else if (token.type == 'name') {
      const callExpr = actions.createCallExpression(token.value);
      token = tokens[++currentCursorPosition];

      if (!token) return callExpr;

      // if we encounter open paren we move forward
      if (token.type == 'paren' && token.value == '(') {
        token = tokens[++currentCursorPosition];
      }

      if (!token) return callExpr;

      while (token.type != 'paren' || (token.type == 'paren' && token.value != ')')) {
        if (token.type == 'punct') {
          currentCursorPosition++;
        }
        callExpr.params.push(walk());
        token = tokens[currentCursorPosition];
      }

      currentCursorPosition++;

      return callExpr;
    } else if (token.type == 'paren' && token.value == '(') {
      const groupExpr = actions.createGroupExpression();
      token = tokens[++currentCursorPosition];

      if (!token) return groupExpr;

      while (token.type != 'paren' || (token.type == 'paren' && token.value != ')')) {
        groupExpr.params.push(walk());
        token = tokens[currentCursorPosition];
      }

      currentCursorPosition++;
      return groupExpr;
    } else {
      throw new TypeError(`placeholder error, still multiple stages to process`);
    }
  };

  const ast = actions.createAST();

  while (currentCursorPosition < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
