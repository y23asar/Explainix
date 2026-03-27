type InputBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InputBox({ value, onChange }: InputBoxProps) {
  return (
    <div className="w-full">
      <label htmlFor="topic" className="mb-2 block text-sm font-medium text-gray-200">
        Topic
      </label>
      <input
        id="topic"
        type="text"
        placeholder="Enter a topic (e.g., Neural Networks)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-gray-100 shadow-glow outline-none transition placeholder:text-gray-400 focus:border-indigo-400/70 focus:bg-white/10 sm:text-base"
      />
    </div>
  );
}
