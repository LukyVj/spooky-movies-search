import {
  useClearRefinements,
  useRefinementList,
  type UseRefinementListProps,
} from 'react-instantsearch';

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
    <div className="h-full mr-4 pr-4 ml-4 border-r-4 border-red-700">
      <label htmlFor="genres" className="sr-only">
        {props.attribute}
      </label>
      <select
        id="genres"
        name="genres"
        className="block w-full h-12 text-base border-red-700 focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm rounded-md bg-transparent"
        defaultValue={placeholder}
        onChange={(event) => {
          const { value } = event.target;

          if (value) {
            refine(value);
          } else {
            clear();
          }
          onChange?.(event);
        }}
      >
        <option value="" selected>
          {placeholder}
        </option>

        {items.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomRefinementList;
