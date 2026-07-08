import logo from "../assets/image.svg";
import "./css/Footer.css";

function Footer() {
  const utilityLinks = [
    { label: "오시는 길", href: "#footer-location" },
    { label: "관련 기관 웹사이트", href: "#related-site" },
    { label: "공지사항", href: "/notice" },
    { label: "소셜 채널", href: "#social-channel" },
  ];

  const policyLinks = [
    { label: "개인정보 처리방침", href: "#privacy-policy", primary: true },
    { label: "웹 접근성 정책", href: "#accessibility-policy" },
    { label: "저작권 정책", href: "#copyright-policy" },
    { label: "이용약관", href: "#terms" },
  ];

  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__identity">
            <img className="footer__logo" src={logo} alt="이음 서비스 로고" />

            <div>
              <h2 id="footer-title" className="footer__brand">
                이음
              </h2>
              <p className="footer__description">
                소상공인을 위한 식자재 관리 플랫폼
              </p>
            </div>
          </div>

          <address className="footer__contact">
            <span>팀명: 어울림</span>
            <span>팀원: 진종환, 차영훈, 최정락, 김재혁, 최동석</span>
            <span>jongtest845@gmail.com</span>
          </address>

          <nav className="footer__utility" aria-label="유틸리티 링크">
            {utilityLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <nav className="footer__policy" aria-label="정책 링크">
          {policyLinks.map((link) => (
            <a
              key={link.label}
              className={link.primary ? "footer__policy-link--primary" : ""}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="footer__copyright">
          © 2026 EUM Service. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
