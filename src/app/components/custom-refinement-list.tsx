import {
  useRefinementList,
  type UseRefinementListProps,
} from "react-instantsearch";

const CustomRefinementList = (props: UseRefinementListProps) => {
  const { items, refine } = useRefinementList(props);

  return (
    <div className="ml-4 border-l-4 border-red-700">
      <label htmlFor="genres" className="sr-only">
        {props.attribute}
      </label>
      <select
        id="genres"
        name="genres"
        className="block w-full pl-3 pr-10 py-2 text-base border-red-700 focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm rounded-md bg-transparent"
        defaultValue={"Year"}
        onChange={(e) => {
          refine(e.target.value);
        }}
      >
        <option value="" selected>
          Year
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
