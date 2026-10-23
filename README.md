# ChemQL Language Support for VS Code

Modern syntax highlighting, language configuration, IntelliSense completions, and snippets for the ChemQL language.

## Features

- Syntax highlighting for ChemQL commands, query operators, data sources, property names, strings, numbers, comments, declarations, and control flow.
- Embedded Python highlighting in `[ ... ]` and `[[[ ... ]]]` blocks (uses the Python grammar when the Python extension is installed).
- ChemQL query highlighting inside `{{ ... }}` expressions.
- Completion suggestions for common commands, data sources, element/molecule/reaction fields, and query operators.
- Snippets for queries, reaction balancing, Python blocks, control-flow blocks, namespaces, structs, and constants.
- `.chemql` and `.cql` file associations.
- Bracket matching and auto-closing pairs.

## Getting started

1. Install the extension VSIX or open this repository in VS Code.
2. Open a `.chemql` or `.cql` file.
3. If you are developing the extension, press `F5` to launch an Extension Development Host.
4. Type a ChemQL command and press `Ctrl+Space` to inspect completions.

## Example

```chemql
search elements symbol = "O" return name, atomic_mass
search reactions name like "methane*" return name, equation

let result = {{search molecules formula = "H2O" return name}}

if True
    print("Hello ChemQL")
endif
```

## Notes

- This extension provides editor language features; it does not bundle the ChemQL runtime.
- Embedded Python syntax coloring relies on VS Code's Python grammar being available.
- TextMate grammars are tokenizer-based, so they cannot fully parse arbitrary nested delimiters or validate ChemQL programs.

## Development

```sh
npm install
npm install --save-dev @vscode/vsce
npx vsce package
```

The resulting `.vsix` can be installed with:

```sh
code --install-extension chemql-0.1.0.vsix
```

## License

MIT
