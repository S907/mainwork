import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Widget from '../../components/widgets/Widget'
import './home.scss'

const Home = () => {
  return (
    <div className='home'>
        {/* <h1 className='title'>Dashboard Implementation</h1> */}
        <Sidebar />
        <div className="homeContainer">
            <Navbar />
            <div className="widgets">
            <Widget />
            <Widget />
            <Widget />
            <Widget />
            </div>
        </div>
    </div>
  )
}

export default Home