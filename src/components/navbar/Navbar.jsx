import './navbar.scss';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MessageIcon from '@mui/icons-material/Message';


const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="wrapper">
            <div className="search">
            <input type='text' placeholder='search' />
            <span>
            <SearchIcon />
            </span>
            </div>
            <div className="items">
                <div className="item">
                <LanguageIcon className='icon' /> 
                English 
                </div>
                <div className="item">
                <DarkModeIcon /> 
                Dark Mode 
                </div>
                <div className="item">
                <MenuIcon className='icon' /> 
                Menu 
                </div>
                <div className="item">
                <SettingsIcon className='icon' />  
                </div>
                <div className="item">
                <MessageIcon className='icon' /> 
                <div className="counter">1</div> 
                </div>
                <div className="item">
                <NotificationsActiveIcon className='icon' /> 
                <div className="counter">1</div> 
                </div>
                <div className="item">
                <img src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" 
                alt="image" 
                className='avatar'
                />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar