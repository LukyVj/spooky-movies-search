import cx from "classnames";

import {
  useClearRefinements,
  useRefinementList,
  type UseRefinementListProps,
} from "react-instantsearch";

type CustomRefinementListProps = UseRefinementListProps & {
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
};

const CustomRefinementList = ({
  onChange,
  placeholder,
  ...props
}: CustomRefinementListProps) => {
  const { items, refine } = useRefinementList(props);
  const { refine: clear } = useClearRefinements({
    includedAttributes: [props.attribute],
  });

  return (
    <div className="relative z-10 h-full px-4 border-l-4 border-red-700 group">
      <span className="sr-only">{props.attribute}</span>
      <ul
        id="genres"
        className="block w-full h-12 text-base border-red-700 focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm rounded-md bg-transparent"
      >
        <li className="w-full h-full flex justify-center items-center pb-2 text-center">
          <h3 className="text-xl font-medium text-gray-100 text-center">
            {placeholder}
          </h3>
        </li>
        {items.map((item) => (
          <li
            key={item.label}
            value={item.label}
            className={cx(
              " text-gray-100 hover:bg-red-700 hover:text-white cursor-pointer hidden group-hover:block bg-black/40",
              item.isRefined ? "bg-red-700" : ""
            )}
            style={{
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))",
            }}
          >
            <button
              className="p-2"
              onClick={(event) => {
                const { innerText: value } = event.target as HTMLButtonElement;

                if (value) {
                  refine(value);
                } else {
                  clear();
                }
                onChange?.(event as any);
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomRefinementList;
