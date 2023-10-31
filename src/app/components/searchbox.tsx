import exp from "constants";
import React, { useState, useRef } from "react";
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";

function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div className="absolute z-20 flex w-full items-center justify-center -top-6">
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery("");

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search for products"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          autoFocus
        />
        <button type="submit">Submit</button>
        <button
          type="reset"
          hidden={inputValue.length === 0 || isSearchStalled}
        >
          Reset
        </button>
        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  );
}

export default CustomSearchBox;
