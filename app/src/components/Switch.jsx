import { X, Check } from "lucide-react";

const Switch = ({
  isOn,
  handleToggle,
  onColor,
  offColor,
  onLabel,
  offLabel,
}) => {
  return (
    <div className="flex items-center">
      <span className={`mr-2 ${isOn ? "text-gray-500" : "text-black"}`}>
        {offLabel}
      </span>
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
          isOn ? onColor : offColor
        }`}
        onClick={handleToggle}
      >
        <div
          className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            isOn ? "translate-x-6" : ""
          }`}
        >
          {isOn ? <Check size={16} /> : <X size={16} />}
        </div>
      </div>
      <span className={`ml-2 ${isOn ? "text-black" : "text-gray-500"}`}>
        {onLabel}
      </span>
    </div>
  );
};

export default Switch;
