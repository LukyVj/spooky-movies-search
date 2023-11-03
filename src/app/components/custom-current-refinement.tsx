import cx from "classnames";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";
import {
  useCurrentRefinements,
  UseCurrentRefinementsProps,
} from "react-instantsearch";

const CustomCurrentRefinements = (props: UseCurrentRefinementsProps) => {
  const { items, refine } = useCurrentRefinements(props);

  const tagColor = (label: string) => {
    switch (label) {
      case "genres":
        return "bg-blue-500/20 white";
      case "release_year":
        return "bg-green-500/20 white";
      case "director":
        return "bg-yellow-500/20 white";
      case "actor":
        return "bg-purple-500/20 white";
      default:
        return "bg-red-500/20 white";
    }
  };

  return (
    <ul className="flex py-4 px-8">
      {items.map((item) => (
        <li key={[item.indexName, item.label].join("/")}>
          {/* <span>{item.label}:</span> */}
          {item.refinements.map((refinement) => (
            <span
              key={refinement.label}
              className={cx(
                "inline-flex items-center rounded-md px-2 py-1 mr-2 text-xs font-medium ring-1 ring-inset ring-red-600/10",
                tagColor(item.label)
              )}
            >
              <span>{refinement.label}</span>
              <button
                type="button"
                onClick={(event) => {
                  if (isModifierClick(event)) {
                    return;
                  }

                  refine(refinement);
                }}
              >
                <XMarkIcon className="h-4 w-4 ml-2" aria-hidden="true" />
              </button>
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
};

function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

export default CustomCurrentRefinements;
