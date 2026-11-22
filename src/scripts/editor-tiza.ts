// Editor de código con el tema de tiza: el mismo en los laboratorios y en Rayos X.
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const temaTiza = EditorView.theme(
  {
    '&': { color: '#eceae2', backgroundColor: 'transparent', fontSize: '0.85rem', minHeight: '240px' },
    '.cm-content': { fontFamily: "'Fira Code', ui-monospace, monospace", caretColor: '#f7df1e', padding: '10px 0' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#f7df1e', borderLeftWidth: '2px' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(247,223,30,.28)' },
    '.cm-gutters': { backgroundColor: 'transparent', color: '#8fd0f7', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(236,234,226,.05)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#f7df1e' },
    '.cm-matchingBracket': { backgroundColor: 'rgba(247,223,30,.18)', outline: 'none' },
    '.cm-tooltip': { backgroundColor: '#15211b', border: '2px solid rgba(236,234,226,.15)', color: '#eceae2' },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': { backgroundColor: 'rgba(247,223,30,.2)', color: '#eceae2' },
    '.cm-foldPlaceholder': { backgroundColor: 'transparent', border: 'none', color: '#8fd0f7' },
  },
  { dark: true },
);

export const colores = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.bool, t.null], color: '#8fd0f7' },
  { tag: [t.string, t.special(t.string)], color: '#f2a7b8' },
  { tag: t.number, color: '#ffb36b' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#eceae2', fontWeight: '600' },
  { tag: t.comment, color: '#97a29a', fontStyle: 'italic' },
  { tag: [t.operator, t.punctuation], color: '#b8bcb4' },
]);

/** Todo lo que necesita un editor de JavaScript con el tema de tiza */
export const extensionesTiza = [basicSetup, javascript(), temaTiza, syntaxHighlighting(colores)];
