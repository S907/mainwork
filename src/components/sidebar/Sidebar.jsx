import './sideBar.scss'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DnsIcon from '@mui/icons-material/Dns';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import Person3Icon from '@mui/icons-material/Person3';
import LogoutIcon from '@mui/icons-material/Logout';
import { FaDocker } from 'react-icons/fa';
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="top">
            <span className="logo"> <FaDocker className='doc_icon' /> Logo </span>
        </div>
        <hr />
        <div className="center">
            <ul>
                <p className="title">MAIN</p>
                <li>
                <SpaceDashboardIcon className='icon' />
                    <span>Dashboard</span>
                </li>
                <li>
                <PeopleIcon className='icon' />
                    <span>Users</span>
                </li>
                <p className="title">Services</p>
                <li>
                <AnalyticsIcon className='icon' />  
                    <span>Analytics</span>
                </li>
                <li>
                <DnsIcon className='icon' />
                    <span>System health</span>
                </li>
                <li>
                <NotificationsActiveIcon className='icon' />
                    <span>Notifications</span>
                </li>
                <p className="title">User</p>
                <li>
                <SettingsIcon className='icon' />
                    <span>Settings</span>
                </li>
                <li>
                <Person3Icon className='icon' />
                    <span>Profile</span>
                </li>
                <li>
                <LogoutIcon className='icon' />
                    <span>Logout</span>
                </li>
            
            </ul>
        </div>
        <div className="bottom">
            <div className="colorOption"></div>
            <div className="colorOption"></div>
            <div className="colorOption"></div>
        </div>
    </div>
  )
}

export default Sidebar