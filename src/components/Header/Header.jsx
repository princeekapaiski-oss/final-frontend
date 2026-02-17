import "./Header.css";

function Header({ title, onBack }) {
  return (
    <div className="header">
        <div className="header-left">
            <img src="/icons/smile_mini.svg" alt="" />
            <img src="/icons/pickaxe_mini.svg" alt="" />
        </div>

        <div className="header-right">
          <img src="/icons/ufo_mini.svg" alt="" />
        </div>

       {onBack && (
        <button className="header-back" onClick={onBack}>
          ←
        </button>
      )}

    </div>
  );
}

export default Header;
