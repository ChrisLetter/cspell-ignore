local M = {}
local cspell_path

local function ignore_word()
  -- getting the word under the cursor
  local word_to_ignore = vim.fn.expand("<cword>")
  if word_to_ignore == "" then
    print("cspell ignore - cannot determine word to ignore")
    return
  end

  local current_dir = debug.getinfo(1, "S").source:sub(2):match(".*/")

  -- checking if the ignore list file exists and if not, create it
  local file = io.open(current_dir .. "ignore-list.txt", "a")
  if file == nil then
    file = assert(io.open(current_dir .. "ignore-list.txt", "w"))
    file:write("")
  end

  file:write(word_to_ignore .. "\n")
  file:close()

  print("cspell ignore - adding: " .. word_to_ignore)

  if cspell_path then
    os.execute("node " .. current_dir .. "/update-cspell-config.mjs" .. " " .. cspell_path)
  else
    print("cspell ignore - please provide the cspell path")
  end
end

function M.setup(config)
  if not config or not config.cspell_path then
    print("cspell-ignore - please provide the cspell path")
  else
    cspell_path = config.cspell_path
  end

  M.ignore = ignore_word
end

return M
