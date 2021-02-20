import {
  AsyncComponent,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "@hydrophobefireman/ui-lib";

import { EmojiSearch } from "./EmojiSearch";
import { emojiRenderer } from "./emojiRenderer";
import { clean, contains } from "../util/search";
import keys from "@hydrophobefireman/j-utils/@build-modern/src/modules/Object/keys";
import FakeSet from "@hydrophobefireman/j-utils/@build-modern/src/modules/es6/loose/Set/index";
import { loadEmojis, supportsEmoji } from "../util/load_emoji";
const req = window.requestAnimationFrame || ((e) => setTimeout(e, 16));
/**
 *
 * @param {{emojis:Record<string,Array<{
    emoji: string;
    searchBy: string;

}>>}} param0
 */
function Picker({ emojis }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Smileys & Emotion");
  const cleanedSearch = clean(search);
  const handleButtonClick = useCallback(
    (e) => setCategory(e.target.dataset.emojicat),
    []
  );

  const unfilteredData = useMemo(() => emojis[category], [category]);
  const [filtered, setFiltered] = useState(unfilteredData);

  useEffect(
    () =>
      setFiltered(
        unfilteredData.filter((x) =>
          [x.emoji, x.searchBy].some((x) => contains(x, cleanedSearch))
        )
      ),
    [cleanedSearch, unfilteredData]
  );

  const asyncSearch = useCallback((e) => req(() => setSearch(e)));

  return (
    <div class="emoji-box">
      <section data-section="emoji-search" aria-label="emoji-search">
        <EmojiSearch onInput={asyncSearch} />
      </section>
      <section data-section="emoji-category" aria-label="emoji-category">
        {keys(emojis).map((x) => (
          <button
            onClick={handleButtonClick}
            data-emojicat={x}
            aria-label={x}
            title={x}
            class={
              "hoverable emoji-category-select" +
              (category === x ? " selected" : "")
            }
          >
            {emojis[x][0].emoji}
          </button>
        ))}
      </section>
      <section data-section="emoji-renderer" aria-label="emoji-renderer">
        <div class="emoji-renderer-wrap">{filtered.map(emojiRenderer)}</div>
      </section>
    </div>
  );
}

export default function () {
  return (
    <AsyncComponent
      fallback="Loading emojis.."
      promise={() =>
        loadEmojis().then((emojis) => (
          <Picker
            emojis={emojis.reduce((emoji, curr) => {
              const cat = curr.category;
              (emoji[cat] || (emoji[cat] = [])).push({
                  emoji: curr.emoji,
                  searchBy: clean(
                    Array.from(
                      new FakeSet(
                        [].concat(curr.description.split(" "), curr.tags)
                      )
                    ).join("")
                  ),
                });
              return emoji;
            }, {})}
          />
        ))
      }
    />
  );
}
