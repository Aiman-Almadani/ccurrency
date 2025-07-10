import "./index.css";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState({
    value: "USD",
    label: "USD",
    flag: "🇺🇸",
  });
  const [toCurrency, setToCurrency] = useState({
    value: "EUR",
    label: "EUR",
    flag: "🇪🇺",
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
    { value: "USD", label: "USD", flag: "🇺🇸" },
    { value: "EUR", label: "EUR", flag: "🇪🇺" },
    { value: "GBP", label: "GBP", flag: "🇬🇧" },
    { value: "JPY", label: "JPY", flag: "🇯🇵" },
    { value: "CAD", label: "CAD", flag: "🇨🇦" },
    { value: "AUD", label: "AUD", flag: "🇦🇺" },
  ];

  const convertCurrency = async () => {
    if (!amount) return;

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
            <div className="flex items-center gap-2">
              <Input value={amount} onChange={setAmount} />
              <CustomSelect
                options={getAvailableOptions(toCurrency)}
                value={fromCurrency}
                onChange={setFromCurrency}
              />
            </div>
          </Card>
          <Card>
            <p className="text-gray-500 text-sm">Converted to</p>
            <div className="flex items-center justify-between gap-2 w-full">
              <div
                value={convertedAmount}
                onClick={handelValueCopy}
                className="flex bg-transparent text-2xl font-medium cursor-pointer w-[50%] "
              >
                {convertedAmount ? convertedAmount : "0.00"}
              </div>
              <CustomSelect
                options={getAvailableOptions(fromCurrency)}
                value={toCurrency}
                onChange={setToCurrency}
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

function Input({ value, onChange, readonly = false }) {
  return (
    <div className="rounded-md select-none">
      <input
        type="text"
        value={value}
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

function CustomSelect({ options, value, onChange }) {
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
        <div className="flex items-center gap-2">
          <span className="text-base">{selected.flag}</span>
          <span className="text-base font-medium">{selected.label}</span>
        </div>
        <motion.span
          className="ml-2 text-gray-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        ></motion.span>
      </button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute min-w-32 left-0 right-0 mt-2 bg-white border border-[#a0e870] rounded-2xl shadow-lg z-50 overflow-hidden pt-1"
          >
            <div className="max-h-48 overflow-y-auto overflow-x-hidden">
              {options.map((option, index) => (
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
                  <span className="text-base">{option.flag}</span>
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
  return (
    <div className="rounded-md select-none">
      <button
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
