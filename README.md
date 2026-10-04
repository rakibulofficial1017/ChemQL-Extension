# Chempy Syntax Highlighting

This extension provides robust syntax highlighting and language configuration tools for the **Chempy** chemistry-related scripting language. It accurately replicates the language token rules, turning raw code blocks into vibrantly colored scripts.

## 🌟 Features

* **Complete Token Representation:** Highlights custom variables, constants, commands, and core loop conditions seamlessly.
* **Embedded Python Rendering:** Automatically applies rich, nested Python syntax highlighting directly inside custom evaluation delimiters like `{{ ... }}` blocks and `[ ... ]` arrays.
* **Property Key Recognition:** Accurately targets specific chemical domain indices such as `atomic_mass`, `molecular_weight`, `formula`, `iupac_name`, and individual elemental profiles.
* **Bracket Automation:** Intuitively completes wrapping arrays and bracket pairs like `{{ }}` on the fly to accelerate programming workflows.

## 🧪 Supported Code Constructs

This engine dynamically maps language keys across your workspace files:
* **Control Flows:** `if`, `elif`, `else`, `for`, `while`, `in`, `break`, `continue`, `endblock`
* **Core Commands:** `search`, `from`, `list`, `clear`, `exit`, `return`, `view`, `?`, `help`, `dump`
* **Operators:** Comparison signs (`>=`, `<=`, `=`, `>`, `<`) alongside word operators (`and`, `or`, `has`, `like`, `like!`)
* **Sources:** Distinct styling for built-in registries (`elements`, `molecules`)

## ⚙️ Requirements & Scope

No third-party runtime bundles or underlying engine configurations are required. This utility automatically attaches to any project files matching these active extension layouts:
* `.chem`
* `.chempy`

## 🚀 Getting Started

1. Open any script code block saved under the `.chem` workspace format.
2. Ensure the language identifier in the lower right status tray reads `Chempy`.
3. To view or inspect underlying TextMate token scopes live inside your editor, pull up the Command Palette (`Ctrl+Shift+P`), and execute: `Developer: Inspect Editor Tokens and Scopes`.

## 📝 Release Notes

### 0.0.1
* Initial distribution build.
* Custom TextMate grammar layout mapping for core token categories.
* Automatic bracket pairing and closure mappings configured.
* Multi-language syntax boundaries injection mapping for embedded Python execution trees.
