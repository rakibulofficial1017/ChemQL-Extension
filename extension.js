const vscode = require("vscode");

const COMMANDS = [
  "search", "source", "list", "clear", "return", "exit", "help", "dump",
  "balance", "findel", "findmol", "findre", "set", "add", "remove", "react",
  "conditions", "view", "risk", "fix", "cleanup", "signal", "endrisk",
  "define", "namespace", "struct", "record", "enum", "if", "elif", "else",
  "endif", "for", "endfor", "while", "endwhile", "break", "continue"
];
const SOURCES = ["elements", "molecules", "reactions"];
const OPERATORS = ["=", "==", "!=", ">", "<", ">=", "<=", "like", "like!", "has", "and", "or", "not", "union", "intersect"];
const QUERY_OPERATORS = ["sort", "limit", "count", "asc", "desc", "return"];
const ELEMENT_KEYS = [
  "name", "appearance", "atomic_mass", "boil", "category", "density", "discovered_by",
  "melt", "molar_heat", "named_by", "number", "period", "group", "phase", "source",
  "symbol", "xpos", "ypos", "shells", "electron_configuration", "electron_affinity",
  "electronegativity_pauling", "ionization_energies", "block"
];
const MOLECULE_KEYS = [
  "name", "formula", "elements", "molecular_weight", "iupac_name", "smiles", "cid",
  "melting_point", "boiling_point", "density", "state", "bonds", "total_bond_energy"
];
const REACTION_KEYS = [
  "id", "name", "equation", "reaction_type", "reversible", "reactants", "products",
  "conditions", "temperature_k", "pressure_pa", "catalysts", "atmosphere", "notes", "source"
];

function item(label, kind, detail, insertText) {
  const result = new vscode.CompletionItem(label, kind);
  if (detail) result.detail = detail;
  if (insertText) result.insertText = insertText;
  return result;
}

function inQueryExpression(text) {
  return text.lastIndexOf("{{") > text.lastIndexOf("}}");
}

function getCompletions(document, position) {
  const line = document.lineAt(position.line).text;
  let before = line.slice(0, position.character);
  if (inQueryExpression(before)) before = before.slice(before.lastIndexOf("{{") + 2);

  const trimmed = before.trimStart();
  const trailingSpace = /\s$/.test(before);
  const words = trimmed.trim().split(/\s+/).filter(Boolean);
  const current = trailingSpace || words.length === 0 ? "" : words[words.length - 1];
  const prior = trailingSpace ? words : words.slice(0, -1);
  const lowerCurrent = current.toLowerCase();

  if (prior.length === 0) {
    return COMMANDS.filter(x => x.toLowerCase().startsWith(lowerCurrent))
      .map(x => item(x, vscode.CompletionItemKind.Keyword, "ChemQL keyword or command"));
  }

  const command = prior[0].toLowerCase();
  let suggestions = [];
  if (prior.length === 1 && ["search", "source"].includes(command)) {
    suggestions = SOURCES.map(x => item(x, vscode.CompletionItemKind.Module, "ChemQL data source"));
  } else if (command === "search" && prior.length >= 2) {
    const source = prior[1].toLowerCase();
    const keys = source === "elements" ? ELEMENT_KEYS :
      source === "molecules" ? MOLECULE_KEYS :
      source === "reactions" ? REACTION_KEYS : [];
    suggestions = [
      ...keys.map(x => item(x, vscode.CompletionItemKind.Field, `${source} field`)),
      ...[...OPERATORS, ...QUERY_OPERATORS].map(x => item(x, vscode.CompletionItemKind.Operator, "Query operator"))
    ];
  } else if (command === "set" && prior.length === 1) {
    suggestions = ["temperature", "pressure", "catalysts"].map(x => item(x, vscode.CompletionItemKind.Field, "Reaction setting"));
  } else if (command === "set" && prior.length === 2) {
    const setting = prior[1].toLowerCase();
    const values = setting === "temperature" ? ["standard", "room", "0C", "0F", "0K"] :
      setting === "pressure" ? ["standard", "room", "0Pa", "0bar", "1atm"] : [];
    suggestions = values.map(x => item(x, vscode.CompletionItemKind.Value, "Example condition"));
  } else if (["add", "remove"].includes(command)) {
    suggestions = ["catalyst"].map(x => item(x, vscode.CompletionItemKind.Field, "Reaction setting"));
  }
  return suggestions.filter(x => x.label.toLowerCase().startsWith(lowerCurrent));
}

function activate(context) {
  const provider = vscode.languages.registerCompletionItemProvider(
    { language: "chemql" },
    { provideCompletionItems(document, position) { return getCompletions(document, position); } },
    " ", "\t", "{"
  );
  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = { activate, deactivate };
