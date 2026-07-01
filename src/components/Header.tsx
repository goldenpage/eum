import {Link} from 'react-router';

function Header() {
  return (
    <ul
      style={{
        listStyle: 'none',
        display: 'flex',
        gap: '30px',
      }}
    >
      <li>사용자이름</li>

      <Link to={'/logout'}>
        <li>로그아웃</li>
      </Link>

      <Link to={'/notice'}>
        <li>알림</li>
      </Link>
    </ul>
  );
}

export default Header;
