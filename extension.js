const vscode = require("vscode");

const COMMANDS = [
    "search",
    "source",
    "list",
    "clear",
    "return",
    "exit",
    "findel",
    "findmol",
    "findre",
    "set",
    "add",
    "remove",
    "react",
    "conditions",
    "view",
    "help",
    "dump"
];

const SOURCES = [
    "elements",
    "molecules",
    "reactions"
];

const OPERATORS = [
    "=",
    ">",
    "<",
    ">=",
    "<=",
    "like",
    "like!",
    "has"
];

const QUERY_OPERATORS = [
    "sort",
    "limit",
    "count",
    "asc",
    "desc",
    "return"
];

const ELEMENT_KEYS = [
    "name",
    "appearance",
    "atomic_mass",
    "boil",
    "category",
    "density",
    "discovered_by",
    "melt",
    "molar_heat",
    "named_by",
    "number",
    "period",
    "group",
    "phase",
    "source",
    "bohr_model_image",
    "bohr_model_3d",
    "spectral_img",
    "summary",
    "symbol",
    "xpos",
    "ypos",
    "wxpos",
    "wypos",
    "shells",
    "electron_configuration",
    "electron_configuration_semantic",
    "electron_affinity",
    "electronegativity_pauling",
    "ionization_energies",
    "cpk-hex",
    "image",
    "block"
];

const MOLECULE_KEYS = [
    "name",
    "formula",
    "elements",
    "molecular_weight",
    "iupac_name",
    "smiles",
    "cid",
    "melting_point",
    "boiling_point",
    "density",
    "state",
    "bonds",
    "total_bond_energy"
];

const REACTION_KEYS = [
    "id",
    "name",
    "equation",
    "reaction_type",
    "reversible",
    "reactants",
    "products",
    "conditions",
    "notes",
    "source"
];

function makeCompletion(label, kind, detail) {
    const item = new vscode.CompletionItem(label, kind);

    if (detail) {
        item.detail = detail;
    }

    return item;
}

function insideChemqlExpression(text) {
    const open = text.lastIndexOf("{{");
    const close = text.lastIndexOf("}}");

    return open > close;
}

function getCompletions(document, position) {
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.slice(0, position.character);

    let text = beforeCursor;

    // {{ ... }} contains Chemql syntax.
    if (insideChemqlExpression(beforeCursor)) {
        text = beforeCursor.slice(
            beforeCursor.lastIndexOf("{{") + 2
        );
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    const trailingSpace = Boolean(text && /\s$/.test(text));
    const current = trailingSpace || words.length === 0 ? "" : words[words.length - 1];
    const commandWords = trailingSpace ? words : words.slice(0, -1);

    if (commandWords.length === 0) {
        return COMMANDS.map(command =>
            command.toLowerCase().startsWith(current.toLowerCase()) && makeCompletion(
                command,
                vscode.CompletionItemKind.Keyword,
                "Chemql command"
            )
        ).filter(Boolean);
    }

    const command = commandWords[0];

    if (commandWords.length === 1) {
        let suggestions = [];

        if (command === "search" || command === "source") {
            suggestions = SOURCES.map(source =>
                makeCompletion(source, vscode.CompletionItemKind.Module, "Data source")
            );
        } else if (command === "set") {
            suggestions = ["temperature", "pressure", "catalysts"].map(setting =>
                makeCompletion(setting, vscode.CompletionItemKind.Field, "Reaction setting")
            );
        } else if (command === "add" || command === "remove") {
            suggestions = [makeCompletion("catalyst", vscode.CompletionItemKind.Field, "Reaction setting")];
        }

        return suggestions.filter(item => item.label.toLowerCase().startsWith(current.toLowerCase()));
    }

    if (command === "set" && commandWords.length === 2) {
        const setting = commandWords[1].toLowerCase();
        let suggestions = [];

        if (setting === "temperature") {
            suggestions = ["standard", "room", "0C", "0F", "0K"];
        } else if (setting === "pressure") {
            suggestions = ["standard", "room", "0Pa", "0N/m^2", "0Nm^-2", "0bar"];
        }

        return suggestions
            .filter(value => value.toLowerCase().startsWith(current.toLowerCase()))
            .map(value => makeCompletion(value, vscode.CompletionItemKind.Value, "Reaction condition"));
    }

    if (command === "search" && commandWords.length >= 2) {
        const source = commandWords[1];
        const keys = source === "elements" ? ELEMENT_KEYS
            : source === "molecules" ? MOLECULE_KEYS
                : source === "reactions" ? REACTION_KEYS : [];
        const suggestions = [
            ...keys.map(key => makeCompletion(key, vscode.CompletionItemKind.Field, `${source} property`)),
            ...[...OPERATORS, ...QUERY_OPERATORS].map(operator =>
                makeCompletion(operator, vscode.CompletionItemKind.Operator, "Query operator")
            )
        ];

        return suggestions.filter(item => item.label.toLowerCase().startsWith(current.toLowerCase()));
    }

    return [];
}

function activate(context) {
    const provider =
        vscode.languages.registerCompletionItemProvider(
            { language: "chemql" },
            {
                provideCompletionItems(document, position) {
                    return getCompletions(document, position);
                }
            },
            " ",
            "\t"
        );

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};