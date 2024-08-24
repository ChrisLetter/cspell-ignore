local cspell_path

local function ignore_word()
  -- getting the word under the cursor
  local word_to_ignore = vim.fn.expand("<cword>")

  if not word_to_ignore or word_to_ignore == "" then
    error("cspell ignore - cannot determine word to ignore")
    return
  end

  local current_dir = debug.getinfo(1, "S").source:sub(2):match(".*/")

  -- checking if the ignore list file exists and if not, create it
  local file = io.open(current_dir .. "../ignore-list.txt", "a")
  if file == nil then
    file = assert(io.open(current_dir .. "../ignore-list.txt", "w"))
    file:write("")
  end

  print("cspell ignore - adding word to dictionary: " .. word_to_ignore)

  file:write(word_to_ignore .. "\n")
  file:close()

  os.execute("node " .. current_dir .. "../src/update-cspell-config.mjs" .. " " .. cspell_path)
end

local function setup(config)
  if not config.cspell_path then
    error("cspell-ignore - please provide the path to the cspell configuration file")
  else
    cspell_path = config.cspell_path
  end

  vim.api.nvim_create_user_command("CspellIgnore", ignore_word, {})
end

return { setup = setup, ignore = ignore_word }
