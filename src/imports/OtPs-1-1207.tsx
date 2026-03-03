function Password() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0" data-name="Password">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[14px] py-[12px] relative rounded-[inherit]">
        <p className="css-ew64yg font-['IBM_Plex_Sans:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#c8c8c8] text-[14px] tracking-[0.3px]">7</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ebebeb] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      {[...Array(6).keys()].map((_, i) => (
        <Password key={i} />
      ))}
    </div>
  );
}

function Password1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="password">
      <Frame />
    </div>
  );
}

export default function OtPs() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative size-full" data-name="OTPs">
      <Password1 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[red] tracking-[0.1px]" style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}>
        Incorrect code, Please try again
      </p>
    </div>
  );
}