import { useRef } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  prefix?: string;
}

function formatIDR(num: number): string {
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function CurrencyInput({ value, onChange, placeholder = '0', className = '', prefix }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    const num = parseInt(digits, 10);
    onChange(isNaN(num) ? 0 : num);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && value > 0) {
      const digits = String(value);
      const next = digits.slice(0, -1);
      onChange(next.length > 0 ? parseInt(next, 10) : 0);
      e.preventDefault();
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {prefix && <span className="shrink-0 text-sm text-gray-500">{prefix}</span>}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={formatIDR(value)}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
      />
    </div>
  );
}
