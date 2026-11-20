// Tema de Shiki para los bloques de código de las lecciones: tiza sobre pizarrón.
export const temaTiza = {
  name: 'tiza',
  type: 'dark',
  colors: { 'editor.background': '#15211b', 'editor.foreground': '#eceae2' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#97a29a', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'constant.language', 'variable.language'], settings: { foreground: '#8fd0f7' } },
    { scope: ['string', 'string.template', 'punctuation.definition.string'], settings: { foreground: '#f2a7b8' } },
    { scope: ['constant.numeric'], settings: { foreground: '#ffb36b' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: '#eceae2', fontStyle: 'bold' } },
    { scope: ['entity.name.tag', 'support.class.component'], settings: { foreground: '#8fd0f7' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#cdb0ff' } },
    { scope: ['support.type.property-name', 'variable.other.property', 'meta.object-literal.key'], settings: { foreground: '#eceae2' } },
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#b8bcb4' } },
    { scope: ['variable', 'variable.other'], settings: { foreground: '#eceae2' } },
  ],
};
