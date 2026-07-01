import {Link} from 'react-router';
import List from './List';
import logo from '../assets/image.svg';

function Sidebar() {
  const list = ['식자재 입력', '메뉴 입력', '식자재 조회', '메뉴조회'];
  const router = [
    '/addfoodmaterials',
    '/addmenu',
    '/foodmaterials',
    '/menulist',
  ];

  return (
    <div>
      <img src={logo} alt="logo" style={{width: '300px', height: '300px'}} />
      {list.map((item, idx) => (
        <Link to={router[idx]} key={idx}>
          <List item={item} />
        </Link>
      ))}
    </div>
  );
}
export default Sidebar;

//
