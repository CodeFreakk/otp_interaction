import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const HERO_IMAGE_SRC = "/hero-image.png";

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic relative shrink-0 text-left w-full" data-name="Title">
      <p className="css-4hzbpn font-['Gooper',sans-serif] font-bold leading-[32px] min-w-full relative shrink-0 text-[#171717] text-[22px] w-[min-content] text-left" style={{ fontFeatureSettings: "'calt' 0, 'liga' 0" }}>
        Confirm your account
      </p>
      <p className="css-4hzbpn font-['Inter',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#5c5c5c] text-[15px] tracking-[0.1px] w-full max-w-[274px] text-left" style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}>
        Kindly enter 6 digits code we've sent to {'{user.emailaddress}'}
      </p>
    </div>
  );
}

function Password({ value, onChange, onKeyDown, inputRef, disabled }: { 
  value: string; 
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}) {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-[42px] h-[44px]" data-name="Password">
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit]">
        {disabled ? (
          <p className="css-ew64yg font-['IBM Plex Sans',sans-serif] leading-[20px] not-italic shrink-0 text-[#c8c8c8] text-[14px] tracking-[0.3px] px-[14px] py-[12px]" style={{ fontWeight: 550 }}>0</p>
        ) : (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="css-ew64yg font-['IBM Plex Sans',sans-serif] leading-[20px] not-italic text-center shrink-0 text-[#737373] text-[14px] tracking-[0.3px] w-full h-full bg-transparent border-none outline-none placeholder:text-[#c8c8c8] px-[14px] py-[12px] placeholder:font-normal"
            style={{ fontWeight: value ? 550 : 400 }}
            placeholder="0"
          />
        )}
      </div>
      <div aria-hidden="true" className="absolute border border-[#ebebeb] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]" />
    </div>
  );
}

function Frame({ onValidation, disabled }: { onValidation: (isValid: boolean) => void; disabled?: boolean }) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [shake, setShake] = useState(false);
  const { trigger: triggerHaptic } = useWebHaptics({ debug: true });

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all 6 digits are filled
    if (index === 5 && value) {
      const enteredCode = [...newCode.slice(0, 5), value].join("");
      validateCode(enteredCode);
    }
  };

  const validateCode = (enteredCode: string) => {
    if (enteredCode === "512002") {
      // Correct code - success haptic feedback
      triggerHaptic?.("success");
      onValidation(true);
      console.log("Correct code!");
    } else {
      // Wrong code - trigger haptic error feedback and shake
      triggerHaptic?.("error");
      onValidation(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      // Clear inputs after 2 seconds
      setTimeout(() => {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 2000);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`content-stretch flex gap-[10px] items-center relative shrink-0 ${shake ? 'animate-shake' : ''}`}>
      {code.map((digit, i) => (
        <Password 
          key={i} 
          value={digit}
          onChange={(value) => handleChange(i, value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputRef={(el) => {
            inputRefs.current[i] = el;
            return { current: el } as React.RefObject<HTMLInputElement>;
          }}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function Password1({ onValidation, disabled }: { onValidation: (isValid: boolean) => void; disabled?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="password">
      <Frame onValidation={onValidation} disabled={disabled} />
    </div>
  );
}

function OtPs() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!showSuccess) return;

    const dotsTimer = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(dotsTimer);
  }, [showSuccess]);

  const handleResendClick = () => {
    setCountdown(30); // 30 seconds
    setShowError(false);
  };

  const handleValidation = (isValid: boolean) => {
    if (!isValid) {
      setShowError(true);
      // Hide error after 2 seconds
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    } else {
      setShowSuccess(true);
      setShowError(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full text-left" data-name="OTPs">
      <Password1 onValidation={handleValidation} disabled={showSuccess} />
      {showSuccess ? (
        <p className="css-ew64yg font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#239954] text-[14px] tracking-[0.1px]" style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}>
          All good, Redirecting{'.'.repeat(dots)}
        </p>
      ) : showError ? (
        <p className="css-ew64yg font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[red] tracking-[0.1px]" style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}>
          Incorrect code, Please try again
        </p>
      ) : (
        <p className="css-4hzbpn flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[0] min-h-px min-w-full not-italic relative text-[#525252] text-[14px] tracking-[0.1px] w-[min-content]" style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}>
          <span className="leading-[20px]">Didn't get code?</span>
          {countdown !== null && countdown > 0 ? (
            <span className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[#d97706]">{` ${formatTime(countdown)}`}</span>
          ) : (
            <span 
              className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[#d97706] cursor-pointer"
              onClick={handleResendClick}
            >{` Resend code`}</span>
          )}
        </p>
      )}
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative md:absolute content-stretch flex flex-col gap-8 md:gap-[52px] items-start w-full max-w-[312px] px-4 py-6 md:p-0 md:left-[222px] md:top-[264px] md:w-[312px] md:max-w-[312px] -translate-y-[50px] min-[426px]:-translate-y-[80px] md:translate-y-0">
      <Title />
      <OtPs />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute bg-[#fcfcfc] h-full min-h-[100dvh] md:min-h-0 md:h-[884px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-clip rounded-none md:rounded-[16px] flex flex-col justify-center md:justify-start items-center shadow-[0px_0px_0px_1px_rgba(183,83,16,0.04),0px_1px_1px_0.5px_rgba(183,83,16,0.04),0px_3px_3px_-1.5px_rgba(183,83,16,0.02),0px_6px_6px_-3px_rgba(183,83,16,0.04),0px_12px_12px_-6px_rgba(183,83,16,0.04),0px_24px_24px_-12px_rgba(183,83,16,0.04),0px_48px_48px_-24px_rgba(183,83,16,0.04)] w-[calc(100%-20px)] max-w-[836px] md:left-[calc(50%-294px)] md:w-[836px]" data-name="Content">
      <Frame1 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_-0.5px_rgba(183,83,16,0.06)]" />
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute h-[1052px] left-[calc(50%+0.11px)] rounded-[19.041px] shadow-[0px_0px_0px_1.19px_rgba(183,83,16,0.04),0px_1.19px_1.19px_0.595px_rgba(183,83,16,0.04),0px_3.57px_3.57px_-1.785px_rgba(183,83,16,0.02),0px_7.14px_7.14px_-3.57px_rgba(183,83,16,0.04),0px_14.281px_14.281px_-7.14px_rgba(183,83,16,0.04),0px_28.561px_28.561px_-14.281px_rgba(183,83,16,0.04),0px_57.122px_57.122px_-28.561px_rgba(183,83,16,0.04)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[690.226px]" data-name="Content">
      <div aria-hidden="true" className="absolute inset-0 rounded-[19.041px]">
        <div className="absolute bg-white inset-0 rounded-[19.041px]" />
        <ImageWithFallback
          alt="Person holding gift boxes"
          className="absolute max-w-none object-cover rounded-[19.041px] size-full"
          src={HERO_IMAGE_SRC}
        />
      </div>
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-1.19px_1.19px_-0.595px_rgba(183,83,16,0.06)]" />
    </div>
  );
}

function Content2() {
  return (
    <div className="hidden md:block absolute h-[884px] left-[calc(50%+422px)] overflow-clip pointer-events-none rounded-[16px] shadow-[0px_0px_0px_1px_rgba(183,83,16,0.04),0px_1px_1px_0.5px_rgba(183,83,16,0.04),0px_3px_3px_-1.5px_rgba(183,83,16,0.02),0px_6px_6px_-3px_rgba(183,83,16,0.04),0px_12px_12px_-6px_rgba(183,83,16,0.04),0px_24px_24px_-12px_rgba(183,83,16,0.04),0px_48px_48px_-24px_rgba(183,83,16,0.04)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[580px]" data-name="Content">
      <Content1 />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-1px_1px_-0.5px_rgba(183,83,16,0.06)]" />
    </div>
  );
}

export default function ConfirmYourAccount() {
  useEffect(() => {
    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
    if (isMobile()) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
        document.documentElement.style.overflow = '';
      };
    }
  }, []);

  return (
    <div className="relative size-full min-h-[100dvh] min-w-full h-[100dvh] overflow-hidden md:overflow-visible md:h-auto" data-name="confirm your account" style={{ backgroundImage: "linear-gradient(rgb(202, 95, 22) 0%, rgb(220, 104, 24) 25%, rgb(233, 125, 53) 50%, rgb(241, 172, 126) 75%, rgb(249, 220, 200) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Content />
      <Content2 />
    </div>
  );
}