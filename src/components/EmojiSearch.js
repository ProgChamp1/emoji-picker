import { useState, useCallback } from "@hydrophobefireman/ui-lib";

export function EmojiSearch({ onInput }) {
  const [value, setValue] = useState("");
  const setInput = useCallback((e) => {
    const val = e.target.value;
    setValue(val);
    onInput(val);
  }, []);
  return (
    <div class="search-box">
      <input
        id="___emoji_search"
        class="search-emoji"
        placeholder="Search"
        value={value}
        onInput={setInput}
        type="search"
        enterkeyhint="search"
        autocapitalize="none"
        autocomplete="off"
        spellcheck="true"
        aria-label="Search"
      />
      <label for="___emoji_search" class="sr-only">
        Search
      </label>
    </div>
  );
}
