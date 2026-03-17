import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { FaDiceOne, FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive, FaDiceSix } from 'react-icons/fa';

export interface DiceRollerRef {
  triggerRoll: () => void;
}

interface DiceRollerProps {
  onRollComplete: (rolledValue: number) => void;
  initialValue?: number | null;
  disabled?: boolean;
}

const DiceRoller = forwardRef<DiceRollerRef, DiceRollerProps>(
  ({ onRollComplete, initialValue = 1, disabled = false }, ref) => {
    const [isActuallyRolling, setIsActuallyRolling] = useState(false);
    const [isPopping, setIsPopping] = useState(false); // For bot update visual
    const [currentDisplayValue, setCurrentDisplayValue] = useState<number>(initialValue ?? 1);
    const tumbleIntervalRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      triggerRoll: () => {
        if (isActuallyRolling || disabled) return;

        setIsActuallyRolling(true);

        // Start tumbling animation: change number every 80ms
        if (tumbleIntervalRef.current) clearInterval(tumbleIntervalRef.current);
        tumbleIntervalRef.current = window.setInterval(() => {
          setCurrentDisplayValue(Math.floor(Math.random() * 6) + 1);
        }, 80);

        // Determine final value (the "real" roll)
        const finalValue = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
          if (tumbleIntervalRef.current) {
            clearInterval(tumbleIntervalRef.current);
            tumbleIntervalRef.current = null;
          }
          setCurrentDisplayValue(finalValue);
          onRollComplete(finalValue);
          setIsActuallyRolling(false);
        }, 1000); // Animation duration
      },
    }));

    useEffect(() => {
      return () => {
        if (tumbleIntervalRef.current) clearInterval(tumbleIntervalRef.current);
      };
    }, []);

    // Update display if initialValue prop changes externally and not rolling (e.g., Bot Move)
    useEffect(() => {
      if (!isActuallyRolling && initialValue !== null && initialValue !== undefined) {
        setCurrentDisplayValue(initialValue);
        // Trigger a visual "Pop" to show the bot played
        setIsPopping(true);
        const timer = setTimeout(() => setIsPopping(false), 400);
        return () => clearTimeout(timer);
      }
    }, [initialValue, isActuallyRolling]);

    const handleClick = () => {
      if (isActuallyRolling || disabled) return;
      // Trigger via the ref logic to keep it consistent, but here we just replicate strictly for click
      setIsActuallyRolling(true);

      if (tumbleIntervalRef.current) clearInterval(tumbleIntervalRef.current);
      tumbleIntervalRef.current = window.setInterval(() => {
        setCurrentDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);

      const finalValue = Math.floor(Math.random() * 6) + 1;
      setTimeout(() => {
        if (tumbleIntervalRef.current) {
          clearInterval(tumbleIntervalRef.current);
          tumbleIntervalRef.current = null;
        }
        setCurrentDisplayValue(finalValue);
        onRollComplete(finalValue);
        setIsActuallyRolling(false);
      }, 1000);
    };

    const renderDiceIcon = () => {
      const iconProps = { className: "drop-shadow-md" };
      switch (currentDisplayValue) {
        case 1: return <FaDiceOne {...iconProps} />;
        case 2: return <FaDiceTwo {...iconProps} />;
        case 3: return <FaDiceThree {...iconProps} />;
        case 4: return <FaDiceFour {...iconProps} />;
        case 5: return <FaDiceFive {...iconProps} />;
        case 6: return <FaDiceSix {...iconProps} />;
        default: return <FaDiceOne {...iconProps} />;
      }
    };

    return (
      <div
        className={`dice ${isActuallyRolling ? 'rolling' : ''} ${isPopping ? 'pop' : ''} text-orange-500`}
        style={{ fontSize: '7rem', lineHeight: 1, display: 'inline-flex' }}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Dice, current value ${currentDisplayValue}. Click to roll.`}
        aria-disabled={disabled}
      >
        {renderDiceIcon()}
      </div>
    );
  }
);

export default DiceRoller;
