import "../App.css";

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function Footer() {
  return (
    <>
      <div className="footer">
        <button onClick={topFunction} id="myBtn" title="Go to top">
          Go to top ↑
        </button>
      </div>
    </>
  );
}

export default Footer;
