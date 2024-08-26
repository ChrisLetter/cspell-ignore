# Cspell Ignore

This plugin provides a quick way to add words to the cspell ignore list. This is useful when you are using a linter that doesn't support code actions (like `nvim-lint`) and you don't want your editor to be bloated with cspell errors.

## Requirements

- nodejs > 20 installed on your machine

## Installation and configuration

Example of installation using lazy.nvim

```lua
{
    'ChrisLetter/cspell-ignore',
    event = { 'VeryLazy' },
    config = function()
      require('cspell-ignore').setup { cspell_path = '~/cspell.json' }

      vim.keymap.set({ 'n', 'v' }, '<leader>ci', require('cspell-ignore').ignore, { desc = '[C]spell [I]gnore' })
    end,
  },
```

In the setup function, you need to pass the path to the cspell configuration file (only the JSON variant is supported at the moment).

## Usage

The plugin will add the word under the cursor to the cspell ignore list. You can use the `:CspellIgnore` command, or you can define a keymap as shown in the example above.

