interface IToggleSwitch {
  id: string;
  setValue: (value: boolean) => void;
  value: boolean;
  disabled?: boolean;
}

export default function ToggleSwitch({
  id,
  setValue,
  value,
  disabled,
}: IToggleSwitch) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        id={id}
        disabled={disabled}
        type="checkbox"
        className="sr-only peer"
        onChange={(e) => setValue(e.target.checked)}
        checked={value}
      />
      <div className="relative md:w-11 w-[46px] h-[26px] md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute md:after:top-[2px] after:top-[3px] after:start-[3px] md:after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-900"></div>
    </label>
  );
}
