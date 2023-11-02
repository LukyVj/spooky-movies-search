import {
  useRefinementList,
  type UseRefinementListProps,
} from "react-instantsearch";

const CustomRefinementList = (
  props: UseRefinementListProps & {
    onChange: (e: any) => void;
    placeholder: string;
  }
) => {
  const { items, refine } = useRefinementList(props);

  const { onChange, placeholder }: any = props;

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
        onChange={(e) => {
          refine(e.target.value);
          onChange(e);
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
