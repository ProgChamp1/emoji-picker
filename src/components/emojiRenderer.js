const hasCopy = navigator.clipboard ? 1 : 0;
const copy = hasCopy
  ? ({ target }) => {
      navigator.clipboard.writeText(target.textContent);
    }
  : ({ target }) => {
      const textArea = document.createElement("textarea");
      textArea.value = target.textContent;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
      } catch (err) {}

      document.body.removeChild(textArea);
    };
export function emojiRenderer(emojiData) {
  const em = emojiData.emoji;
  return (
    <button
      class="emoji-result hoverable"
      aria-label={em}
      onClick={copy}
    >
      {em}
    </button>
  );
}
