import "./index.css";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Add CountUp animation hook
function useCountUp(end, duration = 0.2) {
  const [count, setCount] = useState(0);
  const previousEnd = useRef(end);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const startValue = previousEnd.current;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(
        (currentTime - startTime) / (duration * 1000),
        1
      );

      const currentCount = progress * (end - startValue) + startValue;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animation);
      }
    };

    animationFrame = requestAnimationFrame(animation);
    previousEnd.current = end;

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
}

// Add AnimatedNumber component
function AnimatedNumber({ value }) {
  const animatedValue = useCountUp(parseFloat(value) || 0);
  return animatedValue.toFixed(2);
}

export default function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState({
    value: "USD",
    label: "USD",
    flag: "🇺🇸",
    symbol: "$"
  });
  const [toCurrency, setToCurrency] = useState({
    value: "EUR",
    label: "EUR",
    flag: "🇪🇺",
    symbol: "€"
  });
  const [convertedAmount, setConvertedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // Available currencies for each dropdown
  const getAvailableOptions = (excludeCurrency) => {
    return currencyOptions.filter(
      (option) => option.value !== excludeCurrency?.value
    );
  };

  const currencyOptions = [
    { value: "USD", label: "USD", flag: "🇺🇸", symbol: "$" },
    { value: "EUR", label: "EUR", flag: "🇪🇺", symbol: "€" },
    { value: "GBP", label: "GBP", flag: "🇬🇧", symbol: "£" },
    { value: "JPY", label: "JPY", flag: "🇯🇵", symbol: "¥" },
    { value: "CAD", label: "CAD", flag: "🇨🇦", symbol: "$" },
    { value: "AUD", label: "AUD", flag: "🇦🇺", symbol: "$" },
  ];

  const convertCurrency = async () => {
    if (!amount) {
      setConvertedAmount("0.00");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency.value}&to=${toCurrency.value}`
      );
      const data = await response.json();
      setConvertedAmount(data.rates[toCurrency.value].toFixed(2));
    } catch (error) {
      console.error("Error converting currency:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handelValueCopy = () => {
    navigator.clipboard.writeText(convertedAmount);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 600);
  };

  return (
    <div className="bg-zinc-100 min-h-screen flex items-center justify-center">
      <div className="max-w-screen-md mx-auto mt-10 flex flex-col items-center gap-2">
        <h1 className="text-4xl font-medium text-black mb-8">CCurrency</h1>
        <div className="p-2 rounded-3xl flex flex-col gap-3 border-2 border-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
          <Card>
            <p className="text-gray-500 text-sm">Amount</p>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1 min-w-4 pb-1">
                <span className="text-gray-500">{fromCurrency.symbol}</span>
              </div>
              <div className="flex-1">
                <Input
                  value={amount}
                  onChange={setAmount}
                  setAmount={setAmount}
                />
              </div>
              <CustomSelect
                options={getAvailableOptions(toCurrency)}
                value={fromCurrency}
                onChange={setFromCurrency}
                position="top"
              />
            </div>
          </Card>
          <Card>
            <p className="text-gray-500 text-sm">Converted to</p>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1 min-w-4 pb-1">
                <span className="text-gray-500">{toCurrency.symbol}</span>
              </div>
              <div 
                onClick={handelValueCopy}
                className="flex-1 bg-transparent outline-none text-2xl font-medium cursor-pointer m-0 p-0"
              >
                <AnimatedNumber value={convertedAmount || "0.00"} />
              </div>
              <CustomSelect
                options={getAvailableOptions(fromCurrency)}
                value={toCurrency}
                onChange={setToCurrency}
                position="bottom"
              />
            </div>
          </Card>
          <SwapButton
            onClick={handleSwap}
            isLoading={isLoading}
            isCopied={isCopied}
          />
        </div>
      </div>
    </div>
  );
}

function Input({ value, onChange, readonly = false, setAmount }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputRef.current) {
        return;
      }
      if (e.code === "Enter") {
        inputRef.current.focus();
        setAmount("");
      }
    }

    inputRef.current.focus();

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [setAmount]);

  return (
    <div className="rounded-md select-none">
      <input
        type="text"
        value={value}
        ref={inputRef}
        onChange={(e) => {
          // Only allow numbers and decimal point
          const val = e.target.value.replace(/[^0-9.]/g, "");
          // Prevent multiple decimal points
          if (val.split(".").length > 2) return;
          onChange(val);
        }}
        readOnly={readonly}
        placeholder="0"
        className="w-full bg-transparent outline-none text-2xl font-medium"
      />
    </div>
  );
}

function CustomSelect({ options, value, onChange, position = "top" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  };

  // Update selected when value changes from parent
  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div className="relative min-w-20" ref={selectRef}>
      {/* Select Button */}
      <button
        className="flex items-center justify-center px-4 py-2 min-w-32 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#a0e870] focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.value}
            className="flex items-center gap-2"
            initial={{ y: position === "top" ? -10 : 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: position === "top" ? 10 : -10, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <span className="text-base">{selected.symbol}</span>
            <span className="text-base font-medium">{selected.label}</span>
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute min-w-32 left-0 right-0 mt-2 bg-white border border-[#a0e870] rounded-2xl shadow-lg z-50 overflow-hidden pt-1 pb-1"
          >
            <div className="max-h-48 overflow-y-auto overflow-x-hidden">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:text-black mx-2 my-1 rounded-xl ${
                    selected.value === option.value
                      ? "bg-gray-200 text-black"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="text-base">{option.symbol}</span>
                  <span className="text-base font-medium">{option.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white">
      {children}
    </div>
  );
}

function SwapButton({ onClick, isLoading, isCopied }) {
  const swapRef = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === swapRef.current) {
        return;
      }
      if (e.code === "Space") {
        onClick();
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [onClick]);

  return (
    <div className="rounded-md select-none">
      <button
        ref={swapRef}
        onClick={onClick}
        className="w-full min-h-18 outline-none text-2xl bg-[#a0e870] py-4 rounded-2xl hover:bg-[#7fcf4c] transition-colors duration-200 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="copied"
              className="flex items-center justify-center gap-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Copied!
            </motion.div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-8 w-5 border-b-2 border-white"></div>
            </div>
          ) : (
            <motion.div
              key="swap"
              className="flex items-center justify-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Swap
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
